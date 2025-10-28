(() => {
    "use strict";

    (function () {
        var datepicker_min = __webpack_require__(934);
        const SELECTOR = "[data-datepicker]";

        function pad2(n) {
            return String(n).padStart(2, "0");
        }

        function formatDateRu(date) {
            return `${pad2(date.getDate())}.${pad2(date.getMonth() + 1)}.${date.getFullYear()}`;
        }

        function toISODateOnly(date) {
            const y = date.getFullYear();
            const m = pad2(date.getMonth() + 1);
            const d = pad2(date.getDate());
            return `${y}-${m}-${d}`;
        }

        function ensureIsoTarget(baseInput) {
            const isoTargetAttr = baseInput.dataset.isoTarget || null;
            if (!isoTargetAttr) return null;
            let hidden = document.querySelector(isoTargetAttr);
            if (!hidden) {
                hidden = document.createElement("input");
                hidden.type = "hidden";
                if (/^[\w\-\[\]]+$/.test(isoTargetAttr)) hidden.name = isoTargetAttr;
                baseInput.after(hidden);
            }
            return hidden;
        }

        function syncValue(baseInput, date, isoHidden) {
            if (!date) return;
            baseInput.value = formatDateRu(date);
            if (isoHidden) isoHidden.value = toISODateOnly(date);
            baseInput.dispatchEvent(new Event("change", {
                bubbles: true
            }));
            baseInput.dispatchEvent(new Event("input", {
                bubbles: true
            }));
        }

        const nodes = document.querySelectorAll(SELECTOR);
        if (!nodes.length) return;
        nodes.forEach(input => {
            let initialDate = null;
            const match = input.value.match(/(\d{2})\.(\d{2})\.(\d{4})/);
            if (match) {
                const [, dd, mm, yyyy] = match;
                initialDate = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
            }
            const isoHidden = ensureIsoTarget(input);
            const picker = datepicker_min(input, {
                customDays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
                customMonths: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
                overlayButton: "Применить",
                overlayPlaceholder: "Год (4 цифры)",
                startDay: 1,
                dateSelected: initialDate || void 0,
                formatter: (elem, date) => {
                    elem.value = formatDateRu(date);
                },
                onSelect: (instance, date) => {
                    syncValue(input, date, isoHidden);
                }
            });
            window.flsModules = window.flsModules || {};
            window.flsModules.datepicker = picker;
        });
    })();

    /**
     * Скрипт для загрузки файла
     * */
    const fileInput = document.getElementById('file-input');
    const fileName = document.getElementById('file-name');
    if (fileInput) {
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                fileName.textContent = fileInput.files[0].name;
            } else {
                fileName.textContent = 'Файл не выбран';
            }
        });
    }


    /**
     * Вкл/выкл сайдбара калькулятора
     * */
    const sidebar = document.querySelector('.calc__sidebar');
    const radios = document.querySelectorAll('input[name="zamer"]');

    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'specialist') {
                sidebar.classList.add('sidebar-calc_active');
            } else {
                sidebar.classList.remove('sidebar-calc_active');
            }
        });
    });

    /**
     *
     * initialization sliders
     * */
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
        if (document.querySelector('.collection-calc__body')) {
            new Swiper('.collection-calc__body', {
                modules: [Pagination],
                observer: true,
                observeParents: true,
                slidesPerView: 1,
                spaceBetween: 16,
                //autoHeight: true,
                speed: 800,

                //touchRatio: 0,
                //simulateTouch: false,
                //loop: true,
                //preloadImages: false,
                //lazy: true,

                /*
                //Эффекты
                effect: 'fade',
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
                */

                // Пагинация

                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },


                // Скроллбар
                /*
                scrollbar: {
                    el: '.swiper-scrollbar',
                    draggable: true,
                },
                */

                // Брейкпоинты
                breakpoints: {
                    320: {
                        slidesPerView: 2,
                    },
                    480: {
                        slidesPerView: 2,
                    },
                    640: {
                        slidesPerView: 3,
                    },
                    768: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                    },
                    1024: {
                        slidesPerView: 5,
                        spaceBetween: 20,
                    },
                    1200: {
                        slidesPerView: 6,
                        spaceBetween: 20,
                    },
                },

                // События
                on: {}
            });
        }
        if (document.querySelector('.categories__body')) {
            new Swiper('.categories__body', {
                modules: [Pagination],
                observer: true,
                observeParents: true,
                slidesPerView: 1,
                spaceBetween: 16,
                //autoHeight: true,
                speed: 800,

                //touchRatio: 0,
                //simulateTouch: false,
                //loop: true,
                //preloadImages: false,
                //lazy: true,

                /*
                //Эффекты
                effect: 'fade',
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
                */

                // Пагинация

                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },


                // Скроллбар
                /*
                scrollbar: {
                    el: '.swiper-scrollbar',
                    draggable: true,
                },
                */

                // Брейкпоинты
                breakpoints: {
                    320: {
                        slidesPerView: 2,
                    },
                    480: {
                        slidesPerView: 3,
                    },
                    640: {
                        slidesPerView: 4,
                    },
                    768: {
                        slidesPerView: 5,
                        spaceBetween: 20,
                    },
                    1024: {
                        slidesPerView: 7,
                        spaceBetween: 20,
                    },
                    1200: {
                        slidesPerView: 8,
                        spaceBetween: 20,
                    },
                },

                // События
                on: {}
            });
        }
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
    }

    initSliders()
})();
