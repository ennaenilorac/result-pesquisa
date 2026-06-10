const dados = {
  prontuario: { titulo: "Prontuário" },
  financeiro: { titulo: "Financeiro" },
  agenda: { titulo: "Agenda" },
  faturamento: { titulo: "Faturamento" }
};

const bancoPacientes = [
  {
    nomePaciente: "Thiago Silva",
    nomeMae: "Maria Silva",
    dataNascimento: "10/05/2000",
    cpf: "12345678901",
    rg: "123456789",
    numeroProntuario: "001"
  },
  {
    nomePaciente: "Tiago Silva",
    nomeMae: "Maria Silva",
    dataNascimento: "10/05/2000",
    cpf: "12345678901",
    rg: "123456789",
    numeroProntuario: "002"
  },
  {
    nomePaciente: "Ana Caroline",
    nomeMae: "Joceli Valeria",
    dataNascimento: "28/06/1998",
    cpf: "46165302890",
    rg: "357951486",
    numeroProntuario: "003"
  }
];

const camposProntuario = [
  { id: "nomePaciente", label: "Nome do Paciente", tipo: "text" },
  { id: "nomeMae", label: "Nome da Mãe", tipo: "text" },
  { id: "dataNascimento", label: "Data de Nascimento", tipo: "text", placeholder: "dd/mm/aaaa", mascara: "data", max: 10 },
  { id: "cpf", label: "CPF", tipo: "text", placeholder: "11 números", mascara: "cpf", max: 11 },
  { id: "rg", label: "RG", tipo: "text", placeholder: "9 números", mascara: "rg", max: 9 },
  { id: "numeroProntuario", label: "Número do Prontuário", tipo: "text" }
];

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/th/g, "t")
    .trim();
}

