/**
 * rea-lab-demo-export — teaching target only (self-owned).
 * Electron-shaped IPC + export path for static analysis / Evidence demos.
 * Does not require launching Electron in Codespaces.
 */
const { app, BrowserWindow, ipcMain } = stubElectron();
const path = require('path');
const { buildExportPayload } = require('../lib/exportPath');

function stubElectron() {
  // When Electron is absent (Codespaces inventory), provide minimal stubs so
  // require graphs stay readable; real Electron may replace this at runtime.
  try {
    return require('electron');
  } catch {
    return {
      app: {
        whenReady: () => Promise.resolve(),
        on: () => {},
        quit: () => {},
      },
      BrowserWindow: class {
        constructor() {
          this.webContents = { send() {} };
        }
        loadFile() {}
        on() {}
      },
      ipcMain: { handle() {}, on() {} },
    };
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 640,
    webPreferences: {
      preload: path.join(__dirname, '../preload/bridge.js'),
      contextIsolation: true,
    },
  });
  win.loadFile(path.join(__dirname, '../renderer/index.html'));
  return win;
}

ipcMain.handle('lab:export-snapshot', async (_evt, opts = {}) => {
  const payload = buildExportPayload({
    label: opts.label || 'codespaces-lab',
    includeMeta: opts.includeMeta !== false,
  });
  return { ok: true, payload };
});

ipcMain.handle('lab:list-routes', async () => {
  return {
    routes: [
      { id: 'home', path: '/' },
      { id: 'export', path: '/export' },
      { id: 'about', path: '/about' },
    ],
  };
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    /* noop for stub */
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

module.exports = { createWindow, buildExportPayload };
