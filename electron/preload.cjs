const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  getPlatform: () => ipcRenderer.invoke('ta:get-platform'),
  exportPdf: (defaultFilename) => ipcRenderer.invoke('ta:export-pdf', defaultFilename),
  saveFile: (payload) => ipcRenderer.invoke('ta:save-file', payload),
});
