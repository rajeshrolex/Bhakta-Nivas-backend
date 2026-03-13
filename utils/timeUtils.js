/**
 * Format 24h time string to 12h format with AM/PM
 * @param {string} time24 - Time in "HH:mm" format
 * @returns {string} - Formatted time like "12:00 PM"
 */
const formatTo12Hour = (time24) => {
    if (!time24) return '12:00 PM';
    const [hours, minutes] = time24.split(':');
    let h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${minutes} ${ampm}`;
};

/**
 * Calculate check-out time (23 hours after check-in time)
 * @param {string} checkInDate - ISO date string (not used for calculation currently but helpful for future)
 * @param {string} checkInTime - Time in "HH:mm" format
 * @returns {string} - Formatted check-out time like "11:00 AM"
 */
const calculateCheckOutTime = (checkInDate, checkInTime) => {
    const [hours, minutes] = (checkInTime || '12:00').split(':');
    let h = parseInt(hours);
    let m = parseInt(minutes);

    // Subtract 1 hour to get 23 hours later (next day)
    let outH = h - 1;
    if (outH < 0) outH = 23;

    const outTimeStr = `${String(outH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    return formatTo12Hour(outTimeStr);
};

module.exports = { formatTo12Hour, calculateCheckOutTime };
