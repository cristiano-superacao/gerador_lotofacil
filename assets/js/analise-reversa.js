// Sistema de Análise Reversa - LotoFácil Estratégica
// Compara resultados oficiais com estratégias para identificar padrões

class AnaliseReversa {
    constructor() {
        this.resultadosOficiais = [];
        this.analises = [];
        this.db = null;
        this.estrategias = [
            'Poder das Repetidas',
            'Equilíbrio Par/Ímpar', 
            'Números Atrasados',
            'Sequências Inteligentes',
            'Divisão por Colunas',
            'Frequência Histórica',
            'Matemática dos Finais',
            'Frequência Mensal'
        ];
        
        this.init();
    }

    async init() {
        // Aguardar Firebase estar disponível
        await this.aguardarFirebase();
        
        // Carregar dados salvos
        await this.carregarDados();
        
        // Atualizar interface
        this.atualizarDashboard();
        this.atualizarTabela();
        this.gerarInsights();
        
        console.log('Sistema de Análise Reversa inicializado');
    }

    async aguardarFirebase() {
        return new Promise((resolve) => {
            const checkFirebase = () => {
                if (window.firebaseDB) {
                    this.db = window.firebaseDB;
                    resolve();
                } else {
                    setTimeout(checkFirebase, 100);
                }
            };
            checkFirebase();
        });
    }

    async carregarDados() {
        try {
            // Tentar carregar do Firebase primeiro
            if (this.db) {
                const snapshot = await this.db.collection('analise_reversa').get();
                this.analises = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                console.log(`Carregados ${this.analises.length} análises do Firebase`);
            } else {
                // Fallback para localStorage
                const dadosLocal = localStorage.getItem('lotofacil_analise_reversa');
                this.analises = dadosLocal ? JSON.parse(dadosLocal) : [];
                console.log(`Carregados ${this.analises.length} análises do localStorage`);
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            // Fallback para localStorage em caso de erro
            const dadosLocal = localStorage.getItem('lotofacil_analise_reversa');
            this.analises = dadosLocal ? JSON.parse(dadosLocal) : [];
        }
    }

    async salvarDados() {
        try {
            // Salvar no Firebase
            if (this.db) {
                // Limpar coleção existente e salvar novos dados
                const batch = this.db.batch();
                
                this.analises.forEach(analise => {
                    if (analise.id) {
                        // Atualizar existente
                        const docRef = this.db.collection('analise_reversa').doc(analise.id);
                        batch.set(docRef, analise);
                    } else {
                        // Criar novo
                        const docRef = this.db.collection('analise_reversa').doc();
                        analise.id = docRef.id;
                        batch.set(docRef, analise);
                    }
                });
                
                await batch.commit();
                console.log('Dados salvos no Firebase');
            }
            
            // Salvar também no localStorage como backup
            localStorage.setItem('lotofacil_analise_reversa', JSON.stringify(this.analises));
            
        } catch (error) {
            console.error('Erro ao salvar no Firebase:', error);
            // Salvar apenas no localStorage em caso de erro
            localStorage.setItem('lotofacil_analise_reversa', JSON.stringify(this.analises));
        }
    }

    async adicionarResultado(concurso, data, dezenas) {
        try {
            // Validar entrada
            if (!concurso || !data || !dezenas || dezenas.length !== 15) {
                throw new Error('Dados inválidos');
            }

            // Verificar se já existe
            const existe = this.analises.find(a => a.concurso === parseInt(concurso));
            if (existe) {
                throw new Error('Concurso já foi analisado');
            }

            // Analisar com todas as estratégias
            const analiseCompleta = await this.analisarComTodasEstrategias(dezenas);
            
            // Criar registro de análise
            const novaAnalise = {
                concurso: parseInt(concurso),
                data: data,
                dezenas: dezenas,
                resultados: analiseCompleta,
                melhorEstrategia: this.encontrarMelhorEstrategia(analiseCompleta),
                dataAnalise: new Date().toISOString(),
                timestamp: Date.now()
            };

            // Adicionar à lista
            this.analises.push(novaAnalise);
            
            // Salvar dados
            await this.salvarDados();
            
            // Atualizar interface
            this.atualizarDashboard();
            this.atualizarTabela();
            this.gerarInsights();
            
            this.mostrarAlerta('Resultado analisado com sucesso!', 'success');
            
            return novaAnalise;
            
        } catch (error) {
            console.error('Erro ao adicionar resultado:', error);
            this.mostrarAlerta(error.message, 'error');
        }
    }

    async analisarComTodasEstrategias(dezenasOficiais) {
        const resultados = {};
        
        for (const estrategia of this.estrategias) {
            // Gerar jogos da estratégia (simulação)
            const jogosEstrategia = this.gerarJogosEstrategia(estrategia, 10);
            
            // Calcular acertos para cada jogo
            const acertos = jogosEstrategia.map(jogo => 
                this.calcularAcertos(jogo, dezenasOficiais)
            );
            
            // Estatísticas da estratégia
            resultados[estrategia] = {
                jogos: jogosEstrategia,
                acertos: acertos,
                melhorJogo: Math.max(...acertos),
                mediaAcertos: acertos.reduce((a, b) => a + b, 0) / acertos.length,
                totalAcertos: acertos.reduce((a, b) => a + b, 0)
            };
        }
        
        return resultados;
    }

    gerarJogosEstrategia(estrategia, quantidade) {
        // Simulação simplificada de geração de jogos
        // Na implementação real, usaria a mesma lógica do app.js
        const jogos = [];
        
        for (let i = 0; i < quantidade; i++) {
            const jogo = this.gerarJogoEstrategia(estrategia);
            jogos.push(jogo);
        }
        
        return jogos;
    }

    gerarJogoEstrategia(estrategia) {
        // Simulação básica - implementar lógicas específicas
        const numeros = [];
        
        switch (estrategia) {
            case 'Poder das Repetidas':
                // Usar números frequentes
                const frequentes = [2, 4, 5, 10, 11, 13, 14, 15, 20, 23];
                numeros.push(...frequentes.slice(0, 8));
                break;
                
            case 'Equilíbrio Par/Ímpar':
                // 7 pares e 8 ímpares (ou vice-versa)
                const pares = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
                const impares = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25];
                
                this.embaralhar(pares);
                this.embaralhar(impares);
                
                numeros.push(...pares.slice(0, 7));
                numeros.push(...impares.slice(0, 8));
                break;
                
            default:
                // Estratégia padrão
                while (numeros.length < 15) {
                    const num = Math.floor(Math.random() * 25) + 1;
                    if (!numeros.includes(num)) {
                        numeros.push(num);
                    }
                }
        }
        
        // Completar se necessário
        while (numeros.length < 15) {
            const num = Math.floor(Math.random() * 25) + 1;
            if (!numeros.includes(num)) {
                numeros.push(num);
            }
        }
        
        return numeros.sort((a, b) => a - b);
    }

