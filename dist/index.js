"use strict";
// ----------------------------
// 1. Базові типи товарів
// ----------------------------
// ----------------------------
// 2. Generic-функції пошуку/фільтрації
// ----------------------------
/**
 * Шукає товар за id в масиві.
 */
const findProduct = (products, id) => {
    if (!Array.isArray(products)) {
        console.warn("findProduct: некоректний масив товарів");
        return undefined;
    }
    return products.find((item) => item.id === id);
};
/**
 * Повертає усі товари, ціна яких менша або дорівнює maxPrice.
 */
const filterByPrice = (products, maxPrice) => {
    if (!Array.isArray(products) || maxPrice < 0) {
        console.warn("filterByPrice: некоректні вхідні дані");
        return [];
    }
    return products.filter((item) => item.price <= maxPrice);
};
/**
 * Додає товар у кошик. Якщо товар уже є — збільшує кількість.
 */
const addToCart = (cart, product, quantity) => {
    if (quantity <= 0) {
        console.warn("addToCart: кількість має бути більшою за 0");
        return cart;
    }
    if (!product.inStock) {
        console.warn(`addToCart: товар "${product.name}" відсутній на складі`);
        return cart;
    }
    const index = cart.findIndex((item) => item.product.id === product.id);
    if (index !== -1) {
        const updated = [...cart];
        updated[index] = Object.assign(Object.assign({}, updated[index]), { quantity: updated[index].quantity + quantity });
        return updated;
    }
    return [...cart, { product, quantity }];
};
/**
 * Обчислює сумарну вартість кошика.
 */
const calculateTotal = (cart) => {
    if (!Array.isArray(cart)) {
        console.warn("calculateTotal: некоректний кошик");
        return 0;
    }
    return cart.reduce((acc, item) => {
        if (item.quantity <= 0 || item.product.price < 0) {
            console.warn(`calculateTotal: пропущено товар з некоректними даними (${item.product.name})`);
            return acc;
        }
        return acc + item.product.price * item.quantity;
    }, 0);
};
// ----------------------------
// 4. Тестові дані та використання
// ----------------------------
const electronicsProducts = [
    {
        id: 1,
        name: "Смартфон Nova",
        price: 12000,
        description: "6.1\" OLED, 128GB",
        inStock: true,
        category: "electronics",
        brand: "NovaTech",
        warrantyMonths: 18,
    },
    {
        id: 2,
        name: "Навушники AirSound",
        price: 3200,
        description: "Безпровідні навушники з шумозаглушенням",
        inStock: true,
        category: "electronics",
        brand: "SoundPro",
        warrantyMonths: 12,
    },
];
const clothingProducts = [
    {
        id: 10,
        name: "Футболка Basic",
        price: 600,
        description: "Біла базова футболка",
        inStock: true,
        category: "clothing",
        size: "M",
        color: "white",
    },
];
const bookProducts = [
    {
        id: 20,
        name: "TypeScript for Beginners",
        price: 900,
        description: "Посібник для початку роботи з TypeScript",
        inStock: true,
        category: "book",
        author: "A. Developer",
        pages: 280,
    },
];
// Пошук конкретного товару
const foundPhone = findProduct(electronicsProducts, 1);
// Фільтрація дешевих товарів
const cheapElectronics = filterByPrice(electronicsProducts, 5000);
// Приклад кошика з електронікою
let electronicCart = [];
if (foundPhone) {
    electronicCart = addToCart(electronicCart, foundPhone, 1);
}
const totalElectronics = calculateTotal(electronicCart);
// Змішаний кошик (якщо дуже хочеться)
let mixedCart = [];
if (foundPhone) {
    mixedCart = addToCart(mixedCart, foundPhone, 1);
}
mixedCart = addToCart(mixedCart, bookProducts[0], 2);
const totalMixed = calculateTotal(mixedCart);
console.log("Знайдений телефон:", foundPhone);
console.log("Дешева електроніка:", cheapElectronics);
console.log("Сума електронного кошика:", totalElectronics);
console.log("Змішаний кошик:", mixedCart);
console.log("Сума змішаного кошика:", totalMixed);
