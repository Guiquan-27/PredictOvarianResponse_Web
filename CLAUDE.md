# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **Ovarian Response Prediction System** consisting of:
- **Python-based API backend** with simple HTTP server for machine learning predictions
- **React frontend** with TypeScript, Ant Design for medical prediction interface
- **Clinical prediction algorithm** for predicting Poor Ovarian Response (POR) and High Ovarian Response (HOR)
- **Legacy Shiny application** archived in scripts directory

## Core Technologies

**Backend (Python)**:
- Native Python HTTP server
- Clinical scoring algorithm for ovarian response prediction
- CORS enabled for frontend communication

**Frontend (React)**:
- React 18 + TypeScript 5 + Vite
- Ant Design 5 UI components
- Zustand + React Query for state management
- Vitest + Playwright for testing

## Key Commands

### System Management
```bash
# Start both backend and frontend
./start_system.sh

# Stop the system
./stop_system.sh

# Manual backend startup
cd backend && python3 simple_api.py
```

### Frontend Development
```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
npm run test:e2e

# Linting and type checking
npm run lint
npm run type-check
```

## Architecture

### API Structure
- **Main API**: `plumber.R` - Plumber API with `/predict` and `/health` endpoints
- **API Runner**: `run_api.R` - Starts the API server on port 8000
- **Model Loading**: XGBoost workflows loaded from `forshiny.RData`
- **CORS Enabled**: Full CORS support for frontend integration

### Model Architecture
- **Input Features**: 15 clinical parameters (Age, Duration, Weight, FSH, LH, AMH, AFC, DBP, WBC, RBC, ALT, P, PLT, POIorDOR, PCOS)
- **Models**: Two XGBoost classifiers via tidymodels workflows
  - `pordm_final_wfversion`: Poor Ovarian Response prediction
  - `hordm_final_wfversion`: High Ovarian Response prediction
- **Output**: Probability scores for each response category

### Frontend Architecture
- **Entry Point**: `frontend/src/main.tsx`
- **Main App**: `frontend/src/App.tsx` 
- **API Integration**: `frontend/src/services/` handles API communication
- **State Management**: Zustand stores in `frontend/src/stores/`
- **UI Components**: Ant Design components in `frontend/src/components/`

### Development Workflow
1. **API Development**: Modify `plumber.R`, test with `test_api.R`, run with `run_api.R`
2. **Frontend Development**: Use `npm run dev` in frontend directory
3. **Integration Testing**: Frontend proxies API calls to `http://127.0.0.1:8000`
4. **Production Build**: Frontend builds to static files, API runs independently

### Key Files
- `plumber.R`: Main API definition with prediction endpoints
- `run_api.R`: API server startup script
- `test_api.R`: API testing script with sample data
- `frontend/package.json`: Frontend dependencies and scripts
- `shiny_ovarianresp/forshiny.RData`: Trained model objects
- `.cursor/rules/`: Development workflow and coding standards

### Compatibility Notes
- **Model Compatibility**: Includes compatibility shims for different parsnip/tidymodels versions
- **CORS Handling**: Comprehensive CORS setup for cross-origin requests
- **Error Handling**: Robust error handling with detailed error messages
- **Input Validation**: Validates all required input parameters

### Testing Strategy
- **API Testing**: Use `test_api.R` for backend endpoint testing
- **Frontend Testing**: Vitest for unit tests, Playwright for E2E tests
- **Integration Testing**: Test frontend-backend communication via proxy