    calcularAcertos(jogo, resultado) {
        return jogo.filter(num => resultado.includes(num)).length;
    }

    encontrarMelhorEstrategia(resultados) {
        let melhor = '';
        let maiorMedia = 0;
        
        for (const [estrategia, dados] of Object.entries(resultados)) {
            if (dados.mediaAcertos > maiorMedia) {
                maiorMedia = dados.mediaAcertos;
                melhor = estrategia;
            }
        }
        
        return { nome: melhor, media: maiorMedia };
    }

    atualizarDashboard() {
        // Total de resultados
        document.getElementById('totalResultados').textContent = this.analises.length;
        
        if (this.analises.length === 0) {
            document.getElementById('melhorEstrategia').textContent = '-';
            document.getElementById('mediaAcertos').textContent = '0';
            document.getElementById('numeroMaisFrequente').textContent = '-';
            return;
        }
        
        // Melhor estratégia geral
        const estatisticasEstrategias = this.calcularEstatisticasEstrategias();
        const melhorGeral = Object.entries(estatisticasEstrategias)
            .sort((a, b) => b[1].mediaGeral - a[1].mediaGeral)[0];
        
        document.getElementById('melhorEstrategia').textContent = 
            melhorGeral ? melhorGeral[0].substring(0, 10) + '...' : '-';
        
        // Média geral de acertos
        const mediaGeral = this.calcularMediaGeralAcertos();
        document.getElementById('mediaAcertos').textContent = mediaGeral.toFixed(1);
        
        // Número mais frequente
        const numeroMaisFrequente = this.encontrarNumeroMaisFrequente();
        document.getElementById('numeroMaisFrequente').textContent = numeroMaisFrequente;
        
        // Atualizar gráficos
        this.atualizarGraficos();
    }

