const {app, BrowserWindow, ipcMain, Menu, Tray} = require('electron');
const path = require('path');

let tray;
let window;

const createTray = () => {
  tray = new Tray(path.join(__dirname, './IconTemplate.png'))
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Open', click() { toggleWindow() } },
      { label: 'Back', click() { window.webContents.goBack() } },
      {type: 'separator'},
      { label: 'GitHub Home', click() { 
        window.loadURL('https://github.com'); if (!window.isVisible()) { showWindow(); } } },
      { label: 'Snippets', click() { 
        window.loadURL('https://github.com/chrisbrocklesby/Snippets/find/master'); if (!window.isVisible()) { showWindow(); }} },
        { label: 'Gists', click() { 
          window.loadURL('https://gist.github.com'); if (!window.isVisible()) { showWindow(); } } },
      {type: 'separator'},
      
      {type: 'separator'},
      { label: 'Quit', click() { app.quit(); } }
    ]);
    tray.setContextMenu(contextMenu);
}

const getWindowPosition = () => {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();

  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));
  const y = Math.round(trayBounds.y + trayBounds.height + 3);

  return {x: x, y: y}
}

const createWindow = () => {
  window = new BrowserWindow({
    height: 820,
    width: 1100,
    show: false,
    frame: false,
    fullscreenable: false,
    focusable: true,
    resizable: true,
    transparent: true,
    hasShadow: true
    });
    window.loadURL('https://github.com');

  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide();
    }
  })
}

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide();
  } else {
    showWindow();
  }
}

const showWindow = () => {
  const position = getWindowPosition();
  window.setPosition(position.x, position.y, false);
  window.show();
  window.focus();
}

ipcMain.on('show-window', () => {
  showWindow();
})

app.dock.hide();

app.on('ready', () => {
  createTray();
  createWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});