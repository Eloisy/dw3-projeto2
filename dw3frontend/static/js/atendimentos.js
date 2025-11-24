// dw3frontend/static/js/atendimentos.js

const formManutencaoAtendimento = document.getElementById('formManutencaoAtendimento');
const params = new URLSearchParams(window.location.search);
const atendimentoId = params.get('pet_servicoid') || 0;
const isEdicao = atendimentoId !== 0;

window.onload = function () {
    // 1. Lógica para a página de LISTAGEM
    if (document.getElementById('listaAtendimentos')) {
        carregarAtendimentos();
    }
    
    // 2. Lógica para a página de MANUTENÇÃO (Formulário)
    // Se este bloco não existir ou falhar, os campos ficam "Carregando..."
    if (document.getElementById('formManutencaoAtendimento')) {
        Promise.all([
            carregarPetsSelect(),
            carregarServicosSelect()
        ]).then(() => {
            if (isEdicao) {
                document.getElementById('manutencaoTitulo').textContent = `Editar Atendimento (ID: ${atendimentoId})`;
                carregarDadosAtendimento(atendimentoId); 
            } else {
                document.getElementById('pet_servicoid').value = 0;
                document.getElementById('manutencaoTitulo').textContent = 'Registrar Novo Atendimento';
            }
        });
    }
};

// --- FUNÇÕES DE LISTAGEM E EXCLUSÃO ---

function abrirManutencaoAtendimento(id = 0) {
    if (id === 0) {
        window.location.href = '/petservicos/manutencao';
    } else {
        window.location.href = `/petservicos/manutencao?pet_servicoid=${id}`;
    }
}

async function carregarAtendimentos() {
    const listaBody = document.getElementById('listaAtendimentos');
    // Colspan ajustado para 7 colunas
    listaBody.innerHTML = '<tr><td colspan="7">Carregando dados...</td></tr>'; 

    const response = await fetchAPI('/getAllPetServicos', { method: 'GET' });

    listaBody.innerHTML = '';

    if (response.status === 'ok' && response.registro) {
        if ($.fn.DataTable.isDataTable('#dataTableAtendimentos')) {
            $('#dataTableAtendimentos').DataTable().destroy();
        }

        response.registro.forEach(atendimento => {
            const row = listaBody.insertRow();
            
            // 7 COLUNAS DE DADOS:
            row.insertCell(0).textContent = atendimento.pet_servicoid;
            row.insertCell(1).textContent = atendimento.nome_pet;
            row.insertCell(2).textContent = atendimento.nome_tutor; // Exibe Nome do Tutor
            row.insertCell(3).textContent = atendimento.nome_servico;
            row.insertCell(4).textContent = `R$ ${parseFloat(atendimento.valor).toFixed(2)}`;
            row.insertCell(5).textContent = atendimento.data_servico.split('T')[0];
            
            const acoesCell = row.insertCell(6);
            acoesCell.innerHTML = `
                <button class="btn btn-sm btn-info me-2" title="Editar" onclick="abrirManutencaoAtendimento(${atendimento.pet_servicoid})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" title="Excluir (Soft Delete)" onclick="deletarAtendimento(${atendimento.pet_servicoid}, '${atendimento.nome_pet} - ${atendimento.nome_servico}')">
                    <i class="fas fa-trash"></i>
                </button>
            `;
        });
        
        $('#dataTableAtendimentos').DataTable(); 
    } else {
        listaBody.innerHTML = '<tr><td colspan="7" class="text-danger">Não foi possível carregar os atendimentos. Erro: ' + (response.message || 'Desconhecido') + '</td></tr>';
    }
}

async function deletarAtendimento(id, nome) {
    if (confirm(`Deseja realmente desativar o atendimento ${nome} (ID: ${id})?`)) {
        
        const response = await fetchAPI('/deletePetServicos', {
            method: 'POST',
            body: JSON.stringify({ pet_servicoid: id })
        });

        if (response.status === 'ok' && response.linhasAfetadas > 0) {
            alert('Atendimento desativado com sucesso.');
            carregarAtendimentos();
        } else {
            alert('Falha ao desativar. Erro: ' + (response.message || 'Desconhecido'));
        }
    }
}


// --- FUNÇÕES DE MANUTENÇÃO (Formulário) ---

async function carregarPetsSelect() {
    const selectPet = document.getElementById('petid');
    const response = await fetchAPI('/getAllPets', { method: 'GET' });

    if (response.status === 'ok' && response.registro) {
        selectPet.innerHTML = '<option value="">-- Selecione um Pet --</option>';
        response.registro.forEach(pet => {
            const option = document.createElement('option');
            option.value = pet.petid;
            // Exibe Nome do Pet e Nome do Tutor no dropdown para facilitar
            option.textContent = `${pet.nome} (Tutor: ${pet.nome_tutor})`; 
            selectPet.appendChild(option);
        });
    } else {
        selectPet.innerHTML = '<option value="">Erro ao carregar Pets</option>';
    }
}

async function carregarServicosSelect() {
    const selectServico = document.getElementById('servicoid');
    const response = await fetchAPI('/getAllServicos', { method: 'GET' });

    if (response.status === 'ok' && response.registro) {
        selectServico.innerHTML = '<option value="">-- Selecione um Serviço --</option>';
        response.registro.forEach(servico => {
            const option = document.createElement('option');
            option.value = servico.servicoid;
            option.textContent = `${servico.nome} (R$ ${parseFloat(servico.valor).toFixed(2)})`;
            selectServico.appendChild(option);
        });
    } else {
        selectServico.innerHTML = '<option value="">Erro ao carregar Serviços</option>';
    }
}


async function carregarDadosAtendimento(id) {
    document.getElementById('pet_servicoid').value = id;
    const response = await fetchAPI('/getPetServicoByID', {
        method: 'POST',
        body: JSON.stringify({ pet_servicoid: id })
    });
    
    if (response.status === 'ok' && response.registro && response.registro.length > 0) {
        const atendimento = response.registro[0];
        document.getElementById('petid').value = atendimento.petid;
        document.getElementById('servicoid').value = atendimento.servicoid;
        document.getElementById('data_servico').value = atendimento.data_servico.split('T')[0];
        document.getElementById('observacao').value = atendimento.observacao;
    } else {
        alert('Erro: Atendimento não encontrado ou falha na API.');
    }
}


async function salvarAtendimento() {
    if (!document.getElementById('petid').value || !document.getElementById('servicoid').value || !document.getElementById('data_servico').value) {
        document.getElementById('mensagemErro').textContent = 'Erro: Pet, Serviço e Data são obrigatórios.';
        return;
    }

    const id = document.getElementById('pet_servicoid').value;
    const isUpdate = id !== '0';
    
    const formData = new FormData(formManutencaoAtendimento);
    const atendimentoData = Object.fromEntries(formData.entries());
    atendimentoData.deleted = false; // Força o deleted false

    const endpoint = isUpdate ? '/updatePetServicos' : '/insertPetServicos';
    document.getElementById('mensagemErro').textContent = 'Salvando...';

    const response = await fetchAPI(endpoint, {
        method: 'POST',
        body: JSON.stringify(atendimentoData)
    });

    if (response.status === 'ok') {
        alert(isUpdate ? 'Atendimento atualizado com sucesso!' : 'Atendimento registrado com sucesso!');
        window.location.href = '/petservicos'; 
    } else {
        document.getElementById('mensagemErro').textContent = 'Falha ao salvar. Erro: ' + (response.message || response.status);
    }
}