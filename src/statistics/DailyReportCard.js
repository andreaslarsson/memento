import React from 'react';
import { Card, CardMedia, CardContent, Table, TableHead, TableBody, TableRow, TableCell, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    textAlign: 'center',
  },
  tableCell: {
    width: "100%"
  },
  textPlaceholder: {
    margin: "15px"
  }
}));

export default function DailyReportCard(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Card className={classes.card}>
        <CardMedia>
          {props.data.length > 0 ?
            <Table size="small" aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell component="th">Activity</TableCell>
                  <TableCell component="th">Duration</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.data.map((projectData) => (
                  <TableRow size="small" key={projectData.title}>
                    <TableCell className={classes.tableCell} align="left">
                      <Typography>{projectData.title}</Typography>
                    </TableCell>
                    <TableCell className={classes.tableCell} align="right">
                      <Typography>{projectData.hours}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            : <Typography className={classes.textPlaceholder} color="textSecondary">No time entries today</Typography>}
        </CardMedia>
        <CardContent>
          <Typography color="textSecondary">{props.text}</Typography>
        </CardContent>
      </Card>
    </React.Fragment>
  )
}