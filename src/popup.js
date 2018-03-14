const ipcRenderer = require('ipcRenderer');
const remote = require('electron').remote;
const path = require('path');

var datamc = document.getElementById('datainfo');

// change display data IPC
ipcRenderer.on('async-mc-resp', (event, arg) => {
  alert(arg);
  datamc.innerHTML = arg;
})

const closediv = document.getElementById('linkclose');

closediv.addEventListener('click', function(event){
  var window = remote.getCurrentWindow();
  window.close();
});
