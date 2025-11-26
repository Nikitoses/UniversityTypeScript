const productTitle: string = "Навчальний курс TypeScript";
const productPrice: number = 499;
const isActive: boolean = true;

/**
 * Формує рядок з коротким описом товару.
 */
function buildProductInfo(
    title: string,
    price: number,
    active: boolean
): string {
    const statusText: string = active ? "доступний" : "тимчасово недоступний";
    return `Товар: ${title} | Ціна: ${price} грн | Статус: ${statusText}`;
}

const productInfo: string = buildProductInfo(
    productTitle,
    productPrice,
    isActive
);

console.log(productInfo);
