import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableRow, TableCell, Switch, Paper, Grid, Typography, Fade } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.primary,
  },
  header: {
    margin: theme.spacing(2)
  },
  bottomPush: {
    bottom: 0,
    textAlign: "center",
    paddingBottom: 0
  }
}));

export default function Settings(props) {
  const classes = useStyles();

  useEffect(() => {
    props.setTitle("Settings");
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Fade in={true} timeout={750}>
            <Paper className={classes.paper}>
              <h3>General</h3>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell align="left"><Typography align="left">Enable dark theme</Typography></TableCell>
                    <TableCell align="right"><Switch name="checkedDarkMode"
                      color="secondary"
                      checked={props.useDarkMode}
                      onChange={(e) => { props.handleThemeChange(e.target.checked) }} /></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </Fade>
        </Grid>
      </Grid>
    </div>

  );
}