// dw3backend/setup.js

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const bCrypt = require('bcryptjs'); 

require('dotenv').config(); 

// Configurações do Banco de Dados
const dbConfig = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
};

const dbCreationConfig = { ...dbConfig, database: 'postgres' };
const dbName = process.env.PGDATABASE; // dw3_projeto2


const TEST_USER_PASSWORD = 'qwe';
const TEST_USER_USERNAME = 'qwe';
const hashQWE = bCrypt.hashSync(TEST_USER_PASSWORD, bCrypt.genSaltSync(10)); 



async function runSetup() {
  
  // ----------------------------------------------------
  // ETAPA 1: CRIAR O BANCO DE DADOS
  // ----------------------------------------------------
  let clientCreation = new Client(dbCreationConfig);
  try {
    console.log(`🔗 Conectando ao banco padrão 'postgres' para criar ${dbName}...`);
    await clientCreation.connect();
    
    // Verifica se o banco já existe
    const res = await clientCreation.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
    
    if (res.rowCount === 0) {
      console.log(`⏳ Criando banco de dados: ${dbName}`);
      await clientCreation.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Banco de dados ${dbName} criado com sucesso.`);
    } else {
      console.log(`⚠️ Banco de dados ${dbName} já existe. Pulando a criação.`);
    }

  } catch (err) {
    console.error('❌ Erro na Etapa 1 (Criação do Banco):', err.message);
  } finally {
    await clientCreation.end();
  }
  
  // ----------------------------------------------------
  // ETAPA 2: CRIAR TABELAS E INSERIR USUÁRIOS
  // ----------------------------------------------------
  const clientSetup = new Client({ ...dbConfig, database: dbName }); 
  try {
    console.log(`🔗 Conectando a ${dbName} para criar tabelas...`);
    await clientSetup.connect();
    
    // 1. Executa o SQL para criar todas as tabelas (tutores, cursos, etc.)
    const sql = fs.readFileSync(path.join(__dirname, 'sql', 'setup.sql')).toString();
    await clientSetup.query(sql);

    // 2. Insere o usuário de teste, usando o hash dinâmico
    const insertUserSql = `
        INSERT INTO usuarios (username, password) VALUES 
        ($1, $2)
        ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password;
    `;
    await clientSetup.query(insertUserSql, [TEST_USER_USERNAME, hashQWE]);

    console.log('✨ Setup concluído: Tabela "usuarios" criada e usuário "qwe" inserido com hash dinâmico.');

  } catch (err) {
    console.error('❌ Erro na Etapa 2 (Criação de Tabela):', err.message);
  } finally {
    await clientSetup.end();
    console.log('Desconectado do banco.');
  }
}

runSetup();