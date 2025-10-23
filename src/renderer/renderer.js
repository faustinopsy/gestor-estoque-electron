const formProduto = document.getElementById('form-produto');
const inputNome = document.getElementById('nome');
const inputSku = document.getElementById('sku');
const inputQuantidade = document.getElementById('quantidade');
const listaProdutos = document.getElementById('lista-produtos');
const mensagemErro = document.getElementById('mensagem-erro');


async function atualizarListaProdutos() {
  console.log('Renderer: Pedindo inventário ao main process...');
  try {
    const produtos = await window.api.getInventario();
    listaProdutos.innerHTML = '';
    if (produtos.length === 0) {
      listaProdutos.innerHTML = '<li>Nenhum produto cadastrado.</li>';
      return;
    }

    produtos.forEach(produto => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div>
          <span>${produto.nome}</span>
          <span class="sku">(SKU: ${produto.sku})</span>
        </div>
        <span>Qtd: ${produto.quantidade}</span>
      `;
      listaProdutos.appendChild(li);
    });

  } catch (error) {
    console.error("Erro ao buscar inventário:", error);
    mensagemErro.innerText = `Erro ao buscar produtos: ${error.message}`;
  }
}

async function adicionarProduto(event) {
  event.preventDefault(); 

  const dadosProduto = {
    nome: inputNome.value,
    sku: inputSku.value,
    quantidade: parseInt(inputQuantidade.value, 10)
  };
  
  console.log('Renderer: Enviando novo produto:', dadosProduto);
  mensagemErro.innerText = ''; 

  try {
    const novoProduto = await window.api.addProduto(dadosProduto);
    
    console.log('Renderer: Produto adicionado com sucesso:', novoProduto);
    formProduto.reset();
    await atualizarListaProdutos();

  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
    mensagemErro.innerText = error.message;
  }
}


formProduto.addEventListener('submit', adicionarProduto);

document.addEventListener('DOMContentLoaded', () => {
  console.log('Renderer: DOM carregado. Buscando lista inicial.');
  atualizarListaProdutos();
});