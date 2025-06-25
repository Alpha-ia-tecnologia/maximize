// Função para exportar todos os dados do dashboard para Excel
async function exportAllDataToExcel() {
  try {
    // Mostrar indicador de carregamento
    const btnExportExcel = document.getElementById("btnExportExcel");
    const originalText = btnExportExcel.innerHTML;
    btnExportExcel.innerHTML =
      '<i class="fas fa-spinner fa-spin mr-2"></i>Exportando...';
    btnExportExcel.disabled = true;

    // Obter filtros atuais
    const filters = {
      ano_letivo: document.getElementById("filterYear")?.value || "all",
      regiao_id: document.getElementById("filterRegion")?.value || "all",
      grupo_id: document.getElementById("filterGroup")?.value || "all",
      escola_id: document.getElementById("filterSchool")?.value || "all",
      serie: document.getElementById("filterGrade")?.value || "all",
      turma_id: document.getElementById("filterClass")?.value || "all",
    };

    // Criar workbook
    const wb = XLSX.utils.book_new();

    // Buscar e adicionar dados das estatísticas
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "all") params.append(key, value);
      });

      const statsResponse = await fetch(
        `https://sag-sag.rak8a3.easypanel.host/api/dashboard/statistics?${params.toString()}`
      );

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        const wsData = [
          ["Estatísticas Gerais do Dashboard"],
          [""],
          ["Métrica", "Valor"],
          ["Total de Escolas", statsData.total_escolas || 0],
          ["Total de Turmas", statsData.total_turmas || 0],
          ["Total de Alunos", statsData.total_alunos || 0],
          ["Total de Provas", statsData.total_provas || 0],
          ["Taxa de Participação", statsData.participacao || "0%"],
        ];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, "Estatísticas Gerais");
      }
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }

    // Buscar e adicionar dados das escolas
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "all") params.append(key, value);
      });
      params.append("page", "1");
      params.append("limit", "2000");

      const schoolResponse = await fetch(
        `https://sag-sag.rak8a3.easypanel.host/api/dashboard/school-performance?${params.toString()}`
      );

      if (schoolResponse.ok) {
        const schoolData = await schoolResponse.json();
        const schools =
          schoolData.content ||
          schoolData.items ||
          schoolData.data ||
          schoolData;

        if (Array.isArray(schools) && schools.length > 0) {
          const headers = [
            "Escola ID",
            "Nome da Escola",
            "Região",
            "Grupo",
            "Desempenho (%)",
            "Total de Alunos",
            "Classificação",
          ];
          const wsData = [headers];

          schools.forEach((school) => {
            wsData.push([
              school.escola_id || "",
              school.escola_nome || "",
              school.regiao_nome || "",
              school.grupo_nome || "",
              school.percentual_acertos || school.desempenho || 0,
              school.total_alunos || 0,
              school.classificacao || "",
            ]);
          });

          const ws = XLSX.utils.aoa_to_sheet(wsData);
          XLSX.utils.book_append_sheet(wb, ws, "Desempenho Escolas");
        }
      }
    } catch (error) {
      console.error("Erro ao buscar dados das escolas:", error);
    }

    // Buscar e adicionar dados das avaliações
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "all") params.append(key, value);
      });
      params.append("page", "1");
      params.append("limit", "2000");

      const examResponse = await fetch(
        `https://sag-sag.rak8a3.easypanel.host/api/dashboard/provas-desempenho?${params.toString()}`
      );

      if (examResponse.ok) {
        const examData = await examResponse.json();

        if (Array.isArray(examData) && examData.length > 0) {
          const headers = [
            "Prova ID",
            "Nome da Prova",
            "Percentual de Acertos (%)",
            "Total de Respostas",
            "Total de Acertos",
          ];
          const wsData = [headers];

          examData.forEach((exam) => {
            wsData.push([
              exam.prova_id || "",
              exam.prova_nome || "",
              exam.percentual_acertos || 0,
              exam.total_respostas || 0,
              exam.total_acertos || 0,
            ]);
          });

          const ws = XLSX.utils.aoa_to_sheet(wsData);
          XLSX.utils.book_append_sheet(wb, ws, "Desempenho Avaliações");
        }
      }
    } catch (error) {
      console.error("Erro ao buscar dados das avaliações:", error);
    }

    // Buscar e adicionar dados dos componentes curriculares
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "all") params.append(key, value);
      });
      params.append("page", "1");
      params.append("limit", "2000");

      const curriculumResponse = await fetch(
        `https://sag-sag.rak8a3.easypanel.host/api/dashboard/componentes-curriculares?${params.toString()}`
      );

      if (curriculumResponse.ok) {
        const curriculumData = await curriculumResponse.json();

        if (Array.isArray(curriculumData) && curriculumData.length > 0) {
          const headers = [
            "Componente ID",
            "Nome do Componente",
            "Percentual de Acertos (%)",
            "Total de Questões",
          ];
          const wsData = [headers];

          curriculumData.forEach((component) => {
            wsData.push([
              component.componente_id || "",
              component.componente_nome || "",
              component.percentual_acertos || 0,
              component.total_questoes || 0,
            ]);
          });

          const ws = XLSX.utils.aoa_to_sheet(wsData);
          XLSX.utils.book_append_sheet(wb, ws, "Componentes Curriculares");
        }
      }
    } catch (error) {
      console.error("Erro ao buscar componentes curriculares:", error);
    }

    // Buscar e adicionar ranking regional
    try {
      const regionalResponse = await fetch(
        "https://sag-sag.rak8a3.easypanel.host/api/dashboard/regional-performance"
      );

      if (regionalResponse.ok) {
        const regionalData = await regionalResponse.json();

        if (
          regionalData.dados_grafico &&
          regionalData.dados_grafico.length > 0
        ) {
          const headers = [
            "Região",
            "Desempenho (%)",
            "Total de Escolas",
            "Escolas com Provas",
            "Classificação",
          ];
          const wsData = [headers];

          regionalData.dados_grafico.forEach((region) => {
            wsData.push([
              region.regiao_nome || "",
              region.media_desempenho || 0,
              region.total_escolas || 0,
              region.escolas_com_provas || 0,
              region.classificacao || "",
            ]);
          });

          const ws = XLSX.utils.aoa_to_sheet(wsData);
          XLSX.utils.book_append_sheet(wb, ws, "Ranking Regional");
        }
      }
    } catch (error) {
      console.error("Erro ao buscar ranking regional:", error);
    }

    // Buscar e adicionar dados das habilidades BNCC
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "all") params.append(key, value);
      });
      params.append("page", "1");
      params.append("limit", "2000");

      const bnccResponse = await fetch(
        `https://sag-sag.rak8a3.easypanel.host/api/dashboard/bncc-skills?${params.toString()}`
      );

      if (bnccResponse.ok) {
        const bnccData = await bnccResponse.json();
        const skills =
          bnccData.content || bnccData.items || bnccData.data || bnccData;

        if (Array.isArray(skills) && skills.length > 0) {
          const headers = [
            "Código BNCC",
            "Descrição",
            "Percentual de Acertos (%)",
            "Total de Questões",
            "Componente Curricular",
            "Série",
          ];
          const wsData = [headers];

          skills.forEach((skill) => {
            wsData.push([
              skill.bncc_codigo || "",
              skill.bncc_descricao || "",
              skill.percentual_acertos || 0,
              skill.total_questoes || 0,
              skill.componente_curricular_nome || "",
              skill.bncc_serie || "",
            ]);
          });

          const ws = XLSX.utils.aoa_to_sheet(wsData);
          XLSX.utils.book_append_sheet(wb, ws, "Habilidades BNCC");
        }
      }
    } catch (error) {
      console.error("Erro ao buscar habilidades BNCC:", error);
    }

    // Buscar e adicionar ranking de alunos
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "all") params.append(key, value);
      });
      params.append("page", "1");
      params.append("limit", "2000");

      const rankingResponse = await fetch(
        `https://sag-sag.rak8a3.easypanel.host/api/dashboard/alunos-ranking?${params.toString()}`
      );

      if (rankingResponse.ok) {
        const rankingData = await rankingResponse.json();
        const students =
          rankingData.content ||
          rankingData.items ||
          rankingData.data ||
          rankingData;

        if (Array.isArray(students) && students.length > 0) {
          const headers = [
            "Posição",
            "Nome do Aluno",
            "Escola",
            "Turma",
            "Nota",
            "Percentual (%)",
          ];
          const wsData = [headers];

          students.forEach((student, index) => {
            wsData.push([
              index + 1,
              student.aluno_nome || "",
              student.escola_nome || "",
              student.turma_nome || "",
              student.nota || 0,
              student.percentual || 0,
            ]);
          });

          const ws = XLSX.utils.aoa_to_sheet(wsData);
          XLSX.utils.book_append_sheet(wb, ws, "Ranking Alunos");
        }
      }
    } catch (error) {
      console.error("Erro ao buscar ranking de alunos:", error);
    }

    // Gerar e baixar o arquivo
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace(/[:-]/g, "");
    const filename = `Dashboard_SAG_${timestamp}.xlsx`;

    XLSX.writeFile(wb, filename);

    // Restaurar botão
    btnExportExcel.innerHTML = originalText;
    btnExportExcel.disabled = false;

    alert("Dados exportados com sucesso para Excel!");
  } catch (error) {
    console.error("Erro ao exportar dados para Excel:", error);

    // Restaurar botão
    const btnExportExcel = document.getElementById("btnExportExcel");
    btnExportExcel.innerHTML =
      '<i class="fas fa-file-excel mr-2"></i>Exportar Excel';
    btnExportExcel.disabled = false;

    alert("Erro ao exportar dados: " + error.message);
  }
}
