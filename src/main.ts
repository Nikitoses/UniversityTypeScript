// Тип для постів з JSONPlaceholder
type ApiPost = {
    userId: number;
    id: number;
    title: string;
    body: string;
};

// Селектори для елементів сторінки
const headerElement: HTMLElement | null = document.getElementById("site-header");
const modalOverlay: HTMLDivElement | null = document.getElementById(
    "modal-overlay"
) as HTMLDivElement | null;
const openModalButton: HTMLButtonElement | null = document.getElementById(
    "open-modal-btn"
) as HTMLButtonElement | null;
const loadPostsButton: HTMLButtonElement | null = document.getElementById(
    "load-posts-btn"
) as HTMLButtonElement | null;
const postsList: HTMLUListElement | null = document.getElementById(
    "posts"
) as HTMLUListElement | null;

let modalVisible: boolean = false;

/**
 * Перемикає відображення модального вікна.
 */
function toggleModal(show: boolean): void {
    if (!modalOverlay) return;

    modalVisible = show;
    if (show) {
        modalOverlay.classList.add("modal-overlay--visible");
        document.body.style.overflow = "hidden";
    } else {
        modalOverlay.classList.remove("modal-overlay--visible");
        document.body.style.overflow = "";
    }
}

/**
 * Додає поведінку для модального вікна (кліки + Escape).
 */
function initModalLogic(): void {
    if (!openModalButton || !modalOverlay) return;

    const closeButton: HTMLButtonElement | null =
        modalOverlay.querySelector("[data-close-modal]");

    openModalButton.addEventListener("click", (): void => {
        toggleModal(true);
    });

    if (closeButton) {
        closeButton.addEventListener("click", (): void => {
            toggleModal(false);
        });
    }

    modalOverlay.addEventListener("click", (event: MouseEvent): void => {
        if (event.target === modalOverlay) {
            toggleModal(false);
        }
    });

    window.addEventListener("keydown", (event: KeyboardEvent): void => {
        if (event.key === "Escape" && modalVisible) {
            toggleModal(false);
        }
    });
}

/**
 * Змінює вигляд шапки при прокручуванні сторінки.
 */
function initHeaderScrollEffect(): void {
    if (!headerElement) return;

    window.addEventListener("scroll", (): void => {
        const scrolled: number = window.scrollY;
        if (scrolled > 30) {
            headerElement.classList.add("site-header--scrolled");
        } else {
            headerElement.classList.remove("site-header--scrolled");
        }
    });
}

/**
 * Створює HTML-елемент для одного поста.
 */
function createPostItem(post: ApiPost): HTMLLIElement {
    const li: HTMLLIElement = document.createElement("li");
    li.className = "post-item";
    li.innerHTML = `
    <h4>${post.title}</h4>
    <p>${post.body}</p>
  `;
    return li;
}

/**
 * Виводить повідомлення у список постів (наприклад "Завантаження...").
 */
function renderPostsMessage(message: string): void {
    if (!postsList) return;
    postsList.innerHTML = `<li class="post-item">${message}</li>`;
}

/**
 * Завантажує пости з JSONPlaceholder та відображає їх.
 */
async function loadAndRenderPosts(): Promise<void> {
    if (!postsList) return;

    renderPostsMessage("Завантаження...");

    try {
        const response: Response = await fetch(
            "https://jsonplaceholder.typicode.com/posts?_limit=6"
        );

        if (!response.ok) {
            throw new Error("Помилка HTTP");
        }

        const posts: ApiPost[] = await response.json();

        postsList.innerHTML = "";

        posts.forEach((post: ApiPost): void => {
            const li: HTMLLIElement = createPostItem(post);
            postsList.appendChild(li);
        });
    } catch (error: unknown) {
        console.error(error);
        renderPostsMessage("Не вдалося отримати дані. Спробуйте пізніше.");
    }
}

/**
 * Ініціалізує кнопку завантаження постів.
 */
function initPostsButton(): void {
    if (!loadPostsButton) return;
    loadPostsButton.addEventListener("click", (): void => {
        void loadAndRenderPosts();
    });
}

// Запускаємо ініціалізацію після завантаження DOM
document.addEventListener("DOMContentLoaded", (): void => {
    initModalLogic();
    initHeaderScrollEffect();
    initPostsButton();
});
