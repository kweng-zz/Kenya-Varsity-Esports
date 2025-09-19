@echo off
echo Setting up Git repository for Strapi backend...

cd kuer-backend
git init
git add .
git commit -m "Initial Strapi backend for Railway deployment"

echo.
echo ✅ Git repository initialized!
echo.
echo Next steps:
echo 1. Create a new repository on GitHub called 'kuer-backend'
echo 2. Copy the repository URL
echo 3. Run: git remote add origin YOUR_GITHUB_REPO_URL
echo 4. Run: git push -u origin main
echo 5. Deploy to Railway using the GitHub repository

pause