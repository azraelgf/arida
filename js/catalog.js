(() => {
    function initSliders() {
        if (document.querySelector(".product__images-body")) document.querySelectorAll(".product__images-body").forEach(container => {
            if (container.dataset.swiperInited === "1") return;
            const paginationEl = container.querySelector(".swiper-pagination");
            const swiper = new Swiper(container, {
                modules: [ Pagination ],
                observer: true,
                observeParents: true,
                slidesPerView: 1,
                spaceBetween: 0,
                speed: 1e3,
                pagination: paginationEl ? {
                    el: paginationEl,
                    clickable: true
                } : void 0
            });
            container.dataset.swiperInited = "1";
            if (window.matchMedia("(pointer:fine)").matches && swiper.slides.length > 1) {
                let raf = 0;
                const onMove = e => {
                    if (swiper.animating) return;
                    const rect = container.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const ratio = Math.min(Math.max(x / rect.width, 0), 1);
                    let idx = Math.floor(ratio * swiper.slides.length);
                    if (idx >= swiper.slides.length) idx = swiper.slides.length - 1;
                    if (idx !== swiper.activeIndex) {
                        if (raf) cancelAnimationFrame(raf);
                        raf = requestAnimationFrame(() => swiper.slideTo(idx, 250));
                    }
                };
                const start = () => container.addEventListener("mousemove", onMove);
                const stop = () => container.removeEventListener("mousemove", onMove);
                container.addEventListener("mouseenter", start);
                container.addEventListener("mouseleave", stop);
            }
        });
        if (document.querySelector(".products__slider")) document.querySelectorAll(".products__slider").forEach(container => {
            if (container.dataset.swiperInited === "1") return;
            const prev = container.querySelector(".products-button-prev") || container.closest(".products").querySelector(".products-button-prev");
            const next = container.querySelector(".products-button-next") || container.closest(".products").querySelector(".products-button-next");
            new Swiper(container, {
                modules: [ Navigation, Pagination ],
                observer: true,
                observeParents: true,
                slidesPerView: 1,
                spaceBetween: 20,
                centeredSlidesBounds: true,
                speed: 800,
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true
                },
                navigation: prev || next ? {
                    prevEl: prev,
                    nextEl: next
                } : void 0,
                breakpoints: {
                    360: {
                        slidesPerView: 1.1,
                        spaceBetween: 20
                    },
                    576: {
                        slidesPerView: 2,
                        spaceBetween: 20
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 20
                    },
                    992: {
                        slidesPerView: 3,
                        spaceBetween: 20
                    },
                    1268: {
                        slidesPerView: 4,
                        spaceBetween: 10
                    }
                }
            });
            container.dataset.swiperInited = "1";
        });
    }
    initSliders()
})();
