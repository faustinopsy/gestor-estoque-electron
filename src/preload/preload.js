const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getInventario: () => ipcRenderer.invoke('estoque:getInventario'),
  addProduto: (dadosProduto) => ipcRenderer.invoke('estoque:addProduto', dadosProduto),

});

console.log('API interna exposta no window.api');