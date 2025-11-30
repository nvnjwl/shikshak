import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SYLLABUS_DIR = path.join(__dirname, '../src/syllabus');

// Difficulty mapping based on chapter complexity
const DIFFICULTY_MAP = {
    // Easy topics (foundational)
    'introduction': 'easy',
    'basic': 'easy',
    'simple': 'easy',
    // Medium topics (application)
    'operations': 'medium',
    'properties': 'medium',
    'comparison': 'medium',
    // Hard topics (advanced)
    'advanced': 'hard',
    'complex': 'hard',
    'application': 'hard'
};

// Subject-specific metadata
const SUBJECT_METADATA = {
    'maths': {
        icon: 'calculator',
        color: 'blue',
        total_hours: 180
    },
    'science': {
        icon: 'flask',
        color: 'green',
        total_hours: 150
    },
    'english': {
        icon: 'book',
        color: 'purple',
        total_hours: 150
    },
    'hindi': {
        icon: 'language',
        color: 'orange',
        total_hours: 120
    },
    'social_science': {
        icon: 'globe',
        color: 'teal',
        total_hours: 140
    },
    'evs': {
        icon: 'leaf',
        color: 'green',
        total_hours: 120
    }
};

function estimateChapterHours(totalChapters, totalHours) {
    return Math.round(totalHours / totalChapters);
}

function estimateTopicMinutes(topics, chapterHours) {
    const minutesPerChapter = chapterHours * 60;
    return Math.round(minutesPerChapter / topics.length);
}

function determineDifficulty(topicName, chapterNumber, totalChapters) {
    const lowerTopic = topicName.toLowerCase();

    // Check for keywords
    for (const [keyword, difficulty] of Object.entries(DIFFICULTY_MAP)) {
        if (lowerTopic.includes(keyword)) {
            return difficulty;
        }
    }

    // Default based on chapter progression
    if (chapterNumber <= totalChapters * 0.3) return 'easy';
    if (chapterNumber <= totalChapters * 0.7) return 'medium';
    return 'hard';
}

function enhanceSyllabus(syllabusData, subjectId) {
    const metadata = SUBJECT_METADATA[subjectId] || {
        icon: 'book',
        color: 'gray',
        total_hours: 150
    };

    const totalChapters = syllabusData.chapters?.length || 0;
    const avgChapterHours = estimateChapterHours(totalChapters, metadata.total_hours);

    // Add subject-level metadata
    const enhanced = {
        ...syllabusData,
        subject_icon: metadata.icon,
        subject_color: metadata.color,
        total_chapters: totalChapters,
        total_hours: metadata.total_hours,
        description: `CBSE Class ${syllabusData.class} ${syllabusData.subject_name} curriculum aligned with NEP 2020 and CBSE guidelines.`
    };

    // Enhance each chapter
    enhanced.chapters = syllabusData.chapters?.map((chapter, index) => {
        const chapterNumber = chapter.number || index + 1;
        const topicCount = Array.isArray(chapter.key_topics) ? chapter.key_topics.length : 0;
        const topicMinutes = estimateTopicMinutes(
            Array.isArray(chapter.key_topics) ? chapter.key_topics : [],
            avgChapterHours
        );

        // Determine chapter difficulty
        const chapterDifficulty = determineDifficulty(
            chapter.name || '',
            chapterNumber,
            totalChapters
        );

        return {
            ...chapter,
            difficulty: chapterDifficulty,
            estimated_hours: avgChapterHours,
            prerequisites: chapter.prerequisites || [],

            // Enhance key_topics
            key_topics: Array.isArray(chapter.key_topics)
                ? chapter.key_topics.map((topic, topicIndex) => {
                    if (typeof topic === 'string') {
                        return {
                            name: topic,
                            difficulty: determineDifficulty(topic, topicIndex + 1, topicCount),
                            estimated_minutes: topicMinutes,
                            bloom_level: topicIndex === 0 ? 'understand' : 'apply',
                            description: `Understanding and applying concepts related to ${topic.toLowerCase()}`
                        };
                    }
                    return topic; // Already enhanced
                })
                : [],

            // Enhance learning_outcomes
            learning_outcomes: Array.isArray(chapter.learning_outcomes)
                ? chapter.learning_outcomes.map((outcome, idx) => {
                    if (typeof outcome === 'string') {
                        return {
                            outcome: outcome,
                            bloom_level: idx === 0 ? 'apply' : 'analyze',
                            assessment_type: 'practice_problems'
                        };
                    }
                    return outcome; // Already enhanced
                })
                : [],

            // Add resources if not present
            resources: chapter.resources || {
                video_topics: [chapter.name],
                practice_sets: [`${chapter.name} - Practice Set 1`],
                interactive_activities: [],
                real_world_examples: []
            },

            // Add teaching metadata
            common_misconceptions: chapter.common_misconceptions || [],
            teaching_tips: chapter.teaching_tips || []
        };
    }) || [];

    return enhanced;
}

async function enhanceAllSyllabi() {
    try {
        console.log('🚀 Starting syllabus enhancement...\n');

        const classes = fs.readdirSync(SYLLABUS_DIR).filter(file => {
            return fs.statSync(path.join(SYLLABUS_DIR, file)).isDirectory();
        });

        let totalProcessed = 0;
        let totalEnhanced = 0;

        for (const classDir of classes) {
            console.log(`📚 Processing Class ${classDir}...`);
            const classPath = path.join(SYLLABUS_DIR, classDir);
            const subjects = fs.readdirSync(classPath).filter(file => file.endsWith('.json'));

            for (const subjectFile of subjects) {
                const subjectId = path.basename(subjectFile, '.json');
                console.log(`   ✏️  Enhancing ${subjectId}...`);

                const filePath = path.join(classPath, subjectFile);
                const fileContent = fs.readFileSync(filePath, 'utf8');
                const syllabusData = JSON.parse(fileContent);

                // Enhance the syllabus
                const enhanced = enhanceSyllabus(syllabusData, subjectId);

                // Write back to file
                fs.writeFileSync(filePath, JSON.stringify(enhanced, null, 4));

                totalProcessed++;
                totalEnhanced++;
                console.log(`   ✅ Enhanced ${subjectId} (${enhanced.chapters?.length || 0} chapters)`);
            }
        }

        console.log(`\n✨ Enhancement complete!`);
        console.log(`   Total files processed: ${totalProcessed}`);
        console.log(`   Total files enhanced: ${totalEnhanced}`);
        console.log(`\n💡 Next steps:`);
        console.log(`   1. Review enhanced syllabi in src/syllabus/`);
        console.log(`   2. Run: npm run seed:syllabus`);
        console.log(`   3. Verify in your app dashboard`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error enhancing syllabi:', error);
        process.exit(1);
    }
}

enhanceAllSyllabi();
