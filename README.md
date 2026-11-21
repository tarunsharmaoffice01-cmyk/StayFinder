# StayFinder – Vacation Rental Booking Platform

A complete, responsive vacation rental booking application built with **React 18**, **Tailwind CSS**, **React Router DOM v6**, and **Vite**, backed by an **Express API** and **Supabase PostgreSQL**.

---

## 🌟 Key Features this has:

### 1. 🏡 Modern Airbnb-Inspired Interface
- **Clean & Minimal Aesthetic:** Crisp white backgrounds, subtle neutral gray sections, and warm coral/rose accent colors (`#FF385C`).
- **Rounded Property Cards:** Rounded corners (`rounded-2xl`), smooth hover transitions, and favorite heart buttons.
- **5-Image Mosaic Gallery:** Authentic Airbnb-style layout featuring 1 large hero photo and 4 tiled pictures, plus a fullscreen photo modal viewer.
- **Category Navigation Bar:** Horizontal icon scroller with categories like Beachfront, Cabins, Mansions, Countryside, Lakefront, Ski-in/out, Desert, and Luxe.

### 2. 🔍 Interactive Search & Filter Engine
- **Destination & Keyword Search:** Search by city, country, or stay name.
- **Date Pickers:** Real-time check-in and checkout date selectors with automatic night calculations.
- **Guest Capacity Stepper:** Dynamic counter (+ / -) with maximum guest capacity validation.
- **Comprehensive Filter Modal:**
  - Price range slider/inputs (Min & Max price).
  - Property types (Villa, Chalet, Apartment, Cabin, Treehouse, Townhouse, etc.).
  - Minimum guest ratings (4.5+, 4.8+, 4.9+).
  - Amenities filtering (WiFi, Private Pool, Hot Tub, Kitchen, AC, Fireplace, Free Parking, etc.).
  - Sort by: Recommended (Relevance), Price (Low to High, High to Low), Highest Rated, Most Reviewed.
  - Active filter badges with one-click individual dismissal and "Clear All" option.

### 3. 📅 Real-Time Booking & Reservation System
- **Dynamic Pricing Calculator:** Calculates nights, subtotal (`pricePerNight * nights`), cleaning fee, platform service fee (12%), local occupancy taxes (8%), and grand total.
- **Reservation Confirmation Flow:** The backend calculates booking prices and persists reservations in Supabase; users can view and cancel their reservations.
- **"My Bookings" Page:** Complete trip history with dates, guest count, price paid, and option to cancel reservations.

### 4. ❤️ Wishlist & Favourites
- 1-click heart toggle on every property card with animated feedback.
- Dedicated Wishlist page displaying all saved vacation rentals.
- Saved properties are associated with the signed-in user and persisted in Supabase.

### 5. 🔑 Demo Authentication & User Profile
- API-backed signup, login, session restore, and profile updates using bearer tokens.
- **1-Click Demo Login** button for instant testing without manual typing.
- User profile page with personal info editor (Name, Email, Phone, Location) and stats overview (Trips Booked, Saved Wishlist, Hosted Properties).
- Logout functionality accessible from the user dropdown.

