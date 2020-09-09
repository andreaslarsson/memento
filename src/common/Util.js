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

export {
  msToTimeString,
  dateCompare,
  isDateAfter
};