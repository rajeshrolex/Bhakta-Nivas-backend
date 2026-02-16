const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const { Lodge, Room, Booking, User } = require('./models');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding');
        await seed();
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    }
};

// Lodges data (same as before)
const lodgesData = [
    {
        name: "Bhakti Nivas",
        slug: "bhakti-nivas",
        images: [
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800"
        ],
        distance: "500m",
        distanceType: "walkable",
        rating: 4.3,
        reviewCount: 89,
        priceStarting: 500,
        availability: "limited",
        amenities: ["wifi", "parking", "hotWater", "restaurant"],
        address: "Main Road, Mantralayam",
        phone: "+91 9876543212",
        whatsapp: "+91 9876543212",
        description: "Budget-friendly accommodation with all essential amenities.",
        rooms: [
            { type: "Non-AC", name: "Basic Room", price: 500, maxOccupancy: 2, available: 2, amenities: ["hotWater"] },
            { type: "AC", name: "AC Room", price: 900, maxOccupancy: 2, available: 1, amenities: ["ac", "hotWater", "wifi", "tv"] }
        ]
    },
    {
        name: "Guru Krupa Lodge",
        slug: "guru-krupa-lodge",
        images: [
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
            "https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800",
            "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800"
        ],
        distance: "800m",
        distanceType: "walkable",
        rating: 4.2,
        reviewCount: 67,
        priceStarting: 450,
        availability: "available",
        amenities: ["parking", "hotWater", "powerBackup"],
        address: "Station Road, Mantralayam",
        phone: "+91 9876543213",
        whatsapp: "+91 9876543213",
        description: "Affordable accommodation suitable for budget travelers.",
        rooms: [
            { type: "Non-AC", name: "Standard Room", price: 450, maxOccupancy: 2, available: 10, amenities: ["hotWater"] },
            { type: "Non-AC", name: "Triple Sharing", price: 650, maxOccupancy: 3, available: 5, amenities: ["hotWater"] }
        ]
    },
    {
        name: "Divine Stay Suites",
        slug: "divine-stay-suites",
        images: [
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"
        ],
        distance: "1.2km",
        distanceType: "auto",
        rating: 4.6,
        reviewCount: 145,
        priceStarting: 1000,
        availability: "available",
        amenities: ["wifi", "parking", "hotWater", "lift", "ac", "powerBackup", "restaurant"],
        address: "Highway Road, Mantralayam",
        phone: "+91 9876543214",
        whatsapp: "+91 9876543214",
        description: "Premium accommodation with modern facilities.",
        rooms: [
            { type: "AC", name: "Superior AC Room", price: 1000, maxOccupancy: 2, available: 6, amenities: ["ac", "hotWater", "wifi", "tv", "minibar"] },
            { type: "Family", name: "Deluxe Family Suite", price: 2000, maxOccupancy: 5, available: 3, amenities: ["ac", "hotWater", "wifi", "tv", "minibar", "extraBed", "balcony"] },
            { type: "AC", name: "Executive Room", price: 1500, maxOccupancy: 2, available: 4, amenities: ["ac", "hotWater", "wifi", "tv", "minibar", "workDesk"] }
        ]
    },
    {
        name: "Sree Venkateswara Lodge",
        slug: "sree-venkateswara-lodge",
        images: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
            "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800",
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800"
        ],
        distance: "1.5km",
        distanceType: "auto",
        rating: 4.0,
        reviewCount: 52,
        priceStarting: 550,
        availability: "full",
        amenities: ["parking", "hotWater", "wifi"],
        address: "Bus Stand Road, Mantralayam",
        phone: "+91 9876543215",
        whatsapp: "+91 9876543215",
        description: "Well-maintained lodge with easy access to bus stand.",
        rooms: [
            { type: "Non-AC", name: "Standard Room", price: 550, maxOccupancy: 2, available: 0, amenities: ["hotWater", "wifi"] },
            { type: "AC", name: "AC Room", price: 950, maxOccupancy: 2, available: 0, amenities: ["ac", "hotWater", "wifi", "tv"] }
        ]
    }
];

async function seed() {
    try {
        console.log('Clearing existing data...');
        await Promise.all([
            Lodge.deleteMany({}),
            Room.deleteMany({}),
            Booking.deleteMany({}),
            User.deleteMany({})
        ]);
        console.log('Data cleared.');

        // Seed lodges and rooms
        console.log('Seeding lodges and rooms...');
        const seededLodges = [];

        for (const lodgeData of lodgesData) {
            const { rooms, ...lodgeFields } = lodgeData;

            // Create lodge
            const lodge = await Lodge.create(lodgeFields);
            seededLodges.push(lodge);

            // Create rooms for this lodge
            if (rooms && rooms.length > 0) {
                const roomsWithLodgeId = rooms.map(room => ({
                    ...room,
                    lodgeId: lodge._id
                }));
                await Room.insertMany(roomsWithLodgeId);
            }
        }
        console.log('Lodges seeded successfully');

        // Create users with proper lodge references
        console.log('Seeding users...');
        const users = [
            {
                name: "Super Admin",
                email: "super@admin.com",
                password: "password",
                role: "super_admin",
                lodgeId: null
            },
            {
                name: "Bhakti Manager",
                email: "bhakti@admin.com",
                password: "password",
                role: "admin",
                lodgeId: seededLodges[0]._id
            },
            {
                name: "Guru Krupa Manager",
                email: "gurukrupa@admin.com",
                password: "password",
                role: "admin",
                lodgeId: seededLodges[1]._id
            },
            {
                name: "Divine Stay Manager",
                email: "divine@admin.com",
                password: "password",
                role: "admin",
                lodgeId: seededLodges[2]._id
            },
            {
                name: "Venkateswara Manager",
                email: "venkateswara@admin.com",
                password: "password",
                role: "admin",
                lodgeId: seededLodges[3]._id
            }
        ];

        await User.insertMany(users);
        console.log('Users seeded successfully');

        // Create sample bookings
        console.log('Seeding bookings...');
        const sampleBookings = [];
        for (let i = 0; i < 10; i++) {
            const lodge = seededLodges[i % seededLodges.length];
            const rooms = await Room.find({ lodgeId: lodge._id });
            const room = rooms[0];

            sampleBookings.push({
                bookingId: `MLY${20240001 + i}`,
                lodgeId: lodge._id,
                lodgeName: lodge.name,
                roomType: room.type,
                roomName: room.name,
                roomPrice: room.price,
                checkIn: new Date(Date.now() + i * 86400000),
                checkOut: new Date(Date.now() + (i + 2) * 86400000),
                guests: 2,
                rooms: 1,
                customerName: `Guest ${i + 1}`,
                customerMobile: `+91 98765432${10 + i}`,
                customerEmail: `guest${i + 1}@example.com`,
                idType: 'aadhar',
                idNumber: `1234 5678 90${10 + i}`,
                paymentMethod: 'payAtLodge',
                totalAmount: room.price * 2,
                status: i % 3 === 0 ? 'confirmed' : i % 3 === 1 ? 'pending' : 'checked-in'
            });
        }
        await Booking.insertMany(sampleBookings);
        console.log('Bookings seeded successfully');

        console.log('\n✅ All data seeded successfully!');
        console.log('\n--- Login Credentials ---');
        console.log('Super Admin: super@admin.com / password');
        console.log('Lodge Admins: bhakti@admin.com, gurukrupa@admin.com, divine@admin.com, venkateswara@admin.com / password');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
}

connectDB();

