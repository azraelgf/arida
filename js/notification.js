(() => {
    "use strict";
    (function() {
        const AUTO_HIDE_DELAY = 4e3;
        function initCartNotification(el) {
            if (!el) return;
            const btnClose = el.querySelector(".cart-notification__del");
            requestAnimationFrame(() => el.classList.add("is-visible"));
            btnClose?.addEventListener("click", () => hide());
            const timer = setTimeout(() => hide(), AUTO_HIDE_DELAY);
            function hide() {
                clearTimeout(timer);
                el.classList.remove("is-visible");
                el.classList.add("is-hidden");
                setTimeout(() => el.remove(), 300);
            }
        }
        const mo = new MutationObserver(mutations => {
            for (const m of mutations) m.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.classList.contains("cart-notification")) initCartNotification(node);
            });
        });
        mo.observe(document.body, {
            childList: true,
            subtree: true
        });
        document.querySelectorAll(".cart-notification").forEach(initCartNotification);
    })();
})();
