let timer;

self.onmessage = function(event) {
  if (event.data === 'startCountdown') {
    let seconds = 180;

    timer = setInterval(() => {
      if (seconds === 0) {
        clearInterval(timer);
        self.postMessage('countdownFinished');
      } else {
        self.postMessage(seconds);
        seconds--;
      }
    }, 1000);
  }
};