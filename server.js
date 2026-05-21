const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // loads the MONGODB_URI and PORT from the .env file

const app = express();

// allows the frontend to make requests to this server
app.use(cors());
// lets the server understand JSON sent in request bodies
app.use(express.json());
// serves the HTML, CSS, and JS files from the frontend folder
app.use(express.static('frontend'));

// connects to the MongoDB database using the URI stored in .env
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('Connection error:', err));

// --- Schemas ---

// defines the shape of a product stored in the database
const productSchema = new mongoose.Schema({
  name: String,        // e.g. "VOILE RING"
  price: Number,       // e.g. 1200
  image: String,       // path to the main product image
  hoverImage: String,  // path to the image shown on hover
  description: String,
  category: String,    // e.g. "Rings", "Earrings", "Necklaces", "Bracelets"
  material: String,    // e.g. "24k Gold Plated Brass"
  reference: String,   // unique product code e.g. "AU001-R"
});

// defines the shape of a cart item stored in the database
const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // links back to the product
  name: String,
  price: Number,    // price is copied at the time of adding to cart
  image: String,    // copied so the cart can display it without fetching the product again
  quantity: { type: Number, default: 1 },
});

const Product = mongoose.model('Product', productSchema);
const CartItem = mongoose.model('CartItem', cartItemSchema);

// --- Seed ---

