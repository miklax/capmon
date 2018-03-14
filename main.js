const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const path = require('path')
const url = require('url')

//global window zbog garbage collector.
let win
let winpopup


function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 550, height: 220})
  win.setResizable(false);

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'src/index.html'),
    protocol: 'file:',
    slashes: true
  }))


  win.webContents.openDevTools()


  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null
    app.quit(); //close all windows and quit.
  })

  //create popup window
  const htmlPath = path.join('file://', __dirname, 'src/popup.html');
  winpopup = new BrowserWindow({
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    width: 350,
    height: 35
  });

  winpopup.isResizable(true);

  winpopup.on('close', function() { win = null });
  winpopup.loadURL(htmlPath);
  // winpopup.show();

  //DevTools
  winpopup.webContents.openDevTools()

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
ipcMain.on('async-mc', (event, arg) => {
  console.log('recieve ' + arg)
  winpopup.webContents.send('async-mc-resp', arg)
})
