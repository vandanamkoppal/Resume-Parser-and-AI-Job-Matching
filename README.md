# 🧠 ResumeAI — Resume Parser & Job Matching

## Tech Stack
- Frontend: React 18
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Upload: Multer
- Parsing: Custom PDF text extraction

## Features
- Drag & drop resume upload (PDF, max 5MB)
- Auto-parse: Name, Email, Phone, Skills, Education
- Editable candidate profile
- Job listings with fitment scoring
- Color-coded match score (Green >70, Yellow 40-70, Red <40)
- Candidate database with search/filter

## Setup
### Backend
cd backend
npm install
npm run seed
npm run dev

### Frontend
cd frontend
npm install
npm start

## API Endpoints
- POST /api/upload — Upload resume
- GET /api/candidates — List candidates
- GET /api/candidates/:id — Get candidate
- PUT /api/candidates/:id — Update candidate
- DELETE /api/candidates/:id — Delete candidate
- GET /api/jobs — List jobs
- POST /api/jobs/match/:jobId — Fitment score