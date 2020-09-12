import React, { useEffect } from 'react';
import { Grid, Fade } from '@material-ui/core';

import HourCard from './HourCard';
import WeekGraphCard from './WeekGraphCard';
import DailyReportCard from './DailyReportCard';

export default function Statistics(props) {

  useEffect(() => {
    props.setTitle("Statistics");
  }, []);

  const getMondayThisWeek = _ => {
    let today = new Date();
    let offset = today.getDay() - 1;
    let result;
    if (offset < 0) {
      result = new Date(today.setDate(today.getDate() - 6));
    }
    else {
      result = new Date(today.setDate(today.getDate() - offset));
    }

    result.setHours(0, 0, 0, 0);

    return result;
  }

  const getMonthStart = _ => {
    let today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
  }

  const hoursWorkedOnDate = date => {
    let secondsWorked = 0.0;
    props.activities.forEach((activity) => {
      secondsWorked += (activity.getLoggedTimeOnDate(date) / 1000);
    });

    return (secondsWorked / 3600).toFixed(1);
  }

  const hoursWorkedAfterDate = date => {
    let secondsWorked = 0.0;
    props.activities.forEach((activity) => {
      secondsWorked += (activity.getLoggedTimeAfterDate(date) / 1000);
    })

    return (secondsWorked / 3600).toFixed(1);
  }

  const hoursWorkedToday = _ => {
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    return hoursWorkedAfterDate(today);
  }

  const hoursWorkedThisWeek = _ => {
    let mondayThisWeek = getMondayThisWeek();
    mondayThisWeek.setDate(mondayThisWeek.getDate() - 1);
    let hoursWorkedWeek = hoursWorkedAfterDate(mondayThisWeek);

    return hoursWorkedWeek;
  }

  const hoursWorkedThisMonth = _ => {
    let firstDayMonth = getMonthStart();
    let hoursWorkedMonth = hoursWorkedAfterDate(firstDayMonth);
    return Math.ceil(hoursWorkedMonth);
  }

  const weekWorkedData = _ => {
    let weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    let weekStart = getMondayThisWeek();
    let weekData = [];

    weekDays.forEach((weekDay, index) => {
      let date = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + index);
      weekData.push({ "name": weekDay, "Hours": hoursWorkedOnDate(date) });
    })

    return weekData;
  }

  const dailyWork = _ => {
    let activityTime = [];
    let today = new Date();
    props.activities.forEach((activity) => {
      let secondsWorked = (activity.getLoggedTimeOnDate(today) / 1000);
      if (secondsWorked > 0) {
        activityTime.push({ "title": activity.title, "hours": (secondsWorked / 3600).toFixed(1) + "h" });
      }
    });

    return activityTime;
  }

  return (
    <div>
      <Grid container spacing={0} alignItems="center" justify="center">
        <Grid container direction="row" justify="center" >
          <Fade in={true} timeout={500}>
            <Grid item xs={4}>
              <HourCard hours={hoursWorkedToday()} text={"Hours worked today"} />
            </Grid>
          </Fade>
          <Fade in={true} timeout={500} style={{ transitionDelay: '100ms' }}>
            <Grid item xs={4}>
              <HourCard hours={hoursWorkedThisWeek()} text={"Hours worked week"} />
            </Grid>
          </Fade>
          <Fade in={true} timeout={500} style={{ transitionDelay: '200ms' }}>
            <Grid item xs={4}>
              <HourCard hours={hoursWorkedThisMonth()} text={"Hours worked month"} />
            </Grid>
          </Fade>
        </Grid>
        <Grid container direction="row" justify="center">
          <Grid item xs={12}>
            <Fade in={true} timeout={500} style={{ transitionDelay: '300ms' }}>
              <WeekGraphCard data={weekWorkedData()} text={"Time spent the last five days"} />
            </Fade>
          </Grid>
        </Grid>
        <Grid container direction="row" justify="center">
          <Grid item xs={12}>
            <Fade in={true} timeout={500} style={{ transitionDelay: '400ms' }}>
              <DailyReportCard data={dailyWork()} text={"Daily report"} />
            </Fade>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}
