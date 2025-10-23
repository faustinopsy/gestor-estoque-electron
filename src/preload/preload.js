const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getInventario: () => ipcRenderer.invoke('estoque:getInventario'),
  addProduto: (dadosProduto) => ipcRenderer.invoke('estoque:addProduto', dadosProduto),
  removerProduto: (id) => ipcRenderer.invoke('estoque:removerProduto', id),
  editarProduto: (id, dadosProduto) => ipcRenderer.invoke('estoque:editarProduto', id, dadosProduto)
});

console.log('API interna exposta no window.api');