const Produto = require('../models/Produto');
const db = require('./DatabaseService'); 

class EstoqueService {
  constructor() {
    console.log("EstoqueService pronto para usar o banco de dados.");
  }

  adicionarProduto(dadosProduto) {
    try {
      
      const produtoValido = new Produto(
        null, 
        dadosProduto.nome,
        dadosProduto.sku,
        dadosProduto.quantidade || 0
      );

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
}

module.exports = new EstoqueService();