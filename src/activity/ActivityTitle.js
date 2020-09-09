import React from 'react';
import { Menu, Typography, MenuItem } from '@material-ui/core';

export default function ActivityTitleWithMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = _ => {
    setAnchorEl(null);
  };

  const handleOnDelete = _ => {
    props.onMenuAction('delete');
    setAnchorEl(null);
  };

  const handleOnHide = _ => {
    props.onMenuAction('hide');
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Typography onClick={handleClick}>{props.title}</Typography>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        <MenuItem onClick={handleOnDelete}>Delete</MenuItem>
        <MenuItem onClick={handleOnHide}>Hide</MenuItem>
      </Menu>
    </React.Fragment>
  );
}