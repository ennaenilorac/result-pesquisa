const dados = {
  prontuario: {
    titulo: "Prontuário",
    opcoes: []
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

const camposProntuario = [
  { id: "nomePaciente", label: "Nome do Paciente", tipo: "text" },
  { id: "nomeMae", label: "Nome da Mãe", tipo: "text" },
  { id: "dataNascimento", label: "Data de Nascimento", tipo: "text", placeholder: "dd/mm/aaaa", mascara: "data", max: 10 },
  { id: "cpf", label: "CPF", tipo: "text", placeholder: "Somente 9 números", mascara: "cpf", max: 9 },
  { id: "rg", label: "RG", tipo: "text", placeholder: "Somente 8 números", mascara: "rg", max: 8 },
  { id: "numeroProntuario", label: "Número do Prontuário", tipo: "text" }
];

function criarCampo(campo) {
  return `
    <div class="campo-prontuario">
      <label for="${campo.id}">${campo.label}</label>

      <input
        type="${campo.tipo}"
        id="${campo.id}"
        placeholder="${campo.placeholder || "Digite " + campo.label.toLowerCase()}"
        ${campo.max ? `maxlength="${campo.max}"` : ""}
        ${campo.mascara ? `oninput="aplicarMascara(this, '${campo.mascara}')"` : ""}
      >
    </div>
  `;
}

function abrirPagina(tipo) {
  const paginaInicial = document.getElementById("paginaInicial");
  const paginaDetalhes = document.getElementById("paginaDetalhes");
  const tituloDetalhe = document.getElementById("tituloDetalhe");
  const opcoesDetalhe = document.getElementById("opcoesDetalhe");

  paginaInicial.classList.add("escondido");
  paginaDetalhes.classList.remove("escondido");

  tituloDetalhe.textContent = dados[tipo].titulo;
  opcoesDetalhe.innerHTML = "";

  if (tipo === "prontuario") {
    const camposHTML = camposProntuario
      .map(criarCampo)
      .join("");

    opcoesDetalhe.innerHTML = `
      <div class="formulario-prontuario">

        <h2>Pesquisa de Prontuário</h2>

        <div class="grid-prontuario">
          ${camposHTML}
        </div>

        <button
          class="btn-prontuario"
          onclick="pesquisarProntuario()"
        >
          Pesquisar Prontuário
        </button>

      </div>
    `;

    return;
  }

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

function aplicarMascara(input, tipo) {
  let valor = input.value.replace(/\D/g, "");

  if (tipo === "data") {
    valor = valor.slice(0, 8);

    if (valor.length > 4) {
      valor = valor.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
    } else if (valor.length > 2) {
      valor = valor.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    }
  }

  if (tipo === "cpf") {
    valor = valor.slice(0, 9);
  }

  if (tipo === "rg") {
    valor = valor.slice(0, 8);
  }

  input.value = valor;
}

function pesquisarProntuario() {
  const tituloDetalhe = document.getElementById("tituloDetalhe");
  const opcoesDetalhe = document.getElementById("opcoesDetalhe");

  let resultadoHTML = camposProntuario.map(campo => {
    const valor = document.getElementById(campo.id).value || "Não informado";

    return `
      <p>
        <b>${campo.label}:</b>
        ${valor}
      </p>
    `;
  }).join("");

  tituloDetalhe.textContent = "Resultado do Prontuário";

  opcoesDetalhe.innerHTML = `
    <div class="resultado-prontuario">
      <div class="item">
        <strong>Prontuário do Paciente</strong>
        ${resultadoHTML}
      </div>

      <button
        class="btn-voltar-pesquisa"
        onclick="abrirPagina('prontuario')"
      >
        Voltar para Pesquisa
      </button>
    </div>
  `;
}

function voltarInicio() {
  document.getElementById("paginaDetalhes").classList.add("escondido");
  document.getElementById("paginaInicial").classList.remove("escondido");
}