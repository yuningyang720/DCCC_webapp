import { Injectable } from '@angular/core';
import {WeekDay} from '../Models/prompt';

@Injectable({
  providedIn: 'root'
})
export class DatetoolsService {

  constructor() { }

  formatDuration (seconds: number): string {
    seconds = Math.floor(seconds);
    let ret = '';

    if (seconds > 60 * 60 * 24) {
      ret += Math.floor(seconds / (60 * 60 * 24)) + ' days, ';
      seconds = seconds % (60 * 60 * 24);
    } if (seconds > 60 * 60) {
      ret += Math.floor(seconds / (60 * 60)) + ' hours and ';
      seconds = seconds % (60 * 60);
    } if (seconds > 60) {
      ret += Math.floor(seconds / 60) + ' minutes';
    }

    return ret;
  }

  getTimestamp (): number {
    return new Date().getTime();
  }

  getMondayMorning(d: Date): Date {
    d = new Date(d);
    const day = d.getDay(),
        diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    d = new Date(d.setHours(0, 0, 0, 0));
    return new Date(d.setDate(diff));
  }

  getMorning(date: Date) {
    return new Date(date.setHours(0, 0, 0, 0));
  }

  getLocalTimestamp (date: Date) {
    return date.getTime() - date.getTimezoneOffset() * 6000;
  }

  getClosestDayOfWeek (daysOfWeek: Array<WeekDay>) {
    const now: Date = new Date();
    let minDay = now.getDate() + 6;
    for (const day of daysOfWeek) {
      if ((day - now.getDate() + 7) % 7 < (minDay - now.getDate() + 7) % 7) {
        minDay = day;
      }
    }
    return minDay;
  }

}
