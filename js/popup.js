        "use strict";
        class Popups {

            /**
             * у кнопки [data-opener]; [data-popup="ID-попапа"]
             * у попапа id="ID-попапа"
             * */

            popupsList = {//содержит ID попапов
                'filter': 'filter',
                "pop-log": "pop-log",
                "pop-sign-up": "pop-sign-up",
                "pop-authorization": "pop-authorization",
                "uslovia-obr": "uslovia-obr",
                "sposob-oplati": "sposob-oplati",
                "sposob-dostavki": "sposob-dostavki",
                "privacy": "privacy",
                "oferta-polzovateli": "oferta-polzovateli",
                "uslovia-obrabotki": "uslovia-obrabotki",
                "uslovia-provedenia": "uslovia-provedenia",
            }

            p = {}; //popup nodes
            b = {}; //popup openers
            c = {}; //popup closers
            o = {}; //popup overlays (closers)

            constructor(params = {
                JSObjectName: 'pps'
            }) {
                document.addEventListener('DOMContentLoaded', () => {
                    /*Utils.setFieldsObject(params, this);*/
                    this.init();
                })
            }

            init() {
                this.events.construct();

                this.getPopups();
                this.getButtons();
                this.getCloseButtons();
                this.getOverlays();
            }

            events = {
                construct: () => {
                    //события
                    ['onOpen', 'onClose', 'onBeforeOpen'].forEach((e) => {
                        if (!!this.events[e]) {
                            return;
                        }
                        this.events[e] = {
                            popups: {
                                popupId: []
                            },
                            add: (popupId, ev = {
                                fn: () => {
                                }, args: {}
                            }) => {
                                this.events[e].popups[popupId] = this.events[e].popups[popupId] ?? [];
                                let addObj = {fn: ev.fn, args: ev.args};
                                if (this.events[e].popups[popupId].indexOf(addObj) === -1)
                                    this.events[e].popups[popupId].push(addObj);
                            },
                            exec: (popupId) => {
                                let result = true;
                                if (!this.events[e].popups[popupId])
                                    return result;
                                this.events[e].popups[popupId].forEach((obj) => {
                                    if (!obj.fn(obj.args)) {
                                        result = false;
                                    }
                                    // obj.fn(obj.args);
                                })

                                return result;
                            }
                        }
                    })
                },
            }

            getPopups() {
                this.p = this.p ?? {};

                for (let i in this.popupsList) {
                    this.p[i] = document.querySelector('#' + this.popupsList[i]);
                    if (!this.p[i]) {
                        delete this.p[i];
                    }
                }

                for (let i in this.p) {
                    this.p[i].open = () => {
                        this.open(i);
                    }
                    this.p[i].close = () => {
                        this.close(i);
                    }
                }
            }

            /** обратная связь INPUT на попапе с блоком построенным плагином TomSelect */
            eventTomSelectCallback(node) {
                let fTS = (ev) => {
                    let trgt = ev.target;
                    switch (trgt.nodeName) {
                        case 'INPUT':
                        case 'SELECT':
                            trgt.removeAttribute('onclick');
                            let id = trgt.closest('.popup').id;
                            this.p[id].tomselect.addItem(trgt.value);
                            break;
                    }
                }
                node.addEventListener('click', fTS);
                node.querySelectorAll('input').forEach((i) => {
                    i.removeAttribute('onclick');
                })
            }

            getButtons() {
                this.b = this.b ?? {};

                for (let i in this.popupsList) {
                    this.b[i] = document.querySelectorAll('[data-popup="' + this.popupsList[i] + '"]'); //[data-popup="cart"]
                    let additions = [];
                    this.b[i].forEach((k) => {
                        /* обратная связь выбираемых значений на popup и плагина TomSelect */
                        /*if (!!k.tomselect && k.dataset.popupCallback == 1) {
                            this.p[i].tomselect = k.tomselect;
                            Utils.setFieldsObject(k.dataset, k.tomselect.control.dataset);
                            additions.push(k.tomselect.control);
                            this.eventTomSelectCallback(this.p[i]);
                        }*/
                    })

                    this.b[i] = [...this.b[i], ...additions];
                    if (this.b[i].length < 1) {
                        delete this.b[i];
                    }
                }

                let btnOpener = (ev) => {
                    let btn = ev.target.closest('[data-opener]');
                    let pKey = btn.dataset.popup;
                    if (!!this.p[pKey]) {
                        switch (btn.popupStatusActive) {
                            case false:
                                // this.p[pKey].open(this, btn);
                                this.p[pKey].open();
                                break;
                            case true:
                            default:
                                // this.p[pKey].close(this, btn);
                                this.p[pKey].close();
                                break;
                        }
                    }
                }

                for (let i in this.b) {
                    if (this.b[i].length > 0) {
                        this.b[i].forEach((k) => {
                            if (typeof k.popupStatusActive != 'undefined') {
                                return;
                            }

                            /* Установка дефолтного значения активности попапов */
                            k.popupStatusActive = false;

                            k.removeEventListener('click', btnOpener);
                            k.addEventListener('click', btnOpener);
                        })
                    }
                }
            }

            getCloseButtons() {
                this.c = this.c ?? {};

                for (let i in this.popupsList) {
                    this.c[i] = document.querySelectorAll(`#${this.popupsList[i]} .popup__close`); //[data-popup="cart"]
                    if (!this.c[i]) {
                        delete this.c[i];
                    }
                }

                let btnCloser = (ev) => {
                    let block = ev.target.closest('.card-popup, .popup');
                    let pKey = block.id;
                    if (!!this.p[block.id]) {
                        this.p[block.id].close();
                    }
                }

                for (let i in this.c) {
                    this.c[i].forEach((b) => {
                        if (!!b.eventCloseIsSet) {
                            return;
                        }
                        b.eventCloseIsSet = true;
                        b.addEventListener('click', btnCloser);
                    })
                }
            }

            getOverlays() {
                this.o = this.o ?? {};

                for (let i in this.popupsList) {
                    this.o[i] = document.querySelectorAll(`#${this.popupsList[i]} .popup__overlay`); //[data-popup="cart"]

                    if (!this.o[i]) {
                        delete this.o[i];
                    }
                }

                let overlayCloser = (ev) => {
                    let ov = ev.target.closest('.popup');
                    if (!!this.p[ov.id]) {
                        this.p[ov.id].close()
                    }
                }
                for (let i in this.o) {
                    this.o[i].forEach((l) => {
                        if (!!l.closeEventIsSet) {
                            return;
                        }
                        l.closeEventIsSet = true;
                        l.addEventListener('click', overlayCloser);
                    })
                }
            }

            /** функция кладётся в объект node (в попап); this в этом контексте - сам попап */
            //открывает попап
            // open(handler, btn) {
            open(popupId) {
                this.closeAllPopups();
                let eventOnBeforeOpenResult = this.events.onBeforeOpen.exec(popupId);
                if (!eventOnBeforeOpenResult) {
                    return;
                }

                let bodyClasses = document.body.classList;
                let header = document.querySelector('.header');
                let headerFix = document.querySelector('._header-scroll .middle-header');
                const scrollBarWidth = this.calcScroll();

                //this в этом контексте - объект попапа
                if (popupId == 'card-constructor') {
                    bodyClasses.add('hide-menu');
                }
                bodyClasses.remove('no-scroll');
                document.body.style.marginRight = `${scrollBarWidth}px`;
                header.style.paddingRight = `${scrollBarWidth}px`;
                if (headerFix) {
                    headerFix.style.paddingRight = `${scrollBarWidth}px`;
                }

                bodyClasses.remove('hide-menu');
                bodyClasses.add('no-scroll');

                this.p[popupId].classList.add('popup-opened');
                this.processBtnOpener(popupId, 'open');

                this.events.onOpen.exec(popupId);
            }

            /** функция кладётся в объект node (в попап); this в этом контексте - сам попап */
            //закрывает попап
            // close(handler, btn = {}) {
            close(popupId) {
                let bodyClasses = document.body.classList;
                let header = document.querySelector('.header');
                let headerFix = document.querySelector('._header-scroll .middle-header');
                bodyClasses.remove('no-scroll');
                bodyClasses.remove('hide-menu');
                document.body.style.marginRight = ``;
                header.style.paddingRight = ``;
                if (headerFix) {
                    headerFix.style.paddingRight = ``;
                }

                this.p[popupId].classList.remove('popup-opened');

                this.processBtnOpener(popupId, 'close');
                (this.p[popupId].removeAfterClosing === true && (setTimeout(() => {
                    this.p[popupId].parentNode.removeChild(this.p[popupId])
                }, 350)));

                this.events.onClose.exec(popupId);
            }

            //закрытие всех попапов
            closeAllPopups() {
                for (let i in this.p) {
                    this.p[i].close();
                }
            }

            //гашение всех кнопок
            unactiveAllBtns() {
                for (let i in this.b) {
                    this.b[i].forEach((k) => {
                        k.classList.remove('is-active');
                    })
                }
            }

            //обработка кнопки
            processBtnOpener(btn, status) {
                if (!this.b[btn]) {
                    return;
                }
                this.b[btn].forEach((btn) => {
                    switch (status) {
                        case 'open': {  //устанавливает состояние открытия
                            btn.classList.remove('is-active');
                            this.unactiveAllBtns();

                            // let scrollBarWidth = this.calcScroll();
                            // document.body.style.marginRight = `${scrollBarWidth}px`;
                            btn.classList.add('is-active');
                            btn.popupStatusActive = true;
                            break;
                        }
                        case 'close':   //устанавливает состояние закрытия
                        default:
                            btn.classList.remove('is-active');
                            document.body.style.marginRight = ``;
                            btn.popupStatusActive = false;
                    }
                })


                // switch (btn.popupStatusActive) {
                //     case false:
                //         handler.closeAllPopups();
                //         break;
                // }
            }

            //считает ширину скроллбара
            calcScroll() {
                let div = document.createElement('div');
                div.style.width = '50px';
                div.style.height = '50px';
                div.style.overflow = 'scroll';
                div.style.visibility = 'hidden';
                document.body.appendChild(div);
                let scrollWidth = div.offsetWidth - div.clientWidth;
                div.remove();
                return scrollWidth;
            }

            /*closeAllPopups() {
                const $popupClose = document.querySelectorAll('.popup__close');
                const $popupBg = document.querySelectorAll('.popup__overlay');
                $popupClose.forEach(($el) => {
                    $el.addEventListener('click', closePopup);
                });
                $popupBg.forEach(($el) => {
                    $el.addEventListener('click', closePopup);
                });
                function closePopup() {
                    document.body.classList.remove('no-scroll');
                    document.body.classList.remove('hide-menu');
                    document.body.style.marginRight = ``;
                    for (const popup of document.querySelectorAll(".popup")) {
                        popup.classList.remove('popup-opened');
                    }
                    for (const elment of $popupOpeners) {
                        elment.classList.remove('is-active')
                    }
                }
            }*/
        }

        let popups = new Popups;
