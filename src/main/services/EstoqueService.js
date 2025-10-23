const Produto = require('../models/Produto');
const db = require('./DatabaseService'); 

class EstoqueService {
  constructor() {
    console.log("EstoqueService pronto para usar o banco de dados.");
  }

  adicionarProduto(dadosProduto) {
    try {
      const produtoValido = new Produto(null, dadosProduto.nome, dadosProduto.sku, dadosProduto.quantidade || 0 );
      const sql = `INSERT INTO produtos (nome, sku, quantidade) VALUES (?, ?, ?)`;
      const params = [produtoValido.nome, produtoValido.sku, produtoValido.quantidade];
      const resultado = db.run(sql, params);
      
      console.log('Produto salvo no banco:', resultado);
      produtoValido.id = resultado.lastInsertRowid;
      return produtoValido;

    } catch (error) {
      console.error("Erro ao adicionar produto no banco:", error.message);
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new Error(`O SKU '${dadosProduto.sku}' já está cadastrado.`);
      }
      throw error;
    }
  }

  getInventarioTotal() {
    const sql = `SELECT * FROM produtos ORDER BY nome ASC`;
    const linhas = db.all(sql);
    return linhas.map(l => new Produto(l.id, l.nome, l.sku, l.quantidade));
  }

  buscarProdutoPorSku(sku) {
    const sql = `SELECT * FROM produtos WHERE sku = ?`;
    const linha = db.get(sql, [sku]);
    if (linha) {
      return new Produto(linha.id, linha.nome, linha.sku, linha.quantidade);
    }
    return undefined;
  }
  buscarProdutoPorId(id) {
    const sql = `SELECT * FROM produtos WHERE id = ?`;
    const linha = db.get(sql, [id]);
    if (linha) {
      return new Produto(linha.id, linha.nome, linha.sku, linha.quantidade);
    }
    return undefined;
  }

  editarProduto(id, dadosProduto) {
    try {
      const nome = dadosProduto.nome;
      const sku = dadosProduto.sku;
      const quantidade = parseInt(dadosProduto.quantidade, 10) || 0;
      if (!nome || nome.trim() === '') {
        throw new Error("O nome do produto é obrigatório.");
      }
      if (!sku || sku.trim() === '') {
        throw new Error("O SKU do produto é obrigatório.");
      }

      const sql = `UPDATE produtos SET nome = ?, sku = ?, quantidade = ? WHERE id = ?
      `;
      const params = [nome, sku, quantidade, id];
      const resultado = db.run(sql, params);
      if (resultado.changes === 0) {
        throw new Error("Produto não encontrado para edição.");
      }
      return this.buscarProdutoPorId(id);

    } catch (error) {
      console.error("Erro ao editar produto:", error.message);
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new Error(`O SKU '${dadosProduto.sku}' já pertence a outro produto.`);
      }
      throw error;
    }
  }

  removerProduto(id) {
    try {
      const sqlMov = `DELETE FROM movimentacoes WHERE produtoId = ?`;
      db.run(sqlMov, [id]);
      const sqlProd = `DELETE FROM produtos WHERE id = ?`;
      const resultado = db.run(sqlProd, [id]);
      if (resultado.changes === 0) {
        throw new Error("Produto não encontrado para remoção.");
      }
      console.log(`Produto ${id} removido. Linhas afetadas:`, resultado.changes);
      return { success: true, changes: resultado.changes };

    } catch (error) {
      console.error("Erro ao remover produto:", error.message);
      throw error;
    }
  }
}
module.exports = new EstoqueService();