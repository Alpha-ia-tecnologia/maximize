// Inicialização do banco de dados local
function initDB() {
  if (!localStorage.getItem("users")) {
    // Criando usuário admin padrão
    const users = [
      {
        id: 1,
        email: "admin@sag.com",
        password: "admin123",
        type: "admin",
        name: "Administrador",
      },
    ];
    localStorage.setItem("users", JSON.stringify(users));
  }

  if (!localStorage.getItem("schools")) {
    localStorage.setItem("schools", JSON.stringify([]));
  }

  if (!localStorage.getItem("classes")) {
    localStorage.setItem("classes", JSON.stringify([]));
  }

  if (!localStorage.getItem("students")) {
    localStorage.setItem("students", JSON.stringify([]));
  }

  if (!localStorage.getItem("exams")) {
    localStorage.setItem("exams", JSON.stringify([]));
  }

  if (!localStorage.getItem("results")) {
    localStorage.setItem("results", JSON.stringify([]));
  }

  if (!localStorage.getItem("questionBank")) {
    localStorage.setItem("questionBank", JSON.stringify([]));
  }
}

// Função para verificar autenticação
function checkAuth() {
  const currentUser = sessionStorage.getItem("currentUser");

  if (!currentUser) {
    console.log("Usuário não autenticado. Redirecionando para login...");
    window.location.href = "index.html";
    return false;
  }

  return true;
}

// Função para verificar se é administrador
function isAdmin(user) {
  if (!user) return false;

  // Se for um objeto string, parsear
  const userData = typeof user === "string" ? JSON.parse(user) : user;

  // Lista de valores que identificam um administrador
  const adminValues = [
    "ADMINISTRADOR",
    "ADMIN",
    "admin",
    "Administrador",
    "Administrator",
  ];

  // Verificar type e role
  return (
    adminValues.includes(userData.type) || adminValues.includes(userData.role)
  );
}

// Função de login simulada
function mockLogin() {
  // Simulando um login bem-sucedido
  const mockUser = {
    id: 1,
    name: "Administrador",
    username: "admin",
    role: "admin",
  };

  sessionStorage.setItem("currentUser", JSON.stringify(mockUser));
  return mockUser;
}

// Função de login
function login(username, password) {
  // Aqui seria feita uma chamada de API real
  // Simulando um login bem-sucedido
  const mockUser = {
    id: 1,
    name: "Administrador",
    username: username,
    role: "admin",
  };

  sessionStorage.setItem("currentUser", JSON.stringify(mockUser));
  return mockUser;
}

// Função de logout
function logout() {
  sessionStorage.removeItem("currentUser");
  localStorage.removeItem("userToken");
  window.location.href = "index.html";
}

// Funções para gerenciar escolas
function addSchool(name, region = "", group = "") {
  const schools = JSON.parse(localStorage.getItem("schools"));
  const newSchool = {
    id: schools.length > 0 ? Math.max(...schools.map((s) => s.id)) + 1 : 1,
    name,
    region,
    group,
    createdAt: new Date().toISOString(),
  };
  schools.push(newSchool);
  localStorage.setItem("schools", JSON.stringify(schools));
  return newSchool;
}

function getSchools(filters = {}) {
  let schools = JSON.parse(localStorage.getItem("schools"));

  // Aplicar filtros se existirem
  if (filters.region) {
    schools = schools.filter((s) => s.region === filters.region);
  }

  if (filters.group) {
    schools = schools.filter((s) => s.group === filters.group);
  }

  return schools;
}

