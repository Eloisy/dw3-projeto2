// dw3frontend/static/js/pets.js

const formManutencaoPet = document.getElementById('formManutencaoPet');
const params = new URLSearchParams(window.location.search);
const petId = params.get('petid') || 0;
const isEdicao = petId !== 0;

window.onload = function () {
    if (document.getElementById('listaPets')) {
        carregarPets();
    }
    
    if (document.getElementById('formManutencaoPet')) {
        carregarTutoresSelect()
            .then(() => {
                if (isEdicao) {
                    document.getElementById('manutencaoTitulo').textContent = `Editar Pet (ID: ${petId})`;
                    carregarDadosPet(petId); 
                } else {
                    document.getElementById('petid').value = 0;
                    document.getElementById('manutencaoTitulo').textContent = 'Cadastrar Novo Pet';
                }
            });
    }
};

//mostra tutor
async function carregarTutoresMap() {
    const response = await fetchAPI('/getAllTutores', { method: 'GET' });
    const tutoresMap = {};
    if (response.status === 'ok' && response.registro) {
        response.registro.forEach(tutor => {
            tutoresMap[tutor.tutorid] = tutor.nome;
        });
    }
    return tutoresMap;
}

//abre o form
function abrirManutencaoPet(id = 0) {
    if (id === 0) {
        window.location.href = '/pets/manutencao';
    } else {
        window.location.href = `/pets/manutencao?petid=${id}`;
    }
}


//mostra pets
async function carregarPets() {
    const listaBody = document.getElementById('listaPets');
    listaBody.innerHTML = '<tr><td colspan="6">Carregando dados...</td></tr>';

    const response = await fetchAPI('/getAllPets', { method: 'GET' });

    listaBody.innerHTML = '';

    if (response.status === 'ok' && response.registro) {
        if ($.fn.DataTable.isDataTable('#dataTablePets')) {
            $('#dataTablePets').DataTable().destroy();
        }

        response.registro.forEach(pet => {
            const row = listaBody.insertRow();
            row.insertCell(0).textContent = pet.petid;
            row.insertCell(1).textContent = pet.nome;
            row.insertCell(2).textContent = pet.raca;
            row.insertCell(3).textContent = pet.data_nascimento ? pet.data_nascimento.split('T')[0] : '';
            
            row.insertCell(4).textContent = pet.nome_tutor; 
            
            const acoesCell = row.insertCell(5);
            acoesCell.innerHTML = `
                <button class="btn btn-sm btn-info me-2" title="Editar" onclick="abrirManutencaoPet(${pet.petid})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" title="Excluir (Soft Delete)" onclick="deletarPet(${pet.petid}, '${pet.nome}')">
                    <i class="fas fa-trash"></i>
                </button>
            `;
        });
        $('#dataTablePets').DataTable();
    } else {
        listaBody.innerHTML = '<tr><td colspan="6" class="text-danger">Erro ao carregar.</td></tr>';
    }
}


//soft delte
async function deletarPet(id, nome) {
    if (confirm(`Deseja realmente desativar (Soft Delete) o pet ${nome} (ID: ${id})?`)) {
        
        const response = await fetchAPI('/deletePets', {
            method: 'POST',
            body: JSON.stringify({ petid: id })
        });

        if (response.status === 'ok' && response.linhasAfetadas > 0) {
            alert('Pet desativado com sucesso.');
            carregarPets();
        } else {
            alert('Falha ao desativar. Erro: ' + (response.message || 'Desconhecido'));
        }
    }
}



async function carregarTutoresSelect() {
    const selectTutor = document.getElementById('tutorid');
    selectTutor.innerHTML = '<option value="">Carregando...</option>';

    const response = await fetchAPI('/getAllTutores', { method: 'GET' });

    if (response.status === 'ok' && response.registro) {
        selectTutor.innerHTML = '<option value="">-- Selecione um Tutor --</option>';
        response.registro.forEach(tutor => {
            const option = document.createElement('option');
            option.value = tutor.tutorid;
            option.textContent = `${tutor.nome} (ID: ${tutor.tutorid})`; 
            selectTutor.appendChild(option);
        });
    } else {
        selectTutor.innerHTML = '<option value="">Erro ao carregar Tutores</option>';
        document.getElementById('mensagemErro').textContent = 'Erro ao carregar lista de tutores.';
    }
    return Promise.resolve();
}

//mostra as info dos pets
async function carregarDadosPet(id) {
    document.getElementById('petid').value = id;
    document.getElementById('mensagemErro').textContent = 'Carregando dados...';

    const response = await fetchAPI('/getPetByID', {
        method: 'POST',
        body: JSON.stringify({ petid: id })
    });
    
    document.getElementById('mensagemErro').textContent = '';

    if (response.status === 'ok' && response.registro && response.registro.length > 0) {
        const pet = response.registro[0];
        document.getElementById('nome').value = pet.nome;
        document.getElementById('raca').value = pet.raca;
        document.getElementById('data_nascimento').value = pet.data_nascimento.split('T')[0];
        document.getElementById('genero').value = pet.genero;
        document.getElementById('tutorid').value = pet.tutorid; 
        
    } else {
        document.getElementById('mensagemErro').textContent = 'Erro ao carregar os dados do Pet.';
        alert('Erro: Pet não encontrado ou falha na API.');
    }
}


//salva o pet
async function salvarPet() {
    if (!document.getElementById('nome').value || !document.getElementById('tutorid').value) {
        document.getElementById('mensagemErro').textContent = 'Erro: Nome do Pet e Tutor são obrigatórios.';
        return;
    }

    const id = document.getElementById('petid').value;
    const isUpdate = id !== '0';
    
    const formData = new FormData(formManutencaoPet);
    const petData = Object.fromEntries(formData.entries());

    petData.deleted = false; 

    const endpoint = isUpdate ? '/updatePets' : '/insertPets';
    
    document.getElementById('mensagemErro').textContent = 'Salvando...';

    const response = await fetchAPI(endpoint, {
        method: 'POST',
        body: JSON.stringify(petData)
    });

    document.getElementById('mensagemErro').textContent = '';

    if (response.status === 'ok') {
        alert(isUpdate ? 'Pet atualizado com sucesso!' : 'Pet cadastrado com sucesso!');
        window.location.href = '/pets'; 
    } else {
        document.getElementById('mensagemErro').textContent = 'Falha ao salvar. Erro: ' + (response.message || response.status);
        alert('Falha ao salvar. Verifique o console.');
    }
}