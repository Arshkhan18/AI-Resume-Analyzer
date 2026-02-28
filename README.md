<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini_AI-LLM-4285F4?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/LangChain-Framework-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white" />
  <img src="https://img.shields.io/badge/Pinecone-Vector_DB-000000?style=for-the-badge&logo=pinecone&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</p>

<h1 align="center">🤖 AI Resume Analyzer & Builder Platform</h1>

<p align="center">
  <b>An intelligent, full-stack platform that analyzes, generates, and helps you study your resume — powered by LLMs.</b>
</p>

<p align="center">
  <a href="https://ai-resume-analyzer-sigma-orpin.vercel.app/">🌐 Live Demo</a> •
  <a href="#-features">✨ Features</a> •
  <a href="#%EF%B8%8F-tech-stack">🛠️ Tech Stack</a> •
  <a href="#-architecture--workflow">📐 Architecture</a> •
  <a href="#-getting-started">🚀 Getting Started</a>
</p>

---

## 📌 Overview

**AI Resume Analyzer** is a production-ready, full-stack web application that leverages Large Language Models (LLMs) and Retrieval-Augmented Generation (RAG) to provide three core resume services:

1. **ATS Resume Analysis** — Upload your resume and get an instant ATS compatibility score with detailed, section-wise feedback.
2. **LaTeX Resume Generator** — Fill a structured form and generate a professional, ATS-friendly resume compiled from LaTeX templates to PDF.
3. **RAG-Powered Study Assistant** — Upload your resume, then chat with an AI that answers placement-prep questions strictly based on your resume content.

