# Deployment Guide

This guide covers various deployment options for the Pomodoro Timer application.

## Quick Deployment Options

### 1. Docker (Recommended)

The easiest way to deploy the application is using Docker.

#### Using Docker Compose

```bash
# Build and start the application
npm run docker:compose:build

# Or manually
docker-compose up --build -d
```

The application will be available at `http://localhost:3000`

#### Using Docker Directly

```bash
# Build the image
npm run docker:build
# or: docker build -t pomodoro-timer .

# Run the container
npm run docker:run
# or: docker run -d -p 3000:80 pomodoro-timer
```

#### Docker Commands Reference

```bash
# View logs
npm run docker:logs
# or: docker-compose logs -f

# Stop the application
npm run docker:stop
# or: docker-compose down

# Restart services
docker-compose restart
```

### 2. Static Hosting (Netlify, Vercel, GitHub Pages)

Build the static files and deploy to any static hosting service.

#### Build for Production

```bash
# Install dependencies
npm install

# Build the application
npm run build
```

This creates optimized static files in the `dist/` directory.

#### Netlify

1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Deploy!

#### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### GitHub Pages

```bash
# Build the project
npm run build

# Deploy to gh-pages branch (requires gh-pages package)
npx gh-pages -d dist
```

### 3. Traditional Web Server (Apache/Nginx)

#### Build

```bash
npm run build
```

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Apache Configuration (.htaccess)

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### 4. Cloud Platforms

#### Azure Container Apps

Use the provided deployment scripts:

```powershell
# Deploy to Azure
.\deploy-azure.ps1
```

Or using bash:

```bash
./deploy-azure.sh
```

#### AWS (S3 + CloudFront)

```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

#### Google Cloud Platform (Cloud Storage)

```bash
# Build
npm run build

# Upload to Cloud Storage
gsutil -m rsync -r dist/ gs://your-bucket-name

# Set public access
gsutil iam ch allUsers:objectViewer gs://your-bucket-name
```

## Environment Configuration

### Build-Time Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://api.yourapp.com
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

Access in your code:

```javascript
const apiBase = import.meta.env.VITE_API_BASE_URL
```

### Production Checklist

Before deploying to production:

- [ ] Update meta tags in `index.html` with your domain
- [ ] Update `sitemap.xml` with your domain
- [ ] Update `robots.txt` with your sitemap URL
- [ ] Configure analytics (Google Analytics)
- [ ] Set up proper SSL/TLS certificate
- [ ] Enable HTTPS redirect
- [ ] Configure CDN if needed
- [ ] Set up monitoring and error tracking
- [ ] Test on multiple devices and browsers
- [ ] Verify PWA functionality
- [ ] Check performance with Lighthouse

## Docker Production Optimization

The included Dockerfile uses multi-stage builds for optimization:

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

### Custom Nginx Configuration

The `nginx.conf` file includes:
- Gzip compression
- Security headers
- Proper caching
- SPA routing support
- Health check endpoint

## Monitoring & Maintenance

### Health Check

The application includes a health check endpoint:

```
GET /health
```

Returns `200 OK` when the service is healthy.

### Logs

View application logs:

```bash
# Docker Compose
docker-compose logs -f app

# Docker
docker logs -f pomodoro-timer
```

### Updates

To update the deployed application:

```bash
# Pull latest code
git pull

# Rebuild and restart
npm run docker:compose:build
```

## Troubleshooting

### Build Fails

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Docker Issues

```bash
# Remove old containers and images
docker-compose down
docker system prune -a

# Rebuild from scratch
docker-compose up --build --force-recreate
```

### SPA Routing Not Working

Ensure your server is configured to redirect all routes to `index.html` for client-side routing.

## Security Best Practices

1. **Always use HTTPS in production**
2. **Keep dependencies updated**: `npm audit fix`
3. **Configure CSP headers** in nginx.conf
4. **Enable CORS** only for trusted domains
5. **Implement rate limiting** for API endpoints
6. **Regular security scans**: Use tools like Snyk or npm audit

## Performance Tips

1. **Enable CDN** for static assets
2. **Configure caching headers** properly
3. **Use lazy loading** for routes and components
4. **Optimize images** and use WebP format
5. **Monitor with Lighthouse** and optimize Core Web Vitals
6. **Consider PWA** for offline functionality

## Support

For deployment issues:
- Check the [GitHub Issues](https://github.com/AUsfy/pomodeepfocus/issues)
- Review the [Architecture documentation](./ARCHITECTURE.md)
- Consult the [Contributing guide](./CONTRIBUTING.md)
