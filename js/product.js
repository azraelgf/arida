(() => {
    "use strict";
    document.addEventListener("click", e => {
        const targetElement = e.target;
        if (targetElement.closest(".product__fav")) {
            if (!targetElement) return;
            targetElement.classList.toggle("_active");
        }
        if (targetElement.closest(".product__btn")) {
            const product = targetElement.closest(".product");
            const productActions = product?.querySelector(".product__actions");
            if (productActions) productActions.classList.remove("_qty-noactive");
        }
    });
})();
