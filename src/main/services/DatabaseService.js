const path = require('path');
const { app } = require('electron');
const Database = require('better-sqlite3');

const dbPath = path.join(app.getPath('userData'), 'estoque.sqlite3');

class DatabaseService {
  constructor() {
    try {
      this.db = new Database(dbPath, { verbose: console.log }); 
      console.log('Conectado ao banco de dados SQLite em:', dbPath);
      this.initDatabase();
    } catch (error) {
      console.error("Falha ao conectar ou inicializar o banco:", error);
      throw error;
    }
  }

  initDatabase() {
    const createProdutosTable = `
      CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        sku TEXT NOT NULL UNIQUE,
        quantidade INTEGER NOT NULL DEFAULT 0,
        dataCriacao DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    const createMovimentacoesTable = `
      CREATE TABLE IF NOT EXISTS movimentacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        produtoId INTEGER NOT NULL,
        tipo TEXT NOT NULL CHECK(tipo IN ('entrada', 'saida')),
        quantidade INTEGER NOT NULL,
        data DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (produtoId) REFERENCES produtos (id)
      );
    `;
    
    this.db.exec(createProdutosTable);
    this.db.exec(createMovimentacoesTable);
    console.log("Tabelas 'produtos' e 'movimentacoes' garantidas.");
  }

  all(sql, params = []) {
    const stmt = this.db.prepare(sql);
    return stmt.all(params);
  }

  get(sql, params = []) {
    const stmt = this.db.prepare(sql);
    return stmt.get(params);
  }
  
  run(sql, params = []) {
    const stmt = this.db.prepare(sql);
    return stmt.run(params);
  }
}

module.exports = new DatabaseService();