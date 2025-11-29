# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Ovarian Response Prediction System** - A machine learning-powered tool that helps medical professionals assess ovarian response risks in IVF treatments by predicting Poor Ovarian Response (POR) and High Ovarian Response (HOR).

**Tech Stack**:
- **Backend**: Python 3 HTTP server with clinical scoring algorithm
- **Frontend**: React 18 + TypeScript 5 + Vite + Ant Design 5
- **State**: Zustand + React Query
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Deployment**: Vercel (frontend) + Railway (backend)

## Key Commands

### System Management
```bash
./start_system.sh          # Start both backend and frontend
./stop_system.sh           # Stop the system
python3 simple_api.py      # Manual backend startup (port 8000)
```

### Frontend Development
```bash
cd frontend
npm run dev                # Development server
npm run build              # Production build
npm run test               # Unit tests
npm run test:e2e           # E2E tests
npm run lint               # Linting
npm run type-check         # TypeScript checking
```

## Architecture

### Backend API (`simple_api.py`)
- Native Python HTTP server on port 8000
- Endpoints: `GET /health`, `POST /predict`
- **Input**: 15 clinical parameters (Age, Duration, Weight, FSH, LH, AMH, AFC, DBP, WBC, RBC, ALT, P, PLT, POIorDOR, PCOS)
- **Output**: Probability scores for POR and HOR categories
- CORS enabled for cross-origin requests

### Frontend Structure
```
frontend/src/
├── App.tsx              # Main application
├── main.tsx             # Entry point
├── components/          # Ant Design UI components
├── services/            # API communication
├── stores/              # Zustand state management
├── pages/               # Page components
├── hooks/               # Custom React hooks
├── types/               # TypeScript definitions
└── __tests__/           # Test files
```

### Legacy R/Shiny Components
Located in `shiny_ovarianresp/` - contains original XGBoost model workflows (`forshiny.RData`) and R API files (`plumber.R`, `run_api.R`). The current production system uses `simple_api.py` which implements equivalent prediction logic.

## Development Workflow

1. **Local Development**: Run `./start_system.sh` or start backend/frontend separately
2. **Frontend**: Proxies API calls to `http://127.0.0.1:8000`
3. **Testing**: Run unit tests before commits, E2E tests for integration
4. **Deployment**: Frontend to Vercel, backend to Railway (see `DEPLOYMENT.md`)

## Configuration Files

- `railway.json`: Railway deployment config
- `frontend/vercel.json`: Vercel deployment config
- `requirements.txt`: Python dependencies
- `.cursor/rules/`: Development workflow and coding standards