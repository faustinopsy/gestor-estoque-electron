const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true, // Isola o preload/API do seu renderer
      nodeIntegration: false  // Impede que o renderer acesse o Node.js
    }
  });

  mainWindow.loadFile('src/renderer/index.html');
  // mainWindow.webContents.openDevTools();
}

// --- Ciclo de Vida do Aplicativo ---
// O Electron só cria janelas quando o módulo 'app' está pronto.
app.whenReady().then(() => {
  createWindow();
  // Tratamento para macOS: recriar janela se o ícone do dock for clicado
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Trata o fechamento do aplicativo em Windows e Linux
app.on('window-all-closed', () => {
  // No macOS, é comum o app ficar ativo na barra de tarefas
  if (process.platform !== 'darwin') {
    app.quit();
  }
});