(() => {
    "use strict";
    document.addEventListener("click", e => {
        const btn = e.target.closest('[data-modal-name="video"][data-video-src]');
        if (!btn) return;
        const modal = document.getElementById("video");
        if (!modal) return;
        modal.dataset.src = btn.dataset.videoSrc;
        modal.dataset.type = btn.dataset.videoType || "youtube";
    }, true);
    const ytId = url => {
        const m = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([A-Za-z0-9_-]{6,})/);
        return m ? m[1] : null;
    };
    const buildYouTubeEmbed = url => {
        const id = ytId(url);
        if (!id) return null;
        return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`;
    };
    const mountIframe = (slot, src) => {
        const iframe = document.createElement("iframe");
        iframe.src = src;
        iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
        iframe.allowFullscreen = true;
        iframe.frameBorder = "0";
        iframe.style.width = "100%";
        iframe.style.aspectRatio = "16/9";
        iframe.style.maxHeight = "auto";
        slot.innerHTML = "";
        slot.appendChild(iframe);
    };
    const mountMP4 = async (slot, src) => {
        const v = document.createElement("video");
        v.src = src;
        v.controls = true;
        v.autoplay = true;
        v.muted = true;
        v.playsInline = true;
        v.style.width = "100%";
        v.style.maxHeight = "auto";
        v.style.aspectRatio = "16/9";
        slot.innerHTML = "";
        slot.appendChild(v);
        try {
            await v.play();
        } catch (_) {}
    };
    const clearSlot = slot => {
        slot.innerHTML = "";
    };
    (function connectVideoToModals() {
        const MODAL_ID = "video";
        modals.events.onOpen.add(MODAL_ID, {
            fn: () => {
                const modal = document.getElementById(MODAL_ID);
                if (!modal) return true;
                const slot = modal.querySelector("[data-video-slot]");
                if (!slot) return true;
                const type = (modal.dataset.type || "youtube").toLowerCase();
                const src = modal.dataset.src || "";
                if (!src) return true;
                if (type === "youtube") {
                    const url = buildYouTubeEmbed(src);
                    if (url) mountIframe(slot, url);
                } else if (type === "mp4") mountMP4(slot, src);
                return true;
            }
        });
        modals.events.onClose.add(MODAL_ID, {
            fn: () => {
                const modal = document.getElementById(MODAL_ID);
                if (!modal) return true;
                const slot = modal.querySelector("[data-video-slot]");
                if (slot) clearSlot(slot);
                return true;
            }
        });
    })();
})();
