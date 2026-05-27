# AUREL — Luxury Jewellery E-Commerce

## Overview
AUREL is a single-page e-commerce application for a luxury jewellery brand. Visitors can browse a curated collection of fine jewellery and view detailed product information. Registered users can add pieces to a personal shopping bag, adjust quantities, and check out. An admin account can view the shopping bags of every customer.

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router |
| Backend | Node.js, Express |
| Database | MongoDB Atlas |
| Authentication | JSON Web Tokens (JWT), bcrypt password hashing |
| Fonts | Montserrat (Google Fonts) |

## Features
- Single-page application — all interactions happen without page reloads
- User registration, login and password change, with passwords stored as secure bcrypt hashes
- JWT-based authentication, so a logged-in session survives a page refresh
- Role-based access: a normal `user` role and an `admin` role
- Admin panel where an admin can view every customer's shopping bag
- 16 products across 4 categories: Rings, Earrings, Necklaces, Bracelets
- Live search that filters products as the user types
- Category filtering via a tab bar (Add-on feature)
- Hover image swap on product cards (Add-on feature)
- Product detail overlay with material and reference information (Add-on feature)
- Personal shopping bag: each user has their own cart, saved in the database
- Bag controls: increase, decrease, or remove items
- Cart total calculated dynamically
- Clear the entire bag, or check out to complete an order
- Toast notifications for all actions
- Responsive design for mobile, tablet, and desktop
- Error handling: a clear message is shown when an error occurs

## CRUD Operations
The app applies all four CRUD operations across three entities:
- **User** — Create (register) and Read (login).
- **Product** — Create (seeded into the database) and Read (browse and search).
- **CartItem** — Create (add to bag), Read (view bag), Update (change quantity), Delete (remove an item or clear the bag).

## Folder Structure
shopping-cart/
├── client/                 # React frontend (its own Node project)
│   ├── public/
│   │   └── assets/          # product images (main + hover)
│   ├── src/
│   │   ├── components/      # reusable UI pieces (navbar, cart, product card, etc.)
│   │   ├── context/         # authentication state shared across the app
│   │   ├── pages/           # full pages (Shop, Login, Register, Admin)
│   │   ├── api.js           # all calls to the backend in one place
│   │   ├── App.jsx          # routes for the app
│   │   ├── main.jsx         # React entry point
│   │   └── index.css        # all styles and responsive rules
│   └── package.json         # frontend dependency list
├── server.js                # Express server, routes, and database models
├── .env                     # environment variables (not committed to git)
├── package.json             # backend dependency list
├── database-export/         # exported database collections (.json)
└── README.md

## Database
MongoDB Atlas (free tier) is used as the cloud database. It has three collections:
- **users** — registered accounts, with hashed passwords and a role (`user` or `admin`).
- **products** — the 16 jewellery items, each with a name, price, images, category, material, and a unique reference code.
- **cartitems** — items added to a bag, each linked to the user who owns it and the product it refers to.

The products collection is filled automatically by a seed route (`POST /api/seed`) the first time the app runs. A unique index on the product `reference` field prevents the same product from being added twice.

A copy of the database is included in the `database-export/` folder as `.json` files.

## API Routes
| Method | Route | Description | Access |
|---|---|---|---|
| POST | /api/register | create a new account | public |
| POST | /api/login | log in and receive a token | public |
| POST | /api/seed | fill the database with products if empty | public |
| GET | /api/products | fetch all products | public |
| GET | /api/cart | fetch the logged-in user's bag | logged-in user |
| POST | /api/cart | add an item to the bag | logged-in user |
| PUT | /api/cart/:id | update an item's quantity | logged-in user |
| DELETE | /api/cart/:id | remove one item from the bag | logged-in user |
| DELETE | /api/cart | clear the whole bag | logged-in user |
| GET | /api/admin/carts | view every customer's bag | admin only |

## How to Run
The project has two parts: a backend and a frontend, and each needs its dependencies installed.

1. Clone the repository.
2. **Backend:** in the project's main folder, run `npm install`.
3. **Frontend:** move into the `client` folder (`cd client`) and run `npm install`.
4. In the main folder, create a `.env` file with the following variables:
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=any_long_random_string
PORT=3000

The `.env` file is not included in the repository for security reasons, so it must be created manually.
5. Start the backend: in the main folder, run `npm start`. It runs on `http://localhost:3000`.
6. Start the frontend: in the `client` folder, run `npm run dev`. It runs on `http://localhost:5173`.
7. Open `http://localhost:5173` in a browser.

To use the admin panel, register an account, then change that user's `role` field to `admin` in the database, and log in again.

## Challenges
- Coming from vanilla JavaScript, understanding the React project structure was 
  challenging like components, pages, state, and routing were all new concepts to learn.
- Adding authentication was new to me. Understanding how password hashing and JWT tokens work together, and how to protect routes so only logged-in users can reach them, was challenging.
- A tricky bug appeared where products were seeded into the database twice. Tracking it down to React running its setup code twice in development, and fixing it with a unique database index, taught me a lot about how the frontend and database interact.

## Author
Tanvi Karanth — Student ID 14216194