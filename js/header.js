(() => {
    "use strict";
    function addLoadedClass() {
        if (!document.documentElement.classList.contains("loading")) window.addEventListener("load", function() {
            setTimeout(function() {
                document.documentElement.classList.add("loaded");
            }, 0);
        });
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            setTimeout(() => {
                lockPaddingElements.forEach(lockPaddingElement => {
                    lockPaddingElement.style.paddingRight = "";
                });
                document.body.style.paddingRight = "";
                document.documentElement.classList.remove("lock");
            }, delay);
            bodyLockStatus = false;
            setTimeout(function() {
                bodyLockStatus = true;
            }, delay);
        }
    };
    let bodyLock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
            lockPaddingElements.forEach(lockPaddingElement => {
                lockPaddingElement.style.paddingRight = lockPaddingValue;
            });
            document.body.style.paddingRight = lockPaddingValue;
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout(function() {
                bodyLockStatus = true;
            }, delay);
        }
    };
    function spoilers() {
        const spoilersArray = document.querySelectorAll("[data-spoilers]");
        if (spoilersArray.length > 0) {
            const spoilersRegular = Array.from(spoilersArray).filter(function(item, index, self) {
                return !item.dataset.spoilers.split(",")[0];
            });
            if (spoilersRegular.length) initspoilers(spoilersRegular);
            let mdQueriesArray = dataMediaQueries(spoilersArray, "spoilers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach(mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", function() {
                    initspoilers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                });
                initspoilers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            });
            function initspoilers(spoilersArray, matchMedia = false) {
                spoilersArray.forEach(spoilersBlock => {
                    spoilersBlock = matchMedia ? spoilersBlock.item : spoilersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spoilersBlock.classList.add("_spoiler-init");
                        initSpollerBody(spoilersBlock);
                        spoilersBlock.addEventListener("click", setSpollerAction);
                    } else {
                        spoilersBlock.classList.remove("_spoiler-init");
                        initSpollerBody(spoilersBlock, false);
                        spoilersBlock.removeEventListener("click", setSpollerAction);
                    }
                });
            }
            function initSpollerBody(spoilersBlock, hideSpollerBody = true) {
                let spollerTitles = spoilersBlock.querySelectorAll("[data-spoiler]");
                if (spollerTitles.length) {
                    spollerTitles = Array.from(spollerTitles).filter(item => item.closest("[data-spoilers]") === spoilersBlock);
                    spollerTitles.forEach(spollerTitle => {
                        if (hideSpollerBody) {
                            spollerTitle.removeAttribute("tabindex");
                            if (!spollerTitle.classList.contains("_spoiler-active")) spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.setAttribute("tabindex", "-1");
                            spollerTitle.nextElementSibling.hidden = false;
                        }
                    });
                }
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("[data-spoiler]")) {
                    const spollerTitle = el.closest("[data-spoiler]");
                    const spoilersBlock = spollerTitle.closest("[data-spoilers]");
                    const oneSpoller = spoilersBlock.hasAttribute("data-one-spoller");
                    const spoilerspeed = spoilersBlock.dataset.spoilersSpeed ? parseInt(spoilersBlock.dataset.spoilersSpeed) : 500;
                    if (!spoilersBlock.querySelectorAll("._slide").length) {
                        if (oneSpoller && !spollerTitle.classList.contains("_spoiler-active")) hidespoilersBody(spoilersBlock);
                        spollerTitle.classList.toggle("_spoiler-active");
                        _slideToggle(spollerTitle.nextElementSibling, spoilerspeed);
                    }
                    e.preventDefault();
                }
            }
            function hidespoilersBody(spoilersBlock) {
                const spollerActiveTitle = spoilersBlock.querySelector("[data-spoiler]._spoiler-active");
                const spoilerspeed = spoilersBlock.dataset.spoilersSpeed ? parseInt(spoilersBlock.dataset.spoilersSpeed) : 500;
                if (spollerActiveTitle && !spoilersBlock.querySelectorAll("._slide").length) {
                    spollerActiveTitle.classList.remove("_spoiler-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spoilerspeed);
                }
            }
            const spoilersClose = document.querySelectorAll("[data-spoiler-close]");
            if (spoilersClose.length) document.addEventListener("click", function(e) {
                const el = e.target;
                if (!el.closest("[data-spoilers]")) spoilersClose.forEach(spollerClose => {
                    const spoilersBlock = spollerClose.closest("[data-spoilers]");
                    if (spoilersBlock.classList.contains("_spoiler-init")) {
                        const spoilerspeed = spoilersBlock.dataset.spoilersSpeed ? parseInt(spoilersBlock.dataset.spoilersSpeed) : 500;
                        spollerClose.classList.remove("_spoiler-active");
                        _slideUp(spollerClose.nextElementSibling, spoilerspeed);
                    }
                });
            });
        }
    }
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", function(e) {
            const menuBtn = e.target.closest(".icon-menu");
            if (bodyLockStatus && menuBtn) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
                if (!document.documentElement.classList.contains("menu-open")) document.querySelectorAll("._submenu-open").forEach(sub => {
                    sub.classList.remove("_submenu-open");
                });
            }
        });
    }
    let addWindowScrollEvent = false;
    function headerScroll() {
        addWindowScrollEvent = true;
        const header = document.querySelector("header.header");
        const headerShow = header.hasAttribute("data-scroll-show");
        const headerShowTimer = header.dataset.scrollShow ? header.dataset.scrollShow : 500;
        const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
        const popSearch = document.getElementById("pop_search");
        const popCatalog = document.getElementById("pop_catalog");
        const popAddress = document.getElementById("pop_address");
        let lastScrollTop = 0;
        let timer;
        document.addEventListener("windowScroll", function() {
            const scrollTop = window.scrollY;
            clearTimeout(timer);
            if (popSearch) if (scrollTop > startPoint) popSearch.classList.add("_pop-fix"); else popSearch.classList.remove("_pop-fix");
            if (popAddress) if (scrollTop > startPoint) popAddress.classList.add("_pop-fix"); else popAddress.classList.remove("_pop-fix");
            if (popCatalog) if (scrollTop > startPoint) popCatalog.classList.add("_pop-fix"); else popCatalog.classList.remove("_pop-fix");
            if (scrollTop >= startPoint) {
                if (!header.classList.contains("_header-scroll")) header.classList.add("_header-scroll");
                if (headerShow) {
                    if (scrollTop > lastScrollTop) header.classList.add("_header-show");
                    timer = setTimeout(() => {
                        header.classList.add("_header-show");
                    }, headerShowTimer);
                }
            } else {
                header.classList.remove("_header-scroll");
                if (headerShow) header.classList.remove("_header-show");
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    }
    setTimeout(() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", function(e) {
                document.dispatchEvent(windowScroll);
            });
        }
    }, 0);
    (() => {
        const mq = window.matchMedia("(max-width: 1199.98px)");
        const menuBody = document.querySelector(".menu__body");
        if (!menuBody) return;
        let bound = false;
        let unbinders = [];
        function openSubmenu(li) {
            li.classList.add("_submenu-open");
            menuBody.classList.add("_submenu-active");
        }
        function closeSubmenu(li) {
            li.classList.remove("_submenu-open");
            if (!menuBody.querySelector(".menu__item._submenu-open")) menuBody.classList.remove("_submenu-active");
        }
        function onRootLinkClick(e) {
            const link = e.currentTarget;
            const li = link.closest(".menu__item");
            const submenu = li?.querySelector(".menu__mobile-submenu");
            if (submenu) {
                e.preventDefault();
                openSubmenu(li);
            }
        }
        function onBackClick(e) {
            const btn = e.currentTarget;
            const submenu = btn.closest(".menu__mobile-submenu");
            const li = submenu?.closest(".menu__item");
            if (li) closeSubmenu(li);
        }
        function bindMobile() {
            if (bound) return;
            bound = true;
            menuBody.querySelectorAll(".menu__item > .menu__link").forEach(link => {
                const li = link.closest(".menu__item");
                if (li?.querySelector(".menu__mobile-submenu")) {
                    link.addEventListener("click", onRootLinkClick);
                    unbinders.push(() => link.removeEventListener("click", onRootLinkClick));
                }
            });
            menuBody.querySelectorAll(".menu__mobile-submenu .mobile-submenu__back").forEach(btn => {
                btn.addEventListener("click", onBackClick);
                unbinders.push(() => btn.removeEventListener("click", onBackClick));
            });
        }
        function unbindAll() {
            unbinders.forEach(fn => fn());
            unbinders = [];
            bound = false;
            menuBody.querySelectorAll(".menu__item._submenu-open").forEach(li => li.classList.remove("_submenu-open"));
            menuBody.classList.remove("_submenu-active");
        }
        function sync() {
            mq.matches ? bindMobile() : unbindAll();
        }
        sync();
        mq.addEventListener ? mq.addEventListener("change", sync) : mq.addListener(sync);
    })();
    addLoadedClass();
    menuInit();
    spoilers();
    headerScroll();
})();
