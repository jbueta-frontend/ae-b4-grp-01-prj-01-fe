import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<div>Login View</div>} />
        <Route path="/register" element={<div>Register View</div>} />

        {/* Customer */}
        <Route path="/" element={<div>Product Catalog View</div>} />
        <Route
          path="/products/:idOrSlug"
          element={<div>Product Detail View</div>}
        />
        <Route path="/cart" element={<div>Cart View</div>} />
        <Route path="/checkout" element={<div>Checkout View</div>} />
        <Route path="/orders" element={<div>Order History View</div>} />
        <Route path="/orders/:orderId" element={<div>Order Detail View</div>} />
        <Route
          path="/track/:trackingNumber"
          element={<div>Shipment Tracking View</div>}
        />
        <Route path="/profile" element={<div>Profile View</div>} />
        <Route path="/addresses" element={<div>Addresses View</div>} />

        {/* Admin */}
        <Route path="/admin/reports" element={<div>Admin Reports View</div>} />
        <Route
          path="/admin/inventory"
          element={<div>Admin Inventory View</div>}
        />
        <Route
          path="/admin/orders"
          element={<div>Admin Fulfillment View</div>}
        />

        {/* Fallback */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
