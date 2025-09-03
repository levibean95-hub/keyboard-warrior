# Deploy to Render using API
param(
    [string]$ApiKey = "rnd_YqkV1uj31wPxG8g5hgMyhwpupJ0a"
)

$headers = @{
    "Authorization" = "Bearer $ApiKey"
    "Accept" = "application/json"
    "Content-Type" = "application/json"
}

Write-Host "Checking existing services..." -ForegroundColor Yellow

# Check if service exists
$services = Invoke-RestMethod -Uri "https://api.render.com/v1/services" -Headers $headers -Method Get
$existingService = $services.services | Where-Object { $_.name -eq "keyboard-warrior-backend" }

if ($existingService) {
    Write-Host "Found existing service: $($existingService.id)" -ForegroundColor Green
    Write-Host "Service URL: $($existingService.serviceDetails.url)" -ForegroundColor Cyan
    
    # Trigger a new deploy
    Write-Host "Triggering new deployment..." -ForegroundColor Yellow
    $deployBody = @{
        clearCache = "do_not_clear"
    } | ConvertTo-Json
    
    $deploy = Invoke-RestMethod -Uri "https://api.render.com/v1/services/$($existingService.id)/deploys" -Headers $headers -Method Post -Body $deployBody
    Write-Host "Deployment started: $($deploy.id)" -ForegroundColor Green
    
} else {
    Write-Host "Creating new service..." -ForegroundColor Yellow
    
    # Create service from render.yaml
    $createBody = @{
        type = "web_service"
        name = "keyboard-warrior-backend"
        ownerId = $null  # Will be set to default owner
        repo = "https://github.com/levibean95-hub/keyboard-warrior"
        branch = "master"
        autoDeploy = "yes"
        buildFilter = @{
            paths = @("backend/**", "render.yaml")
            ignoredPaths = @()
        }
        rootDir = ""
        dockerfilePath = "./backend/Dockerfile.render"
        dockerContext = "./backend"
        envVars = @(
            @{ key = "NODE_ENV"; value = "production" }
            @{ key = "PORT"; value = "5000" }
            @{ key = "DATABASE_URL"; value = "file:/app/data/keyboard-warrior.db" }
            @{ key = "JWT_SECRET"; generateValue = $true }
            @{ key = "RATE_LIMIT_WINDOW_MS"; value = "900000" }
            @{ key = "RATE_LIMIT_MAX_REQUESTS"; value = "100" }
            @{ key = "CORS_ORIGIN"; value = "https://your-vercel-app.vercel.app" }
            @{ key = "OPENAI_API_KEY"; value = "YOUR_OPENAI_API_KEY" }
        )
        serviceDetails = @{
            region = "oregon"
            plan = "free"
            healthCheckPath = "/health"
            dockerCommand = ""
            numInstances = 1
        }
    } | ConvertTo-Json -Depth 5
    
    try {
        $service = Invoke-RestMethod -Uri "https://api.render.com/v1/services" -Headers $headers -Method Post -Body $createBody
        Write-Host "Service created successfully!" -ForegroundColor Green
        Write-Host "Service ID: $($service.service.id)" -ForegroundColor Cyan
        Write-Host "Service URL: $($service.service.serviceDetails.url)" -ForegroundColor Cyan
    } catch {
        Write-Host "Error creating service: $_" -ForegroundColor Red
        Write-Host "Please check the Render dashboard to create the service manually." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "IMPORTANT: Set these environment variables in Render Dashboard:" -ForegroundColor Yellow
Write-Host "1. CORS_ORIGIN - Your Vercel frontend URL" -ForegroundColor White
Write-Host "2. OPENAI_API_KEY - Your OpenAI API key" -ForegroundColor White
Write-Host "==================================" -ForegroundColor Cyan