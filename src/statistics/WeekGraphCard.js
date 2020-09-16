import React from 'react';
import { Card, CardMedia, CardContent, Divider, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { BarChart, XAxis, Tooltip, Bar, ResponsiveContainer } from 'recharts';

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    textAlign: 'center',
  }
}));

export default function WeekGraphCard(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Card className={classes.card}>
        <CardMedia>
          <ResponsiveContainer width="99%" height={200}>
            <BarChart data={props.data}>
              <XAxis dataKey="name" />
              <Tooltip />
              <Bar dataKey="Hours" fill="#f57c00" />
            </BarChart>
          </ResponsiveContainer>
        </CardMedia>
        <Divider />
        <CardContent>
          <Typography color="textSecondary">{props.text}</Typography>
        </CardContent>
      </Card>
    </React.Fragment>
  )
}