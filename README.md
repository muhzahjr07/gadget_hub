# The Gadget Hub - E-Commerce Solution

<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

The Gadget Hub is a full-stack, enterprise-grade e-commerce application designed for electronic devices and gadgets. It features a modern, responsive React/TypeScript frontend and a secure C# .NET Web API backend.

## 🌟 Key Features

* **Modern Single-Page Application (SPA):** Responsive and high-performance user interface built with React, Vite, and TypeScript.
* **Robust Backend API:** RESTful API built on ASP.NET Core (.NET) for security and scalability.
* **Product Catalog:** Interactive grid showing all available gadgets with advanced filters.
* **Gemini AI Integration:** Utilizes `@google/genai` for smart search and automated catalog enhancements.
* **Testing Suite:** Fully configured Jest/ts-jest unit tests for the frontend and automated powershell scripts (`test_api_endpoints.ps1`) for backend routes.

## 🏗️ Technology Stack

* **Frontend:** React (v19), TypeScript, Vite, Jest, CSS3
* **Backend:** ASP.NET Core Web API (C#)
* **API Testing:** Postman (`The_Gadget_Hub_Postman_Collection.json`)

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18 or higher)
* **.NET SDK** (v8.0 or higher)

### Setup & Run

You can run the full application using the PowerShell scripts or manual terminal commands:

#### 1. Running the Backend
Navigate to the `backend` folder and run the server:
```bash
cd backend
dotnet run
```

#### 2. Running the Frontend
Install local npm dependencies and launch the dev environment:
```bash
npm install
npm run dev
```

#### 3. Stop All Services (Quick Script)
You can run the [restart_app.ps1](restart_app.ps1) script in PowerShell to quickly clean up Node/dotnet processes and rebuild local ports.

## 📄 License
This project is licensed under the [MIT License](LICENSE).
