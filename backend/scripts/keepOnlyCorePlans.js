// Makes sure ONLY Weekly, Monthly, and Yearly show up on the public
// pricing page (and in the admin's Plans & Pricing tab, which reads the
// same data). Safe to re-run.
//
// This does a soft-delete (isActive: false) on any other plan, the same
// way the admin panel's "Delete" button does - it does NOT hard-delete
// anything, so old registrations that reference these plans are unaffected
// and you can always flip isActive back to true later if needed.
//
// Run from the backend/ folder:
//   node scripts/keepOnlyCorePlans.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Plan from '../models/Plan.js';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const KEEP = ['weekly', 'monthly', 'yearly'];

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const allPlans = await Plan.find({});
    let hidden = 0;

    for (const plan of allPlans) {
        const keep = KEEP.includes(plan.name.trim().toLowerCase());
        if (!keep && plan.isActive) {
            plan.isActive = false;
            await plan.save();
            console.log(`🚫 Hid "${plan.name}" from the pricing page`);
            hidden += 1;
        } else if (keep && !plan.isActive) {
            // In case one of the core 3 was previously deactivated by mistake.
            plan.isActive = true;
            await plan.save();
            console.log(`✅ Re-activated "${plan.name}"`);
        }
    }

    console.log(hidden === 0 ? 'Nothing to hide - already clean.' : `Hid ${hidden} plan(s).`);

    const remaining = await Plan.find({ isActive: true }).select('name price');
    console.log(
        'Plans now visible on the pricing page:',
        remaining.map((p) => `${p.name} (₹${p.price})`).join(', ') || 'none'
    );

    await mongoose.disconnect();
}

run().catch((err) => {
    console.error('Cleanup failed:', err);
    process.exit(1);
});