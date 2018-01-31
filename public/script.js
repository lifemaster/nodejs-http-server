const form = document.getElementById('form');

form.addEventListener('submit', e => {
  e.preventDefault();

  let formData = new FormData(form);

  sendData(formData)
    .then(response => {
      console.log(response);
      form.reset();
    })
    .catch(err => console.log(err));

});

function sendData(formData) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();

    xhr.open('POST', '/api');

    xhr.send(formData);

    xhr.onreadystatechange = function() {
      if (xhr.readyState != 4) {
        return;
      }

      if(xhr.status != 200) {
        reject(xhr.statusText);
      } else {
        resolve(xhr.response);
      }
    }
  });
}
