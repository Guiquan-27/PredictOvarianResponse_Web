# Deployment Guide for IVF Ovarian Response Prediction System

This guide will help you deploy the application to Vercel (frontend) and Railway (backend) for free.

## Prerequisites

1. **GitHub Account**: Required for code hosting
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (use GitHub login)
3. **Railway Account**: Sign up at [railway.app](https://railway.app) (use GitHub login)

## Step 1: Prepare GitHub Repository

1. Create a new repository on GitHub
2. Push your project code to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: IVF Ovarian Response Prediction System"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

## Step 2: Deploy Backend to Railway

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will automatically:
   - Detect Python environment
   - Install dependencies from `requirements.txt`
   - Start the server using `railway.json` configuration
5. Once deployed, copy the backend URL (e.g., `https://your-app.railway.app`)

### Railway Configuration
- **Start Command**: `python3 simple_api.py`
- **Health Check**: `/health` endpoint
- **Port**: Automatically configured via environment variable

## Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project" → Import your GitHub repository
3. Configure project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Set environment variables in Vercel dashboard:
   - `VITE_API_BASE_URL`: Your Railway backend URL (from Step 2)
   - `VITE_APP_TITLE`: "IVF Ovarian Response Prediction System"
5. Click "Deploy"

### Frontend Configuration
- Build tool: Vite
- Framework: React + TypeScript
- UI Library: Ant Design
- Deployment target: Static files

## Step 4: Update CORS Settings

After deployment, update the backend CORS settings to allow your Vercel domain:

1. Edit `simple_api.py`
2. In the CORS headers, add your Vercel domain
3. Push changes to GitHub (will auto-deploy)

## Step 5: Test Deployment

1. Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Test the prediction functionality
3. Check that API calls work correctly
4. Verify both frontend and backend are responding

## Environment Variables

### Frontend (.env.production)
```
VITE_API_BASE_URL=https://your-railway-backend.railway.app
VITE_API_TIMEOUT=30000
VITE_MAX_RETRIES=3
VITE_APP_TITLE=IVF Ovarian Response Prediction System
VITE_DEBUG=false
```

### Backend (Railway Environment)
- `PORT`: Automatically set by Railway
- No additional configuration needed

## Troubleshooting

### Common Issues

1. **CORS Error**: Update backend to allow Vercel domain
2. **Build Failed**: Check Node.js version in Vercel settings
3. **API Not Found**: Verify backend URL in environment variables
4. **Railway Sleep**: Free tier has sleep after inactivity (first request may be slow)

### Logs and Debugging

- **Railway Logs**: Available in Railway dashboard
- **Vercel Logs**: Available in Vercel dashboard under "Functions" tab
- **Browser Console**: Check for client-side errors

## Free Tier Limitations

### Railway
- 500 hours/month runtime
- 1GB memory
- 5GB storage
- Apps sleep after inactivity

### Vercel
- 100GB bandwidth/month
- Unlimited static hosting
- 10 second function timeout

## Custom Domain (Optional)

1. Purchase a domain from any registrar
2. Add domain in Vercel dashboard
3. Update DNS records as instructed
4. SSL certificate is automatically provided

## Automatic Deployments

Both platforms support automatic deployments:
- Push to `main` branch → Auto-deploy to production
- Create pull request → Auto-deploy preview (Vercel only)

## Contact

For technical issues with the prediction system, contact: frank_sjtu@hotmail.com

---

**Note**: This deployment guide assumes you're using the free tiers of both services, which are perfect for demonstration and development purposes.