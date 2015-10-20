var minuteInMs = 1000 * 60;

function timerFactory(timespan) {
   var start = new Date();
   var distance = 25 * minuteInMs;
   var destination = new Date(start.valueOf() + distance);
   console.log(destination);
}


$("#timer1 .start-btn").click(function(){
   timerFactory();
});
