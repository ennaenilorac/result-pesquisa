const dados = {
  prontuario: {
    titulo: "Prontuário"
  },

  financeiro: {
    titulo: "Financeiro"
  },

  agenda: {
    titulo: "Agenda"
  },

  faturamento: {
    titulo: "Faturamento"
  }
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


// Lista que guarda vários pacientes selecionados
let pacientesSelecionados = [];


const camposProntuario = [
  {
    id: "nomePaciente",
    label: "Nome do Paciente",
    tipo: "text"
  },

  {
    id: "nomeMae",
    label: "Nome da Mãe",
    tipo: "text"
  },

  {
    id: "dataNascimento",
    label: "Data de Nascimento",
    tipo: "text",
    placeholder: "dd/mm/aaaa",
    mascara: "data",
    max: 10
  },

  {
    id: "cpf",
    label: "CPF",
    tipo: "text",
    placeholder: "11 números",
    mascara: "cpf",
    max: 11
  },

  {
    id: "rg",
    label: "RG",
    tipo: "text",
    placeholder: "9 números",
    mascara: "rg",
    max: 9
  },

  {
    id: "numeroProntuario",
    label: "Número do Prontuário",
    tipo: "text"
  }
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

      <label for="${campo.id}">
        ${campo.label}
      </label>

      <input
        type="${campo.tipo}"
        id="${campo.id}"

        placeholder="${
          campo.placeholder ||
          "Digite " + campo.label.toLowerCase()
        }"

        ${
          campo.max
            ? `maxlength="${campo.max}"`
            : ""
        }

        ${
          campo.mascara
            ? `oninput="aplicarMascara(this, '${campo.mascara}')"`
            : ""
        }
      >

    </div>
  `;
}


function abrirPagina(tipo) {
  const paginaInicial =
    document.getElementById("paginaInicial");

  const paginaDetalhes =
    document.getElementById("paginaDetalhes");

  const tituloDetalhe =
    document.getElementById("tituloDetalhe");

  const opcoesDetalhe =
    document.getElementById("opcoesDetalhe");


  paginaInicial.classList.add("escondido");

  paginaDetalhes.classList.remove("escondido");


  tituloDetalhe.textContent =
    dados[tipo].titulo;

  opcoesDetalhe.innerHTML = "";


  // Limpa todos os pacientes selecionados
  pacientesSelecionados = [];


  sessionStorage.removeItem(
    "pacientesSelecionados"
  );


  sessionStorage.removeItem(
    "resultadosProntuario"
  );


  if (tipo === "prontuario") {
    const camposHTML =
      camposProntuario
        .map(criarCampo)
        .join("");


    opcoesDetalhe.innerHTML = `
      <div class="formulario-prontuario">

        <h2>
          Pesquisa de Prontuário
        </h2>

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


  opcoesDetalhe.innerHTML = `
    <button class="opcao">

      Opção de ${dados[tipo].titulo}

    </button>
  `;
}

function aplicarMascara(input, tipo) {
  let valor = input.value.replace(/\D/g, "");

  if (tipo === "data") {
    valor = valor.slice(0, 8);

    if (valor.length > 4) {
      valor = valor.replace(
        /(\d{2})(\d{2})(\d{1,4})/,
        "$1/$2/$3"
      );
    } else if (valor.length > 2) {
      valor = valor.replace(
        /(\d{2})(\d{1,2})/,
        "$1/$2"
      );
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
    busca[campo.id] =
      document
        .getElementById(campo.id)
        .value
        .trim();
  });


  const resultados = bancoPacientes.filter(
    paciente => {
      const nomePreenchido =
        busca.nomePaciente !== "";

      const nomeMaePreenchido =
        busca.nomeMae !== "";

      const dataPreenchida =
        busca.dataNascimento !== "";

      const cpfPreenchido =
        busca.cpf !== "";

      const rgPreenchido =
        busca.rg !== "";

      const prontuarioPreenchido =
        busca.numeroProntuario !== "";


      const mesmoNome =
        !nomePreenchido ||
        normalizar(paciente.nomePaciente).includes(
          normalizar(busca.nomePaciente)
        ) ||
        normalizar(busca.nomePaciente).includes(
          normalizar(paciente.nomePaciente)
        );


      const mesmaMae =
        !nomeMaePreenchido ||
        normalizar(paciente.nomeMae).includes(
          normalizar(busca.nomeMae)
        );


      const mesmaData =
        !dataPreenchida ||
        paciente.dataNascimento ===
          busca.dataNascimento;


      const mesmoCpf =
        !cpfPreenchido ||
        paciente.cpf === busca.cpf;


      const mesmoRg =
        !rgPreenchido ||
        paciente.rg === busca.rg;


      const mesmoProntuario =
        !prontuarioPreenchido ||
        paciente.numeroProntuario ===
          busca.numeroProntuario;


      return (
        mesmoNome &&
        mesmaMae &&
        mesmaData &&
        mesmoCpf &&
        mesmoRg &&
        mesmoProntuario
      );
    }
  );


  mostrarResultados(resultados);
}


