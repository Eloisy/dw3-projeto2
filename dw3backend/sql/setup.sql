----------------------------------------------------
-- 1. TABELA DE LOGIN (USUÁRIOS)
----------------------------------------------------
-- Tabela para autenticação. A inserção do usuário 'qwe' 
-- com hash dinâmico será feita pelo setup.js.
DROP TABLE IF EXISTS usuarios CASCADE;
CREATE TABLE usuarios (
    usuarioid BIGSERIAL CONSTRAINT pk_usuarios PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    deleted BOOLEAN DEFAULT FALSE
);


----------------------------------------------------
-- 2. TABELA TUTORES (Entidade Principal)
----------------------------------------------------
-- NOVO SCRIPT PARA TUTORES
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

----------------------------------------------------
-- 3. TABELA PETS (Relacionamento 1:N com TUTORES)
-- Um Tutor pode ter vários Pets.
----------------------------------------------------
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


----------------------------------------------------
-- 4. TABELA SERVIÇOS (Entidade Principal)
----------------------------------------------------
DROP TABLE IF EXISTS servicos CASCADE;
CREATE TABLE servicos (
    servicoid BIGSERIAL CONSTRAINT pk_servicos PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL,
    descricao VARCHAR(100) NOT NULL,
    valor NUMERIC(7, 2) NOT NULL,
    deleted BOOLEAN DEFAULT FALSE
);

-- SCRIPT PARA PET_SERVICOS
DROP TABLE IF EXISTS pet_servicos CASCADE;
CREATE TABLE pet_servicos (
    pet_servicoid BIGSERIAL CONSTRAINT pk_pet_servicos PRIMARY KEY,
    observacao TEXT, 
    data_servico DATE NOT NULL DEFAULT CURRENT_DATE,
    petid BIGINT CONSTRAINT fk_ps_pet REFERENCES pets (petid) NOT NULL,
    servicoid BIGINT CONSTRAINT fk_ps_servico REFERENCES servicos (servicoid) NOT NULL,

    deleted BOOLEAN DEFAULT FALSE
);

----------------------------------------------------
-- 6. INSERÇÃO DE DADOS INICIAIS (Para Teste)
----------------------------------------------------

-- Insere um tutor de teste
-- NOVO CÓDIGO CORRIGIDO
INSERT INTO tutores (nome, cpf, telefone, rua, numero, bairro, cidade) 
VALUES ('Teste', '12345678900', '1199990000', 'Rua Principal', '100', 'Centro', 'Votuporanga')
ON CONFLICT (cpf) DO NOTHING;

-- Insere pets
INSERT INTO pets (nome, raca, genero, tutorid) 
VALUES 
('Max', 'Golden', 'M', (SELECT tutorid FROM tutores WHERE nome = 'Teste')),
('Mimi', 'Siamês', 'F', (SELECT tutorid FROM tutores WHERE nome = 'Teste'))
ON CONFLICT DO NOTHING;

-- Insere serviços 
INSERT INTO servicos (nome, descricao, valor) 
VALUES 
('Banho Total', 'Banho com shampoo especial e tosa completa', 80.00),
('Consulta Básica', 'Avaliação de rotina com veterinário', 150.00)
ON CONFLICT (nome) DO NOTHING;

-- Insere um registro N:M 
INSERT INTO pet_servicos (petid, servicoid)
VALUES
(
  (SELECT petid FROM pets WHERE nome = 'Max'), 
  (SELECT servicoid FROM servicos WHERE nome = 'Banho Total')
)
ON CONFLICT DO NOTHING;