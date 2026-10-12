# DEPLOYMENT.md - From this folder to a live website

You have a plain static website (no build step). Only the `site/` folder is published. This guide uses Cloudflare Pages first, then Vercel and GitHub Pages as alternatives. Button names on these dashboards change now and then, so follow the idea if a label looks different.

## 0. Before you deploy

1. **Add the three missing screenshots** (SentinelX, Setu-Drishti, VIGAM). See `site/assets/img/README.txt`. Until then those cards show "Screenshot coming soon", so do not share the link yet.
2. **Check your resume file.** `site/assets/Jatin-Naik-Resume.pdf` is the file visitors will open. It still contains your phone number. Replace it with another PDF of the same name if you change your mind.
3. **Confirm the conference spelling** (Shashtrarth vs Shaastrarth) and fix it in `site/index.html` if needed.
4. **Test locally.** From the `site/` folder run `python3 -m http.server 8000` (or `npx serve`) and open http://localhost:8000 on your computer. Open the same address from your phone on the same Wi-Fi using your computer's IP address.

## 1. Put the project on GitHub

```
cd jatin-portfolio
git init
git add .
git commit -m "Portfolio v1"
git branch -M main
git remote add origin https://github.com/Jatin-code16/portfolio.git
git push -u origin main
```

Create the empty repository `portfolio` on GitHub first (public is fine). Use any name you like, and change the URL above to match.

## 2. Option A (recommended): Cloudflare Pages

Why: free static hosting with unlimited bandwidth on the free plan, and no commercial-use restriction to worry about.

1. Create a free Cloudflare account and open **Workers & Pages**.
2. Choose **Create application**, select **Pages**, then **Connect to Git**.
3. Pick your `portfolio` repository and the production branch `main`.
4. Build settings for a plain static site:
   - Framework preset: **None**
   - Build command: leave **blank**
   - Build output directory: **`site`**
5. **Save and Deploy.** After about a minute you get an address like `portfolio.pages.dev`.
6. From now on, every `git push` to `main` redeploys automatically.

If the page is blank or shows "no files uploaded", the output directory is wrong. It must be the folder that directly contains `index.html`, which is `site`.

**Quick alternative without Git:** from inside `site/` run `npx wrangler pages deploy .` and follow the prompts.

**Custom domain:** in your Pages project open **Custom domains**, then **Set up a custom domain**, and follow the DNS steps. If you want only the custom address to be public, redirect the `pages.dev` address to it afterward.

## 3. Option B: Vercel

1. Sign in at vercel.com with GitHub and choose **Add New Project**, then import your repository.
2. Framework preset: **Other**. Leave the build command empty. Set the **Output Directory** to `site`.
3. Deploy. You get a `.vercel.app` address and automatic redeploys on every push.
4. The Hobby plan is for personal, non-commercial use. A job-hunting portfolio is normally fine. If you later take paid freelance clients, check Vercel's current terms.
5. Vercel ignores the `_headers` file. If you want those security headers there, add a `vercel.json` with a `headers` section.

## 4. Option C: GitHub Pages

GitHub Pages can only publish the repository root or a `/docs` folder directly, so for the `site/` folder use a workflow:

1. Copy `docs/optional/github-pages.yml` to `.github/workflows/pages.yml` and push.
2. In the repository open **Settings, then Pages**, and under **Build and deployment** set **Source** to **GitHub Actions**.
3. The workflow publishes the `site/` folder. Your address will be `https://jatin-code16.github.io/portfolio/`. The site's relative paths already work under that sub-path.
4. Check the action versions in the workflow against GitHub's current docs, since they get updated.

## 5. Updating the site later

1. Edit the files (for screenshots: put `name.webp` in `site/assets/img/` and set `img:'assets/img/name.webp'` in `site/js/data.js`).
2. `git add .`, `git commit -m "Add screenshots"`, `git push`.
3. Wait for the deploy to finish, then hard refresh (Ctrl+Shift+R, or clear the site data on your phone) because browsers cache files.
4. To roll back a bad deploy, redeploy an earlier deployment from the dashboard, or `git revert` the commit and push.

## 6. Checklist before you share the link

- [ ] No "Screenshot coming soon" cards left.
- [ ] All links work: resume View and Download, email, GitHub, LinkedIn, LeetCode, the four repos, three live demos, the SentinelX video, the two LinkedIn posts.
- [ ] Both themes look right at 360px (phone), 768px and 1280px.
- [ ] Projects fits one screen on your phone; the splash, lens and avatar flight feel smooth.
- [ ] Chrome DevTools, **Lighthouse**, mobile: aim for 90 or more in Performance, Accessibility, Best Practices and SEO. Note the scores in your README.
- [ ] Reduced motion works (turn on "Reduce motion" in your phone's accessibility settings and reload).
- [ ] Run the anti-slop audit (`skills/anti-slop-audit/SKILL.md`) and fix what it finds.
- [ ] Add your live address to the GitHub repo description, your LinkedIn and your resume.

## 7. Troubleshooting

| Problem | Likely cause and fix |
|---|---|
| Blank page or "no files uploaded" | Output directory is not `site`. |
| Images or CSS missing | File names are case sensitive on the server: match `avatar.webp`, `css/style.css` exactly. |
| Old version still showing | Browser cache: hard refresh, or open in a private window. |
| Resume does not open | The PDF must be at `site/assets/Jatin-Naik-Resume.pdf`; check the file name. |
| Font looks different | Google Fonts is blocked on that network; the fallback font is used. |
| Custom domain stuck on "verifying" | DNS has not updated yet (can take minutes to hours), or the record points to the wrong target. |

## 8. Privacy and safety

- Never commit passwords, API keys or tokens. This site needs none.
- The resume PDF is public once deployed. Anything in it is public.
- `AGENTS.md`, `docs/` and `skills/` are outside `site/`, so they are not published. They are still visible on GitHub if the repository is public.
