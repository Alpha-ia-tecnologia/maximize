// PDF Fix for provas.html
// This file contains a replacement function to fix the aspect ratio in PDF exports

// The function below should replace the current generatePdf function in provas.html
// Copy and paste this function into the provas.html file, replacing the existing generatePdf function

/*
async function generatePdf(libraries) {
    try {
        console.log('Iniciando exportação da prova para PDF:', exam.name);
        
        // Obter referências às bibliotecas
        const { jspdf, html2canvas } = libraries;
        const { jsPDF } = jspdf;
        
        // Criar conteúdo HTML
        const contentElement = createExamContent();
        
        // Aplicar estilos específicos para melhorar a renderização e remover espaços indesejados
        contentElement.style.width = '210mm';
        contentElement.style.padding = '10mm 20mm'; // Reduzir padding superior para 10mm
        contentElement.style.margin = '0';
        contentElement.style.boxSizing = 'border-box';
        
        // Verificar e ajustar qualquer elemento que possa ter margin/padding superior
        const allElements = contentElement.querySelectorAll('*');
        allElements.forEach(el => {
            // Reduzir espaçamento superior de todos elementos
            const computedStyle = window.getComputedStyle(el);
            if (parseFloat(computedStyle.marginTop) > 20) {
                el.style.marginTop = '10px';
            }
            if (parseFloat(computedStyle.paddingTop) > 20) {
                el.style.paddingTop = '10px';
            }
        });
        
        document.body.appendChild(contentElement);
        
        // Criar documento PDF (A4: 210mm x 297mm)
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Obter dimensões da página
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        // Configurações para o html2canvas para melhor qualidade
        const canvas = await html2canvas(contentElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            width: contentElement.offsetWidth,
            windowWidth: contentElement.offsetWidth,
            windowHeight: contentElement.scrollHeight
        });
        
        // Cálculos para preservar a proporção correta
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        
        // Calcular a proporção do conteúdo
        const contentAspectRatio = canvasHeight / canvasWidth;
        
        // Calcular dimensões para o PDF
        const pdfContentWidth = pageWidth;
        const pdfContentHeight = pdfContentWidth * contentAspectRatio;
        
        // Calcular quantas páginas serão necessárias
        const totalPages = Math.ceil(pdfContentHeight / pageHeight);
        
        // Gerar páginas
        for (let i = 0; i < totalPages; i++) {
            // Adicionar página após a primeira
            if (i > 0) {
                pdf.addPage();
            }
            
            // Coordenadas para recortar a parte correta da imagem
            const sourceY = (i * pageHeight / pdfContentHeight) * canvasHeight;
            const sourceHeight = Math.min(canvasHeight - sourceY, (pageHeight / pdfContentHeight) * canvasHeight);
            
            // Adicionar a imagem ao PDF com posicionamento calculado
            pdf.addImage(
                canvas.toDataURL('image/jpeg', 1.0),
                'JPEG',
                0,
                0,
                pageWidth,
                pageHeight,
                null,
                'FAST',
                0,
                sourceY
            );
        }
        
        // Remover o elemento HTML
        document.body.removeChild(contentElement);
        
        // Salvar o arquivo PDF
        pdf.save(`${exam.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
        
        alert(`Prova "${exam.name}" exportada para PDF com sucesso!`);
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        alert(`Erro ao exportar para PDF: ${error.message}`);
    } finally {
        removeProcessingMessage();
    }
}
*/

// Instruções:
// 1. Abra provas.html em um editor de texto
// 2. Procure a função "generatePdf"
// 3. Substitua toda a função pelo código acima (sem os comentários)
// 4. Salve o arquivo e teste novamente a exportação de PDF

// Explicação das correções:
// - Fixação da largura exata como 210mm para combinar com o tamanho A4
// - Melhor cálculo da proporção para evitar distorção vertical
// - Adicionado box-sizing: border-box para garantir que padding não afete dimensões
// - Melhores configurações para html2canvas para renderização mais precisa
// - Ajuste no algoritmo de corte de página para manter proporções originais 

