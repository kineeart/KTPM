# Run Backend and Frontend in development on Windows
# Backend: http://localhost:5100
# Frontend: http://localhost:5173

# Backend in background job; Frontend in foreground (same terminal)
Start-Job -ScriptBlock { Push-Location 'Back-end'; npm run dev } | Out-Null
Push-Location 'FrontEnd'
npm run dev

