# FiddleMania — Complete System Specification & Lovable AI Master Prompt

> **Instructions for Lovable AI:**
> You are an elite Full-Stack Web Application Engineer and UI/UX Designer. Build a production-grade, pixel-perfect, highly responsive e-commerce web application called **FiddleMania** (an heirloom toy boutique & comprehensive Admin Inventory / Fulfillment Portal). 
> 
> Follow the complete technical specifications, design tokens, MVVM architecture, and API integration guidelines outlined below.

---

## 1. Executive Summary & Brand Identity

* **Brand Name:** FiddleMania (Tagline: *Handcrafted & Heirloom Toys for Curious Minds*)
* **Domain Context:** Premium artisanal toy store offering educational STEM kits, collectible figures, wooden locomotives, plush companions, and creative building sets.
* **Core Systems:**
  1. **Customer Storefront:** Browse catalog, dynamic filtering, product detail with verified customer reviews, sliding cart drawer, multi-step checkout, shipment tracking, user account & address book.
  2. **Authentication & Security Engine:** JWT token pair authentication, email verification flows with celebration modals, 1-hour expiry password recovery with token inspection, role-based route guards.
  3. **Admin Management Portal:** Analytics reports with real-time charts, live inventory management with low-stock alerts, order fulfillment pipeline with shipment tracking updates.

---

## 2. Design System & Aesthetics

### 2.1 Color Palette
* **Primary / Accent:** `#C85A32` (Warm Terracotta / Artisanal Brick)
* **Primary Hover:** `#B34C26` / Deep Clay `#9A3E1D`
* **Secondary / Warmth:** Amber `#F59E0B` / Honey `#D97706`
* **Success / Verified:** Emerald `#10B981` / Dark Emerald `#059669`
* **Warning / Alert:** Orange `#EA580C`
* **Danger / Error:** Rose Red `#DC2626` / Soft Red BG `rgba(220, 38, 38, 0.08)`
* **Neutral Dark:** Charcoal `#0F172A` / Slate Navy `#1E293B`
* **Neutral Mid:** Muted Slate `#64748B` / Border Gray `#E2E8F0`
* **Neutral Light:** Warm Cream `#FDFBF7` / Off-White Card `#FFFFFF` / Soft Neutral `#F8FAFC`

### 2.2 Typography & Elevation
* **Headings:** `Plus Jakarta Sans` or `Outfit`, bold (700/800) with tight tracking (`-0.02em`).
* **Body:** `Inter`, 400/500/600 weights, readable line heights (`1.5`–`1.6`).
* **Shadows:** 
  * Subtle: `0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)`
  * Card: `0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)`
  * Modal/Float: `0 25px 60px -12px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(0, 0, 0, 0.06)`
* **Border Radii:** Cards (`16px`–`20px`), Buttons (`12px`), Pills (`9999px`), Inputs (`10px`).

### 2.3 Micro-interactions & Responsiveness
* Smooth hover lifts (`transform: translateY(-4px)` with transition `0.2s cubic-bezier(0.16, 1, 0.3, 1)`).
* Floating Back-to-Top button with scroll progress indicator.
* Horizontal scroll affordances on mobile for category pills and tables.
* Skeleton loaders for asynchronous data fetching.

---

## 3. Technology Stack & Architecture

* **Framework:** React 18+ (Vite)
* **Routing:** `react-router-dom` v6+ (with nested layouts & route protection)
* **State Management:** React Context API (`AuthContext`, `CartContext`)
* **Icons:** `lucide-react`
* **Styling:** Modern CSS with custom CSS variables (`--accent`, `--text-main`, `--bg-main`, etc.) or Tailwind CSS
* **HTTP Client:** `axios` with global request/response interceptors (token refresh & automatic auth headers)
* **Architecture Pattern:** MVVM (Model-View-ViewModel) per feature domain:
  ```
  src/
  ├── context/          # AuthContext, CartContext
  ├── services/         # api.js (Axios instance + interceptors)
  ├── shared/           # Navbar, Footer, Logo, BackToTop, AdminGuard, AdminLayout
  └── features/
      ├── product-catalog/    # models, views, viewmodels, components
      ├── auth/               # Login, Register, VerifyEmail, ResetPassword
      ├── cart/               # CartDrawer, CartItem
      ├── checkout/           # CheckoutView, PaymentSimulation
      ├── order-history/      # OrderHistoryView, OrderDetailView, ReceiptView
      ├── shipment-tracking/  # TrackingView, ProgressTimeline
      ├── profile/            # ProfileView, AddressBook
      ├── admin-reports/      # Analytics charts, inventory health stats
      ├── admin-inventory/    # Product list, restock modal, SKU tracking
      └── admin-fulfillment/  # Orders management, status workflow
  ```

