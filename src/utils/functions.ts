import cx, { ClassName } from 'classix';
import { twMerge } from 'tailwind-merge';
import { parseISO, isDate } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz'

type MaybeDates<T> = T[] | null | undefined;

export const cn = (...classes: ClassName[]) => {
    return twMerge(cx(...classes));
};

export const jubilees: number[] = [25, 50, 60, 75, 100, 125, 150, 160, 175, 200, 225, 250, 260, 275, 300];
export const preJubilees: number[] = [24, 49, 59, 74, 99, 124, 149, 159, 174, 199, 224, 249, 259, 274, 299];

export const getCelebrating = (year: number | string): string => {
    const parsedYear = parseInt(year as string);
    if (jubilees.includes(parsedYear)) {
        return populateCel(parsedYear);
    } else if (preJubilees.includes(parsedYear)) {
        return populateCel(parsedYear, true);
    }
    return '--';
};

export const populateCel = (year: number, pre: boolean = false): string => {
    const adjustedYear = pre ? year + 1 : year;
    let name = '';

    switch (adjustedYear) {
        case 25:
            name = "Silver";
            break;
        case 50:
            name = "Golden";
            break;
        case 60:
            name = "Diamond";
            break;
        case 75:
            name = "Platinum";
            break;
        case 100:
            name = "Centennial";
            break;
    }
    name = pre ? 'Pre ' + name : name;

    return name ? name + " Jubilee" : "Jubilee";
};

export const getYear = (estd: number | string, year?: number): string => {
    const parsedEstd = parseInt(estd as string);
    const currentYear = year ?? new Date().getFullYear();
    return parsedEstd ? (currentYear - parsedEstd + 1).toString() : 'Not Known';
};

export const getDaySuffix = (day: number): string => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
};

export const formatDate = (date: string | Date, showDay: boolean = false): string => {
    const parsedDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
    const day = parsedDate.getDate();
    const daySuffix = getDaySuffix(day);
    if (showDay) {
        const dayOfWeek = parsedDate.getDay();
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return `${daysOfWeek[dayOfWeek]}, ${day}${daySuffix} ${parsedDate.toLocaleDateString('en-US', options)}`;
    }
    return `${day}${daySuffix} ${parsedDate.toLocaleDateString('en-US', options)}`;
};

export const getDay = (date: string | Date): string => {
    const parsedDate = new Date(date);
    const dayOfWeek = parsedDate.getDay();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[dayOfWeek];
};

export const getDateByIndex = <T extends { date: string | Date }>(dates: MaybeDates<T>, index: number | "last", time?: string, addDays: number = 0): Date => {
    if (!dates || dates.length === 0) return setTime(new Date(), time);

    const resolvedIndex = index === 'last' ? Math.max(dates.length - 1, 0) : index;
    const raw = dates[resolvedIndex].date;
    const date = raw instanceof Date ? new Date(raw) : raw ? new Date(raw) : new Date();

    if (addDays !== 0) date.setDate(date.getDate() + addDays);

    return setTime(date, time);
};

const setTime = (date: Date, time?: string) => {
    if (!time) return date;
    const [hh, mm, ss] = time?.split(":").map(Number);
    date.setHours(hh || 0, mm || 0, ss || 0, 0);
    return date;
}

export const buildGoogleCalendarUrl = ({
    title = "",
    description = "",
    location = "",
},
    date: string | Date,
    startTime: string,
    endTime: string,
) => {
    const base = "https://calendar.google.com/calendar/render?action=TEMPLATE";

    // Normalize input date
    const baseDate = isDate(date) ? date : parseISO(date);

    const dates = `${formatInTimeZone(setTime(baseDate, startTime), 'UTC', "yyyyMMdd'T'HHmmss'Z'")}/${formatInTimeZone(setTime(baseDate, endTime), 'UTC', "yyyyMMdd'T'HHmmss'Z'")}`;
    const params = new URLSearchParams({
        text: title,
        details: description,
        location
    });

    return `${base}&${params.toString()}&dates=${encodeURIComponent(dates)}`;
}

export const stripHtmlAndLimit = (text: string, limit: number = 160): string => {
    const strippedText = text.replace(/<\/?[^>]+(>|$)/g, "");
    return strippedText.length > limit ? strippedText.substring(0, limit).trim() + "..." : strippedText;
}

export const sanitizeSearchQuery = (query: string | number): string => {
    if (typeof query !== 'string') {
        query = String(query);
    }

    return query
        .trim()
        .slice(0, 100) // Limit to 100 characters
        .replace(/[<>{}[\]\\\/]/g, '') // Remove potentially dangerous characters
        //.replace(/[&]/g, ' and ') // Replace & with 'and'
        .replace(/\s+/g, ' '); // Replace multiple spaces with single space
}

export const capitalizeFirst = (name?: string): string => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

export const toUpper = (name: string): string => {
    return name?.toUpperCase() ?? "";
}

export const toLower = (name: string): string => {
    return name?.toLowerCase() ?? "";
}