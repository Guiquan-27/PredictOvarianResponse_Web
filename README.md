# IVF Ovarian Response Prediction System

A machine learning-powered ovarian response prediction tool that helps medical professionals assess ovarian response risks in IVF treatments.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://predict-ovarian-response-web.vercel.app)
[![Backend API](https://img.shields.io/badge/API-Backend-blue)](https://predictovarianresponseweb-production.up.railway.app)

## 🚀 Quick Start

### Deploy to Cloud (Recommended)
This application is designed for deployment on:
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
│   └── legacy_shiny_app/  # Legacy Shiny application
├── shiny_ovarianresp/     # Original R/Shiny models
├── CLAUDE.md              # Project documentation
├── DEPLOYMENT.md          # Deployment guide
├── README.md              # Project description
└── start_system.sh        # System startup script
```

## 📋 Features

- 🔬 **Intelligent Prediction**: Predict ovarian response risks based on clinical parameters
- 📊 **Visual Analytics**: Intuitive risk assessment charts and visualizations
- 📱 **Responsive Design**: Supports access from various devices
- 🏥 **Clinical Recommendations**: Treatment suggestions based on prediction results
- 📋 **Prediction History**: Save and manage prediction records
- 🌍 **International Ready**: Full English interface for global use

## 💻 Technology Stack

### Frontend
- React 18 + TypeScript
- Ant Design 5 UI Library
- Vite Build Tool
- Zustand State Management
- React Query for API Management
- Comprehensive Testing (Vitest + Playwright)

### Backend
- Python 3 HTTP Server
- JSON Data Exchange
- CORS Cross-Origin Support
- Railway-ready deployment

### Deployment
- Frontend: Vercel (Static hosting)
- Backend: Railway (Python hosting)
- Domain: Custom domain support

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm run dev          # Development server
npm run build        # Production build
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
npm run lint         # Code linting
npm run type-check   # TypeScript checking
```

### Backend Development
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
  "Age": 32,
  "Duration": 6,
  "Weight": 58,
  "FSH": 7.2,
  "LH": 4.8,
  "AMH": 2.1,
  "AFC": 12,
  "DBP": 78,
  "WBC": 6.2,
  "RBC": 4.4,
  "ALT": 22,
  "P": 1.1,
  "PLT": 280,
  "POIorDOR": 2,
  "PCOS": 2
}

Response: {
  "status": "success",
  "por_prediction": {
    "poor_response_prob": 0.15,
    "normal_response_prob": 0.85
  },
  "hor_prediction": {
    "high_response_prob": 0.05,
    "normal_response_prob": 0.95
  }
}
```

## 🎯 Usage Instructions

1. Open your browser and navigate to the application URL
2. Fill in the patient's clinical parameters in the prediction form
3. Click the "Start Prediction" button
4. Review the prediction results and clinical recommendations
5. Export or print the prediction report if needed

## 🚀 Deployment

This application is optimized for free cloud deployment:

1. **Backend on Railway**: Automatic Python environment detection
2. **Frontend on Vercel**: Static React build with CDN
3. **Custom Domain**: Optional custom domain configuration

See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step deployment instructions.

## 🔒 Medical Disclaimer

This prediction system is designed for research and clinical decision support purposes only. Results should not replace clinical judgment and comprehensive patient evaluation. Always consult with qualified medical professionals before making treatment decisions.

## 📄 License

This project is for academic research and educational purposes only.

---

**Made with ❤️ for advancing reproductive medicine through AI**