---

## 4. Feature Specifications & User Stories

### 4.1 Global Navigation & Layout
* **Navbar:**
  * Left: Brand logo with wooden 'F' icon (`FiddleMania`).
  * Center: Search input with real-time debounce & quick-clear button.
  * Right: Category navigation links, Order Tracking shortcut (`/track`), Cart icon with animated item counter badge, User Account dropdown (Sign In / Register when guest; Name, Profile, Admin Portal link if role is `ADMIN`, and Logout when authenticated).
  * Mobile: Hamburger toggle sliding into a responsive navigation drawer.
* **Footer:**
  * 4-column layout: About FiddleMania, Shop Categories, Customer Service & Policies, Newsletter signup.
* **Floating Back-to-Top:**
  * Appears after scrolling 300px down; smooth scroll to top on click.

---

### 4.2 Product Catalog & Discovery (`/`)
* **Hero Carousel:**
  * High-resolution banner slides showcasing seasonal collections (e.g., "Artisanal Wooden Classics", "Robotics & Space Exploration", "Handmade Soft Companions").
  * Auto-playing with pause-on-hover, dot pagination, and CTA buttons.
* **Category Pill Bar:**
  * Interactive horizontal pills: `All Toys`, `Action Figures`, `Wooden Toys`, `STEM & Robotics`, `Board Games`, `Plush & Dolls`.
  * Syncs bidirectionally with URL query parameter `?cat=<CategoryName>`.
* **Sidebar Filters:**
  * **Category Selector** (collapsible list with count tags).
  * **Age Group Filter:** `All Ages`, `0-2 Years`, `3-5 Years`, `6-8 Years`, `9+ Years`.
  * **Price Range Filter:** Radio buttons (`All Prices`, `Under $25`, `$25 - $50`, `$50 - $100`, `Over $100`).
  * **Availability Toggle:** `In Stock Only` switch.
  * **Sort Dropdown:** `Featured`, `Price: Low to High`, `Price: High to Low`, `Customer Rating`, `Newest Arrivals`.
* **Product Card Component:**
  * Product image with hover zoom effect.
  * Category badge & Age tag.
  * Star rating with total review count (e.g., `★ 4.8 (24)`).
  * Title, short description, and formatted price.
  * Stock status badge (`In Stock`, `Low Stock: Only X Left`, `Out of Stock`).
  * Quick "Add to Cart" button with instantaneous feedback animation.

---

### 4.3 Product Detail Page (`/products/:productId`)
* **Interactive Image Gallery:** Multi-angle image switcher with zoom capability.
* **Product Specs Table:** Materials, dimensions, recommended age, safety certifications.
* **Live Inventory Gauge:** Real-time stock count indicator.
* **Quantity Selector & Add-to-Cart:** Max clamped by available inventory.
* **Customer Reviews System (`/products/:productId/reviews`):**
  * Overall rating score & breakdown bar chart (5-star down to 1-star).
  * List of customer reviews with verified buyer badge, date, rating, and written feedback.
  * "Write a Review" submission form (accessible to logged-in customers): Star picker (1–5), review title, detailed comment, submit button with validation.

---

### 4.4 Shopping Cart & Sliding Drawer
* **Cart Drawer Trigger:** Opens instantly when clicking the navbar cart button or upon adding a product.
* **Line Items:**
  * Thumbnail, product name, unit price, quantity stepper `[-] [Qty] [+]`, and trash remove button.
* **Order Summary:**
  * Subtotal calculation, estimated tax (e.g., 8%), estimated shipping (Free over $75).
* **Empty State:** Friendly graphic with "Explore Toys" button.
* **Persistence:** Synchronized in `localStorage` (`fiddlemania_cart`).

---

