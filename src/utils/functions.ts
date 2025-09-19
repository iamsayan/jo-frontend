import cx, { ClassName } from 'classix';
import { twMerge } from 'tailwind-merge';
import { parseISO, isDate, format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz'
import { Puja, PujaExtended } from '@/types';

type MaybeDates<T> = T[] | null | undefined;

export function cn(...classes: ClassName[]) {
    return twMerge(cx(...classes));
};

export const jubilees: number[] = [25, 50, 60, 75, 100, 125, 150, 160, 175, 200, 225, 250, 260, 275, 300];
export const preJubilees: number[] = [24, 49, 59, 74, 99, 124, 149, 159, 174, 199, 224, 249, 259, 274, 299];

export function extendPuja(puja: Puja, year?: number): PujaExtended {
    const y = getYear(puja.estd, year);
    const cel = getCelebrating(y);
    const zone = puja.zone === 'bhadreswar' ? 'Bhadreswar' : 'Chandannagar';

    return {
        ...puja,
        year: y,
        celebrating: cel,
        popular: (puja.tags ?? []).includes('popular'),
        adi: (puja.tags ?? []).includes('adi'),
        jubilee: jubilees.includes(Number(y)),
        preJubilee: preJubilees.includes(Number(y)),
        psZone: zone,
        address: puja.location?.address ?? `${zone}, Hooghly, West Bengal`,
    }
}

export function getCelebrating(year: number | string): string {
    const parsedYear = typeof year === 'string' ? parseInt(year) : year;
    return jubilees.includes(parsedYear) 
        ? populateCel(parsedYear)
        : preJubilees.includes(parsedYear)
            ? populateCel(parsedYear, true)
            : '';
}

export function populateCel(year: number, pre: boolean = false): string {
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

export function getYear(estd: number | string, year: number = new Date().getFullYear()): number {
    const parsedEstd = typeof estd === 'string' ? parseInt(estd) : estd;
    return parsedEstd ? (year - parsedEstd + 1) : 0;
};

export const setTime = (date: Date, time?: string): Date => {
    if (time) {
        const [hh, mm, ss] = time?.split(":").map(Number);
        date.setHours(hh || 0, mm || 0, ss || 0, 0);
    }
    return date;
}

export function createDate(date: Date | string, time?: string): Date;
export function createDate(date: Date | string, time: string | undefined, dateFormat: string): string;
export function createDate(date: Date | string, time?: string, dateFormat?: string): Date | string {
    let baseDate = isDate(date) ? date : parseISO(date);
    if (time) baseDate = setTime(baseDate, time);
    return dateFormat ? format(baseDate, dateFormat) : baseDate;
}

export function formatDate(date: string | Date): Date;
export function formatDate(date: string | Date, dateFormat: string): string;
export function formatDate(date: string | Date, dateFormat?: string): Date | string {
    return dateFormat ? createDate(date, undefined, dateFormat) : createDate(date);
};

export function getDateByIndex<T extends { date: string | Date }>(dates: MaybeDates<T>, index: number | "last", time?: string, addDays: number = 0): Date {
    if (!dates || dates.length === 0) return setTime(new Date(), time);

    const resolvedIndex = index === 'last' ? Math.max(dates.length - 1, 0) : index;
    const raw = dates[resolvedIndex].date;
    const date = createDate(raw, time);

    if (addDays !== 0) date.setDate(date.getDate() + addDays);

    return date;
};

export function buildGoogleCalendarUrl({
    title = "",
    description = "",
    location = "",
},
    date: string | Date,
    startTime: string,
    endTime: string,
): string {
    const base = "https://calendar.google.com/calendar/render?action=TEMPLATE";
    const startDate = createDate(date, startTime);
    const endDate = createDate(date, endTime);

    const dates = `${formatInTimeZone(startDate, 'UTC', "yyyyMMdd'T'HHmmss'Z'")}/${formatInTimeZone(endDate, 'UTC', "yyyyMMdd'T'HHmmss'Z'")}`;
    const params = new URLSearchParams({
        text: title,
        details: description,
        location
    });

    return `${base}&${params.toString()}&dates=${encodeURIComponent(dates)}`;
}

export function stripHtmlAndLimit(text: string, limit: number = 160): string {
    const strippedText = text.replace(/<\/?[^>]+(>|$)/g, "");
    return strippedText.length > limit ? strippedText.substring(0, limit).trim() + "..." : strippedText;
}

export function sanitizeSearchQuery(query: string | number): string {
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

export function capitalizeFirst(name?: string): string {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

export function toUpper(name: string): string {
    return name?.toUpperCase() ?? "";
}

export function toLower(name: string): string {
    return name?.toLowerCase() ?? "";
}