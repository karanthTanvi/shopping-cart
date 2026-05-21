// a single product tile in the grid
// clicking the card opens the detail view; the button adds straight to the bag
export default function ProductCard({ product, onOpen, onAdd }) {
  return (
    <div className="product-card" onClick={() => onOpen(product)}>
      <div className="product-image-wrap">
        <img className="img-main" src={product.image} alt={product.name} />
        <img className="img-hover" src={product.hoverImage || product.image} alt={product.name} />
        <button
          className="quick-add"
          onClick={(e) => { e.stopPropagation(); onAdd(product); }}
        >
          ADD TO BAG
        </button>
      </div>
      <div className="product-category-tag">{product.category}</div>
      <div className="product-name">{product.name}</div>
      <div className="product-price">$ {product.price.toLocaleString()}</div>
    </div>
  );
}