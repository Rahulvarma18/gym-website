import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Plan from '../models/Plan.js';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

// Sample plans data
const samplePlans = [
    {
        name: 'Basic Plan',
        description: 'Perfect for beginners. Access to basic gym equipment',
        duration: { value: 1, unit: 'months' },
        price: 1999,
        discountPrice: null,
        features: [
            'Gym Access',
            'Locker Access',
            'Basic Equipment',
            'Water Facility',
        ],
        maxMembers: null,
        accessHours: '6 AM - 10 PM',
        color: '#3B82F6',
        badge: null,
        isActive: true,
    },
    {
        name: 'Premium Plan',
        description: 'Our most popular plan. Includes personal trainer consultation',
        duration: { value: 3, unit: 'months' },
        price: 4999,
        discountPrice: 4499,
        features: [
            '24/7 Gym Access',
            'Personal Trainer (1 session/month)',
            'Locker Access',
            'All Equipment',
            'Water & Juice Bar',
            'Steam & Sauna',
            'Yoga Classes',
        ],
        maxMembers: null,
        accessHours: '24/7',
        color: '#F59E0B',
        badge: 'POPULAR',
        isActive: true,
    },
    {
        name: 'Elite Plan',
        description: 'Maximum benefits with unlimited trainer sessions',
        duration: { value: 6, unit: 'months' },
        price: 8999,
        discountPrice: 7999,
        features: [
            '24/7 Gym Access',
            'Unlimited Trainer Sessions',
            'Nutrition Consultation',
            'Premium Locker',
            'All Equipment',
            'Smoothie Bar',
            'Steam, Sauna & Pool',
            'All Classes',
            'Guest Passes (2)',
            'Recovery Room Access',
        ],
        maxMembers: null,
        accessHours: '24/7',
        color: '#8B5CF6',
        badge: 'BEST VALUE',
        isActive: true,
    },
    {
        name: 'Student Plan',
        description: 'Special discounted rate for students',
        duration: { value: 1, unit: 'months' },
        price: 999,
        discountPrice: null,
        features: [
            'Gym Access (Mon-Fri: 10 PM - 8 AM)',
            'Weekend Access (12 PM - 8 PM)',
            'Locker Access',
            'Basic Equipment',
        ],
        maxMembers: null,
        accessHours: 'Limited Hours',
        color: '#10B981',
        badge: null,
        isActive: true,
    },
    {
        name: 'Couple Plan',
        description: 'Perfect for couples who want to workout together',
        duration: { value: 3, unit: 'months' },
        price: 7999,
        discountPrice: 6999,
        features: [
            '24/7 Gym Access (Both members)',
            'Couple Trainer Sessions',
            'Matching Lockers',
            'All Equipment',
            'Steam & Sauna',
            'Group Classes',
        ],
        maxMembers: 2,
        accessHours: '24/7',
        color: '#EC4899',
        badge: null,
        isActive: true,
    },
];

// Sample admin user
const sampleAdmin = {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@jayramfitness.com',
    phone: '9999999999',
    password: 'Admin@123',
    isAdmin: true,
    isActive: true,
};

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        // Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Plan.deleteMany({});

        console.log('Creating admin user...');
        // Create admin user
        const admin = new User(sampleAdmin);
        await admin.save();
        console.log(`✅ Admin user created: ${admin.email}`);

        console.log('Creating sample plans...');
        // Create sample plans
        for (const planData of samplePlans) {
            const plan = new Plan({
                ...planData,
                createdBy: admin._id,
            });
            await plan.save();
            console.log(`✅ Plan created: ${plan.name}`);
        }

        console.log('\n✨ Database seeding completed successfully!');
        console.log(`\nAdmin Credentials:`);
        console.log(`Email: ${sampleAdmin.email}`);
        console.log(`Password: ${sampleAdmin.password}`);
        console.log(`\n${samplePlans.length} plans have been created.`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();