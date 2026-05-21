// full product detail shown in a centered overlay
// renders nothing when no product is selected
export default function ProductDetail({ product, onClose, onAdd }) {
  if (!product) return null;

  return (
    <div className="overlay active" onClick={onClose}>
      {/* stop clicks inside the modal from closing it */}
      <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="detail-close" onClick={onClose}>✕</button>

        <div className="detail-image-wrap">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="detail-info">
          <p className="detail-category">{product.category}</p>
          <h2 className="detail-name">{product.name}</h2>
          <p className="detail-price">$ {product.price.toLocaleString()}</p>
          <p className="detail-desc">{product.description}</p>

          <div className="detail-meta">
            <div className="detail-row">
              <span className="detail-label">MATERIAL</span>
              <span className="detail-value">{product.material || '—'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">REFERENCE</span>
              <span className="detail-value">{product.reference || '—'}</span>
            </div>
          </div>

          <button className="add-btn" onClick={() => { onAdd(product); onClose(); }}>
            ADD TO BAG
          </button>
          <p className="detail-note">
            Complimentary shipping on all orders. Each piece arrives in an AUREL gift box.
          </p>
        </div>
      </div>
    </div>
  );
}