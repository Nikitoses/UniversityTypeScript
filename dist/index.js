"use strict";
// -----------------------------
// 1. Enum
// -----------------------------
var StudentStatus;
(function (StudentStatus) {
    StudentStatus["Active"] = "Active";
    StudentStatus["Academic_Leave"] = "Academic_Leave";
    StudentStatus["Graduated"] = "Graduated";
    StudentStatus["Expelled"] = "Expelled";
})(StudentStatus || (StudentStatus = {}));
var CourseType;
(function (CourseType) {
    CourseType["Mandatory"] = "Mandatory";
    CourseType["Optional"] = "Optional";
    CourseType["Special"] = "Special";
})(CourseType || (CourseType = {}));
var Semester;
(function (Semester) {
    Semester["First"] = "First";
    Semester["Second"] = "Second";
})(Semester || (Semester = {}));
var Grade;
(function (Grade) {
    Grade[Grade["Excellent"] = 5] = "Excellent";
    Grade[Grade["Good"] = 4] = "Good";
    Grade[Grade["Satisfactory"] = 3] = "Satisfactory";
    Grade[Grade["Unsatisfactory"] = 2] = "Unsatisfactory";
})(Grade || (Grade = {}));
var Faculty;
(function (Faculty) {
    Faculty["Computer_Science"] = "Computer_Science";
    Faculty["Economics"] = "Economics";
    Faculty["Law"] = "Law";
    Faculty["Engineering"] = "Engineering";
})(Faculty || (Faculty = {}));
// -----------------------------
// 3. Клас UniversityManagementSystem
// -----------------------------
class UniversityManagementSystem {
    constructor() {
        this.students = [];
        this.courses = [];
        this.enrollments = [];
        this.grades = [];
        this.nextStudentId = 1;
    }
    /**
     * Приватний метод для пошуку студента.
     */
    getStudent(studentId) {
        return this.students.find((s) => s.id === studentId);
    }
    /**
     * Приватний метод для пошуку курсу.
     */
    getCourse(courseId) {
        return this.courses.find((c) => c.id === courseId);
    }
    /**
     * Перевіряє, чи студент записаний на курс.
     */
    isEnrolled(studentId, courseId) {
        return this.enrollments.some((e) => e.studentId === studentId && e.courseId === courseId);
    }
    /**
     * Повертає кількість студентів, записаних на певний курс.
     */
    getCourseLoad(courseId) {
        return this.enrollments.filter((e) => e.courseId === courseId).length;
    }
    // ------------------------
    // Публічні методи з завдання
    // ------------------------
    /**
     * Додає студента в систему, генеруючи для нього id.
     */
    enrollStudent(student) {
        const newStudent = Object.assign(Object.assign({}, student), { id: this.nextStudentId++ });
        this.students.push(newStudent);
        return newStudent;
    }
    /**
     * Додатковий метод: додати курс (зручно для демо).
     */
    addCourse(course) {
        const exists = !!this.getCourse(course.id);
        if (exists) {
            throw new Error(`Курс з id=${course.id} вже існує в системі.`);
        }
        this.courses.push(course);
    }
    /**
     * Реєстрація студента на курс.
     * Перевірка:
     * - існування студента та курсу;
     * - статус студента (має бути Active);
     * - відповідність факультету;
     * - наявність вільних місць на курсі;
     * - студент ще не зареєстрований на цей курс.
     */
    registerForCourse(studentId, courseId) {
        const student = this.getStudent(studentId);
        const course = this.getCourse(courseId);
        if (!student) {
            throw new Error(`Студента з id=${studentId} не знайдено.`);
        }
        if (!course) {
            throw new Error(`Курс з id=${courseId} не знайдено.`);
        }
        if (student.status !== StudentStatus.Active) {
            throw new Error(`Студент зі статусом ${student.status} не може зареєструватися на курс.`);
        }
        if (student.faculty !== course.faculty) {
            throw new Error(`Студент (факультет ${student.faculty}) не належить до факультету курсу (${course.faculty}).`);
        }
        const currentLoad = this.getCourseLoad(courseId);
        if (currentLoad >= course.maxStudents) {
            throw new Error(`Курс ${course.name} вже заповнений (макс. студентів: ${course.maxStudents}).`);
        }
        if (this.isEnrolled(studentId, courseId)) {
            throw new Error(`Студент ${studentId} вже зареєстрований на курс ${courseId}.`);
        }
        this.enrollments.push({ studentId, courseId });
    }
    /**
     * Виставлення оцінки студенту за курс.
     * Перевірка: студент повинен бути зареєстрований на курс.
     */
    setGrade(studentId, courseId, grade) {
        const student = this.getStudent(studentId);
        const course = this.getCourse(courseId);
        if (!student || !course) {
            throw new Error("Студент або курс не знайдені.");
        }
        if (!this.isEnrolled(studentId, courseId)) {
            throw new Error(`Неможливо виставити оцінку: студент ${studentId} не зареєстрований на курс ${courseId}.`);
        }
        const record = {
            studentId,
            courseId,
            grade,
            date: new Date(),
            semester: course.semester,
        };
        this.grades.push(record);
    }
    /**
     * Оновлення статусу студента з базовою валідацією.
     * Правило: з Graduated / Expelled повернутись у Active не можна.
     */
    updateStudentStatus(studentId, newStatus) {
        const student = this.getStudent(studentId);
        if (!student) {
            throw new Error(`Студента з id=${studentId} не знайдено.`);
        }
        const current = student.status;
        const finalStatus = current === StudentStatus.Graduated ||
            current === StudentStatus.Expelled;
        if (finalStatus && newStatus === StudentStatus.Active) {
            throw new Error(`Змінити статус з ${current} на Active заборонено.`);
        }
        student.status = newStatus;
    }
    /**
     * Повертає список студентів певного факультету.
     */
    getStudentsByFaculty(faculty) {
        return this.students.filter((s) => s.faculty === faculty);
    }
    /**
     * Повертає всі оцінки конкретного студента.
     */
    getStudentGrades(studentId) {
        return this.grades.filter((g) => g.studentId === studentId);
    }
    /**
     * Повертає доступні курси для факультету та семестру,
     * де ще є вільні місця.
     */
    getAvailableCourses(faculty, semester) {
        return this.courses.filter((c) => {
            const sameFaculty = c.faculty === faculty;
            const sameSemester = c.semester === semester;
            const hasFreeSlots = this.getCourseLoad(c.id) < c.maxStudents;
            return sameFaculty && sameSemester && hasFreeSlots;
        });
    }
    /**
     * Обчислює середній бал студента по всіх виставлених оцінках.
     * Якщо оцінок немає — повертається 0.
     */
    calculateAverageGrade(studentId) {
        const records = this.getStudentGrades(studentId);
        if (records.length === 0)
            return 0;
        const total = records.reduce((sum, r) => sum + r.grade, 0);
        const avg = total / records.length;
        return Math.round(avg * 100) / 100;
    }
    /**
     * Повертає список "відмінників" по факультету.
     * Критерій: середній бал >= 4.5.
     */
    getHonorsStudentsByFaculty(faculty) {
        const studentsOnFaculty = this.getStudentsByFaculty(faculty);
        return studentsOnFaculty.filter((s) => {
            const avg = this.calculateAverageGrade(s.id);
            return avg >= 4.5;
        });
    }
}
// -----------------------------
// 4. Невелика демонстрація
// -----------------------------
const ums = new UniversityManagementSystem();
// Курси
ums.addCourse({
    id: 1,
    name: "Вступ до програмування",
    type: CourseType.Mandatory,
    credits: 5,
    semester: Semester.First,
    faculty: Faculty.Computer_Science,
    maxStudents: 2,
});
ums.addCourse({
    id: 2,
    name: "Економіка підприємства",
    type: CourseType.Optional,
    credits: 4,
    semester: Semester.First,
    faculty: Faculty.Economics,
    maxStudents: 3,
});
// Студенти
const st1 = ums.enrollStudent({
    fullName: "Іван Іванов",
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2024-09-01"),
    groupNumber: "CS-11",
});
const st2 = ums.enrollStudent({
    fullName: "Марія Коваленко",
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2024-09-01"),
    groupNumber: "CS-11",
});
// Реєстрація на курс
ums.registerForCourse(st1.id, 1);
ums.registerForCourse(st2.id, 1);
// Оцінки
ums.setGrade(st1.id, 1, Grade.Excellent);
ums.setGrade(st2.id, 1, Grade.Good);
console.log("Студенти CS:", ums.getStudentsByFaculty(Faculty.Computer_Science));
console.log("Оцінки студента 1:", ums.getStudentGrades(st1.id));
console.log("Середній бал студента 1:", ums.calculateAverageGrade(st1.id));
console.log("Відмінники CS:", ums.getHonorsStudentsByFaculty(Faculty.Computer_Science));
console.log("Доступні курси CS, 1 семестр:", ums.getAvailableCourses(Faculty.Computer_Science, Semester.First));
