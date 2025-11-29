# Shikshak - Phase 1 Features Analysis

**Product Manager Assessment**  
**Date:** November 29, 2025  
**Version:** 1.0

---

## Executive Summary

Shikshak is an AI-powered EdTech platform targeting Indian students (Class 4-8) with personalized tutoring, homework help, and subscription-based learning. This document analyzes the current implementation status and identifies missing features for Phase 1 MVP launch.

**Current Status:** ~65% Complete  
**Critical Missing Features:** 8 core features  
**Recommended Timeline:** 3-4 weeks to MVP

---

## 1. Feature Inventory

### ✅ **IMPLEMENTED FEATURES**

#### 1.1 Core Infrastructure
- [x] React + Vite setup with modern tooling
- [x] Firebase Authentication integration
- [x] Firestore database configuration
- [x] Routing with React Router (26 routes)
- [x] Tailwind CSS styling system
- [x] Framer Motion animations
- [x] Environment variable management

#### 1.2 Authentication & User Management
- [x] Student signup/login flow
- [x] Parent login portal
- [x] Profile setup/onboarding page
- [x] Auth context with user state management
- [x] Private route protection (commented out for dev)

#### 1.3 AI & Learning Features
- [x] Gemini AI integration (gemini-1.5-flash)
- [x] Chat interface with AI tutor
- [x] Image upload for homework help
- [x] Conversation history management
- [x] Mock responses fallback system
- [x] Text-to-speech (Web Speech API)
- [x] Voice input recognition
- [x] Video explanation script generation

#### 1.4 Subscription & Payments
- [x] Razorpay payment gateway integration
- [x] Subscription context with usage tracking
- [x] Free tier limits (5 AI questions/day, 5 practice/day)
- [x] Feature gating component
- [x] Upgrade modal with upsell
- [x] 5 pricing tiers (Class 4-8)
- [x] Free trial system (7 days)
- [x] Checkout flow
- [x] Payment success/failure pages

#### 1.5 Content & Curriculum
- [x] Syllabus data structure (JSON-based)
- [x] Class 6 Math syllabus (complete)
- [x] Class 6 Science syllabus (complete)
- [x] Subject/Chapter/Topic hierarchy
- [x] Syllabus browsing UI
- [x] Topic learning page
- [x] Practice questions interface

#### 1.6 Student Dashboard
- [x] Daily study plan UI
- [x] Subject progress tracking
- [x] Study streak counter
- [x] Quick action cards
- [x] History/journey page

#### 1.7 Parent Features
- [x] Parent dashboard with child's metrics
- [x] Weekly progress visualization
- [x] Study time tracking display
- [x] Nudge/notification button

#### 1.8 Marketing & Legal
- [x] Landing page
- [x] About page
- [x] Success stories page
- [x] FAQ page
- [x] Pricing page with discount tiers
- [x] Terms of Service
- [x] Privacy Policy
- [x] Refund Policy

#### 1.9 Admin
- [x] Admin dashboard route

---

### ❌ **MISSING FEATURES (Phase 1 Critical)**

#### 2.1 🔴 **HIGH PRIORITY - Blockers for MVP**

##### A. Real User Profile Management
**Status:** Hardcoded mock data  
**Impact:** Cannot onboard real users  
**Required:**
- [ ] Save user profile to Firestore on signup
- [ ] Load user profile (name, class, subjects) on login
- [ ] Display actual user name instead of "Rohan"
- [ ] Profile edit functionality
- [ ] User preferences storage

**Files Affected:**
- `src/pages/onboarding/ProfileSetup.jsx` - needs Firestore save
- `src/pages/student/Dashboard.jsx` - hardcoded "Rohan"
- `src/contexts/AuthContext.jsx` - needs profile loading

---

##### B. Actual Syllabus Data for All Classes
**Status:** Only Class 6 Math & Science exist  
**Impact:** Cannot serve Class 4, 5, 7, 8 students  
**Required:**
- [ ] Class 4 syllabus (Math, EVS, English, Hindi)
- [ ] Class 5 syllabus (Math, EVS, English, Hindi)
- [ ] Class 7 syllabus (Math, Science, Social, English, Hindi)
- [ ] Class 8 syllabus (Math, Science, Social, English, Hindi)
- [ ] Dynamic syllabus loading based on user's class

**Files to Create:**
- `src/data/syllabus/class4_*.json`
- `src/data/syllabus/class5_*.json`
- `src/data/syllabus/class7_*.json`
- `src/data/syllabus/class8_*.json`

---

##### C. Real Daily Study Plan Generation
**Status:** Hardcoded mock plan  
**Impact:** No personalized learning experience  
**Required:**
- [ ] Algorithm to generate daily plan based on:
  - Student's class and subjects
  - Progress tracking
  - Weak areas identification
  - Time availability
- [ ] Save/load daily plans from Firestore
- [ ] Mark activities as complete
- [ ] Adaptive plan adjustment

**Files Affected:**
- `src/pages/student/Dashboard.jsx` - mock dailyPlan array
- Need new: `src/services/studyPlan.js`

