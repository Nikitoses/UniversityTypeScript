import { ModalOptions } from "../../types/sharedTypes.js";

let isOpened: boolean = false;

/**
 * Вмикає або вимикає видимість модального вікна.
 */
function setModalVisibility(
    overlay: HTMLDivElement,
    visible: boolean
): void {
    isOpened = visible;
    if (visible) {
        overlay.classList.add("modal-overlay--visible");
        document.body.style.overflow = "hidden";
    } else {
        overlay.classList.remove("modal-overlay--visible");
        document.body.style.overflow = "";
    }
}

/**
 * Ініціалізація модалки: обробники на відкриття/закриття та клавішу Escape.
 */
export function initModal(options: ModalOptions): void {
    const overlay: HTMLDivElement | null = document.getElementById(
        options.overlayId
    ) as HTMLDivElement | null;
    const openButton: HTMLButtonElement | null = document.getElementById(
        options.openButtonId
    ) as HTMLButtonElement | null;

    if (!overlay || !openButton) {
        console.warn("Modal: не знайдено необхідні елементи для ініціалізації.");
        return;
    }

    const closeElements: NodeListOf<HTMLElement> =
        overlay.querySelectorAll(options.closeSelector);

    openButton.addEventListener("click", (): void => {
        setModalVisibility(overlay, true);
    });

    closeElements.forEach((el: HTMLElement): void => {
        el.addEventListener("click", (): void => {
            setModalVisibility(overlay, false);
        });
    });

    overlay.addEventListener("click", (event: MouseEvent): void => {
        if (event.target === overlay) {
            setModalVisibility(overlay, false);
        }
    });

    window.addEventListener("keydown", (event: KeyboardEvent): void => {
        if (event.key === "Escape" && isOpened) {
            setModalVisibility(overlay, false);
        }
    });
}
