#!/usr/bin/env python3
"""Local dev server that applies vercel.json rewrites so clean URLs work."""
import http.server, json, os, mimetypes

# Repo root = parent of this file's directory (.claude/), so the server is portable.
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

with open(os.path.join(ROOT, "vercel.json")) as f:
    config = json.load(f)

rewrites = {r["source"].rstrip("/"): r["destination"] for r in config.get("rewrites", [])}

class Handler(http.server.BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        pass  # silence request logs

    def do_GET(self):
        path = self.path.split("?")[0].rstrip("/")
        # apply rewrite
        dest = rewrites.get(path)
        if dest:
            filepath = os.path.join(ROOT, dest.lstrip("/"))
        else:
            # try direct file
            filepath = os.path.join(ROOT, path.lstrip("/"))
            if os.path.isdir(filepath):
                filepath = os.path.join(filepath, "index.html")
            elif not os.path.isfile(filepath) and path:
                # Mirror Vercel's cleanUrls: /foo/ -> foo.html
                # Prerender emits dist/<route>/index.html and Vercel resolves it by
                # directory index, so pages need no vercel.json rewrite. Locally we
                # serve from ROOT, so fall back to the flat <route>.html source file.
                candidate = os.path.join(ROOT, path.lstrip("/") + ".html")
                if os.path.isfile(candidate):
                    filepath = candidate

        if not os.path.isfile(filepath):
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"404 Not Found")
            return

        mime, _ = mimetypes.guess_type(filepath)
        with open(filepath, "rb") as f:
            data = f.read()
        self.send_response(200)
        self.send_header("Content-Type", mime or "application/octet-stream")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

if __name__ == "__main__":
    import sys
    port = int(os.environ.get("PORT") or (sys.argv[1] if len(sys.argv) > 1 else 3001))
    with http.server.HTTPServer(("", port), Handler) as httpd:
        print(f"Serving on http://localhost:{port}")
        httpd.serve_forever()
