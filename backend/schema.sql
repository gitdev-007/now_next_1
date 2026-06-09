-- Enable UUID generation extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================================
-- TABLES DEFINITIONS
-- ========================================================

-- Users Table (Stores credentials securely mapped to Supabase authentication models or independent registrations)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Profiles Table (Stores user meta-information)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Hotels Reference Table
CREATE TABLE IF NOT EXISTS hotels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    stars INTEGER CHECK (stars BETWEEN 1 AND 5),
    rating NUMERIC(2, 1) CHECK (rating BETWEEN 0.0 AND 5.0),
    reviews INTEGER DEFAULT 0,
    distance_km NUMERIC(4, 2) NOT NULL,
    base_price_inr NUMERIC(10, 2) NOT NULL,
    amenities VARCHAR(100)[] NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    description TEXT
);

-- Restaurants Reference Table
CREATE TABLE IF NOT EXISTS restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cuisine VARCHAR(100) NOT NULL,
    rating NUMERIC(2, 1) CHECK (rating BETWEEN 0.0 AND 5.0),
    reviews INTEGER DEFAULT 0,
    distance_km NUMERIC(4, 2) NOT NULL,
    avg_cost_for_two_inr NUMERIC(10, 2) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    description TEXT
);

-- Spa & Wellness Reference Table
CREATE TABLE IF NOT EXISTS spa_services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    rating NUMERIC(2, 1) CHECK (rating BETWEEN 0.0 AND 5.0),
    duration_hours NUMERIC(3, 1) NOT NULL,
    price_inr NUMERIC(10, 2) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    description TEXT
);

-- Gaming & Entertainment Reference Table
CREATE TABLE IF NOT EXISTS gaming_services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    rating NUMERIC(2, 1) CHECK (rating BETWEEN 0.0 AND 5.0),
    duration_hours NUMERIC(3, 1) NOT NULL,
    price_inr NUMERIC(10, 2) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    description TEXT
);

-- Tours & Sightseeing Reference Table
CREATE TABLE IF NOT EXISTS tours (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    rating NUMERIC(2, 1) CHECK (rating BETWEEN 0.0 AND 5.0),
    duration_hours NUMERIC(3, 1) NOT NULL,
    price_per_guest_inr NUMERIC(10, 2) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    description TEXT
);

-- Cab Transfers Reference Table
CREATE TABLE IF NOT EXISTS transfers (
    id SERIAL PRIMARY KEY,
    vehicle_type VARCHAR(100) NOT NULL, -- 'sedan', 'suv', 'luxury'
    capacity INTEGER NOT NULL,
    base_price_inr NUMERIC(10, 2) NOT NULL,
    wait_buffer_mins INTEGER DEFAULT 45 NOT NULL,
    description TEXT
);

-- Saved Itineraries Table (Stores dynamic plans mapped to users)
CREATE TABLE IF NOT EXISTS saved_itineraries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    arrival_time TIMESTAMPTZ NOT NULL,
    departure_time TIMESTAMPTZ NOT NULL,
    location VARCHAR(255) NOT NULL,
    travelers INTEGER DEFAULT 1 NOT NULL,
    itinerary_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Bookings Table (Stores checkout transactions)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_reference VARCHAR(100) UNIQUE NOT NULL,
    item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('hotel', 'restaurant', 'spa', 'gaming', 'tour', 'transfer')),
    item_id INTEGER NOT NULL,
    booking_details JSONB NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Password Resets Table
