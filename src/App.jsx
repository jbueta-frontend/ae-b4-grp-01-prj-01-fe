import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Shared Chrome
import Navbar from './shared/components/Navbar';
import Footer from './shared/components/Footer';
import CartDrawer from './shared/components/CartDrawer';
import CartToast from './shared/components/CartToast';

// Feature Views
import ProductCatalogView from './features/product-catalog/views/ProductCatalogView';
import ProductDetailView from './features/product-catalog/views/ProductDetailView';
import CartView from './features/cart/views/CartView';
import CheckoutView from './features/checkout/views/CheckoutView';
import OrderConfirmationView from './features/order-history/views/OrderConfirmationView';
import OrderHistoryView from './features/order-history/views/OrderHistoryView';
import ShipmentTrackingView from './features/shipment-tracking/views/ShipmentTrackingView';
import LoginView from './features/auth/views/LoginView';
import RegisterView from './features/auth/views/RegisterView';
import ProfileView from './features/profile/views/ProfileView';
import SupportView from './features/support/views/SupportView';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
            }}
          >
            <Navbar />
            <CartDrawer />
            <CartToast />

            <main style={{ flex: 1 }}>
              <Routes>
                {/* 1. Landing & Product Catalog */}
                <Route path="/" element={<ProductCatalogView />} />
                <Route
                  path="/products/:idOrSlug"
                  element={<ProductDetailView />}
                />

                {/* 2. Cart & Bag */}
                <Route path="/cart" element={<CartView />} />

                {/* 3. Checkout Tunnel */}
                <Route path="/checkout" element={<CheckoutView />} />

                {/* 4. Order Confirmation & Tracking */}
                <Route path="/orders" element={<OrderHistoryView />} />
                <Route
                  path="/orders/:orderId"
                  element={<OrderConfirmationView />}
                />
                <Route
                  path="/track/:trackingNumber"
                  element={<ShipmentTrackingView />}
                />

                {/* 5. Account Authentication */}
                <Route
                  path="/login"
                  element={<LoginView initialTab="login" />}
                />
                <Route path="/register" element={<RegisterView />} />
                <Route path="/profile" element={<ProfileView />} />
                <Route path="/addresses" element={<ProfileView />} />

                {/* 6. Support & FAQ */}
                <Route path="/support" element={<SupportView />} />

                {/* 7. Admin (Placeholders) */}
                <Route
                  path="/admin/reports"
                  element={
                    <div
                      className="container"
                      style={{ padding: '60px 0', textAlign: 'center' }}
                    >
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                        Admin Reports Dashboard
                      </h2>
                      <p
                        style={{ color: 'var(--text-muted)', marginTop: '8px' }}
                      >
                        Backend metrics reporting endpoint active.
                      </p>
                      <Link
                        to="/"
                        className="btn btn-outline"
                        style={{ marginTop: '20px' }}
                      >
                        Back to Store
                      </Link>
                    </div>
                  }
                />
                <Route
                  path="/admin/inventory"
                  element={
                    <div
                      className="container"
                      style={{ padding: '60px 0', textAlign: 'center' }}
                    >
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                        Admin Inventory Management
                      </h2>
                      <p
                        style={{ color: 'var(--text-muted)', marginTop: '8px' }}
                      >
                        Active stock ledger synchronized.
                      </p>
                      <Link
                        to="/"
                        className="btn btn-outline"
                        style={{ marginTop: '20px' }}
                      >
                        Back to Store
                      </Link>
                    </div>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <div
                      className="container"
                      style={{ padding: '60px 0', textAlign: 'center' }}
                    >
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                        Admin Fulfillment Terminal
                      </h2>
                      <p
                        style={{ color: 'var(--text-muted)', marginTop: '8px' }}
                      >
                        Zero-emission dispatch manifests ready.
                      </p>
                      <Link
                        to="/"
                        className="btn btn-outline"
                        style={{ marginTop: '20px' }}
                      >
                        Back to Store
                      </Link>
                    </div>
                  }
                />

                {/* 8. 404 Fallback */}
                <Route
                  path="*"
                  element={
                    <div
                      className="container"
                      style={{ padding: '100px 20px', textAlign: 'center' }}
                    >
                      <h1
                        style={{
                          fontSize: '3rem',
                          fontWeight: 800,
                          color: 'var(--accent)',
                          marginBottom: '8px',
                        }}
                      >
                        404
                      </h1>
                      <h2
                        style={{
                          fontSize: '1.5rem',
                          fontWeight: 700,
                          marginBottom: '12px',
                        }}
                      >
                        Page Not Found
                      </h2>
                      <p
                        style={{
                          color: 'var(--text-muted)',
                          marginBottom: '24px',
                        }}
                      >
                        The page you are looking for might have been moved or
                        does not exist.
                      </p>
                      <Link to="/" className="btn btn-primary">
                        Return to Collection
                      </Link>
                    </div>
                  }
                />
              </Routes>
            </main>

            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
