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
 * Calculate check-out time and date.
 * Check-out time = check-in time - 1 hour (i.e. 23 hrs after check-in on final night).
 * Check-out DATE uses the actual checkOut date if provided, otherwise next day.
 *
 * @param {string|Date} checkInDate  - Check-in date (ISO string or Date)
 * @param {string}      checkInTime  - Time in "HH:mm" format (e.g. "12:00")
 * @param {string|Date} [checkOutDate] - Actual check-out date (ISO string or Date). If given, used as check-out date.
 * @returns {{ checkOutTime: string, checkOutDate: Date, checkOutTime12: string }}
 */
const calculateCheckOutTime = (checkInDate, checkInTime, checkOutDate) => {
    const [hours, minutes] = (checkInTime || '12:00').split(':');
    let h = parseInt(hours);
    let m = parseInt(minutes);

    // Check-out time is 1 hour before check-in time (23-hr stay per night)
    let outH = h - 1;
    if (outH < 0) outH = 23;

    const outTimeStr = `${String(outH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

    // Determine check-out date
    let outDate;
    if (checkOutDate) {
        outDate = new Date(checkOutDate);
    } else {
        outDate = new Date(checkInDate);
        outDate.setDate(outDate.getDate() + 1);
    }

    return {
        checkOutTime: outTimeStr,         // "HH:mm" 24h format
        checkOutTime12: formatTo12Hour(outTimeStr), // "H:mm AM/PM"
        checkOutDate: outDate             // Date object
    };
};

module.exports = { formatTo12Hour, calculateCheckOutTime };
