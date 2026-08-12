import cron from 'node-cron';
import { runInactivitySweep, INACTIVITY_THRESHOLD_DAYS } from './membershipStatus.js';

// Runs once a day at 01:00 server time. Members who haven't checked in for
// INACTIVITY_THRESHOLD_DAYS days get marked inactive and their plan's
// expiry clock is paused until they attend again (or an admin reactivates
// them manually).
export function startInactivityCron() {
    cron.schedule('0 1 * * *', async () => {
        try {
            const result = await runInactivitySweep();
            console.log(
                `[inactivity-cron] checked ${result.checked} member(s), ` +
                `paused ${result.paused} for missing ${INACTIVITY_THRESHOLD_DAYS}+ days`
            );
        } catch (error) {
            console.error('[inactivity-cron] sweep failed:', error);
        }
    });

    console.log(
        `✅ Inactivity cron scheduled (threshold: ${INACTIVITY_THRESHOLD_DAYS} day(s), daily at 01:00)`
    );
}