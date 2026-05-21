import ProductCard from './ProductCard';

// arranges product cards in a grid, or shows a message when there are none
export default function ProductGrid({ products, onOpen, onAdd }) {
  if (products.length === 0) {
    return <p style={{ textAlign: 'center', color: '#999', padding: '4rem' }}>No products found.</p>;
  }

  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} onOpen={onOpen} onAdd={onAdd} />
      ))}
    </div>
  );
}