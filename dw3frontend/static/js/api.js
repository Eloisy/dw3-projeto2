// dw3frontend/static/js/api.js

const SERVIDOR_DW3Back = "http://localhost:40000";

/**
 * @param {string} endpoint - O caminho da API (ex: '/getAllTutores').
 * @param {object} options - Opções do fetch (method, body, etc.).
 */
async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem('dw3_token'); 

    if (!token && endpoint !== '/Login') {
        window.location.href = '/login'; 
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`; 
    }

    const config = { ...options, headers: headers };
    const url = `${SERVIDOR_DW3Back}${endpoint}`;

    try {
        const response = await fetch(url, config);
        
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('dw3_token');
            alert('Sessão expirada. Faça login novamente.');
            window.location.href = '/login'; 
            return;
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json();
        } else {
            const text = await response.text();
            return { status: "error", message: `Erro: ${response.status} - ${text}` };
        }
        
    } catch (error) {
        console.error("Erro de conexão com a API:", endpoint, error);
        return { status: "error", message: "Erro de conexão com o servidor backend." };
    }
}