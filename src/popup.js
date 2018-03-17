const remote = require('electron').remote;
const path = require('path');
const { ipcRenderer } = require('electron');

var datamc = document.getElementById('datainfo');

//ok win created
ipcRenderer.send('window-created', true)

// change display data IPC
ipcRenderer.on('async-mc-resp', (event, arg) => {
  datamc.innerHTML = arg;
})

const closediv = document.getElementById('linkclose');

closediv.addEventListener('click', function(event){
  ipcRenderer.send('popup-closed')
  var window = remote.getCurrentWindow();
  window.close();
});