    calcularEstatisticasEstrategias() {
        const stats = {};
        
        this.estrategias.forEach(estrategia => {
            stats[estrategia] = {
                totalAnalises: 0,
                somaMedias: 0,
                mediaGeral: 0,
                vitórias: 0
            };
        });
        
        this.analises.forEach(analise => {
            Object.entries(analise.resultados).forEach(([estrategia, dados]) => {
                stats[estrategia].totalAnalises++;
                stats[estrategia].somaMedias += dados.mediaAcertos;
                
                if (analise.melhorEstrategia.nome === estrategia) {
                    stats[estrategia].vitórias++;
                }
            });
        });
        
        // Calcular médias
        Object.keys(stats).forEach(estrategia => {
            if (stats[estrategia].totalAnalises > 0) {
                stats[estrategia].mediaGeral = 
                    stats[estrategia].somaMedias / stats[estrategia].totalAnalises;
            }
        });
        
        return stats;
    }

    calcularMediaGeralAcertos() {
        if (this.analises.length === 0) return 0;
        
        let somaTotal = 0;
        let contadorTotal = 0;
        
        this.analises.forEach(analise => {
            Object.values(analise.resultados).forEach(resultado => {
                somaTotal += resultado.mediaAcertos;
                contadorTotal++;
            });
        });
        
        return contadorTotal > 0 ? somaTotal / contadorTotal : 0;
    }

    encontrarNumeroMaisFrequente() {
        if (this.analises.length === 0) return '-';
        
        const frequencia = {};
        for (let i = 1; i <= 25; i++) {
            frequencia[i] = 0;
        }
        
        this.analises.forEach(analise => {
            analise.dezenas.forEach(numero => {
                frequencia[numero]++;
            });
        });
        
        const maisFrequente = Object.entries(frequencia)
            .sort((a, b) => b[1] - a[1])[0];
        
        return maisFrequente ? maisFrequente[0] : '-';
    }

    atualizarGraficos() {
        this.criarGraficoEstrategias();
        this.criarGraficoFrequencia();
    }

