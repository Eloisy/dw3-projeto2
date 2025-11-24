-- 1. Tabela de Credenciais para o Módulo LOGIN
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    deleted BOOLEAN DEFAULT FALSE
);

-- 2. Tabela de TUTORES (Clientes)
CREATE TABLE tutores (
    tutorid SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    rua VARCHAR(100),
    numero VARCHAR(10),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    deleted BOOLEAN DEFAULT FALSE
);

-- 3. Tabela de PETS (Animais)
CREATE TABLE pets (
    petid SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    raca VARCHAR(50),
    idade INT,
    tutorid INT NOT NULL REFERENCES tutores(tutorid),
    deleted BOOLEAN DEFAULT FALSE
);

-- 4. Tabela de SERVICOS
CREATE TABLE servicos (
    servicoid SERIAL PRIMARY KEY,
    descricao VARCHAR(100) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL
);

-- 5. Tabela de Ligação PET_SERVICOS
CREATE TABLE pet_servicos (
    pet_servicoid SERIAL PRIMARY KEY,
    petid INT NOT NULL REFERENCES pets(petid),
    servicoid INT NOT NULL REFERENCES servicos(servicoid),
    data_servico DATE NOT NULL,
    UNIQUE (petid, servicoid, data_servico)
);