### 4.5 Checkout & Order Fulfillment Tunnel (`/checkout`)
* **Step 1: Contact & Shipping Address:**
  * Full name, email, phone, street address, city, state, postal code, country.
  * Saved address selector for logged-in users with saved addresses.
* **Step 2: Shipping Method:**
  * Standard Delivery (3–5 business days — $4.99 or Free over $75).
  * Priority Express (1–2 business days — $12.99).
* **Step 3: Payment Simulation:**
  * Credit/Debit Card (Cardholder name, 16-digit card number, MM/YY, CVV) or Cash on Delivery.
  * Security reassurance badges (SSL 256-bit encryption).
* **Step 4: Review & Place Order:**
  * Itemized breakdown, order total confirmation, "Place Order" button.
* **Order Confirmation View (`/orders/:orderId`):**
  * Congratulatory banner, generated Order ID (e.g., `ORD-78921`), order date, estimated arrival date.
  * Action buttons: "Track Shipment" (`/track/:trackingNumber`), "View Printable Receipt" (`/orders/:orderId/receipt`), "Continue Shopping".

---

### 4.6 Shipment Tracking (`/track` & `/track/:trackingNumber`)
* **Tracking Input Field:** Enter any tracking number or order number.
* **Visual Progress Tracker:**
  * 4 Stages: `Order Placed` -> `Processing & Packed` -> `In Transit` -> `Out for Delivery / Delivered`.
  * Real-time timestamp, courier name, current hub location, and estimated delivery countdown.

---

