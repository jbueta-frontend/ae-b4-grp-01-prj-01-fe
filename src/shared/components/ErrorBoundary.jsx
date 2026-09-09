import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    try {
      localStorage.removeItem('fiddlemania_cart');
      localStorage.removeItem('fiddlemania_user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch {
      // ignore
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backgroundColor: '#FAF7F5',
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          <div
            style={{
              maxWidth: '520px',
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '36px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
              border: '1px solid #F1ECE7',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(200, 90, 50, 0.12)',
                color: '#C85A32',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '24px',
              }}
            >
              ⚠
            </div>
            <h2
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#18181B',
                marginBottom: '8px',
              }}
            >
              Notice: UI Refresh Required
            </h2>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#71717A',
                lineHeight: 1.5,
                marginBottom: '20px',
              }}
            >
              A cached browser session state was detected. Click below to clear
              stale local state and reload the store.
            </p>

            {this.state.error && (
              <pre
                style={{
                  textAlign: 'left',
                  backgroundColor: '#F4F4F5',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  color: '#DC2626',
                  overflowX: 'auto',
                  marginBottom: '20px',
                  maxHeight: '120px',
                }}
              >
                {this.state.error?.message || String(this.state.error)}
              </pre>
            )}

            <button
              onClick={this.handleReset}
              style={{
                height: '46px',
                padding: '0 24px',
                backgroundColor: '#C85A32',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(200, 90, 50, 0.25)',
              }}
            >
              Reset Session & Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
