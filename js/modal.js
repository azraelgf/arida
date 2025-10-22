
    "use strict";

    class Modals {

        modals = {
            'video': 'video',
            'pop_search': 'pop_search',
            'pop_address': 'pop_address',
            'pop_catalog': 'pop_catalog',
        };

        mod = {};
        btn = {};
        cls = {};

        hoverTimers = {};
        hoverState = {};
        activeBtn = null; // 👈 отслеживаем текущую активную кнопку
// внутри класса
        toggleOnClick = new Set(['pop_address','pop_catalog']);

        constructor(params = {}, mainObj = {}) {
            this.init();
        }

        init() {
            this.events.construct();

            this.findUniversalModals();
            this.getModals();
            this.getButtons();
            this.getCloseBtns();

            // включаем hover для pop_catalog
            if (this.mod['pop_catalog'] && this.btn['pop_catalog']?.length) {
                this.enableHoverOpen('pop_catalog', { openDelay: 80, closeDelay: 180 });
            }
        }

        events = {
            construct: ()=>{
                ['onOpen', 'onClose', 'onBeforeOpen', 'onBeforeClose'].forEach((e)=>{
                    this.events[e] = this.events[e] ?? {
                        popups: { popupId: [] },
                        add: (popupId, ev = {fn: ()=>{}, args: {}})=>{
                            this.events[e].popups[popupId] = this.events[e].popups[popupId] ?? [];
                            const addObj = {fn: ev.fn, args: ev.args};
                            if (this.events[e].popups[popupId].indexOf(addObj) === -1)
                                this.events[e].popups[popupId].push(addObj);
                        },
                        exec: (popupId)=>{
                            let result = true;
                            if (!this.events[e].popups[popupId]) return result;
                            this.events[e].popups[popupId].forEach((obj)=>{
                                if (!obj.fn(obj.args)) result = false;
                            });
                            return result;
                        }
                    }
                })
            },
        }

        getModals() {
            this.mod = this.mod ?? {};
            for (let m in this.modals) {
                this.mod[m] = document.getElementById(this.modals[m]);
                if (!this.mod[m]) delete this.mod[m];
            }

            for (let m in this.mod) {
                this.mod[m].o = (ctx, btn)=>{ this.o(m, btn); };
                this.mod[m].c = ()=>{ this.c(m); };
                if (typeof this.mod[m].isOpened == 'undefined') this.mod[m].isOpened = false;
            }
        }

        findUniversalModals() {
            const prefixList = ["dostavka-kurerom-", "samovyvoz-", "payment-"];
            document.querySelectorAll('[data-modal-name]').forEach((m)=>{
                if (!!m.dataset.modalName) {
                    let modalFinded = false;
                    prefixList.forEach((pref)=>{
                        if (m.dataset.modalName.indexOf(pref) != -1) modalFinded = m.dataset.modalName;
                    });
                    if (!!modalFinded && !this.modals[modalFinded]) {
                        this.modals[modalFinded] = modalFinded;
                    }
                }
            })
        }

        getButtons() {
            this.btn = this.btn ?? {};

            for (let m in this.modals) {
                const b1 = document.querySelectorAll('[href="' + this.modals[m] + '"]');
                const b2 = document.querySelectorAll('[data-modal-name="' + this.modals[m] + '"]');
                this.btn[m] = [...b1, ...b2];
                if (!this.btn[m]) delete this.btn[m];
            }

            const btnOpener = (e) => {
                e.preventDefault();
                const bt = e.target.closest('.modal-btn') || e.currentTarget;
                const mKey = bt?.getAttribute('href') || bt?.dataset.modalName;
                if (!mKey || !this.mod[mKey]) return;

                // ⤵️ toggle по клику для адреса и каталога
                if (this.toggleOnClick && this.toggleOnClick.has(mKey)) {
                    if (this.mod[mKey].isOpened === true) {
                        this.mod[mKey].c();
                        return; // уже открыта — просто закрыли
                    }
                    // иначе откроем (и закроем прочие) как обычно
                    this.mod[mKey].o(this, bt);
                    return;
                }

                // для остальных модалок — обычное открытие
                this.mod[mKey].o(this, bt);
            };

            for (let b in this.btn) {
                this.btn[b].forEach(btn => {
                    if (btn.modalStatusActive) return;
                    btn.modalStatusActive = true;
                    btn.removeEventListener('click', btnOpener);
                    btn.addEventListener('click', btnOpener);
                });
            }
        }

        getCloseBtns() {
            this.cls = this.cls ?? {};
            for (let m in this.mod) {
                this.cls[m] = document.getElementById(m).querySelector('.modal__close');
            }

            const btnCloser = (e) => {
                e.preventDefault();
                const cb = e.target.closest('.modal__close');
                const mKey = cb.parentElement.closest('.modal').getAttribute('id');
                this.mod[mKey].c();
                (this.mod[mKey].removeAfterClosing === true && (setTimeout(()=>{this.mod[mKey].parentNode.removeChild(this.mod[mKey])}, 350)));
            };

            for (let c in this.cls) {
                if (!this.cls[c]) { delete this.cls[c]; continue; }
                if (this.cls[c].closeEventIsSet) continue;
                this.cls[c].closeEventIsSet = true;
                this.cls[c].addEventListener('click', btnCloser);
            }
        }

        handleInner() {
            const innerCloser = (e) => {
                const mKey = e.target.closest('.modal').getAttribute('id');
                const block = document.getElementById(mKey);
                if (block == e.target) {
                    this.mod[mKey].c(this);
                    (this.mod[mKey].removeAfterClosing === true && (setTimeout(()=>{this.mod[mKey].parentNode.removeChild(this.mod[mKey])}, 350)));
                }
            };

            for (let b in this.mod) {
                this.mod[b].removeEventListener('click', innerCloser);
                this.mod[b].addEventListener('click', innerCloser);
            }
        }

        // 👉 теперь принимаем вторым аргументом кнопку
        o(mKey, btn = null) {
            const eventOnBeforeOpenResult = this.events.onBeforeOpen.exec(mKey);
            if (!eventOnBeforeOpenResult) return;

            for (let m in this.mod) this.mod[m].c();

            this.handleOpen(mKey);
            document.body.classList.add('modalOpen');
            this.mod[mKey].classList.add('modal--active');
            this.mod[mKey].isOpened = true;

            // 👇 подсветка активной кнопки
            this.setActiveBtn(btn);

            this.events.onOpen.exec(mKey);
        }

        c(mKey) {
            if (this.mod[mKey].classList.contains('modal--active')) {
                const eventOnBeforeCloseResult = this.events.onBeforeClose.exec(mKey);
                if (!eventOnBeforeCloseResult) return;

                this.mod[mKey].classList.remove('modal--active');
                document.body.classList.remove('modalOpen');
                this.mod[mKey].isOpened = false;

                // 👇 сброс подсветки
                this.clearActiveBtn();

                this.events.onClose.exec(mKey);
            }
        }

        handleOpen(b) {
            b = this.mod[b];
            if (b.classList.contains('modal--active')) {
                b.classList.remove('modal--active');
            } else {
                this.handleInner();
                b.classList.remove('modal--active');
                for (let m in this.mod) this.mod[m].c(this);
                b.classList.add('modal--active');
            }
        }

        /* =========================
           Подсветка активной кнопки
           ========================= */
        setActiveBtn(btn) {
            this.clearActiveBtn();
            if (btn) {
                this.activeBtn = btn;
                this.activeBtn.classList.add('modal-btn_active');
            }
        }

        clearActiveBtn() {
            if (this.activeBtn) {
                this.activeBtn.classList.remove('modal-btn_active');
                this.activeBtn = null;
            }
        }

        /* =========================
           Hover-открытие для pop_catalog
           ========================= */
        enableHoverOpen(mKey, { openDelay = 100, closeDelay = 200 } = {}) {
            const modalEl = this.mod[mKey];
            if (!modalEl) return;

            this.hoverTimers[mKey] = { open: null, close: null };
            this.hoverState[mKey] = { overTrigger: false, overModal: false };

            const clearTimers = () => {
                clearTimeout(this.hoverTimers[mKey].open);
                clearTimeout(this.hoverTimers[mKey].close);
            };

            const scheduleOpen = (btn) => {
                clearTimeout(this.hoverTimers[mKey].open);
                this.hoverTimers[mKey].open = setTimeout(() => {
                    this.o(mKey, btn);
                }, openDelay);
            };

            const scheduleClose = () => {
                clearTimeout(this.hoverTimers[mKey].close);
                this.hoverTimers[mKey].close = setTimeout(() => {
                    const { overTrigger, overModal } = this.hoverState[mKey];
                    if (!overTrigger && !overModal) this.c(mKey);
                }, closeDelay);
            };

            (this.btn[mKey] || []).forEach(trigger => {
                trigger.addEventListener('mouseenter', () => {
                    this.hoverState[mKey].overTrigger = true;
                    scheduleOpen(trigger);
                });
                trigger.addEventListener('mouseleave', (ev) => {
                    this.hoverState[mKey].overTrigger = false;
                    const to = ev.relatedTarget;
                    if (to && modalEl.contains(to)) return;
                    scheduleClose();
                });
            });

            modalEl.addEventListener('mouseenter', () => {
                this.hoverState[mKey].overModal = true;
                clearTimers();
            });
            modalEl.addEventListener('mouseleave', () => {
                this.hoverState[mKey].overModal = false;
                scheduleClose();
            });
        }
    }

    let modals = new Modals;

