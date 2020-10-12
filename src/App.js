import React, { useState, useEffect, useReducer } from 'react';
import { ThemeProvider, createMuiTheme, makeStyles, fade } from '@material-ui/core/styles';
import { AppBar, CssBaseline, Toolbar, Typography, InputBase } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';

import { Route, HashRouter as Router } from "react-router-dom";

import SideRail from './SideRail';
import ActivityList from './activity/ActivityList';
import Calendar from './calendar/Calendar';
import Settings from './settings/Settings';
import Statistics from './statistics/Statistics';
import TimeEntry from './activity/TimeEntry';

import { v4 as uuidv4 } from 'uuid';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(0),
    },
    title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    addActivityInput: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    addIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        width: '100%',
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '20ch',
            '&:focus': {
                width: '50ch',
            },
        },
    },

}));

const parseTimeEntries = timeEntries => {
    var parsedTimeEntries = [];
    for (const entry of timeEntries) {
        parsedTimeEntries.push(new TimeEntry(entry.startTime, entry.endTime));
    }
    return parsedTimeEntries;
};

const readDataFile = _ => {
    let reconstruct = ipcRenderer.sendSync('read-activities');
    let reconstructedList = [];
    for (const act of reconstruct) {
        reconstructedList.push({
            "title": act.title,
            "id": act.id,
            "timeEntries": parseTimeEntries(JSON.parse(act.time_entries)),
            "show": act.show,
            "isActive": act.is_active,
            "currentTimeEntry": (act.current_timeentry !== "null" ? new TimeEntry(JSON.parse(act.current_timeentry).startTime) : null)
        });
    }

    return reconstructedList;
};

const initialState = { activities: readDataFile() };

function reducer(state, action) {
    switch (action.type) {
        case 'add': {
            return { activities: [action.newActivity, ...state.activities] }
        }
        case 'delete': {
            return { activities: state.activities.filter(activity => activity.id !== action.activityId) };
        }
        case 'start': {
            let activitiesCopy = [...state.activities];
            let activity = { ...activitiesCopy[action.activityIdx], isActive: true, currentTimeEntry: new TimeEntry() };
            activitiesCopy[action.activityIdx] = activity;

            return { activities: activitiesCopy }
        }
        case 'stop': {
            let activitiesCopy = [...state.activities];
            let activity = activitiesCopy[action.activityIdx];
            let currentTE = activity.currentTimeEntry;
            currentTE.stopTracking();
            activity = { ...activity, isActive: false, currentTimeEntry: null, timeEntries: [...activity.timeEntries, currentTE] };
            activitiesCopy[action.activityIdx] = activity;
            return { activities: activitiesCopy }
        }
        case 'update': {
            return { activities: state.activities.map((act, index) => {
                return index === action.activityIndex ? action.activity : act})};
            }
        default:
            throw new Error();
    }
}

