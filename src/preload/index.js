import { contextBridge, ipcRenderer } from 'electron'

let bridge = {
  updateMessage: (callback) => ipcRenderer.on('updateMessage', callback)
}

contextBridge.exposeInMainWorld('bridge', bridge)

if (!process.contextIsolated) {
  throw new Error('ContextIsolation must be enabled in the BrowserWindow')
}
try {
  contextBridge.exposeInMainWorld('context', {})
} catch (err) {
  console.log(err)
}
