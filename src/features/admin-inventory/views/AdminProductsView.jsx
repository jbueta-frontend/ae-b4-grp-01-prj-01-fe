import { useAdminProductsViewModel } from '../viewmodels/useAdminProductsViewModel';
import ProductFormModal from '../components/ProductFormModal';
import { formatPHP } from '../../../shared/utils/currency';

export default function AdminProductsView() {
  const {
    products,
    totalCount,
    totalFilteredCount,
    currentPage,
    totalPages,
    pageSize,
    setPageSize,
    goToPage,
    nextPage,
    prevPage,
    loading,
    error,
    feedback,
    clearFeedback,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    isModalOpen,
    editingProduct,
    isSubmitting,
    openCreateModal,
    openEditModal,
    closeModal,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    isCatalogSeeded,
    isSeeding,
    seedProgress,
    handleSeedHundredProducts,
    refresh,
  } = useAdminProductsViewModel();

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              letterSpacing: '-0.02em',
            }}
          >
            Product Catalog Management
          </h1>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
              marginTop: '4px',
            }}
          >
            Create, edit, price, and organize sensory fidget toys in the live store.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* 1-Click Seeder Button: immediately unmounted after clicking */}
          {!isCatalogSeeded && (
            <button
              type="button"
              onClick={handleSeedHundredProducts}
              disabled={isSeeding}
              className="btn btn-primary btn-sm"
              style={{
                backgroundColor: '#059669',
                borderColor: '#059669',
                color: '#ffffff',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)',
              }}
              title="Seed 120 unique toys with distinct images"
            >
              <span>⚡</span>
              <span>{isSeeding ? `Seeding (${seedProgress}/120)...` : 'Seed 120 Unique Toys'}</span>
            </button>
          )}

          <button
            onClick={refresh}
            disabled={loading}
            className="btn btn-outline btn-sm"
          >
            <span>↻</span>
            <span>Refresh</span>
          </button>
          <button
            onClick={openCreateModal}
            className="btn btn-primary btn-sm"
            style={{ gap: '6px' }}
          >
            <span>+</span>
            <span>Add New Toy</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          style={{
            backgroundColor: 'var(--success-bg)',
            border: '1px solid var(--success)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 18px',
            color: 'var(--success)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          <span>✓ {feedback.message}</span>
          <button
            onClick={clearFeedback}
            style={{ color: 'var(--success)', cursor: 'pointer', padding: '0 4px' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 18px',
            color: '#dc2626',
            marginBottom: '20px',
            fontSize: '0.875rem',
          }}
        >
          ⚠ {typeof error === 'string' ? error : error?.message || 'Error occurred'}
        </div>
      )}

      {/* Search & Filter Bar */}
      <div
        className="admin-card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        {/* Search */}
        <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by toy name, SKU, brand..."
            className="form-input"
            style={{ padding: '8px 14px', fontSize: '0.875rem' }}
          />
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Status:
          </span>
          {['ALL', 'ACTIVE', 'DRAFT', 'ARCHIVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`pill ${statusFilter === st ? 'active' : ''}`}
              style={{ fontSize: '0.75rem', padding: '4px 12px' }}
            >
              {st}
            </button>
          ))}
          <span
            style={{
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
              marginLeft: '8px',
            }}
          >
            ({products.length} of {totalCount})
          </span>
        </div>
      </div>

      {/* Catalog Table Card */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div
            style={{
              padding: '48px 0',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            Loading toy catalog...
          </div>
        ) : products.length === 0 ? (
          <div
            style={{
              padding: '60px 24px',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🧸</div>
            <h3
              style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '6px',
              }}
            >
              No products found
            </h3>
            <p style={{ fontSize: '0.875rem', marginBottom: '18px' }}>
              {searchQuery || statusFilter !== 'ALL'
                ? 'Try adjusting your search query or filter tags.'
                : 'Start by creating your first fidget toy listing.'}
            </p>
            <button onClick={openCreateModal} className="btn btn-primary btn-sm">
              + Add First Product
            </button>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.875rem',
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderBottom: '1px solid var(--border-hairline)',
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  <th style={{ padding: '14px 20px' }}>SKU</th>
                  <th style={{ padding: '14px 20px' }}>Product</th>
                  <th style={{ padding: '14px 20px' }}>Price</th>
                  <th style={{ padding: '14px 20px' }}>Ages</th>
                  <th style={{ padding: '14px 20px' }}>Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => {
                  const id = item.productId || item.id;
                  const isDraft = item.status === 'DRAFT';
                  const isArchived = item.status === 'ARCHIVED';

                  return (
                    <tr
                      key={id}
                      style={{
                        borderBottom: '1px solid var(--border-hairline)',
                        transition: 'background-color var(--transition-fast)',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          'var(--bg-subtle)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                      }
                    >
                      {/* SKU */}
                      <td
                        style={{
                          padding: '16px 20px',
                          fontFamily: 'monospace',
                          fontSize: '0.8125rem',
                          color: 'var(--text-muted)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.sku || '—'}
                      </td>

                      {/* Name & Brand */}
                      <td style={{ padding: '16px 20px' }}>
                        <div
                          style={{
                            fontWeight: 700,
                            color: 'var(--text-main)',
                          }}
                        >
                          {item.name}
                        </div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            marginTop: '2px',
                          }}
                        >
                          {item.brand || 'FiddleMania'}{' '}
                          {item.category ? `• ${item.category}` : ''}
                        </div>
                      </td>

                      {/* Price */}
                      <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                        <div
                          style={{
                            fontWeight: 700,
                            color: 'var(--accent)',
                          }}
                        >
                          {formatPHP(item.price)}
                        </div>
                        {item.compareAtPrice && (
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-light)',
                              textDecoration: 'line-through',
                            }}
                          >
                            {formatPHP(item.compareAtPrice)}
                          </div>
                        )}
                      </td>

                      {/* Ages */}
                      <td
                        style={{
                          padding: '16px 20px',
                          color: 'var(--text-muted)',
                          fontSize: '0.8125rem',
                        }}
                      >
                        {item.ageMin != null && item.ageMax != null
                          ? `Ages ${item.ageMin}–${item.ageMax}`
                          : item.ageGroup || 'All Ages'}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            backgroundColor: isDraft
                              ? 'rgba(217, 119, 6, 0.1)'
                              : isArchived
                                ? 'rgba(113, 113, 122, 0.1)'
                                : 'var(--success-bg)',
                            color: isDraft
                              ? '#d97706'
                              : isArchived
                                ? '#71717a'
                                : 'var(--success)',
                          }}
                        >
                          {item.status || 'ACTIVE'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td
                        style={{
                          padding: '16px 20px',
                          textAlign: 'right',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <div
                          style={{
                            display: 'inline-flex',
                            gap: '8px',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <button
                            onClick={() => openEditModal(item)}
                            className="btn btn-outline btn-sm"
                            style={{
                              padding: '5px 12px',
                              fontSize: '0.75rem',
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteProduct(id, item.name)
                            }
                            className="btn btn-ghost btn-sm"
                            style={{
                              padding: '5px 10px',
                              fontSize: '0.75rem',
                              color: '#dc2626',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 24px',
              borderTop: '1px solid var(--border-hairline)',
              backgroundColor: 'var(--bg-subtle)',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                fontSize: '0.8125rem',
                color: 'var(--text-muted)',
              }}
            >
              <span>
                Showing {(currentPage - 1) * pageSize + 1}–
                {Math.min(currentPage * pageSize, totalFilteredCount)} of{' '}
                {totalFilteredCount} toys
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="form-input"
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    width: 'auto',
                    cursor: 'pointer',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="btn btn-outline btn-sm"
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    opacity: currentPage === 1 ? 0.35 : 1,
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  }}
                  title="First Page"
                >
                  «
                </button>
                <button
                  type="button"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="btn btn-outline btn-sm"
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    opacity: currentPage === 1 ? 0.35 : 1,
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  ‹ Prev
                </button>

                <span
                  style={{
                    padding: '0 8px',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                  }}
                >
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="btn btn-outline btn-sm"
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    opacity: currentPage === totalPages ? 0.35 : 1,
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  }}
                >
                  Next ›
                </button>
                  <button
                    type="button"
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="btn btn-outline btn-sm"
                    style={{
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      opacity: currentPage === totalPages ? 0.35 : 1,
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    }}
                    title="Last Page"
                  >
                    »
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={(data) => {
          if (editingProduct) {
            const id = editingProduct.productId || editingProduct.id;
            handleUpdateProduct(id, data);
          } else {
            handleCreateProduct(data);
          }
        }}
        initialProduct={editingProduct}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