The platform features secure JWT + Google OAuth authentication, animated UI with GSAP, vector search via Pinecone, and Docker-based deployment for the backend.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 **ATS Resume Analyzer** | Upload PDF → Extract text → AI evaluates ATS score (0–100), strengths, weaknesses, missing keywords, and section-wise feedback |
| 📝 **Resume Generator** | Interactive multi-step form → Generates LaTeX → Compiles to downloadable PDF (auto-selects Fresher/Placement template) |
| 🎓 **Study Assistant (RAG)** | Upload resume → Chunked & embedded in Pinecone → Chat with AI using your resume as context, with conversation memory |
| 🔐 **Authentication** | JWT-based login/register + Google OAuth 2.0 sign-in |
| 📊 **Dashboard** | View all analyzed resumes, ATS scores, view detailed feedback, and delete entries |
| 🐳 **Docker Support** | Dockerized backend with TeX Live pre-installed for LaTeX compilation in production |
| 🎨 **Modern UI** | Animated landing page with GSAP + ScrollTrigger, responsive design with TailwindCSS |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| [React 18](https://react.dev/) | Component-based UI library |
| [Vite](https://vitejs.dev/) | Lightning-fast build tool & dev server |
| [TailwindCSS 3](https://tailwindcss.com/) | Utility-first CSS framework |
| [React Router v6](https://reactrouter.com/) | Client-side routing with protected & guest routes |
| [GSAP + ScrollTrigger](https://gsap.com/) | Smooth animations and scroll-based transitions |
| [Axios](https://axios-http.com/) | HTTP client for API communication |

### Backend

| Technology | Purpose |
|------------|---------|
| [Express 5](https://expressjs.com/) | Web server framework |
| [MongoDB Atlas](https://www.mongodb.com/atlas) + [Mongoose](https://mongoosejs.com/) | NoSQL database with ODM |
| [JSON Web Tokens](https://jwt.io/) | Stateless authentication |
| [bcrypt.js](https://github.com/dcodeIO/bcrypt.js) | Password hashing |
| [Google Auth Library](https://github.com/googleapis/google-auth-library-nodejs) | Google OAuth 2.0 verification |
| [Multer](https://github.com/expressjs/multer) | File upload middleware (PDF handling) |
| [pdf-parse](https://www.npmjs.com/package/pdf-parse) | PDF text extraction |

### AI / ML Pipeline

| Technology | Purpose |
|------------|---------|
| [Google Gemini AI](https://ai.google.dev/) | LLM for resume analysis, study chat & memory summarization |
| [LangChain](https://js.langchain.com/) | AI orchestration framework (model init, text splitting, embeddings) |
| [Pinecone](https://www.pinecone.io/) | Vector database for RAG retrieval with per-user namespaces |
| [Google Generative AI Embeddings](https://ai.google.dev/) | `gemini-embedding-001` model for document vectorization |
| LaTeX + pdflatex / latexmk | Resume PDF compilation from structured templates |

### DevOps & Deployment

| Technology | Purpose |
|------------|---------|
| [Docker](https://www.docker.com/) + Docker Compose | Containerized backend with TeX Live for PDF generation |
| [Vercel](https://vercel.com/) | Frontend hosting & deployment |
| [Render](https://render.com/) / Custom Server | Backend API hosting |

---

## 📐 Architecture & Workflow

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Vercel)                        │
│                React + Vite + TailwindCSS + GSAP                │
│                                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────────┐  │
│  │ Landing  │ │ Analyze  │ │ Generate │ │  Study Assistant   │  │
│  │  Page    │ │  Page    │ │  Page    │ │     (RAG Chat)     │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────────┘  │
│         │            │            │               │             │
│         └────────────┼────────────┼───────────────┘             │
│                      │       Axios API Calls                    │
└──────────────────────┼──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (Express.js)                        │
│                                                                 │
│  ┌─────────────┐  ┌─────────────────┐  ┌────────────────────┐  │
│  │ Auth Routes │  │  Resume Routes  │  │   Study Routes     │  │
│  │ /api/auth/* │  │ /api/resume/*   │  │   /api/study/*     │  │
│  └──────┬──────┘  │ /api/generator/*│  └──────┬─────────────┘  │
│         │         └────────┬────────┘         │                │
│         ▼                  ▼                  ▼                │
│  ┌─────────────┐  ┌───────────────┐  ┌────────────────────┐   │
│  │ JWT + OAuth │  │  AI Services  │  │   RAG Pipeline     │   │
│  │ Middleware  │  │  (LangChain)  │  │ (Pinecone + LLM)   │   │
│  └──────┬──────┘  └───────┬───────┘  └──────┬─────────────┘   │
│         │                 │                  │                 │
└─────────┼─────────────────┼──────────────────┼─────────────────┘
          ▼                 ▼                  ▼
   ┌─────────────┐  ┌─────────────┐   ┌─────────────┐
   │  MongoDB    │  │  Gemini AI  │   │  Pinecone   │
   │  Atlas      │  │  (Google)   │   │  Vector DB  │
   └─────────────┘  └─────────────┘   └─────────────┘
```

---

### 🔍 Workflow 1: ATS Resume Analysis

```
User uploads PDF resume
        │
        ▼
┌─────────────────────┐
│  Multer Middleware   │  ← Validates & stores uploaded file
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  PDF Parser          │  ← Extracts raw text from PDF
│  (pdf-parse)         │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  Gemini AI Analysis  │  ← Evaluates resume as an ATS system
│  via LangChain       │     Returns: score, strengths, weaknesses,
│                      │     missing keywords, section feedback
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  MongoDB Storage     │  ← Saves result with userId reference
└─────────┬───────────┘
          ▼
   Dashboard displays
   score & feedback
```

**AI Prompt Strategy:** The system prompts Gemini to act as an ATS evaluator, returning a structured JSON response with:
- ATS Score (0–100)
- Strengths & Weaknesses (bullet points)
- Missing Keywords
- Improvement Suggestions
- Section-wise Feedback (Education, Skills, Experience, Projects)

---

### 📝 Workflow 2: Resume Generation

```
User fills multi-step form
(Name, Education, Skills, Projects, Experience)
        │
        ▼
┌──────────────────────────┐
│  Template Selection       │  ← Auto-selects based on experience:
│                           │     • Has experience → placement.tex
│                           │     • No experience  → fresher.tex
└──────────┬───────────────┘
           ▼
┌──────────────────────────┐
│  LaTeX Processing         │  ← Fills template placeholders with
│                           │     escaped user data ({{NAME}}, etc.)
└──────────┬───────────────┘
           ▼
┌──────────────────────────┐
│  PDF Compilation          │  ← Local: pdflatex
│                           │     Docker: latexmk (TeX Live)
└──────────┬───────────────┘
           ▼
   User downloads PDF resume
   (temp file auto-cleaned)
```

---

### 🎓 Workflow 3: RAG Study Assistant

```
User uploads resume for study
        │
        ▼
┌───────────────────────────────┐
│  1. Extract & Chunk           │  ← PDF → text → RecursiveCharacterTextSplitter
│     (500 chars, 100 overlap)  │     (LangChain)
└───────────┬───────────────────┘
            ▼
┌───────────────────────────────┐
│  2. Embed & Store             │  ← Google Generative AI Embeddings
│     in Pinecone               │     (gemini-embedding-001, 768 dims)
│     (per-user namespace)      │     Clears old vectors on re-upload
└───────────┬───────────────────┘
            ▼
    User asks a question
            │
            ▼
┌───────────────────────────────┐
│  3. Retrieve Context (k=2)    │  ← Pinecone similarity search
│     from user's namespace     │     on user's resume vectors
└───────────┬───────────────────┘
            ▼
┌───────────────────────────────┐
│  4. Generate Answer           │  ← Gemini 2.5 Flash with:
│     (RAG + Memory)            │     • Retrieved resume context
│                               │     • Conversation summary
│                               │     • Recent messages (short-term)
└───────────┬───────────────────┘
            ▼
┌───────────────────────────────┐
│  5. Memory Management         │  ← Auto-summarizes after 6 messages
│                               │     using a separate Gemini instance
│                               │     (temperature=0 for consistency)
└───────────────────────────────┘
```

**Memory Architecture:**
- **Short-term:** Last 6 messages stored in MongoDB (`StudyMemory`)
- **Long-term:** Auto-summarized conversation history
- **Context:** Per-user vector namespace in Pinecone
- On new resume upload → both memory and vectors are reset

---

### 🔐 Authentication Flow

```
┌──────────────────┐     ┌──────────────────┐
│   Email/Password │     │   Google OAuth    │
│   Registration   │     │   One-Tap Login   │
└────────┬─────────┘     └────────┬─────────┘
         │                        │
         ▼                        ▼
   bcrypt hashing          Google ID token
   + MongoDB save          verification
         │                        │
         └────────┬───────────────┘
                  ▼
           JWT generated
           (7-day expiry)
                  │
                  ▼
         Stored in localStorage
         + React AuthContext
                  │
                  ▼
         Protected routes via
         middleware verification
```

---

## 📁 Project Structure

```
AI_Resume_Platform/
│
├── frontend/                    # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── features/        # Feature-specific components
│   │   │   ├── layout/          # Navbar, Footer, Sidebar
│   │   │   └── ui/              # Reusable UI components (Card, Badge, etc.)
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global auth state (JWT + Google OAuth)
│   │   ├── hooks/
│   │   │   └── useAuth.js       # Custom auth hook
│   │   ├── pages/
│   │   │   ├── Landing.jsx      # Animated landing page (GSAP)
│   │   │   ├── Login.jsx        # Email + Google login
│   │   │   ├── Register.jsx     # User registration
│   │   │   ├── Dashboard.jsx    # Resume history & scores
│   │   │   ├── Analyze.jsx      # Upload & analyze resume
│   │   │   ├── Generate.jsx     # Multi-step resume builder form
│   │   │   └── Study.jsx        # RAG chat interface
│   │   ├── utils/
│   │   │   └── api.js           # Axios instance with base URL
│   │   ├── App.jsx              # Route definitions
│   │   └── main.jsx             # Entry point with AuthProvider
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                      # Express.js Backend
│   ├── controllers/
│   │   ├── authController.js    # Register, Login, Google OAuth
│   │   └── resumeController.js  # Get latest/all resumes, delete
│   ├── middlewares/
│   │   ├── authMiddleware.js    # JWT verification middleware
│   │   └── uploadMiddleware.js  # Multer config for PDF uploads
│   ├── models/
│   │   ├── User.js              # User schema (local + Google auth)
│   │   ├── Resume.js            # Analyzed resume storage
│   │   ├── StudyResume.js       # Study mode resume storage
│   │   └── StudyMemory.js       # Conversation memory for RAG
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth/*
│   │   ├── resumeRoutes.js      # /api/resume/*
│   │   ├── generatorRoutes.js   # /api/generator/*
│   │   └── studyRoutes.js       # /api/study/*
│   ├── services/
│   │   ├── aiProvider.js        # LangChain model init (Gemini)
│   │   ├── resumeAnalyzer/
│   │   │   └── analyzeResume.js # ATS analysis with structured prompts
│   │   ├── resumeGenerator/
│   │   │   └── generateResume.js# LaTeX template → PDF pipeline
│   │   ├── resumeParser/
│   │   │   └── pdfParser.js     # PDF text extraction
│   │   └── study/
│   │       ├── ragCore.js       # Pinecone + embeddings + vector store
│   │       └── studyServices.js # Study chat with RAG + memory
│   ├── templates/
│   │   ├── fresher.tex          # LaTeX template for freshers
│   │   └── placement.tex        # LaTeX template for experienced
│   ├── Dockerfile               # Node 20 + TeX Live
│   ├── index.js                 # Server entry point
│   └── package.json
│
└── docker-compose.yml           # Container orchestration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB Atlas** account (or local MongoDB)
- **Google Cloud** project with:
  - Gemini API key enabled
  - OAuth 2.0 Client ID (for Google Sign-In)
- **Pinecone** account with an index (768 dimensions, cosine metric)
- **LaTeX** distribution (for local resume generation):
  - Windows: [MiKTeX](https://miktex.org/)
  - macOS: [MacTeX](https://www.tug.org/mactex/)
  - Linux: `sudo apt install texlive-full`

### 1. Clone the Repository

```bash
git clone https://github.com/Arshkhan18/AI-Resume-Analyzer.git
cd AI-Resume-Analyzer
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_key
GOOGLE_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
AI_PROVIDER=gemini
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_index_name
PINECONE_ENV=us-east-1
```

Start the server:

```bash
node index.js
```

The backend will run on `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Start the dev server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`.

### 4. Docker Deployment (Backend)

To run the backend with Docker (includes TeX Live for PDF generation):

```bash
docker-compose up --build
```

This will start the backend container on port `5000` with all LaTeX dependencies pre-installed.

---

## 🔑 Environment Variables

### Backend (`server/.env`)

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT token signing |
| `GOOGLE_API_KEY` | Google Gemini API key |
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID |
| `AI_PROVIDER` | AI provider setting (`gemini`) |
| `PINECONE_API_KEY` | Pinecone vector database API key |
| `PINECONE_INDEX_NAME` | Name of your Pinecone index |
| `PINECONE_ENV` | Pinecone environment region |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID (for Sign-In button) |

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | Register new user |
| `POST` | `/api/auth/login` | ❌ | Login with email/password |
| `POST` | `/api/auth/google` | ❌ | Google OAuth login |

### Resume Analysis

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/resume/upload` | ✅ | Upload & analyze resume PDF |
| `GET` | `/api/resume/latest` | ✅ | Get latest analyzed resume |
| `GET` | `/api/resume/all` | ✅ | Get all user's resumes |
| `DELETE` | `/api/resume/:id` | ✅ | Delete a resume entry |

### Resume Generation

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/generator/generate` | ✅ | Generate resume PDF from form data |

### Study Assistant

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/study/upload` | ✅ | Upload resume for study mode |
| `POST` | `/api/study/chat` | ✅ | Chat with AI about your resume |

---

## 🧠 AI Models Used

| Model | Use Case | Temperature |
|-------|----------|-------------|
| `gemini-3-flash-preview` | Resume ATS analysis | 0.2 |
| `gemini-2.5-flash` | Study chat responses | 0.2 |
| `gemini-2.5-flash` | Memory summarization | 0.0 |
| `gemini-embedding-001` | Document embedding (768 dims) | — |

---

## 📜 License

This project is open source and available under the [ISC License](LICENSE).

---

## 🙌 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📬 Contact

For questions or feedback, feel free to reach out or open an issue on the [GitHub repository](https://github.com/Arshkhan18/AI-Resume-Analyzer).

---

<p align="center">
  <b>Built with ❤️ using React, Express, Gemini AI & LangChain</b>
</p>
