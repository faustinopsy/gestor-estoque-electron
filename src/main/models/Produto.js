class Produto {
  /**
   * @param {string | null} id - O ID único (geralmente do banco)
   * @param {string} nome - O nome do produto
   * @param {string} sku - O código único de barras/SKU
   * @param {number} quantidade - A quantidade atual em estoque
   */
  constructor(id, nome, sku, quantidade = 0) {
    this.id = id;
    this.nome = nome;
    this.sku = sku;
    this.quantidade = quantidade;

    if (!nome || nome.trim() === '') {
      throw new Error("O nome do produto é obrigatório.");
    }
    if (!sku || sku.trim() === '') {
      throw new Error("O SKU do produto é obrigatório.");
    }
  }

  temEstoque() {
    return this.quantidade > 0;
  }
}

module.exports = Produto;