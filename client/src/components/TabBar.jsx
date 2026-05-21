const CATEGORIES = ['all', 'Rings', 'Earrings', 'Necklaces', 'Bracelets'];

// category filter row — highlights the active category
export default function TabBar({ active, onSelect }) {
  return (
    <div className="tab-bar">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          className={`tab-btn ${active === cat ? 'active' : ''}`}
          onClick={() => onSelect(cat)}
        >
          {cat === 'all' ? 'ALL PIECES' : cat.toUpperCase()}
        </button>
      ))}
    </div>
  );
}