// fills the database with products on first run
// if products already exist, it skips to avoid duplicates
app.post('/api/seed', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    if (count > 0) return res.json({ message: 'Already seeded' });

    await Product.insertMany([
      { name: 'VOILE RING', price: 1200, image: '/assets/r1.webp', hoverImage: '/assets/r11.webp', description: 'A sculptural double-petal ring in hammered gold with a delicate pearl detail. Hand-finished by Parisian artisans.', category: 'Rings', material: '24k Gold Plated Brass, Freshwater Pearl', reference: 'AU001-R' },
      { name: 'NŒUD RING', price: 950, image: '/assets/r2.webp', hoverImage: '/assets/r21.webp', description: 'Stacked organic segments rise into a bold bamboo-inspired silhouette. A quiet statement for the wrist.', category: 'Rings', material: '24k Gold Plated Brass', reference: 'AU002-R' },
      { name: 'ÉCLAT RING', price: 1400, image: '/assets/r3.webp', hoverImage: '/assets/r31.webp', description: 'An open multi-band ring with branching gold forms, each set with brilliant-cut white crystals.', category: 'Rings', material: '18k Gold Vermeil, White Topaz', reference: 'AU003-R' },
      { name: 'NUAGE RING', price: 870, image: '/assets/r4.webp', hoverImage: '/assets/r41.webp', description: 'A constellation of matte gold spheres clustered into a sculptural ring. Tactile and otherworldly.', category: 'Rings', material: '24k Gold Plated Brass', reference: 'AU004-R' },
      { name: 'AUBE EARRINGS', price: 1350, image: '/assets/e1.webp', hoverImage: '/assets/e11.webp', description: 'Oversized crescent hoops in white enamel edged with hammered gold. Architectural and deeply refined.', category: 'Earrings', material: '24k Gold Plated Brass, White Enamel', reference: 'AU005-E' },
      { name: 'DIEU EARRINGS', price: 1800, image: '/assets/e2.webp', hoverImage: '/assets/e21.webp', description: 'Surrealist mismatched earrings — one bears an eye and sun charm, the other a classical coin medallion.', category: 'Earrings', material: '24k Gold Plated Brass, Enamel', reference: 'AU006-E' },
      { name: 'PLEUR EARRINGS', price: 2200, image: '/assets/e3.webp', hoverImage: '/assets/e31.webp', description: 'A dramatic eye motif with cascading crystal chains. Equal parts mystical and maximalist.', category: 'Earrings', material: '24k Gold Plated Brass, Crystal, Enamel', reference: 'AU007-E' },
      { name: 'GRACE EARRINGS', price: 980, image: '/assets/e4.webp', hoverImage: '/assets/e41.webp', description: 'A sculptural gold hand suspends a delicate cross of bezel-set crystals. Worn as a single statement piece.', category: 'Earrings', material: '18k Gold Vermeil, White Topaz', reference: 'AU008-E' },
      { name: 'EDEN NECKLACE', price: 2400, image: '/assets/n1.webp', hoverImage: '/assets/n11.webp', description: 'A circle collar suspending an engraved teardrop pendant scattered with butterfly motifs. Quietly mythological.', category: 'Necklaces', material: '24k Gold Plated Brass', reference: 'AU009-N' },
      { name: 'PLUIE NECKLACE', price: 3200, image: '/assets/n2.webp', hoverImage: '/assets/n21.webp', description: 'Cascading gold discs and baroque pearl drops fall from a hammered circle collar. Rain frozen in gold.', category: 'Necklaces', material: '24k Gold Plated Brass, Freshwater Pearl', reference: 'AU010-N' },
      { name: 'MYTHE NECKLACE', price: 1900, image: '/assets/n3.webp', hoverImage: '/assets/n31.jpg', description: 'A surrealist pendant — an eye, an abstract keyhole form, and a small figure suspended from a textured collar.', category: 'Necklaces', material: '24k Gold Plated Brass', reference: 'AU011-N' },
      { name: 'OMBRE NECKLACE', price: 2100, image: '/assets/n4.webp', hoverImage: '/assets/n41.webp', description: 'An abstract face rendered in gold — eye, nose and lips sculpted into a wearable work of art.', category: 'Necklaces', material: '24k Gold Plated Brass', reference: 'AU012-N' },
      { name: 'MASQUE CUFF', price: 3500, image: '/assets/b1.webp', hoverImage: '/assets/b11.webp', description: 'A hammered gold cuff bearing a sculpted face with an enamel eye and diamond nose ring. Unmistakably AUREL.', category: 'Bracelets', material: '24k Gold Plated Brass, Enamel, Diamond', reference: 'AU013-B' },
      { name: 'ÂME CUFF', price: 2800, image: '/assets/b2.webp', hoverImage: '/assets/b21.webp', description: 'An open gold cuff tracing the outline of a face — eye socket, nose and lips rendered in fine wire.', category: 'Bracelets', material: '24k Gold Plated Brass, Moonstone', reference: 'AU014-B' },
      { name: 'REGARD CUFF', price: 1900, image: '/assets/b3.webp', hoverImage: '/assets/b31.webp', description: 'A fluid gold cuff centred on a vivid blue enamel eye. Protective, powerful, precise.', category: 'Bracelets', material: '24k Gold Plated Brass, Enamel', reference: 'AU015-B' },
      { name: 'DÉSIR BRACELET', price: 2200, image: '/assets/b4.webp', hoverImage: '/assets/b41.jpg', description: 'A textured gold chain bracelet with a sculpted lip charm and pavé diamond ring detail. Sensual and refined.', category: 'Bracelets', material: '18k Gold Vermeil, Diamond', reference: 'AU016-B' },
    ]);
    res.json({ message: 'Products seeded!' });
  } catch (err) {
    res.status(500).json({ error: 'Seeding failed', details: err.message });
  }
});

// --- Product Routes ---

// returns all products from the database
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// --- Cart Routes ---

// returns all items currently in the cart
app.get('/api/cart', async (req, res) => {
  try {
    const items = await CartItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// adds a product to the cart
// if the product is already in the cart, increases the quantity instead of adding a duplicate
app.post('/api/cart', async (req, res) => {
  try {
    const { productId, name, price, image } = req.body;

    const existing = await CartItem.findOne({ productId });
    if (existing) {
      existing.quantity += 1;
      await existing.save();
      return res.json(existing);
    }

    const item = new CartItem({ productId, name, price, image, quantity: 1 });
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// updates the quantity of a cart item
// if the new quantity is 0 or less, the item is removed from the cart
app.put('/api/cart/:id', async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity <= 0) {
      await CartItem.findByIdAndDelete(req.params.id);
      return res.json({ deleted: true });
    }

    const item = await CartItem.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true } // returns the updated document rather than the old one
    );
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

// removes a single item from the cart by its id
app.delete('/api/cart/:id', async (req, res) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

// removes all items from the cart at once
app.delete('/api/cart', async (req, res) => {
  try {
    await CartItem.deleteMany({});
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// --- Start Server ---

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));