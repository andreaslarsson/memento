const msToTimeString = ms => {
   //Get hours from milliseconds
   var hours = ms / (1000 * 60 * 60);
   var absoluteHours = Math.floor(hours);
   var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

   //Get remainder from hours and convert to minutes
   var minutes = (hours - absoluteHours) * 60;
   var absoluteMinutes = Math.floor(minutes);
   var m = absoluteMinutes > 9 ? absoluteMinutes : '0' + absoluteMinutes;

   //Get remainder from minutes and convert to seconds
   var seconds = (minutes - absoluteMinutes) * 60;
   var absoluteSeconds = Math.floor(seconds);
   var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;

   return h + ':' + m + ':' + s;
};

const dateCompare = (date1, date2) => {
  if (!date1 instanceof Date || !date2 instanceof Date) return false;

  return date1.getFullYear() === date2.getFullYear() && 
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
}

const isDateAfter = (date1, date2) => {
  let a = new Date(date1);
  let b = new Date(date2);

  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);

  return a >= b;

}

const getLoggedTimeOnDate = (timeEntries, currentTimeEntry, date) => {
  var accumulatedTime = 0;

  timeEntries.forEach(timeEntry => {
      if (dateCompare(timeEntry.startTime, date)) {
          accumulatedTime += (timeEntry.endTime.getTime() - timeEntry.startTime.getTime());
      }
  });

  if (currentTimeEntry && dateCompare(date, new Date())) {
    accumulatedTime += (new Date() - currentTimeEntry.startTime);
}


  return accumulatedTime;
}

const getLoggedTimeAfterDate = (timeEntries, currentTimeEntry, date) => {
  var accumulatedTime = 0;

  timeEntries.forEach(timeEntry => {
      if (isDateAfter(timeEntry.startTime, date)) {
          accumulatedTime += (timeEntry.endTime.getTime() - timeEntry.startTime.getTime());
      }
  });

  if (currentTimeEntry && isDateAfter(new Date(), date)) {
    accumulatedTime += (new Date() - currentTimeEntry.startTime);
}

  return accumulatedTime;
}

const getLoggedTime = (timeEntries, currentTimeEntry, toTime = true) => {
  // Iterate all timeEntries and get its time property. 
  var accumulatedTime = 0;
  var today = new Date();
  timeEntries.forEach(timeEntry => {
      if (timeEntry.startTime.getDate() >= today.getDate()) {
          accumulatedTime += (timeEntry.endTime.getTime() - timeEntry.startTime.getTime());
      }
  });

  if (currentTimeEntry) {
    accumulatedTime += (new Date() - currentTimeEntry.startTime);
}

  return toTime ? msToTimeString(accumulatedTime) : accumulatedTime;
}


export {
  msToTimeString,
  dateCompare,
  isDateAfter,
  getLoggedTimeOnDate,
  getLoggedTimeAfterDate,
  getLoggedTime
};