"use strict";
// ------------------------
// 1. Базові типи та alias'и
// ------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedule = exports.courses = exports.classrooms = exports.professors = void 0;
exports.addProfessor = addProfessor;
exports.validateLesson = validateLesson;
exports.addLesson = addLesson;
exports.findAvailableClassrooms = findAvailableClassrooms;
exports.getProfessorSchedule = getProfessorSchedule;
exports.getClassroomUtilization = getClassroomUtilization;
exports.getMostPopularCourseType = getMostPopularCourseType;
exports.reassignClassroom = reassignClassroom;
exports.cancelLesson = cancelLesson;
// ------------------------
// 2. Масиви даних
// ------------------------
exports.professors = [];
exports.classrooms = [];
exports.courses = [];
exports.schedule = [];
// Для аналізу завантаженості аудиторій
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const SLOTS = [
    "8:30-10:00",
    "10:15-11:45",
    "12:15-13:45",
    "14:00-15:30",
    "15:45-17:15",
];
// ------------------------
// 3. Додавання викладача та занять
// ------------------------
/**
 * Додає нового викладача, якщо ще не існує такого id.
 */
function addProfessor(professor) {
    const alreadyExists = exports.professors.some((p) => p.id === professor.id);
    if (alreadyExists) {
        console.warn(`Професор з id=${professor.id} вже існує.`);
        return;
    }
    exports.professors.push(professor);
}
/**
 * Перевіряє можливий конфлікт нового заняття з наявними.
 */
function validateLesson(lesson) {
    for (const existing of exports.schedule) {
        const sameTimeAndDay = existing.dayOfWeek === lesson.dayOfWeek &&
            existing.timeSlot === lesson.timeSlot;
        if (!sameTimeAndDay)
            continue;
        if (existing.professorId === lesson.professorId) {
            return {
                type: "ProfessorConflict",
                lessonDetails: existing,
            };
        }
        if (existing.classroomNumber === lesson.classroomNumber) {
            return {
                type: "ClassroomConflict",
                lessonDetails: existing,
            };
        }
    }
    return null;
}
/**
 * Додає заняття в розклад, якщо перевірка пройшла без конфлікту.
 */
function addLesson(lesson) {
    const conflict = validateLesson(lesson);
    if (conflict !== null) {
        console.warn("Конфлікт під час додавання заняття:", conflict);
        return false;
    }
    exports.schedule.push(lesson);
    return true;
}
// ------------------------
// 4. Пошук / фільтрація
// ------------------------
/**
 * Повертає номери аудиторій, які вільні в конкретний день та час.
 */
function findAvailableClassrooms(timeSlot, dayOfWeek) {
    const busyRooms = exports.schedule
        .filter((l) => l.timeSlot === timeSlot && l.dayOfWeek === dayOfWeek)
        .map((l) => l.classroomNumber);
    return exports.classrooms
        .filter((room) => !busyRooms.includes(room.number))
        .map((room) => room.number);
}
/**
 * Повертає масив занять конкретного викладача.
 */
function getProfessorSchedule(professorId) {
    return exports.schedule.filter((l) => l.professorId === professorId);
}
// ------------------------
// 5. Аналітика
// ------------------------
/**
 * Обчислює відсоток використання аудиторії відносно всіх можливих слотів.
 */
function getClassroomUtilization(classroomNumber) {
    const totalSlots = DAYS.length * SLOTS.length;
    if (totalSlots === 0)
        return 0;
    const usedSlots = exports.schedule.filter((l) => l.classroomNumber === classroomNumber).length;
    const ratio = (usedSlots / totalSlots) * 100;
    return Math.round(ratio * 10) / 10;
}
/**
 * Визначає найбільш популярний тип заняття (за кількістю Lesson).
 */
function getMostPopularCourseType() {
    if (exports.schedule.length === 0) {
        console.warn("Розклад порожній, повертаю тип за замовчуванням 'Lecture'.");
        return "Lecture";
    }
    const counters = {
        Lecture: 0,
        Seminar: 0,
        Lab: 0,
        Practice: 0,
    };
    for (const l of exports.schedule) {
        const course = exports.courses.find((c) => c.id === l.courseId);
        if (!course)
            continue;
        counters[course.type] += 1;
    }
    let bestType = "Lecture";
    let bestCount = counters["Lecture"];
    ["Seminar", "Lab", "Practice"].forEach((t) => {
        if (counters[t] > bestCount) {
            bestCount = counters[t];
            bestType = t;
        }
    });
    return bestType;
}
// ------------------------
// 6. Модифікація розкладу
// ------------------------
/**
 * Призначає для заняття іншу аудиторію, якщо вона вільна.
 */
