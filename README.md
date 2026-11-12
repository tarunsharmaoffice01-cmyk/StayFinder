# StayFinder – Vacation Rental Booking Platform

A complete, responsive, and modern vacation rental booking web application inspired by **Airbnb**, crafted as a high-quality college group capstone project. Built with **React 18**, **Tailwind CSS**, **React Router DOM v6**, **Context API**, **Lucide React**, and powered by **Vite**.

---

## 🌟 Key Features

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
- **Reservation Confirmation Flow:** Generates unique booking reference IDs (`SF-2026-XXXX`), saves to `localStorage`, and displays an instant confirmation celebration dialog.
- **"My Bookings" Page:** Complete trip history with dates, guest count, price paid, and option to cancel reservations.

### 4. ❤️ Wishlist & Favourites
- 1-click heart toggle on every property card with animated feedback.
- Dedicated Wishlist page displaying all saved vacation rentals.
- Persisted to browser `localStorage` (`stayfinder_wishlist_v1`) so your saved bucket list remains intact on page refresh.

### 5. 🔑 Demo Authentication & User Profile
- Simulated demo authentication with `localStorage` persistence.
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
| **Data Persistence**| Browser `localStorage` |
| **API Layer** | Service-oriented mock API with simulated network latency |

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
    │   ├── AuthContext.jsx      # Demo authentication & profile state
    │   ├── WishlistContext.jsx  # Saved property IDs management
    │   └── BookingContext.jsx   # Booking creation & cancellation
    ├── hooks/
    │   └── useListings.js       # Reusable listings fetch hook with filters
    ├── services/
    │   ├── api.js               # Simulated REST client with network latency
    │   └── listingService.js    # Data access layer for listings & user properties
    ├── utils/
    │   ├── priceCalculator.js   # Calculation of nights, fees, taxes & total
    │   └── dateUtils.js         # Date calculations and ISO formatters
    └── data/
        └── mockListings.js      # 22 realistic properties across the globe
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm** / **yarn**

### 2. Installation
Navigate into the project directory:
```bash
cd stayFinder
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5174` (or the port specified by Vite).

### 4. Build for Production
```bash
npm run build
```
Creates an optimized static bundle in the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```

---

## 🔌 API & Backend Extensibility

The service layer (`src/services/listingService.js` and `src/services/api.js`) is constructed to emulate a real RESTful API. To connect a live Express, Nest.js, or Django backend in the future:
1. Update `src/services/api.js` to point `fetch()` or `axios` to your live API base URL (e.g. `http://localhost:5000/api`).
2. The UI components remain completely untouched because they consume the unified `listingService` abstraction.

