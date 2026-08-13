// One-time (safe to re-run) script that makes sure the three plans shown
// on the public pricing page actually exist as real Plan documents in
// MongoDB, so the admin panel's Plans & Pricing tab has something to edit.
//
// This does NOT overwrite a plan that already exists - if you've already
// registered someone for "Weekly"/"Monthly"/"Yearly" (which auto-creates
// the Plan document), or already edited prices from the admin panel, this
// script leaves that document untouched. It only fills in gaps.
//
// Run from the backend/ folder:
//   node scripts/seedPricingPlans.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Plan from '../models/Plan.js';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const defaults = [
    {
        name: 'Weekly',
        description: 'Try it out, no commitment.',
        price: 399,
        duration: { value: 7, unit: 'days' },
        features: ['Full gym access', 'Locker room', 'Free fitness assessment'],
    },
    {
        name: 'Monthly',
        description: 'Most people start here.',
        price: 1499,
        duration: { value: 1, unit: 'months' },
        badge: 'POPULAR',
        features: [
            'Full gym access',
            'Locker room',
            'Free fitness assessment',
            '1 personal training session',
            'Group classes',
        ],
    },
    {
        name: 'Yearly',
        description: 'Best value, biggest commitment.',
        price: 12999,
        duration: { value: 1, unit: 'years' },
        features: [
            'Full gym access',
            'Locker room',
            'Free fitness assessment',
            '4 personal training sessions',
            'Group classes',
            'Nutrition consultation',
        ],
    },
];

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const def of defaults) {
        const existing = await Plan.findOne({ name: def.name });
        if (existing) {
            console.log(`↷ Skipped "${def.name}" - already exists (price: ₹${existing.price})`);
            continue;
        }
        const created = await Plan.create(def);
        console.log(`✅ Created "${created.name}" - ₹${created.price}`);
    }

    await mongoose.disconnect();
    console.log('Done.');
}

run().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});