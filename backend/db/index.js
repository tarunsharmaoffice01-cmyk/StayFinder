import supabase from '../lib/supabase.js';

const toDatabaseRow = (row) =>
  Object.fromEntries(
    Object.entries(row)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [
        key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`),
        value
      ])
  );

const fromDatabaseRow = (row) => {
  if (!row) return row;

  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
      value
    ])
  );
};

const fromDatabaseRows = (rows) => rows?.map(fromDatabaseRow) ?? rows;

export async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, phone, avatar, role, member_since, location, created_at');
  return { data: fromDatabaseRows(data), error };
}

export async function getUserById(id) {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, phone, avatar, role, member_since, location, created_at')
    .eq('id', id)
    .maybeSingle();

  return { data: fromDatabaseRow(data), error };
}

export async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.trim().toLowerCase())
    .maybeSingle();

  return { data: fromDatabaseRow(data), error };
}

export async function createUser(user) {
  const { data, error } = await supabase
    .from('users')
    .insert(toDatabaseRow(user))
    .select('id, name, email, phone, avatar, role, member_since, location, created_at')
    .single();

  return { data: fromDatabaseRow(data), error };
}

export async function updateUser(id, changes) {
  const { data, error } = await supabase
    .from('users')
    .update(toDatabaseRow(changes))
    .eq('id', id)
    .select('id, name, email, phone, avatar, role, member_since, location, created_at')
    .maybeSingle();

  return { data: fromDatabaseRow(data), error };
}

export async function getProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  return { data: fromDatabaseRows(data), error };
}

export async function getPropertyById(id) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  return { data: fromDatabaseRow(data), error };
}

export async function getPropertiesByHost(userId) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('host_user_id', userId)
    .order('created_at', { ascending: false });

  return { data: fromDatabaseRows(data), error };
}

export async function createProperty(property) {
  const { imageUrl, ...propertyData } = property;
  const { data, error } = await supabase
    .from('properties')
    .insert(toDatabaseRow({
      ...propertyData,
      images: propertyData.images?.length
        ? propertyData.images
        : imageUrl
          ? [imageUrl]
          : []
    }))
    .select('*')
    .single();

  return { data: fromDatabaseRow(data), error };
}

export async function updateProperty(id, changes) {
  const { data, error } = await supabase
    .from('properties')
    .update(toDatabaseRow(changes))
    .eq('id', id)
    .select('*')
    .maybeSingle();

  return { data: fromDatabaseRow(data), error };
}

export async function deleteProperty(id) {
  const { data, error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)
    .select('*');

  return { data: fromDatabaseRows(data), error };
}

export async function getBookings() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  return { data: fromDatabaseRows(data), error };
}

export async function getBookingsByUser(userId, userEmail) {
  if (!userId && !userEmail) return getBookings();

  const queries = [];
  if (userId) {
    queries.push(
      supabase.from('bookings').select('*').eq('user_id', userId)
    );
  }
  if (userEmail) {
    queries.push(
      supabase
        .from('bookings')
        .select('*')
        .ilike('guest_email', userEmail.trim())
    );
  }

  const results = await Promise.all(queries);
  const error = results.find((result) => result.error)?.error;
  if (error) return { data: null, error };

  const uniqueBookings = new Map();
  for (const result of results) {
    for (const booking of result.data) {
      uniqueBookings.set(booking.id, booking);
    }
  }

  const data = [...uniqueBookings.values()]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return { data: fromDatabaseRows(data), error: null };
}

export async function getBookingById(id) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  return { data: fromDatabaseRow(data), error };
}

export async function createBooking(booking) {
  const { data, error } = await supabase
    .from('bookings')
    .insert(toDatabaseRow(booking))
    .select('*')
    .single();

  return { data: fromDatabaseRow(data), error };
}

export async function updateBooking(id, changes) {
  const { data, error } = await supabase
    .from('bookings')
    .update(toDatabaseRow(changes))
    .eq('id', id)
    .select('*')
    .maybeSingle();

  return { data: fromDatabaseRow(data), error };
}

export async function getReviewsByProperty(propertyId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('property_id', propertyId)
    .order('created_at', { ascending: false });

  return { data: fromDatabaseRows(data), error };
}

export async function createReview(review) {
  const { data, error } = await supabase
    .from('reviews')
    .insert(toDatabaseRow(review))
    .select('*')
    .single();

  return { data: fromDatabaseRow(data), error };
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('id');
  return { data, error };
}

export async function getDestinations() {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .order('name');

  return { data: fromDatabaseRows(data), error };
}

export async function getWishlistByUser(userId) {
  const { data, error } = await supabase
    .from('wishlist_items')
    .select('user_id, property_id, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data: fromDatabaseRows(data), error };
}

export async function addWishlistItem(userId, propertyId) {
  const { data, error } = await supabase
    .from('wishlist_items')
    .upsert(
      { user_id: userId, property_id: propertyId },
      { onConflict: 'user_id,property_id' }
    )
    .select('*')
    .single();

  return { data: fromDatabaseRow(data), error };
}

export async function deleteWishlistItem(userId, propertyId) {
  const { data, error } = await supabase
    .from('wishlist_items')
    .delete()
    .eq('user_id', userId)
    .eq('property_id', propertyId)
    .select('*');

  return { data: fromDatabaseRows(data), error };
}
