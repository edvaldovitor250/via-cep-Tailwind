function exibirResultado(cepData) {
    var resultadoDiv = document.getElementById('resultadoCep');
    resultadoDiv.innerHTML = '';

    if (cepData.erro) {
        resultadoDiv.innerHTML = '<p class="text-center">Cep não encontrado.</p>';
    } else {
        const bandeiras = {
            'AC': './assets/img/acre.png', 
            'AL': './assets/img/alagoas.png',
            'AM': './assets/img/amazonas.png',
            'AP': './assets/img/amapa.png',
            'BA': './assets/img/bahia.png',
            'CE': './assets/img/ceara.png',
            'DF': './assets/img/distrito-federal.png',
            'ES': './assets/img/espirito-santo.png',
            'GO': './assets/img/goias.png',
            'MA': './assets/img/maranhao.png',
            'MG': './assets/img/minas-gerais.png',
            'MS': './assets/img/mato-gross.png',
            'MT': './assets/img/mato-grosso.png',
            'PA': './assets/img/para.png',
            'PB': './assets/img/paraiba.png',
            'PE': './assets/img/pernambuco.png',
            'PI': './assets/img/piaui.png',
            'PR': './assets/img/parana.png',
            'RJ': './assets/img/rio-de-janeiro.png',
            'RN': './assets/img/rio-grande-norte.png',
            'RO': './assets/img/rondonia.png',
            'RR': './assets/img/roraima.png',
            'RS': './assets/img/rio-grande-do-sul.png',
            'SC': './assets/img/santa-catarina.png',
            'SE': './assets/img/sergipe.png',
            'SP': './assets/img/sao-paulo.png',
            'TO': './assets/img/tocantins.png',
          };

        const estado = cepData.uf;
        const bandeiraUrl = bandeiras[estado] || 'url_padrao.png';

        resultadoDiv.innerHTML = `
        <div class="result-container-custom mt-4 mx-auto max-w-lg text-center transform transition duration-500 hover:scale-105"> 
        <div class="overflow-x-auto">
            <table class="w-full table-auto mx-auto border border-collapse border-blue-500">
                <thead>
                    <tr>
                        <th class="py-2 px-4 border-b text-center bg-blue-500 text-white">CEP</th>
                        <td class="py-2 px-4 border-b text-center">${cepData.cep}</td>
                    </tr>
                    <tr>
                        <th class="py-2 px-4 border-b text-center bg-blue-500 text-white">Logradouro</th>
                        <td class="py-2 px-4 border-b text-center">${cepData.logradouro}</td>
                    </tr>
                    <tr>
                        <th class="py-2 px-4 border-b text-center bg-blue-500 text-white">Bairro</th>
                        <td class="py-2 px-4 border-b text-center">${cepData.bairro}</td>
                    </tr>
                    <tr>
                        <th class="py-2 px-4 border-b text-center bg-blue-500 text-white">Cidade</th>
                        <td class="py-2 px-4 border-b text-center">${cepData.localidade}</td>
                    </tr>
                    <tr class="state-flag-info">
                    <th class="py-2 px-4 border-b text-center bg-blue-500 text-white">Estado</th>
                    <td class="py-2 px-4 border-b text-right state-flag-cell">
                        <div class="state-info">
                            <span class="inline-block align-middle">${cepData.uf}</span> 
                            <div class="state-flag">
                                <img src="${bandeiraUrl}" alt="Bandeira do Estado" style="max-width: 30px;">
                            </div>
                        </div>
                    </td>
                </tr>
                    <tr>
                        <th class="py-2 px-4 border-b text-center bg-blue-500 text-white">DDD</th>
                        <td class="py-2 px-4 border-b text-center">${cepData.ddd}</td>
                    </tr>
                    <tr>
                        <th class="py-2 px-4 text-center bg-blue-500 text-white">Ibge</th>
                        <td class="py-2 px-4 text-center">${cepData.ibge}</td>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
`;

        document.querySelectorAll('.w-full th, .w-full td').forEach(element => {
            element.style.backgroundColor = '#007BFF';
            element.style.color = '#fff';
            element.classList.add('transition', 'duration-500', 'hover:bg-blue-700');
        });
        
        document.getElementById('botoesAcoes').style.display = 'flex';
    }}

document.getElementById('cepForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const cepInputValue = document.getElementById('cepInput').value;

    const cepInfoElement = document.getElementById('cepInfo');
    cepInfoElement.innerHTML = `
        <div style="background-color: #3498db; padding: 15px; border-radius: 5px; margin-top: 20px; color: #000;">
            <h2 class="text-center">CEP: ${cepInputValue}</h2>
            <p class="text-center">Veja as informações do CEP ${cepInputValue}, Endereço completo, Guia Nacional de Informação, População, etc</p>
        </div>`;

    pesquisarCep(cepInputValue);

    const botoesAcoesContainer = document.getElementById('botoesAcoesContainer');
    const botoes = botoesAcoesContainer.getElementsByTagName('button');

    for (let i = 0; i < botoes.length; i++) {
        botoes[i].removeAttribute('disabled');
    }
});

function pesquisarCep(cep) {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => exibirResultado(data))
        .catch(error => console.error('Erro na pesquisa de CEP:', error));
}
function copiarInformacoes() {
    const resultadoCep = document.getElementById('resultadoCep');
    const range = document.createRange();
    range.selectNode(resultadoCep);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    alert('Informações copiadas para a área de transferência.');
}

function abrirMapa() {
    const cepData = getCepDataFromResult();
    if (cepData) {
        const endereco = formatarEndereco(cepData);
        const enderecoEncoded = encodeURIComponent(endereco);
        window.open(`https://www.google.com/maps/search/?api=1&query=${enderecoEncoded}`, '_blank');
    }
}

function getCepDataFromResult() {
    const resultadoCep = document.getElementById('resultadoCep');
    const cepData = resultadoCep.querySelector('table');
    if (cepData) {
        const cepDataObject = {};
        const rows = cepData.querySelectorAll('tr');
        rows.forEach(row => {
            const key = row.querySelector('th').innerText.trim();
            const value = row.querySelector('td').innerText.trim();
            cepDataObject[key] = value;
        });
        return cepDataObject;
    }
    return null;
}

function formatarEndereco(cepData) {
    const logradouro = cepData['Logradouro'];
    const bairro = cepData['Bairro'];
    const cidade = cepData['Cidade'];
    const uf = cepData['Estado'];
    const cep = cepData['CEP'];

    return `${logradouro}, ${bairro}, ${cidade} - ${uf}, ${cep}`;
}

function reiniciarDados() {
    const resultadoDiv = document.getElementById('resultadoCep');
    resultadoDiv.innerHTML = '';

    const cepInfoElement = document.getElementById('cepInfo');
    cepInfoElement.innerHTML = '';

    const cepInput = document.getElementById('cepInput');
    cepInput.value = '';
}

document.getElementById('reiniciarBtn').addEventListener('click', function (event) {
    event.preventDefault();
    reiniciarDados();
});