function updateSchool(id, updates) {
  const schools = JSON.parse(localStorage.getItem("schools"));
  const index = schools.findIndex((s) => s.id === id);

  if (index === -1) {
    return null; // Escola não encontrada
  }

  // Atualizar os dados da escola
  schools[index] = {
    ...schools[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem("schools", JSON.stringify(schools));
  return schools[index];
}

function deleteSchool(id) {
  let schools = JSON.parse(localStorage.getItem("schools"));
  const schoolToDelete = schools.find((s) => s.id === id);

  if (!schoolToDelete) {
    return false; // Escola não encontrada
  }

  // Verificar dependências antes de excluir
  const classes = JSON.parse(localStorage.getItem("classes"));
  const hasClasses = classes.some((c) => c.schoolId === id);

  if (hasClasses) {
    return {
      success: false,
      reason: "Esta escola possui turmas associadas e não pode ser excluída.",
    };
  }

  // Remover a escola
  schools = schools.filter((s) => s.id !== id);
  localStorage.setItem("schools", JSON.stringify(schools));

  return { success: true };
}

function getSchoolById(id) {
  const schools = JSON.parse(localStorage.getItem("schools"));
  return schools.find((s) => s.id === id) || null;
}

function getRegions() {
  const schools = JSON.parse(localStorage.getItem("schools"));
  // Extrair regiões únicas, excluindo valores vazios
  return [...new Set(schools.map((s) => s.region).filter(Boolean))];
}

function getGroups() {
  const schools = JSON.parse(localStorage.getItem("schools"));
  // Extrair grupos únicos, excluindo valores vazios
  return [...new Set(schools.map((s) => s.group).filter(Boolean))];
}

// Funções para gerenciar turmas
function addClass(name, series, schoolId, shift) {
  const classes = JSON.parse(localStorage.getItem("classes"));
  const newClass = {
    id: classes.length > 0 ? Math.max(...classes.map((c) => c.id)) + 1 : 1,
    name,
    series,
    schoolId,
    shift,
  };
  classes.push(newClass);
  localStorage.setItem("classes", JSON.stringify(classes));
  return newClass;
}

function getClasses(schoolId = null) {
  const classes = JSON.parse(localStorage.getItem("classes"));
  if (schoolId) {
    return classes.filter((c) => c.schoolId === schoolId);
  }
  return classes;
}

// Funções para gerenciar alunos
function addStudent(name, registration, schoolId, classId) {
  const students = JSON.parse(localStorage.getItem("students"));
  const newStudent = {
    id: students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1,
    name,
    registration,
    schoolId,
    classId,
  };
  students.push(newStudent);
  localStorage.setItem("students", JSON.stringify(students));
  return newStudent;
}

function getStudents(schoolId = null, classId = null) {
  const students = JSON.parse(localStorage.getItem("students"));
  if (schoolId && classId) {
    return students.filter(
      (s) => s.schoolId === schoolId && s.classId === classId
    );
  } else if (schoolId) {
    return students.filter((s) => s.schoolId === schoolId);
  }
  return students;
}

// Funções para gerenciar provas
function addExam(name, questions) {
  const exams = JSON.parse(localStorage.getItem("exams"));
  const newExam = {
    id: exams.length > 0 ? Math.max(...exams.map((e) => e.id)) + 1 : 1,
    name,
    questions,
    createdAt: new Date(),
  };
  exams.push(newExam);
  localStorage.setItem("exams", JSON.stringify(exams));
  return newExam;
}

function getExams() {
  return JSON.parse(localStorage.getItem("exams"));
}

function getExam(id) {
  const exams = JSON.parse(localStorage.getItem("exams"));
  return exams.find((e) => e.id === id);
}

// Função para calcular a taxa de participação
function calculateParticipationRate() {
  const students = JSON.parse(localStorage.getItem("students")) || [];
  const results = JSON.parse(localStorage.getItem("results")) || [];

  if (students.length === 0) return 0;

  // Contagem de alunos únicos que realizaram provas
  const participatingStudents = new Set(results.map((r) => r.studentId)).size;

  // Cálculo da taxa de participação
  const rate = (participatingStudents / students.length) * 100;
  return Math.round(rate);
}

// Funções para vincular provas a turmas
function linkExamToClass(examId, schoolId, grade, classId, shift) {
  const exams = JSON.parse(localStorage.getItem("exams"));
  const exam = exams.find((e) => e.id === examId);

  if (!exam) return null;

  if (!exam.links) exam.links = [];

  const link = {
    id:
      exam.links.length > 0 ? Math.max(...exam.links.map((l) => l.id)) + 1 : 1,
    schoolId,
    grade,
    classId,
    shift,
    date: new Date(),
  };

  exam.links.push(link);
  localStorage.setItem("exams", JSON.stringify(exams));
  return link;
}

// Funções para usuários
function addUser(email, password, type, name) {
  const users = JSON.parse(localStorage.getItem("users"));
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
    email,
    password,
    type,
    name,
  };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  return newUser;
}

function getUsers() {
  return JSON.parse(localStorage.getItem("users"));
}

// Funções para registrar e obter resultados das provas
function saveExamResult(studentId, examId, answers, score) {
  const results = JSON.parse(localStorage.getItem("results")) || [];
  const newResult = {
    id: results.length > 0 ? Math.max(...results.map((r) => r.id)) + 1 : 1,
    studentId,
    examId,
    answers,
    score,
    date: new Date().toISOString(),
  };

  results.push(newResult);
  localStorage.setItem("results", JSON.stringify(results));
  return newResult;
}

function getExamResults(filters = {}) {
  let results = JSON.parse(localStorage.getItem("results")) || [];

  if (filters.studentId) {
    results = results.filter((r) => r.studentId === filters.studentId);
  }

  if (filters.examId) {
    results = results.filter((r) => r.examId === filters.examId);
  }

  return results;
}

// Funções para gerenciar o banco de questões
function initQuestionBank() {
  if (!localStorage.getItem("questionBank")) {
    localStorage.setItem("questionBank", JSON.stringify([]));
  }

  // Verificar se o banco de questões já tem dados estruturados corretamente
  try {
    const questions = JSON.parse(localStorage.getItem("questionBank"));
    if (!Array.isArray(questions)) {
      console.warn(
        "Banco de questões não está em formato de array, inicializando novamente"
      );
      localStorage.setItem("questionBank", JSON.stringify([]));
    }
  } catch (error) {
    console.error("Erro ao ler banco de questões:", error);
    localStorage.setItem("questionBank", JSON.stringify([]));
  }
}

// Adicionar uma questão ao banco de questões
function addQuestionToBank(question) {
  const questionBank = getQuestionBank();

  // Verificar se a questão já existe (baseado no texto e alternativas)
  const existingQuestionIndex = questionBank.findIndex(
    (q) =>
      q.text === question.text &&
      JSON.stringify(q.options) === JSON.stringify(question.options)
  );

  if (existingQuestionIndex !== -1) {
    // Se encontrou uma questão igual, apenas atualiza ela
    questionBank[existingQuestionIndex] = {
      ...questionBank[existingQuestionIndex],
      ...question,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("questionBank", JSON.stringify(questionBank));
    return questionBank[existingQuestionIndex];
  }

  // Gerar ID único para a questão
  const newQuestion = {
    ...question,
    id:
      questionBank.length > 0
        ? Math.max(...questionBank.map((q) => q.id)) + 1
        : 1,
    addedAt: new Date().toISOString(),
  };

  questionBank.push(newQuestion);
  localStorage.setItem("questionBank", JSON.stringify(questionBank));
  return newQuestion;
}

// Obter todas as questões do banco
function getQuestionBank(filters = {}) {
  let questions = JSON.parse(localStorage.getItem("questionBank")) || [];

  // Aplicar filtros se existirem
  if (filters.component) {
    questions = questions.filter(
      (q) => q.metadata && q.metadata.curriculumComponent === filters.component
    );
  }

  if (filters.grade) {
    questions = questions.filter(
      (q) => q.metadata && q.metadata.gradeLevel === filters.grade
    );
  }

  if (filters.difficulty) {
    questions = questions.filter(
      (q) => q.metadata && q.metadata.difficultyLevel === filters.difficulty
    );
  }

  if (filters.educationLevel) {
    questions = questions.filter(
      (q) => q.metadata && q.metadata.educationLevel === filters.educationLevel
    );
  }

  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    questions = questions.filter(
      (q) =>
        (q.text && q.text.toLowerCase().includes(term)) ||
        (q.options &&
          q.options.some(
            (opt) => opt.text && opt.text.toLowerCase().includes(term)
          )) ||
        (q.metadata &&
          q.metadata.bnccCodes &&
          q.metadata.bnccCodes.toLowerCase().includes(term))
    );
  }

  // Ordenar por data de adição (mais recentes primeiro)
  questions.sort((a, b) => {
    const dateA = a.addedAt ? new Date(a.addedAt) : new Date(0);
    const dateB = b.addedAt ? new Date(b.addedAt) : new Date(0);
    return dateB - dateA;
  });

  return questions;
}

// Remover uma questão do banco
function removeQuestionFromBank(questionId) {
  let questionBank = getQuestionBank();
  const initialLength = questionBank.length;
  questionBank = questionBank.filter((q) => q.id !== questionId);

  if (questionBank.length < initialLength) {
    localStorage.setItem("questionBank", JSON.stringify(questionBank));
    return true;
  }
  return false; // Nenhuma questão foi removida
}

// Atualizar uma questão no banco
function updateQuestionInBank(questionId, updates) {
  const questionBank = getQuestionBank();
  const index = questionBank.findIndex((q) => q.id === questionId);

  if (index === -1) return false;

  questionBank[index] = {
    ...questionBank[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem("questionBank", JSON.stringify(questionBank));
  return questionBank[index];
}

// Obter uma questão específica do banco por ID
function getQuestionFromBank(questionId) {
  const questionBank = getQuestionBank();
  return questionBank.find((q) => q.id === questionId) || null;
}

// Limitar o tamanho do banco de questões para não exceder o limite do localStorage
function limitQuestionBankSize(maxQuestions = 500) {
  let questionBank = getQuestionBank();

  if (questionBank.length <= maxQuestions) {
    return questionBank; // Não precisa limitar
  }

  // Ordenar por data (mais antigas primeiro)
  questionBank.sort((a, b) => {
    const dateA = a.addedAt ? new Date(a.addedAt) : new Date(0);
    const dateB = b.addedAt ? new Date(b.addedAt) : new Date(0);
    return dateA - dateB;
  });

  // Remover questões mais antigas até atingir o limite
  const questionsToRemove = questionBank.length - maxQuestions;
  questionBank = questionBank.slice(questionsToRemove);

  // Salvar banco reduzido
  localStorage.setItem("questionBank", JSON.stringify(questionBank));

  console.log(
    `Banco de questões limitado: ${questionsToRemove} questões antigas removidas.`
  );
  return questionBank;
}

// Exportar o banco de questões para um arquivo JSON
function exportQuestionBank() {
  const questionBank = getQuestionBank();
  const jsonData = JSON.stringify(questionBank, null, 2);

  // Criar um blob com os dados
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Criar link para download
  const a = document.createElement("a");
  a.href = url;
  a.download = `banco_questoes_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();

  // Limpar
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);

  return {
    success: true,
    message: "Banco de questões exportado com sucesso!",
    count: questionBank.length,
  };
}

// Importar banco de questões a partir de um arquivo JSON
function importQuestionBank(jsonFile, callback) {
  const reader = new FileReader();

  reader.onload = function (event) {
    try {
      const questions = JSON.parse(event.target.result);

      if (!Array.isArray(questions)) {
        throw new Error(
          "Formato inválido: o arquivo deve conter um array de questões"
        );
      }

      // Adicionar cada questão ao banco existente
      let successCount = 0;
      let errorCount = 0;

      questions.forEach((question) => {
        try {
          // Verificar se a questão tem os campos necessários
          if (!question.text || !question.options || !question.correctAnswer) {
            errorCount++;
            return;
          }

          addQuestionToBank(question);
          successCount++;
        } catch (error) {
          console.error("Erro ao adicionar questão:", error);
          errorCount++;
        }
      });

      // Limitar o tamanho do banco após importação
      limitQuestionBankSize();

      if (callback) {
        callback({
          success: true,
          total: questions.length,
          imported: successCount,
          errors: errorCount,
        });
      }
    } catch (error) {
      console.error("Erro ao importar banco de questões:", error);
      if (callback) {
        callback({
          success: false,
          error: error.message,
        });
      }
    }
  };

  reader.onerror = function () {
    if (callback) {
      callback({
        success: false,
        error: "Erro ao ler o arquivo",
      });
    }
  };

  reader.readAsText(jsonFile);
}

// Formatar data para exibição
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
}

// Exibir mensagem de erro ou sucesso
function showMessage(message, isError = false) {
  alert(message);
}

// Exportar funções para uso global
window.appUtils = {
  checkAuth,
  login,
  logout,
  formatDate,
  showMessage,
};

// Verificar autenticação ao carregar a página, exceto na página de login
document.addEventListener("DOMContentLoaded", function () {
  const isLoginPage =
    window.location.pathname.includes("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname === "";

  if (!isLoginPage) {
    checkAuth();
  }

  // Configurar evento de logout nos botões correspondentes
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  }

  // Verificar e exibir nome do usuário em todas as páginas
  const userNameDisplay = document.getElementById("userNameDisplay");
  if (userNameDisplay) {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (currentUser) {
      userNameDisplay.textContent = currentUser.name;

      // Debug para verificação de tipo
      console.log("Tipo de usuário carregado:", currentUser.type);
      console.log("É administrador:", isAdmin(currentUser));
    }
  }
});

// Função para obter escolas
function getSchools() {
  try {
    const schools = JSON.parse(localStorage.getItem("schools")) || [];
    return schools;
  } catch (error) {
    console.error("Erro ao obter escolas:", error);
    return [];
  }
}

// Função para obter turmas, opcionalmente filtradas por escola
function getClasses(schoolId = null) {
  try {
    const classes = JSON.parse(localStorage.getItem("classes")) || [];
    if (schoolId) {
      return classes.filter((c) => c.schoolId === schoolId);
    }
    return classes;
  } catch (error) {
    console.error("Erro ao obter turmas:", error);
    return [];
  }
}

// Função para obter usuários
function getUsers() {
  try {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users;
  } catch (error) {
    console.error("Erro ao obter usuários:", error);
    return [];
  }
}

// Função para obter alunos, opcionalmente filtrados por turma
function getStudents(classId = null) {
  try {
    const students = JSON.parse(localStorage.getItem("students")) || [];
    if (classId) {
      return students.filter((s) => s.classId === classId);
    }
    return students;
  } catch (error) {
    console.error("Erro ao obter alunos:", error);
    return [];
  }
}

// Função para exibir alerta personalizado
function showAlert(type, title, message, duration = 3000, callback = null) {
  // Verificar se já existe um alerta na página
  let alertBox = document.getElementById("customAlert");

  // Se não existe, criar um novo
  if (!alertBox) {
    alertBox = document.createElement("div");
    alertBox.id = "customAlert";
    alertBox.className =
      "fixed top-5 right-5 rounded-lg shadow-lg p-4 max-w-md z-50 transition-all duration-300 transform translate-x-full";
    document.body.appendChild(alertBox);
  }

  // Definir cores com base no tipo
  let bgColor, borderColor, iconClass;

  switch (type) {
    case "success":
      bgColor = "bg-green-100";
      borderColor = "border-green-500";
      iconClass = "text-green-500 fas fa-check-circle";
      break;
    case "error":
      bgColor = "bg-red-100";
      borderColor = "border-red-500";
      iconClass = "text-red-500 fas fa-exclamation-circle";
      break;
    case "warning":
      bgColor = "bg-yellow-100";
      borderColor = "border-yellow-500";
      iconClass = "text-yellow-500 fas fa-exclamation-triangle";
      break;
    case "info":
    default:
      bgColor = "bg-blue-100";
      borderColor = "border-blue-500";
      iconClass = "text-blue-500 fas fa-info-circle";
      break;
  }

  // Atualizar conteúdo e classes
  alertBox.className = `fixed top-5 right-5 rounded-lg shadow-lg p-4 max-w-md z-50 transition-all duration-300 transform translate-x-0 ${bgColor} border-l-4 ${borderColor}`;
  alertBox.innerHTML = `
        <div class="flex items-start">
            <div class="flex-shrink-0">
                <i class="${iconClass} text-xl"></i>
            </div>
            <div class="ml-3 w-0 flex-1">
                <p class="font-medium text-gray-900">${title}</p>
                <p class="mt-1 text-sm text-gray-700">${message}</p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
                <button class="inline-flex text-gray-400 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;

  // Adicionar evento para fechar o alerta manualmente
  const closeBtn = alertBox.querySelector("button");
  closeBtn.addEventListener("click", function () {
    hideAlert(alertBox);
  });

  // Esconder o alerta após o tempo definido
  setTimeout(() => {
    hideAlert(alertBox);

    // Executar callback se fornecido
    if (callback && typeof callback === "function") {
      callback();
    }
  }, duration);
}

// Função para esconder o alerta com animação
function hideAlert(alertBox) {
  alertBox.classList.remove("translate-x-0");
  alertBox.classList.add("translate-x-full");

  // Remover o elemento após a animação
  setTimeout(() => {
    if (alertBox.parentNode) {
      alertBox.parentNode.removeChild(alertBox);
    }
  }, 300);
}

// Função para confirmar a exclusão
function showDeleteConfirm(title, message, confirmCallback) {
  // Verificar se já existe um modal na página
  let confirmModal = document.getElementById("deleteConfirmModal");

  // Se não existe, criar um novo
  if (!confirmModal) {
    confirmModal = document.createElement("div");
    confirmModal.id = "deleteConfirmModal";
    confirmModal.className =
      "fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50";
    document.body.appendChild(confirmModal);
  }

  // Atualizar conteúdo
  confirmModal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
            <div class="mb-4">
                <h3 class="text-lg font-medium text-gray-900">${title}</h3>
                <p class="mt-2 text-sm text-gray-500">${message}</p>
            </div>
            <div class="flex justify-end space-x-3">
                <button id="cancelDeleteBtn" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                    Cancelar
                </button>
                <button id="confirmDeleteBtn" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                    Excluir
                </button>
            </div>
        </div>
    `;

  // Adicionar eventos aos botões
  document
    .getElementById("cancelDeleteBtn")
    .addEventListener("click", function () {
      document.body.removeChild(confirmModal);
    });

  document
    .getElementById("confirmDeleteBtn")
    .addEventListener("click", function () {
      // Executar callback e fechar modal
      if (confirmCallback && typeof confirmCallback === "function") {
        confirmCallback();
      }
      document.body.removeChild(confirmModal);
    });
}
