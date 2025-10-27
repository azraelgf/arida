(() => {
    const resizableSwiper = (breakpoint, swiperClass, swiperSettings, callback) => {
        let swiper;

        breakpoint = window.matchMedia(breakpoint);

        const enableSwiper = function (className, settings) {
            swiper = new Swiper(className, settings);

            if (callback) {
                callback(swiper);
            }
        }

        const checker = function () {
            if (breakpoint.matches) {
                return enableSwiper(swiperClass, swiperSettings);
            } else {
                if (swiper !== undefined) swiper.destroy(true, true);
                return;
            }
        };

        breakpoint.addEventListener('change', checker);
        checker();
    }

    const someFunc = (instance) => {
        if (instance) {
            instance.on('slideChange', function (e) {
                // console.log('*** mySwiper.activeIndex', instance.activeIndex);
            });
        }
    };
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
        if (document.querySelector('.benefits__slider')) {
            const benefitsSliders = document.querySelectorAll('.benefits__slider');

            if (benefitsSliders.length) {
                benefitsSliders.forEach((slider, index) => {
                    resizableSwiper(
                        '(max-width: 991.98px)',
                        slider, // 👉 передаём конкретный элемент, а не селектор-строку
                        {
                            modules: [Navigation, Pagination],
                            observer: true,
                            observeParents: true,
                            slidesPerView: 1,
                            spaceBetween: 10,
                            speed: 800,
                            pagination: {
                                el: slider.querySelector('.swiper-pagination'), // 👈 локальная пагинация
                                clickable: true,
                            },
                            breakpoints: {
                                360: {
                                    slidesPerView: 1.1,
                                    spaceBetween: 10,
                                },
                                576: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                },
                            },
                        },
                        someFunc
                    );
                });
            }


        }
        if (document.querySelector('.video-items__slider')) {
            const benefitsSliders = document.querySelectorAll('.video-items__slider');

            if (benefitsSliders.length) {
                benefitsSliders.forEach((slider, index) => {
                    resizableSwiper(
                        '(max-width: 991.98px)',
                        slider, // 👉 передаём конкретный элемент, а не селектор-строку
                        {
                            modules: [Navigation, Pagination],
                            observer: true,
                            observeParents: true,
                            slidesPerView: 1,
                            spaceBetween: 10,
                            speed: 800,
                            pagination: {
                                el: slider.querySelector('.swiper-pagination'), // 👈 локальная пагинация
                                clickable: true,
                            },
                            breakpoints: {
                                360: {
                                    slidesPerView: 1.1,
                                    spaceBetween: 10,
                                },
                                576: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                },
                            },
                        },
                        someFunc
                    );
                });
            }


        }
    }
    initSliders()

    function updateHistoryLineWidth() {
        const wrappers = document.querySelectorAll('.our-history__wrapper');

        wrappers.forEach(wrapper => {
            const width = wrapper.scrollWidth; // полная ширина содержимого
            wrapper.style.setProperty('--before-width', `${width}px`);
        });
    }

// при загрузке и изменении размеров
    window.addEventListener('load', updateHistoryLineWidth);
    window.addEventListener('resize', updateHistoryLineWidth);

// если контент может меняться динамически
    const observer = new MutationObserver(updateHistoryLineWidth);
    observer.observe(document.body, {childList: true, subtree: true});


//scroll
    function enableDragScroll(selector) {
        const el = document.querySelector(selector);
        if (!el) return;

        let isDown = false;
        let startX;
        let scrollLeft;

        el.addEventListener('mousedown', (e) => {
            isDown = true;
            el.classList.add('is-dragging');
            startX = e.pageX - el.offsetLeft;
            scrollLeft = el.scrollLeft;
        });

        el.addEventListener('mouseleave', () => {
            isDown = false;
            el.classList.remove('is-dragging');
        });

        el.addEventListener('mouseup', () => {
            isDown = false;
            el.classList.remove('is-dragging');
        });

        el.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - el.offsetLeft;
            const walk = (x - startX) * 1; // скорость скролла
            el.scrollLeft = scrollLeft - walk;
        });
    }

    enableDragScroll('.our-history__wrapper');
})();
