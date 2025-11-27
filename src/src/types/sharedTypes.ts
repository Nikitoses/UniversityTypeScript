/**
 * Тип одного поста, отриманого з JSONPlaceholder.
 */
export type RemotePost = {
    userId: number;
    id: number;
    title: string;
    body: string;
};

/**
 * Налаштування для ініціалізації модального вікна.
 */
export type ModalOptions = {
    overlayId: string;
    openButtonId: string;
    closeSelector: string;
};

/**
 * Налаштування поведінки шапки при скролі.
 */
export type HeaderEffectOptions = {
    headerId: string;
    scrollLimit: number;
    scrolledClass: string;
};

/**
 * Налаштування для модуля з постами.
 */
export type PostsOptions = {
    triggerId: string;
    listId: string;
    apiUrl: string;
};
