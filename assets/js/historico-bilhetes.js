// Sistema de Histórico de Bilhetes - LotoFácil Estratégica
// Gerencia armazenamento, comparação e estatísticas dos jogos gerados

class HistoricoBilhetes {
    constructor() {
        this.storageKey = 'lotofacil-historico-bilhetes';
        this.bilhetes = this.carregarHistorico();
        this.pontuacaoLotofacil = {
            11: 5,    // 11 acertos = R$ 5,00
            12: 10,   // 12 acertos = R$ 10,00  
            13: 25,   // 13 acertos = R$ 25,00
            14: 1500, // 14 acertos = R$ 1.500,00
            15: 1800000 // 15 acertos = Prêmio principal
        };
    }

    /**
     * Salva um novo bilhete no histórico
     */
    salvarBilhete(jogos, estrategia, concursoReferencia = null) {
        const bilhete = {
            id: this.gerarId(),
            dataGeracao: new Date().toISOString(),
            estrategia: estrategia,
            concursoReferencia: concursoReferencia,
            jogos: jogos,
            status: 'pendente', // pendente, conferido
            resultados: [], // será preenchido após conferência
            totalAcertos: 0,
            totalPremios: 0,
            melhorJogo: null
        };

        this.bilhetes.unshift(bilhete); // Adiciona no início da lista
        this.salvarNoStorage();
        
        return bilhete.id;
    }

    /**
     * Confere um bilhete com o resultado oficial
     */
    conferirBilhete(bilheteId, resultadoOficial) {
        const bilhete = this.bilhetes.find(b => b.id === bilheteId);
        if (!bilhete) return null;

        const numerosSorteados = Array.isArray(resultadoOficial) 
            ? resultadoOficial 
            : window.apiCaixa?.extrairNumerosSorteados(resultadoOficial) || [];

        if (numerosSorteados.length === 0) {
            console.warn('Números sorteados inválidos para conferência');
            return null;
        }

        // Conferir cada jogo do bilhete
        bilhete.resultados = bilhete.jogos.map((jogo, index) => {
            const acertos = this.contarAcertos(jogo, numerosSorteados);
            const premio = this.calcularPremio(acertos);
            
            return {
                jogoIndex: index,
                numeros: [...jogo],
                acertos: acertos,
                numerosAcertados: jogo.filter(num => numerosSorteados.includes(num)),
                premio: premio
            };
        });

        // Calcular estatísticas do bilhete
        bilhete.totalAcertos = bilhete.resultados.reduce((total, r) => total + r.acertos, 0);
        bilhete.totalPremios = bilhete.resultados.reduce((total, r) => total + r.premio, 0);
        bilhete.melhorJogo = bilhete.resultados.reduce((melhor, atual) => 
            atual.acertos > melhor.acertos ? atual : melhor
        );
        bilhete.status = 'conferido';
        bilhete.dataConferencia = new Date().toISOString();
        bilhete.numerosConcurso = numerosSorteados;

        this.salvarNoStorage();
        return bilhete;
    }

    /**
     * Confere todos os bilhetes pendentes com resultados da semana
     */
    async conferirBilhetesDaSemana() {
        try {
            // Buscar resultados dos últimos 7 dias
            const historicoConcursos = await window.apiCaixa?.buscarHistorico(7) || [];
            const bilhetesPendentes = this.bilhetes.filter(b => b.status === 'pendente');

            const resultados = [];

            for (const bilhete of bilhetesPendentes) {
                // Encontrar o concurso correspondente baseado na data de geração
                const dataGeracao = new Date(bilhete.dataGeracao);
                const concursoCorrespondente = this.encontrarConcursoMaisProximo(
                    dataGeracao, 
                    historicoConcursos
                );

                if (concursoCorrespondente) {
                    const resultadoConferencia = this.conferirBilhete(
                        bilhete.id, 
                        concursoCorrespondente
                    );
                    
                    if (resultadoConferencia) {
                        resultados.push(resultadoConferencia);
                    }
                }
            }

            return {
                bilhetesConferidos: resultados.length,
                totalBilhetes: bilhetesPendentes.length,
                resultados: resultados
            };

        } catch (error) {
            console.error('Erro ao conferir bilhetes da semana:', error);
            return { bilhetesConferidos: 0, totalBilhetes: 0, resultados: [] };
        }
    }

    /**
     * Encontra o concurso mais próximo da data de geração
     */
    encontrarConcursoMaisProximo(dataGeracao, concursos) {
        if (!concursos.length) return null;

        return concursos.reduce((maisProximo, concurso) => {
            const dataConcurso = this.parseDataBrasil(concurso.dataApuracao);
            const dataProximoAnterior = maisProximo ? 
                this.parseDataBrasil(maisProximo.dataApuracao) : null;

            if (!dataProximoAnterior) return concurso;

            const diffAtual = Math.abs(dataGeracao - dataConcurso);
            const diffAnterior = Math.abs(dataGeracao - dataProximoAnterior);

            return diffAtual < diffAnterior ? concurso : maisProximo;
        });
    }