function mostrarResultados(resultados) {
  const tituloDetalhe =
    document.getElementById("tituloDetalhe");

  const opcoesDetalhe =
    document.getElementById("opcoesDetalhe");


  tituloDetalhe.textContent =
    "Resultados Encontrados";


  // Limpa as seleções anteriores
  pacientesSelecionados = [];


  sessionStorage.setItem(
    "resultadosProntuario",
    JSON.stringify(resultados)
  );


  if (resultados.length === 0) {
    opcoesDetalhe.innerHTML = `
      <div class="resultado-prontuario">

        <div class="item">

          <strong>
            Nenhum prontuário encontrado
          </strong>

          <p>
            Tente pesquisar novamente com outros dados.
          </p>

        </div>

        <button
          class="btn-voltar-pesquisa"
          onclick="abrirPagina('prontuario')"
        >
          Voltar para Pesquisa
        </button>

      </div>
    `;

    return;
  }


  const cards = resultados.map(
    (paciente, index) => `
      <div
        class="card-resultado"
        id="card-paciente-${index}"
      >

        <div class="cabecalho-paciente">

          <h3>
            ${paciente.nomePaciente}
          </h3>

          <div class="check-paciente">

            <input
              type="checkbox"
              id="paciente-${index}"
              name="pacientesSelecionados"
              aria-label="Selecionar prontuário de ${paciente.nomePaciente}"
              onchange="selecionarPaciente(${index})"
            >

            <span>
              Escolher<br>
              Prontuário
            </span>

          </div>

        </div>


        <p>
          <b>Nome da mãe:</b>
          ${paciente.nomeMae}
        </p>

        <p>
          <b>Data de nascimento:</b>
          ${paciente.dataNascimento}
        </p>

        <p>
          <b>CPF:</b>
          ${paciente.cpf}
        </p>

        <p>
          <b>RG:</b>
          ${paciente.rg}
        </p>

        <p>
          <b>Número do prontuário:</b>
          ${paciente.numeroProntuario}
        </p>

      </div>
    `
  ).join("");


  opcoesDetalhe.innerHTML = `
    <div class="lista-resultados">

      ${cards}

    </div>

    <div class="botoes-final">

      <button
        class="btn-voltar-pesquisa"
        onclick="abrirPagina('prontuario')"
      >
        Voltar para Pesquisa
      </button>

      <button
        class="btn-gerar-prontuario"
        onclick="abrirProntuariosSelecionados()"
      >
        Abrir Prontuários Selecionados
      </button>

    </div>
  `;
}

function selecionarPaciente(index) {
  const checkbox =
    document.getElementById(`paciente-${index}`);

  const card =
    document.getElementById(`card-paciente-${index}`);


  if (checkbox.checked) {
    if (!pacientesSelecionados.includes(index)) {
      pacientesSelecionados.push(index);
    }

    if (card) {
      card.classList.add("selecionado");
    }
  } else {
    pacientesSelecionados =
      pacientesSelecionados.filter(
        indice => indice !== index
      );

    if (card) {
      card.classList.remove("selecionado");
    }
  }


  sessionStorage.setItem(
    "indicesPacientesSelecionados",
    JSON.stringify(pacientesSelecionados)
  );
}


