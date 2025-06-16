/**
 * Script de Banco de Dados - SAG (Sistema de Avaliação e Gerenciamento)
 * 
 * Este arquivo contém:
 * 1. Scripts SQL para criação das tabelas em um banco de dados relacional
 * 2. Schema do banco de dados documentado
 * 3. Definições de relações entre tabelas
 */

/**
 * SCRIPTS SQL PARA CRIAÇÃO DO BANCO DE DADOS
 */

/**
 * Tabela de Escolas
 * Armazena informações básicas sobre as escolas no sistema
 */
const criarTabelaEscolas = `
CREATE TABLE escolas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    regiao VARCHAR(50),
    grupo VARCHAR(50),
    endereco VARCHAR(200),
    telefone VARCHAR(20),
    email VARCHAR(100),
    diretor VARCHAR(100),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

/**
 * Tabela de Turmas
 * Armazena informações sobre as turmas de cada escola
 */
const criarTabelaTurmas = `
CREATE TABLE turmas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    serie INT NOT NULL,
    turno ENUM('manha', 'tarde', 'noite', 'integral') NOT NULL,
    ano_letivo VARCHAR(10) NOT NULL,
    escola_id INT NOT NULL,
    professor_responsavel VARCHAR(100),
    sala VARCHAR(20),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (escola_id) REFERENCES escolas(id) ON DELETE RESTRICT
);
`;

/**
 * Tabela de Alunos
 * Armazena informações sobre os alunos
 */
const criarTabelaAlunos = `
CREATE TABLE alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    matricula VARCHAR(20) UNIQUE NOT NULL,
    data_nascimento DATE,
    genero ENUM('M', 'F', 'O'),
    responsavel VARCHAR(100),
    telefone_responsavel VARCHAR(20),
    email_responsavel VARCHAR(100),
    turma_id INT,
    escola_id INT NOT NULL,
    foto_url VARCHAR(255),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE SET NULL,
    FOREIGN KEY (escola_id) REFERENCES escolas(id) ON DELETE RESTRICT
);
`;

/**
 * Tabela de Provas
 * Armazena informações sobre as provas criadas no sistema
 */
const criarTabelaProvas = `
CREATE TABLE provas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_aplicacao DATE,
    tipo ENUM('diagnostica', 'formativa', 'somativa', 'simulado') NOT NULL,
    disciplina VARCHAR(50),
    serie INT,
    criado_por INT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

/**
 * Tabela de Questões
 * Armazena as questões associadas a cada prova
 */
const criarTabelaQuestoes = `
CREATE TABLE questoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prova_id INT NOT NULL,
    ordem INT NOT NULL,
    enunciado TEXT NOT NULL,
    tipo ENUM('multipla_escolha', 'verdadeiro_falso', 'associativa', 'aberta') NOT NULL,
    opcoes JSON,
    resposta_correta VARCHAR(255),
    valor DECIMAL(5,2) DEFAULT 1.0,
    habilidade_bncc VARCHAR(10),
    descricao_bncc TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (prova_id) REFERENCES provas(id) ON DELETE CASCADE
);
`;

/**
 * Tabela de Aplicação de Provas
 * Relaciona provas com turmas para aplicação
 */
const criarTabelaAplicacoesProva = `
CREATE TABLE aplicacoes_prova (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prova_id INT NOT NULL,
    turma_id INT NOT NULL,
    data_aplicacao DATE NOT NULL,
    hora_inicio TIME,
    hora_termino TIME,
    observacoes TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prova_id) REFERENCES provas(id) ON DELETE CASCADE,
    FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE
);
`;

/**
 * Tabela de Resultados
 * Armazena as respostas e resultados dos alunos nas provas
 */
const criarTabelaResultados = `
CREATE TABLE resultados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    prova_id INT NOT NULL,
    aplicacao_id INT NOT NULL,
    respostas JSON,
    pontuacao DECIMAL(5,2),
    percentual DECIMAL(5,2),
    data_correcao TIMESTAMP,
    corrigido_por INT,
    observacoes TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
    FOREIGN KEY (prova_id) REFERENCES provas(id) ON DELETE CASCADE,
    FOREIGN KEY (aplicacao_id) REFERENCES aplicacoes_prova(id) ON DELETE CASCADE
);
`;

/**
 * Tabela de Usuários
 * Armazena informações sobre os usuários do sistema
 */
const criarTabelaUsuarios = `
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo ENUM('admin', 'professor', 'coordenador', 'diretor') NOT NULL,
    escola_id INT,
    foto_url VARCHAR(255),
    ultimo_acesso TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (escola_id) REFERENCES escolas(id) ON DELETE SET NULL
);
`;

/**
 * Tabela de Habilidades BNCC
 * Armazena o catálogo de habilidades da Base Nacional Comum Curricular
 */