### 6. 🏠 Become a Host & Host Dashboard
- **"StayFinder Your Home" Form:** Add property title, location, category, price per night, guest capacity, bedroom/bed specs, amenities, and image URL (includes 4 preset architectural photography templates).
- **Host Dashboard:** View active hosted properties, estimated monthly value, and delete/manage custom listings.
- User-created listings immediately appear in the global search and category feeds.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Build Tool** | [Vite 5](https://vitejs.dev/) (Lightning-fast HMR) |
| **UI Library** | [React 18](https://react.dev/) (Functional components & hooks) |
| **Language** | JavaScript (ES6+ / JSX) |
| **Styling** | [Tailwind CSS v3](https://tailwindcss.com/) with PostCSS & Autoprefixer |
| **Routing** | [React Router DOM v6](https://reactrouter.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **State Management**| React Context API (`AuthContext`, `WishlistContext`, `BookingContext`) |
| **Data Persistence**| Supabase PostgreSQL |
| **API Layer** | Express REST API (`backend/`) |

---

## 📂 Project Architecture

```text
stayFinder/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    │   ├── Navbar.jsx           # Global sticky navbar with search pill & user menu
    │   ├── Footer.jsx           # 4-column footer with links & project disclaimer
    │   ├── SearchBar.jsx        # Interactive 4-segment search bar (Where, Dates, Guests)
    │   ├── PropertyCard.jsx     # Card with hover zoom, wishlist heart & rating badge
    │   ├── PropertyGrid.jsx     # Responsive grid with empty states
    │   ├── CategoryBar.jsx      # Horizontal category icon scroller
    │   ├── FilterModal.jsx      # Modal for price, type, rating, and amenities
    │   ├── ImageGallery.jsx     # 5-image mosaic layout + fullscreen photo viewer
    │   ├── BookingCard.jsx      # Sticky booking card with live price calculation
    │   ├── ReviewSection.jsx    # Ratings breakdown and guest feedback
    │   └── Loader.jsx           # Clean skeleton loaders
    ├── pages/
    │   ├── Home.jsx             # Hero, categories, featured stays & destinations
    │   ├── Explore.jsx          # Search results with comprehensive filters
    │   ├── PropertyDetails.jsx  # Detailed property page with gallery & booking
    │   ├── Wishlist.jsx         # Saved properties page
    │   ├── Login.jsx            # Sign in with 1-click demo login
    │   ├── Signup.jsx           # New user registration
    │   ├── Profile.jsx          # Editable profile & stats
    │   ├── MyBookings.jsx       # Confirmed reservations with cancellation
    │   ├── HostDashboard.jsx    # Host stats & custom listing manager
    │   ├── AddProperty.jsx      # Multi-step host listing form
    │   └── NotFound.jsx         # 404 page
    ├── context/
    │   ├── AuthContext.jsx      # API authentication & profile state
    │   ├── WishlistContext.jsx  # Saved property IDs management
    │   └── BookingContext.jsx   # Booking creation & cancellation
    ├── hooks/
    │   └── useListings.js       # Reusable listings fetch hook with filters
    ├── services/
    │   ├── api.js               # Fetch client and bearer-token handling
    │   └── listingService.js    # Data access layer for listings & user properties
    ├── utils/
    │   ├── priceCalculator.js   # Calculation of nights, fees, taxes & total
    │   └── dateUtils.js         # Date calculations and ISO formatters
    └── data/
        └── mockListings.js      # Legacy sample data used by the seed dataset
└── backend/
    ├── db/schema.sql            # Supabase schema
    ├── db/seed.js               # Optional demo-data seeder
    └── src/                     # Express routes, controllers, and services
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm** / **yarn**

### 2. Install frontend dependencies
From the project root:
```bash
npm install
```

### 3. Configure and run the backend
Create `backend/.env` using `backend/.env.example` as a reference. Set the Supabase URL, a backend-only Supabase service-role key, and a strong `JWT_SECRET`. Never put the service-role key in a `VITE_*` variable or commit it.

Run `backend/db/schema.sql` in the Supabase SQL Editor. It creates the tables used by the API, including `wishlist_items`.

```bash
cd backend
npm install
npm run dev
```

The API listens on `http://localhost:5000/api`.

### 4. Run the frontend
In another terminal, from the project root:
```bash
npm run dev
```
The frontend defaults to `http://localhost:5000/api`. To override it, set `VITE_API_BASE_URL` in a root `.env` file. Open the Vite URL printed in the terminal.

### 5. Build for Production
```bash
npm run build
```
Creates an optimized static bundle in the `dist/` directory.

### 6. Preview Production Build
```bash
npm run preview
```

---

## 🔌 Backend API

The frontend reads listings, categories, and destinations from the backend API. Authentication, profile changes, bookings, reviews, host listings, and wishlist changes also use API endpoints. Protected endpoints require a signed-in user; host listing management requires a host account.

For optional demo-data seeding, set `SUPABASE_SERVICE_ROLE_KEY` in `backend/.env` and run `node db/seed.js` from the `backend/` directory. Keep this privileged key backend-only.
