/* eslint-env jquery, browser */
$(document).ready(() => {

});

// todo add cancel button logic
// todo add clipboard functionality
function mint() {
  const mintForm = document.querySelector('form#mintForm');
  const amountSelect = mintForm.querySelector('select#amount');
  const amount = amountSelect.options[amountSelect.selectedIndex].value;
  const _csrf = mintForm.querySelector('input#_csrf').value;

  // Validate FORM

  toggleLoader(true);
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
      toggleLoader(false);
      const infoDiv = document.querySelector('div.mintAddressDiv');
      if (infoDiv.parentNode.classList.contains('d-none')) {
        infoDiv.parentNode.classList.remove('d-none');
      }
      const infoMessage = infoDiv.querySelector('span#mintAddressText');
      const infoPrice = infoDiv.querySelector('span#mintFee');
      const infoExpireTime = infoDiv.querySelector('span#mintExpire');
      infoMessage.innerHTML = res.data.paymentAddress;
      infoPrice.innerHTML = `${res.data.adaToSend} ₳`;
      let expireDate =  new Date(res.data.expires);
      infoExpireTime.innerHTML = expireDate.toLocaleString();
      console.log("Server RESPONSE = >", res);
    }).catch(error => {
      console.log("Server ERROR = >", error);
      toggleLoader(false);
    })
}

function onAmountChange(amount) {
  if (!amount) { return; }
  const mintButton = document.querySelector('a#mintButton');
  mintButton.querySelector('span').innerHTML = `Mint ${amount} ${amount === '1' ? 'Token' : 'Tokens'}`;
}

function toggleLoader(show = false) {
  const loadingEl = document.querySelector('div#preloader');
  if (loadingEl.getAttribute('style') === 'display: none;' && show) {
    loadingEl.removeAttribute('style');
  } else if (!show) {
    loadingEl.setAttribute('style', 'display: none;');
  }
}

function clipBoard(parentElement) {
  let text = parentElement.querySelector('span#mintAddressText').innerHTML;
  let button = parentElement.querySelector('a.checkmark');
  button.classList.add("active");
  navigator.clipboard.writeText(text).then(function () {
  }, function (err) {
    fallbackCopyTextToClipboard(text);
  });
}

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
  } catch (err) {
  }

  document.body.removeChild(textArea);
}
