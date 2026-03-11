# UGC Creators Club — AI Toolkit

3 tools for UGC creators: Rate Calculator, Pitch Generator, Content Ideas.

---

## Deploy to Vercel (takes ~5 minutes)

### Step 1 — Upload to GitHub
1. Go to github.com and sign in (or create a free account)
2. Click **New repository** → name it `ugc-toolkit` → click **Create repository**
3. Click **uploading an existing file**
4. Upload all the files from this folder
5. Click **Commit changes**

### Step 2 — Deploy on Vercel
1. Go to vercel.com and sign in with your GitHub account
2. Click **Add New Project**
3. Find `ugc-toolkit` and click **Import**
4. Click **Deploy** (leave all settings as default)

### Step 3 — Add your API key
1. In Vercel, go to your project → **Settings** → **Environment Variables**
2. Add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: your Anthropic API key (get it at console.anthropic.com)
3. Click **Save**
4. Go to **Deployments** → click the three dots on your latest deploy → **Redeploy**

### Done
Vercel gives you a URL like `ugc-toolkit.vercel.app`. You can also add a custom domain in Vercel settings.

---

## Custom Domain (optional)
1. In Vercel → Settings → Domains → Add your domain
2. Follow the DNS instructions (usually just adding a CNAME record in your domain settings)

3. 
