# Run Backend and Frontend for production-like mode
# Backend: NODE_ENV=production on port from Back-end/config.env (5100)
# Frontend: Preview built assets on 5173

# Backend in background job; Frontend build + preview in foreground (same terminal)
Start-Job -ScriptBlock { Push-Location 'Back-end'; npm run start:prod } | Out-Null
Push-Location 'FrontEnd'
npm run build
npm run start:prod

