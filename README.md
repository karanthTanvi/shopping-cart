# AUREL — Luxury Jewellery E-Commerce

## Overview
AUREL is a single-page e-commerce application for a luxury jewellery brand. It allows users to browse a curated collection of fine jewellery, view detailed product information, and manage a shopping cart.

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js, Express |
| Database | MongoDB Atlas (cloud-hosted) |
| Fonts | Cormorant Garamond, Montserrat (Google Fonts) |

## Features
- Single-page application (all interactions happen without page reloads)
- 16 products across 4 categories: Rings, Earrings, Necklaces, Bracelets
- Category filtering via a sticky tab bar
- Hover image swap on product cards
- Product detail overlay with material and reference information
- Add to bag from product grid or detail view
- Sliding cart sidebar with live item count in navbar
- Bag quantity controls: increase, decrease, or remove items
- Cart total calculated dynamically
- Clear entire cart or proceed to checkout
- Toast notifications for all actions
- Responsive design works on mobile, tablet, and desktop
- Error handling messages if the server is unavailable

## Folder Structure
shopping-cart/
├── frontend/             # all files served to the browser
│   ├── assets/           # product images (main + hover)
│   ├── index.html        # single page entry point
│   ├── style.css         # all styles and responsive rules
│   └── app.js            # frontend logic and API calls
├── node_modules/         # project dependencies (auto-generated)
├── server.js             # Express server, routes, and database models
├── .env                  # environment variables
├── package.json          # dependency list
└── README.md

## Database
MongoDB Atlas (free tier) is used as the cloud database. There are two collections:
- **products** — stores all 16 jewellery items with name, price, images, category, material, and reference code
- **cartitems** — stores items added to the cart with quantity and a reference to the product

A seed route (`POST /api/seed`) automatically fills the products collection on first run.

## API Routes
| Method | Route | Description |
|---|---|---|
| GET | /api/products | fetch all products |
| POST | /api/seed | fill database with products if empty |
| GET | /api/cart | fetch all cart items |
| POST | /api/cart | add item to cart |
| PUT | /api/cart/:id | update item quantity |
| DELETE | /api/cart/:id | remove one item |
| DELETE | /api/cart | clear entire cart |

## Challenges
- Figuring out how to map CRUD operations to an e-commerce context was not straightforward. For example understanding that adding to cart is Create and changing quantity is Update took a while to work out.
- Connecting MongoDB Atlas to the backend was difficult and involved watching a lot of tutorials to understand how to connect the database to the backend.
- Since its a single page, thinking of ways to show different information without redirecting to a new page was interesting and a bit challenging.

## How to Run
1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file with your MongoDB connection string:
MONGODB_URI=mongodb+srv://********appName=ShoppingCart
PORT=3000
4. Run `node server.js` to start the server
5. Open `http://localhost:3000` in your browser