function reassignClassroom(lessonId, newClassroomNumber) {
    const lessonIndex = exports.schedule.findIndex((l) => l.id === lessonId);
    if (lessonIndex === -1) {
        console.warn(`Заняття з id=${lessonId} не знайдено.`);
        return false;
    }
    const existsRoom = exports.classrooms.some((room) => room.number === newClassroomNumber);
    if (!existsRoom) {
        console.warn(`Аудиторія ${newClassroomNumber} відсутня в списку аудиторій.`);
        return false;
    }
    const target = exports.schedule[lessonIndex];
    const conflictExists = exports.schedule.some((l) => l.id !== target.id &&
        l.dayOfWeek === target.dayOfWeek &&
        l.timeSlot === target.timeSlot &&
        l.classroomNumber === newClassroomNumber);
    if (conflictExists) {
        console.warn(`Не можна перенести заняття #${lessonId}, у ${newClassroomNumber} вже хтось є.`);
        return false;
    }
    exports.schedule[lessonIndex] = Object.assign(Object.assign({}, target), { classroomNumber: newClassroomNumber });
    return true;
}
/**
 * Повністю видаляє заняття з розкладу.
 */
function cancelLesson(lessonId) {
    const index = exports.schedule.findIndex((l) => l.id === lessonId);
    if (index === -1) {
        console.warn(`Спроба видалити заняття #${lessonId}, але такого немає.`);
        return;
    }
    exports.schedule.splice(index, 1);
}
// ------------------------
// 7. Невелике демо роботи системи розкладу
// ------------------------
// Дні та слоти для зручності
const mon = "Monday";
const tue = "Tuesday";
const slotMorning = "8:30-10:00";
const slotLate = "12:15-13:45";
// Додаємо викладачів
addProfessor({
    id: 1,
    name: "Петро Коваль",
    department: "Інформаційні системи",
});
addProfessor({
    id: 2,
    name: "Марія Лисенко",
    department: "Прикладна математика",
});
// Аудиторії
exports.classrooms.push({ number: "A101", capacity: 30, hasProjector: true }, { number: "A202", capacity: 20, hasProjector: false }, { number: "B305", capacity: 40, hasProjector: true });
// Курси
exports.courses.push({ id: 1, name: "TypeScript Basics", type: "Lecture" }, { id: 2, name: "Лінійна алгебра", type: "Practice" }, { id: 3, name: "Алгоритми", type: "Lecture" });
// Створюємо кілька занять
const lesson1 = {
    id: 1,
    courseId: 1,
    professorId: 1,
    classroomNumber: "A101",
    dayOfWeek: mon,
    timeSlot: slotMorning,
};
const lesson2 = {
    id: 2,
    courseId: 2,
    professorId: 2,
    classroomNumber: "A202",
    dayOfWeek: mon,
    timeSlot: slotMorning,
};
const lesson3 = {
    id: 3,
    courseId: 3,
    professorId: 1,
    classroomNumber: "B305",
    dayOfWeek: tue,
    timeSlot: slotLate,
};
// Пробуємо додати заняття до розкладу
console.log("Додавання lesson1:", addLesson(lesson1)); // очікуємо true
console.log("Додавання lesson2:", addLesson(lesson2)); // очікуємо true
console.log("Додавання lesson3:", addLesson(lesson3)); // очікуємо true
// Спроба створити конфлікт по аудиторії та часу
const conflictLesson = {
    id: 4,
    courseId: 1,
    professorId: 2,
    classroomNumber: "A101", // вже зайнята у понеділок 8:30-10:00
    dayOfWeek: mon,
    timeSlot: slotMorning,
};
console.log("Додавання конфліктного заняття (очікуємо false):", addLesson(conflictLesson));
// Виводимо розклад викладача №1
const prof1Lessons = getProfessorSchedule(1);
console.log("Розклад викладача #1:");
console.log(prof1Lessons);
// Пошук вільних аудиторій у понеділок 8:30–10:00
const freeRoomsMonMorning = findAvailableClassrooms(slotMorning, mon);
console.log("Вільні аудиторії у понеділок 8:30–10:00:", freeRoomsMonMorning);
// Аналіз використання конкретної аудиторії
const utilizationA101 = getClassroomUtilization("A101");
console.log("Завантаженість аудиторії A101 (%):", utilizationA101);
// Найпопулярніший тип занять (зараз в розкладі Lecture/Practice)
const popularType = getMostPopularCourseType();
console.log("Найпопулярніший тип занять:", popularType);
// Спроба перенести заняття #1 в аудиторію A202 у той самий час
console.log("Перенесення lesson1 в A202 (очікуємо конфлікт):", reassignClassroom(1, "A202"));
// Перенесення заняття #1 в B305 (там інший день/слот, тож конфлікту немає)
console.log("Перенесення lesson1 в B305 (очікуємо успіх):", reassignClassroom(1, "B305"));
console.log("Розклад після зміни аудиторії для lesson1:", exports.schedule);
// Відміна заняття #2
cancelLesson(2);
console.log("Розклад після відміни lesson2:", exports.schedule);