export default function App() {
    const classes = useStyles();

    const [activities, dispatch] = useReducer(reducer, initialState);

    const [title, setTitle] = useState("");
    const [darkMode, setDarkMode] = useState(false);

    const pallet = darkMode ? "dark" : "light";
    const primaryColor = darkMode ? "#f57c00" : '#115293';
    const secondaryColor = darkMode ? "#2196f3" : "#f57c00";

    useEffect(() => {
        if (activities.activities.length > 0) {
            ipcRenderer.send('save-activities', activities.activities);
        }
    }, [activities]);

    const getActivityIndex = id => {
        return activities.activities.findIndex(activity => activity.id === id);
    }

    const addActivity = title => {
        let newActivity = {
            "title": title,
            "id": uuidv4(),
            "isActive": false,
            "timeEntries": [],
            "currentTimeEntry": null,
            "tags": [],
            "show": true
        }

        dispatch({ type: 'add', newActivity: newActivity });
    };

    const getRunningActivityIndex = _ => {
        for (let i = 0; i < activities.activities.length; i++) {
            let tmpActivity = activities.activities[i];
            if (tmpActivity.isActive) {
                return i;
            }
        }
        return -1;
    };

    const stopActivity = activityId => {
        var activityIdx = -1;
        if (activityId) {
            activityIdx = getActivityIndex(activityId);
        }
        else {
            activityIdx = getRunningActivityIndex();
        }

        if (activityIdx === -1) return;

        dispatch({ type: 'stop', activityIdx: activityIdx });
    };

    const startActivity = activityId => {
        stopActivity();
        dispatch({ type: 'start', activityIdx: getActivityIndex(activityId) });
    };

    const hideActivity = activityId => {
        let activityIdx = getActivityIndex(activityId);
        let activitiesCopy = [...activities.activities];
        let activity = activitiesCopy[activityIdx];
        activity.show = false;
        activitiesCopy[activityIdx] = activity;
        dispatch({type: 'update', activityIndex: activityIdx, activity: activity});
    };

    const onToggleActive = activityId => {
        let activityIdx = getActivityIndex(activityId);
        let activity = activities.activities[activityIdx];
        activity.isActive ? stopActivity(activityId) : startActivity(activityId);
    };

    const onMenuAction = (activityId, action) => {
        switch (action) {
            case 'delete':
                dispatch({ type: 'delete', activityId: activityId });
                break
            case 'hide':
                hideActivity(activityId);
                break
            default:
                break
        }
    };

    const timeEntryUpdate = (action, activityId, timeEntryId = null, startTime = null, endTime = null) => {
        let activityIdx = getActivityIndex(activityId);
        let activitiesCopy = [...activities.activities];
        let activity = activitiesCopy[activityIdx];

        if (action === 'add') {
            let timeEntry = new TimeEntry(startTime, endTime);
            activity.timeEntries = [...activity.timeEntries, timeEntry];
        }
        else if (action === 'update') {
            let updatedTimeEntry = new TimeEntry(startTime, endTime, timeEntryId);
            activity.timeEntries = activity.timeEntries.map(entry => { return entry.id === timeEntryId ? updatedTimeEntry : entry });
        }
        else if (action === 'delete') {
            activity.timeEntries = activity.timeEntries.filter(timeEntry => timeEntry.id !== timeEntryId);
        }

        dispatch({type: 'update', activityIndex: activityIdx, activity: activity});
    }

    const theme = createMuiTheme({
        palette: {
            type: pallet,
            primary: {
                main: primaryColor,
            },
            secondary: {
                main: secondaryColor,
            },
        },
        typography: {
            body1: {
                fontSize: 14
            },
        }
    });

    const onNewActivitySubmit = title => {
        addActivity(title);
    };

    const handleThemeChange = (useDarkMode) => {
        setDarkMode(useDarkMode);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        document.activeElement.blur();
        let title = document.getElementById("new_activity_input").value;
        document.getElementById("new_activity_input").value = "";
        onNewActivitySubmit(title);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className={classes.root}>
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <Typography className={classes.title} variant="h6">{title}</Typography>
                        <div className={classes.addActivityInput}>
                            <div className={classes.addIcon}>
                                <AddIcon fontSize="small" />
                            </div>
                            <form onSubmit={handleSubmit}>
                                <InputBase
                                    id="new_activity_input"
                                    placeholder="Add new task"
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    onSubmit={handleSubmit}
                                />
                            </form>
                        </div>
                    </Toolbar>
                </AppBar>
                <SideRail />
                <main className={classes.content}>
                    <Toolbar />
                    <Router>
                        <Route exact path="/">
                            <ActivityList activities={activities.activities}
                                onMenuAction={onMenuAction}
                                onToggleActive={onToggleActive}
                                setTitle={setTitle} />
                        </Route>
                        <Route path="/calendar">
                            <Calendar activities={activities.activities}
                                setTitle={setTitle}
                                timeEntryUpdate={timeEntryUpdate} />
                        </Route>
                        <Route path="/statistics">
                            <Statistics activities={activities.activities}
                                setTitle={setTitle} />
                        </Route>
                        <Route path="/settings">
                            <Settings useDarkMode={darkMode}
                                handleThemeChange={handleThemeChange}
                                setTitle={setTitle} />
                        </Route>
                    </Router>
                </main>
            </div>
        </ThemeProvider>
    );
}