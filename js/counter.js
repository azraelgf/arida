(() => {
    "use strict";
    function formQuantity() {
        document.addEventListener("click", function(e) {
            const targetElement = e.target;
            if (targetElement.closest("[data-quantity-plus]") || targetElement.closest("[data-quantity-minus]")) {
                const quantityBlock = targetElement.closest("[data-quantity]");
                const valueElement = quantityBlock.querySelector("[data-quantity-value]");
                let value = parseInt(valueElement.value);
                if (targetElement.hasAttribute("data-quantity-plus")) {
                    value++;
                    if (+valueElement.dataset.quantityMax && +valueElement.dataset.quantityMax < value) value = +valueElement.dataset.quantityMax;
                } else {
                    value--;
                    if (+valueElement.dataset.quantityMin) {
                        if (+valueElement.dataset.quantityMin > value) value = +valueElement.dataset.quantityMin;
                    } else if (value < 1) value = 1;
                }
                valueElement.value = value;
                const productActions = quantityBlock.closest(".product")?.querySelector(".product__actions");
                if (productActions) if (value === 1) productActions.classList.add("_qty-noactive"); else productActions.classList.remove("_qty-noactive");
            }
        });
    }
    formQuantity();
})();
