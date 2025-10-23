(() => {
    "use strict";
    (function() {
        const container = document.querySelector(".filter-content__filters .catalog-filter__wrapper");
        if (!container) return;
        let scheduled = false;
        function scheduleFit() {
            if (scheduled) return;
            scheduled = true;
            requestAnimationFrame(() => {
                scheduled = false;
                applyFit();
            });
        }
        function applyFit() {
            const chips = Array.from(container.querySelectorAll(".catalog-filter__item"));
            chips.forEach(ch => ch.classList.remove("catalog-filter__item_hidden"));
            const cs = getComputedStyle(container);
            const gap = parseFloat(cs.columnGap || cs.gap || "0");
            const limit = container.clientWidth;
            let used = 0;
            for (let i = 0; i < chips.length; i++) {
                const w = chips[i].offsetWidth;
                const next = used === 0 ? w : used + gap + w;
                if (next <= limit) used = next; else {
                    for (let j = i; j < chips.length; j++) chips[j].classList.add("catalog-filter__item_hidden");
                    break;
                }
            }
        }
        container.addEventListener("click", e => {
            const btn = e.target.closest(".catalog-filter__item");
            if (!btn) return;
            btn.remove();
            scheduleFit();
        });
        const ro = new ResizeObserver(() => {
            scheduleFit();
        });
        ro.observe(container);
        const mo = new MutationObserver(() => {
            scheduleFit();
        });
        mo.observe(container, {
            childList: true,
            subtree: true,
            characterData: true
        });
        scheduleFit();
        document.addEventListener("catalogFilter:update", scheduleFit);
    })();
    (function() {
        const container = document.querySelector(".filter-content__filters");
        const wrapper = container?.querySelector(".catalog-filter__wrapper");
        if (!container || !wrapper) return;
        function checkEmpty() {
            const hasItems = wrapper.querySelector(".catalog-filter__item");
            container.classList.toggle("catalog-filter_empty", !hasItems);
        }
        checkEmpty();
        const mo = new MutationObserver(checkEmpty);
        mo.observe(wrapper, {
            childList: true
        });
        document.addEventListener("catalogFilter:update", checkEmpty);
    })();
    window["FLS"] = false;
})();
