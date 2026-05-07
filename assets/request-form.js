(function () {
  const forms = document.querySelectorAll(".request-form");

  function getStatus(form) {
    let status = form.querySelector(".request-form__status");
    if (!status) {
      status = document.createElement("p");
      status.className = "request-form__status";
      status.setAttribute("role", "status");
      form.append(status);
    }
    return status;
  }

  function setStatus(form, type, message) {
    const status = getStatus(form);
    status.textContent = message;
    status.dataset.type = type;
  }

  function serialize(form) {
    const data = Object.fromEntries(new FormData(form).entries());
    data.page = window.location.href;
    return data;
  }

  forms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!form.reportValidity()) {
        return;
      }

      const button = form.querySelector(".request-form__submit");
      const originalText = button?.textContent;

      if (button) {
        button.disabled = true;
        button.textContent = "Wird gesendet...";
      }

      setStatus(form, "pending", "Ihre Anfrage wird gesendet.");

      try {
        const response = await fetch(
          "https://srnynewvauzymnljqskj.supabase.co/functions/v1/anfrage",
          {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(serialize(form)),
          }
        );

        if (!response.ok) {
          throw new Error("Request failed");
        }

        form.reset();
        setStatus(
          form,
          "success",
          "Vielen Dank. Ihre Anfrage wurde verschickt und Sie erhalten eine Bestätigung per E-Mail."
        );
        window.dispatchEvent(
          new CustomEvent("herkules:form-submit", {
            detail: {
              page: window.location.href,
            },
          })
        );
      } catch (error) {
        setStatus(
          form,
          "error",
          "Die Anfrage konnte gerade nicht gesendet werden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt per E-Mail."
        );
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = originalText;
        }
      }
    });
  });
})();
