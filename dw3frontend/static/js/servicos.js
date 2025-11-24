// dw3frontend/static/js/servicos.js

const formManutencaoServico = document.getElementById('formManutencaoServico');
const params = new URLSearchParams(window.location.search);
const servicoId = params.get('servicoid') || 0;
const isEdicao = servicoId !== 0;

window.onload = function () {
    if (document.getElementById('listaServicos')) {
        carregarServicos();
    }
    
    if (document.getElementById('formManutencaoServico')) {
        if (isEdicao) {
            document.getElementById('manutencaoTitulo').textContent = `Editar Serviço (ID: ${servicoId})`;
            carregarDadosServico(servicoId);
        } else {
            document.getElementById('servicoid').value = 0;
            document.getElementById('manutencaoTitulo').textContent = 'Cadastrar Novo Serviço';
        }
    }
};

// --- FUNÇÕES DE LISTAGEM E EXCLUSÃO ---

function abrirManutencaoServico(id = 0) {
    if (id === 0) {
        window.location.href = '/servicos/manutencao';
    } else {
        window.location.href = `/servicos/manutencao?servicoid=${id}`;
    }
}

async function carregarServicos() {
    const listaBody = document.getElementById('listaServicos');
    listaBody.innerHTML = '<tr><td colspan="5">Carregando dados...</td></tr>';

    const response = await fetchAPI('/getAllServicos', { method: 'GET' });

    listaBody.innerHTML = '';

    if (response.status === 'ok' && response.registro) {
        if ($.fn.DataTable.isDataTable('#dataTableServicos')) {
            $('#dataTableServicos').DataTable().destroy();
        }

        response.registro.forEach(servico => {
            const row = listaBody.insertRow();
            row.insertCell(0).textContent = servico.servicoid;
            row.insertCell(1).textContent = servico.nome;
            row.insertCell(2).textContent = servico.descricao.substring(0, 50) + (servico.descricao.length > 50 ? '...' : ''); 
            row.insertCell(3).textContent = `R$ ${parseFloat(servico.valor).toFixed(2)}`;
            
            const acoesCell = row.insertCell(4);
            acoesCell.innerHTML = `
                <button class="btn btn-sm btn-info me-2" title="Editar" onclick="abrirManutencaoServico(${servico.servicoid})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" title="Excluir (Soft Delete)" onclick="deletarServico(${servico.servicoid}, '${servico.nome}')">
                    <i class="fas fa-trash"></i>
                </button>
            `;
        });
        
        $('#dataTableServicos').DataTable(); 
    } else {
        listaBody.innerHTML = '<tr><td colspan="5" class="text-danger">Não foi possível carregar os serviços. Erro: ' + (response.message || 'Desconhecido') + '</td></tr>';
    }
}

async function deletarServico(id, nome) {
    if (confirm(`Deseja realmente desativar (Soft Delete) o serviço ${nome} (ID: ${id})?`)) {
        
        const response = await fetchAPI('/deleteServicos', {
            method: 'POST',
            body: JSON.stringify({ servicoid: id })
        });

        if (response.status === 'ok' && response.linhasAfetadas > 0) {
            alert('Serviço desativado com sucesso.');
            carregarServicos();
        } else {
            alert('Falha ao desativar. Erro: ' + (response.message || 'Desconhecido'));
        }
    }
}


// --- FUNÇÕES DE MANUTENÇÃO (Formulário) ---

async function carregarDadosServico(id) {
    document.getElementById('servicoid').value = id;
    document.getElementById('mensagemErro').textContent = 'Carregando dados...';

    const response = await fetchAPI('/getServicoByID', {
        method: 'POST',
        body: JSON.stringify({ servicoid: id })
    });
    
    document.getElementById('mensagemErro').textContent = '';

    if (response.status === 'ok' && response.registro && response.registro.length > 0) {
        const servico = response.registro[0];
        document.getElementById('nome').value = servico.nome;
        document.getElementById('descricao').value = servico.descricao;
        document.getElementById('valor').value = parseFloat(servico.valor).toFixed(2);
        document.getElementById('deleted').value = servico.deleted;
        
    } else {
        document.getElementById('mensagemErro').textContent = 'Erro ao carregar os dados do Serviço.';
        alert('Erro: Serviço não encontrado ou falha na API.');
    }
}


async function salvarServico() {
    if (!document.getElementById('nome').value || !document.getElementById('valor').value) {
        document.getElementById('mensagemErro').textContent = 'Erro: Nome e Valor são obrigatórios.';
        return;
    }

    const id = document.getElementById('servicoid').value;
    const isUpdate = id !== '0';
    
    const formData = new FormData(formManutencaoServico);
    const servicoData = Object.fromEntries(formData.entries());

    // Se for atualização, garanta que o valor 'deleted' volte como boolean (string 'false')
    if (isUpdate) {
        servicoData.deleted = servicoData.deleted === 'true'; 
    }

    const endpoint = isUpdate ? '/updateServicos' : '/insertServicos';
    
    document.getElementById('mensagemErro').textContent = 'Salvando...';

    const response = await fetchAPI(endpoint, {
        method: 'POST',
        body: JSON.stringify(servicoData)
    });

    document.getElementById('mensagemErro').textContent = '';

    if (response.status === 'ok') {
        alert(isUpdate ? 'Serviço atualizado com sucesso!' : 'Serviço cadastrado com sucesso!');
        window.location.href = '/servicos'; 
    } else {
        document.getElementById('mensagemErro').textContent = 'Falha ao salvar. Erro: ' + (response.message || response.status);
        alert('Falha ao salvar. Verifique o console.');
    }
}