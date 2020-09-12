const electron = require('electron');
const app = electron.app;
const { ipcMain } = require('electron')
const sqlite3 = require('sqlite3');
const path = require('path');
const isDev = require('electron-is-dev');
var fs = require('fs');
const BrowserWindow = electron.BrowserWindow;

let mainWindow;
let db;

const LOCAL_DATABASE = app.getPath('userData') + (isDev ? '/memento_dev.db' : '/memento.db');

function setupDatabase() {
  if (fs.existsSync(LOCAL_DATABASE)) {
    console.log(`Found local database: ${LOCAL_DATABASE}`);
    return;
  }
  else {
    console.log(`No database found. Creating new local database: ${LOCAL_DATABASE}`);
    db = new sqlite3.Database(LOCAL_DATABASE);
    db.serialize(function () {
      db.run(`CREATE TABLE activities(
        id STRING NOT NULL,
        title STRING NOT NULL,
        is_active INTEGER NOT NULL,
        current_timeentry STRING,
        time_entries STRING,
        tags STRING,
        show INTEGER,
        PRIMARY KEY(id))`);
    })
    db.close();
  }
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: (isDev ? 900 : 550),
    height: 680,
    minWidth: 450,
    minHeight: 300,
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true
    },
    backgroundThrottling: false
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  setupDatabase();
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    db.close();
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('save-activities', (event, arg) => {
  console.log("Saving activities to local database");
  let db = new sqlite3.Database(LOCAL_DATABASE);

  db.serialize(function () {
    db.run(`DELETE FROM activities;`);
    for (const act of arg) {
      db.run("INSERT INTO activities VALUES (?, ?, ?, ?, ?, ?, ?)",
        [act.id, act.title, act.isActive, JSON.stringify(act.currentTimeEntry), JSON.stringify(act.timeEntries), act.tags, act.show]);
    }
  });
  db.close();
  console.log("Saving activities to local database done!");
  return;
})

ipcMain.on('read-activities', (event, arg) => {
  console.log("Reading activities from local database");
  var res;
  let db = new sqlite3.Database(LOCAL_DATABASE);

  db.serialize(() => {
    db.all("SELECT * FROM activities", [], (err, rows) => {
      res = [];
      if (err) {
        throw err;
      }
      rows.forEach((row) => {
        res.push(row);
      });
      event.returnValue = res;
      event.sender.send('read-from-file-reply');
      db.close();
    });
  })
})

