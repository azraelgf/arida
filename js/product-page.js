(() => {
    "use strict";
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
    window.addEventListener("load", initSliders);
    if (document.querySelector(".product-card__gallery")) {
        const thumbs = new Swiper(".js-product-thumbs", {
            modules: [ Thumb ],
            slidesPerView: 4,
            spaceBetween: 12,
            watchSlidesProgress: true,
            observer: true,
            direction: "vertical",
            observeParents: true,
            speed: 800,
            breakpoints: {
                768: {
                    slidesPerView: 5,
                    spaceBetween: 6
                },
                840: {
                    slidesPerView: 6,
                    spaceBetween: 6
                },
                992: {
                    slidesPerView: 7,
                    spaceBetween: 12
                }
            }
        });
        new Swiper(".js-product-main", {
            modules: [ Thumb, Pagination ],
            spaceBetween: 10,
            observer: true,
            observeParents: true,
            slidesPerView: 1,
            speed: 800,
            pagination: {
                el: ".swiper-pagination",
                clickable: true
            },
            thumbs: {
                swiper: thumbs
            }
        });
        const mainEl = document.querySelector(".product-gallery__main");
        const thumbsEl = document.querySelector(".product-gallery__thumbs");
        if (mainEl && thumbsEl) {
            let lastH = -1;
            let rafId = 0;
            let pendingH = 0;
            const scheduleWrite = h => {
                pendingH = h;
                if (rafId) return;
                rafId = requestAnimationFrame(() => {
                    rafId = 0;
                    if (pendingH > 0 && pendingH !== lastH) {
                        lastH = pendingH;
                        thumbsEl.style.maxHeight = pendingH + "px";
                    }
                });
            };
            const readAndSchedule = () => {
                const h = Math.round(mainEl.getBoundingClientRect().height);
                scheduleWrite(h);
            };
            if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", readAndSchedule, {
                once: true
            }); else readAndSchedule();
            window.addEventListener("resize", readAndSchedule);
            const ro = new ResizeObserver(entries => {
                for (const entry of entries) {
                    const h = Math.round(entry.contentRect.height);
                    scheduleWrite(h);
                }
            });
            ro.observe(mainEl);
            mainEl.querySelectorAll("img").forEach(img => {
                if (!img.complete) img.addEventListener("load", readAndSchedule, {
                    once: true
                });
            });
        }
    }

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.product-info__fav');
        if (!btn) return;

        btn.classList.toggle('_active');
    });
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.product-info__btn');
        const qtyBlock = e.target.closest('.product-info__actions');

        // 👇 Нажали "В корзину"
        if (btn && qtyBlock) {
            qtyBlock.classList.remove('_qty-noactive');
            qtyBlock.classList.add('_qty-active');
        }
    });
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.nav-info__btn');
        if (!btn) return;

        const buttons = btn.parentElement.querySelectorAll('.nav-info__btn');
        buttons.forEach(b => b.classList.remove('_active'));
        btn.classList.add('_active');
    });
})();
