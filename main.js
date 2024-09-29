const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: false
    },
    icon: path.join(__dirname, 'img/duluper-original.ico'),
  });

  mainWindow.loadFile('html/index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

//index.html
ipcMain.on('open-external-link', (event, link) => {
  shell.openExternal(link);
});

//hash.html
ipcMain.on('hash-text', (event, text) => {
  const hash = crypto.createHash('sha256').update(text).digest('hex');
  event.sender.send('hashed-text', hash);
});

//cmd.html
ipcMain.on('execute-command', (event, command) => {
  switch (command) {
    case 'help':
      event.reply('command-output', 'Commands:\napp -i - Shows information about the app\n\nDuluper - Find out yourself\n\nversion - Find all the avaliable versions/update');
      break;

      //app
    case 'app -i':
      event.reply('command-output', 'Creator: Yeoh Zi Roy, Duluper\n\nCreated on: 2nd January 2024 7:03PM MST\n\nMade using: Electron\n\nInstaller created with: Electron-builder\n\nOpen source: No\n\nLicense: CC-BY-ND-4.0\n\nAvaliable Platforms: Windows');
      break;

        //Duluper
    case 'Duluper':
      event.reply('command-output', 'Duluper is cool');
      break;

      case 'version':
        const packageJsonPath = path.join(__dirname, 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        const executableVersion = packageJson.version;
    event.reply('command-output', `Redirecting to download page... Current exe version: ${executableVersion}`);
    shell.openExternal('https://duluper.blue/duluperapp/');
    break;

    // Add more cases for other commands as needed
    default:
      event.reply('command-output', `Command not recognized: ${command}`);
  }
});