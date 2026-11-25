const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 360,
    minHeight: 620,
    title: 'TA Company — Studio & Price Calculator',
    backgroundColor: '#F8FAFC',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  const devUrl = process.env.ELECTRON_DEV_URL;
  if (devUrl) {
    mainWindow.loadURL(devUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('ta:get-platform', () => {
  return {
    platform: process.platform,
    version: app.getVersion(),
    isPackaged: app.isPackaged,
  };
});

ipcMain.handle('ta:export-pdf', async (_event, defaultFilename = 'TA-Company-Devis.pdf') => {
  if (!mainWindow) return { ok: false, reason: 'no-window' };
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Save Quote as PDF',
    defaultPath: defaultFilename,
    filters: [{ name: 'PDF Document', extensions: ['pdf'] }],
  });

  if (canceled || !filePath) {
    return { ok: false, canceled: true };
  }

  const pdfBuffer = await mainWindow.webContents.printToPDF({
    printBackground: true,
    pageSize: 'A4',
    margins: { top: 0.4, bottom: 0.4, left: 0.4, right: 0.4 },
  });

  fs.writeFileSync(filePath, pdfBuffer);
  return { ok: true, filePath };
});

ipcMain.handle('ta:save-file', async (_event, { defaultFilename, content, filters }) => {
  if (!mainWindow) return { ok: false, reason: 'no-window' };
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Save File Locally',
    defaultPath: defaultFilename || 'ta-export.txt',
    filters: filters || [{ name: 'All Files', extensions: ['*'] }],
  });

  if (canceled || !filePath) {
    return { ok: false, canceled: true };
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  return { ok: true, filePath };
});
