$headers = @{
    "Authorization" = "Bearer rnd_YqkV1uj31wPxG8g5hgMyhwpupJ0a"
    "Accept" = "application/json"
}

Write-Host "Checking Render services..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "https://api.render.com/v1/services" -Headers $headers -Method Get
    
    $keyboardService = $response.services | Where-Object { $_.name -like "*keyboard*" }
    
    if ($keyboardService) {
        Write-Host "Found service:" -ForegroundColor Green
        Write-Host "  Name: $($keyboardService.name)" -ForegroundColor Cyan
        Write-Host "  ID: $($keyboardService.id)" -ForegroundColor Cyan
        Write-Host "  URL: $($keyboardService.serviceDetails.url)" -ForegroundColor Cyan
        Write-Host "  Status: $($keyboardService.suspended)" -ForegroundColor Cyan
        
        # Get recent deploys
        $deploysResponse = Invoke-RestMethod -Uri "https://api.render.com/v1/services/$($keyboardService.id)/deploys?limit=5" -Headers $headers -Method Get
        
        Write-Host "`nRecent deployments:" -ForegroundColor Yellow
        foreach ($deploy in $deploysResponse.deploys) {
            Write-Host "  Deploy $($deploy.id): $($deploy.status) - $($deploy.createdAt)" -ForegroundColor White
        }
    } else {
        Write-Host "No keyboard-warrior service found on Render." -ForegroundColor Yellow
        Write-Host "Total services in account: $($response.services.Count)" -ForegroundColor White
        
        if ($response.services.Count -gt 0) {
            Write-Host "`nExisting services:" -ForegroundColor Yellow
            foreach ($svc in $response.services) {
                Write-Host "  - $($svc.name)" -ForegroundColor White
            }
        }
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}