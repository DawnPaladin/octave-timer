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

function play(id) {
   document.getElementById(id).play();
}

function flash(selector) {
   function fadeOut(then) {
      $(selector).animate({opacity: 0}, "slow", then);
   }
   function fadeIn(then) {
      $(selector).animate({opacity: 1}, "fast", then);
   }
   fadeOut(fadeIn(fadeOut(fadeIn(fadeOut(fadeIn)))));
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
      },
		running: false
   };
   timer.interval = setInterval(function() {
      var displayText = twoDigit(timer.read().minutes) + ":" + twoDigit(timer.read().seconds) + "." + twoDigit(timer.read().milliseconds);
      timer.display.text(displayText);
      document.title = displayText.slice(0, -3) + " - Octave Timer";
      $('#octave-timer progress').attr('value', timer.checkPercentComplete());
      if (timer.checkPercentComplete() > 0.5 && halfway === false) {
         halfway = true;
         play('half-sound');
      }
      if (timer.checkPercentComplete() > 0.75 && threeQuarters === false) {
         threeQuarters = true;
         play('third-sound');
      }
      if (timer.read().totalMilliseconds < 9) {
         play('scale-sound');
         timer.complete();
      }
   }, 40);
   timer.stop = function(){
      clearInterval(timer.interval);
      $('.btn-primary').toggleClass('hidden');
      document.title = "Octave Timer";
		timer.running = false;
   };
	timer.complete = function() {
		timer.stop();
		flash('.timer-display');
		$('.timer-display').text("00:00.00");
		timer.running = false;
	};
   return timer;
}

function startTimer() {
	var minutes = $('#minutes-input').val();
   var seconds = $('#seconds-input').val();
   if (minutes === "" && seconds === "") {
      $('input').css('border', '1px solid red');
      return false;
   }
   $('input').css('border', '1px solid white');
   var timeToSet = 1000 * 60 * minutes + 1000 * seconds;
   $('.btn-primary').toggleClass('hidden');
   timer = timerFactory(timeToSet, $('#octave-timer'));
   play('octave-sound');
	timer.running = true;
}
$("#octave-timer .start-btn").click(startTimer);

$('#octave-timer .stop-btn').click(function(){
   timer.stop();
});

$('input').on('input', function() {
   localStorage.setItem("minutes", $('#minutes-input').val());
   localStorage.setItem("seconds", $('#seconds-input').val());
   $('input').css('border', '1px solid white');
});
$('#minutes-input').val(localStorage.getItem("minutes"));
$('#seconds-input').val(localStorage.getItem("seconds"));

$(document).keypress(function(event) {
	if (event.which == 13) { // pressed Enter
		if (typeof timer == "object" && timer.running) { // timer running
			timer.stop();
		} else {
			startTimer();
		}
	}
});