/*
async function exportExamToDocx(exam) {
    // Verificar se o objeto exam é válido
    if (!exam || !exam.name) {
        alert('Prova inválida para exportação!');
        return;
    }

    // Mostrar indicador de processamento
    const processingMessage = document.createElement('div');
    processingMessage.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    processingMessage.innerHTML = `
        <div class="bg-white p-4 rounded-lg shadow-lg text-center">
            <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
            <p class="text-gray-800">Gerando PDF...</p>
        </div>
    `;
    document.body.appendChild(processingMessage);

    try {
        // Carregar jsPDF
        if (typeof window.jspdf === 'undefined') {
            // Carregar jsPDF dinamicamente
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }
        
        // Criar um novo documento PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Configurações de página
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20; // 20mm de margem
        const contentWidth = pageWidth - (margin * 2);
        
        // Configurações de fonte
        doc.setFont('helvetica', 'normal');
        
        // Variáveis para controle de posição
        let y = margin;
        let pageNum = 1;
        
        // Função para adicionar nova página
        function addPage() {
            doc.addPage();
            pageNum++;
            y = margin;
        }
        
        // Função para verificar se é necessário adicionar nova página
        function checkPageBreak(height) {
            if (y + height > pageHeight - margin) {
                addPage();
                return true;
            }
            return false;
        }
        
        // Cabeçalho
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('AVALIAÇÃO', pageWidth / 2, y, { align: 'center' });
        y += 10;
        
        doc.setFontSize(16);
        doc.text(exam.name.toUpperCase(), pageWidth / 2, y, { align: 'center' });
        y += 15;
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Nome do Aluno: _______________________________________________`, margin, y);
        y += 10;
        
        doc.text(`Data: ___/___/______`, margin, y);
        y += 15;
        
        // Instruções
        doc.setDrawColor(150, 150, 150);
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(margin, y, contentWidth, 30, 2, 2, 'FD');
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        y += 7;
        doc.text('INSTRUÇÕES:', margin + 5, y);
        
        doc.setFont('helvetica', 'normal');
        y += 6;
        doc.text('1. Leia atentamente cada questão antes de respondê-la', margin + 5, y);
        y += 5;
        doc.text('2. Use caneta azul ou preta para marcar suas respostas', margin + 5, y);
        y += 5;
        doc.text('3. Não é permitido o uso de corretivo', margin + 5, y);
        y += 5;
        doc.text('4. Questões rasuradas serão anuladas', margin + 5, y);
        
        y += 15;
        
        // Adicionar questões
        if (exam.questions && exam.questions.length > 0) {
            doc.setFontSize(12);
            
            exam.questions.forEach((question, index) => {
                const questionText = question.text || question.enunciado || "";
                if (!questionText) {
                    console.warn(`Questão ${index + 1} não tem texto definido, pulando...`);
                    return;
                }
                
                // Verificar espaço necessário e adicionar nova página se necessário
                checkPageBreak(50); // Altura estimada para título da questão + texto
                
                // Linha separadora
                doc.setDrawColor(200, 200, 200);
                doc.line(margin, y, pageWidth - margin, y);
                y += 5;
                
                // Cabeçalho da questão
                doc.setFillColor(100, 100, 100);
                doc.setTextColor(255, 255, 255);
                doc.setFont('helvetica', 'bold');
                doc.rect(margin, y, 40, 8, 'F');
                doc.text(`QUESTÃO ${index + 1}`, margin + 5, y + 5.5);
                
                doc.setTextColor(0, 0, 0);
                doc.text('1 ponto', pageWidth - margin - 15, y + 5.5, { align: 'right' });
                y += 12;
                
                // Texto da questão
                doc.setFont('helvetica', 'normal');
                
                // Dividir o texto em linhas para caber na largura disponível
                const lines = doc.splitTextToSize(questionText, contentWidth);
                
                // Verificar se é necessário adicionar nova página
                if (checkPageBreak(lines.length * 5 + 10)) {
                    // Se adicionou nova página, precisa recriar cabeçalho da questão
                    doc.setFillColor(100, 100, 100);
                    doc.setTextColor(255, 255, 255);
                    doc.setFont('helvetica', 'bold');
                    doc.rect(margin, y, 40, 8, 'F');
                    doc.text(`QUESTÃO ${index + 1}`, margin + 5, y + 5.5);
                    
                    doc.setTextColor(0, 0, 0);
                    doc.text('1 ponto', pageWidth - margin - 15, y + 5.5, { align: 'right' });
                    y += 12;
                    doc.setFont('helvetica', 'normal');
                }
                
                // Adicionar o texto da questão
                doc.text(lines, margin, y);
                y += lines.length * 5 + 10;
                
                // Adicionar alternativas
                const alternativasLetras = ['A', 'B', 'C', 'D', 'E'];
                let alternativas = [];
                
                if (question.options && typeof question.options === 'object') {
                    // Formato {A: "texto", B: "texto"}
                    alternativasLetras.forEach(letra => {
                        let texto = '';
                        if (question.options[letra] && question.options[letra].trim() !== '') {
                            texto = question.options[letra];
                        } else {
                            texto = letra === question.correctAnswer 
                                ? `Alternativa correta ${letra}`
                                : `Alternativa ${letra}`;
                        }
                        alternativas.push({ letra, texto });
                    });
                } else if (question.alternativas && Array.isArray(question.alternativas)) {
                    question.alternativas.forEach((alt, index) => {
                        if (index < alternativasLetras.length) {
                            const letra = alternativasLetras[index];
                            let texto = alt.texto || alt.text || '';
                            if (!texto || texto.trim() === '') {
                                texto = letra === question.correctAnswer 
                                    ? `Alternativa correta ${letra}`
                                    : `Alternativa ${letra}`;
                            }
                            alternativas.push({ letra, texto });
                        }
                    });
                }
                
                // Se não encontrou alternativas, criar padrão
                if (alternativas.length === 0) {
                    alternativasLetras.forEach(letra => {
                        const texto = letra === question.correctAnswer 
                            ? `Alternativa correta ${letra}`
                            : `Alternativa ${letra}`;
                        alternativas.push({ letra, texto });
                    });
                }
                
                // Ordenar alternativas por letra
                alternativas.sort((a, b) => a.letra.localeCompare(b.letra));
                
                // Adicionar cada alternativa
                alternativas.forEach(({ letra, texto }) => {
                    // Verificar se adiciona nova página antes da alternativa
                    const textLines = doc.splitTextToSize(texto, contentWidth - 10);
                    const altHeight = textLines.length * 5 + 3;
                    
                    if (checkPageBreak(altHeight)) {
                        // Nova página, adicionar mais espaço
                        y += 5;
                    }
                    
                    // Desenhar círculo com letra
                    doc.setDrawColor(100, 100, 100);
                    doc.setFillColor(255, 255, 255);
                    doc.circle(margin + 5, y - 1, 4, 'FD'); // Desenha círculo
                    
                    // Adicionar letra dentro do círculo
                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'bold');
                    doc.text(letra, margin + 5, y, { align: 'center' });
                    
                    // Adicionar texto da alternativa
                    doc.setFontSize(12);
                    doc.setFont('helvetica', 'normal');
                    doc.text(textLines, margin + 12, y);
                    
                    y += altHeight + 3; // Espaço entre alternativas
                });
                
                y += 10; // Espaço entre questões
            });
        } else {
            doc.setFontSize(12);
            doc.setFont('helvetica', 'italic');
            doc.text('Esta avaliação não contém questões.', pageWidth / 2, y + 20, { align: 'center' });
        }
        
        // Salvar o PDF
        doc.save(`${exam.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
        
        alert(`Prova "${exam.name}" exportada para PDF com sucesso!`);
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        alert(`Erro ao exportar para PDF: ${error.message}`);
    } finally {
        // Remover mensagem de processamento
        if (processingMessage && processingMessage.parentNode) {
            processingMessage.parentNode.removeChild(processingMessage);
        }
    }
}
*/ 