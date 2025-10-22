(() => {
    "use strict";
    document.addEventListener("click", e => {
        const btn = e.target.closest(".js-phone-authorization");
        if (!btn) return;
        const form = btn.closest(".form");
        const authRow = form?.querySelector(".form__row_authorization");
        if (authRow?.classList.contains("_active")) {
            form.submit();
            return;
        }
        authRow?.classList.add("_active");
        btn.textContent = "Войти";
        btn.type = "submit";
    });
})();
