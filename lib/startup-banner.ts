// Startup Banner for Piel Lighthouse Resort
// This file logs startup information when the application starts

export function displayStartupBanner() {
  const banner = `
╔══════════════════════════════════════════════════════════════╗
║          PIEL LIGHTHOUSE RESORT - APPLICATION STARTED         ║
╚══════════════════════════════════════════════════════════════╝

🌐 Frontend:  Running on http://localhost:3000
🔌 Backend:   API Routes available at /api/*
🗄️  Database:  MongoDB (connection logged separately)

📋 Available Endpoints:
   • GET  /api/health     - Check frontend + database health
   • GET  /api/bookings   - Access bookings API

🎉 Application is ready to use!
`
  console.log(banner)
}

// Call this function when the module is loaded
if (typeof window === 'undefined') {
  displayStartupBanner()
}
