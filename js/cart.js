document.addEventListener('DOMContentLoaded', () => {
    const cart = document.querySelector('.cart__info');
    if (!cart) return;

    const master = cart.querySelector('#c_all.checkbox__input'); // главный чекбокс
    const itemsContainer = cart.querySelector('.cart__info-items');
    if (!master || !itemsContainer) return;

    const getItemCheckboxes = () =>
        itemsContainer.querySelectorAll('.item-cart .item-cart__checkbox .checkbox__input');

    // Обновление состояния главного чекбокса
    const updateMasterState = () => {
        const boxes = getItemCheckboxes();
        const total = boxes.length;
        const checkedCount = Array.from(boxes).filter(b => b.checked).length;

        master.checked = total > 0 && checkedCount === total;
        master.indeterminate = checkedCount > 0 && checkedCount < total;
        master.disabled = total === 0;
    };

    // Клик по "Выбрать все" — отметить / снять всё
    master.addEventListener('change', () => {
        const boxes = getItemCheckboxes();
        const allChecked = Array.from(boxes).every(b => b.checked);
        boxes.forEach(b => (b.checked = !allChecked));
        updateMasterState();
    });

    // Слушатели на отдельные чекбоксы
    const bindItemListeners = () => {
        getItemCheckboxes().forEach(b => {
            if (b._boundChange) return;
            b.addEventListener('change', updateMasterState);
            b._boundChange = true;
        });
    };

    // Если товары подгружаются динамически — следим за контейнером
    const mo = new MutationObserver(() => {
        bindItemListeners();
        updateMasterState();
    });
    mo.observe(itemsContainer, {childList: true, subtree: true});

    // Инициализация
    bindItemListeners();
    updateMasterState();
// активация кнопки избранного
    const itemsFav = document.querySelector('.cart__info-items');
    if (!itemsContainer) return;

    itemsFav.addEventListener('click', (e) => {
        const btn = e.target.closest('.item-cart__fav');
        if (!btn) return; // клик не по нужной кнопке

        const nowActive = btn.classList.toggle('_active');
        btn.setAttribute('aria-pressed', nowActive ? 'true' : 'false');
    });

    //активация чекбоксов принять все

    const selectAllCheckbox = document.getElementById('doc_all');
    const individualCheckboxes = document.querySelectorAll('.js-doc-checkbox');

    // Обработчик для чекбокса "Принять все"
    selectAllCheckbox.addEventListener('change', function () {
        individualCheckboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });

    // Обработчики для индивидуальных чекбоксов
    individualCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            // Проверяем состояние всех чекбоксов
            const allChecked = Array.from(individualCheckboxes).every(cb => cb.checked);
            const anyChecked = Array.from(individualCheckboxes).some(cb => cb.checked);

            // Устанавливаем состояние "Принять все"
            selectAllCheckbox.checked = allChecked;
            selectAllCheckbox.indeterminate = anyChecked && !allChecked;
        });
    });

    // выбор курьер - самовывоз
    const switches = document.querySelector('.checkout__item-switches._delivery');
    const addressBlock = document.querySelector('.form_address');
    if (!switches || !addressBlock) return;
    addressBlock.hidden = true;
    switches.addEventListener('change', (e) => {
        const input = e.target.closest('.switch__input');
        if (!input || input.name !== 'delivery') return;
        // value === '1' → курьер → показываем адрес
        if (input.value === '1') {
            addressBlock.hidden = false;
        } else {
            addressBlock.hidden = true;
        }
    });

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

});
