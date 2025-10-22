(() => {
function initSliders() {
    if (document.querySelector(".hero__slider")) new Swiper(".hero__slider", {
        modules: [ Navigation, Pagination ],
        observer: true,
        observeParents: true,
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 800,
        pagination: {
            el: ".swiper-pagination",
            clickable: true
        },
        navigation: {
            prevEl: ".hero-button-prev",
            nextEl: ".hero-button-next"
        },
        on: {}
    });
    if (document.querySelector(".category-main__body")) new Swiper(".category-main__body", {
        modules: [ Navigation, Pagination, Grid ],
        observer: true,
        observeParents: true,
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 800,
        loop: true,
        pagination: {
            el: ".swiper-pagination",
            clickable: true
        },
        navigation: {
            prevEl: ".category-main-button-prev",
            nextEl: ".category-main-button-next"
        },
        breakpoints: {
            320: {
                slidesPerView: 2,
                grid: {
                    rows: 2,
                    fill: "row"
                },
                spaceBetween: 16,
                loop: false
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 20,
                grid: {
                    rows: 1
                },
                loop: true
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 20
            },
            1268: {
                slidesPerView: 5.2,
                spaceBetween: 20
            }
        },
        on: {}
    });
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
    if (document.querySelector(".benefits__slider")) {
        const resizableSwiper = (breakpoint, swiperClass, swiperSettings, callback) => {
            let swiper;
            breakpoint = window.matchMedia(breakpoint);
            const enableSwiper = function(className, settings) {
                swiper = new Swiper(className, settings);
                if (callback) callback(swiper);
            };
            const checker = function() {
                if (breakpoint.matches) return enableSwiper(swiperClass, swiperSettings); else {
                    if (swiper !== void 0) swiper.destroy(true, true);
                    return;
                }
            };
            breakpoint.addEventListener("change", checker);
            checker();
        };
        const someFunc = instance => {
            if (instance) instance.on("slideChange", function(e) {
                console.log("*** mySwiper.activeIndex", instance.activeIndex);
            });
        };
        resizableSwiper("(max-width: 991.98px)", ".benefits__slider", {
            modules: [ Navigation, Pagination ],
            observer: true,
            observeParents: true,
            slidesPerView: 1,
            spaceBetween: 10,
            speed: 800,
            pagination: {
                el: ".swiper-pagination",
                clickable: true
            },
            breakpoints: {
                360: {
                    slidesPerView: 1.1,
                    spaceBetween: 10
                },
                576: {
                    slidesPerView: 2,
                    spaceBetween: 20
                }
            }
        }, someFunc);
    }
}
    initSliders()
})();
