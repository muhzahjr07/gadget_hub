# Kill existing processes
Write-Host "Killing existing node, dotnet, and VBCSCompiler processes..."
Get-Process -Name "node", "dotnet", "VBCSCompiler" -ErrorAction SilentlyContinue | Stop-Process -Force

# Wait a moment for processes to release locks
Start-Sleep -Seconds 2

# Start Backend
Write-Host "Starting Backend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; dotnet run"

# Start Frontend
Write-Host "Starting Frontend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host "Application restart initiated."
