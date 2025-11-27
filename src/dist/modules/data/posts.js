var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Створює елемент списку для одного поста.
 */
function buildPostItem(post) {
    const li = document.createElement("li");
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
function showMessage(list, text) {
    list.innerHTML = `<li class="post-item">${text}</li>`;
}
/**
 * Завантажує дані з API та оновлює DOM.
 */
function fetchAndRender(list, apiUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        showMessage(list, "Завантаження...");
        try {
            const response = yield fetch(apiUrl);
            if (!response.ok) {
                throw new Error("HTTP error");
            }
            const posts = yield response.json();
            list.innerHTML = "";
            posts.forEach((post) => {
                list.appendChild(buildPostItem(post));
            });
        }
        catch (error) {
            console.error(error);
            showMessage(list, "Не вдалося отримати дані.");
        }
    });
}
/**
 * Налаштовує кнопку, яка завантажує пости в список.
 */
export function initPostsModule(options) {
    const trigger = document.getElementById(options.triggerId);
    const list = document.getElementById(options.listId);
    if (!trigger || !list) {
        console.warn("PostsModule: кнопка чи список не знайдені.");
        return;
    }
    trigger.addEventListener("click", () => {
        void fetchAndRender(list, options.apiUrl);
    });
}