function criarCampo(campo) {
  return `
    <div class="campo-prontuario">
      <label>${campo.label}</label>

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
    const camposHTML = camposProntuario.map(criarCampo).join("");

    opcoesDetalhe.innerHTML = `
      <div class="formulario-prontuario">
        <h2>Pesquisa de Prontuário</h2>

        <div class="grid-prontuario">
          ${camposHTML}
        </div>

        <button class="btn-prontuario" onclick="pesquisarProntuario()">
          Pesquisar Prontuário
        </button>
      </div>
    `;

    return;
  }

  opcoesDetalhe.innerHTML = `
    <button class="opcao">Opção de ${dados[tipo].titulo}</button>
  `;
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
    valor = valor.slice(0, 11);
  }

  if (tipo === "rg") {
    valor = valor.slice(0, 9);
  }

  input.value = valor;
}

function pesquisarProntuario() {
  const busca = {};

  camposProntuario.forEach(campo => {
    busca[campo.id] = document.getElementById(campo.id).value.trim();
  });

  const resultados = bancoPacientes.filter(paciente => {
    const mesmoNome =
      normalizar(paciente.nomePaciente).includes(normalizar(busca.nomePaciente)) ||
      normalizar(busca.nomePaciente).includes(normalizar(paciente.nomePaciente));

    const mesmoNomeMae =
      busca.nomeMae === "" ||
      normalizar(paciente.nomeMae).includes(normalizar(busca.nomeMae));

    const mesmoCpf =
      busca.cpf === "" || paciente.cpf === busca.cpf;

    const mesmoRg =
      busca.rg === "" || paciente.rg === busca.rg;

    const mesmoProntuario =
      busca.numeroProntuario === "" ||
      paciente.numeroProntuario === busca.numeroProntuario;

    const nomeParecidoComMesmoDocumento =
      normalizar(paciente.nomePaciente) === normalizar(busca.nomePaciente) &&
      mesmoNomeMae &&
      mesmoCpf &&
      mesmoRg;

    return (
      mesmoNome ||
      nomeParecidoComMesmoDocumento ||
      mesmoCpf ||
      mesmoRg ||
      mesmoProntuario
    );
  });

  mostrarResultados(resultados);
}

function mostrarResultados(resultados) {
  const tituloDetalhe = document.getElementById("tituloDetalhe");
  const opcoesDetalhe = document.getElementById("opcoesDetalhe");

  tituloDetalhe.textContent = "Resultados Encontrados";

  if (resultados.length === 0) {
    opcoesDetalhe.innerHTML = `
      <div class="resultado-prontuario">
        <div class="item">
          <strong>Nenhum prontuário encontrado</strong>
          <p>Tente pesquisar novamente com outro dado.</p>
        </div>

        <button class="btn-voltar-pesquisa" onclick="abrirPagina('prontuario')">
          Voltar para Pesquisa
        </button>
      </div>
    `;
    return;
  }

  const cards = resultados.map((paciente, index) => `
    <div class="card-resultado">
      <h3>${paciente.nomePaciente}</h3>
      <p><b>Nome da mãe:</b> ${paciente.nomeMae}</p>
      <p><b>Data de nascimento:</b> ${paciente.dataNascimento}</p>
      <p><b>CPF:</b> ${paciente.cpf}</p>
      <p><b>RG:</b> ${paciente.rg}</p>
      <p><b>Número do prontuário:</b> ${paciente.numeroProntuario}</p>

      <button onclick="escolherPaciente(${index})">
        Escolher este paciente
      </button>
    </div>
  `).join("");

  sessionStorage.setItem("resultadosProntuario", JSON.stringify(resultados));

  opcoesDetalhe.innerHTML = `
    <div class="lista-resultados">
      ${cards}
    </div>
  `;
}

function escolherPaciente(index) {
  const resultados = JSON.parse(sessionStorage.getItem("resultadosProntuario"));
  const paciente = resultados[index];

  const tituloDetalhe = document.getElementById("tituloDetalhe");
  const opcoesDetalhe = document.getElementById("opcoesDetalhe");

  tituloDetalhe.textContent = "Prontuário Selecionado";

  opcoesDetalhe.innerHTML = `
    <div class="resultado-prontuario">
      <div class="item">
        <strong>Prontuário do Paciente</strong>

        <p><b>Nome do paciente:</b> ${paciente.nomePaciente}</p>
        <p><b>Nome da mãe:</b> ${paciente.nomeMae}</p>
        <p><b>Data de nascimento:</b> ${paciente.dataNascimento}</p>
        <p><b>CPF:</b> ${paciente.cpf}</p>
        <p><b>RG:</b> ${paciente.rg}</p>
        <p><b>Número do prontuário:</b> ${paciente.numeroProntuario}</p>
      </div>

      <div class="botoes-final">
        <button class="btn-voltar-pesquisa" onclick="abrirPagina('prontuario')">
          Voltar para Pesquisa
        </button>

        <button class="btn-gerar-prontuario" onclick="gerarProntuario()">
          Gerar Prontuário
        </button>
      </div>
    </div>
  `;
}

function gerarProntuario() {

  const resultados =
    JSON.parse(
      sessionStorage.getItem("resultadosProntuario")
    );

  const paciente =
    resultados[0];

  sessionStorage.setItem(
    "nomePaciente",
    paciente.nomePaciente
  );

  sessionStorage.setItem(
    "nomeMae",
    paciente.nomeMae
  );

  sessionStorage.setItem(
    "dataNascimento",
    paciente.dataNascimento
  );

  sessionStorage.setItem(
    "cpf",
    paciente.cpf
  );

  sessionStorage.setItem(
    "rg",
    paciente.rg
  );

  sessionStorage.setItem(
    "numeroProntuario",
    paciente.numeroProntuario
  );

  window.location.href =
    "prontuario.html";
}

function voltarInicio() {
  document.getElementById("paginaDetalhes").classList.add("escondido");
  document.getElementById("paginaInicial").classList.remove("escondido");
}