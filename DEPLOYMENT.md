# Deploying to Vercel

Your app has two parts:
1. **Frontend (Next.js)** → Deploy to Vercel
2. **Backend (Express)** → Deploy to **Railway**, **Render**, or **Fly.io** (Vercel does not host long-running Express servers)

---

## Step 1: Deploy Backend First

### Option A: Railway (Recommended)

1. Go to [railway.app](https://railway.app) and sign up
2. Create a new project → **Deploy from GitHub** → Select your repo
3. Set the **root directory** to `backend`
4. Add environment variables in Railway dashboard:
   - `MONGODB_URI` – Your MongoDB Atlas connection string
   - `JWT_SECRET` – Secret for JWT
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `PORT` – Railway sets this automatically; you can leave it
5. Configure build & start:
   - Build: `npm run build`
   - Start: `npm start`
6. Deploy. Copy your backend URL (e.g. `https://your-app.up.railway.app`)

### Option B: Render

1. Go to [render.com](https://render.com)
2. New → **Web Service**
3. Connect repo, set **Root Directory** to `backend`
4. Build: `npm install && npm run build`
5. Start: `npm run start` (or `npx ts-node src/index.ts`)
6. Add env vars same as above
7. Deploy and copy the URL

---

## Step 2: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. **Import** your GitHub repo
3. Vercel auto-detects Next.js. Set:
   - **Root Directory**: leave as `.` (project root)
   - **Framework Preset**: Next.js
4. Add **Environment Variable**:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-backend-url.railway.app` (your backend URL from Step 1)
5. Deploy

---

## Step 3: Backend CORS

On your backend host (Railway/Render), add:

```
FRONTEND_URL=https://your-app.vercel.app
```

Replace with your actual Vercel URL. For multiple origins, use comma-separated:

```
FRONTEND_URL=https://your-app.vercel.app,https://www.your-app.vercel.app
```

---

## Environment Variables Summary

### Frontend (Vercel)

| Variable            | Value                         |
|---------------------|-------------------------------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.railway.app` |

### Backend (Railway/Render)

| Variable                  | Value                             |
|---------------------------|-----------------------------------|
| `MONGODB_URI`             | MongoDB Atlas connection string   |
| `JWT_SECRET`              | Your secret key                   |
| `CLOUDINARY_CLOUD_NAME`   | Cloudinary cloud name             |
| `CLOUDINARY_API_KEY`      | Cloudinary API key                |
| `CLOUDINARY_API_SECRET`   | Cloudinary API secret             |
| `FRONTEND_URL`            | `https://your-app.vercel.app`     |

---

## Local Development

- Frontend: `npm run dev` (uses `http://localhost:5000` by default)
- Backend: `cd backend && npm run dev`
- No `NEXT_PUBLIC_API_URL` needed locally; it falls back to `http://localhost:5000`
