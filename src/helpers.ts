enum Timeline {
  today = "today",
  _7d = "7d",
  _1m = "1m",
  _3m = "3m",
  _6m = "6m",
  _1y = "1y",
  all = "all",
}
export class Helpers {
  /**
   * Generates a random OTP (One-Time Password)
   * @param options Configuration options for OTP generation
   * @returns Generated OTP string
   */
  static generateOTP({
    length = 6,
    options = {
      numbers: true,
      uppercase: false,
      lowercase: false,
    },
  }: {
    length?: number;
    options?: {
      numbers?: boolean;
      uppercase?: boolean;
      lowercase?: boolean;
    };
  }): string {
    const { numbers, uppercase, lowercase } = options;

    let characters = "";
    if (numbers) characters += "0123456789";
    if (uppercase) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) characters += "abcdefghijklmnopqrstuvwxyz";

    if (!characters) {
      throw new Error("At least one character type must be enabled.");
    }

    let otp = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      otp += characters[randomIndex];
    }

    return otp;
  }

  /**
   * Generates a future timestamp based on the given number of seconds
   * @param seconds Number of seconds to add to current time
   * @returns Future Date object
   */
  static getFutureTimestamp({ seconds }: { seconds: number }): Date {
    const now = new Date();
    return new Date(now.getTime() + seconds * 1000);
  }

  /**
   * Generates a unique value with a prefix
   * @param value Base value to generate unique identifier from
   * @returns Unique string with prefix
   */
  static generateUniqueValue(value: string): string {
    const prefix = value.slice(0, 3).toUpperCase();
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}-${timestamp}-${random}`;
  }

  /**
   * Validates an email address format
   * @param email Email address to validate
   * @returns boolean indicating if email is valid
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Formats a phone number to a standard format
   * @param phone Phone number to format
   * @returns Formatted phone number
   */
  static formatPhoneNumber(phone: string): string {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, "");

    // Format based on length
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    } else if (cleaned.length === 11 && cleaned.startsWith("1")) {
      return `+${cleaned}`;
    }
    return `+${cleaned}`;
  }

  /**
   * Generates a random password with specified requirements
   * @param length Length of the password
   * @returns Generated password
   */
  static generatePassword(length: number = 12): string {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    const allChars = uppercase + lowercase + numbers + symbols;
    let password = "";

    // Ensure at least one of each type
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  }

  /**
   * Sanitizes a string by removing potentially harmful characters
   * @param input String to sanitize
   * @returns Sanitized string
   */
  static sanitizeString(input: string): string {
    return input
      .replace(/[<>]/g, "") // Remove < and >
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/on\w+=/gi, "") // Remove on* attributes
      .trim();
  }

  /**
   * Checks if an object is empty. If so, returns null; otherwise, returns the object
   */
  static isEmptyOrNull<T extends object>(obj: T): T | null {
    if (
      obj &&
      typeof obj === "object" &&
      !Array.isArray(obj) &&
      Object.keys(obj).length === 0
    ) {
      return null;
    }
    return obj;
  }

  /**
   * Converts object keys to snake_case recursively, and converts empty objects to null.
   */
  static toSnakeCase(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(Helpers.toSnakeCase);
    } else if (obj !== null && typeof obj === "object") {
      const converted = Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [
          k.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`),
          Helpers.toSnakeCase(v),
        ]),
      );
      return Helpers.isEmptyOrNull(converted);
    }
    return obj;
  }

  /**
   * Converts object keys to camelCase recursively, and converts empty objects to null.
   */
  static toCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(Helpers.toCamelCase);
    } else if (obj !== null && typeof obj === "object") {
      const converted = Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [
          k.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
          Helpers.toCamelCase(v),
        ]),
      );
      return Helpers.isEmptyOrNull(converted);
    }
    return obj;
  }

  /**
   * Generates a unique company reference ID with hyphens.
   * Format: XX-CCCCCCss-YY
   * - XX: first 2 letters of company name (uppercase, sanitized)
   * - CCCCCC: 6 random uppercase alphanumeric
   * - ss: 2 random lowercase letters
   * - YY: last 2 digits of current year
   */
  static generateReferenceId({
    company_name,
  }: {
    company_name: string;
  }): string {
    const namePart = company_name
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, 2)
      .padEnd(2, "X");
    const now = new Date();
    const yearPart = now.getFullYear().toString().slice(-2);

    const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const lowerChars = "abcdefghijklmnopqrstuvwxyz";

    let randomUpper = "";
    for (let i = 0; i < 6; i++) {
      randomUpper += upperChars.charAt(
        Math.floor(Math.random() * upperChars.length),
      );
    }

    let randomLower = "";
    for (let i = 0; i < 2; i++) {
      randomLower += lowerChars.charAt(
        Math.floor(Math.random() * lowerChars.length),
      );
    }

    return `${namePart}-${randomUpper}${randomLower}-${yearPart}`;
  }

  static generateUserSlug(): string {
    // Generate 3 random uppercase letters
    const letters = Array.from({ length: 3 }, () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26)),
    ).join("");

    // Generate 4 random digits
    const digits = Math.floor(1000 + Math.random() * 9000).toString();

    // Get current date and encode as 4 uppercase letters (e.g., Dec 16, 2025 -> D16Z)
    // We'll use: 1st letter of month, 2-digit day, last char of year (base36)
    const now = new Date();
    const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
    const monthLetter = months[now.getMonth()];
    const day = now.getDate().toString().padStart(2, "0");
    const yearChar = now.getFullYear().toString(36).toUpperCase().slice(-1); // base36 for variety
    const datestamp = `${monthLetter}${day}${yearChar}`;

    return `${letters}-${digits}-${datestamp}`;
  }
  static sanitizeUser<T extends object>(
    user: T,
    extraFields: string[] = [],
  ): Partial<T> {
    if (!user) return user;

    const sensitiveFields = ["password", "refresh_token", ...extraFields];
    const sanitized: Record<string, any> = { ...user };

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = undefined;
      }
    }

    // Always stringify date fields if present
    const dateFields = ["created_at", "last_login", "updated_at"];
    for (const field of dateFields) {
      if (field in sanitized && sanitized[field] != null) {
        if (typeof sanitized[field] !== "string") {
          sanitized[field] = String(sanitized[field]);
        }
      }
    }

    return sanitized as Partial<T>;
  }

  static computeTrend(
    current: number,
    previous: number,
  ): {
    percentage: number;
    trend: "increase" | "decrease" | "neutral";
  } {
    if (previous === 0 && current > 0)
      return { percentage: 100, trend: "neutral" };
    if (previous === 0 && current === 0)
      return { percentage: 0, trend: "neutral" };
    const diff = current - previous;
    const pct = previous !== 0 ? (diff / previous) * 100 : 0;
    let trend: "increase" | "decrease" | "neutral" = "neutral";
    if (pct > 0) trend = "increase";
    else if (pct < 0) trend = "decrease";
    else if (pct === 0) trend = "neutral";
    return { percentage: Math.round(pct * 10) / 10, trend };
  }

  /**
   * Proto Timeline._1m = 0 so String(timeline) is "0". Also accepts "_1m" / "1m".
   */
  static normalizeTimelineKey(
    timeline: string | number | undefined | null,
  ): string {
    const byNumber: Record<number, string> = {
      0: Timeline._1m,
      1: Timeline._3m,
      2: Timeline._6m,
      3: Timeline._1y,
      4: Timeline.all,
      5: Timeline.today,
      6: Timeline._7d,
    };
    if (typeof timeline === "number" && byNumber[timeline]) {
      return byNumber[timeline];
    }
    if (typeof timeline === "string") {
      const trimmed = timeline.trim().replace(/^_/, "").toLowerCase();
      if (
        ["today", "7d", "1m", "3m", "6m", "1y", "1yr", "all"].includes(trimmed)
      ) {
        return trimmed === "1yr" ? Timeline._1y : trimmed;
      }
      const asNum = Number(trimmed);
      if (!Number.isNaN(asNum) && byNumber[asNum]) return byNumber[asNum];
    }
    return Timeline.all;
  }

  /**
   * Calendar buckets covering [dateFrom, dateTo], always including today.
   * End is exclusive except callers should treat the last bucket as inclusive of dateTo.
   */
  static buildFilledTimelineBuckets(
    dateFrom: Date,
    dateTo: Date,
    timeline?: string | number | null,
  ): Array<{ start: Date; end: Date; label: string }> {
    const key = Helpers.normalizeTimelineKey(timeline);
    const buckets: Array<{ start: Date; end: Date; label: string }> = [];
    const endExclusive = new Date(dateTo.getTime() + 1);

    if (key === Timeline.today) {
      const dayStart = new Date(
        dateTo.getFullYear(),
        dateTo.getMonth(),
        dateTo.getDate(),
        0,
        0,
        0,
        0,
      );
      const hourEnd = Math.max(1, dateTo.getHours() + 1);
      for (let h = 0; h < hourEnd; h++) {
        const start = new Date(dayStart);
        start.setHours(h, 0, 0, 0);
        const end = new Date(dayStart);
        end.setHours(h + 1, 0, 0, 0);
        buckets.push({
          start,
          end: h === hourEnd - 1 ? endExclusive : end,
          label: `${String(h).padStart(2, "0")}:00`,
        });
      }
      return buckets;
    }

    if (key === Timeline._7d) {
      for (let i = 0; i < 7; i++) {
        const start = new Date(dateFrom);
        start.setDate(dateFrom.getDate() + i);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(start.getDate() + 1);
        buckets.push({
          start,
          end: i === 6 ? endExclusive : end,
          label: start.toLocaleString("en", { day: "2-digit", month: "short" }),
        });
      }
      return buckets;
    }

    if (key === Timeline._1m) {
      for (let i = 0; i < 4; i++) {
        const start = new Date(dateFrom);
        start.setDate(dateFrom.getDate() + i * 7);
        const isLast = i === 3;
        const end = isLast
          ? endExclusive
          : new Date(
              dateFrom.getFullYear(),
              dateFrom.getMonth(),
              dateFrom.getDate() + (i + 1) * 7,
            );
        const label = isLast
          ? `W${i + 1} ${start.toLocaleString("en", { day: "2-digit", month: "short" })}–${dateTo.toLocaleString("en", { day: "2-digit", month: "short" })}`
          : `W${i + 1} ${start.toLocaleString("en", { day: "2-digit", month: "short" })}`;
        buckets.push({ start, end, label });
      }
      return buckets;
    }

    if (
      key === Timeline._3m ||
      key === Timeline._6m ||
      key === Timeline._1y
    ) {
      let cursor = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), 1);
      const last = new Date(dateTo.getFullYear(), dateTo.getMonth(), 1);
      while (cursor <= last) {
        const start = cursor < dateFrom ? new Date(dateFrom) : new Date(cursor);
        const next = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
        const isLast = cursor.getTime() === last.getTime();
        buckets.push({
          start,
          end: isLast ? endExclusive : next,
          label: cursor.toLocaleString("en", { month: "short", year: "numeric" }),
        });
        cursor = next;
      }
      return buckets;
    }

    // all — yearly buckets from dateFrom through dateTo (or last 24 months if unbounded)
    const from =
      dateFrom.getFullYear() < 2000
        ? new Date(dateTo.getFullYear() - 2, dateTo.getMonth(), dateTo.getDate())
        : dateFrom;
    for (let y = from.getFullYear(); y <= dateTo.getFullYear(); y++) {
      const start =
        y === from.getFullYear() ? new Date(from) : new Date(y, 0, 1);
      const end =
        y === dateTo.getFullYear()
          ? endExclusive
          : new Date(y + 1, 0, 1);
      buckets.push({ start, end, label: String(y) });
    }
    return buckets;
  }

  static getDateRanges({
    timeline,
    start_date,
    end_date,
  }: {
    timeline: string;
    start_date?: string;
    end_date?: string;
  }): {
    date_from?: Date;
    date_to?: Date;
    prev_date_from?: Date;
    prev_date_to?: Date;
  } {
    const now = new Date();
    let date_from: Date | undefined;
    let date_to: Date | undefined;
    let prev_date_from: Date | undefined;
    let prev_date_to: Date | undefined;

    const timelineKey = Helpers.normalizeTimelineKey(timeline);

    if (timelineKey) {
      switch (timelineKey as Timeline) {
        case Timeline.today: {
          date_from = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            0,
            0,
            0,
            0,
          );
          const prevDay = new Date(date_from);
          prevDay.setDate(prevDay.getDate() - 1);
          prev_date_from = prevDay;
          prev_date_to = new Date(date_from.getTime() - 1);
          break;
        }
        case Timeline._7d:
          date_from = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - 6,
            0,
            0,
            0,
            0,
          );
          prev_date_from = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - 13,
            0,
            0,
            0,
            0,
          );
          prev_date_to = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - 7,
            23,
            59,
            59,
            999,
          );
          break;
        case Timeline._1m:
          date_from = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate(),
          );
          prev_date_from = new Date(
            now.getFullYear(),
            now.getMonth() - 2,
            now.getDate(),
          );
          prev_date_to = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate(),
          );
          break;
        case Timeline._3m:
          date_from = new Date(
            now.getFullYear(),
            now.getMonth() - 3,
            now.getDate(),
          );
          prev_date_from = new Date(
            now.getFullYear(),
            now.getMonth() - 6,
            now.getDate(),
          );
          prev_date_to = new Date(
            now.getFullYear(),
            now.getMonth() - 3,
            now.getDate(),
          );
          break;
        case Timeline._6m:
          date_from = new Date(
            now.getFullYear(),
            now.getMonth() - 6,
            now.getDate(),
          );
          prev_date_from = new Date(
            now.getFullYear(),
            now.getMonth() - 12,
            now.getDate(),
          );
          prev_date_to = new Date(
            now.getFullYear(),
            now.getMonth() - 6,
            now.getDate(),
          );
          break;
        case Timeline._1y:
          date_from = new Date(
            now.getFullYear() - 1,
            now.getMonth(),
            now.getDate(),
          );
          prev_date_from = new Date(
            now.getFullYear() - 2,
            now.getMonth(),
            now.getDate(),
          );
          prev_date_to = new Date(
            now.getFullYear() - 1,
            now.getMonth(),
            now.getDate(),
          );
          break;
        case Timeline.all:
          // Rolling 24 months so charts still have a finite window ending today.
          date_from = new Date(
            now.getFullYear(),
            now.getMonth() - 24,
            now.getDate(),
          );
          prev_date_from = new Date(
            now.getFullYear(),
            now.getMonth() - 48,
            now.getDate(),
          );
          prev_date_to = new Date(
            now.getFullYear(),
            now.getMonth() - 24,
            now.getDate(),
          );
          break;
      }
      date_to = now;
    }

    const parseDay = (value: string, endOfDay: boolean) => {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return d;
      if (value.trim().length <= 10) {
        if (endOfDay) d.setHours(23, 59, 59, 999);
        else d.setHours(0, 0, 0, 0);
      }
      return d;
    };

    if (start_date) date_from = parseDay(start_date, false);
    if (end_date) date_to = parseDay(end_date, true);
    if (start_date && end_date) {
      const from = parseDay(start_date, false);
      const to = parseDay(end_date, true);
      const diff = to.getTime() - from.getTime();
      prev_date_to = new Date(from.getTime());
      prev_date_from = new Date(from.getTime() - diff);
    }

    return { date_from, date_to, prev_date_from, prev_date_to };
  }

  static buildWhere(extra: any = {}, dateRange: any) {
    const where: any = { ...extra };
    const { date_from, date_to, prev_date_from, prev_date_to, usePrev } =
      dateRange;
    const from = usePrev ? prev_date_from : date_from;
    const to = usePrev ? prev_date_to : date_to;

    if (from || to) {
      where.created_at = {};
      if (from) where.created_at.gte = from;
      if (to) where.created_at.lte = to;
    }
    return where;
  }
}
