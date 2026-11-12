import { MOCK_LISTINGS, PROPERTY_CATEGORIES, POPULAR_DESTINATIONS } from './initialListings.js';
import { INITIAL_USERS } from './initialUsers.js';
import { INITIAL_BOOKINGS } from './initialBookings.js';
import { INITIAL_REVIEWS } from './initialReviews.js';

class MemoryStore {
  constructor() {
    this.reset();
  }

  reset() {
    // Deep clone initial data
    this.users = JSON.parse(JSON.stringify(INITIAL_USERS));
    this.listings = JSON.parse(JSON.stringify(MOCK_LISTINGS)).map((item, index) => ({
      ...item,
      // Associate first 2 listings with demo host Alex Rivera
      hostUserId: index < 2 ? 'usr-student-01' : `host-seed-${index + 1}`
    }));
    this.bookings = JSON.parse(JSON.stringify(INITIAL_BOOKINGS));
    this.reviews = JSON.parse(JSON.stringify(INITIAL_REVIEWS));
    this.categories = JSON.parse(JSON.stringify(PROPERTY_CATEGORIES));
    this.destinations = JSON.parse(JSON.stringify(POPULAR_DESTINATIONS));
  }

  // --- Users Operations ---
  findUserByEmail(email) {
    if (!email) return null;
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  findUserById(id) {
    return this.users.find(u => u.id === id) || null;
  }

  createUser(userData) {
    this.users.push(userData);
    return userData;
  }

  updateUser(id, updateData) {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    this.users[index] = { ...this.users[index], ...updateData };
    return this.users[index];
  }

  getAllUsers() {
    return this.users.map(({ password, ...safeUser }) => safeUser);
  }

  // --- Listings Operations ---
  getAllListings() {
    return [...this.listings];
  }

  findListingById(id) {
    return this.listings.find(l => l.id === id) || null;
  }

  createListing(listingData) {
    this.listings.unshift(listingData);
    return listingData;
  }

  updateListing(id, updateData) {
    const index = this.listings.findIndex(l => l.id === id);
    if (index === -1) return null;
    this.listings[index] = { ...this.listings[index], ...updateData };
    return this.listings[index];
  }

  deleteListing(id) {
    const index = this.listings.findIndex(l => l.id === id);
    if (index === -1) return false;
    this.listings.splice(index, 1);
    return true;
  }

  getListingsByHost(userId) {
    return this.listings.filter(l => l.hostUserId === userId);
  }

  // --- Bookings Operations ---
  getAllBookings() {
    return [...this.bookings];
  }

  findBookingById(id) {
    return this.bookings.find(b => b.id === id) || null;
  }

  createBooking(bookingData) {
    this.bookings.unshift(bookingData);
    return bookingData;
  }

  updateBooking(id, updateData) {
    const index = this.bookings.findIndex(b => b.id === id);
    if (index === -1) return null;
    this.bookings[index] = { ...this.bookings[index], ...updateData };
    return this.bookings[index];
  }

  deleteBooking(id) {
    const index = this.bookings.findIndex(b => b.id === id);
    if (index === -1) return false;
    this.bookings.splice(index, 1);
    return true;
  }

  getBookingsByUser(userId, email) {
    if (!userId && !email) {
      return [...this.bookings];
    }
    return this.bookings.filter(b => 
      (userId && b.userId === userId) || 
      (email && b.guestEmail?.toLowerCase() === email.toLowerCase())
    );
  }

  // --- Reviews Operations ---
  getReviewsByProperty(propertyId) {
    return this.reviews.filter(r => r.propertyId === propertyId);
  }

  addReview(reviewData) {
    this.reviews.unshift(reviewData);
    return reviewData;
  }

  // --- Metadata Operations ---
  getCategories() {
    return [...this.categories];
  }

  getDestinations() {
    return [...this.destinations];
  }
}

export const memoryStore = new MemoryStore();
export default memoryStore;
