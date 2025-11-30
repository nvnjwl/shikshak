import { BookOpen, Calculator, FlaskConical, Languages, Globe } from 'lucide-react';

export const getSubjectIcon = (name) => {
    if (!name) return BookOpen;
    const n = name.toLowerCase();
    if (n.includes('math')) return Calculator;
    if (n.includes('science')) return FlaskConical;
    if (n.includes('english') || n.includes('hindi')) return Languages;
    if (n.includes('social') || n.includes('history') || n.includes('evs') || n.includes('geo')) return Globe;
    return BookOpen;
};

export const getSubjectTheme = (index) => {
    const themes = [
        { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', iconBg: 'bg-blue-100', progressBg: 'bg-blue-500' },
        { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100', iconBg: 'bg-green-100', progressBg: 'bg-green-500' },
        { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', iconBg: 'bg-purple-100', progressBg: 'bg-purple-500' },
        { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', iconBg: 'bg-orange-100', progressBg: 'bg-orange-500' },
        { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-100', iconBg: 'bg-pink-100', progressBg: 'bg-pink-500' },
        { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-100', iconBg: 'bg-teal-100', progressBg: 'bg-teal-500' }
    ];
    return themes[index % themes.length];
};
