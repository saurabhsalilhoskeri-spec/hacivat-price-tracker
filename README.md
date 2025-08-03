# Hacivat Price Tracker (Render Version)

This app runs hourly on Render, scrapes FragranceX for the Hacivat perfume price using Puppeteer, and emails you if it drops below $245 CAD.

## 🔧 Setup Instructions (Render.com)

1. Go to [https://render.com](https://render.com) and log in.
2. Click **New > Web Service** and connect your GitHub or upload this code.
3. Set the following **Environment Variables** in Render:
   - `ALERT_EMAIL`: your Gmail address (e.g. youralertemail@gmail.com)
   - `ALERT_EMAIL_PASSWORD`: your Gmail App Password (not your real password!)

4. Set Build Command:
   ```
   npm install
   ```

5. Set Start Command:
   ```
   node index.js
   ```

6. Set to run as **Background Worker** (not web service)

7. Use Render's built-in cron to schedule hourly:
   ```
   Every hour (0 * * * *)
   ```

## 🔐 Gmail Setup

Use an **App Password** instead of your real Gmail password:  
https://myaccount.google.com/apppasswords

