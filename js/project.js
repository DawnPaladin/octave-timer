var minuteInMs = 1000 * 60;

function readableTimespan(milliseconds) {
   var secondSize = 1000;
   var minuteSize = secondSize * 60;
   var hourSize = minuteSize * 60;
   var daySize = hourSize * 24;

   var msRemaining = milliseconds;
   var days = Math.floor(msRemaining / daySize);
   msRemaining -= days * daySize;
   var hours = Math.floor(msRemaining / hourSize);
   msRemaining -= hours * hourSize;
   var minutes = Math.floor(msRemaining / minuteSize);
   msRemaining -= minutes * minuteSize;
   var seconds = Math.floor(msRemaining / secondSize);

   return {
      seconds: seconds,
      minutes: minutes,
      hours: hours,
      days: days,
   };
}

function timerFactory(timespan) {
   var start = new Date();
   var distance = 25 * minuteInMs;
   var destination = new Date(start.valueOf() + distance);
   return {
      destination: destination,
      read: function() {
         var timeRemaining = this.destination - Date.now();
         return readableTimespan(timeRemaining);
      }
   };
}

$("#timer1 .start-btn").click(function(){
   var timer = timerFactory();
   console.log(timer.read());
});
