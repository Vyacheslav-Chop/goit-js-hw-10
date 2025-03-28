import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const datetimePickerInput = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');

let userSelectedDate = null;
startBtn.disabled = true;
datetimePickerInput.disabled = false;

console.dir(datetimePickerInput);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  locale: {
    weekdays: {
      shorthand: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      longhand: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
    },
  },
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (!selectedDate) {
      return;
    }

    const currentTime = new Date();

    if (selectedDate <= currentTime) {
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startBtn.disabled = true;
      return;
    }

    userSelectedDate = selectedDate;
    startBtn.disabled = false;

    console.log(selectedDates[0]);
  },
};

const fp = flatpickr(datetimePickerInput, options);

datetimePickerInput.addEventListener('change', () => {
  fp.close();
});

const timerElement = document.querySelector('.timer');
const daysElement = timerElement.querySelector('[data-days]');
const hoursElement = timerElement.querySelector('[data-hours]');
const minutesElement = timerElement.querySelector('[data-minutes]');
const secondsElement = timerElement.querySelector('[data-seconds]');

startBtn.addEventListener('click', beginTimer);

let timerId = null;

function beginTimer() {
  if (!userSelectedDate) {
    return;
  }

  if (timerId) {
    clearInterval(timerId);
  }

  datetimePickerInput.disabled = true;
  startBtn.disabled = true;

  timerId = setInterval(() => {
    const currentTime = Date.now();
    const deltaTime = userSelectedDate - currentTime;

    if (deltaTime <= 0) {
      clearInterval(timerId);
      datetimePickerInput.disabled = false;
      startBtn.disabled = true;

      daysElement.textContent = addLeadingZero(0);
      hoursElement.textContent = addLeadingZero(0);
      minutesElement.textContent = addLeadingZero(0);
      secondsElement.textContent = addLeadingZero(0);

      return;
    }

    const { days, hours, minutes, seconds } = convertMs(deltaTime);

    daysElement.textContent = addLeadingZero(days);
    hoursElement.textContent = addLeadingZero(hours);
    minutesElement.textContent = addLeadingZero(minutes);
    secondsElement.textContent = addLeadingZero(seconds);
  }, 1000);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
