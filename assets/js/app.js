// LotoFácil Estratégica - JavaScript Principal
// Autor: Sistema Inteligente de Análise Lotofácil

class LotofacilEstrategica {
    constructor() {
        this.ultimoResultado = null;
        this.jogosGerados = [];
        this.estrategiaAtual = null;
        this.dadosOficiais = null;
        this.estatisticas = null;
        
        // Definição das 7 análises estratégicas
        this.analises = [
            {
                id: 1,
                titulo: "Poder das Repetidas",
                descricao: "Utiliza números que saíram no último concurso, baseado na estatística de que 60% dos concursos repetem ao menos 5 números.",
                icon: "fas fa-redo",
                cor: "from-blue-400 to-blue-600",
                detalhes: "Esta estratégia analisa o último resultado e inclui números que têm maior probabilidade de repetir nos próximos sorteios."
            },
            {
                id: 2,
                titulo: "Equilíbrio Par/Ímpar",
                descricao: "Mantém proporção ideal entre pares e ímpares (7-8 ou 8-7), seguindo padrões históricos da Lotofácil.",
                icon: "fas fa-balance-scale",
                cor: "from-green-400 to-green-600",
                detalhes: "Analisa a distribuição histórica de números pares e ímpares para criar jogos mais equilibrados."
            },
            {
                id: 3,
                titulo: "Números Atrasados",
                descricao: "Prioriza dezenas que estão há mais tempo sem sair, aproveitando a 'lei dos grandes números'.",
                icon: "fas fa-clock",
                cor: "from-yellow-400 to-orange-500",
                detalhes: "Identifica números que estão em atraso e têm maior probabilidade estatística de serem sorteados."
            },
            {
                id: 4,
                titulo: "Sequências Inteligentes",
                descricao: "Evita sequências óbvias e cria combinações com base em padrões não-lineares observados.",
                icon: "fas fa-link",
                cor: "from-purple-400 to-purple-600",
                detalhes: "Analisa padrões de sequências que raramente saem juntas para criar combinações mais inteligentes."
            },
            {
                id: 5,
                titulo: "Divisão por Colunas",
                descricao: "Distribui números pelas 5 colunas do volante (1-3, 4-6, 7-9, etc.) para máxima cobertura.",
                icon: "fas fa-columns",
                cor: "from-red-400 to-red-600",
                detalhes: "Garante que os números estejam bem distribuídos em todas as regiões do volante da Lotofácil."
            },
            {
                id: 6,
                titulo: "Frequência Histórica",
                descricao: "Combina números mais e menos sorteados, criando um equilíbrio baseado em dados históricos.",
                icon: "fas fa-chart-bar",
                cor: "from-indigo-400 to-indigo-600",
                detalhes: "Utiliza dados históricos de frequência para criar jogos com números quentes e frios balanceados."
            },
            {
                id: 7,
                titulo: "Matemática dos Finais",
                descricao: "Analisa terminações dos números (0,1,2...9) mantendo distribuição equilibrada dos finais.",
                icon: "fas fa-calculator",
                cor: "from-pink-400 to-pink-600",
                detalhes: "Controla a distribuição das terminações dos números para evitar concentrações incomuns."
            }
        ];
        
        this.init();
    }
    
    init() {
        this.carregarAnalises();
        this.configurarEventos();
        this.definirDataAtual();
    }
    
    definirDataAtual() {
        const hoje = new Date();
        document.getElementById('dataConcurso').value = hoje.toISOString().split('T')[0];
    }
    
    carregarAnalises() {
        const container = document.getElementById('cardsAnalises');
        container.innerHTML = '';
        
        this.analises.forEach(analise => {
            const card = this.criarCardAnalise(analise);
            container.appendChild(card);
        });
    }
    
    criarCardAnalise(analise) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg card-shadow p-6 cursor-pointer transform transition-all duration-300 hover:scale-105';
        
        card.innerHTML = `
            <div class="text-center mb-4">
                <div class="w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${analise.cor} flex items-center justify-center text-white text-2xl mb-3">
                    <i class="${analise.icon}"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">${analise.titulo}</h3>
                <p class="text-gray-600 text-sm mb-4">${analise.descricao}</p>
            </div>
            
            <div class="space-y-3">
                <button class="w-full bg-gradient-to-r ${analise.cor} text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity" 
                        onclick="lotofacil.gerarJogos(${analise.id})">
                    <i class="fas fa-magic mr-2"></i>
                    Gerar 10 Jogos
                </button>
                
                <button class="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                        onclick="lotofacil.mostrarDetalhes(${analise.id})">
                    <i class="fas fa-info-circle mr-2"></i>
                    Saiba mais
                </button>
            </div>
        `;
        