---

##### D. Progress Tracking System
**Status:** Hardcoded percentages  
**Impact:** No real learning analytics  
**Required:**
- [ ] Track completed topics/chapters
- [ ] Calculate subject-wise progress
- [ ] Store progress in Firestore
- [ ] Update progress after study sessions
- [ ] Progress visualization (charts)
- [ ] Streak calculation logic

**Files Affected:**
- `src/pages/student/Dashboard.jsx` - mock subjects array
- `src/pages/student/History.jsx` - needs real data
- Need new: `src/services/progressTracking.js`

---

##### E. Practice Questions Database
**Status:** AI-generated only, no question bank  
**Impact:** Inconsistent practice experience  
**Required:**
- [ ] Question bank for each topic
- [ ] Multiple difficulty levels
- [ ] Question types (MCQ, short answer, numerical)
- [ ] Answer validation
- [ ] Explanation for each question
- [ ] Performance tracking per topic

**Files Affected:**
- `src/pages/student/PracticeQuestions.jsx` - currently AI-only
- Need new: `src/data/questions/` directory structure

---

##### F. Study Session Tracking
**Status:** UI exists, no backend  
**Impact:** Cannot track actual learning time  
**Required:**
- [ ] Session start/end timestamps
- [ ] Time spent per subject/topic
- [ ] Save sessions to Firestore
- [ ] Daily/weekly time aggregation
- [ ] Parent dashboard integration

**Files Affected:**
- `src/pages/student/StudySession.jsx` - needs tracking logic
- `src/pages/parent/ParentDashboard.jsx` - needs real data

---

##### G. Subscription Webhook Handler
**Status:** Frontend only  
**Impact:** Payments won't activate subscriptions automatically  
**Required:**
- [ ] Firebase Cloud Function for Razorpay webhooks
- [ ] Verify payment signature
- [ ] Update user subscription status
- [ ] Handle payment failures
- [ ] Send confirmation emails
- [ ] Auto-renewal logic

**Files to Create:**
- `functions/razorpayWebhook.js`
- `functions/emailService.js`

---

##### H. Admin Dashboard Functionality
**Status:** Route exists, empty page  
**Impact:** Cannot manage platform  
**Required:**
- [ ] User management (view, edit, delete)
- [ ] Subscription overview
- [ ] Revenue analytics
- [ ] Content management (add/edit syllabus)
- [ ] Support ticket system
- [ ] Usage analytics

**Files Affected:**
- `src/pages/admin/AdminDashboard.jsx` - currently empty

---

#### 2.2 🟡 **MEDIUM PRIORITY - Important for Launch**

##### I. Email Notifications
**Status:** Not implemented  
**Required:**
- [ ] Welcome email on signup
- [ ] Payment confirmation
- [ ] Trial expiry reminder
- [ ] Subscription renewal reminder
- [ ] Parent weekly report
- [ ] Password reset emails

**Integration:** SendGrid/AWS SES (env var exists)

---

##### J. Search & Discovery
**Status:** Not implemented  
**Required:**
- [ ] Search topics across subjects
- [ ] Recently studied topics
- [ ] Recommended topics based on progress
- [ ] Bookmarks/favorites

---

##### K. Gamification Elements
**Status:** Partial (streak counter exists)  
**Required:**
- [ ] Achievement badges
- [ ] Points system
- [ ] Leaderboard (optional)
- [ ] Daily challenges
- [ ] Milestone celebrations

---

##### L. Offline Support
**Status:** Not implemented  
**Required:**
- [ ] Service worker for PWA
- [ ] Cache syllabus data
- [ ] Offline mode indicator
- [ ] Sync when online

---

#### 2.3 🟢 **LOW PRIORITY - Post-MVP**

##### M. Advanced Features
- [ ] Video lessons (currently script-only)
- [ ] Live doubt sessions
- [ ] Peer learning/forums
- [ ] Mobile app (React Native)
- [ ] WhatsApp integration
- [ ] Multi-language support
- [ ] Advanced analytics (ML-based)

---

## 2. Technical Debt & Issues

### Code Quality Issues
1. **Private Routes Commented Out**
   - Location: `src/App.jsx` lines 56-58, 61-63, 81-83
   - Impact: No authentication protection
   - Fix: Uncomment and test

2. **Hardcoded User Data**
   - Locations: Multiple components
   - Impact: Not production-ready
   - Fix: Replace with context/props

3. **Mock Data Everywhere**
   - Impact: False sense of completeness
   - Fix: Implement real data fetching

4. **No Error Boundaries**
   - Impact: Poor error handling
   - Fix: Add React error boundaries

5. **No Loading States**
   - Impact: Poor UX during data fetch
   - Fix: Add skeleton loaders

### Security Issues
1. **API Keys in Frontend**
   - Current: Vite env vars (exposed in bundle)
   - Fix: Move sensitive operations to Cloud Functions

2. **No Rate Limiting**
   - Impact: API abuse possible
   - Fix: Implement rate limiting

