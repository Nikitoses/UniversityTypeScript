let isOpened = false;
/**
 * Вмикає або вимикає видимість модального вікна.
 */
function setModalVisibility(overlay, visible) {
    isOpened = visible;
    if (visible) {
        overlay.classList.add("modal-overlay--visible");
        document.body.style.overflow = "hidden";
    }
    else {
        overlay.classList.remove("modal-overlay--visible");
        document.body.style.overflow = "";
    }
}
/**
 * Ініціалізація модалки: обробники на відкриття/закриття та клавішу Escape.
 */
export function initModal(options) {
    const overlay = document.getElementById(options.overlayId);
    const openButton = document.getElementById(options.openButtonId);
    if (!overlay || !openButton) {
        console.warn("Modal: не знайдено необхідні елементи для ініціалізації.");
        return;
    }
    const closeElements = overlay.querySelectorAll(options.closeSelector);
    openButton.addEventListener("click", () => {
        setModalVisibility(overlay, true);
    });
    closeElements.forEach((el) => {
        el.addEventListener("click", () => {
            setModalVisibility(overlay, false);
        });
    });
    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
            setModalVisibility(overlay, false);
        }
    });
    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && isOpened) {
            setModalVisibility(overlay, false);
        }
    });
}
