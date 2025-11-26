"use strict";
const productTitle = "Навчальний курс TypeScript";
const productPrice = 499;
const isActive = true;
/**
 * Формує рядок з коротким описом товару.
 */
function buildProductInfo(title, price, active) {
    const statusText = active ? "доступний" : "тимчасово недоступний";
    return `Товар: ${title} | Ціна: ${price} грн | Статус: ${statusText}`;
}
const productInfo = buildProductInfo(productTitle, productPrice, isActive);
console.log(productInfo);
