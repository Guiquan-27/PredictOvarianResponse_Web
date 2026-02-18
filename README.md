# IVF Ovarian Response Prediction System

A machine learning-powered ovarian response prediction tool with a modern dark-themed UI, helping medical professionals assess ovarian response risks in IVF treatments.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://predict-ovarian-response-web.vercel.app)
[![Backend API](https://img.shields.io/badge/API-Backend-blue)](https://predictovarianresponseweb-production.up.railway.app)

## 🖥️ Screenshots

### Home — Hero Section
Dark-themed hero with gradient typography, key statistics, and feature cards.

### Prediction — Clinical Form
Multi-step wizard with organized parameter groups (Demographics, Hormones, Lab Values).

## 🚀 Quick Start

### Deploy to Cloud (Recommended)
- **Frontend**: Vercel (Free)
- **Backend**: Railway (Free)

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Local Development

#### Start the entire system
```bash
./start_system.sh
```

#### Manual startup

1. **Start Backend API Server**
```bash
python3 simple_api.py
```

2. **Start Frontend Development Server**
```bash
cd frontend
npm install
npm run dev
```

## 🏗️ Project Structure

```
├── frontend/               # React frontend application
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   ├── dist/              # Build output
│   ├── vercel.json        # Vercel deployment config
│   └── package.json       # Dependencies
├── simple_api.py          # Python API server
├── railway.json           # Railway deployment config
├── requirements.txt       # Python dependencies
├── scripts/               # Scripts and utilities
├── DEPLOYMENT.md          # Deployment guide
└── README.md              # This file
```

## 📋 Features

- 🔬 **AI-Powered Predictions** — XGBoost models for POR & HOR risk assessment
- 📊 **Visual Analytics** — Intuitive risk assessment charts and visualizations
- 🌙 **Dark Medical Tech Theme** — Glassmorphism UI with precision medicine aesthetics
- 📱 **Responsive Design** — Supports desktop, tablet, and mobile
- 🏥 **Clinical Decision Support** — Evidence-based treatment recommendations
- 📋 **Prediction History** — Save and manage prediction records

## 💻 Technology Stack

### Frontend
- React 18 + TypeScript
- Ant Design 5 (Dark Algorithm)
- Vite Build Tool
- Zustand State Management
- React Query for API Management
- DM Sans + Space Grotesk Typography
- CSS Variables Design System with Glassmorphism

### Backend
- Python 3 HTTP Server
- JSON Data Exchange
- CORS Cross-Origin Support

### Deployment
- Frontend: Vercel (Static hosting + CDN)
- Backend: Railway (Python hosting)

## 🎨 Design System

The UI follows a **Precision Medicine · Deep Tech** aesthetic:

| Token | Value |
|-------|-------|
| Background | `#080d1a` deep navy with grid texture |
| Primary | `#0ea5e9` sky blue |
| Accent | `#818cf8` indigo |
| Surface | `rgba(255,255,255,0.04)` glass |
| Font Body | DM Sans |
| Font Display | Space Grotesk |

## 🔧 Development

### Frontend
```bash
cd frontend
npm run dev          # Development server
npm run build        # Production build
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
npm run lint         # Code linting
npm run type-check   # TypeScript checking
```

### Backend
```bash
python3 simple_api.py  # Start API server
```

## 📊 API Endpoints

### Health Check
```
GET /health
Response: {"status": "API is running", "timestamp": "...", "model_status": "Models loaded successfully"}
```

### Prediction Endpoint
```
POST /predict
Content-Type: application/json

{
  "Age": 32, "Duration": 6, "Weight": 58,
  "FSH": 7.2, "LH": 4.8, "AMH": 2.1, "AFC": 12,
  "DBP": 78, "WBC": 6.2, "RBC": 4.4, "ALT": 22,
  "P": 1.1, "PLT": 280, "POIorDOR": 2, "PCOS": 2
}

Response: {
  "status": "success",
  "por_prediction": { "poor_response_prob": 0.15, "normal_response_prob": 0.85 },
  "hor_prediction": { "high_response_prob": 0.05, "normal_response_prob": 0.95 }
}
```

## 🔒 Medical Disclaimer

This prediction system is for research and clinical decision support purposes only. Results should not replace clinical judgment and comprehensive patient evaluation. Always consult with qualified medical professionals before making treatment decisions.

## 📄 License

This project is for academic research and educational purposes only.

---

**Made with ❤️ for advancing reproductive medicine through AI**
*Zhejiang University Women's Hospital*