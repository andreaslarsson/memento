import TimeEntry from './TimeEntry';
import { msToTimeString, dateCompare, isDateAfter } from '../common/Util';
const uuid = require('uuid/v1');

class Activity {
    constructor(title, id = null, timeEntries = null, show = true, active = false, currentTimeEntry = null) {
        this.title = title;
        this.id = (id ? id : uuid());
        this.isActive = active;
        this.timeEntries = (timeEntries ? parseTimeEntries(timeEntries) : []);
        this.currentTimeEntry = currentTimeEntry ? new TimeEntry(currentTimeEntry.startTime) : null;
        this.tags = [];
        this.show = show;
    }

    setActive() {
        this.isActive = true;
        this.currentTimeEntry = new TimeEntry();
    }

    setInactive() {
        if (this.isActive && this.currentTimeEntry != null) {
            this.isActive = false;
            this.currentTimeEntry.stopTracking();
            this.timeEntries.push(this.currentTimeEntry);
            this.currentTimeEntry = null;
        }
    }

    addTimeEntry(start, stop) {
        var timeEntry = new TimeEntry(start, stop);
        this.timeEntries.push(timeEntry);
    }

    getLoggedTime(toTime = true) {
        // Iterate all timeEntries and get its time property. 
        var accumulatedTime = 0;
        var today = new Date();
        this.timeEntries.forEach(timeEntry => {
            if (timeEntry.startTime.getDate() >= today.getDate()) {
                accumulatedTime += timeEntry.getSpentTime();
            }
        });

        // Append any current activity
        if (this.isActive) {
            accumulatedTime += (new Date() - this.currentTimeEntry.startTime);
        }
        return toTime ? msToTimeString(accumulatedTime) : accumulatedTime;
    }

    getLoggedTimeOnDate(date) {
        var accumulatedTime = 0;

        this.timeEntries.forEach(timeEntry => {
            if (dateCompare(timeEntry.startTime, date)) {
                accumulatedTime += timeEntry.getSpentTime();
            }
        });

        if (this.isActive && dateCompare(date, new Date())) {
            accumulatedTime += (new Date() - this.currentTimeEntry.startTime);
        }

        return accumulatedTime;
    }

    getLoggedTimeAfterDate(date) {
        var accumulatedTime = 0;

        this.timeEntries.forEach(timeEntry => {
            if (isDateAfter(timeEntry.startTime, date)) {
                accumulatedTime += timeEntry.getSpentTime();
            }
        });

        if (this.isActive && isDateAfter(new Date(), date)) {
            accumulatedTime += (new Date() - this.currentTimeEntry.startTime);
        }
        
        return accumulatedTime;
    }
}

function parseTimeEntries(timeEntries) {
    var parsedTimeEntries = [];
    for (const entry of timeEntries) {
        parsedTimeEntries.push(new TimeEntry(entry.startTime, entry.endTime));
    }
    return parsedTimeEntries;
}

export default Activity;