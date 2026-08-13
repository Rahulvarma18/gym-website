import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Plan from '../models/Plan.js';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

// Sample plans data - the only plans shown on the public pricing page.
const samplePlans = [
    {
        name: 'Weekly',
        description: 'Try it out, no commitment.',
        duration: { value: 7, unit: 'days' },
        price: 399,
        discountPrice: null,
        features: ['Full gym access', 'Locker room', 'Free fitness assessment'],
        maxMembers: null,
        accessHours: '6 AM - 10 PM',
        color: '#3B82F6',
        badge: null,
        isActive: true,
    },
    {
        name: 'Monthly',
        description: 'Most people start here.',
        duration: { value: 1, unit: 'months' },
        price: 1499,
        discountPrice: null,
        features: [
            'Full gym access',
            'Locker room',
            'Free fitness assessment',
            '1 personal training session',
            'Group classes',
        ],
        maxMembers: null,
        accessHours: '24/7',
        color: '#F59E0B',
        badge: 'POPULAR',
        isActive: true,
    },
    {
        name: 'Yearly',
        description: 'Best value, biggest commitment.',
        duration: { value: 1, unit: 'years' },
        price: 12999,
        discountPrice: null,
        features: [
            'Full gym access',
            'Locker room',
            'Free fitness assessment',
            '4 personal training sessions',
            'Group classes',
            'Nutrition consultation',
        ],
        maxMembers: null,
        accessHours: '24/7',
        color: '#8B5CF6',
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