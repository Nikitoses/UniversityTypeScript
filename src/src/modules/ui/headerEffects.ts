import { HeaderEffectOptions } from "../../types/sharedTypes.js";

/**
 * Додає/прибирає CSS-клас для шапки при прокрутці.
 */
export function attachHeaderScrollEffect(
    options: HeaderEffectOptions
): void {
    const header: HTMLElement | null = document.getElementById(
        options.headerId
    );

    if (!header) {
        console.warn("HeaderEffects: елемент шапки не знайдено.");
        return;
    }

    window.addEventListener("scroll", (): void => {
        const y: number = window.scrollY;
        if (y > options.scrollLimit) {
            header.classList.add(options.scrolledClass);
        } else {
            header.classList.remove(options.scrolledClass);
        }
    });
}
