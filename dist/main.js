"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Селектори для елементів сторінки
const headerElement = document.getElementById("site-header");
const modalOverlay = document.getElementById("modal-overlay");
const openModalButton = document.getElementById("open-modal-btn");
const loadPostsButton = document.getElementById("load-posts-btn");
const postsList = document.getElementById("posts");
let modalVisible = false;
/**
 * Перемикає відображення модального вікна.
 */
function toggleModal(show) {
    if (!modalOverlay)
        return;
    modalVisible = show;
    if (show) {
        modalOverlay.classList.add("modal-overlay--visible");
        document.body.style.overflow = "hidden";
    }
    else {
        modalOverlay.classList.remove("modal-overlay--visible");
        document.body.style.overflow = "";
    }
}
/**
 * Додає поведінку для модального вікна (кліки + Escape).
 */
function initModalLogic() {
    if (!openModalButton || !modalOverlay)
        return;
    const closeButton = modalOverlay.querySelector("[data-close-modal]");
    openModalButton.addEventListener("click", () => {
        toggleModal(true);
    });
    if (closeButton) {
        closeButton.addEventListener("click", () => {
            toggleModal(false);
        });
    }
    modalOverlay.addEventListener("click", (event) => {
        if (event.target === modalOverlay) {
            toggleModal(false);
        }
    });
    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modalVisible) {
            toggleModal(false);
        }
    });
}
/**
 * Змінює вигляд шапки при прокручуванні сторінки.
 */
function initHeaderScrollEffect() {
    if (!headerElement)
        return;
    window.addEventListener("scroll", () => {
        const scrolled = window.scrollY;
        if (scrolled > 30) {
            headerElement.classList.add("site-header--scrolled");
        }
        else {
            headerElement.classList.remove("site-header--scrolled");
        }
    });
}
/**
 * Створює HTML-елемент для одного поста.
 */
function createPostItem(post) {
    const li = document.createElement("li");
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
function renderPostsMessage(message) {
    if (!postsList)
        return;
    postsList.innerHTML = `<li class="post-item">${message}</li>`;
}
/**
 * Завантажує пости з JSONPlaceholder та відображає їх.
 */
function loadAndRenderPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!postsList)
            return;
        renderPostsMessage("Завантаження...");
        try {
            const response = yield fetch("https://jsonplaceholder.typicode.com/posts?_limit=6");
            if (!response.ok) {
                throw new Error("Помилка HTTP");
            }
            const posts = yield response.json();
            postsList.innerHTML = "";
            posts.forEach((post) => {
                const li = createPostItem(post);
                postsList.appendChild(li);
            });
        }
        catch (error) {
            console.error(error);
            renderPostsMessage("Не вдалося отримати дані. Спробуйте пізніше.");
        }
    });
}
/**
 * Ініціалізує кнопку завантаження постів.
 */
function initPostsButton() {
    if (!loadPostsButton)
        return;
    loadPostsButton.addEventListener("click", () => {
        void loadAndRenderPosts();
    });
}
// Запускаємо ініціалізацію після завантаження DOM
document.addEventListener("DOMContentLoaded", () => {
    initModalLogic();
    initHeaderScrollEffect();
    initPostsButton();
});