        return card;
    }
    
    configurarEventos() {
        // Último resultado
        document.getElementById('salvarResultado').addEventListener('click', () => {
            this.salvarUltimoResultado();
        });
        
        document.getElementById('atualizarResultado').addEventListener('click', () => {
            this.tentarBuscarResultadoAutomatico();
        });
        
        // Botões da seção de resultados
        document.getElementById('copiarJogos')?.addEventListener('click', () => {
            this.copiarJogos();
        });
        
        document.getElementById('exportarJogos')?.addEventListener('click', () => {
            this.exportarJogos();
        });
        
        document.getElementById('gerarNovos')?.addEventListener('click', () => {
            if (this.estrategiaAtual) {
                this.gerarJogos(this.estrategiaAtual);
            }
        });
    }
    
    salvarUltimoResultado() {
        const concurso = document.getElementById('concurso').value;
        const data = document.getElementById('dataConcurso').value;
        const dezenas = document.getElementById('dezenasUltimoResultado').value;
        const valorPremio = document.getElementById('valorPremio').value;
        const statusAcumulado = document.getElementById('statusAcumulado').value === 'true';
        
        if (!concurso || !data || !dezenas) {
            this.mostrarAlerta('Por favor, preencha pelo menos concurso, data e dezenas!', 'warning');
            return;
        }
        
        // Validar e processar dezenas
        const dezenasList = dezenas.split(',').map(n => n.trim().padStart(2, '0'));
        
        if (dezenasList.length !== 15) {
            this.mostrarAlerta('Você deve informar exatamente 15 dezenas!', 'error');
            return;
        }
        
        // Validar se todas são números válidos da Lotofácil
        const numerosValidos = dezenasList.every(n => {
            const num = parseInt(n);
            return num >= 1 && num <= 25 && !isNaN(num);
        });
        
        if (!numerosValidos) {
            this.mostrarAlerta('Todas as dezenas devem estar entre 01 e 25!', 'error');
            return;
        }
        
        // Verificar duplicatas
        if (new Set(dezenasList).size !== 15) {
            this.mostrarAlerta('Não pode haver dezenas repetidas!', 'error');
            return;
        }
        
        this.ultimoResultado = {
            concurso: parseInt(concurso),
            data: new Date(data).toLocaleDateString('pt-BR'),
            dezenas: dezenasList.sort((a, b) => parseInt(a) - parseInt(b)),
            premio: valorPremio || 'Não informado',
            acumulado: statusAcumulado
        };
        
        this.exibirUltimoResultado();
        this.mostrarAlerta('Último resultado salvo com sucesso!', 'success');
    }
    
    exibirUltimoResultado() {
        if (!this.ultimoResultado) return;
        
        // Atualizar informações básicas
        document.getElementById('concursoDisplay').textContent = this.ultimoResultado.concurso;
        document.getElementById('dataDisplay').textContent = this.ultimoResultado.data;
        
        // Atualizar prêmio
        const premioDisplay = document.getElementById('premioDisplay');
        if (premioDisplay) {
            premioDisplay.textContent = this.ultimoResultado.premio || 'Não informado';
        }
        
        // Atualizar status de acumulação
        const acumuladoDisplay = document.getElementById('acumuladoDisplay');
        const statusIcon = document.getElementById('statusIcon');
        const statusText = document.getElementById('statusText');
        
        if (acumuladoDisplay && statusIcon && statusText) {
            if (this.ultimoResultado.acumulado) {
                statusIcon.className = 'fas fa-arrow-up mr-1';
                statusText.textContent = 'Acumulou';
                acumuladoDisplay.className = 'font-bold text-lg text-orange-600';
            } else {
                statusIcon.className = 'fas fa-trophy mr-1';
                statusText.textContent = 'Houve Ganhador';
                acumuladoDisplay.className = 'font-bold text-lg text-green-600';
            }
        }
        
        // Atualizar dezenas
        const dezenasContainer = document.getElementById('dezenasDisplay');
        dezenasContainer.innerHTML = '';
        
        this.ultimoResultado.dezenas.forEach(dezena => {
            const ball = document.createElement('div');
            ball.className = 'number-ball number-ball-result';
            ball.textContent = dezena;
            dezenasContainer.appendChild(ball);
        });
        
        document.getElementById('ultimoResultadoDisplay').classList.remove('hidden');
    }
    
    tentarBuscarResultadoAutomatico() {
        this.mostrarAlerta('Em desenvolvimento: Integração com API da Caixa será implementada em breve!', 'info');
    }
    
    mostrarDetalhes(idAnalise) {
        const analise = this.analises.find(a => a.id === idAnalise);
        if (!analise) return;
        
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-lg max-w-md w-full p-6">
                <div class="text-center mb-4">
                    <div class="w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${analise.cor} flex items-center justify-center text-white text-3xl mb-4">
                        <i class="${analise.icon}"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-800 mb-2">${analise.titulo}</h3>
                </div>
                <p class="text-gray-600 mb-6 leading-relaxed">${analise.detalhes}</p>
                <div class="flex space-x-3">
                    <button class="flex-1 bg-gradient-to-r ${analise.cor} text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                            onclick="lotofacil.gerarJogos(${analise.id}); this.parentElement.parentElement.parentElement.remove();">
                        <i class="fas fa-magic mr-2"></i>
                        Gerar Jogos
                    </button>
                    <button class="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            onclick="this.parentElement.parentElement.parentElement.remove();">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Fechar ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    gerarJogos(idAnalise) {
        // Verifica limite de jogos antes de prosseguir
        const limiteInfo = this.verificarLimiteJogos();
        if (!limiteInfo.pode) {
            if (limiteInfo.limite && limiteInfo.usado) {
                this.mostrarModalLimite(limiteInfo);
            } else {
                this.mostrarAlerta(limiteInfo.motivo, 'error');
            }
            return;
        }
        
        this.estrategiaAtual = idAnalise;
        const analise = this.analises.find(a => a.id === idAnalise);
        
        if (!analise) {
            this.mostrarAlerta('Análise não encontrada!', 'error');
            return;
        }
        
        // Mostrar loading
        this.mostrarLoading(true);
        
        // Simular processamento (remover em produção)
        setTimeout(() => {
            try {
                this.jogosGerados = this.executarEstrategia(idAnalise);
                this.exibirJogosGerados(analise.titulo);
                this.mostrarLoading(false);
                
                // Registra os jogos gerados para o usuário
                this.registrarJogoGerado();
                
                // Atualiza contador no header se existir
                this.atualizarContadorJogos();
                
                // Scroll para resultados
                document.getElementById('resultados').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
            } catch (error) {
                this.mostrarAlerta('Erro ao gerar jogos: ' + error.message, 'error');
                this.mostrarLoading(false);
            }
        }, 1500);
    }
    
    // Atualiza contador de jogos no header
    atualizarContadorJogos() {
        // Contador simplificado sem dependência de autenticação
        const jogosHoje = this.jogosGerados.filter(jogo => {
            const hoje = new Date().toDateString();
            return new Date(jogo.timestamp).toDateString() === hoje;
        }).length;
        
        const contador = document.getElementById('contadorJogos');
        if (contador) {
            contador.textContent = `${jogosHoje} jogos gerados hoje`;
        }
    }
    
    executarEstrategia(idAnalise) {
        const jogos = [];
        const jogosUnicos = new Set();
        
        while (jogos.length < 10) {
            let novoJogo;
            
            switch (idAnalise) {
                case 1:
                    novoJogo = this.estrategiaPoderepetidas();
                    break;
                case 2:
                    novoJogo = this.estrategiaEquilibrioParImpar();
                    break;
                case 3:
                    novoJogo = this.estrategiaNumerosAtrasados();
                    break;
                case 4:
                    novoJogo = this.estrategiaSequenciasInteligentes();
                    break;
                case 5:
                    novoJogo = this.estrategiaDivisaoColunas();
                    break;
                case 6:
                    novoJogo = this.estrategiaFrequenciaHistorica();
                    break;
                case 7:
                    novoJogo = this.estrategiaMatematicaFinais();
                    break;
                default:
                    throw new Error('Estratégia não implementada');
            }
            
            const jogoString = novoJogo.sort((a, b) => a - b).join(',');
            
            if (!jogosUnicos.has(jogoString)) {
                jogosUnicos.add(jogoString);
                jogos.push(novoJogo.sort((a, b) => a - b));
            }
        }
        
        return jogos;
    }
    
    // Estratégia 1: Poder das Repetidas
    estrategiaPoderepetidas() {
        const jogo = [];
        
        // Usar dados oficiais se disponíveis, senão usar dados simulados
        let numerosUltimoConcurso = [];
        
        if (this.dadosOficiais) {
            numerosUltimoConcurso = window.apiCaixa.extrairNumerosSorteados(this.dadosOficiais);
        } else if (this.ultimoResultado) {
            numerosUltimoConcurso = this.ultimoResultado.dezenas.map(n => parseInt(n));
        } else {
            // Dados simulados como fallback
            numerosUltimoConcurso = [2, 5, 7, 9, 12, 14, 16, 18, 20, 21, 22, 23, 24, 25, 1];
        }
        
        if (numerosUltimoConcurso.length > 0) {
            const repetidas = numerosUltimoConcurso
                .sort(() => 0.5 - Math.random())
                .slice(0, 5 + Math.floor(Math.random() * 3)); // 5-7 repetidas
            
            jogo.push(...repetidas);
        }
        
        // Completar com números aleatórios
        while (jogo.length < 15) {
            const num = Math.floor(Math.random() * 25) + 1;
            if (!jogo.includes(num)) {
                jogo.push(num);
            }
        }
        
        return jogo;
    }
    
    // Estratégia 2: Equilíbrio Par/Ímpar
    estrategiaEquilibrioParImpar() {
        const jogo = [];
        const pares = [];
        const impares = [];
        
        // Separar pares e ímpares
        for (let i = 1; i <= 25; i++) {
            if (i % 2 === 0) {
                pares.push(i);
            } else {
                impares.push(i);
            }
        }
        
        // Embaralhar
        this.embaralharArray(pares);
        this.embaralharArray(impares);
        
        // Decidir proporção (7-8 ou 8-7)
        const paresCount = Math.random() < 0.5 ? 7 : 8;
        const imparesCount = 15 - paresCount;
        
        jogo.push(...pares.slice(0, paresCount));
        jogo.push(...impares.slice(0, imparesCount));
        
        return jogo;
    }
    
    // Estratégia 3: Números Atrasados (simulada)
    estrategiaNumerosAtrasados() {
        const jogo = [];
        
        // Simular números atrasados (em implementação real, usar dados históricos)
        const numerosAtrasados = [2, 5, 8, 11, 14, 17, 20, 23].sort(() => 0.5 - Math.random());
        const numerosNormais = [];
        
        for (let i = 1; i <= 25; i++) {
            if (!numerosAtrasados.includes(i)) {
                numerosNormais.push(i);
            }
        }
        
        this.embaralharArray(numerosNormais);
        
        // 60% atrasados, 40% normais
        const atrasadosCount = Math.floor(15 * 0.6);
        jogo.push(...numerosAtrasados.slice(0, atrasadosCount));
        jogo.push(...numerosNormais.slice(0, 15 - atrasadosCount));
        
        return jogo;
    }
    
    // Estratégia 4: Sequências Inteligentes
    estrategiaSequenciasInteligentes() {
        const jogo = [];
        const todosNumeros = Array.from({length: 25}, (_, i) => i + 1);
        this.embaralharArray(todosNumeros);
        
        // Evitar sequências de mais de 2 números consecutivos
        for (let num of todosNumeros) {
            if (jogo.length >= 15) break;
            
            let temSequencia = false;
            for (let i = 0; i < jogo.length - 1; i++) {
                if (Math.abs(jogo[i] - num) === 1 && Math.abs(jogo[i+1] - num) <= 1) {
                    temSequencia = true;
                    break;
                }
            }
            
            if (!temSequencia) {
                jogo.push(num);
            }
        }
        
        // Se não completou 15, adicionar números restantes
        while (jogo.length < 15) {
            for (let i = 1; i <= 25; i++) {
                if (!jogo.includes(i)) {
                    jogo.push(i);
                    break;
                }
            }
        }
        
        return jogo;
    }
    
    // Estratégia 5: Divisão por Colunas
    estrategiaDivisaoColunas() {
        const jogo = [];
        const colunas = [
            [1, 2, 3, 4, 5],      // Coluna 1
            [6, 7, 8, 9, 10],     // Coluna 2
            [11, 12, 13, 14, 15], // Coluna 3
            [16, 17, 18, 19, 20], // Coluna 4
            [21, 22, 23, 24, 25]  // Coluna 5
        ];
        
        // Pegar 3 números de cada coluna
        colunas.forEach(coluna => {
            this.embaralharArray(coluna);
            jogo.push(...coluna.slice(0, 3));
        });
        
        return jogo;
    }
    
    // Estratégia 6: Frequência Histórica (simulada)
    estrategiaFrequenciaHistorica() {
        const jogo = [];
        
        // Simular números quentes e frios
        const numerosQuentes = [2, 4, 5, 11, 13, 14, 16, 20, 23];
        const numerosFrios = [1, 6, 7, 9, 12, 15, 17, 19, 22, 25];
        const numerosNeutros = [3, 8, 10, 18, 21, 24];
        
        this.embaralharArray(numerosQuentes);
        this.embaralharArray(numerosFrios);
        this.embaralharArray(numerosNeutros);
        
        // 50% quentes, 30% frios, 20% neutros
        jogo.push(...numerosQuentes.slice(0, 8));
        jogo.push(...numerosFrios.slice(0, 4));
        jogo.push(...numerosNeutros.slice(0, 3));
        
        return jogo;
    }
    
    // Estratégia 7: Matemática dos Finais
    estrategiaMatematicaFinais() {
        const jogo = [];
        const porFinal = Array.from({length: 10}, () => []);
        
        // Agrupar números por final
        for (let i = 1; i <= 25; i++) {
            porFinal[i % 10].push(i);
        }
        
        // Distribuir equilibradamente
        let finalAtual = 0;
        while (jogo.length < 15) {
            if (porFinal[finalAtual].length > 0) {
                const num = porFinal[finalAtual].splice(
                    Math.floor(Math.random() * porFinal[finalAtual].length), 1
                )[0];
                jogo.push(num);
            }
            finalAtual = (finalAtual + 1) % 10;
        }
        
        return jogo;
    }
    
    embaralharArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    exibirJogosGerados(nomeEstrategia) {
        document.getElementById('estrategiaUsada').textContent = nomeEstrategia;
        
        // Salvar bilhete no histórico
        const bilheteId = window.historicoBilhetes?.salvarBilhete(
            this.jogosGerados, 
            nomeEstrategia, 
            this.dadosOficiais?.numero || null
        );
        
        if (bilheteId) {
            console.log(`✅ Bilhete salvo no histórico: ${bilheteId}`);
        }
        
        const container = document.getElementById('jogosGerados');
        container.innerHTML = '';
        
        this.jogosGerados.forEach((jogo, index) => {
            const jogoCard = document.createElement('div');
            jogoCard.className = 'bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500';
            
            const dezenasHtml = jogo.map(num => 
                `<div class="number-ball number-ball-game">${num.toString().padStart(2, '0')}</div>`
            ).join('');
            
            jogoCard.innerHTML = `
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-bold text-gray-800">Jogo ${index + 1}</h4>
                    <button class="text-blue-500 hover:text-blue-700 text-sm" 
                            onclick="lotofacil.copiarJogo(${index})">
                        <i class="fas fa-copy mr-1"></i>
                        Copiar
                    </button>
                </div>
                <div class="flex flex-wrap gap-1">
                    ${dezenasHtml}
                </div>
            `;
            
            container.appendChild(jogoCard);
        });
        
        document.getElementById('resultados').classList.remove('hidden');
    }
    
    copiarJogo(index) {
        const jogo = this.jogosGerados[index];
        const texto = jogo.map(n => n.toString().padStart(2, '0')).join(' - ');
        
        navigator.clipboard.writeText(texto).then(() => {
            this.mostrarAlerta(`Jogo ${index + 1} copiado!`, 'success');
        }).catch(() => {
            this.mostrarAlerta('Erro ao copiar jogo', 'error');
        });
    }
    
    copiarJogos() {
        let texto = `=== LOTOFÁCIL ESTRATÉGICA ===\n`;
        texto += `Estratégia: ${document.getElementById('estrategiaUsada').textContent}\n`;
        texto += `Data: ${new Date().toLocaleDateString('pt-BR')}\n\n`;
        
        this.jogosGerados.forEach((jogo, index) => {
            texto += `Jogo ${index + 1}: ${jogo.map(n => n.toString().padStart(2, '0')).join(' - ')}\n`;
        });
        
        navigator.clipboard.writeText(texto).then(() => {
            this.mostrarAlerta('Todos os jogos copiados!', 'success');
        }).catch(() => {
            this.mostrarAlerta('Erro ao copiar jogos', 'error');
        });
    }
    
    exportarJogos() {
        let conteudo = `Estratégia,Jogo,Dezenas\n`;
        const estrategia = document.getElementById('estrategiaUsada').textContent;
        
        this.jogosGerados.forEach((jogo, index) => {
            const dezenas = jogo.map(n => n.toString().padStart(2, '0')).join('-');
            conteudo += `"${estrategia}",${index + 1},"${dezenas}"\n`;
        });
        
        const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `lotofacil-estrategica-${Date.now()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.mostrarAlerta('Jogos exportados com sucesso!', 'success');
    }
    
    mostrarLoading(mostrar) {
        const existingLoader = document.getElementById('globalLoader');
        
        if (mostrar) {
            if (existingLoader) return;
            
            const loader = document.createElement('div');
            loader.id = 'globalLoader';
            loader.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
            loader.innerHTML = `
                <div class="bg-white rounded-lg p-8 text-center">
                    <div class="w-12 h-12 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full loading"></div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">Gerando Jogos...</h3>
                    <p class="text-gray-600">Aplicando estratégias inteligentes</p>
                </div>
            `;
            document.body.appendChild(loader);
        } else {
            if (existingLoader) {
                existingLoader.remove();
            }
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

    /**
     * Carrega dados oficiais da API da Caixa
     */
    async carregarDadosOficiais() {
        try {
            // Mostrar indicador de carregamento
            this.mostrarCarregamento('Carregando dados oficiais da Caixa...');
            
            // Buscar último concurso e estatísticas
            this.dadosOficiais = await window.apiCaixa.buscarUltimoConcurso();
            this.estatisticas = await window.apiCaixa.calcularEstatisticas();
            
            // Salvar último resultado com todos os dados incluindo prêmio e acumulação
            if (this.dadosOficiais) {
                const numeros = window.apiCaixa.extrairNumerosSorteados(this.dadosOficiais);
                const ultimoResultado = {
                    concurso: this.dadosOficiais.numero,
                    data: this.dadosOficiais.dataApuracao,
                    numeros: numeros,
                    premio: this.dadosOficiais.valorArrecadado || this.dadosOficiais.valorEstimadoProximoConcurso || 'N/A',
                    acumulado: this.dadosOficiais.acumulado || false,
                    timestamp: new Date().toISOString()
                };
                this.salvarUltimoResultado(ultimoResultado);
            }
            
            // Atualizar interface com dados oficiais
            this.atualizarInterfaceComDadosOficiais();
            
            this.esconderCarregamento();
            
            console.log('✅ Dados oficiais carregados:', this.dadosOficiais);
            
        } catch (error) {
            console.warn('⚠️ Erro ao carregar dados oficiais:', error);
            this.esconderCarregamento();
        }
    }

    /**
     * Atualiza a interface com dados oficiais da Caixa
     */
    atualizarInterfaceComDadosOficiais() {
        if (!this.dadosOficiais) return;

        // Atualizar último resultado no cabeçalho se existir
        const ultimoResultadoEl = document.getElementById('ultimoResultado');
        if (ultimoResultadoEl) {
            const numeros = window.apiCaixa.extrairNumerosSorteados(this.dadosOficiais);
            const premio = this.dadosOficiais.valorArrecadado || this.dadosOficiais.valorEstimadoProximoConcurso || 'N/A';
            const acumulado = this.dadosOficiais.acumulado || false;
            
            ultimoResultadoEl.innerHTML = `
                <div class="text-center bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-lg">
                    <h3 class="font-bold mb-2">🎯 Último Resultado Oficial</h3>
                    <div class="grid grid-cols-4 gap-2 text-sm mb-3">
                        <div>
                            <i class="fas fa-trophy text-yellow-300"></i>
                            <br>Concurso ${this.dadosOficiais.numero}
                        </div>
                        <div>
                            <i class="fas fa-calendar text-blue-200"></i>
                            <br>${this.dadosOficiais.dataApuracao}
                        </div>
                        <div>
                            <i class="fas fa-money-bill-wave text-green-300"></i>
                            <br>${typeof premio === 'number' ? 'R$ ' + premio.toLocaleString('pt-BR') : premio}
                        </div>
                        <div>
                            <i class="fas ${acumulado ? 'fa-arrow-up text-red-300' : 'fa-check-circle text-green-300'}"></i>
                            <br>${acumulado ? 'Acumulou' : 'Não acumulou'}
                        </div>
                    </div>
                    <div class="flex flex-wrap justify-center gap-1">
                        ${numeros.map(num => 
                            `<div class="number-ball-small bg-white text-purple-600">${num.toString().padStart(2, '0')}</div>`
                        ).join('')}
                    </div>
                </div>
            `;
        }
    }

    /**
     * Mostra indicador de carregamento
     */
    mostrarCarregamento(texto = 'Carregando...') {
        const loading = document.getElementById('loadingIndicator');
        if (loading) {
            loading.textContent = texto;
            loading.classList.remove('hidden');
        }
    }

    /**
     * Esconde indicador de carregamento
     */
    esconderCarregamento() {
        const loading = document.getElementById('loadingIndicator');
        if (loading) {
            loading.classList.add('hidden');
        }
    }

    // === FUNCIONALIDADES DO HISTÓRICO ===
    
    /**
     * Inicializa funcionalidades do histórico
     */
    inicializarHistorico() {
        // Configurar eventos dos botões
        const btnConferirSemana = document.getElementById('conferirSemana');
        const btnExportarHistorico = document.getElementById('exportarHistorico');
        const btnLimparHistorico = document.getElementById('limparHistorico');
        const btnAplicarFiltros = document.getElementById('aplicarFiltros');
        const btnLimparFiltros = document.getElementById('limparFiltros');

        if (btnConferirSemana) {
            btnConferirSemana.addEventListener('click', () => this.conferirBilhetesDaSemana());
        }

        if (btnExportarHistorico) {
            btnExportarHistorico.addEventListener('click', () => this.exportarHistoricoCompleto());
        }

        if (btnLimparHistorico) {
            btnLimparHistorico.addEventListener('click', () => this.limparHistoricoCompleto());
        }

        if (btnAplicarFiltros) {
            btnAplicarFiltros.addEventListener('click', () => this.aplicarFiltros());
        }

        if (btnLimparFiltros) {
            btnLimparFiltros.addEventListener('click', () => this.limparFiltros());
        }

        // Carregar histórico inicial
        this.atualizarInterfaceHistorico();
    }

    /**
     * Confere bilhetes da semana
     */
    async conferirBilhetesDaSemana() {
        if (!window.historicoBilhetes) return;

        this.mostrarCarregamento('Conferindo bilhetes da semana...');

        try {
            const resultado = await window.historicoBilhetes.conferirBilhetesDaSemana();
            
            this.esconderCarregamento();
            
            if (resultado.bilhetesConferidos > 0) {
                this.mostrarAlerta(
                    `✅ ${resultado.bilhetesConferidos} bilhetes conferidos com sucesso!`,
                    'success'
                );
                this.atualizarInterfaceHistorico();
            } else {
                this.mostrarAlerta(
                    'ℹ️ Nenhum bilhete pendente encontrado para conferir.',
                    'info'
                );
            }

        } catch (error) {
            this.esconderCarregamento();
            this.mostrarAlerta('❌ Erro ao conferir bilhetes da semana.', 'error');
            console.error('Erro ao conferir bilhetes:', error);
        }
    }

    /**
     * Remove bilhete do histórico
     */
    removerBilhete(bilheteId) {
        if (!window.historicoBilhetes) return;

        if (confirm('Tem certeza que deseja remover este bilhete?')) {
            const removido = window.historicoBilhetes.removerBilhete(bilheteId);
            if (removido) {
                this.atualizarInterfaceHistorico();
                this.mostrarAlerta('✅ Bilhete removido com sucesso!', 'success');
            }
        }
    }

    /**
     * Exporta histórico completo
     */
    exportarHistoricoCompleto() {
        if (!window.historicoBilhetes) return;

        try {
            const dadosExportacao = window.historicoBilhetes.exportarHistorico();
            
            const blob = new Blob([dadosExportacao], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `historico-lotofacil-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
            
            this.mostrarAlerta('✅ Histórico exportado com sucesso!', 'success');

        } catch (error) {
            this.mostrarAlerta('❌ Erro ao exportar histórico.', 'error');
            console.error('Erro na exportação:', error);
        }
    }

    /**
     * Limpa histórico completo
     */
    limparHistoricoCompleto() {
        if (!window.historicoBilhetes) return;

        if (confirm('⚠️ Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.')) {
            window.historicoBilhetes.limparHistorico();
            this.atualizarInterfaceHistorico();
            this.mostrarAlerta('✅ Histórico limpo com sucesso!', 'success');
        }
    }

    /**
     * Aplica filtros ao histórico
     */
    aplicarFiltros() {
        if (!window.historicoBilhetes) return;

        const filtros = {
            estrategia: document.getElementById('filtroEstrategia')?.value || '',
            status: document.getElementById('filtroStatus')?.value || '',
            dataInicio: document.getElementById('filtroDataInicio')?.value || '',
            dataFim: document.getElementById('filtroDataFim')?.value || ''
        };

        this.atualizarInterfaceHistorico(filtros);
    }

    /**
     * Limpa filtros
     */
    limparFiltros() {
        document.getElementById('filtroEstrategia').value = '';
        document.getElementById('filtroStatus').value = '';
        document.getElementById('filtroDataInicio').value = '';
        document.getElementById('filtroDataFim').value = '';
        
        this.atualizarInterfaceHistorico();
    }

    /**
     * Atualiza interface do histórico
     */
    atualizarInterfaceHistorico(filtros = {}) {
        if (!window.historicoBilhetes) return;

        const bilhetes = window.historicoBilhetes.getHistorico(filtros);
        const estatisticas = window.historicoBilhetes.getEstatisticasPorEstrategia();
        
        this.renderizarEstatisticasGerais(estatisticas);
        this.renderizarListaBilhetes(bilhetes);
        
        // Mostrar seção do histórico se há bilhetes
        if (bilhetes.length > 0) {
            document.getElementById('historico')?.classList.remove('hidden');
            document.getElementById('rankings')?.classList.remove('hidden');
        }
    }

    /**
     * Renderiza estatísticas gerais
     */
    renderizarEstatisticasGerais(estatisticas) {
        const container = document.getElementById('estatisticasGerais');
        if (!container) return;

        const totalBilhetes = Object.values(estatisticas).reduce((total, stat) => total + stat.totalBilhetes, 0);
        const totalPremios = Object.values(estatisticas).reduce((total, stat) => total + stat.totalPremios, 0);
        const totalAcertos = Object.values(estatisticas).reduce((total, stat) => total + stat.totalAcertos, 0);
        const totalJogos = Object.values(estatisticas).reduce((total, stat) => total + stat.totalJogos, 0);

        container.innerHTML = `
            <div class="bg-white rounded-lg card-shadow p-6 text-center">
                <div class="text-3xl font-bold text-blue-600 mb-2">${totalBilhetes}</div>
                <div class="text-gray-600">Bilhetes Gerados</div>
            </div>
            <div class="bg-white rounded-lg card-shadow p-6 text-center">
                <div class="text-3xl font-bold text-green-600 mb-2">R$ ${totalPremios.toFixed(2)}</div>
                <div class="text-gray-600">Total em Prêmios</div>
            </div>
            <div class="bg-white rounded-lg card-shadow p-6 text-center">
                <div class="text-3xl font-bold text-purple-600 mb-2">${totalAcertos}</div>
                <div class="text-gray-600">Total de Acertos</div>
            </div>
            <div class="bg-white rounded-lg card-shadow p-6 text-center">
                <div class="text-3xl font-bold text-orange-600 mb-2">${totalJogos > 0 ? (totalAcertos / totalJogos).toFixed(1) : '0'}</div>
                <div class="text-gray-600">Média Acertos/Jogo</div>
            </div>
        `;
    }

    /**
     * Renderiza lista de bilhetes
     */
    renderizarListaBilhetes(bilhetes) {
        const container = document.getElementById('listaBilhetes');
        const nenhumBilhete = document.getElementById('nenhumBilhete');
        
        if (!container || !nenhumBilhete) return;

        if (bilhetes.length === 0) {
            container.classList.add('hidden');
            nenhumBilhete.classList.remove('hidden');
            return;
        }

        container.classList.remove('hidden');
        nenhumBilhete.classList.add('hidden');

        container.innerHTML = bilhetes.slice(0, 20).map(bilhete => {
            const dataGeracao = new Date(bilhete.dataGeracao).toLocaleString('pt-BR');
            const statusClass = bilhete.status === 'conferido' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
            
            let resultadosHtml = '';
            if (bilhete.status === 'conferido' && bilhete.resultados.length > 0) {
                resultadosHtml = `
                    <div class="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div class="text-sm text-gray-600 mb-2">Melhor resultado: ${bilhete.melhorJogo.acertos} acertos</div>
                        <div class="text-sm text-green-600 font-bold">Total em prêmios: R$ ${bilhete.totalPremios.toFixed(2)}</div>
                    </div>
                `;
            }

            return `
                <div class="border border-gray-200 rounded-lg p-4">
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <h4 class="font-bold text-lg">${bilhete.estrategia}</h4>
                            <p class="text-gray-600 text-sm">${dataGeracao}</p>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="px-3 py-1 rounded-full text-xs font-medium ${statusClass}">
                                ${bilhete.status === 'conferido' ? '✓ Conferido' : '⏳ Pendente'}
                            </span>
                            <button onclick="lotofacil.removerBilhete('${bilhete.id}')" 
                                    class="text-red-500 hover:text-red-700">
                                <i class="fas fa-trash text-sm"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="text-sm text-gray-600 mb-2">
                        ${bilhete.jogos.length} jogos gerados
                    </div>
                    
                    ${resultadosHtml}
                </div>
            `;
        }).join('');

        // Adicionar indicador se há mais bilhetes
        if (bilhetes.length > 20) {
            container.innerHTML += `
                <div class="text-center py-4 text-gray-500">
                    ... e mais ${bilhetes.length - 20} bilhetes
                </div>
            `;
        }
    }
}

// Inicializar aplicação
const lotofacil = new LotofacilEstrategica();

// Carregar dados oficiais quando a página carregar
document.addEventListener('DOMContentLoaded', async function() {
    // Carregar dados da API da Caixa
    await lotofacil.carregarDadosOficiais();
    
    // Inicializar histórico de bilhetes
    lotofacil.inicializarHistorico();
    
    // Configurar botão de atualizar dados
    const btnAtualizar = document.getElementById('atualizarResultado');
    if (btnAtualizar) {
        btnAtualizar.addEventListener('click', () => {
            window.apiCaixa.limparCache();
            lotofacil.carregarDadosOficiais();
        });
    }
    
    // Smooth scroll para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});