# FiddleMania Frontend Web Application

> High-performance, responsive e-commerce platform for mechanical puzzles, tactile fidget toys, artisan desk novelties, and STEM kinetic figures.

[![Framework](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Bundler](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Routing](https://img.shields.io/badge/React_Router-v6-CA4245?logo=react-router&logoColor=white)](https://reactrouter.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📖 Comprehensive System Documentation

For complete, in-depth architectural specifications, frontend-backend communication protocols, API endpoints catalog, and sequence lifecycle diagrams, see:
👉 **[SYSTEM_DOCUMENTATION.md](./SYSTEM_DOCUMENTATION.md)**

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jbueta-frontend/ae-b4-grp-01-prj-01-fe.git
   cd ae-b4-grp-01-prj-01-fe
   ```

2. **Configure environment variables:**
   Create a `.env.local` file in the project root:
   ```ini
   VITE_API_URL=https://ae-b4-grp-01-prj-01-be.vercel.app/api/v1
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the local Vite development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗️ Architecture & Key Features

* **Design Pattern:** Feature-driven MVVM (Model-View-ViewModel).
* **Dual Personas:**
  - **Customer Storefront:** Live catalog search/filter, bag drawer, carbon-neutral checkout, profile addresses manager, order history & live shipment tracking.
  - **Executive & Admin Portal:** Role-guarded dashboard (`/admin/reports`), executive sales metrics, warehouse inventory restock, and order fulfillment state management.
* **Resilient HTTP Communication:**
  - Axios client with automatic Bearer token injection.
  - Transparent 401 token refresh rotation.
  - Automatic envelope unpacking (`{ success: true, data: ... }`).
  - Strict user-scoped storage to prevent cross-account address leakage.

---

## 📜 Available Scripts

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts Vite dev server with Hot Module Replacement (HMR) |
| `npm run build` | Compiles production-ready bundle into `dist/` |
| `npm run preview` | Locally serves the built production bundle for testing |
| `npm run lint` | Runs ESLint to check for syntax and code style errors |

---

## 🔗 Repository & Deployment Branches

- **`staging`**: Active development and integration testing branch.
- **`main`**: Production deployment branch connected to Vercel CI/CD.
