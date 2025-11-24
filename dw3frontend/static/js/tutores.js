// dw3frontend/static/js/tutores.js
// 1. Inicialização do Modal e Formulário
const modalManutencaoTutor = new bootstrap.Modal(document.getElementById('modalManutencaoTutor'));
const formManutencaoTutor = document.getElementById('formManutencao');

window.onload = function () {
    carregarTutores();
};

//carregar tutores
async function carregarTutores() {
    const listaBody = document.getElementById('listaTutores');
    listaBody.innerHTML = '<tr><td colspan="6">Carregando dados...</td></tr>';

    const response = await fetchAPI('/getAllTutores', {
        method: 'GET'
    });

    listaBody.innerHTML = '';

    if (response.status === 'ok' && response.registro) {
        
        if ($.fn.DataTable.isDataTable('#dataTableTutores')) {
            $('#dataTableTutores').DataTable().destroy();
        }

        response.registro.forEach(tutor => {
            const row = listaBody.insertRow();
            row.insertCell(0).textContent = tutor.tutorid;
            row.insertCell(1).textContent = tutor.nome;
            row.insertCell(2).textContent = tutor.cpf;
            row.insertCell(3).textContent = tutor.telefone;
            row.insertCell(4).textContent = tutor.cidade;

            const acoesCell = row.insertCell(5);
            acoesCell.innerHTML = `
                <button class="btn btn-sm btn-info me-2" title="Editar" onclick="abrirModalEdicao(${tutor.tutorid})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" title="Excluir (Soft Delete)" onclick="deletarTutor(${tutor.tutorid}, '${tutor.nome}')">
                    <i class="fas fa-trash"></i>
                </button>
            `;
        });
        
        $('#dataTableTutores').DataTable(); 

    } else {
        listaBody.innerHTML = '<tr><td colspan="6" class="text-danger">Não foi possível carregar os tutores. Erro: ' + (response.message || 'Desconhecido') + '</td></tr>';
    }
}



//abrir cadastro tutor
function abrirModalCadastro() {
    document.getElementById('modalLabel').textContent = 'Cadastro de Novo Tutor';
    formManutencaoTutor.reset();
    document.getElementById('tutorid').value = 0;
    modalManutencaoTutor.show();
}


async function abrirModalEdicao(id) {
    document.getElementById('modalLabel').textContent = 'Edição de Tutor (ID: ' + id + ')';
    formManutencaoTutor.reset();
    document.getElementById('tutorid').value = id;

    const response = await fetchAPI('/getTutoresByID', {
        method: 'POST',
        body: JSON.stringify({ tutorid: id })
    });
    
    if (response.status === 'ok' && response.registro && response.registro.length > 0) {
        const tutor = response.registro[0];
        document.getElementById('nome').value = tutor.nome;
        document.getElementById('cpf').value = tutor.cpf;
        document.getElementById('telefone').value = tutor.telefone;
        document.getElementById('rua').value = tutor.rua;
        document.getElementById('numero').value = tutor.numero;
        document.getElementById('bairro').value = tutor.bairro;
        document.getElementById('cidade').value = tutor.cidade;
        
        modalManutencaoTutor.show();
    } else {
        alert('Erro: Tutor não encontrado ou falha na API.');
    }
}




//salvar tutor
async function salvarTutor() {
    const id = document.getElementById('tutorid').value;
    const isUpdate = id !== '0';
    
    const formData = new FormData(formManutencaoTutor);
    const tutorData = Object.fromEntries(formData.entries());

    const endpoint = isUpdate ? '/updateTutores' : '/insertTutores';
    
    const response = await fetchAPI(endpoint, {
        method: 'POST',
        body: JSON.stringify(tutorData)
    });

    if (response.status === 'ok') {
        alert(isUpdate ? 'Tutor atualizado com sucesso!' : 'Tutor cadastrado com sucesso!');
        modalManutencaoTutor.hide();
        carregarTutores();
    } else {
        alert('Falha ao salvar. Erro: ' + (response.message || response.status));
    }
}



 //soft delete
async function deletarTutor(id, nome) {
    if (confirm(`Deseja realmente desativar (Soft Delete) o tutor ${nome} (ID: ${id})?`)) {
        
        const response = await fetchAPI('/deleteTutores', {
            method: 'POST',
            body: JSON.stringify({ tutorid: id })
        });

        if (response.status === 'ok' && response.linhasAfetadas > 0) {
            alert('Tutor desativado com sucesso.');
            carregarTutores();
        } else {
            alert('Falha ao desativar. O registro pode já ter sido removido. Erro: ' + (response.message || 'Desconhecido'));
        }
    }
}