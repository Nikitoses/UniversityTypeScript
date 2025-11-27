// ----------------------------
// 1. Базові типи товарів
// ----------------------------

type BaseProduct = {
    id: number;
    name: string;
    price: number;
    description: string;
    inStock: boolean;
};

/**
 * Електронні пристрої.
 */
type Electronics = BaseProduct & {
    category: "electronics";
    brand: string;
    warrantyMonths: number;
};

/**
 * Одяг.
 */
type Clothing = BaseProduct & {
    category: "clothing";
    size: "XS" | "S" | "M" | "L" | "XL";
    color: string;
};

/**
 * Книги (додатковий тип товару).
 */
type Book = BaseProduct & {
    category: "book";
    author: string;
    pages: number;
};

// ----------------------------
// 2. Generic-функції пошуку/фільтрації
// ----------------------------

/**
 * Шукає товар за id в масиві.
 */
const findProduct = <T extends BaseProduct>(
    products: T[],
    id: number
): T | undefined => {
    if (!Array.isArray(products)) {
        console.warn("findProduct: некоректний масив товарів");
        return undefined;
    }

    return products.find((item: T): boolean => item.id === id);
};

/**
 * Повертає усі товари, ціна яких менша або дорівнює maxPrice.
 */
const filterByPrice = <T extends BaseProduct>(
    products: T[],
    maxPrice: number
): T[] => {
    if (!Array.isArray(products) || maxPrice < 0) {
        console.warn("filterByPrice: некоректні вхідні дані");
        return [];
    }

    return products.filter((item: T): boolean => item.price <= maxPrice);
};

// ----------------------------
// 3. Кошик з товарами
// ----------------------------

type CartItem<T> = {
    product: T;
    quantity: number;
};

/**
 * Додає товар у кошик. Якщо товар уже є — збільшує кількість.
 */
const addToCart = <T extends BaseProduct>(
    cart: CartItem<T>[],
    product: T,
    quantity: number
): CartItem<T>[] => {
    if (quantity <= 0) {
        console.warn("addToCart: кількість має бути більшою за 0");
        return cart;
    }

    if (!product.inStock) {
        console.warn(`addToCart: товар "${product.name}" відсутній на складі`);
        return cart;
    }

    const index: number = cart.findIndex(
        (item: CartItem<T>): boolean => item.product.id === product.id
    );

    if (index !== -1) {
        const updated: CartItem<T>[] = [...cart];
        updated[index] = {
            ...updated[index],
            quantity: updated[index].quantity + quantity,
        };
        return updated;
    }

    return [...cart, { product, quantity }];
};

/**
 * Обчислює сумарну вартість кошика.
 */
const calculateTotal = <T extends BaseProduct>(
    cart: CartItem<T>[]
): number => {
    if (!Array.isArray(cart)) {
        console.warn("calculateTotal: некоректний кошик");
        return 0;
    }

    return cart.reduce((acc: number, item: CartItem<T>): number => {
        if (item.quantity <= 0 || item.product.price < 0) {
            console.warn(
                `calculateTotal: пропущено товар з некоректними даними (${item.product.name})`
            );
            return acc;
        }
        return acc + item.product.price * item.quantity;
    }, 0);
};

// ----------------------------
// 4. Тестові дані та використання
// ----------------------------

const electronicsProducts: Electronics[] = [
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

const clothingProducts: Clothing[] = [
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

const bookProducts: Book[] = [
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
const foundPhone: Electronics | undefined = findProduct<Electronics>(
    electronicsProducts,
    1
);

// Фільтрація дешевих товарів
const cheapElectronics: Electronics[] = filterByPrice<Electronics>(
    electronicsProducts,
    5000
);

// Приклад кошика з електронікою
let electronicCart: CartItem<Electronics>[] = [];

if (foundPhone) {
    electronicCart = addToCart(electronicCart, foundPhone, 1);
}

const totalElectronics: number = calculateTotal(electronicCart);

// Змішаний кошик (якщо дуже хочеться)
let mixedCart: CartItem<BaseProduct>[] = [];

if (foundPhone) {
    mixedCart = addToCart<BaseProduct>(mixedCart, foundPhone, 1);
}
mixedCart = addToCart<BaseProduct>(
    mixedCart,
    bookProducts[0],
    2
);

const totalMixed: number = calculateTotal<BaseProduct>(mixedCart);

console.log("Знайдений телефон:", foundPhone);
console.log("Дешева електроніка:", cheapElectronics);
console.log("Сума електронного кошика:", totalElectronics);
console.log("Змішаний кошик:", mixedCart);
console.log("Сума змішаного кошика:", totalMixed);
