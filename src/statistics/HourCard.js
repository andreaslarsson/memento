import React from 'react';
import { Card, CardMedia, CardContent, Divider, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    textAlign: 'center',
  },
  media: {
    height: 75,
  },
}));

export default function HourCard(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Card className={classes.card}>
        <CardMedia className={classes.media}>
          <Typography variant="h3">{props.hours}</Typography>
        </CardMedia>
        <Divider />
        <CardContent>
          <Typography color="textSecondary">{props.text}</Typography>
        </CardContent>
      </Card>
    </React.Fragment>
  )
}