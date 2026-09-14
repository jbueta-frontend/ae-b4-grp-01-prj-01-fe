import { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Shared Chrome
import Navbar from './shared/components/Navbar';
import Footer from './shared/components/Footer';
import CartDrawer from './shared/components/CartDrawer';
import CartToast from './shared/components/CartToast';
import BackToTop from './shared/components/BackToTop';
import AdminGuard from './shared/components/AdminGuard';
import AdminLayout from './shared/components/AdminLayout';
import CustomerGuard from './shared/components/CustomerGuard';

// Feature Views
import ProductCatalogView from './features/product-catalog/views/ProductCatalogView';
import ProductDetailView from './features/product-catalog/views/ProductDetailView';
import ProductReviewSubmissionView from './features/product-catalog/views/ProductReviewSubmissionView';
import CartView from './features/cart/views/CartView';
import CheckoutView from './features/checkout/views/CheckoutView';
import OrderConfirmationView from './features/order-history/views/OrderConfirmationView';
import OrderHistoryView from './features/order-history/views/OrderHistoryView';
import OrderReceiptView from './features/order-history/views/OrderReceiptView';
import ShipmentTrackingView from './features/shipment-tracking/views/ShipmentTrackingView';
import LoginView from './features/auth/views/LoginView';
import RegisterView from './features/auth/views/RegisterView';
import VerifyEmailView from './features/auth/views/VerifyEmailView';
import ResetPasswordView from './features/auth/views/ResetPasswordView';
import ProfileView from './features/profile/views/ProfileView';
import SupportView from './features/support/views/SupportView';
import LegalPolicyView from './features/support/views/LegalPolicyView';
import NewUserWelcomeSetupModal from './features/auth/components/NewUserWelcomeSetupModal';

// Admin Persona Views
import AdminReportsView from './features/admin-reports/views/AdminReportsView';
import AdminProductsView from './features/admin-inventory/views/AdminProductsView';
import AdminOrdersListView from './features/admin-fulfillment/views/AdminOrdersListView';
import AdminOrderDetailView from './features/admin-fulfillment/views/AdminOrderDetailView';

/**
 * Automatically intercepts incoming email action links (Forgot Password recovery vs Account Registration verification)
 * and guarantees immediate redirection to the correct destination:
 * 1. Forgot Password -> /reset-password?token=...
 * 2. Account Registration -> /login?verified=true&token=...
 */
function AuthRedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hash = window.location.hash.startsWith('#')
      ? window.location.hash.substring(1)
      : window.location.hash;
    const hashParams = new URLSearchParams(hash);
    const searchParams = new URLSearchParams(location.search);

    const type = (
      hashParams.get('type') ||
      searchParams.get('type') ||
      ''
    ).toLowerCase();

    const isRecovery =
      type === 'recovery' ||
      type === 'reset' ||
      hash.toLowerCase().includes('type=recovery') ||
      hash.toLowerCase().includes('type=reset') ||
      location.search.toLowerCase().includes('type=recovery') ||
      location.search.toLowerCase().includes('type=reset') ||
      sessionStorage.getItem('fiddlemania_auth_action') === 'forgot_password';

    // 1. FORGOT PASSWORD FLOW -> MUST LAND ON /reset-password
    if (isRecovery) {
      if (
        location.pathname !== '/reset-password' &&
        location.pathname !== '/resetPassword'
      ) {
        const token =
          hashParams.get('access_token') ||
          hashParams.get('token') ||
          hashParams.get('token_hash') ||
          searchParams.get('token') ||
          searchParams.get('token_hash') ||
          searchParams.get('access_token') ||
          searchParams.get('code') ||
          '';

        sessionStorage.removeItem('fiddlemania_auth_action');
        const forwardParams = new URLSearchParams();
        if (token) forwardParams.set('token', token);
        forwardParams.set('type', 'recovery');

        navigate(
          `/reset-password?${forwardParams.toString()}${window.location.hash ? window.location.hash : ''}`,
          { replace: true }
        );
      }
      return;
    }

    // 2. REGISTRATION EMAIL VERIFICATION FLOW -> MUST LAND ON /login WITH MODAL
    const isSignupVerification =
      type === 'signup' ||
      type === 'email_verification' ||
      type === 'invite' ||
      hash.toLowerCase().includes('type=signup') ||
      hash.toLowerCase().includes('type=email_verification') ||
      searchParams.get('isEmailVerified') === 'true' ||
      searchParams.get('verified') === 'true';

    const verificationToken =
      searchParams.get('token') ||
      searchParams.get('token_hash') ||
      hashParams.get('access_token') ||
      searchParams.get('access_token');

    if (
      (isSignupVerification || (verificationToken && !isRecovery)) &&
      location.pathname !== '/verify-email' &&
      location.pathname !== '/login'
    ) {
      const email =
        searchParams.get('email') ||
        hashParams.get('email') ||
        '';

      const forwardParams = new URLSearchParams();
      forwardParams.set('verified', 'true');
      if (verificationToken) forwardParams.set('token', verificationToken);
      if (email) forwardParams.set('email', email);

      navigate(
        `/verify-email?${forwardParams.toString()}${window.location.hash ? window.location.hash : ''}`,
        { replace: true }
      );
    }
  }, [location, navigate]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AuthRedirectHandler />
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
            <BackToTop />
            <NewUserWelcomeSetupModal />

            <main style={{ flex: 1 }}>
              <Routes>
                {/* Customer Storefront (Redirects Admin to /admin/reports) */}
                <Route element={<CustomerGuard />}>
                  {/* 1. Landing & Product Catalog */}
                  <Route path="/" element={<ProductCatalogView />} />
                  <Route
                    path="/products/:idOrSlug"
                    element={<ProductDetailView />}
                  />
                  <Route
                    path="/products/:idOrSlug/reviews"
                    element={<ProductReviewSubmissionView />}
                  />
                  <Route
                    path="/products/:productId/reviews"
                    element={<ProductReviewSubmissionView />}
                  />

                  {/* 2. Cart & Bag */}
                  <Route path="/cart" element={<CartView />} />

                  {/* 3. Checkout Tunnel */}
                  <Route path="/checkout" element={<CheckoutView />} />

                  {/* 4. Order Confirmation & Tracking */}
                  <Route path="/orders" element={<OrderHistoryView />} />
                  <Route
                    path="/order-history"
                    element={<Navigate to="/orders" replace />}
                  />
                  <Route
                    path="/orders/:orderId"
                    element={<OrderConfirmationView />}
                  />
                  <Route
                    path="/orders/:orderId/receipt"
                    element={<OrderReceiptView />}
                  />
                  <Route
                    path="/track/:trackingNumber"
                    element={<ShipmentTrackingView />}
                  />
                  <Route path="/track" element={<ShipmentTrackingView />} />

                  {/* 5. Account Authentication */}
                  <Route
                    path="/login"
                    element={<LoginView initialTab="login" />}
                  />
                  <Route path="/register" element={<RegisterView />} />
                  <Route path="/verify-email" element={<VerifyEmailView />} />
                  <Route path="/resetPassword" element={<ResetPasswordView />} />
                  <Route path="/reset-password" element={<ResetPasswordView />} />
                  <Route path="/profile" element={<ProfileView />} />
                  <Route path="/addresses" element={<ProfileView />} />

                  {/* 6. Support & FAQ */}
                  <Route path="/support" element={<SupportView />} />
                  <Route path="/faq" element={<SupportView />} />
                  <Route path="/faqs" element={<SupportView />} />
                  <Route path="/privacy-policy" element={<LegalPolicyView />} />
                  <Route path="/privacy" element={<LegalPolicyView />} />
                  <Route path="/terms-of-service" element={<LegalPolicyView />} />
                  <Route path="/terms" element={<LegalPolicyView />} />
                  <Route path="/policies" element={<LegalPolicyView />} />
                </Route>

                {/* 7. Admin Portal (Protected with Role Guard) */}
                <Route path="/admin" element={<AdminGuard />}>
                  <Route element={<AdminLayout />}>
                    <Route
                      index
                      element={<Navigate to="/admin/reports" replace />}
                    />
                    <Route path="reports" element={<AdminReportsView />} />
                    <Route path="inventory" element={<AdminProductsView />} />
                    <Route path="orders" element={<AdminOrdersListView />} />
                    <Route
                      path="orders/:orderId"
                      element={<AdminOrderDetailView />}
                    />
                  </Route>
                </Route>

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
