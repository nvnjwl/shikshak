// AI Persona Selector - Intelligently selects the right teacher for each student

/**
 * Selects the appropriate teacher persona based on:
 * - Student's class
 * - Student's performance level
 * - Student's language preference
 * - Subject being taught
 */

import { class5Teachers } from './class5/index.js';

// Teacher selection logic
export function selectTeacher(studentProfile, subject = null) {
    const { class: studentClass, performance, languagePreference } = studentProfile;

    // Get teachers for the student's class
    const teachers = getTeachersForClass(studentClass);

    if (!teachers) {
        console.warn(`No teachers found for class ${studentClass}, using default`);
        return class5Teachers.priya; // Fallback
    }

    // Selection logic based on student profile
    return selectBestTeacher(teachers, performance, languagePreference);
}

// Get all teachers for a specific class
function getTeachersForClass(classNum) {
    const classTeachers = {
        5: class5Teachers,
        6: class5Teachers, // TODO: Add class 6 teachers
        7: class5Teachers, // TODO: Add class 7 teachers
        8: class5Teachers  // TODO: Add class 8 teachers
    };

    return classTeachers[classNum];
}

// Select best teacher based on student characteristics
function selectBestTeacher(teachers, performance, languagePreference) {
    // High performers (80%+) → Excellence Coach
    if (performance >= 80) {
        return teachers.rajesh || teachers.excellence_coach;
    }

    // Low performers (<60%) → Confidence Builder
    if (performance < 60) {
        return teachers.amit || teachers.confidence_builder;
    }

    // Medium performers with Hinglish preference → Loving Hinglish
    if (languagePreference === 'hinglish' || languagePreference === 'hindi') {
        return teachers.priya || teachers.loving_hinglish;
    }

    // Medium performers with English preference → Professional
    return teachers.kavita || teachers.professional;
}

// Build complete system prompt for the selected teacher
export function buildTeacherPrompt(teacher, subject, studentLevel, context = {}) {
    let prompt = teacher.systemPrompt;

    // Add subject-specific adaptation
    if (subject && teacher.subjectAdaptations[subject.toLowerCase()]) {
        const subjectAdaptation = teacher.subjectAdaptations[subject.toLowerCase()];
        prompt += `\n\nSUBJECT: ${subject}\n`;
        prompt += `Approach: ${subjectAdaptation.approach}\n`;
        prompt += `Examples to use: ${subjectAdaptation.examples.join(', ')}\n`;
    }

    // Add student level adaptation
    if (studentLevel && teacher.studentLevelAdaptation) {
        const levelKey = getLevelKey(studentLevel);
        const levelAdaptation = teacher.studentLevelAdaptation[levelKey];

        if (levelAdaptation) {
            prompt += `\n\nSTUDENT LEVEL: ${levelKey}\n`;
            prompt += `Approach: ${levelAdaptation.approach}\n`;
            prompt += `Encouragement style: ${levelAdaptation.encouragement}\n`;
            prompt += `Strategy: ${levelAdaptation.strategy}\n`;
        }
    }

    // Add contextual information
    if (context.timeOfDay) {
        prompt += `\n\nTime of day: ${context.timeOfDay}`;
        if (context.timeOfDay === 'morning') {
            prompt += ` - Student might be fresh and energetic`;
        } else if (context.timeOfDay === 'evening') {
            prompt += ` - Student might be tired, be extra encouraging`;
        }
    }

    if (context.studentMood) {
        prompt += `\nStudent seems: ${context.studentMood}`;
    }

    return prompt;
}

// Helper to determine student level category
function getLevelKey(performance) {
    if (performance < 60) return 'struggling';
    if (performance >= 80) return 'advanced';
    return 'average';
}

// Get teacher by ID
export function getTeacherById(teacherId) {
    // Parse teacher ID (format: "name_classX")
    const [name, classInfo] = teacherId.split('_');
    const classNum = parseInt(classInfo.replace('class', ''));

    const teachers = getTeachersForClass(classNum);
    if (!teachers) return null;

    // Find teacher by name
    return Object.values(teachers).find(t => t.id === teacherId);
}

// Get all available teachers for a class
export function getAllTeachersForClass(classNum) {
    const teachers = getTeachersForClass(classNum);
    return teachers ? Object.values(teachers) : [];
}

// Get teacher recommendations based on student profile
export function getTeacherRecommendations(studentProfile) {
    const teachers = getAllTeachersForClass(studentProfile.class);

    return teachers.map(teacher => ({
        teacher,
        score: calculateMatchScore(teacher, studentProfile),
        reason: getRecommendationReason(teacher, studentProfile)
    })).sort((a, b) => b.score - a.score);
}

// Calculate how well a teacher matches a student
function calculateMatchScore(teacher, studentProfile) {
    let score = 50; // Base score

    // Performance-based matching
    if (studentProfile.performance >= 80 && teacher.archetype === 'excellence_coach') {
        score += 30;
    } else if (studentProfile.performance < 60 && teacher.archetype === 'confidence_builder') {
        score += 30;
    } else if (studentProfile.performance >= 60 && studentProfile.performance < 80) {
        if (teacher.archetype === 'loving_hinglish' || teacher.archetype === 'professional') {
            score += 20;
        }
    }

    // Language preference matching
    if (studentProfile.languagePreference === 'hinglish' && teacher.archetype === 'loving_hinglish') {
        score += 20;
    } else if (studentProfile.languagePreference === 'english' && teacher.archetype === 'professional') {
        score += 15;
    }

    return score;
}

// Get human-readable reason for recommendation
function getRecommendationReason(teacher, studentProfile) {
    if (studentProfile.performance >= 80 && teacher.archetype === 'excellence_coach') {
        return `${teacher.name} will challenge you to achieve excellence!`;
    }
    if (studentProfile.performance < 60 && teacher.archetype === 'confidence_builder') {
        return `${teacher.name} will patiently build your confidence step by step.`;
    }
    if (teacher.archetype === 'loving_hinglish') {
        return `${teacher.name} teaches in a friendly Hinglish style that's easy to understand.`;
    }
    if (teacher.archetype === 'professional') {
        return `${teacher.name} provides structured, professional guidance.`;
    }
    return `${teacher.name} is a great teacher for your level!`;
}

export default {
    selectTeacher,
    buildTeacherPrompt,
    getTeacherById,
    getAllTeachersForClass,
    getTeacherRecommendations
};
