import React from 'react';
import { Drawer, Toolbar, List, ListItem, ListItemIcon } from '@material-ui/core';
import { Dehaze as DehazeIcon, Dashboard as DashboardIcon, Settings as SettingsIcon, CalendarToday as CalendarTodayIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink, HashRouter as Router } from "react-router-dom";

const drawerWidth = 55;

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
}))

export default function SideRail() {
    const classes = useStyles();

    return (
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}>
            <Toolbar />
            <div className={classes.drawerContainer}>
                <Router>
                    <List>
                        <ListItem button key="activities" component={NavLink} to="/">
                            <ListItemIcon><DehazeIcon /></ListItemIcon>
                        </ListItem>
                        <ListItem button key="Calendar" component={NavLink} to="/calendar">
                            <ListItemIcon><CalendarTodayIcon /></ListItemIcon>
                        </ListItem>
                        <ListItem button key="Statistics" component={NavLink} to="/statistics">
                            <ListItemIcon><DashboardIcon /></ListItemIcon>
                        </ListItem>
                        <ListItem button key="Settings" component={NavLink} to="/settings">
                            <ListItemIcon><SettingsIcon /></ListItemIcon>
                        </ListItem>
                    </List>
                </Router>
            </div>
        </Drawer>
    );
}
