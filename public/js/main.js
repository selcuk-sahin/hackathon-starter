/* eslint-env jquery, browser */
$(document).ready(() => {

});

// todo add loading
// todo add cancel button logic
// todo add clipboard functionality
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
      const infoDiv = document.querySelector('div.mintAddressDiv');
      if(infoDiv.classList.contains('d-none')){
        infoDiv.classList.remove('d-none');
      }
      const infoMessage = infoDiv.querySelector('span.mintAddressText');
      infoMessage.innerHTML = res.data.paymentAddress;
      console.log("Server RESPONSE = >", res);
    });
}

function onAmountChange(amount){
  if(!amount){return;}
  const mintButton = document.querySelector('a#mintButton');
  mintButton.querySelector('span').innerHTML = `Mint ${amount} ${amount === '1' ? 'Token' : 'Tokens' }`;
}
