const Produto = require('../models/Produto');

class EstoqueService {
  constructor() {
    this.produtos = [];
    this.idCounter = 1;
  }

  adicionarProduto(dadosProduto) {
    try {
      const novoProduto = new Produto(
        this.idCounter.toString(),
        dadosProduto.nome,
        dadosProduto.sku,
        dadosProduto.quantidade
      );

      const skuExistente = this.produtos.find(p => p.sku === novoProduto.sku);
      if (skuExistente) {
        throw new Error(`O SKU '${novoProduto.sku}' já está cadastrado.`);
      }

      this.idCounter++;
      this.produtos.push(novoProduto);
      console.log('Produto adicionado:', novoProduto);
      return novoProduto;

    } catch (error) {
      console.error("Erro ao adicionar produto:", error.message);
      throw error; 
    }
  }

  getInventarioTotal() {
    console.log("Buscando inventário:", this.produtos);
    return this.produtos;
  }

  buscarProdutoPorSku(sku) {
    return this.produtos.find(p => p.sku === sku);
  }

}

module.exports = new EstoqueService();