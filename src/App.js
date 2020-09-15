import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, CssBaseline, Typography } from '@material-ui/core';
import { ThemeProvider, createMuiTheme, makeStyles} from '@material-ui/core/styles';
import { Route, HashRouter as Router } from "react-router-dom";

import Menu from './Menu';
import Activity from './activity/Activity';
import ActivityList from './activity/ActivityList';
import ActivityForm from './activity/ActivityForm';
import Settings from './settings/Settings';
import Statistics from './statistics/Statistics';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

const readDataFile = _ => {
    let reconstruct = ipcRenderer.sendSync('read-activities');
    let reconstructedList = [];
    for (const act of reconstruct) {
        reconstructedList.push(new Activity(act.title, act.id, JSON.parse(act.time_entries), act.show, act.is_active, JSON.parse(act.current_timeentry)));
    }

    return reconstructedList;
};

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 400,
    },
    paper: {
        padding: theme.spacing(0),
        margin: theme.spacing(0),
        textAlign: 'left',
        color: theme.palette.text.primary,
    },
}));

export default function App() {
    const classes = useStyles();
    const [activities, setActivities] = useState([]);
    const [title, setTitle] = useState("ActivityList");
    const [darkMode, setDarkMode] = useState(false);

    const pallet = darkMode ? "dark" : "light";
    const primaryColor = darkMode ? "#f57c00" : '#115293';
    const secondaryColor = darkMode ? "#2196f3" : "#f57c00";

    useEffect(() => {
        setActivities(readDataFile());
    }, []);

    useEffect(() => {
        return () => {
            if (activities.length > 0) {
                ipcRenderer.send('save-activities', activities);
            }
        };
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
        let activityItem = getActivityFromId(activityId);
        activities.splice(activityItem.index, 1);
        setActivities([...activities]);
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

    const menuItemSelect = (item) => {
        setTitle(item);
    };

    const onNewActivitySubmit = title => {
        addActivity(title);
    };

    const handleThemeChange = (useDarkMode) => {
        setDarkMode(useDarkMode);
    }

    const viewHeader = () => {
        if (title === "ActivityList") {
            return (
                <ActivityForm newActivityAdded={onNewActivitySubmit} darkMode={darkMode} />
            )
        }
        else {
            return (
                <Typography variant="h6" className={classes.title}>{title}</Typography>
            )
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className={classes.root}>
                <div className="className">
                    <AppBar position="static" color="primary">
                        <Toolbar variant="dense">
                            <Menu menuItemSelect={menuItemSelect} />
                            {viewHeader()}
                        </Toolbar>
                    </AppBar>
                </div>
                <div className="content">
                    <Router>
                        <Route exact path="/"><ActivityList activities={activities}
                            onMenuAction={onMenuAction}
                            onToggleActive={onToggleActive} />
                        </Route>
                        <Route path="/statistics"><Statistics activities={activities} /></Route>
                        <Route path="/settings"><Settings useDarkMode={darkMode} handleThemeChange={handleThemeChange} /></Route>
                    </Router>
                </div>
            </div>
        </ThemeProvider>
    );
}
