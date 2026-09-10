# FiddleMania Storefront (Frontend)

> **Repository:** `ae-b4-grp-01-prj-01-fe`  
> **Backend Integration:** `ae-b4-grp-01-prj-01-be` (`https://ae-b4-grp-01-prj-01-be.vercel.app/api/v1`)  
> **Tech Stack:** React 19, Vite, React Router v7, Axios, Lucide React, Custom CSS  
> **Architectural Pattern:** Feature-based MVVM (Model–View–ViewModel)

---

## 📖 Overview: What is the Frontend All About?

The **FiddleMania Frontend** is the premier client-facing web application of the FiddleMania e-commerce ecosystem. Built as a high-performance Single Page Application (SPA), it represents the digital flagship store for an heirloom-quality, sustainable, and modern toy brand. 

It is crafted with a focus on tactile luxury, clean typography (*Plus Jakarta Sans*), fluid micro-animations, and responsive layouts across all device form factors—delivering a digital experience that mirrors the craftsmanship of physical products.

---

## 🚀 What Does It Primarily Deliver to the Overall Project?

In the context of the entire FiddleMania project architecture, this frontend application serves as the **central operational bridge between customer intent and backend business services**. Specifically, it delivers:

### 1. End-to-End E-Commerce Conversion Funnel
The frontend drives the full purchase lifecycle from initial discovery to delivery tracking:
- **Product Discovery & Exploration:** Dynamic product catalog with multifaceted filtering (by categories such as *Wooden, STEM, Plush, Ages 0–3*, age ranges, and price tiers), real-time search, and product details with high-resolution image galleries, technical specifications, and verified customer reviews.
- **Persistent Cart Experience:** Centralized cart state persisted across sessions with real-time recalculations, quick-access slide-out cart drawer, instant-feedback toast notifications, and zero-loss item persistence.
- **Streamlined Checkout Tunnel:** A guided 3-stage checkout pipeline (Shipping Address $\rightarrow$ Carbon-Neutral Delivery Tier $\rightarrow$ Payment & Billing) that validates customer data and simulates order authorization.
- **Post-Purchase Assurance & Tracking:** Order confirmation summaries with unique order IDs (`FM-XXXXXX`) and live shipment tracking timelines (`TRK-XXXXXXXX`) that show progression from order placed to final delivery.

### 2. Client-Side Security & Identity Management
- Integrates seamlessly with the backend JWT authentication service (`/auth/login`, `/auth/register`, `/auth/me`, `/auth/refresh-token`).
- Features silent access token refreshing via Axios response interceptors upon receiving HTTP `401 Unauthorized`.
- Supports both authenticated customer profiles (order histories, saved shipping addresses) and guest checkout paths without friction.
- Resilient input recovery and clean error handling to prevent credential leaks and raw error dumping.

### 3. Decoupled, Maintainable MVVM Architecture
- Implements the **Model-View-ViewModel (MVVM)** design pattern across feature modules.
- **Models (`models/`):** Define domain types, static options, fallback datasets, and API request schemas.
- **ViewModels (`viewmodels/`):** Custom React hooks encapsulating business logic, form handling, validation, state machines, and API interactions.
- **Views & Components (`views/`, `components/`):** Pure presentation layers focused strictly on rendering and user interaction, remaining independent of raw network operations.

### 4. Enterprise-Ready Store Operations Touchpoints
- Customer Self-Service & Support portal with searchable FAQs and inquiry dispatch.
- Foundation routes for Administrative Operations:
  - Fulfillment Terminal (`/admin/orders`)
  - Stock & Inventory Management (`/admin/inventory`)
  - Analytics & Reports Dashboard (`/admin/reports`)

---

## 🏛️ Project Structure

The project is structured by feature domains adhering to the MVVM pattern:

```text
src/
├── assets/                 # Brand assets, logos, and static graphics
├── context/                # Global React context providers
│   ├── AuthContext.jsx     # Session, JWT persistence, user roles & auth state
│   └── CartContext.jsx     # Global cart items, totals, drawer, and toast alerts
├── features/               # Domain-driven feature modules (MVVM)
│   ├── addresses/          # Saved customer shipping addresses
│   ├── admin-fulfillment/  # Warehouse dispatch & order fulfillment
│   ├── admin-inventory/    # Stock levels & product catalog management
│   ├── admin-reports/      # Sales and business analytics
│   ├── auth/               # Customer login, registration & recovery
│   ├── cart/               # Full cart page & line-item modifiers
│   ├── checkout/           # Multi-step checkout funnel & payment
│   ├── order-history/      # Customer order log & receipt confirmation
│   ├── product-catalog/    # Catalog list, filtering, and detail views
│   ├── profile/            # Customer account details & security settings
│   ├── shipment-tracking/  # Package tracking & carrier timeline
│   └── support/            # Customer service desk, FAQ, & contact form
├── services/               # HTTP client & API interceptors
│   └── api.js              # Axios instance with bearer tokens & automatic token refresh
├── shared/                 # Reusable UI components and helper utilities
│   ├── components/         # Navbar, Footer, CartDrawer, CartToast, ErrorBoundary
│   └── utils/              # Currency formatting (PHP ₱), unified error handlers
├── App.jsx                 # Application routing, layout chrome, and route definitions
├── index.css               # Global theme tokens, typography, and utility classes
└── main.jsx                # Application root mounting & DOM bootstrapping
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [React 19](https://react.dev/) | Modern UI library with latest hooks and concurrent features |
| **Bundler / Tooling** | [Vite 8](https://vite.dev/) | High-speed ESM development server and optimized production build |
| **Routing** | [React Router v7](https://reactrouter.com/) | Client-side declarative routing and navigation |
| **HTTP Client** | [Axios](https://axios-http.com/) | Promise-based HTTP client with request/response interceptors |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent, clean iconography |
| **Styling** | Vanilla CSS Design System | Custom CSS variables, responsive typography, and glassmorphism |
| **Font** | Plus Jakarta Sans | Google Web Font for modern typography |

---

## ⚙️ Environment Configuration

The application expects an environment configuration file in the project root:

`.env.local`:
```bash
VITE_API_URL=https://ae-b4-grp-01-prj-01-be.vercel.app/api/v1
```

- `VITE_API_URL`: Points to the live or local FiddleMania backend API server.

---

## 🚦 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd ae-b4-grp-01-prj-01-fe
npm install
```

### 3. Development Server
Start the local development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Production Build
Compile and bundle production-ready static assets:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

### 5. Linting & Formatting
Run code health checks:
```bash
npm run lint
```

---

## 🌐 Deployment

The frontend is optimized for zero-config deployment on **Vercel** with client-side route rewrites handled via `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 👥 Authors & Acknowledgments

- **Team:** Group 01 (`ae-b4-grp-01`)
- **Project:** FiddleMania Modern Toy E-Commerce Platform