    criarGraficoEstrategias() {
        const ctx = document.getElementById('graficoEstrategias');
        if (!ctx) return;
        
        const stats = this.calcularEstatisticasEstrategias();
        
        const dados = {
            labels: Object.keys(stats).map(nome => nome.substring(0, 15)),
            datasets: [{
                label: 'Média de Acertos',
                data: Object.values(stats).map(s => s.mediaGeral),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                    '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                ],
                borderWidth: 1
            }]
        };
        
        new Chart(ctx, {
            type: 'bar',
            data: dados,
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 15
                    }
                }
            }
        });
    }

    criarGraficoFrequencia() {
        const ctx = document.getElementById('graficoFrequencia');
        if (!ctx) return;
        
        if (this.analises.length === 0) return;
        
        const frequencia = {};
        for (let i = 1; i <= 25; i++) {
            frequencia[i] = 0;
        }
        
        this.analises.forEach(analise => {
            analise.dezenas.forEach(numero => {
                frequencia[numero]++;
            });
        });
        
        const dados = {
            labels: Object.keys(frequencia),
            datasets: [{
                label: 'Frequência',
                data: Object.values(frequencia),
                backgroundColor: '#00A651',
                borderColor: '#008F47',
                borderWidth: 1
            }]
        };
        
        new Chart(ctx, {
            type: 'bar',
            data: dados,
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    atualizarTabela() {
        const tbody = document.getElementById('tabelaCorpo');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        // Ordenar por concurso (mais recente primeiro)
        const analisesOrdenadas = [...this.analises].sort((a, b) => b.concurso - a.concurso);
        
        analisesOrdenadas.forEach(analise => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            
            row.innerHTML = `
                <td class="px-4 py-3 text-sm font-medium text-gray-900">${analise.concurso}</td>
                <td class="px-4 py-3 text-sm text-gray-600">${new Date(analise.data).toLocaleDateString('pt-BR')}</td>
                <td class="px-4 py-3 text-sm text-gray-600">${analise.melhorEstrategia.nome}</td>
                <td class="px-4 py-3">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        analise.melhorEstrategia.media >= 10 ? 'bg-green-100 text-green-800' :
                        analise.melhorEstrategia.media >= 8 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }">
                        ${analise.melhorEstrategia.media.toFixed(1)} acertos
                    </span>
                </td>
                <td class="px-4 py-3">
                    <button onclick="analiseReversa.verDetalhes(${analise.concurso})" 
                            class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Ver detalhes
                    </button>
                </td>
                <td class="px-4 py-3">
                    <button onclick="analiseReversa.excluirAnalise(${analise.concurso})" 
                            class="text-red-600 hover:text-red-800 text-sm font-medium">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    gerarInsights() {
        const container = document.getElementById('listaInsights');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (this.analises.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-info-circle text-4xl mb-4"></i>
                    <p>Adicione alguns resultados para gerar insights automáticos.</p>
                </div>
            `;
            return;
        }
        
        const insights = this.calcularInsights();
        
        insights.forEach(insight => {
            const div = document.createElement('div');
            div.className = `p-4 rounded-lg border-l-4 ${insight.tipo === 'success' ? 'border-green-500 bg-green-50' : 
                            insight.tipo === 'warning' ? 'border-yellow-500 bg-yellow-50' : 
                            'border-blue-500 bg-blue-50'}`;
            
            div.innerHTML = `
                <div class="flex items-start">
                    <i class="fas ${insight.icone} text-lg mr-3 mt-1 ${
                        insight.tipo === 'success' ? 'text-green-600' :
                        insight.tipo === 'warning' ? 'text-yellow-600' :
                        'text-blue-600'
                    }"></i>
                    <div>
                        <h4 class="font-semibold text-gray-800">${insight.titulo}</h4>
                        <p class="text-gray-600 mt-1">${insight.descricao}</p>
                    </div>
                </div>
            `;
            
            container.appendChild(div);
        });
    }

    calcularInsights() {
        const insights = [];
        const stats = this.calcularEstatisticasEstrategias();
        
        // Melhor estratégia
        const melhorEstrategia = Object.entries(stats)
            .sort((a, b) => b[1].mediaGeral - a[1].mediaGeral)[0];
        
        if (melhorEstrategia) {
            insights.push({
                tipo: 'success',
                icone: 'fa-trophy',
                titulo: 'Estratégia Mais Eficaz',
                descricao: `A estratégia "${melhorEstrategia[0]}" tem apresentado a melhor performance com média de ${melhorEstrategia[1].mediaGeral.toFixed(1)} acertos por jogo.`
            });
        }
        
        // Análise de frequência
        const numeroMaisFrequente = this.encontrarNumeroMaisFrequente();
        if (numeroMaisFrequente !== '-') {
            insights.push({
                tipo: 'info',
                icone: 'fa-chart-line',
                titulo: 'Número Mais Frequente',
                descricao: `O número ${numeroMaisFrequente} tem aparecido com maior frequência nos resultados analisados.`
            });
        }
        
        // Recomendação baseada em dados
        if (this.analises.length >= 5) {
            const mediaGeral = this.calcularMediaGeralAcertos();
            if (mediaGeral < 8) {
                insights.push({
                    tipo: 'warning',
                    icone: 'fa-exclamation-triangle',
                    titulo: 'Performance Abaixo do Esperado',
                    descricao: 'A média geral de acertos está abaixo de 8. Considere revisar as estratégias ou aguardar mais dados para análise.'
                });
            }
        }
        
        return insights;
    }

    async excluirAnalise(concurso) {
        if (!confirm('Tem certeza que deseja excluir esta análise?')) {
            return;
        }
        
        try {
            // Remover da lista local
            this.analises = this.analises.filter(a => a.concurso !== concurso);
            
            // Se tem Firebase, deletar também lá
            if (this.db) {
                const snapshot = await this.db.collection('analise_reversa')
                    .where('concurso', '==', concurso).get();
                
                const batch = this.db.batch();
                snapshot.docs.forEach(doc => {
                    batch.delete(doc.ref);
                });
                await batch.commit();
            }
            
            // Salvar mudanças
            await this.salvarDados();
            
            // Atualizar interface
            this.atualizarDashboard();
            this.atualizarTabela();
            this.gerarInsights();
            
            this.mostrarAlerta('Análise excluída com sucesso!', 'success');
            
        } catch (error) {
            console.error('Erro ao excluir análise:', error);
            this.mostrarAlerta('Erro ao excluir análise', 'error');
        }
    }

    async exportarAnalises() {
        try {
            let conteudo = 'Concurso,Data,Melhor Estratégia,Média Acertos,Dezenas Sorteadas\n';
            
            this.analises.forEach(analise => {
                conteudo += `${analise.concurso},${analise.data},"${analise.melhorEstrategia.nome}",${analise.melhorEstrategia.media.toFixed(1)},"${analise.dezenas.join('-')}"\n`;
            });
            
            const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `analise-reversa-${Date.now()}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.mostrarAlerta('Dados exportados com sucesso!', 'success');
            
        } catch (error) {
            console.error('Erro ao exportar:', error);
            this.mostrarAlerta('Erro ao exportar dados', 'error');
        }
    }

    async limparAnalises() {
        if (!confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
            return;
        }
        
        try {
            // Limpar dados no Firebase
            if (this.db) {
                const snapshot = await this.db.collection('analise_reversa').get();
                const batch = this.db.batch();
                snapshot.docs.forEach(doc => {
                    batch.delete(doc.ref);
                });
                await batch.commit();
            }
            
            // Limpar dados locais
            this.analises = [];
            localStorage.removeItem('lotofacil_analise_reversa');
            
            // Atualizar interface
            this.atualizarDashboard();
            this.atualizarTabela();
            this.gerarInsights();
            
            this.mostrarAlerta('Todos os dados foram limpos!', 'success');
            
        } catch (error) {
            console.error('Erro ao limpar dados:', error);
            this.mostrarAlerta('Erro ao limpar dados', 'error');
        }
    }

    embaralhar(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    mostrarAlerta(mensagem, tipo = 'info') {
        const cores = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };
        
        const alerta = document.createElement('div');
        alerta.className = `fixed top-4 right-4 ${cores[tipo]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full opacity-0`;
        alerta.innerHTML = `
            <div class="flex items-center">
                <span class="flex-1">${mensagem}</span>
                <button class="ml-3 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(alerta);
        
        // Animar entrada
        setTimeout(() => {
            alerta.classList.remove('translate-x-full', 'opacity-0');
        }, 100);
        
        // Remover automaticamente após 5 segundos
        setTimeout(() => {
            if (alerta.parentElement) {
                alerta.classList.add('translate-x-full', 'opacity-0');
                setTimeout(() => alerta.remove(), 300);
            }
        }, 5000);
    }
}

// Funções globais para interface
async function adicionarResultado() {
    const concurso = document.getElementById('novoConcurso').value;
    const data = document.getElementById('novaData').value;
    const dezenasTexto = document.getElementById('novasDezenas').value;
    
    if (!concurso || !data || !dezenasTexto) {
        analiseReversa.mostrarAlerta('Preencha todos os campos!', 'warning');
        return;
    }
    
    try {
        const dezenas = dezenasTexto.split(',').map(n => parseInt(n.trim()));
        
        if (dezenas.length !== 15 || dezenas.some(n => isNaN(n) || n < 1 || n > 25)) {
            throw new Error('Dezenas inválidas! Informe exatamente 15 números de 1 a 25.');
        }
        
        await analiseReversa.adicionarResultado(concurso, data, dezenas);
        
        // Limpar formulário
        document.getElementById('novoConcurso').value = '';
        document.getElementById('novaData').value = '';
        document.getElementById('novasDezenas').value = '';
        
    } catch (error) {
        analiseReversa.mostrarAlerta(error.message, 'error');
    }
}

async function buscarResultadoOficial() {
    // Implementar busca da API oficial da Caixa
    analiseReversa.mostrarAlerta('Funcionalidade em desenvolvimento', 'info');
}

function exportarAnalises() {
    analiseReversa.exportarAnalises();
}

function limparAnalises() {
    analiseReversa.limparAnalises();
}

// Inicializar sistema quando a página carregar
let analiseReversa;

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            // Implementar menu mobile se necessário
        });
    }
    
    // Definir data atual como padrão
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('novaData').value = hoje;
    
    // Inicializar sistema
    analiseReversa = new AnaliseReversa();
});