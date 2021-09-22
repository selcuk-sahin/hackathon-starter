/* eslint-env jquery, browser */
$(document).ready(() => {

});

function mint() {
  let mintForm = document.querySelector('form#mintForm');
  let amount = mintForm.querySelector('input#amount').value;
  let _csrf = mintForm.querySelector('input#_csrf').value;

  const postBody = {
    amount: amount,
    _csrf: _csrf
  }
  fetch('/mint', {
    method: 'POST',
    body: JSON.stringify(postBody),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  })
    .then(response => response.json())
    .then(json => {
      console.log("Server RESPONSE = >", json);
    });
}
