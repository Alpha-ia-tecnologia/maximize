/**
 * Script de Migração do Banco de Dados SAG
 * Este script conecta ao MySQL, cria o banco de dados e todas as tabelas
 * definidas em db.js na ordem correta respeitando as dependências de chaves estrangeiras.
 */

import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  criarTabelaEscolas,
  criarTabelaTurmas,
  criarTabelaAlunos,
  criarTabelaProvas,
  criarTabelaQuestoes,
  criarTabelaAplicacoesProva,
  criarTabelaResultados,
  criarTabelaUsuarios,
  criarTabelaHabilidadesBNCC,
  criarTabelaDesempenhoHabilidades,
  criarIndices
} from './db.js';

// Configuração do banco de dados
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'sua_senha', // Altere para sua senha do MySQL
  port: 3306
};

const DB_NAME = 'sag_sistema';

/**
 * Conecta ao servidor MySQL sem selecionar um banco de dados
 */
async function conectarAoMySQL() {
  try {
    console.log('📡 Conectando ao servidor MySQL...');
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });
    console.log('✅ Conexão com MySQL estabelecida com sucesso!');
    return connection;
  } catch (error) {
    console.error('❌ Erro ao conectar ao MySQL:', error.message);
    throw error;
  }
}

/**
 * Cria o banco de dados se não existir
 */
async function criarBancoDeDados(connection) {
  try {
    console.log(`🔧 Verificando se o banco de dados '${DB_NAME}' existe...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
    console.log(`✅ Banco de dados '${DB_NAME}' verificado/criado com sucesso!`);
    
    // Seleciona o banco de dados para uso
    await connection.query(`USE ${DB_NAME}`);
    console.log(`✅ Banco de dados '${DB_NAME}' selecionado para uso.`);
  } catch (error) {
    console.error(`❌ Erro ao criar/selecionar o banco de dados '${DB_NAME}':`, error.message);
    throw error;
  }
}

/**
 * Executa a criação das tabelas na ordem correta respeitando as dependências
 */
async function criarTabelas(connection) {
  // Ordem de criação das tabelas para respeitar as dependências de chaves estrangeiras
  const scriptsCriacao = [
    { nome: 'Escolas', script: criarTabelaEscolas },
    { nome: 'Turmas', script: criarTabelaTurmas },
    { nome: 'Alunos', script: criarTabelaAlunos },
    { nome: 'Provas', script: criarTabelaProvas },
    { nome: 'Questões', script: criarTabelaQuestoes },
    { nome: 'Aplicações de Prova', script: criarTabelaAplicacoesProva },
    { nome: 'Resultados', script: criarTabelaResultados },
    { nome: 'Usuários', script: criarTabelaUsuarios },
    { nome: 'Habilidades BNCC', script: criarTabelaHabilidadesBNCC },
    { nome: 'Desempenho por Habilidades', script: criarTabelaDesempenhoHabilidades }
  ];

  for (const { nome, script } of scriptsCriacao) {
    try {
      console.log(`📊 Criando tabela: ${nome}...`);
      await connection.query(script);
      console.log(`✅ Tabela ${nome} criada com sucesso!`);
    } catch (error) {
      console.error(`❌ Erro ao criar tabela ${nome}:`, error.message);
      throw error;
    }
  }
}

/**
 * Cria os índices para otimização de consultas
 */
async function criarIndicesTabelas(connection) {
  try {
    console.log('📈 Criando índices para otimização de consultas...');
    await connection.query(criarIndices);
    console.log('✅ Índices criados com sucesso!');
  } catch (error) {
    console.error('⚠️ Erro ao criar índices:', error.message);
    console.log('⚠️ Continuando a migração mesmo sem todos os índices...');
    // Não interrompemos a migração se os índices falharem, pois são opcionais
  }
}

/**
 * Executa todo o processo de migração
 */
async function executarMigracao() {
  let connection = null;

  try {
    console.log('🚀 Iniciando processo de migração do banco de dados...');
    
    // Conectar ao MySQL
    connection = await conectarAoMySQL();
    
    // Criar o banco de dados
    await criarBancoDeDados(connection);
    
    // Criar as tabelas
    await criarTabelas(connection);
    
    // Criar os índices
    await criarIndicesTabelas(connection);
    
    console.log('🎉 Migração concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante o processo de migração:', error);
    process.exit(1);
  } finally {
    // Fechar a conexão
    if (connection) {
      await connection.end();
      console.log('🔌 Conexão com o banco de dados encerrada.');
    }
  }
}

// Executar a migração
executarMigracao().catch(console.error); 