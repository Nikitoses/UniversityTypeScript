import { initModal } from "./modules/ui/modal.js";
import { attachHeaderScrollEffect } from "./modules/ui/headerEffects.js";
import { initPostsModule } from "./modules/data/posts.js";
function bootstrap() {
    const modalOptions = {
        overlayId: "modal-overlay",
        openButtonId: "open-modal-btn",
        closeSelector: "[data-close-modal]",
    };
    const headerOptions = {
        headerId: "site-header",
        scrollLimit: 25,
        scrolledClass: "site-header--scrolled",
    };
    const postsOptions = {
        triggerId: "load-posts-btn",
        listId: "posts",
        apiUrl: "https://jsonplaceholder.typicode.com/posts?_limit=4",
    };
    initModal(modalOptions);
    attachHeaderScrollEffect(headerOptions);
    initPostsModule(postsOptions);
}
document.addEventListener("DOMContentLoaded", () => {
    bootstrap();
});
