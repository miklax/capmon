const { ipcRenderer, remote } = require('electron');
const path = require('path');


//change display data IPC
ipcRenderer.on('async-mc-resp', (event, arg) => {
  var datamc = document.getElementById('datainfo')

  datamc.innerHTML = arg
})

const closediv = document.getElementById('linkclose');

closediv.addEventListener('click', function(event){
  var window = remote.getCurrentWindow();
  window.close();
});
