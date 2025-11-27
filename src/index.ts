// -----------------------------
// 1. Enum
// -----------------------------

enum StudentStatus {
    Active = "Active",
    Academic_Leave = "Academic_Leave",
    Graduated = "Graduated",
    Expelled = "Expelled",
}

enum CourseType {
    Mandatory = "Mandatory",
    Optional = "Optional",
    Special = "Special",
}

enum Semester {
    First = "First",
    Second = "Second",
}

enum Grade {
    Excellent = 5,
    Good = 4,
    Satisfactory = 3,
    Unsatisfactory = 2,
}

enum Faculty {
    Computer_Science = "Computer_Science",
    Economics = "Economics",
    Law = "Law",
    Engineering = "Engineering",
}

// -----------------------------
// 2. Інтерфейси
// -----------------------------

interface Student {
    id: number;
    fullName: string;
    faculty: Faculty;
    year: number;
    status: StudentStatus;
    enrollmentDate: Date;
    groupNumber: string;
}

interface Course {
    id: number;
    name: string;
    type: CourseType;
    credits: number;
    semester: Semester;
    faculty: Faculty;
    maxStudents: number;
}

/**
 * Інтерфейс для запису оцінки (замість назви Grade, щоб не конфліктувати з enum).
 */
interface GradeRecord {
    studentId: number;
    courseId: number;
    grade: Grade;
    date: Date;
    semester: Semester;
}

/**
 * Внутрішній тип зв'язку "студент зареєстрований на курс".
 */
interface Enrollment {
    studentId: number;
    courseId: number;
}

// -----------------------------
// 3. Клас UniversityManagementSystem
// -----------------------------

class UniversityManagementSystem {
    private students: Student[] = [];
    private courses: Course[] = [];
    private enrollments: Enrollment[] = [];
    private grades: GradeRecord[] = [];

    private nextStudentId: number = 1;

    /**
     * Приватний метод для пошуку студента.
     */
    private getStudent(studentId: number): Student | undefined {
        return this.students.find((s: Student) => s.id === studentId);
    }

    /**
     * Приватний метод для пошуку курсу.
     */
    private getCourse(courseId: number): Course | undefined {
        return this.courses.find((c: Course) => c.id === courseId);
    }

    /**
     * Перевіряє, чи студент записаний на курс.
     */
    private isEnrolled(studentId: number, courseId: number): boolean {
        return this.enrollments.some(
            (e: Enrollment) =>
                e.studentId === studentId && e.courseId === courseId
        );
    }

    /**
     * Повертає кількість студентів, записаних на певний курс.
     */
    private getCourseLoad(courseId: number): number {
        return this.enrollments.filter(
            (e: Enrollment) => e.courseId === courseId
        ).length;
    }

    // ------------------------
    // Публічні методи з завдання
    // ------------------------

    /**
     * Додає студента в систему, генеруючи для нього id.
     */
    enrollStudent(student: Omit<Student, "id">): Student {
        const newStudent: Student = {
            ...student,
            id: this.nextStudentId++,
        };
        this.students.push(newStudent);
        return newStudent;
    }

