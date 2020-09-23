import React, { useState, useEffect } from 'react';

import { ThemeProvider, createMuiTheme, makeStyles, fade } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import AddIcon from '@material-ui/icons/Add';

import { Route, HashRouter as Router } from "react-router-dom";

import SideRail from './SideRail';
import Activity from './activity/Activity';
import ActivityList from './activity/ActivityList';
import Calendar from './calendar/Calendar';
import Settings from './settings/Settings';
import Statistics from './statistics/Statistics';
import TimeEntry from './activity/TimeEntry';

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
    search: {
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
    searchIcon: {
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
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '20ch',
            '&:focus': {
                width: '50ch',
            },
        },
    },

}));

const readDataFile = _ => {
    let reconstruct = ipcRenderer.sendSync('read-activities');
    let reconstructedList = [];
    for (const act of reconstruct) {
        reconstructedList.push(new Activity(act.title, act.id, JSON.parse(act.time_entries), act.show, act.is_active, JSON.parse(act.current_timeentry)));
    }

    return reconstructedList;
};

export default function App() {
    const classes = useStyles();

    const [activities, setActivities] = useState([]);
    const [title, setTitle] = useState("");
    const [darkMode, setDarkMode] = useState(false);

    const pallet = darkMode ? "dark" : "light";
    const primaryColor = darkMode ? "#f57c00" : '#115293';
    const secondaryColor = darkMode ? "#2196f3" : "#f57c00";

    useEffect(() => {
        setActivities(readDataFile());
    }, []);

    useEffect(() => {
        if (activities.length > 0) {
            ipcRenderer.send('save-activities', activities);
        }
    }, [activities]);

    const getActivityFromId = id => {
        for (let i = 0; i < activities.length; i++) {
            if (activities[i].id === id) {
                return { "index": i, "activity": activities[i] };
            }
        }
    };
    const addActivity = title => {
        let newActivity = new Activity(title);
        activities.unshift(newActivity);
        setActivities([...activities]);
    };

    const stopActivity = (activityId = null) => {
        var activityItem;
        if (activityId) {
            activityItem = getActivityFromId(activityId);

        }
        else {
            for (let i = 0; i < activities.length; i++) {
                let tmpActivity = activities[i];
                if (tmpActivity.isActive) {
                    activityItem = { "index": i, "activity": tmpActivity };
                    break;
                }
            }
        }

        if (activityItem === undefined) return;

        activityItem.activity.setInactive();
        activities[activityItem.index] = activityItem.activity;
        setActivities([...activities]);
    };

    const startActivity = activityId => {
        stopActivity();

        let activityItem = getActivityFromId(activityId);
        activityItem.activity.setActive();
        activities[activityItem.index] = activityItem.activity;
        setActivities([...activities]);
    };

    const deleteActivity = activityId => {
        setActivities(activities.filter(activity => activity.id !== activityId));
    };

    const hideActivity = activityId => {
        let activityItem = getActivityFromId(activityId);
        activityItem.activity.show = false;
        activityItem.activity.setInactive();

        activities[activityItem.index] = activityItem.activity;
        setActivities([...activities]);
    };

    const onToggleActive = activityId => {
        let activityItem = getActivityFromId(activityId);
        activityItem.activity.isActive ? stopActivity(activityId) : startActivity(activityId);
    };

    const onMenuAction = (activityId, action) => {
        switch (action) {
            case 'delete':
                deleteActivity(activityId);
                break
            case 'hide':
                hideActivity(activityId);
                break
            default:
                break
        }
    };
    
    const timeEntryUpdate = (action, activityId, timeEntryId=null, startTime=null, endTime=null) => {
        let activityItem = getActivityFromId(activityId);

        if (action === 'add') {
            let timeEntry = new TimeEntry(startTime, endTime);
            activityItem.activity.timeEntries = [...activityItem.activity.timeEntries, timeEntry];
        }
        else if (action === 'update') {
            let updatedTimeEntry = new TimeEntry(startTime, endTime, timeEntryId);
            activityItem.activity.timeEntries = activityItem.activity.timeEntries.map(entry => { return entry.id === timeEntryId ? updatedTimeEntry : entry});
        }
        else if (action === 'delete') {
            activityItem.activity.timeEntries = activityItem.activity.timeEntries.filter(timeEntry => timeEntry.id !== timeEntryId);
        }
        
        activities[activityItem.index] = activityItem.activity;
        setActivities([...activities]);
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
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
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
                                    inputProps={{ 'aria-label': 'search' }}
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
                            <ActivityList activities={activities}
                                onMenuAction={onMenuAction}
                                onToggleActive={onToggleActive}
                                setTitle={setTitle} />
                        </Route>
                        <Route path="/calendar">
                            <Calendar activities={activities}
                                setTitle={setTitle}
                                timeEntryUpdate={timeEntryUpdate}/>
                        </Route>
                        <Route path="/statistics">
                            <Statistics activities={activities}
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