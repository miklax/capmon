const { ipcRenderer, remote } = require('electron');
const path = require('path');

var datamc = document.getElementById('datainfo')
datamc.innerHTML = 'arg'

// change display data IPC
ipcRenderer.on('async-mc-resp', function (event, arg){
  alert(arg)

})

const closediv = document.getElementById('linkclose');

closediv.addEventListener('click', function(event){
  var window = remote.getCurrentWindow();
  window.close();
});
