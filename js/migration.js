/**
 * Script de Migração para Banco de Dados - SAG (Sistema de Avaliação e Gerenciamento)
 * 
 * Este arquivo contém:
 * 1. Função para conexão com banco de dados MySQL/MariaDB
 * 2. Funções para execução dos scripts de criação das tabelas
 * 3. Funções para migração de dados do localStorage para o banco de dados relacional
 */

// Importe os scripts SQL do arquivo db.js
import { DB_SCRIPTS } from './db.js';
import mysql from 'mysql2/promise';

/**
 * Configuração de conexão com o banco de dados
 * Substitua com as credenciais do seu ambiente
 */
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sag_db'
};

/**
 * Função para criar a conexão com o banco de dados
 */
async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Conexão com o banco de dados estabelecida com sucesso');
        return { success: true, message: 'Conexão estabelecida', connection };
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        return { success: false, message: error.message };
    }
}

/**
 * Função para criar o banco de dados se não existir
 */
async function createDatabase() {
    try {
        const tempConnection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password
        });
        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
        await tempConnection.end();
        
        console.log(`Banco de dados '${dbConfig.database}' criado com sucesso`);
        return { success: true };
    } catch (error) {
        console.error('Erro ao criar banco de dados:', error);
        return { success: false, message: error.message };
    }
}

/**
 * Função para criar todas as tabelas no banco de dados
 * Executa cada script SQL definido no arquivo db.js
 */
async function createTables() {
    try {
        const connectionResult = await connectToDatabase();
        if (!connectionResult.success) {
            return { success: false, message: 'Falha ao conectar ao banco de dados' };
        }
        
        const connection = connectionResult.connection;
        console.log('Iniciando criação das tabelas...');
        
        // Sequência de criação das tabelas (respeitando as dependências entre elas)
        const tableCreationOrder = [
            { name: 'escolas', script: DB_SCRIPTS.CREATE_SCHOOLS_TABLE },
            { name: 'turmas', script: DB_SCRIPTS.CREATE_CLASSES_TABLE },
            { name: 'alunos', script: DB_SCRIPTS.CREATE_STUDENTS_TABLE },
            { name: 'provas', script: DB_SCRIPTS.CREATE_EXAMS_TABLE },
            { name: 'questoes', script: DB_SCRIPTS.CREATE_QUESTIONS_TABLE },
            { name: 'aplicacoes_prova', script: DB_SCRIPTS.CREATE_EXAM_APPLICATIONS_TABLE },
            { name: 'resultados', script: DB_SCRIPTS.CREATE_RESULTS_TABLE },
            { name: 'usuarios', script: DB_SCRIPTS.CREATE_USERS_TABLE },
            { name: 'habilidades_bncc', script: DB_SCRIPTS.CREATE_BNCC_SKILLS_TABLE },
            { name: 'desempenho_habilidades', script: DB_SCRIPTS.CREATE_SKILL_PERFORMANCE_TABLE }
        ];
        
        for (const table of tableCreationOrder) {
            await connection.query(table.script);
            console.log(`Tabela '${table.name}' criada com sucesso`);
        }
        
        // Criar índices para otimização
        await connection.query(DB_SCRIPTS.CREATE_INDEXES);
        console.log('Índices criados com sucesso');
        
        await connection.end();
        
        return { 
            success: true, 
            message: 'Todas as tabelas foram criadas com sucesso' 
        };
    } catch (error) {
        console.error('Erro ao criar tabelas:', error);
        return { success: false, message: error.message };
    }
}

/**
 * Função para migrar dados do localStorage para o banco de dados
 */
