import { v4 as uuidv4 } from 'uuid';

class TimeEntry {
    constructor(startTime = null, endTime = null, id = null) {
        this.id = (id ? id : uuidv4())
        this.date = (startTime ? new Date(startTime) : new Date(new Date().setHours(0, 0, 0, 0)));
        this.startTime = (startTime ? new Date(startTime) : new Date());
        this.endTime = (endTime ? new Date(endTime) : new Date(0));
    }

    setStartTime(time) {
        this.startTime = time;
    }

    stopTracking() {
        this.endTime = new Date();
    }

    getSpentTime() {
        return this.endTime.getTime() - this.startTime.getTime();
    }
}

export default TimeEntry;