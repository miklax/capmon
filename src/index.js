const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const { ipcRenderer } = require('electron');

const axios = require('axios');

var mcvalue = document.getElementById('mcval');
var oldValue = 0;
var intervalStatus = null;

//function Voice
function playVoice(){

  if(document.getElementById('voice').checked){
    intervalStatus = setInterval(function(){
      let msg = new SpeechSynthesisUtterance(mcvalue.innerHTML.slice(0,-12));
      window.speechSynthesis.speak(msg);
    }, 500000);
  } else {
    clearInterval(intervalStatus);
  }
};

// get market cap - refresh is 5 min from API
function getMarketCapVal() {
  axios.get('https://api.coinmarketcap.com/v1/global/')
  .then(result => {
    const currentVal = result.data.total_market_cap_usd;
    mcvalue.innerHTML = currentVal.toLocaleString('en');

    if (currentVal >= oldValue)
    mcvalue.style.color = "#49c398";
    else
    mcvalue.style.color = "#f42b56";

    ipcRenderer.send('async-mc', currentVal.toLocaleString('en'))
    oldValue = currentVal;
  })
}

getMarketCapVal();
setInterval(getMarketCapVal, 30000);


function openOverhead(){

  const htmlPath = path.join('file://', __dirname, 'popup.html');
  let winpopup = new BrowserWindow({
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    width: 350,
    height: 35
  });

  winpopup.isResizable(true);

  winpopup.on('close', function() { win = null });
  winpopup.loadURL(htmlPath);
  winpopup.show();

  //DevTools
  winpopup.webContents.openDevTools()
}

ipcRenderer.on('async-mc-resp', (event, arg) => {
  alert(arg)
})
