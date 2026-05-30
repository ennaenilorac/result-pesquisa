const dados = {
  prontuario: {
    titulo: "Prontuário",
    opcoes: [
      "Nome",
      "Nome da mãe",
      "Data de nascimento",
      "CPF",
      "Número do prontuário",
      "Prontuário do paciente",
      "Agendas",
      "Exames realizados"
    ]
  },

  financeiro: {
    titulo: "Financeiro",
    opcoes: [
      "Procedimento",
      "Pagamento",
      "Recebimento",
      "Faturamento",
      "Empresa"
    ]
  },

  agenda: {
    titulo: "Agenda",
    opcoes: [
      "Agenda médica",
      "Agenda do paciente",
      "Datas"
    ]
  },

  faturamento: {
    titulo: "Faturamento",
    opcoes: [
      "Convênios",
      "Datas de pagamento",
      "Procedimento realizado"
    ]
  }
};

function abrirPagina(tipo) {
  const paginaInicial = document.getElementById("paginaInicial");
  const paginaDetalhes = document.getElementById("paginaDetalhes");
  const tituloDetalhe = document.getElementById("tituloDetalhe");
  const opcoesDetalhe = document.getElementById("opcoesDetalhe");

  paginaInicial.classList.add("escondido");
  paginaDetalhes.classList.remove("escondido");

  tituloDetalhe.textContent = dados[tipo].titulo;

  opcoesDetalhe.innerHTML = "";

  dados[tipo].opcoes.forEach(function(item) {
    const botao = document.createElement("button");

    botao.classList.add("opcao");

    botao.textContent = item;

    botao.addEventListener("click", function() {
      alert("Você clicou em: " + item);
    });

    opcoesDetalhe.appendChild(botao);
  });
}

function voltarInicio() {
  document.getElementById("paginaDetalhes").classList.add("escondido");
  document.getElementById("paginaInicial").classList.remove("escondido");
}