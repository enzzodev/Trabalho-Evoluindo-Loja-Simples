// Pega referências dos elementos que já existem no HTML
const formProduto = document.querySelector("#form-produto");
const listaProdutos = document.querySelector("#lista-produtos");
const campoNome = document.querySelector("#nome");
const campoPreco = document.querySelector("#preco");
const campoQuantidade = document.querySelector("#quantidade");
const tituloFormulario = document.querySelector("#titulo-formulario");
const botaoFormulario = document.querySelector("#botao-formulario");
const botaoCancelar = document.querySelector("#botao-cancelar");
const mensagemErro = document.querySelector("#mensagem-erro");
const contador = document.querySelector("#contador");
const mensagemVazia = document.querySelector("#mensagem-vazia");

// Guarda o <li> que está sendo editado.
// Quando vale null, o formulário está no modo "Adicionar produto".
let itemEmEdicao = null;

// Coloca os dados do produto dentro do <li>
function preencherItem(item, nome, preco, quantidade) {
  // Guarda os valores no próprio <li> para devolvê-los ao formulário quando clicar em Editar
  item.dataset.nome = nome;
  item.dataset.preco = preco.toFixed(2);
  item.dataset.quantidade = quantidade;

  // Mostra o preço com vírgula: 12.5 vira "12,50"
  const precoFormatado = preco.toFixed(2).replace(".", ",");
  const texto = item.querySelector(".produto-texto");
  texto.textContent = `${nome} - R$ ${precoFormatado} (${quantidade} un.)`;
}

// Cria o <li> de um produto com os botões Editar e Remover
function criarItem(nome, preco, quantidade) {
  const item = document.createElement("li");

  // Texto do produto
  const texto = document.createElement("span");
  texto.classList.add("produto-texto");

  // Área que separa os botões do texto
  const areaBotoes = document.createElement("div");
  areaBotoes.classList.add("produto-botoes");

  const botaoEditar = document.createElement("button");
  botaoEditar.type = "button";
  botaoEditar.textContent = "Editar";
  botaoEditar.classList.add("botao-editar");

  const botaoRemover = document.createElement("button");
  botaoRemover.type = "button";
  botaoRemover.textContent = "Remover";
  botaoRemover.classList.add("botao-remover");

  botaoEditar.addEventListener("click", function () {
    comecarEdicao(item);
  });

  botaoRemover.addEventListener("click", function () {
    // Se o produto removido estava sendo editado, o formulário volta ao normal
    if (item === itemEmEdicao) {
      voltarAoNormal();
    }

    // Remove somente este produto da lista
    item.remove();
    atualizarContador();
  });

  areaBotoes.appendChild(botaoEditar);
  areaBotoes.appendChild(botaoRemover);
  item.appendChild(texto);
  item.appendChild(areaBotoes);

  preencherItem(item, nome, preco, quantidade);
  return item;
}

// Leva os dados do produto de volta para o formulário
function comecarEdicao(item) {
  // Tira o destaque do produto que estava sendo editado antes (se tiver)
  if (itemEmEdicao !== null) {
    itemEmEdicao.classList.remove("em-edicao");
  }

  itemEmEdicao = item;
  item.classList.add("em-edicao");

  campoNome.value = item.dataset.nome;
  campoPreco.value = item.dataset.preco;
  campoQuantidade.value = item.dataset.quantidade;

  tituloFormulario.textContent = "Editar produto";
  botaoFormulario.textContent = "Salvar alterações";
  botaoCancelar.hidden = false;
  mensagemErro.textContent = "";
  campoNome.focus();
}

// Deixa o formulário no estado normal: vazio e com o botão "Adicionar produto"
function voltarAoNormal() {
  if (itemEmEdicao !== null) {
    itemEmEdicao.classList.remove("em-edicao");
  }

  itemEmEdicao = null;
  formProduto.reset();
  tituloFormulario.textContent = "Novo produto";
  botaoFormulario.textContent = "Adicionar produto";
  botaoCancelar.hidden = true;
  mensagemErro.textContent = "";
}

// Atualiza o contador e mostra a mensagem quando a lista estiver vazia
function atualizarContador() {
  const total = listaProdutos.children.length;
  contador.textContent = `Produtos cadastrados: ${total}`;
  mensagemVazia.hidden = total > 0;
}

// Escuta o evento de "enviar" do formulário
formProduto.addEventListener("submit", function (evento) {
  // Sem isso, o navegador recarregaria a página ao enviar o formulário
  evento.preventDefault();

  // Lê o valor digitado em cada campo
  const nome = campoNome.value;
  const preco = Number(campoPreco.value);
  const quantidade = Number(campoQuantidade.value);

  // Não deixa cadastrar produto com quantidade zero
  if (quantidade <= 0) {
    mensagemErro.textContent = "A quantidade deve ser maior que zero.";
    return;
  }

  if (itemEmEdicao === null) {
    // Modo adicionar: cria um novo item no final da lista
    const item = criarItem(nome, preco, quantidade);
    listaProdutos.appendChild(item);
    atualizarContador();
  } else {
    // Modo editar: atualiza o item que já existe, sem criar um novo
    preencherItem(itemEmEdicao, nome, preco, quantidade);
  }

  // Limpa o formulário e volta o botão para "Adicionar produto"
  voltarAoNormal();
});

botaoCancelar.addEventListener("click", function () {
  voltarAoNormal();
});

// Produtos que já aparecem ao abrir a página
listaProdutos.appendChild(criarItem("Caderno", 12.5, 30));
listaProdutos.appendChild(criarItem("Caneta", 2, 100));
listaProdutos.appendChild(criarItem("Mochila", 89.9, 8));
listaProdutos.appendChild(criarItem("Estojo", 15, 20));
atualizarContador();