CREATE TABLE IF NOT EXISTS password_resets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ========================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_saved_itineraries_user ON saved_itineraries(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_ref ON bookings(booking_reference);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

-- Enable Row Level Security on user-owned tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Enable RLS on reference lists (read-only for public, restricted for updates)
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE spa_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can read own record" ON users 
    FOR SELECT USING (auth.uid() = id);

-- Profiles table policies
CREATE POLICY "Profiles are readable by owner" ON profiles 
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Profiles are updatable by owner" ON profiles 
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Profiles can be inserted by owner" ON profiles 
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Saved Itineraries policies
CREATE POLICY "Users can manage own itineraries" ON saved_itineraries 
    FOR ALL USING (auth.uid() = user_id);

-- Bookings policies
CREATE POLICY "Users can view own bookings" ON bookings 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bookings" ON bookings 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read access policies for reference tables
CREATE POLICY "Allow public read access to hotels" ON hotels FOR SELECT USING (true);
CREATE POLICY "Allow public read access to restaurants" ON restaurants FOR SELECT USING (true);
CREATE POLICY "Allow public read access to spa_services" ON spa_services FOR SELECT USING (true);
CREATE POLICY "Allow public read access to gaming_services" ON gaming_services FOR SELECT USING (true);
CREATE POLICY "Allow public read access to tours" ON tours FOR SELECT USING (true);
CREATE POLICY "Allow public read access to transfers" ON transfers FOR SELECT USING (true);

-- ========================================================
-- LOOKUP DATA POPULATION
-- ========================================================

-- Populate Hotels
INSERT INTO hotels (name, stars, rating, reviews, distance_km, base_price_inr, amenities, image_url, description) VALUES
('Niranta Airport Transit Hotel & Lounge', 5, 4.8, 2400, 0.00, 3499.00, ARRAY['24/7 Check-in', 'Free WiFi', 'Shower Room', 'Massage Spa'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop', 'Located directly inside Terminal 2 Arrivals area. No transit visa required. Express spa, restaurant, clean sleeping pods, and shower suites.'),
('JW Marriott Mumbai Sahar', 5, 4.7, 1800, 1.20, 5499.00, ARRAY['24/7 Check-in', 'Free Airport Shuttle', 'Swimming Pool', 'Spa & Gym'], 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop', 'Five-star luxury oasis next to T2. Features premium suites, resort pool, luxury wellness treatments, and complimentary terminal dropoffs.'),
('Ibis Mumbai Airport', 3, 4.2, 1100, 0.80, 2200.00, ARRAY['24/7 Check-in', 'Free WiFi', 'Airport Shuttle', 'Breakfast Buffet'], 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop', 'Ergonomic budget rooms situated next to the domestic terminal. Soundproof windows, all-day check-in, and convenient working desks.'),
('The Orchid Hotel Mumbai Vile Parle', 4, 4.6, 1500, 2.10, 4500.00, ARRAY['24/7 Check-in', 'Free Airport Shuttle', 'Rooftop Pool', 'Green Certified'], 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop', 'Asia''s first certified five-star ecofriendly hotel. Runway-view pool, spa, airport transportations, and delicious multiple dining options.')
ON CONFLICT DO NOTHING;

-- Populate Restaurants
INSERT INTO restaurants (name, cuisine, rating, reviews, distance_km, avg_cost_for_two_inr, image_url, description) VALUES
('Gajalee Coastal Seafood Restaurant', 'seafood', 4.8, 940, 3.50, 1800.00, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop', 'Legendary seafood destination famous for butter garlic pepper crabs, bombil fry, stuffed pomfret, and local sol kadhi drink.'),
('Peshawri - ITC Maratha', 'fine-dining', 4.9, 1240, 1.10, 4500.00, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop', 'Ultra luxury traditional Northwest Frontier clay-oven diner. World-famous Dal Bukhara, paneer tikka, and slow cooked lamb.'),
('Highway Gomantak', 'local', 4.5, 560, 2.20, 800.00, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop', 'An unpretentious local icon serving Konkan seafood thalis, sol kadhi, and crispy bombay duck fry.'),
('Elco Pani Puri Center', 'street-food', 4.4, 1890, 4.20, 400.00, 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&h=400&fit=crop', 'High-hygiene local street food. Purified mineral water golgappe, pav bhaji, ragda pattice, and fresh fruit juices.')
ON CONFLICT DO NOTHING;

-- Populate Spas
INSERT INTO spa_services (name, category, rating, duration_hours, price_inr, image_url, description) VALUES
('Heavenly Spa by Westin', 'massage', 4.9, 1.5, 4500.00, 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop', 'Full-body Swedish massage, steam room access, and luxury aromatherapy in a tranquil airport-adjacent setting.'),
('O2 Spa - Terminal 2', 'express', 4.7, 0.5, 1800.00, 'https://images.unsplash.com/photo-1611077544192-332e67500366?w=600&h=400&fit=crop', 'Convenient express foot reflexology and head-neck-shoulder massage located right at the T2 arrivals lounge.'),
('Six Senses Wellness Circuit', 'full-day', 4.8, 3.0, 8500.00, 'https://images.unsplash.com/photo-1540555700478-4be289fbece8?w=600&h=400&fit=crop', 'Holistic wellness journey including detox juices, meditation session, deep tissue massage, and facial treatment.')
ON CONFLICT DO NOTHING;

-- Populate Gaming
INSERT INTO gaming_services (name, category, rating, duration_hours, price_inr, image_url, description) VALUES
('Smaaash Entertainment Hub', 'gaming', 4.6, 2.0, 1200.00, 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop', 'Virtual reality games, bowling, cricket simulators, and arcade fun. Perfect for high-energy transit breaks.'),
('PVR Directors Cut Luxury Cinema', 'movie', 4.9, 3.0, 2500.00, 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=400&fit=crop', 'Ultra-premium movie watching with recliner seats, butler service, and fine dining at the airport mall.'),
('The Game Palacio - Casino Style Arcade', 'gaming', 4.7, 2.5, 1800.00, 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=600&h=400&fit=crop', 'Boutique bowling, high-end retro arcade games, and mechanical bull rides with a premium lounge bar.')
ON CONFLICT DO NOTHING;

-- Populate Tours
INSERT INTO tours (name, category, rating, duration_hours, price_per_guest_inr, image_url, description) VALUES
('South Mumbai Gateway Heritage Tour', 'sightseeing', 4.9, 5.0, 2899.00, 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600&h=400&fit=crop', 'AC private vehicle tour visiting the Gateway of India, Queen''s Necklace, Taj Mahal Palace, and Victoria Terminus.'),
('Guided Bandra Street Food Trail', 'food', 4.8, 3.0, 1299.00, 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop', 'Hygienic culinary walk through Bandra West. Sample local snacks, sweet rolls, seekh kebabs, and vada pav.'),
('Elephanta Caves Fast-Track Excursion', 'culture', 4.7, 4.0, 1999.00, 'https://images.unsplash.com/photo-1598977123418-45f04b616a0e?w=600&h=400&fit=crop', 'Ferry tickets and professional guides to explore the historic rock-cut cave temples on Elephanta Island.'),
('Bazaar & Boutique Shopping Expedition', 'shopping', 4.6, 3.5, 1500.00, 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop', 'Accompanied market tour to buy Indian cottons, silks, spices, and souvenirs with secure baggage drop back in cab.')
ON CONFLICT DO NOTHING;

-- Populate Cabs
INSERT INTO transfers (vehicle_type, capacity, base_price_inr, wait_buffer_mins, description) VALUES
('sedan', 4, 899.00, 45, 'Compact Sedan (Toyota Etios or similar). Ideal for 1-3 passengers with standard luggage. AC, GPS tracking, and verified hygiene.'),
('suv', 6, 1499.00, 45, 'Premium SUV (Toyota Innova Crysta). Extra room, premium comfort, great for families. AC, high luggage capacity.'),
('luxury', 4, 3499.00, 45, 'Luxury Executive (Mercedes C-Class or Audi A4). Chauffeur-driven luxury class vehicle, leather seats, airport exit gate placard meet service.')
ON CONFLICT DO NOTHING;
