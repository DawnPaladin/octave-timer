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
   msRemaining -= seconds * secondSize;

   return {
      totalMilliseconds: milliseconds,
      milliseconds: msRemaining,
      seconds: seconds,
      minutes: minutes,
      hours: hours,
      days: days,
   };
}

function twoDigit(input) {
   var string = String(input);
   if (string.length > 2) {
      string = string.slice(0,2);
   } else if (string.length < 2) {
      string = "0" + string;
   }
   return string;
}

function timerFactory(distance, $element) {
   var start = new Date();
   var destination = new Date(start.valueOf() + distance);
   var halfway = false;
   var threeQuarters = false;
   var timer = {
      destination: destination,
      display: $element.find('.timer-display'),
      read: function() {
         var timeRemaining = this.destination - Date.now();
         return readableTimespan(timeRemaining);
      },
      checkPercentComplete: function() {
         var origTimespan = destination - start;
         var timeElapsed = Date.now() - start;
         return timeElapsed / origTimespan;
      }
   };
   timer.interval = setInterval(function() {
      var displayText = twoDigit(timer.read().minutes) + ":" + twoDigit(timer.read().seconds) + "." + twoDigit(timer.read().milliseconds);
      timer.display.text(displayText);
      $('#timer1 progress').attr('value', timer.checkPercentComplete());
      if (timer.checkPercentComplete() > 0.5 && halfway === false) {
         halfway = true;
         console.log("Halfway");
      }
      if (timer.checkPercentComplete() > 0.75 && threeQuarters === false) {
         threeQuarters = true;
         console.log("Three quarters");
      }
      if (timer.read().totalMilliseconds < 9) {
         console.warn("Pomodoro complete!");
         timer.stop();
      }
   }, 10);
   timer.stop = function(){ clearInterval(timer.interval); };
   return timer;
}

$("#timer1 .start-btn").click(function(){
   console.log("Start");
   var minutes = $('#minutes-input').val();
   var seconds = $('#seconds-input').val();
   var timeToSet = 1000 * 60 * minutes + 1000 * seconds;
   $('.btn-primary').toggleClass('hidden');
   timer = timerFactory(timeToSet, $('#timer1'));
});

$('#timer1 .stop-btn').click(function(){
   timer.stop();
   $('.btn-primary').toggleClass('hidden');
});
