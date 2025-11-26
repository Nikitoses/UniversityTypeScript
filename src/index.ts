// ------------------------
// 1. Базові типи та alias'и
// ------------------------

export type DayOfWeek =
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday";

export type TimeSlot =
    | "8:30-10:00"
    | "10:15-11:45"
    | "12:15-13:45"
    | "14:00-15:30"
    | "15:45-17:15";

export type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";

export type Professor = {
    id: number;
    name: string;
    department: string;
};

export type Classroom = {
    number: string;
    capacity: number;
    hasProjector: boolean;
};

export type Course = {
    id: number;
    name: string;
    type: CourseType;
};

export type Lesson = {
    id: number;
    courseId: number;
    professorId: number;
    classroomNumber: string;
    dayOfWeek: DayOfWeek;
    timeSlot: TimeSlot;
};

// Конфлікт у розкладі
export type ScheduleConflict = {
    type: "ProfessorConflict" | "ClassroomConflict";
    lessonDetails: Lesson;
};

// ------------------------
// 2. Масиви даних
// ------------------------

export const professors: Professor[] = [];
export const classrooms: Classroom[] = [];
export const courses: Course[] = [];
export const schedule: Lesson[] = [];

// Для аналізу завантаженості аудиторій
const DAYS: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const SLOTS: TimeSlot[] = [
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
export function addProfessor(professor: Professor): void {
    const alreadyExists: boolean = professors.some(
        (p: Professor): boolean => p.id === professor.id
    );

    if (alreadyExists) {
        console.warn(`Професор з id=${professor.id} вже існує.`);
        return;
    }

    professors.push(professor);
}

/**
 * Перевіряє можливий конфлікт нового заняття з наявними.
 */
export function validateLesson(lesson: Lesson): ScheduleConflict | null {
    for (const existing of schedule) {
        const sameTimeAndDay: boolean =
            existing.dayOfWeek === lesson.dayOfWeek &&
            existing.timeSlot === lesson.timeSlot;

        if (!sameTimeAndDay) continue;

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
export function addLesson(lesson: Lesson): boolean {
    const conflict: ScheduleConflict | null = validateLesson(lesson);

    if (conflict !== null) {
        console.warn("Конфлікт під час додавання заняття:", conflict);
        return false;
    }

    schedule.push(lesson);
    return true;
}

// ------------------------
// 4. Пошук / фільтрація
// ------------------------

/**
 * Повертає номери аудиторій, які вільні в конкретний день та час.
 */
export function findAvailableClassrooms(
    timeSlot: TimeSlot,
    dayOfWeek: DayOfWeek
): string[] {
    const busyRooms: string[] = schedule
        .filter(
            (l: Lesson): boolean =>
                l.timeSlot === timeSlot && l.dayOfWeek === dayOfWeek
        )
        .map((l: Lesson): string => l.classroomNumber);

    return classrooms
        .filter(
            (room: Classroom): boolean => !busyRooms.includes(room.number)
        )
        .map((room: Classroom): string => room.number);
}

/**
 * Повертає масив занять конкретного викладача.
 */
export function getProfessorSchedule(
    professorId: number
): Lesson[] {
    return schedule.filter(
        (l: Lesson): boolean => l.professorId === professorId
    );
}

// ------------------------
// 5. Аналітика
// ------------------------

/**
 * Обчислює відсоток використання аудиторії відносно всіх можливих слотів.
 */
export function getClassroomUtilization(
    classroomNumber: string
): number {
    const totalSlots: number = DAYS.length * SLOTS.length;

    if (totalSlots === 0) return 0;

    const usedSlots: number = schedule.filter(
        (l: Lesson): boolean => l.classroomNumber === classroomNumber
    ).length;

    const ratio: number = (usedSlots / totalSlots) * 100;
    return Math.round(ratio * 10) / 10;
}

/**
 * Визначає найбільш популярний тип заняття (за кількістю Lesson).
 */
export function getMostPopularCourseType(): CourseType {
    if (schedule.length === 0) {
        console.warn(
            "Розклад порожній, повертаю тип за замовчуванням 'Lecture'."
        );
        return "Lecture";
    }

    const counters: Record<CourseType, number> = {
        Lecture: 0,
        Seminar: 0,
        Lab: 0,
        Practice: 0,
    };

    for (const l of schedule) {
        const course: Course | undefined = courses.find(
            (c: Course): boolean => c.id === l.courseId
        );
        if (!course) continue;
        counters[course.type] += 1;
    }

    let bestType: CourseType = "Lecture";
    let bestCount: number = counters["Lecture"];

    (["Seminar", "Lab", "Practice"] as CourseType[]).forEach(
        (t: CourseType): void => {
            if (counters[t] > bestCount) {
                bestCount = counters[t];
                bestType = t;
            }
        }
    );

    return bestType;
}

// ------------------------
// 6. Модифікація розкладу
// ------------------------

/**
 * Призначає для заняття іншу аудиторію, якщо вона вільна.
 */
export function reassignClassroom(
    lessonId: number,
    newClassroomNumber: string
): boolean {
    const lessonIndex: number = schedule.findIndex(
        (l: Lesson): boolean => l.id === lessonId
    );

    if (lessonIndex === -1) {
        console.warn(`Заняття з id=${lessonId} не знайдено.`);
        return false;
    }

    const existsRoom: boolean = classrooms.some(
        (room: Classroom): boolean => room.number === newClassroomNumber
    );

    if (!existsRoom) {
        console.warn(
            `Аудиторія ${newClassroomNumber} відсутня в списку аудиторій.`
        );
        return false;
    }

    const target: Lesson = schedule[lessonIndex];

    const conflictExists: boolean = schedule.some(
        (l: Lesson): boolean =>
            l.id !== target.id &&
            l.dayOfWeek === target.dayOfWeek &&
            l.timeSlot === target.timeSlot &&
            l.classroomNumber === newClassroomNumber
    );

    if (conflictExists) {
        console.warn(
            `Не можна перенести заняття #${lessonId}, у ${newClassroomNumber} вже хтось є.`
        );
        return false;
    }

    schedule[lessonIndex] = {
        ...target,
        classroomNumber: newClassroomNumber,
    };

    return true;
}

/**
 * Повністю видаляє заняття з розкладу.
 */
export function cancelLesson(lessonId: number): void {
    const index: number = schedule.findIndex(
        (l: Lesson): boolean => l.id === lessonId
    );
    if (index === -1) {
        console.warn(
            `Спроба видалити заняття #${lessonId}, але такого немає.`
        );
        return;
    }
    schedule.splice(index, 1);
}

// ------------------------
// 7. Невелике демо роботи системи розкладу
// ------------------------

// Дні та слоти для зручності
const mon: DayOfWeek = "Monday";
const tue: DayOfWeek = "Tuesday";
const slotMorning: TimeSlot = "8:30-10:00";
const slotLate: TimeSlot = "12:15-13:45";

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
classrooms.push(
    { number: "A101", capacity: 30, hasProjector: true },
    { number: "A202", capacity: 20, hasProjector: false },
    { number: "B305", capacity: 40, hasProjector: true }
);

// Курси
courses.push(
    { id: 1, name: "TypeScript Basics", type: "Lecture" },
    { id: 2, name: "Лінійна алгебра", type: "Practice" },
    { id: 3, name: "Алгоритми", type: "Lecture" }
);

// Створюємо кілька занять
const lesson1: Lesson = {
    id: 1,
    courseId: 1,
    professorId: 1,
    classroomNumber: "A101",
    dayOfWeek: mon,
    timeSlot: slotMorning,
};

const lesson2: Lesson = {
    id: 2,
    courseId: 2,
    professorId: 2,
    classroomNumber: "A202",
    dayOfWeek: mon,
    timeSlot: slotMorning,
};

const lesson3: Lesson = {
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
const conflictLesson: Lesson = {
    id: 4,
    courseId: 1,
    professorId: 2,
    classroomNumber: "A101", // вже зайнята у понеділок 8:30-10:00
    dayOfWeek: mon,
    timeSlot: slotMorning,
};

console.log(
    "Додавання конфліктного заняття (очікуємо false):",
    addLesson(conflictLesson)
);

// Виводимо розклад викладача №1
const prof1Lessons: Lesson[] = getProfessorSchedule(1);
console.log("Розклад викладача #1:");
console.log(prof1Lessons);

// Пошук вільних аудиторій у понеділок 8:30–10:00
const freeRoomsMonMorning: string[] = findAvailableClassrooms(
    slotMorning,
    mon
);
console.log(
    "Вільні аудиторії у понеділок 8:30–10:00:",
    freeRoomsMonMorning
);

// Аналіз використання конкретної аудиторії
const utilizationA101: number = getClassroomUtilization("A101");
console.log("Завантаженість аудиторії A101 (%):", utilizationA101);

// Найпопулярніший тип занять (зараз в розкладі Lecture/Practice)
const popularType: CourseType = getMostPopularCourseType();
console.log("Найпопулярніший тип занять:", popularType);

// Спроба перенести заняття #1 в аудиторію A202 у той самий час
console.log(
    "Перенесення lesson1 в A202 (очікуємо конфлікт):",
    reassignClassroom(1, "A202")
);

// Перенесення заняття #1 в B305 (там інший день/слот, тож конфлікту немає)
console.log(
    "Перенесення lesson1 в B305 (очікуємо успіх):",
    reassignClassroom(1, "B305")
);

console.log("Розклад після зміни аудиторії для lesson1:", schedule);

// Відміна заняття #2
cancelLesson(2);
console.log("Розклад після відміни lesson2:", schedule);
