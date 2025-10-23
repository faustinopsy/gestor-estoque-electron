const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');


function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('src/renderer/index.html');
  // mainWindow.webContents.openDevTools();

  return mainWindow;
}

function registerIpcHandlers() {
  console.log("Registrando handlers IPC...");
  ipcMain.handle('estoque:getInventario', async () => {
    try {
      const inventario = estoqueService.getInventarioTotal();
      return inventario;
    } catch (error) {
      console.error("Erro ao buscar inventário:", error);
      throw error;
    }
  });

  ipcMain.handle('estoque:addProduto', async (event, dadosProduto) => {
    try {
      const novoProduto = estoqueService.adicionarProduto(dadosProduto);
      return novoProduto;
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      throw error; 
    }
  });

  console.log("Handlers IPC registrados.");
}

app.whenReady().then(() => {

  try {
    require('./services/DatabaseService');
    require('./services/EstoqueService');
    console.log("Serviços carregados e banco de dados pronto.");

  } catch (error) {
      console.error("Falha fatal ao carregar serviços:", error);
      app.quit();
      return;
  }
  registerIpcHandlers();
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
