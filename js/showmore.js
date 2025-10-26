(() => {
    "use strict";
    function showMore() {
        window.addEventListener("load", function () {
            const showMoreBlocks = document.querySelectorAll('[data-showmore]');
            let showMoreBlocksRegular;
            let mdQueriesArray;
            if (showMoreBlocks.length) {
                // Получение обычных объектов
                showMoreBlocksRegular = Array.from(showMoreBlocks).filter(function (item, index, self) {
                    return !item.dataset.showmoreMedia;
                });
                // Инициализация обычных объектов
                showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;

                document.addEventListener("click", showMoreActions);
                window.addEventListener("resize", showMoreActions);

                // Получение объектов с медиа-запросами
                mdQueriesArray = dataMediaQueries(showMoreBlocks, "showmoreMedia");
                if (mdQueriesArray && mdQueriesArray.length) {
                    mdQueriesArray.forEach(mdQueriesItem => {
                        // Событие
                        mdQueriesItem.matchMedia.addEventListener("change", function () {
                            initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                        });
                    });
                    initItemsMedia(mdQueriesArray);
                }
            }
            function initItemsMedia(mdQueriesArray) {
                mdQueriesArray.forEach(mdQueriesItem => {
                    initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                });
            }
            function initItems(showMoreBlocks, matchMedia) {
                showMoreBlocks.forEach(showMoreBlock => {
                    initItem(showMoreBlock, matchMedia);
                });
            }
            function initItem(showMoreBlock, matchMedia = false) {
                showMoreBlock = matchMedia ? showMoreBlock.item : showMoreBlock;

                let showMoreContent = Array.from(showMoreBlock.querySelectorAll('[data-showmore-content]'))
                    .find(item => item.closest('[data-showmore]') === showMoreBlock);
                let showMoreButton = Array.from(showMoreBlock.querySelectorAll('[data-showmore-button]'))
                    .find(item => item.closest('[data-showmore]') === showMoreBlock);

                if (!showMoreContent || !showMoreButton) return;

                const type = showMoreBlock.dataset.showmore || 'size';

                // ✅ Ранний выход для режима items: если элементов ≤ лимита — разворачиваем и скрываем кнопку
                if (type === 'items') {
                    const limit = parseInt(showMoreContent.dataset.showmoreContent, 10) || 3;
                    const visibleItems = Array.from(showMoreContent.children)
                        .filter(el => getComputedStyle(el).display !== 'none');

                    if (visibleItems.length <= limit) {
                        _slideDown(showMoreContent, 0, showMoreContent.scrollHeight);
                        showMoreButton.hidden = true;
                        showMoreBlock.classList.remove('_showmore-active');
                        return; // ⬅️ важно
                    }
                }

                const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
                const full = getOriginalHeight(showMoreContent);
                const canCollapse = hiddenHeight + 0.5 < full; // небольшой зазор на округления

                if (matchMedia.matches || !matchMedia) {
                    if (canCollapse) {
                        _slideUp(
                            showMoreContent,
                            0,
                            showMoreBlock.classList.contains('_showmore-active') ? full : hiddenHeight
                        );
                        showMoreButton.hidden = false;
                        const expanded = showMoreBlock.classList.contains('_showmore-active');
                    } else {
                        _slideDown(showMoreContent, 0, full);
                        showMoreButton.hidden = true;
                        showMoreButton.setAttribute('aria-expanded', 'true');
                        showMoreBlock.classList.remove('_showmore-active');
                    }
                } else {
                    _slideDown(showMoreContent, 0, full);
                    showMoreButton.hidden = true;
                    showMoreBlock.classList.remove('_showmore-active');
                }
            }

            function getHeight(showMoreBlock, showMoreContent) {
                let hiddenHeight = 0;
                const showMoreType = showMoreBlock.dataset.showmore || 'size';
                const rowGap = parseFloat(getComputedStyle(showMoreContent).rowGap) || 0;

                if (showMoreType === 'items') {
                    const showMoreTypeValue = parseInt(showMoreContent.dataset.showmoreContent, 10) || 3;
                    const showMoreItems = Array.from(showMoreContent.children)
                        .filter(el => getComputedStyle(el).display !== 'none');

                    // ✅ Если элементов ≤ лимита — нечего сворачивать
                    if (showMoreItems.length <= showMoreTypeValue) {
                        return showMoreContent.scrollHeight;
                    }

                    // Суммируем высоту первых N элементов (учитываем отступы)
                    for (let index = 1; index <= showMoreItems.length; index++) {
                        const showMoreItem = showMoreItems[index - 1];
                        const cs = getComputedStyle(showMoreItem);
                        const marginTop = parseFloat(cs.marginTop) || 0;
                        const marginBottom = parseFloat(cs.marginBottom) || 0;

                        hiddenHeight += showMoreItem.offsetHeight + marginTop;
                        if (index === showMoreTypeValue) break;
                        hiddenHeight += marginBottom;
                    }

                    if (rowGap) hiddenHeight += (showMoreTypeValue - 1) * rowGap;

                } else {
                    const showMoreTypeValue = parseFloat(showMoreContent.dataset.showmoreContent) || 150;
                    hiddenHeight = showMoreTypeValue;
                }
                return hiddenHeight;
            }

            function getOriginalHeight(showMoreContent) {
                let parentHidden;
                let hiddenHeight = showMoreContent.offsetHeight;
                showMoreContent.style.removeProperty('height');
                if (showMoreContent.closest(`[hidden]`)) {
                    parentHidden = showMoreContent.closest(`[hidden]`);
                    parentHidden.hidden = false;
                }
                let originalHeight = showMoreContent.offsetHeight;
                parentHidden ? parentHidden.hidden = true : null;
                showMoreContent.style.height = `${hiddenHeight}px`;
                return originalHeight;
            }
            function showMoreActions(e) {
                const targetType = e.type;

                if (targetType === 'click') {
                    const btn = e.target.closest('[data-showmore-button]');
                    if (btn) {
                        e.preventDefault();
                        const block = btn.closest('[data-showmore]');
                        const content = block.querySelector('[data-showmore-content]');
                        if (!content) return;

                        // ✅ Скорость: ищем в нескольких местах (speed в мс)
                        const speed =
                            parseInt(block.dataset.showmoreSpeed, 10) ||
                            parseInt(content.dataset.showmoreSpeed, 10) ||
                            parseInt(btn.dataset.showmoreSpeed, 10) ||
                            500;

                        const hiddenHeight = getHeight(block, content);

                        if (!content.classList.contains('_slide')) {
                            const willOpen = !block.classList.contains('_showmore-active');
                            willOpen ? _slideDown(content, speed, hiddenHeight) : _slideUp(content, speed, hiddenHeight);
                            block.classList.toggle('_showmore-active');
                        }
                    }
                } else if (targetType === 'resize') {
                    showMoreBlocksRegular && showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
                    mdQueriesArray && mdQueriesArray.length ? initItemsMedia(mdQueriesArray) : null;
                }
            }

        });
    }
    showMore();
})();
