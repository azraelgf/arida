    "use strict";
    class Popups {
        popupsList={
            "pop-log": "pop-log",
            "pop-sign-up": "pop-sign-up",
            "pop-authorization": "pop-authorization"
        };
        p={};
        b={};
        c={};
        o={};
        constructor(params = {
            JSObjectName: "pps"
        }) {
            document.addEventListener("DOMContentLoaded", () => {
                this.init();
            });
        }
        init() {
            this.events.construct();
            this.getPopups();
            this.getButtons();
            this.getCloseButtons();
            this.getOverlays();
        }
        events={
            construct: () => {
                [ "onOpen", "onClose", "onBeforeOpen" ].forEach(e => {
                    if (!!this.events[e]) return;
                    this.events[e] = {
                        popups: {
                            popupId: []
                        },
                        add: (popupId, ev = {
                            fn: () => {},
                            args: {}
                        }) => {
                            this.events[e].popups[popupId] = this.events[e].popups[popupId] ?? [];
                            let addObj = {
                                fn: ev.fn,
                                args: ev.args
                            };
                            if (this.events[e].popups[popupId].indexOf(addObj) === -1) this.events[e].popups[popupId].push(addObj);
                        },
                        exec: popupId => {
                            let result = true;
                            if (!this.events[e].popups[popupId]) return result;
                            this.events[e].popups[popupId].forEach(obj => {
                                if (!obj.fn(obj.args)) result = false;
                            });
                            return result;
                        }
                    };
                });
            }
        };
        getPopups() {
            this.p = this.p ?? {};
            for (let i in this.popupsList) {
                this.p[i] = document.querySelector("#" + this.popupsList[i]);
                if (!this.p[i]) delete this.p[i];
            }
            for (let i in this.p) {
                this.p[i].open = () => {
                    this.open(i);
                };
                this.p[i].close = () => {
                    this.close(i);
                };
            }
        }
        eventTomSelectCallback(node) {
            let fTS = ev => {
                let trgt = ev.target;
                switch (trgt.nodeName) {
                    case "INPUT":
                    case "SELECT":
                        trgt.removeAttribute("onclick");
                        let id = trgt.closest(".popup").id;
                        this.p[id].tomselect.addItem(trgt.value);
                        break;
                }
            };
            node.addEventListener("click", fTS);
            node.querySelectorAll("input").forEach(i => {
                i.removeAttribute("onclick");
            });
        }
        getButtons() {
            this.b = this.b ?? {};
            for (let i in this.popupsList) {
                this.b[i] = document.querySelectorAll('[data-popup="' + this.popupsList[i] + '"]');
                let additions = [];
                this.b[i].forEach(k => {});
                this.b[i] = [ ...this.b[i], ...additions ];
                if (this.b[i].length < 1) delete this.b[i];
            }
            let btnOpener = ev => {
                let btn = ev.target.closest("[data-opener]");
                let pKey = btn.dataset.popup;
                if (!!this.p[pKey]) switch (btn.popupStatusActive) {
                    case false:
                        this.p[pKey].open();
                        break;

                    case true:
                    default:
                        this.p[pKey].close();
                        break;
                }
            };
            for (let i in this.b) if (this.b[i].length > 0) this.b[i].forEach(k => {
                if (typeof k.popupStatusActive != "undefined") return;
                k.popupStatusActive = false;
                k.removeEventListener("click", btnOpener);
                k.addEventListener("click", btnOpener);
            });
        }
        getCloseButtons() {
            this.c = this.c ?? {};
            for (let i in this.popupsList) {
                this.c[i] = document.querySelectorAll(`#${this.popupsList[i]} .popup__close`);
                if (!this.c[i]) delete this.c[i];
            }
            let btnCloser = ev => {
                let block = ev.target.closest(".card-popup, .popup");
                block.id;
                if (!!this.p[block.id]) this.p[block.id].close();
            };
            for (let i in this.c) this.c[i].forEach(b => {
                if (!!b.eventCloseIsSet) return;
                b.eventCloseIsSet = true;
                b.addEventListener("click", btnCloser);
            });
        }
        getOverlays() {
            this.o = this.o ?? {};
            for (let i in this.popupsList) {
                this.o[i] = document.querySelectorAll(`#${this.popupsList[i]} .popup__overlay`);
                if (!this.o[i]) delete this.o[i];
            }
            let overlayCloser = ev => {
                let ov = ev.target.closest(".popup");
                if (!!this.p[ov.id]) this.p[ov.id].close();
            };
            for (let i in this.o) this.o[i].forEach(l => {
                if (!!l.closeEventIsSet) return;
                l.closeEventIsSet = true;
                l.addEventListener("click", overlayCloser);
            });
        }
        open(popupId) {
            this.closeAllPopups();
            let eventOnBeforeOpenResult = this.events.onBeforeOpen.exec(popupId);
            if (!eventOnBeforeOpenResult) return;
            let bodyClasses = document.body.classList;
            let header = document.querySelector(".header");
            let headerFix = document.querySelector("._header-scroll .middle-header");
            const scrollBarWidth = this.calcScroll();
            if (popupId == "card-constructor") bodyClasses.add("hide-menu");
            bodyClasses.remove("no-scroll");
            document.body.style.marginRight = `${scrollBarWidth}px`;
            header.style.paddingRight = `${scrollBarWidth}px`;
            if (headerFix) headerFix.style.paddingRight = `${scrollBarWidth}px`;
            bodyClasses.remove("hide-menu");
            bodyClasses.add("no-scroll");
            this.p[popupId].classList.add("popup-opened");
            this.processBtnOpener(popupId, "open");
            this.events.onOpen.exec(popupId);
        }
        close(popupId) {
            let bodyClasses = document.body.classList;
            let header = document.querySelector(".header");
            let headerFix = document.querySelector("._header-scroll .middle-header");
            bodyClasses.remove("no-scroll");
            bodyClasses.remove("hide-menu");
            document.body.style.marginRight = ``;
            header.style.paddingRight = ``;
            if (headerFix) headerFix.style.paddingRight = ``;
            this.p[popupId].classList.remove("popup-opened");
            this.processBtnOpener(popupId, "close");
            this.p[popupId].removeAfterClosing === true && setTimeout(() => {
                this.p[popupId].parentNode.removeChild(this.p[popupId]);
            }, 350);
            this.events.onClose.exec(popupId);
        }
        closeAllPopups() {
            for (let i in this.p) this.p[i].close();
        }
        unactiveAllBtns() {
            for (let i in this.b) this.b[i].forEach(k => {
                k.classList.remove("is-active");
            });
        }
        processBtnOpener(btn, status) {
            if (!this.b[btn]) return;
            this.b[btn].forEach(btn => {
                switch (status) {
                    case "open":
                        btn.classList.remove("is-active");
                        this.unactiveAllBtns();
                        btn.classList.add("is-active");
                        btn.popupStatusActive = true;
                        break;

                    case "close":
                    default:
                        btn.classList.remove("is-active");
                        document.body.style.marginRight = ``;
                        btn.popupStatusActive = false;
                }
            });
        }
        calcScroll() {
            let div = document.createElement("div");
            div.style.width = "50px";
            div.style.height = "50px";
            div.style.overflow = "scroll";
            div.style.visibility = "hidden";
            document.body.appendChild(div);
            let scrollWidth = div.offsetWidth - div.clientWidth;
            div.remove();
            return scrollWidth;
        }
    }
    let popups = new Popups;
