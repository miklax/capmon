const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;

const axios = require('axios');

var mcvalue = document.getElementById('mcval');
var oldValue = 0;

//function Voice
function playVoice(){
  if(document.getElementById('voice').checked){
    setInterval(() => {
      let msg = new SpeechSynthesisUtterance('billions');
      window.speechSynthesis.speak(msg);
    }, 500000);
  };
};

//get market cap - refresh is 5 min from API
function getMarketCapVal() {
  axios.get('https://api.coinmarketcap.com/v1/global/')
  .then(result => {
    const currentVal = result.data.total_market_cap_usd;
    mcvalue.innerHTML = '$ ' + currentVal.toLocaleString('en');

    if (currentVal > oldValue)
      mcvalue.style.color = "#49c398";
    else
      mcvalue.style.color = "#f42b56";

    oldValue = currentVal;
  })
}

getMarketCapVal();
setInterval(getMarketCapVal, 30000);











// notifyBtn.addEventListener('click', function(event){
//   const modalPath = path.join('file://', __dirname, 'add.html');
//   let win = new BrowserWindow({ frame: false, transparent: true, alwaysOnTop: true, width: 400, height: 200 });
//   win.on('close', function() { win = null });
//   win.loadURL(modalPath);
//   win.show();
// });
//
// ipc.on('targetPriceVal', function(event, arg){
//   targetPriceVal = Number(arg);
//   targetPrice.innerHTML = '$' + targetPriceVal.toLocaleString('en');
//   console.log(targetPriceVal);
// })
