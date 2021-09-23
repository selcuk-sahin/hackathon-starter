/* eslint-env jquery, browser */
$(document).ready(() => {

});

function mint() {
  const mintForm = document.querySelector('form#mintForm');
  const amountSelect = mintForm.querySelector('select#amount');
  const amount = amountSelect.options[amountSelect.selectedIndex].value;
  const _csrf = mintForm.querySelector('input#_csrf').value;

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
    .then(res => {
      const customAlert = Swal.mixin({
        showDenyButton: false,
        showCloseButton: true,
        confirmButtonText: 'Okay',
        denyButtonText: 'Cancel',
      });      
      customAlert.fire({ 
        title: 'Success!',
        text: res.message,
        icon: 'success'
      })
      res.data.paymentAddress
      console.log("Server RESPONSE = >", res);
    });
}

function onAmountChange(amount){
  const mintButton = document.querySelector('a#mintButton');
  mintButton.querySelector('span').innerHTML = `Mint ${amount} Token`
}
