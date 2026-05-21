// sliding bag panel — lists items, adjusts quantity, shows the subtotal
export default function CartSidebar({ open, items, onClose, onUpdateQty, onRemove, onClear, onCheckout }) {
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <>
      <div className={`cart-overlay ${open ? 'active' : ''}`} onClick={onClose}></div>
      <aside className={`cart-sidebar ${open ? 'open' : ''}`}>
        <div className="cart-header">
          <span className="cart-title">YOUR BAG</span>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="empty-cart">YOUR BAG IS EMPTY</div>
          ) : (
            items.map((item) => (
              <div className="cart-item" key={item._id}>
                <div className="cart-item-img">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-details">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">
                    $ {(item.price * item.quantity).toLocaleString()}
                  </div>
                  <div className="qty-controls">
                    <button className="qty-btn" onClick={() => onUpdateQty(item._id, item.quantity - 1)}>−</button>
                    <span className="qty-num">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => onUpdateQty(item._id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button className="remove-item" onClick={() => onRemove(item._id)}>✕</button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span className="cart-subtotal-label">SUBTOTAL</span>
              <span className="cart-subtotal-amount">$ {totalPrice.toLocaleString()}</span>
            </div>
            <button className="checkout-btn" onClick={onCheckout}>PROCEED TO CHECKOUT</button>
            <button className="clear-btn" onClick={onClear}>CLEAR BAG</button>
            <p className="cart-shipping">Complimentary shipping on all orders</p>
          </div>
        )}
      </aside>
    </>
  );
}