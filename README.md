EduAir AI

AI-powered learning platform built for Nepal’s NEB & SEE students

Production: "eduair-ai.vercel.app"
Status: Live & actively developing
Primary stack: Next.js · Supabase · Google Gemini · Vercel

---

🇳🇵 What is EduAir AI?

EduAir AI is an AI-powered study platform designed specifically around the learning needs of Nepali students.

Instead of being a generic AI chatbot, EduAir combines AI tutoring with tools built around the NEB/SEE curriculum, helping students understand lessons, create study materials, practice questions, analyze documents, and prepare for exams.

The AI tutor is called Air—a Nepal-aware study assistant designed to provide straightforward, student-friendly explanations.

---

🚀 Core Features

🤖 Air — AI Study Tutor

- Curriculum-aware AI tutoring
- Conversation history and memory
- Retry handling with exponential backoff
- Markdown-based responses
- No-LaTeX response style for easier student reading
- Primary AI provider: Google Gemini
- Automatic fallback: Groq → OpenRouter

📄 Document & PDF Tools

Students can work with their study materials using AI-powered document processing.

- PDF/document summarization
- AI-generated notes
- Quiz generation
- Document-based learning workflows

📸 Photo Analyzer

Students can upload a photo and use Gemini Vision to analyze educational content.

Useful for:

- Questions from textbooks
- Handwritten problems
- Diagrams
- Study material

📝 Model Questions

A dedicated NEB/SEE-pattern model-question system backed by Supabase.

Students can select:

- Class
- Faculty
- Subject

The platform then provides structured exam-practice material.

📚 Notes & Quizzes

AI-generated study resources connected to the student's learning workflow.

- Notes
- Quizzes
- Conversations
- Documents
- Study plans

---

🧠 Personalization & Learning Data

EduAir is structured to move beyond one-off AI conversations.

The database supports learning-related information such as:

- User profiles
- Conversations
- Messages
- Documents
- Quizzes
- Notes
- Study plans
- Model question sets

This provides the foundation for progressively more personalized learning experiences.

---

💳 Pro Plan

EduAir includes a paid Pro tier priced at NPR 499/month.

Payment

eSewa integration is implemented with HMAC-SHA256 signature verification.

Usage protection

The AI API uses separate read/write rate-limit operations:

"checkRateLimit()" → verify allowance
"AI request" → execute successfully
"recordUsage()" → consume quota only after success

This prevents failed AI requests from incorrectly consuming student usage.

---

🔐 Authentication & Security

Authentication

- Supabase SSR authentication
- Google OAuth
- Production OAuth flow verified
- Replaced the original fake "setTimeout" login redirect with real authentication

Security work

- Live-site security audit performed
- API usage controls implemented
- Payment signatures verified
- Secrets kept outside the codebase through environment variables

---

📱 Mobile Experience

EduAir has been optimized for mobile-first student usage.

Recent improvements include:

- Hamburger-triggered dashboard sidebar
- Sheet-based mobile navigation
- Mobile navbar improvements
- Dashboard layout fixes
- Improved contrast and readability

The goal is to make the platform practical even for students primarily using a phone.

---

🎨 Product & Brand Design

EduAir's visual identity was rebuilt around a distinctive “marking scheme” aesthetic rather than a generic AI SaaS template.

Design language

- Pitch-black foundation
- Fraunces serif typography
- Red-pen accent: "#C6362E"
- Animated SVG checkmarks
- Admit-card-inspired navigation
- Editorial / academic visual direction

A large Framer Motion animation pass was explored across the dashboard but ultimately reverted to keep the product focused and maintainable.

---

🏗️ Architecture

EduAir was originally scaffolded as EduMind AI on Windows and had an incomplete dual Express + Next.js architecture.

The project was subsequently rebuilt into a unified production architecture.

Current architecture

Next.js App Router
→ Application UI + server/API routes

Supabase
→ Authentication + PostgreSQL database

AI Service Layer
→ Gemini
→ Groq fallback
→ OpenRouter fallback

Vercel
→ Production deployment

eSewa
→ Pro subscription payments

This eliminated the previous fragmented architecture and created a single Next.js application.

---

🗄️ Database

Supabase is used for authentication and application data.

Core tables

Table| Purpose
"profiles"| User profiles and plan information
"conversations"| AI conversation sessions
"messages"| Individual chat messages
"documents"| Uploaded learning materials
"quizzes"| Generated quizzes
"notes"| AI-generated notes
"study_plans"| Student study plans
"model_question_sets"| NEB/SEE model questions

Supabase project: "fngydafriblpebhwmjqz"

---

🔄 AI Infrastructure

EduAir uses a provider fallback architecture rather than depending entirely on one AI service.

Provider chain

Google Gemini
↓
Groq
↓
OpenRouter

The AI infrastructure includes:

- Request timeouts
- Retry logic
- Exponential backoff
- Provider fallback
- Usage tracking
- Rate limiting
- Success-aware quota recording

This improves resilience when an AI provider is slow, unavailable, or reaches a limit.

---

🧑‍🏫 Air — The EduAir AI Persona

The system's AI tutor is called Air.

Air is instructed to behave as a Nepal-focused educational assistant with awareness of the NEB/SEE environment.

The persona is designed to:

- Explain concepts simply
- Avoid unnecessary technical formatting
- Follow the student's learning context
- Provide practical exam-oriented help
- Identify itself as being built by Nirmal Airee

---

📈 Product Evolution

Phase 1 — From prototype to product

EduMind AI began as an incomplete Windows prototype.

Phase 2 — Architecture rebuild

The project was rebuilt into a unified Next.js + Supabase application with working production API routes.

Phase 3 — EduAir rebrand

The product was renamed from EduMind AI → EduAir AI, creating a stronger connection with its creator and establishing a distinct product identity.

Phase 4 — Production hardening

Major work included:

- Authentication fixes
- Rate-limit corrections
- Payment integration
- AI fallback infrastructure
- Mobile improvements
- Security review
- Database expansion
- UI redesign

Current phase

EduAir is live and moving from “working product” toward a polished, scalable learning platform.

---

🧹 Quality & Integrity

The project has deliberately removed fabricated metrics and placeholder claims.

EduAir's product presentation is based on real implemented functionality rather than invented user counts, performance numbers, or growth statistics.

This keeps the product's marketing and technical documentation credible.

---

🎯 Current Direction

The next stage is not simply adding more AI features.

The focus should be on making EduAir:

More useful → More reliable → More personalized → Easier to use → Easier to monetize

The strongest product loop is:

Student brings study material
↓
Air understands it
↓
EduAir creates notes / explanations / quizzes
↓
Student practices
↓
EduAir learns the student's needs
↓
Next study session becomes more personalized

---

EduAir AI

Built for students.
Designed for Nepal.
Powered by AI.

Made by Nirmal Airee.