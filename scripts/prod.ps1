Write-Host "🚀 Starting Acquisition App in Production Mode" -ForegroundColor Cyan
Write-Host "---------------------------------------------------" -ForegroundColor Cyan

# Check if .env.production exists and load environment variables
if (Test-Path .env.production) {
    Get-Content .env.production | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#")) {
            $key, $value = $line.Split('=', 2)
            if ($key -and $value) {
                [System.Environment]::SetEnvironmentVariable($key.Trim(), $value.Trim(), [System.EnvironmentVariableTarget]::Process)
            }
        }
    }
} else {
    Write-Host "❌ Error: .env.production file not found!" -ForegroundColor Red
    exit 1
}

# Check if Docker is running
docker info > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Docker is not running!" -ForegroundColor Red
    Write-Host "   Please start Docker and try again." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Building and starting production container..." -ForegroundColor Yellow
Write-Host "   - Using Neon Cloud Database (no local proxy)" -ForegroundColor Yellow
Write-Host "   - Running in optimized production mode`n" -ForegroundColor Yellow

# Start production environment
docker compose --env-file .env.production -f docker-compose.prod.yml up --build -d

# Wait for DB to be ready (basic health check)
Write-Host "⏳ Waiting for Neon Cloud to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Run migrations with Drizzle
Write-Host "📦 Applying latest schema with Drizzle..." -ForegroundColor Yellow
npm run db:migrate

Write-Host "`n🎉 Production environment started!" -ForegroundColor Green
Write-Host "   Application: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Logs: docker logs acquisition-app-prod`n" -ForegroundColor Cyan

Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "   View logs: docker logs -f acquisition-app-prod" -ForegroundColor Gray
Write-Host "   Stop app: docker compose -f docker-compose.prod.yml down" -ForegroundColor Gray