    /**
     * Conta acertos entre jogo gerado e números sorteados
     */
    contarAcertos(jogoGerado, numerosSorteados) {
        return jogoGerado.filter(num => numerosSorteados.includes(num)).length;
    }

    /**
     * Calcula prêmio baseado no número de acertos
     */
    calcularPremio(acertos) {
        return this.pontuacaoLotofacil[acertos] || 0;
    }

    /**
     * Obtém estatísticas por estratégia
     */
    getEstatisticasPorEstrategia() {
        const stats = {};
        
        this.bilhetes
            .filter(b => b.status === 'conferido')
            .forEach(bilhete => {
                if (!stats[bilhete.estrategia]) {
                    stats[bilhete.estrategia] = {
                        totalBilhetes: 0,
                        totalJogos: 0,
                        totalAcertos: 0,
                        totalPremios: 0,
                        melhorAcerto: 0,
                        distribuicaoAcertos: {},
                        mediaAcertosPorJogo: 0
                    };
                }

                const stat = stats[bilhete.estrategia];
                stat.totalBilhetes++;
                stat.totalJogos += bilhete.jogos.length;
                stat.totalAcertos += bilhete.totalAcertos;
                stat.totalPremios += bilhete.totalPremios;
                stat.melhorAcerto = Math.max(stat.melhorAcerto, bilhete.melhorJogo.acertos);

                // Distribuição de acertos
                bilhete.resultados.forEach(resultado => {
                    const acertos = resultado.acertos;
                    stat.distribuicaoAcertos[acertos] = (stat.distribuicaoAcertos[acertos] || 0) + 1;
                });
            });

        // Calcular médias
        Object.values(stats).forEach(stat => {
            stat.mediaAcertosPorJogo = stat.totalJogos > 0 ? 
                (stat.totalAcertos / stat.totalJogos).toFixed(2) : 0;
        });

        return stats;
    }

    /**
     * Obtém ranking das melhores estratégias
     */
    getRankingEstrategias() {
        const stats = this.getEstatisticasPorEstrategia();
        
        return Object.entries(stats)
            .map(([estrategia, dados]) => ({
                estrategia,
                ...dados,
                pontuacaoGeral: this.calcularPontuacaoGeral(dados)
            }))
            .sort((a, b) => b.pontuacaoGeral - a.pontuacaoGeral);
    }

    /**
     * Calcula pontuação geral de uma estratégia
     */
    calcularPontuacaoGeral(stats) {
        // Fórmula: (média de acertos * 10) + (melhor acerto * 5) + (total prêmios / 1000)
        return (parseFloat(stats.mediaAcertosPorJogo) * 10) + 
               (stats.melhorAcerto * 5) + 
               (stats.totalPremios / 1000);
    }

    /**
     * Obtém histórico filtrado
     */
    getHistorico(filtros = {}) {
        let historico = [...this.bilhetes];

        if (filtros.estrategia) {
            historico = historico.filter(b => b.estrategia === filtros.estrategia);
        }

        if (filtros.status) {
            historico = historico.filter(b => b.status === filtros.status);
        }

        if (filtros.dataInicio) {
            const dataInicio = new Date(filtros.dataInicio);
            historico = historico.filter(b => new Date(b.dataGeracao) >= dataInicio);
        }

        if (filtros.dataFim) {
            const dataFim = new Date(filtros.dataFim);
            historico = historico.filter(b => new Date(b.dataGeracao) <= dataFim);
        }

        return historico;
    }

    /**
     * Remove bilhete do histórico
     */
    removerBilhete(bilheteId) {
        const index = this.bilhetes.findIndex(b => b.id === bilheteId);
        if (index !== -1) {
            this.bilhetes.splice(index, 1);
            this.salvarNoStorage();
            return true;
        }
        return false;
    }

    /**
     * Limpa todo o histórico
     */
    limparHistorico() {
        this.bilhetes = [];
        this.salvarNoStorage();
    }

    /**
     * Exporta histórico em formato JSON
     */
    exportarHistorico() {
        const dados = {
            dataExportacao: new Date().toISOString(),
            totalBilhetes: this.bilhetes.length,
            bilhetes: this.bilhetes,
            estatisticas: this.getEstatisticasPorEstrategia()
        };

        return JSON.stringify(dados, null, 2);
    }

    // === MÉTODOS AUXILIARES ===

    gerarId() {
        return 'bilhete_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    parseDataBrasil(dataStr) {
        // Converte data brasileira "DD/MM/YYYY" para Date
        const [dia, mes, ano] = dataStr.split('/');
        return new Date(ano, mes - 1, dia);
    }

    carregarHistorico() {
        try {
            const dados = localStorage.getItem(this.storageKey);
            return dados ? JSON.parse(dados) : [];
        } catch (error) {
            console.warn('Erro ao carregar histórico:', error);
            return [];
        }
    }

    salvarNoStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.bilhetes));
        } catch (error) {
            console.error('Erro ao salvar histórico:', error);
        }
    }
}

// Instância global do histórico
window.historicoBilhetes = new HistoricoBilhetes();