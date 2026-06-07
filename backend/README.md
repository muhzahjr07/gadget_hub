# The Gadget Hub - Backend API

This directory contains the ASP.NET Core Web API that serves as the backend for The Gadget Hub application. It simulates the Service-Oriented Architecture by providing endpoints that orchestrate requests to multiple (simulated) distributor services.

## Prerequisites

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

## How to Run

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Run the application:**
    ```bash
    dotnet run
    ```

3.  The API will be running on `https://localhost:7111` and `http://localhost:5111`.

The frontend application is configured to communicate with this API. Ensure this backend is running before using the checkout feature on the website.