### 4.7 Customer Account & Address Book (`/profile` & `/addresses`)
* **Profile Overview:** Personal details, registered email, account creation date.
* **Order History Tab:** Chronological list of orders with status badges (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`), view receipt button.
* **Address Book Management:**
  * Add new shipping address modal.
  * Edit existing address.
  * Delete address with confirmation.
  * Set default shipping address.

---

## 5. Authentication & Security Engine

### 5.1 Registration & Login (`/login`, `/register`)
* **Dual Tab Interface:** Switch seamlessly between "Sign In" and "Create Account".
* **Validation:** 
  * Valid email format.
  * Password minimum 8 characters with upper, lower, number, and special character.
  * Matching confirm password on signup.
* **JWT Handling:**
  * Saves `accessToken` and `refreshToken` in `localStorage`.
  * Decodes role (`CUSTOMER` or `ADMIN`).
  * Automatically redirects `ADMIN` users to `/admin/reports`.

### 5.2 Email Verification Flow (`/verify-email`)
* **URL Triggers:** Captures `?token=...` or `#access_token=...` from email click.
* **Verification Execution:** Calls backend `GET /auth/verify-email?token=...`.
* **Success Celebration Modal:**
  * Glowing animated green badge (`CheckCircle2`), confetti/sparkle icon.
  * Header: "Email verified successfully!".
  * Clear confirmation details & Account Security badge: `ACTIVE`.
  * Action button: **"Proceed to Login"** with right arrow.
  * **Modal Safety Rule:** Clicking "Proceed to Login" or close **MUST** cleanse query parameters (`token`, `verified`) from the URL to prevent re-triggering modal loops.

### 5.3 Password Reset Flow (`/resetPassword` & `/reset-password`)
* **Forgot Password Request:** Submits email to `POST /auth/forgot-password` -> sends reset email link.
* **Reset Password Form:**
  * Client-side JWT verification: Inspects token expiration (`exp`) and token type (`PASSWORD_RESET`). If expired (tokens expire in 1 hour), immediately prompts user to request a fresh link.
  * Form inputs: New Password & Confirm New Password with show/hide eye toggles.
  * Submits to `POST /auth/reset-password` with `{ token, password }`.
  * Displays "Password Reset Successfully!" modal with auto-transition to `/login`.

---

## 6. Admin Management Portal (`/admin`)

### 6.1 Route Protection (`AdminGuard`)
* Checks if active session user exists and has `role === 'ADMIN'`.
* Non-admin or unauthenticated users are redirected to `/login`.

### 6.2 Admin Layout
* **Sidebar:**
  * FiddleMania Admin branding with shield icon.
  * Links: `Reports & Analytics` (`/admin/reports`), `Inventory Management` (`/admin/inventory`), `Orders & Fulfillment` (`/admin/orders`).
  * Bottom: Logged-in admin user badge and "Back to Storefront" button.

### 6.3 Reports & Analytics (`/admin/reports`)
* **KPI Metrics Cards:**
  * Total Gross Revenue ($) with percentage change comparison.
  * Total Orders Completed.
  * Active Inventory Units & In-Stock Ratio.
  * Low Stock Alerts Count.
* **Interactive Visualizations:**
  * Sales revenue timeline chart (Daily / Weekly / Monthly toggle).
  * Category distribution breakdown.
* **Inventory Specifications Table:**
  * Real-time backend data loading from `/inventory/reports` or `/products`.
  * Columns: Product Thumbnail, Product Title, SKU, Category, Stock Level, Price, Inventory Health Status (`Optimal`, `Low Stock`, `Out of Stock`).
  * Date Range Filter: Preset buttons (`Today`, `Last 7 Days`, `Last 30 Days`, `This Year`).
  * Export Functionality: "Export CSV" and "Print Report".

### 6.4 Inventory Management (`/admin/inventory`)
* **Stock Controls:**
  * Quick stock increment/decrement buttons.
  * Threshold alert settings (e.g. alert when quantity < 5).
* **Product Modals:** Add new toy product, edit pricing, update descriptions, and toggle category assignments.

### 6.5 Order Fulfillment Pipeline (`/admin/orders`)
* **Filterable Orders Table:** Filter by status (`All`, `Pending`, `Processing`, `Shipped`, `Delivered`).
* **Order Action Workflow:**
  * Transition order status (`Mark as Processing`, `Generate Shipping Label`, `Mark as Shipped`, `Mark as Delivered`).
  * Assign tracking number (e.g. `TRK-FD-98213`).
  * Customer notes & shipping address review.

---

## 7. Backend API Specification

* **Base URL:** `https://ae-b4-grp-01-prj-01-be.vercel.app/api/v1`
* **Content-Type:** `application/json`

### 7.1 Authentication Endpoints
| Endpoint | Method | Body Payload | Description |
| :--- | :--- | :--- | :--- |
| `/auth/register` | `POST` | `{ "email", "password", "name" }` | Register new customer account |
| `/auth/login` | `POST` | `{ "email", "password" }` | Login & receive `{ accessToken, refreshToken, user }` |
| `/auth/verify-email` | `GET` | `?token=<TOKEN>` | Confirms account email verification |
| `/auth/forgot-password` | `POST` | `{ "email" }` | Generates 1-hour reset token and emails recovery link |
| `/auth/reset-password` | `POST` | `{ "token", "password" }` | Resets account password using recovery token |
| `/auth/refresh-token` | `POST` | `{ "refreshToken" }` | Issues fresh access token |

### 7.2 Product & Inventory Endpoints
| Endpoint | Method | Query / Body | Description |
| :--- | :--- | :--- | :--- |
| `/products` | `GET` | `?limit=100&category=&sort=` | Retrieves catalog of products |
| `/products/:id` | `GET` | — | Retrieves single product details |
| `/categories` | `GET` | — | Returns active category list |
| `/products/:id/reviews`| `GET` | — | Returns customer reviews for product |
| `/products/:id/reviews`| `POST` | `{ "rating", "title", "comment" }` | Submits new customer product review |
| `/inventory/reports` | `GET` | `?range=30d` | Retrieves inventory analytics for admin dashboard |

### 7.3 Standard API Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```
*Error Format:*
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Descriptive error message"
  }
}
```

---

## 8. Critical Implementation Guardrails

1. **URL Parameter Cleaning on Modal Dismiss:**
   When closing the verification modal or completing a password reset, always strip query parameters (`verified`, `token`, `isEmailVerified`) from the URL to avoid infinite render loops.
2. **Password Reset Token Safety:**
   Never fall back to an existing `localStorage` login token when executing `/auth/reset-password`. A reset request must strictly require a valid, non-expired recovery token originating from the email link.
3. **Cart Resilience:**
   Ensure cart items persist in `localStorage` across page reloads and validate quantities against real stock numbers prior to order placement.
4. **Mobile Responsiveness:**
   All tables must support horizontal scrolling (`overflow-x: auto`), filters must fold into a clean drawer or accordion on screens `< 768px`, and action buttons must maintain a minimum touch target of `44px x 44px`.
