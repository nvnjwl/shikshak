import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layouts/AdminLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { BookOpen, Plus, Trash2, ChevronRight, ChevronDown, FolderPlus, FilePlus, X } from 'lucide-react';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import logger from '../../../utils/logger';

export default function SyllabusManager() {
    const [selectedClass, setSelectedClass] = useState('6th');
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form States
    const [showAddSubject, setShowAddSubject] = useState(false);
    const [newSubjectName, setNewSubjectName] = useState('');

    const [showAddChapter, setShowAddChapter] = useState(false);
    const [newChapterName, setNewChapterName] = useState('');

    useEffect(() => {
        fetchSubjects();
    }, [selectedClass]);

    useEffect(() => {
        if (selectedSubject) {
            fetchChapters(selectedSubject.id);
        } else {
            setChapters([]);
        }
    }, [selectedSubject]);

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const subjectsColl = collection(db, 'syllabus_subjects');
            const q = query(subjectsColl, where('class', '==', selectedClass));
            const snapshot = await getDocs(q);

            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSubjects(data);

            // Auto-select first subject if available and none selected
            if (data.length > 0 && !selectedSubject) {
                setSelectedSubject(data[0]);
            } else if (data.length === 0) {
                setSelectedSubject(null);
            }
        } catch (error) {
            logger.error('SyllabusManager', 'Error fetching subjects', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchChapters = async (subjectId) => {
        try {
            const chaptersColl = collection(db, 'syllabus_chapters');
            const q = query(
                chaptersColl,
                where('subjectId', '==', subjectId),
                orderBy('order', 'asc')
            );
            const snapshot = await getDocs(q);

            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setChapters(data);
        } catch (error) {
            logger.error('SyllabusManager', 'Error fetching chapters', error);
        }
    };

    const handleAddSubject = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'syllabus_subjects'), {
                name: newSubjectName,
                class: selectedClass,
                createdAt: serverTimestamp()
            });
            setNewSubjectName('');
            setShowAddSubject(false);
            fetchSubjects();
        } catch (error) {
            logger.error('SyllabusManager', 'Error adding subject', error);
        }
    };

    const handleAddChapter = async (e) => {
        e.preventDefault();
        if (!selectedSubject) return;

        try {
            await addDoc(collection(db, 'syllabus_chapters'), {
                title: newChapterName,
                subjectId: selectedSubject.id,
                class: selectedClass,
                order: chapters.length + 1,
                topics: [], // Initialize with empty topics
                createdAt: serverTimestamp()
            });
            setNewChapterName('');
            setShowAddChapter(false);
            fetchChapters(selectedSubject.id);
        } catch (error) {
            logger.error('SyllabusManager', 'Error adding chapter', error);
        }
    };

    const handleDeleteSubject = async (id) => {
        if (!window.confirm('Delete this subject and all its chapters?')) return;
        try {
            await deleteDoc(doc(db, 'syllabus_subjects', id));
            // In a real app, you'd also batch delete all chapters linked to this subject
            if (selectedSubject?.id === id) setSelectedSubject(null);
            fetchSubjects();
        } catch (error) {
            logger.error('SyllabusManager', 'Error deleting subject', error);
        }
    };

    const handleDeleteChapter = async (id) => {
        if (!window.confirm('Delete this chapter?')) return;
        try {
            await deleteDoc(doc(db, 'syllabus_chapters', id));
            fetchChapters(selectedSubject.id);
        } catch (error) {
            logger.error('SyllabusManager', 'Error deleting chapter', error);
        }
    };

    const handleAddTopic = async (chapter, topic) => {
        try {
            const chapterRef = doc(db, 'syllabus_chapters', chapter.id);
            // Use arrayUnion to add unique topics
            const { arrayUnion } = await import('firebase/firestore');
            await updateDoc(chapterRef, {
                topics: arrayUnion(topic)
            });

            // Optimistic update
            setChapters(prev => prev.map(c => {
                if (c.id === chapter.id) {
                    return { ...c, topics: [...(c.topics || []), topic] };
                }
                return c;
            }));
        } catch (error) {
            logger.error('SyllabusManager', 'Error adding topic', error);
        }
    };

    const handleDeleteTopic = async (chapter, topic) => {
        if (!window.confirm(`Remove topic "${topic}"?`)) return;
        try {
            const chapterRef = doc(db, 'syllabus_chapters', chapter.id);
            // Use arrayRemove to remove topic
            const { arrayRemove } = await import('firebase/firestore');
            await updateDoc(chapterRef, {
                topics: arrayRemove(topic)
            });

            // Optimistic update
            setChapters(prev => prev.map(c => {
                if (c.id === chapter.id) {
                    return { ...c, topics: c.topics.filter(t => t !== topic) };
                }
                return c;
            }));
        } catch (error) {
            logger.error('SyllabusManager', 'Error deleting topic', error);
        }
    };

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-3xl font-heading font-bold text-primary">Syllabus Management</h1>
                <p className="text-text-secondary">Manage subjects, chapters, and topics</p>
            </div>

            <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
                {/* Sidebar: Class & Subjects */}
                <Card className="lg:col-span-1 p-4 flex flex-col h-full overflow-hidden">
                    <div className="mb-4">
                        <label className="text-xs font-bold text-text-secondary uppercase mb-2 block">Select Class</label>
                        <select
                            className="w-full p-2 border rounded-lg bg-gray-50"
                            value={selectedClass}
                            onChange={(e) => {
                                setSelectedClass(e.target.value);
                                setSelectedSubject(null);
                            }}
                        >
                            <option value="5th">Class 5</option>
                            <option value="6th">Class 6</option>
                            <option value="7th">Class 7</option>
                            <option value="8th">Class 8</option>
                        </select>
                    </div>

                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-text-secondary uppercase">Subjects</label>
                        <button onClick={() => setShowAddSubject(true)} className="text-primary hover:bg-primary/10 p-1 rounded">
                            <Plus size={16} />
                        </button>
                    </div>

                    {showAddSubject && (
                        <form onSubmit={handleAddSubject} className="mb-4">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Subject Name"
                                className="w-full p-2 text-sm border rounded-lg mb-2"
                                value={newSubjectName}
                                onChange={e => setNewSubjectName(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <Button type="submit" size="sm" className="w-full">Add</Button>
                                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddSubject(false)}>Cancel</Button>
                            </div>
                        </form>
                    )}

                    <div className="flex-1 overflow-y-auto space-y-1">
                        {subjects.map(subject => (
                            <div
                                key={subject.id}
                                onClick={() => setSelectedSubject(subject)}
                                className={`
                                    flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors
                                    ${selectedSubject?.id === subject.id ? 'bg-primary text-white' : 'hover:bg-gray-100'}
                                `}
                            >
                                <span className="font-medium">{subject.name}</span>
                                {selectedSubject?.id === subject.id && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteSubject(subject.id);
                                        }}
                                        className="text-white/70 hover:text-white"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                        {subjects.length === 0 && !loading && (
                            <p className="text-xs text-text-secondary text-center py-4">No subjects found.</p>
                        )}
                    </div>
                </Card>

                {/* Main Content: Chapters */}
                <Card className="lg:col-span-3 p-6 flex flex-col h-full overflow-hidden">
                    {selectedSubject ? (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <BookOpen className="text-primary" />
                                    {selectedSubject.name} - Chapters
                                </h2>
                                <Button onClick={() => setShowAddChapter(true)}>
                                    <Plus size={18} className="mr-2" /> Add Chapter
                                </Button>
                            </div>

                            {showAddChapter && (
                                <form onSubmit={handleAddChapter} className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <h4 className="font-bold text-sm mb-2">New Chapter</h4>
                                    <div className="flex gap-2">
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="Chapter Title (e.g. Chapter 1: Number Systems)"
                                            className="flex-1 p-2 border rounded-lg"
                                            value={newChapterName}
                                            onChange={e => setNewChapterName(e.target.value)}
                                        />
                                        <Button type="submit">Save</Button>
                                        <Button type="button" variant="ghost" onClick={() => setShowAddChapter(false)}>Cancel</Button>
                                    </div>
                                </form>
                            )}

                            <div className="flex-1 overflow-y-auto space-y-4">
                                {chapters.map((chapter, index) => (
                                    <div key={chapter.id} className="border border-gray-200 rounded-xl p-4 hover:border-primary/30 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg">{chapter.title}</h3>
                                                <p className="text-xs text-text-secondary mt-1">{chapter.topics?.length || 0} Topics</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteChapter(chapter.id)}>
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Topics Section */}
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {chapter.topics?.map((topic, tIndex) => (
                                                    <div key={tIndex} className="bg-white border border-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                                        <span>{topic}</span>
                                                        <button
                                                            onClick={() => handleDeleteTopic(chapter, topic)}
                                                            className="text-gray-400 hover:text-red-500"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                                {(!chapter.topics || chapter.topics.length === 0) && (
                                                    <span className="text-xs text-text-secondary italic">No topics added yet</span>
                                                )}
                                            </div>

                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    const input = e.target.elements.topic;
                                                    if (input.value.trim()) {
                                                        handleAddTopic(chapter, input.value.trim());
                                                        input.value = '';
                                                    }
                                                }}
                                                className="flex gap-2"
                                            >
                                                <input
                                                    name="topic"
                                                    type="text"
                                                    placeholder="Add a topic..."
                                                    className="flex-1 text-sm p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                                />
                                                <Button type="submit" size="sm" variant="outline">
                                                    <Plus size={14} />
                                                </Button>
                                            </form>
                                        </div>
                                    </div>
                                ))}
                                {chapters.length === 0 && (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                        <FolderPlus size={48} className="mx-auto text-gray-300 mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900">No chapters yet</h3>
                                        <p className="text-gray-500">Add a chapter to start building the syllabus</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-text-secondary">
                            <BookOpen size={64} className="mb-4 text-gray-200" />
                            <p className="text-lg">Select a subject to manage its syllabus</p>
                        </div>
                    )}
                </Card>
            </div>
        </AdminLayout>
    );
}
