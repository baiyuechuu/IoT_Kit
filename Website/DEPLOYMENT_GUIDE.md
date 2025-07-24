# 🚀 Deployment Guide - Fixing 404 Issues in Production

## 🔍 **Problem Description**

When you reload pages like `/about`, `/dashboard`, `/uikit` in production, you get a **404 error**. This happens because:

1. Your app is a **Single Page Application (SPA)** using client-side routing
2. When you reload `/about`, the server tries to find a physical file at `/about`
3. Since there's no physical file, it returns a 404 error
4. The server needs to be configured to serve `index.html` for all routes

## ✅ **Solutions by Hosting Provider**

### 🔹 **Vercel (Recommended)**

File: `vercel.json` (already created)
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Deploy to Vercel:**
```bash
# Install Vercel CLI
bun add -g vercel

# Deploy
vercel

# Or connect your GitHub repo to Vercel dashboard
```

### 🔹 **Netlify**

File: `public/_redirects` (already created)
```
/*    /index.html   200
```

**Deploy to Netlify:**
1. Connect your GitHub repo to Netlify
2. Build command: `bun run build`
3. Publish directory: `dist`

### 🔹 **Apache Server**

File: `public/.htaccess` (already created)
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

### 🔹 **Nginx**

Add to your Nginx server config:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/your/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 🔹 **GitHub Pages**

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
          
      - name: Install dependencies
        run: bun install
        
      - name: Build
        run: bun run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Then add this to `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/your-repo-name/', // Add this line
  // ... rest of config
});
```

### 🔹 **Firebase Hosting**

Install Firebase CLI and run:
```bash
firebase init hosting
```

Configure `firebase.json`:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

Deploy:
```bash
bun run build
firebase deploy
```

### 🔹 **AWS S3 + CloudFront**

1. **S3 Bucket Setup:**
   - Enable Static Website Hosting
   - Set error document to `index.html`

2. **CloudFront Distribution:**
   - Create distribution pointing to S3
   - Add custom error page: 404 → `/index.html` (200 status)

### 🔹 **Docker + Nginx**

Create `Dockerfile`:
```dockerfile
FROM oven/bun:1 as build

WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:
```nginx
events {}

http {
    include /etc/nginx/mime.types;
    
    server {
        listen 80;
        root /usr/share/nginx/html;
        index index.html;
        
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

## 🔧 **Build & Deploy Commands**

```bash
# Build for production
bun run build

# Test the build locally
bun run preview

# The built files will be in the `dist` folder
# Upload the contents of `dist` to your hosting provider
```

## 🚨 **Important Notes**

1. **Always test your build locally** with `bun run preview` before deploying
2. **Environment variables** must be set in your hosting provider's dashboard
3. **HTTPS is required** for OAuth providers (GitHub, Google)
4. **Update Supabase settings** with your production URL

## 🔧 **Environment Variables for Production**

Make sure to set these in your hosting provider:
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## ✅ **Testing Checklist**

After deployment, test these routes by **reloading the page**:
- [ ] `/` (Home)
- [ ] `/about`
- [ ] `/uikit`
- [ ] `/dashboard`
- [ ] `/showcase`
- [ ] `/contact`
- [ ] `/login`
- [ ] `/sign`

All should load without 404 errors!

## 🆘 **Still Having Issues?**

1. Check browser console for errors
2. Verify your hosting provider's documentation
3. Ensure all files are uploaded correctly
4. Check if environment variables are set
5. Test the build locally first with `bun run preview` 