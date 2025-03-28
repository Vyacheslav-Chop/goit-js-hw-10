import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const stateInputs = form.querySelectorAll('input[name="state"]');

form.addEventListener('submit', handleSubmit);
console.dir(form);

function handleSubmit(event) {
  event.preventDefault();

  let delay = Number(form.elements.delay.value);

  let state;

  stateInputs.forEach(input => {
    if (input.checked) {
      state = input.value;
      console.log(state);
    }
  });

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  console.log(promise);

  promise
    .then(delay => {
      iziToast.success({
        message: `Fulfilled promise in ${delay}ms`,
        position: 'topRight',
        backgroundColor: '#4CAF50',
        messageColor: '#ffffff',
      });
    })
    .catch(delay => {
      iziToast.error({
        message: `Rejected promise in ${delay}ms`,
        position: 'topRight',
        backgroundColor: '#ef4040',
        messageColor: '#ffffff',
      });
    });

  form.reset();
}
