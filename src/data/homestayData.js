// Mock property and inventory data for Sunrise Homestay, Coorg

export const property = {
  id: "sunrise-homestay-coorg",
  name: "Sunrise Homestay",
  location: "Coorg, Karnataka",
  tagline: "Wake up to misty mornings amidst coffee plantations",
  description:
    "A serene homestay nestled in the lush hills of Coorg. Experience authentic Kodava hospitality with modern comforts. Surrounded by coffee and pepper estates, our property offers breathtaking views and a peaceful retreat from city life.",
  contact: "+91 94482 10345",
  email: "hello@sunrisehomestay.com",
  checkIn: "12:00 PM",
  checkOut: "11:00 AM",
  rating: 4.8,
  reviewCount: 124,
  pricePerNight: 3500,
  coverImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80",
  amenities: [
    "Free Wi-Fi",
    "Home-cooked meals",
    "Coffee Estate Tour",
    "Bonfire",
    "Parking",
    "Hot Water",
    "Nature Trails",
    "Bird Watching",
  ],
};

export const rooms = [
  {
    id: "room-001",
    name: "Misty Valley Suite",
    type: "Suite",
    capacity: 2,
    pricePerNight: 4500,
    status: "available",
    amenities: ["King Bed", "Private Balcony", "Valley View", "AC", "En-suite Bath"],
    description: "A luxurious suite with panoramic valley views and a private balcony.",
  },
  {
    id: "room-002",
    name: "Coffee Garden Room",
    type: "Deluxe",
    capacity: 2,
    pricePerNight: 3500,
    status: "occupied",
    amenities: ["Queen Bed", "Garden View", "AC", "En-suite Bath"],
    description: "Overlooking the coffee estate, this deluxe room is perfect for couples.",
  },
  {
    id: "room-003",
    name: "Plantation Cottage",
    type: "Cottage",
    capacity: 4,
    pricePerNight: 6000,
    status: "available",
    amenities: ["2 Bedrooms", "Living Area", "Kitchen", "Private Garden", "No AC"],
    description: "A standalone cottage ideal for families, with a private garden.",
  },
  {
    id: "room-004",
    name: "Forest Nest Room",
    type: "Standard",
    capacity: 2,
    pricePerNight: 2800,
    status: "maintenance",
    amenities: ["Double Bed", "Forest View", "Fan", "Shared Bath"],
    description: "A cozy standard room with a forest outlook, great for budget travelers.",
  },
  {
    id: "room-005",
    name: "Sunrise Dormitory",
    type: "Dormitory",
    capacity: 6,
    pricePerNight: 900,
    status: "available",
    amenities: ["6 Bunk Beds", "Shared Bath", "Lockers", "Fan"],
    description: "Affordable dormitory beds for solo travelers and backpackers.",
  },
];

export const inventoryItems = [
  // Bedding
  { id: "inv-001", category: "Bedding", name: "Bed Sheets (King)", quantity: 6, minRequired: 4, unit: "sets", roomId: "room-001" },
  { id: "inv-002", category: "Bedding", name: "Pillow Covers", quantity: 12, minRequired: 8, unit: "pcs", roomId: "room-001" },
  { id: "inv-003", category: "Bedding", name: "Blankets", quantity: 3, minRequired: 4, unit: "pcs", roomId: "room-001" },
  { id: "inv-004", category: "Bedding", name: "Bed Sheets (Queen)", quantity: 5, minRequired: 4, unit: "sets", roomId: "room-002" },
  { id: "inv-005", category: "Bedding", name: "Pillows", quantity: 8, minRequired: 6, unit: "pcs", roomId: "room-002" },
  // Toiletries
  { id: "inv-006", category: "Toiletries", name: "Shampoo Sachets", quantity: 24, minRequired: 20, unit: "pcs", roomId: null },
  { id: "inv-007", category: "Toiletries", name: "Soap Bars", quantity: 15, minRequired: 20, unit: "pcs", roomId: null },
  { id: "inv-008", category: "Toiletries", name: "Toothbrush Kits", quantity: 8, minRequired: 10, unit: "pcs", roomId: null },
  { id: "inv-009", category: "Toiletries", name: "Towels (Bath)", quantity: 10, minRequired: 12, unit: "pcs", roomId: null },
  { id: "inv-010", category: "Toiletries", name: "Towels (Hand)", quantity: 14, minRequired: 12, unit: "pcs", roomId: null },
  // Kitchen
  { id: "inv-011", category: "Kitchen", name: "Dinner Plates", quantity: 20, minRequired: 16, unit: "pcs", roomId: null },
  { id: "inv-012", category: "Kitchen", name: "Drinking Glasses", quantity: 18, minRequired: 16, unit: "pcs", roomId: null },
  { id: "inv-013", category: "Kitchen", name: "Coffee Mugs", quantity: 12, minRequired: 10, unit: "pcs", roomId: null },
  { id: "inv-014", category: "Kitchen", name: "Cooking Gas (kg)", quantity: 4, minRequired: 6, unit: "kg", roomId: null },
  { id: "inv-015", category: "Kitchen", name: "Rice (kg)", quantity: 15, minRequired: 10, unit: "kg", roomId: null },
  // Maintenance
  { id: "inv-016", category: "Maintenance", name: "Light Bulbs", quantity: 5, minRequired: 6, unit: "pcs", roomId: null },
  { id: "inv-017", category: "Maintenance", name: "Broom Sets", quantity: 4, minRequired: 3, unit: "pcs", roomId: null },
  { id: "inv-018", category: "Maintenance", name: "Cleaning Liquid (L)", quantity: 3, minRequired: 4, unit: "L", roomId: null },
  // Guest Supplies
  { id: "inv-019", category: "Guest Supplies", name: "Welcome Kits", quantity: 6, minRequired: 5, unit: "pcs", roomId: null },
  { id: "inv-020", category: "Guest Supplies", name: "Mineral Water Bottles", quantity: 24, minRequired: 20, unit: "pcs", roomId: null },
];

export const ownerCredentials = {
  email: "owner@sunrisehomestay.com",
  password: "homestay123",
};

export const categories = [...new Set(inventoryItems.map((i) => i.category))];