const criarTabelaHabilidadesBNCC = `
CREATE TABLE habilidades_bncc (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(10) UNIQUE NOT NULL,
    componente VARCHAR(50) NOT NULL,
    ano VARCHAR(10) NOT NULL,
    descricao TEXT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

/**
 * Tabela de Relatórios de Desempenho por Habilidade
 * Armazena métricas de desempenho dos alunos em cada habilidade BNCC
 */
const criarTabelaDesempenhoHabilidades = `
CREATE TABLE desempenho_habilidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    habilidade_id INT NOT NULL,
    escola_id INT NOT NULL,
    turma_id INT,
    prova_id INT,
    total_questoes INT NOT NULL,
    total_acertos INT NOT NULL,
    percentual_acertos DECIMAL(5,2) NOT NULL,
    data_avaliacao DATE NOT NULL,
    ano_letivo VARCHAR(10) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (habilidade_id) REFERENCES habilidades_bncc(id) ON DELETE CASCADE,
    FOREIGN KEY (escola_id) REFERENCES escolas(id) ON DELETE CASCADE,
    FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE SET NULL,
    FOREIGN KEY (prova_id) REFERENCES provas(id) ON DELETE SET NULL
);
`;

/**
 * SCHEMA DO BANCO DE DADOS - DOCUMENTAÇÃO
 * 
 * Relacionamentos:
 * 
 * 1. Uma ESCOLA pode ter várias TURMAS (1:N)
 * 2. Uma TURMA pertence a uma ESCOLA (N:1)
 * 3. Uma TURMA pode ter vários ALUNOS (1:N)
 * 4. Um ALUNO pertence a uma TURMA (N:1)
 * 5. Um ALUNO está vinculado a uma ESCOLA (N:1)
 * 6. Uma PROVA pode ser aplicada a várias TURMAS (M:N) através de APLICACOES_PROVA
 * 7. Uma PROVA contém várias QUESTÕES (1:N)
 * 8. Uma QUESTÃO pode estar associada a uma HABILIDADE_BNCC (N:1)
 * 9. RESULTADOS registram o desempenho de um ALUNO em uma PROVA específica
 * 10. DESEMPENHO_HABILIDADES armazena métricas agregadas por habilidade BNCC
 * 
 * Tabelas principais:
 * - escolas: Cadastro das instituições de ensino
 * - turmas: Grupos de alunos organizados por série/ano
 * - alunos: Cadastro dos estudantes
 * - provas: Avaliações criadas no sistema
 * - questoes: Componentes individuais de cada prova
 * - resultados: Respostas e pontuações dos alunos
 * - habilidades_bncc: Catálogo de competências da BNCC
 * - desempenho_habilidades: Métricas de performance por habilidade
 */

/**
 * ÍNDICES SUGERIDOS PARA OTIMIZAÇÃO DE CONSULTAS
 */
const criarIndices = `
-- Índices para a tabela de turmas
CREATE INDEX idx_turmas_escola ON turmas(escola_id);
CREATE INDEX idx_turmas_ano_letivo ON turmas(ano_letivo);

-- Índices para a tabela de alunos
CREATE INDEX idx_alunos_turma ON alunos(turma_id);
CREATE INDEX idx_alunos_escola ON alunos(escola_id);

-- Índices para a tabela de questões
CREATE INDEX idx_questoes_prova ON questoes(prova_id);
CREATE INDEX idx_questoes_habilidade ON questoes(habilidade_bncc);

-- Índices para a tabela de resultados
CREATE INDEX idx_resultados_aluno ON resultados(aluno_id);
CREATE INDEX idx_resultados_prova ON resultados(prova_id);
CREATE INDEX idx_resultados_aplicacao ON resultados(aplicacao_id);

-- Índices para a tabela de desempenho de habilidades
CREATE INDEX idx_desempenho_habilidade ON desempenho_habilidades(habilidade_id);
CREATE INDEX idx_desempenho_escola ON desempenho_habilidades(escola_id);
CREATE INDEX idx_desempenho_turma ON desempenho_habilidades(turma_id);
CREATE INDEX idx_desempenho_prova ON desempenho_habilidades(prova_id);
CREATE INDEX idx_desempenho_ano_letivo ON desempenho_habilidades(ano_letivo);
`;

/**
 * CONSULTAS ÚTEIS PARA O SISTEMA
 */

// Consulta de ranking de alunos por desempenho geral
const consultaRankingAlunos = `
SELECT 
    a.id, 
    a.nome, 
    a.matricula,
    e.nome AS escola,
    e.regiao,
    e.grupo,
    t.nome AS turma,
    t.serie,
    AVG(r.percentual) AS media_desempenho
FROM 
    alunos a
    JOIN escolas e ON a.escola_id = e.id
    LEFT JOIN turmas t ON a.turma_id = t.id
    JOIN resultados r ON a.id = r.aluno_id
GROUP BY 
    a.id, a.nome, a.matricula, e.nome, e.regiao, e.grupo, t.nome, t.serie
ORDER BY 
    media_desempenho DESC;
`;

// Consulta de desempenho por habilidade BNCC
const consultaDesempenhoHabilidades = `
SELECT 
    h.codigo, 
    h.componente,
    h.ano,
    h.descricao,
    e.nome AS escola,
    e.regiao,
    e.grupo,
    d.percentual_acertos,
    d.ano_letivo
FROM 
    desempenho_habilidades d
    JOIN habilidades_bncc h ON d.habilidade_id = h.id
    JOIN escolas e ON d.escola_id = e.id
    LEFT JOIN turmas t ON d.turma_id = t.id
ORDER BY 
    d.percentual_acertos DESC;
`;

// Exportar todas as constantes e scripts SQL
export {
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
    criarIndices,
    consultaRankingAlunos,
    consultaDesempenhoHabilidades
}; 