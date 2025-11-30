// Class 5 Teachers Index
import priyaMaam from './priya.js';
import kavitaMaam from './kavita.js';
import rajeshSir from './rajesh.js';
import amitSir from './amit.js';

export const class5Teachers = {
    priya: priyaMaam,
    kavita: kavitaMaam,
    rajesh: rajeshSir,
    amit: amitSir
};

export const getClass5Teacher = (archetype) => {
    const teacherMap = {
        'loving_hinglish': priyaMaam,
        'professional': kavitaMaam,
        'excellence_coach': rajeshSir,
        'confidence_builder': amitSir
    };

    return teacherMap[archetype] || priyaMaam;
};

export default class5Teachers;
