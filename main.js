const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const path = require('path')
const url = require('url')

//global window zbog garbage collector.
let win
let winpopup
let winState = false
let mcValueUpdate = 0

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 550,
    height: 220,
    icon: path.join(__dirname, 'assets/icons/png/64x64.png')})
  win.setResizable(false);

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'src/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  //win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null
    app.quit(); //close all windows and quit.
  })

  var template = Menu.buildFromTemplate([
    {
      label: 'Info',
      submenu: [
        {
          label: 'Donate',
          click() {
            createDonation();
          }
        },
        {
          label: 'About',
          click() {
            createAbout();
          }
        },
        {type: 'separator'},
        {
          label: 'Exit',
          click() {
            app.quit();
          }
        },
      ]
    },
  ]);

  Menu.setApplicationMenu(template);
}

function overheadWindow(state){
  if (state){
      //create popup window
    const htmlPath = path.join('file://', __dirname, 'src/popup.html');
    winpopup = new BrowserWindow({
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      width: 350,
      height: 35
    });

    winpopup.isResizable(false);

    winpopup.loadURL(htmlPath);
    // winpopup.show();
    
    //DevTools
    //winpopup.webContents.openDevTools()
    sendToPopup(winState)
  } else {
    winpopup.close()
    winpopup.on('close', function() { winpopup = null });
  }
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

//about window
function createAbout(){
  const htmlPath = path.join('file://', __dirname, 'src/about.html');
  let aboutw = new BrowserWindow({
    width: 450,
    height: 350
  });

  aboutw.isResizable(false);

  aboutw.on('close', function() { win = null });
  aboutw.loadURL(htmlPath);
  aboutw.show();
}

//donate window
function createDonation(){
  const htmlPath = path.join('file://', __dirname, 'src/donations.html');
  let windonate = new BrowserWindow({
    width: 450,
    height: 350
  });

  windonate.isResizable(false);

  windonate.on('close', function() { win = null });
  windonate.loadURL(htmlPath);
  windonate.show();
}

// IPC IPC IPC
// update overhead window with data
ipcMain.on('async-mc', (event, arg) => {
  // console.log('recieved ' + arg)
  mcValueUpdate = arg
  // console.log('mcValueUpdate ' + mcValueUpdate)
  sendToPopup(winState)
})

//on/off overead window
ipcMain.on('window-state', (event, state) => {
  winState = state
  overheadWindow(state)
})

ipcMain.on('window-created', (event, arg) => {
  sendToPopup(arg)
})

ipcMain.on('popup-closed', (event) =>{
  win.webContents.send('popup-closed-resp')
})

function sendToPopup(wstate){
  if (wstate) {
    winpopup.webContents.send('async-mc-resp', mcValueUpdate)
  }
}