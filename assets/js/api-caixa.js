// API da Caixa Econômica Federal - Lotofácil
// Módulo para integração com os dados oficiais da CEF

class ApiCaixa {
    constructor() {
        this.baseUrl = 'https://servicebus2.caixa.gov.br/portaldeloterias/api';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
    }

    /**
     * Busca informações do último concurso da Lotofácil
     */
    async buscarUltimoConcurso() {
        const cacheKey = 'ultimo-concurso';
        
        if (this.isValidCache(cacheKey)) {
            return this.cache.get(cacheKey).data;
        }

        try {
            const response = await fetch(`${this.baseUrl}/lotofacil`);
            
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Salvar no cache
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });
            
            return data;
            
        } catch (error) {
            console.warn('Erro ao buscar último concurso:', error);
            
            // Retornar dados mock se a API falhar
            return this.getMockUltimoConcurso();
        }
    }

    /**
     * Busca informações de um concurso específico
     */
    async buscarConcurso(numero) {
        const cacheKey = `concurso-${numero}`;
        
        if (this.isValidCache(cacheKey)) {
            return this.cache.get(cacheKey).data;
        }

        try {
            const response = await fetch(`${this.baseUrl}/lotofacil/${numero}`);
            
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Salvar no cache
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });
            
            return data;
            
        } catch (error) {
            console.warn(`Erro ao buscar concurso ${numero}:`, error);
            return null;
        }
    }

    /**
     * Busca histórico dos últimos N concursos
     */
    async buscarHistorico(quantidade = 10) {
        try {
            const ultimoConcurso = await this.buscarUltimoConcurso();
            const numeroUltimo = ultimoConcurso.numero;
            const historico = [];

            // Buscar os últimos N concursos
            for (let i = 0; i < quantidade; i++) {
                const numeroConcurso = numeroUltimo - i;
                if (numeroConcurso > 0) {
                    const concurso = await this.buscarConcurso(numeroConcurso);
                    if (concurso) {
                        historico.push(concurso);
                    }
                }
            }

            return historico;
            
        } catch (error) {
            console.warn('Erro ao buscar histórico:', error);
            return this.getMockHistorico();
        }
    }

    /**
     * Extrai apenas os números sorteados de um resultado
     */
    extrairNumerosSorteados(resultado) {
        if (!resultado || !resultado.dezenasSorteadasOrdemSorteio) {
            return [];
        }
        
        return resultado.dezenasSorteadasOrdemSorteio
            .map(num => parseInt(num))
            .sort((a, b) => a - b);
    }

    /**
     * Calcula estatísticas dos números baseado no histórico
     */
    async calcularEstatisticas(historico = null) {
        if (!historico) {
            historico = await this.buscarHistorico(50);
        }

        const frequencia = {};
        const pares = new Set();
        const impares = new Set();
        let totalSorteios = 0;

        // Inicializar contadores
        for (let i = 1; i <= 25; i++) {
            frequencia[i] = 0;
        }

        // Contar frequências
        historico.forEach(concurso => {
            const numeros = this.extrairNumerosSorteados(concurso);
            
            numeros.forEach(num => {
                frequencia[num]++;
                totalSorteios++;
                
                if (num % 2 === 0) {
                    pares.add(num);
                } else {
                    impares.add(num);
                }
            });
        });

        // Calcular números mais e menos sorteados
        const numerosOrdenados = Object.entries(frequencia)
            .map(([num, freq]) => ({
                numero: parseInt(num),
                frequencia: freq,
                porcentagem: ((freq / historico.length) * 100).toFixed(1)
            }))
            .sort((a, b) => b.frequencia - a.frequencia);

        return {
            maisFrequentes: numerosOrdenados.slice(0, 10),
            menosFrequentes: numerosOrdenados.slice(-10).reverse(),
            numerosPares: Array.from(pares).sort((a, b) => a - b),
            numerosImpares: Array.from(impares).sort((a, b) => a - b),
            totalConcursos: historico.length,
            totalSorteios
        };
    }

    /**
     * Verifica se o cache ainda é válido
     */
    isValidCache(key) {
        if (!this.cache.has(key)) return false;
        
        const cached = this.cache.get(key);
        return (Date.now() - cached.timestamp) < this.cacheTimeout;
    }

    /**
     * Limpar cache antigo
     */
    limparCache() {
        this.cache.clear();
    }

    /**
     * Dados mock para fallback quando a API não estiver disponível
     */
    getMockUltimoConcurso() {
        return {
            numero: 3150,
            dataApuracao: "24/09/2025",
            dezenasSorteadasOrdemSorteio: ["02", "05", "07", "09", "12", "14", "16", "18", "20", "21", "22", "23", "24", "25", "01"],
            valorEstimadoProximoConcurso: 1700000.00,
            acumulado: false,
            dataProximoConcurso: "25/09/2025"
        };
    }

    getMockHistorico() {
        // Histórico simulado dos últimos 10 concursos
        return [
            {
                numero: 3150,
                dataApuracao: "24/09/2025",
                dezenasSorteadasOrdemSorteio: ["02", "05", "07", "09", "12", "14", "16", "18", "20", "21", "22", "23", "24", "25", "01"]
            },
            {
                numero: 3149,
                dataApuracao: "23/09/2025", 
                dezenasSorteadasOrdemSorteio: ["01", "03", "06", "08", "11", "13", "15", "17", "19", "20", "21", "22", "24", "25", "04"]
            },
            {
                numero: 3148,
                dataApuracao: "22/09/2025",
                dezenasSorteadasOrdemSorteio: ["02", "04", "06", "07", "10", "12", "14", "16", "18", "19", "20", "22", "23", "25", "03"]
            }
            // Adicionar mais dados conforme necessário
        ];
    }
}

// Instância global da API
window.apiCaixa = new ApiCaixa();