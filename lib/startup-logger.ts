// Startup Logger for Piel Lighthouse Resort Application
// This module logs the status of frontend, backend, and database services

export function logStartup() {
  console.log("\n")
  console.log("╔══════════════════════════════════════════════════════════════╗")
  console.log("║          PIEL LIGHTHOUSE RESORT - APPLICATION STARTED         ║")
  console.log("╚══════════════════════════════════════════════════════════════╝")
  console.log("\n📋 Services Status:")
  console.log("─────────────────────────────────────────────────────────────")
  console.log("🌐 Frontend:  Starting... (Next.js Application)")
  console.log("🔌 Backend:   Starting... (API Routes)")
  console.log("🗄️  Database:  Checking connection...")
  console.log("─────────────────────────────────────────────────────────────\n")
}

export function logFrontendReady(port: number = 3000) {
  console.log("╔══════════════════════════════════════════════════════════════╗")
  console.log("║                    FRONTEND READY                             ║")
  console.log("╚══════════════════════════════════════════════════════════════╝")
  console.log(`✅ Frontend server is running on http://localhost:${port}`)
  console.log(`✅ Health check: http://localhost:${port}/api/health`)
  console.log("\n")
}

export function logBackendReady() {
  console.log("╔══════════════════════════════════════════════════════════════╗")
  console.log("║                    BACKEND READY                              ║")
  console.log("╚══════════════════════════════════════════════════════════════╝")
  console.log("✅ Backend API is ready")
  console.log("✅ Backend health check: /api/health (within app directory)")
  console.log("\n")
}

export function logDatabaseConnected(databaseName: string = "piel_lighthouse_resort") {
  console.log("╔══════════════════════════════════════════════════════════════╗")
  console.log("║                   DATABASE CONNECTED                          ║")
  console.log("╚══════════════════════════════════════════════════════════════╝")
  console.log(`✅ MongoDB connected successfully`)
  console.log(`✅ Database: ${databaseName}`)
  console.log("\n")
}

export function logServiceStatus() {
  console.log("\n📊 All Services Status:")
  console.log("─────────────────────────────────────────────────────────────")
  console.log("🌐 Frontend:  ✓ Running")
  console.log("🔌 Backend:   ✓ Running")
  console.log("🗄️  Database:  ✓ Connected")
  console.log("─────────────────────────────────────────────────────────────")
  console.log("\n🎉 Piel Lighthouse Resort is fully operational!\n")
}

export function logError(service: string, error: string) {
  console.log(`\n❌ [${service}] Error: ${error}\n`)
}
