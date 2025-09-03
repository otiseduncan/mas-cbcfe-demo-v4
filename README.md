# MAS Case by Case — Frontend (mas-cbcfe-demo-v4)

This is the correct, cleaned copy prepared for **GitHub Pages**.  
It disables Jekyll, builds to `docs/`, and sets the Vite `base` to this repo name.

## Local dev
```bash
npm install
npm run dev
# open http://localhost:5173/
```

## Build for GitHub Pages
```bash
npm run build               # outputs to docs/
# docs/.nojekyll is included so Pages won't run Jekyll
git add .
git commit -m "build"
git push
```

## GitHub Pages settings
- Settings → Pages
- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/docs**

## Notes
- Vite config uses:
  ```ts
  base: process.env.NODE_ENV === "production" ? "/mas-cbcfe-demo-v4/" : "/",
  build: { outDir: "docs" }
  ```
- If you ever copy this project to a new repo, **delete any .git folder** first:
  ```
  rmdir .git /s /q
  git init
  git remote add origin https://github.com/<you>/<new-repo>.git
  ```
