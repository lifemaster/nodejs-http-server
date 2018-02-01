const form = document.getElementById('form');

form.addEventListener('submit', e => {
  e.preventDefault();

  let formData = new FormData(form);

  sendData(formData)
    .then(res => {
      // const blob = new Blob([res.data], { type: res.contentType });
      console.log('------------------------------------------------');
      console.log(`Content-Type: ${res.contentType}`);
      console.log(`Content-Length: ${res.contentLength} bytes`);

      if (res.contentType.indexOf('application/json') != -1) {
        console.log('Data: ', JSON.parse(res.data));
      }
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
        resolve({
          data: xhr.response,
          contentType: xhr.getResponseHeader('Content-Type'),
          contentLength: xhr.getResponseHeader('Content-Length')
        });
      }
    }
  });
}
