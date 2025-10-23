class Movimentacao {
  /**
   * @param {string | null} id 
   * @param {string} produtoId
   * @param {'entrada' | 'saida'} tipo
   * @param {number} quantidade
   * @param {Date} data
   */
  constructor(id, produtoId, tipo, quantidade, data) {
    this.id = id;
    this.produtoId = produtoId;
    this.tipo = tipo;
    this.quantidade = quantidade;
    this.data = data || new Date();

    if (!produtoId) {
      throw new Error("O ID do produto é obrigatório para a movimentação.");
    }
    if (tipo !== 'entrada' && tipo !== 'saida') {
      throw new Error("O tipo da movimentação deve ser 'entrada' ou 'saida'.");
    }
    if (!quantidade || quantidade <= 0) {
      throw new Error("A quantidade movimentada deve ser maior que zero.");
    }
  }
}

module.exports = Movimentacao;