3. **No Input Validation**
   - Impact: Security vulnerabilities
   - Fix: Add validation library (Zod/Yup)

---

## 3. Data Architecture Gaps

### Missing Firestore Collections

```
users/
  {uid}/
    ✅ subscription
    ✅ usage
    ❌ profile (name, class, subjects, avatar)
    ❌ preferences
    ❌ progress/
        {subjectId}/
          {chapterId}/
            {topicId}/
              completed: boolean
              score: number
              lastStudied: timestamp
    ❌ studySessions/
        {sessionId}/
          subject, topic, duration, timestamp
    ❌ dailyPlans/
        {date}/
          activities[]
    ❌ achievements/
    ❌ bookmarks/

payments/
  ❌ {paymentId}/
      userId, amount, status, razorpayData, timestamp

questions/
  ❌ {questionId}/
      subject, chapter, topic, difficulty, type, question, options, answer, explanation

admin/
  ❌ analytics/
  ❌ content/
```

---

## 4. Phase 1 MVP Definition

### Must-Have for Launch (2-3 weeks)
1. ✅ User authentication
2. ❌ Real user profiles
3. ❌ Complete syllabus (all classes)
4. ✅ AI chat tutor
5. ❌ Real progress tracking
6. ❌ Actual daily plans
7. ✅ Payment integration
8. ❌ Webhook handler
9. ❌ Basic question bank (at least 50 questions per subject)
10. ❌ Email notifications

### Nice-to-Have (1 week post-launch)
1. Advanced analytics
2. Gamification
3. Search functionality
4. Parent app improvements

### Future Phases
1. Video content
2. Live sessions
3. Mobile apps
4. Advanced AI features

---

## 5. Recommended Implementation Order

### Week 1: Core Data & User Management
1. User profile system (2 days)
2. Progress tracking (2 days)
3. Study session tracking (1 day)

### Week 2: Content & Learning
1. Syllabus data for all classes (3 days)
2. Question bank creation (2 days)
3. Daily plan algorithm (2 days)

### Week 3: Payments & Admin
1. Razorpay webhook handler (2 days)
2. Email service integration (1 day)
3. Admin dashboard basics (2 days)

### Week 4: Polish & Testing
1. Fix technical debt (2 days)
2. End-to-end testing (2 days)
3. Performance optimization (1 day)

---

## 6. Risk Assessment

### High Risk
- **Syllabus Content Creation:** Time-consuming, requires subject matter expertise
- **Payment Webhook:** Critical for revenue, needs thorough testing
- **AI API Costs:** Usage-based pricing could spike

### Medium Risk
- **User Adoption:** Need marketing strategy
- **Parent Engagement:** Separate app might be needed
- **Competition:** Byju's, Vedantu, etc.

### Low Risk
- **Technical Stack:** Proven technologies
- **Scalability:** Firebase handles it well

---

## 7. Success Metrics for Phase 1

### Technical Metrics
- [ ] 100% feature completion (must-haves)
- [ ] <2s page load time
- [ ] 99.9% uptime
- [ ] <1% payment failure rate

### Business Metrics
- [ ] 100 paying users in first month
- [ ] 20% free-to-paid conversion
- [ ] <5% churn rate
- [ ] 4.5+ app rating

### User Engagement
- [ ] 30 min average daily usage
- [ ] 70% weekly active users
- [ ] 5+ study sessions per week per user

---

## 8. Next Steps

### Immediate Actions (This Week)
1. **Create task.md** with detailed breakdown
2. **Prioritize features** with stakeholders
3. **Set up project board** (GitHub/Jira)
4. **Assign developers** to each feature
5. **Create content pipeline** for syllabus

### Development Workflow
1. Feature branch per item
2. Code review required
3. Testing before merge
4. Weekly demos
5. Bi-weekly releases

---

## Appendix A: File Structure Recommendations

```
src/
  data/
    syllabus/
      class4/
      class5/
      class6/ ✅
      class7/
      class8/
    questions/
      class4/
      class5/
      ...
  services/
    ai.js ✅
    razorpay.js ✅
    studyPlan.js ❌
    progressTracking.js ❌
    questionBank.js ❌
    emailService.js ❌
  contexts/
    AuthContext.jsx ✅
    SubscriptionContext.jsx ✅
    ProfileContext.jsx ❌
    ProgressContext.jsx ❌

functions/
  razorpayWebhook.js ❌
  emailNotifications.js ❌
  analyticsAggregation.js ❌
```

---

## Appendix B: Environment Variables Checklist

```bash
# Firebase ✅
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID

# AI ✅
VITE_GEMINI_API_KEY

# Payments ✅
VITE_RAZORPAY_KEY_ID
VITE_RAZORPAY_KEY_SECRET

# Email ⚠️ (configured but not used)
VITE_SENDGRID_API_KEY

# Analytics ⚠️ (configured but not used)
VITE_GA_TRACKING_ID

# Environment ✅
VITE_ENV
```

---

**Document Owner:** Product Management  
**Last Updated:** November 29, 2025  
**Next Review:** After Phase 1 completion
