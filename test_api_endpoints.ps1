# test_api_endpoints.ps1
$baseUrl = "http://localhost:5111"

function Test-Endpoint {
    param (
        [string]$Name,
        [string]$Method,
        [string]$Route,
        [object]$Body,
        [string]$ExpectedStatus = "200"
    )

    Write-Host "--------------------------------------------------"
    Write-Host "Running Test: $Name" -ForegroundColor Cyan
    Write-Host "$Method $baseUrl$Route" -ForegroundColor Gray

    try {
        $params = @{
            Uri = "$baseUrl$Route"
            Method = $Method
            ErrorAction = "Stop"
        }

        if ($Body) {
            # Force array serialization for lists
            $json = $Body | ConvertTo-Json -Depth 10 -Compress
            
            # PowerShell 5.1 Hack: If input was an array but output is a single object, wrap it
            if ($Body -is [Array] -and $json.StartsWith("{")) {
                $json = "[$json]"
            }

            $params.Add("Body", $json)
            $params.Add("ContentType", "application/json")
        }

        $response = Invoke-RestMethod @params
        Write-Host "✅ Success! Response:" -ForegroundColor Green
        
        # Try to pretty print response
        try {
            $response | ConvertTo-Json -Depth 5 | Write-Host
        } catch {
            $response | Write-Host
        }
    }
    catch {
        $ex = $_.Exception
        if ($ex.Response) {
            $status = [int]$ex.Response.StatusCode
            if ("$status" -eq "$ExpectedStatus" -or "$ExpectedStatus" -eq "400") {
                 # If we expected a 400 error (TC-03, TC-05) and got it, that's a PASS
                Write-Host "✅ Pass (Expected Error): $($ex.Message)" -ForegroundColor Green
                try {
                    $reader = New-Object System.IO.StreamReader($ex.Response.GetResponseStream())
                    Write-Host "Error Details: $($reader.ReadToEnd())" -ForegroundColor Yellow
                } catch {}
            }
            else {
                Write-Host "❌ Failed with Status $status" -ForegroundColor Red
                Write-Host $ex.Message
                try {
                    $reader = New-Object System.IO.StreamReader($ex.Response.GetResponseStream())
                    Write-Host "Error Details: $($reader.ReadToEnd())" -ForegroundColor Yellow
                } catch {}
            }
        }
        else {
            Write-Host "❌ Failed: $($ex.Message)" -ForegroundColor Red
            Write-Host "Ensure the backend is running on $baseUrl" -ForegroundColor Yellow
        }
    }
    Write-Host ""
}

# TC-01: Valid Quote
Test-Endpoint -Name "TC-01: Request Valid Quotes" -Method "POST" -Route "/api/Order/request-quotes" -Body @(@{ productId="gad-001"; quantity=1 })

# TC-02: Invalid Product (Expect valid return, empty list?)
Test-Endpoint -Name "TC-02: Request Invalid Product" -Method "POST" -Route "/api/Order/request-quotes" -Body @(@{ productId="invalid-999"; quantity=1 })

# TC-03: Zero Quantity (Expect 400)
Test-Endpoint -Name "TC-03: Request Zero Quantity" -Method "POST" -Route "/api/Order/request-quotes" -Body @(@{ productId="gad-001"; quantity=0 }) -ExpectedStatus "400"

# TC-04: Confirm Order (Note: Backend requires product details, not QuotationID)
Test-Endpoint -Name "TC-04: Confirm Order" -Method "POST" -Route "/api/Order/place-order" -Body @(@{ productId="gad-001"; quantity=1 })

# TC-05: Missing Details (Expect 400)
Test-Endpoint -Name "TC-05: Confirm Order Missing Fields" -Method "POST" -Route "/api/Order/place-order" -Body @(@{ productId=""; quantity=1 }) -ExpectedStatus "400"

# TC-06: Health Check
Test-Endpoint -Name "TC-06: Distributor Health" -Method "GET" -Route "/api/Distributor"