function abrirProntuariosSelecionados() {
  if (pacientesSelecionados.length === 0) {
    alert(
      "Selecione pelo menos um prontuário."
    );

    return;
  }


  const resultados = JSON.parse(
    sessionStorage.getItem(
      "resultadosProntuario"
    )
  );


  if (!resultados) {
    alert(
      "Não foi possível carregar os resultados."
    );

    return;
  }


  const prontuariosEscolhidos =
    pacientesSelecionados
      .map(index => resultados[index])
      .filter(paciente => paciente);


  if (prontuariosEscolhidos.length === 0) {
    alert(
      "Nenhum prontuário válido foi selecionado."
    );

    return;
  }


  sessionStorage.setItem(
    "pacientesSelecionados",
    JSON.stringify(prontuariosEscolhidos)
  );


  mostrarProntuariosSelecionados(
    prontuariosEscolhidos
  );
}


function mostrarProntuariosSelecionados(
  pacientes
) {
  const tituloDetalhe =
    document.getElementById("tituloDetalhe");

  const opcoesDetalhe =
    document.getElementById("opcoesDetalhe");


  tituloDetalhe.textContent =
    "Prontuários Selecionados";


  const cardsSelecionados =
    pacientes.map(
      paciente => `
        <div class="card-resultado selecionado">

          <h3>
            ${paciente.nomePaciente}
          </h3>

          <p>
            <b>Nome da mãe:</b>
            ${paciente.nomeMae}
          </p>

          <p>
            <b>Data de nascimento:</b>
            ${paciente.dataNascimento}
          </p>

          <p>
            <b>CPF:</b>
            ${paciente.cpf}
          </p>

          <p>
            <b>RG:</b>
            ${paciente.rg}
          </p>

          <p>
            <b>Número do prontuário:</b>
            ${paciente.numeroProntuario}
          </p>

        </div>
      `
    ).join("");


  opcoesDetalhe.innerHTML = `
    <div class="lista-resultados">

      ${cardsSelecionados}

    </div>


    <div class="botoes-final">

      <button
        class="btn-voltar-pesquisa"
        onclick="abrirPagina('prontuario')"
      >
        Voltar para Pesquisa
      </button>


      <button
        class="btn-gerar-prontuario"
        onclick="gerarProntuarios()"
      >
        Gerar Prontuários
      </button>

    </div>
  `;
}


function gerarProntuarios() {
  const pacientes = JSON.parse(
    sessionStorage.getItem(
      "pacientesSelecionados"
    )
  );


  if (!pacientes || pacientes.length === 0) {
    alert(
      "Nenhum prontuário foi selecionado."
    );

    return;
  }


  sessionStorage.setItem(
    "pacientesParaGerar",
    JSON.stringify(pacientes)
  );


  window.location.href =
    "prontuario.html";
}

function voltarInicio() {

  document
    .getElementById("paginaDetalhes")
    .classList.add("escondido");

  document
    .getElementById("paginaInicial")
    .classList.remove("escondido");


  // Limpa todas as seleções
  pacientesSelecionados = [];


  // Limpa dados temporários
  sessionStorage.removeItem(
    "resultadosProntuario"
  );

  sessionStorage.removeItem(
    "pacientesSelecionados"
  );

  sessionStorage.removeItem(
    "pacientesParaGerar"
  );

  sessionStorage.removeItem(
    "indicesPacientesSelecionados"
  );


  // Desmarca todos os checkboxes
  document
    .querySelectorAll(
      'input[name="pacientesSelecionados"]'
    )
    .forEach(checkbox => {
      checkbox.checked = false;
    });


  // Remove o destaque dos cartões
  document
    .querySelectorAll(".card-resultado")
    .forEach(card => {
      card.classList.remove("selecionado");
    });

}