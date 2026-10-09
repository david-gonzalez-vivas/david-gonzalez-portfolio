# Deployment checklist

This folder is ready for a static deployment to GitHub + AWS Amplify.

## Before connecting the final domain
1. Deploy the folder as-is and verify all five pages.
2. Connect the final custom domain in Amplify.
3. Once the final public URL is known, add absolute canonical URLs to each HTML page.
4. Replace `YOUR-DOMAIN.example` in `robots.txt` and `sitemap.xml` with the final domain.
5. Change the Open Graph image paths to absolute URLs if your social sharing validator requires them.

## Pages
- `/` — Home
- `/build.html` — Build
- `/analyze.html` — Analyze
- `/improve.html` — Improve
- `/operate.html` — Operate

## AWS Amplify
This is a static site and does not require a build command. Point Amplify at the repository root containing these files. If you later move files into a subfolder, set Amplify's artifact base directory to that folder.

## Final checks
- Test desktop and mobile navigation.
- Verify email, GitHub and LinkedIn links.
- Run Lighthouse after deployment.
- Test the final URL in an Open Graph/social sharing debugger.
