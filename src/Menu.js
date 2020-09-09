import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SettingsIcon from '@material-ui/icons/Settings';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ListIcon from '@material-ui/icons/List';
import {
  NavLink,
  HashRouter
} from "react-router-dom";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

export default function TemporaryDrawer(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });


  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer('left', false)}
      onKeyDown={toggleDrawer('left', false)}>
      <HashRouter>
        <List>
          <ListItem button key="activities" component={NavLink} onClick={() => props.menuItemSelect('ActivityList')} to="/">
            <ListItemIcon><ListIcon /></ListItemIcon>
            <ListItemText primary="Activities" />
          </ListItem>
          <ListItem button key="Statistics" component={NavLink} onClick={() => props.menuItemSelect('Statistics')} to="/statistics">
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Statistics" />
          </ListItem>
          <ListItem button key="Settings" component={NavLink} onClick={() => props.menuItemSelect('Settings')} to="/settings">
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </HashRouter>
    </div>
  );

  return (
    <div>
      <React.Fragment key={'left'}>
        <IconButton onClick={toggleDrawer('left', true)} edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Drawer anchor={'left'} open={state['left']} onClose={toggleDrawer('left', false)}>
          {list('left')}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