async function migrateData() {
    try {
        const connectionResult = await connectToDatabase();
        if (!connectionResult.success) {
            return { success: false, message: 'Falha ao conectar ao banco de dados' };
        }
        
        const connection = connectionResult.connection;
        console.log('Iniciando migração de dados do localStorage...');
        
        // Migrar escolas
        const schools = JSON.parse(localStorage.getItem('schools')) || [];
        for (const school of schools) {
            const schoolData = {
                nome: school.name,
                regiao: school.region || null,
                grupo: school.group || null,
                data_criacao: school.createdAt ? new Date(school.createdAt) : new Date()
            };
            await connection.query('INSERT INTO escolas SET ?', [schoolData]);
            console.log(`Escola '${school.name}' migrada com sucesso`);
        }
        
        // Migrar turmas
        const classes = JSON.parse(localStorage.getItem('classes')) || [];
        for (const cls of classes) {
            const classData = {
                nome: cls.name,
                serie: cls.series,
                turno: cls.shift.toLowerCase(),
                ano_letivo: new Date().getFullYear().toString(),
                escola_id: cls.schoolId
            };
            await connection.query('INSERT INTO turmas SET ?', [classData]);
            console.log(`Turma '${cls.name}' migrada com sucesso`);
        }
        
        // Migrar alunos
        const students = JSON.parse(localStorage.getItem('students')) || [];
        for (const student of students) {
            const studentData = {
                nome: student.name,
                matricula: student.registration,
                turma_id: student.classId,
                escola_id: student.schoolId
            };
            await connection.query('INSERT INTO alunos SET ?', [studentData]);
            console.log(`Aluno '${student.name}' migrado com sucesso`);
        }
        
        // Migrar usuários
        const users = JSON.parse(localStorage.getItem('users')) || [];
        for (const user of users) {
            const userData = {
                nome: user.name,
                email: user.email,
                senha: user.password, // Considere usar hash para senhas!
                tipo: user.type
            };
            await connection.query('INSERT INTO usuarios SET ?', [userData]);
            console.log(`Usuário '${user.name}' migrado com sucesso`);
        }
        
        await connection.end();
        
        return { 
            success: true, 
            message: 'Migração concluída com sucesso' 
        };
    } catch (error) {
        console.error('Erro ao migrar dados:', error);
        return { success: false, message: error.message };
    }
}

/**
 * Função principal de migração
 * Cria o banco de dados, tabelas e migra os dados
 */
async function runMigration() {
    console.log('Iniciando processo de migração do banco de dados...');
    
    // Passo 1: Criar o banco de dados
    const dbResult = await createDatabase();
    if (!dbResult.success) {
        console.error('Falha ao criar banco de dados. Migração interrompida.');
        return;
    }
    
    // Passo 2: Criar as tabelas
    const tablesResult = await createTables();
    if (!tablesResult.success) {
        console.error('Falha ao criar tabelas. Migração interrompida.');
        return;
    }
    
    // Passo 3: Migrar dados do localStorage
    const migrationResult = await migrateData();
    if (!migrationResult.success) {
        console.error('Falha ao migrar dados. Migração parcialmente concluída.');
        return;
    }
    
    console.log('Migração completa! O sistema agora está usando banco de dados relacional.');
}

/**
 * Executa simulação da migração quando a página carrega
 * Em um ambiente real, isso seria acionado por um botão/processo administrativo
 */
document.addEventListener('DOMContentLoaded', function() {
    // Para fins de demonstração, criamos um botão para iniciar a migração
    const migrationButton = document.createElement('button');
    migrationButton.id = 'runMigrationBtn';
    migrationButton.className = 'fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-lg shadow-lg';
    migrationButton.innerHTML = 'Iniciar Migração para BD';
    migrationButton.onclick = function() {
        if (confirm('Deseja iniciar a migração para o banco de dados relacional? Este processo pode demorar alguns minutos.')) {
            runMigration().then(() => {
                alert('Processo de migração concluído. Verifique o console para detalhes.');
            });
        }
    };
    
    // Adicionar o botão de migração à página (somente para administradores)
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser && currentUser.type === 'admin') {
        document.body.appendChild(migrationButton);
    }
}); 