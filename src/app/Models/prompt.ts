import {Oid} from './oid';

export enum PromptType {
    random = 'random',
    repeat = 'repeat'
}

export enum Repeat {
    none = 'none',
    once= 'once',
    daily = 'daily',
    weekly = 'weekly',
    always = 'always'
}


export enum NotificationCondition {
    not_filled = 'not-filled',
    none = 'none'
}

export enum WeekDay {
    Random = -1,
    Monday = 0,
    Tuesday = 1,
    Wednesday = 2,
    Thursday = 3,
    Friday = 4,
    Saturday = 5,
    Sunday = 6
}

export interface PromptNotification {
    isPush: boolean;
    startTimeInMinutes: number;
    endTimeInMinutes: number;
    condition: NotificationCondition;
    times: number;
    repeat: Repeat;
    firstDay?: WeekDay;
    timeRange: Array<Date>;
    headerMessage?: string;
    contentMessage?: string;
}

export interface Prompt {
    _id: Oid;
    name: string;
    description: string;
    questionnaire: Oid;
    prompt_type: PromptType;
    times: number;
    repeat: Repeat;
    category: string;
    is_available: boolean;
    wait_time: number;
    isPush: boolean;
    startTimeInMinutes: number;
    endTimeInMinutes: number;
    notifications: Array<PromptNotification>;
    daysOfWeek: Array<WeekDay>;
}
