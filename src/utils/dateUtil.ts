/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';

export function formatToDateTime(
  date: dayjs.Dayjs | any | undefined = undefined,
  format = DATE_TIME_FORMAT,
): string {
  return dayjs(date).format(format);
}

export function formatToDate(
  date: dayjs.Dayjs | any | undefined = undefined,
  format = DATE_FORMAT,
): string {
  return dayjs(date).format(format);
}

export function formatToUnix(date: dayjs.Dayjs | any | undefined = undefined): number | null {
  return date ? +dayjs(date) : null;
}

export function formatDate(date: dayjs.Dayjs | string, format = DATE_TIME_FORMAT): string {
  if (date) {
    let formated;
    try {
      formated = dayjs(new Date(+date)).format(format);
    } catch {
      formated = date;
    }
    return formated;
  }
  return date;
}

export function diffDate(
  start: dayjs.Dayjs | string,
  end: dayjs.Dayjs | string,
  unit: dayjs.UnitTypeLong = 'day',
) {
  return dayjs(+start).diff(+end, unit);
}

export const dateUtil = dayjs;
