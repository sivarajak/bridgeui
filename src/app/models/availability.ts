import { Schedule } from './schedule';

export class Availability {
    userId: number;
    userNickName: string;
    location: string;
    availableFor: string;
    schedules: Schedule[];

}
