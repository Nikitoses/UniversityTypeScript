import { RemotePost, PostsOptions } from "../../types/sharedTypes.js";

/**
 * Створює елемент списку для одного поста.
 */
function buildPostItem(post: RemotePost): HTMLLIElement {
    const li: HTMLLIElement = document.createElement("li");
    li.className = "post-item";
    li.innerHTML = `
    <h4>${post.title}</h4>
    <p>${post.body}</p>
  `;
    return li;
}

/**
 * Показує в контейнері повідомлення (наприклад "Завантаження...").
 */
function showMessage(list: HTMLUListElement, text: string): void {
    list.innerHTML = `<li class="post-item">${text}</li>`;
}

/**
 * Завантажує дані з API та оновлює DOM.
 */
async function fetchAndRender(
    list: HTMLUListElement,
    apiUrl: string
): Promise<void> {
    showMessage(list, "Завантаження...");

    try {
        const response: Response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error("HTTP error");
        }

        const posts: RemotePost[] = await response.json();

        list.innerHTML = "";
        posts.forEach((post: RemotePost): void => {
            list.appendChild(buildPostItem(post));
        });
    } catch (error: unknown) {
        console.error(error);
        showMessage(list, "Не вдалося отримати дані.");
    }
}

/**
 * Налаштовує кнопку, яка завантажує пости в список.
 */
export function initPostsModule(options: PostsOptions): void {
    const trigger: HTMLButtonElement | null = document.getElementById(
        options.triggerId
    ) as HTMLButtonElement | null;
    const list: HTMLUListElement | null = document.getElementById(
        options.listId
    ) as HTMLUListElement | null;

    if (!trigger || !list) {
        console.warn("PostsModule: кнопка чи список не знайдені.");
        return;
    }

    trigger.addEventListener("click", (): void => {
        void fetchAndRender(list, options.apiUrl);
    });
}
