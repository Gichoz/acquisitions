Write-Host "🚀 Starting Acquisition App in Development Mode" -ForegroundColor Cyan
Write-Host "---------------------------------------------------" -ForegroundColor Cyan

# Check if .env.development exists and load variables into process environment
if (Test-Path .env.development) {
    Get-Content .env.development | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#")) {
            $key, $value = $line.Split('=', 2)
            if ($key -and $value) {
                [System.Environment]::SetEnvironmentVariable($key.Trim(), $value.Trim(), [System.EnvironmentVariableTarget]::Process)
            }
        }
    }
} else {
    Write-Host "❌ Error: .env.development file not found!" -ForegroundColor Red
    exit 1
}

# Verify Docker Desktop is active
docker info > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Docker Desktop is not running!" -ForegroundColor Red
    exit 1
}

# Ensure local state directory exists
if (-not (Test-Path .neon_local)) {
    New-Item -ItemType Directory -Path .neon_local | Out-Null
}

Write-Host "📦 Starting development containers with Neon Local..." -ForegroundColor Yellow
docker compose --env-file .env.development -f docker-compose.dev.yml up -d --build

Write-Host "📜 Running database migrations..." -ForegroundColor Yellow
npm run db:migrate

Write-Host "🎉 Development environment started!" -ForegroundColor Green
Write-Host "   Application: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Database:    postgres://neon:npg@localhost:5432/neondb" -ForegroundColor Cyan