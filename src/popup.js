const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;

const closediv = document.getElementById('link-close');

closediv.addEventListener('click', function(event){
  var window = remote.getCurrentWindow();
  window.close();
});
