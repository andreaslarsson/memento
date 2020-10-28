import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import { ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    Resources,
    WeekView,
    Appointments,
    DateNavigator,
    TodayButton,
    Toolbar,
    CurrentTimeIndicator,
    AppointmentForm,
    AppointmentTooltip,
    DragDropProvider,
} from '@devexpress/dx-react-scheduler-material-ui';

const formatData = activities => {
    let data = new Map();
    activities.forEach((project) => {
        project.timeEntries.forEach((timeEntry) => {
            data.set(timeEntry.id, { id: timeEntry.id, startDate: timeEntry.startTime, endDate: timeEntry.endTime, title: project.title, activity: project.id });
        })
    })

    return data;
}

export default function Calendar(props) {
    const [timeEntries, setTimeEntries] = useState([]);
    const setTitle = props.setTitle;

    useEffect(() => {
        setTitle("Calendar");
    }, [setTitle]);

    useEffect(() => {
        setTimeEntries(formatData(props.activities))
    }, [props]);

    const scrollToTop = _ => {
        window.scrollTo(0,0);
    };

    const commitChanges = ({ added, changed, deleted }) => {
        if (added) {
            props.timeEntryUpdate('add', added.activity, null, added.startDate, added.endDate);
        }
        else if (changed) {
            let key = Object.keys(changed)[0];
            let timeEntry = timeEntries.get(key);
            let start = changed[key].startDate !== undefined ? changed[key].startDate : timeEntry.startDate;
            let end = changed[key].endDate !== undefined ? changed[key].endDate : timeEntry.endDate;
            props.timeEntryUpdate('update', timeEntry.activity, timeEntry.id, start, end);
        }
        else if (deleted !== undefined) {
            let timeEntry = timeEntries.get(deleted);
            props.timeEntryUpdate('delete', timeEntry.activity, deleted);
        }
    };

    const activities = [
        {
            fieldName: 'activity',
            title: 'Activity',
            instances: props.activities.map(function (activity) { return { id: activity.id, text: activity.title } }),
        }
    ]

    return (
        <React.Fragment>
            <Paper>
                <Scheduler data={[...timeEntries.values()]}>
                    <ViewState />
                    <WeekView
                        startDayHour={5.5}
                        endDayHour={19.5}
                        excludedDays={[0, 6]}
                        today={true} />
                    <Toolbar />
                    <DateNavigator />
                    <TodayButton />
                    <Appointments />
                    <EditingState onCommitChanges={commitChanges} onAddedAppointmentChange={scrollToTop}/>
                    <IntegratedEditing />
                    <DragDropProvider />
                    <CurrentTimeIndicator />
                    <AppointmentTooltip
                        showCloseButton
                        showDeleteButton />
                    <AppointmentForm onVisibilityChange={scrollToTop}/>
                    <Resources data={activities} />
                </Scheduler>
            </Paper>
        </React.Fragment>
    );
}