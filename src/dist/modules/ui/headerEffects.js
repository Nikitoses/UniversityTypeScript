/**
 * Додає/прибирає CSS-клас для шапки при прокрутці.
 */
export function attachHeaderScrollEffect(options) {
    const header = document.getElementById(options.headerId);
    if (!header) {
        console.warn("HeaderEffects: елемент шапки не знайдено.");
        return;
    }
    window.addEventListener("scroll", () => {
        const y = window.scrollY;
        if (y > options.scrollLimit) {
            header.classList.add(options.scrolledClass);
        }
        else {
            header.classList.remove(options.scrolledClass);
        }
    });
}
