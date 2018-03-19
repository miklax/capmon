const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const { ipcRenderer } = require('electron');

const axios = require('axios');

let winpopup

var mcvalue = document.getElementById('mcval');
var oldValue = 0;
var intervalStatus = null;

//function Voice
function toggleVoiceTimer(){

  if(document.getElementById('voice').checked){
    playVoice()
    intervalStatus = setInterval(playVoice, 10000); //500000 za 5m
  } else {
    clearInterval(intervalStatus);
  }

  function playVoice (){
    let msg = new SpeechSynthesisUtterance(mcvalue.innerHTML.slice(0,-12) * 1000000000);
    console.log(msg)
    window.speechSynthesis.speak(msg);
    console.log('SOUND')
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

  if(document.getElementById('overhead').checked){
    ipcRenderer.send('window-state', true)
  } else {
    ipcRenderer.send('window-state', false)
  }
}

//change checkbox state on popup close
ipcRenderer.on('popup-closed-resp', (event) => {
  document.getElementById('overhead').checked = false
})