    /**
     * Додатковий метод: додати курс (зручно для демо).
     */
    addCourse(course: Course): void {
        const exists: boolean = !!this.getCourse(course.id);
        if (exists) {
            throw new Error(
                `Курс з id=${course.id} вже існує в системі.`
            );
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
    registerForCourse(studentId: number, courseId: number): void {
        const student: Student | undefined =
            this.getStudent(studentId);
        const course: Course | undefined = this.getCourse(courseId);

        if (!student) {
            throw new Error(`Студента з id=${studentId} не знайдено.`);
        }
        if (!course) {
            throw new Error(`Курс з id=${courseId} не знайдено.`);
        }

        if (student.status !== StudentStatus.Active) {
            throw new Error(
                `Студент зі статусом ${student.status} не може зареєструватися на курс.`
            );
        }

        if (student.faculty !== course.faculty) {
            throw new Error(
                `Студент (факультет ${student.faculty}) не належить до факультету курсу (${course.faculty}).`
            );
        }

        const currentLoad: number = this.getCourseLoad(courseId);
        if (currentLoad >= course.maxStudents) {
            throw new Error(
                `Курс ${course.name} вже заповнений (макс. студентів: ${course.maxStudents}).`
            );
        }

        if (this.isEnrolled(studentId, courseId)) {
            throw new Error(
                `Студент ${studentId} вже зареєстрований на курс ${courseId}.`
            );
        }

        this.enrollments.push({ studentId, courseId });
    }

    /**
     * Виставлення оцінки студенту за курс.
     * Перевірка: студент повинен бути зареєстрований на курс.
     */
    setGrade(
        studentId: number,
        courseId: number,
        grade: Grade
    ): void {
        const student: Student | undefined =
            this.getStudent(studentId);
        const course: Course | undefined = this.getCourse(courseId);

        if (!student || !course) {
            throw new Error("Студент або курс не знайдені.");
        }

        if (!this.isEnrolled(studentId, courseId)) {
            throw new Error(
                `Неможливо виставити оцінку: студент ${studentId} не зареєстрований на курс ${courseId}.`
            );
        }

        const record: GradeRecord = {
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
    updateStudentStatus(
        studentId: number,
        newStatus: StudentStatus
    ): void {
        const student: Student | undefined =
            this.getStudent(studentId);

        if (!student) {
            throw new Error(`Студента з id=${studentId} не знайдено.`);
        }

        const current: StudentStatus = student.status;

        const finalStatus: boolean =
            current === StudentStatus.Graduated ||
            current === StudentStatus.Expelled;

        if (finalStatus && newStatus === StudentStatus.Active) {
            throw new Error(
                `Змінити статус з ${current} на Active заборонено.`
            );
        }

        student.status = newStatus;
    }

    /**
     * Повертає список студентів певного факультету.
     */
    getStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students.filter(
            (s: Student): boolean => s.faculty === faculty
        );
    }

    /**
     * Повертає всі оцінки конкретного студента.
     */
    getStudentGrades(studentId: number): GradeRecord[] {
        return this.grades.filter(
            (g: GradeRecord): boolean => g.studentId === studentId
        );
    }

    /**
     * Повертає доступні курси для факультету та семестру,
     * де ще є вільні місця.
     */
    getAvailableCourses(
        faculty: Faculty,
        semester: Semester
    ): Course[] {
        return this.courses.filter((c: Course): boolean => {
            const sameFaculty: boolean = c.faculty === faculty;
            const sameSemester: boolean = c.semester === semester;
            const hasFreeSlots: boolean =
                this.getCourseLoad(c.id) < c.maxStudents;
            return sameFaculty && sameSemester && hasFreeSlots;
        });
    }

    /**
     * Обчислює середній бал студента по всіх виставлених оцінках.
     * Якщо оцінок немає — повертається 0.
     */
    calculateAverageGrade(studentId: number): number {
        const records: GradeRecord[] = this.getStudentGrades(studentId);

        if (records.length === 0) return 0;

        const total: number = records.reduce(
            (sum: number, r: GradeRecord): number => sum + r.grade,
            0
        );
        const avg: number = total / records.length;

        return Math.round(avg * 100) / 100;
    }

    /**
     * Повертає список "відмінників" по факультету.
     * Критерій: середній бал >= 4.5.
     */
    getHonorsStudentsByFaculty(faculty: Faculty): Student[] {
        const studentsOnFaculty: Student[] =
            this.getStudentsByFaculty(faculty);

        return studentsOnFaculty.filter((s: Student): boolean => {
            const avg: number = this.calculateAverageGrade(s.id);
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
console.log(
    "Відмінники CS:",
    ums.getHonorsStudentsByFaculty(Faculty.Computer_Science)
);
console.log(
    "Доступні курси CS, 1 семестр:",
    ums.getAvailableCourses(Faculty.Computer_Science, Semester.First)
);
