-- 1. TABELA DE LOGIN (USUÁRIOS)
DROP TABLE IF EXISTS usuarios CASCADE;
CREATE TABLE usuarios (
    usuarioid BIGSERIAL CONSTRAINT pk_usuarios PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    deleted BOOLEAN DEFAULT FALSE
);

-- 2. TABELA TUTORES
DROP TABLE IF EXISTS tutores CASCADE;
CREATE TABLE tutores (
    tutorid BIGSERIAL CONSTRAINT pk_tutores PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL, 
    telefone VARCHAR(20) NOT NULL,        
    rua VARCHAR(100),                     
    numero VARCHAR(10),                   
    bairro VARCHAR(100),                  
    complemento VARCHAR(100),             
    cidade VARCHAR(100),                  
    deleted BOOLEAN DEFAULT FALSE
);

-- 3. TABELA PETS
DROP TABLE IF EXISTS pets CASCADE;
CREATE TABLE pets (
    petid BIGSERIAL CONSTRAINT pk_pets PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    raca VARCHAR(50),
    data_nascimento DATE,
    genero VARCHAR(10) NOT NULL,
    tutorid BIGINT CONSTRAINT fk_pet_tutor REFERENCES tutores (tutorid) NOT NULL,
    deleted BOOLEAN DEFAULT FALSE
);

-- 4. TABELA SERVIÇOS
DROP TABLE IF EXISTS servicos CASCADE;
CREATE TABLE servicos (
    servicoid BIGSERIAL CONSTRAINT pk_servicos PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL,
    descricao VARCHAR(100) NOT NULL,
    valor NUMERIC(10, 2) NOT NULL,
    deleted BOOLEAN DEFAULT FALSE
);

-- 5. TABELA PET_SERVICOS
DROP TABLE IF EXISTS pet_servicos CASCADE;
CREATE TABLE pet_servicos (
    pet_servicoid BIGSERIAL CONSTRAINT pk_pet_servicos PRIMARY KEY,
    observacao TEXT, 
    data_servico DATE NOT NULL DEFAULT CURRENT_DATE,
    petid BIGINT CONSTRAINT fk_ps_pet REFERENCES pets (petid) NOT NULL,
    servicoid BIGINT CONSTRAINT fk_ps_servico REFERENCES servicos (servicoid) NOT NULL,
    deleted BOOLEAN DEFAULT FALSE
);

-- DADOS DE TESTE
INSERT INTO tutores (nome, cpf, telefone, rua, numero, bairro, cidade) 
VALUES ('Tutor Exemplo', '111.222.333-44', '11999998888', 'Rua A', '10', 'Centro', 'Votuporanga')
ON CONFLICT (cpf) DO NOTHING;

-- Inserir Serviço
INSERT INTO servicos (nome, descricao, valor) 
VALUES ('Banho e Tosa', 'Banho completo com tosa higiênica', 50.00)
ON CONFLICT (nome) DO NOTHING;