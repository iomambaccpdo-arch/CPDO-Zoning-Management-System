export const PHILIPPINE_HOLIDAYS = [
  "01-01", // New Year's Day
  "04-09", // Araw ng Kagitingan
  "05-01", // Labor Day
  "06-12", // Independence Day
  "08-21", // Ninoy Aquino Day
  "08-26", // National Heroes Day (Last Monday of August, approximating 26th for fixed dates if needed, but standard PH holiday lists might require specific year maps for moving holidays. We use fixed ones here.)
  "11-01", // All Saints' Day
  "11-02", // All Souls' Day
  "11-30", // Bonifacio Day
  "12-08", // Feast of the Immaculate Conception
  "12-24", // Christmas Eve
  "12-25", // Christmas Day
  "12-30", // Rizal Day
  "12-31", // Last Day of the Year
];

// Note: Holy Week (Maundy Thursday, Good Friday) are moving holidays and difficult to hardcode precisely without a year map.
// For a production app, an API for holidays or a year-based config is recommended.

/**
 * Calculates a due date by adding a given number of working days to a start date.
 * Excludes Saturdays, Sundays, and fixed Philippine holidays.
 *
 * @param startDate The date to start counting from.
 * @param workingDaysToAdd Number of working days to add (e.g., 12).
 * @returns The calculated due date.
 */
export function calculateDueDate(
  startDate: Date,
  workingDaysToAdd: number,
): Date {
  const currentDate = new Date(startDate);
  let addedDays = 0;

  // Normalize start date to midnight to avoid time traversal edge cases
  currentDate.setHours(0, 0, 0, 0);

  while (addedDays < workingDaysToAdd) {
    currentDate.setDate(currentDate.getDate() + 1);

    const dayOfWeek = currentDate.getDay();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const monthDay = `${month}-${day}`;

    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday
    const isHoliday = PHILIPPINE_HOLIDAYS.includes(monthDay);

    if (!isWeekend && !isHoliday) {
      addedDays++;
    }
  }

  return currentDate;
}
