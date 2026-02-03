# DrawWiz - Deployment Guide

## 🌐 Production Deployment

### Backend Deployment

#### Option 1: Render (Recommended)
1. Create account at [render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment Variables**:
     ```
     PORT=3001
     CLIENT_URL=https://your-frontend-url.com
     NODE_ENV=production
     ```

#### Option 2: Railway
1. Create account at [railway.app](https://railway.app)
2. Create new project from GitHub repo
3. Select backend directory as root
4. Set environment variables:
   ```
   PORT=3001
   CLIENT_URL=https://your-frontend-url.com
   NODE_ENV=production
   ```

#### Option 3: Heroku
1. Install Heroku CLI
2. Create new app: `heroku create your-app-name`
3. Set environment variables:
   ```bash
   heroku config:set PORT=3001
   heroku config:set CLIENT_URL=https://your-frontend-url.com
   heroku config:set NODE_ENV=production
   ```
4. Deploy: `git push heroku main`

### Frontend Deployment

#### Option 1: Vercel (Recommended)
1. Create account at [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: dist
   - **Environment Variables**:
     ```
     VITE_SERVER_URL=https://your-backend-url.com
     ```
4. Deploy!

#### Option 2: Netlify
1. Create account at [netlify.com](https://netlify.com)
2. Import GitHub repository
3. Configure:
   - **Base Directory**: frontend
   - **Build Command**: `npm run build`
   - **Publish Directory**: frontend/dist
   - **Environment Variables**:
     ```
     VITE_SERVER_URL=https://your-backend-url.com
     ```

#### Option 3: GitHub Pages
1. Build the project:
   ```bash
   cd frontend
   npm run build
   ```
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Add to package.json:
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```
4. Deploy: `npm run deploy`

## 🔒 Security Considerations

### Environment Variables
Never commit `.env` files to version control. Always use:
- `.env.example` for templates
- Platform-specific environment variable settings

### CORS Configuration
Update `backend/src/index.js` CORS settings:
```javascript
cors: {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST']
}
```

### Rate Limiting (Recommended)
Add rate limiting to prevent abuse:
```bash
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

## 📊 Monitoring

### Backend Health Check
The server includes a health check endpoint:
```
GET /health
Response: { status: 'ok', timestamp: 1234567890 }
```

### Logging
Add structured logging:
```bash
npm install winston
```

### Error Tracking
Consider adding error tracking:
- [Sentry](https://sentry.io)
- [LogRocket](https://logrocket.com)
- [Bugsnag](https://bugsnag.com)

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          # Add your deployment script here

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and Deploy
        run: |
          cd frontend
          npm install
          npm run build
          # Deploy dist folder
```

## 📈 Scaling Considerations

### Database Integration
For persistent storage, integrate MongoDB:
```bash
npm install mongodb mongoose
```

### Redis for Caching
Add Redis for session management:
```bash
npm install redis
```

### Load Balancing
- Use multiple server instances
- Implement sticky sessions for Socket.io
- Use Redis adapter for Socket.io

## 🔐 SSL/HTTPS
Ensure both backend and frontend use HTTPS in production:
- Most platforms (Vercel, Netlify, Render) provide free SSL
- Update socket connection to use `wss://` instead of `ws://`

## 📝 Post-Deployment Checklist

- [ ] Both frontend and backend deployed
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] SSL/HTTPS enabled
- [ ] Health checks passing
- [ ] Socket.io connections working
- [ ] Test full game flow
- [ ] Monitor error logs
- [ ] Set up analytics (optional)

## 🆘 Troubleshooting

### Socket.io Connection Fails
- Check CORS configuration
- Verify WebSocket support on platform
- Ensure polling fallback is enabled

### Build Failures
- Check Node.js version compatibility
- Verify all dependencies installed
- Review build logs for specific errors

### Performance Issues
- Enable compression
- Implement caching
- Optimize bundle size
- Use CDN for static assets

---

**Ready for Production! 🚀**
