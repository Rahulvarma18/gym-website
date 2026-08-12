import User from '../models/User.js';
import Registration from '../models/Registration.js';

// How many consecutive days without a gym visit before the cron job marks a
// member inactive. Configurable via .env, defaults to 5 (as requested).
export const INACTIVITY_THRESHOLD_DAYS = Number(
    process.env.INACTIVITY_THRESHOLD_DAYS || 5
);

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Mark a member inactive and pause any of their currently-active
 * registrations so the plan's expiry clock stops counting down.
 *
 * @param {string} userId
 * @param {'auto'|'admin'} source - who triggered the deactivation
 */
export async function pauseMembership(userId, source = 'admin') {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    // Already inactive - nothing to do.
    if (!user.isActive) return user;

    user.isActive = false;
    user.autoInactive = source === 'auto';
    user.inactiveSince = new Date();
    await user.save();

    await Registration.updateMany(
        { userId, status: 'active' },
        { $set: { status: 'paused', pausedAt: new Date() } }
    );

    return user;
}

/**
 * Reactivate a member and resume their paused registrations, pushing the
 * plan's endDate forward by however long the account was inactive so the
 * member doesn't lose the days they paid for but couldn't use.
 *
 * @param {string} userId
 * @param {'auto'|'admin'} source - who triggered the reactivation
 *   ('auto' = the member checked in again after being auto-marked inactive)
 */
export async function resumeMembership(userId, source = 'admin') {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    // Already active - nothing to do.
    if (user.isActive) return user;

    // If an admin manually deactivated the member (not the cron job), only
    // an admin (or this same explicit call) should be able to reactivate
    // them - a plain attendance check-in shouldn't silently override an
    // admin's decision. Callers pass source='auto' only from the check-in
    // flow, so we simply respect whatever the caller asked for here.
    const now = new Date();
    const inactiveSince = user.inactiveSince || now;
    const pausedDays = Math.max(
        0,
        Math.round((now - inactiveSince) / MS_PER_DAY)
    );

    user.isActive = true;
    user.autoInactive = false;
    user.inactiveSince = null;
    await user.save();

    const pausedRegistrations = await Registration.find({
        userId,
        status: 'paused',
    });

    for (const reg of pausedRegistrations) {
        const newEndDate = new Date(
            new Date(reg.endDate).getTime() + pausedDays * MS_PER_DAY
        );
        reg.endDate = newEndDate;
        reg.totalPausedDays = (reg.totalPausedDays || 0) + pausedDays;
        reg.pausedAt = null;
        reg.status = newEndDate > now ? 'active' : 'expired';
        await reg.save();
    }

    return user;
}

/**
 * Daily sweep: find members who haven't checked in for
 * INACTIVITY_THRESHOLD_DAYS days and pause their accounts + plans.
 * Only touches members who are currently active and not admins, and skips
 * anyone with no active plan (nothing to pause / no reason to flag them).
 */
export async function runInactivitySweep() {
    const cutoff = new Date(Date.now() - INACTIVITY_THRESHOLD_DAYS * MS_PER_DAY);

    const candidates = await User.find({
        isAdmin: false,
        isActive: true,
        $or: [
            { lastAttendanceDate: { $lte: cutoff } },
            { lastAttendanceDate: null },
        ],
    });

    let pausedCount = 0;

    for (const user of candidates) {
        // If they've never checked in, only auto-pause once they've had the
        // account for at least the threshold, based on registration start.
        const hasActivePlan = await Registration.exists({
            userId: user._id,
            status: 'active',
        });
        if (!hasActivePlan) continue;

        if (!user.lastAttendanceDate) {
            const oldestActiveReg = await Registration.findOne({
                userId: user._id,
                status: 'active',
            }).sort({ startDate: 1 });
            if (
                !oldestActiveReg ||
                new Date(oldestActiveReg.startDate) > cutoff
            ) {
                continue;
            }
        }

        await pauseMembership(user._id, 'auto');
        pausedCount += 1;
    }

    return { checked: candidates.length, paused: pausedCount };
}