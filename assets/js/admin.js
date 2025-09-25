// JavaScript para painel administrativo
class AdminManager {
    constructor() {
        this.authManager = new AuthManager();
        this.currentSection = 'dashboard';
        this.charts = {};
        
        // Verifica se é admin antes de inicializar
        this.verificarPermissaoAdmin();
        this.initializeEventListeners();
        this.initializeSidebar();
        this.carregarDadosIniciais();
    }
    
    // Verifica se o usuário é admin
    verificarPermissaoAdmin() {
        const usuario = this.authManager.obterUsuarioLogado();
        
        if (!usuario) {
            window.location.href = 'login.html';
            return;
        }
        
        if (usuario.perfil !== 'admin' && usuario.tipo !== 'admin') {
            this.mostrarMensagem('Acesso negado. Você não tem permissão de administrador.', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return;
        }
        
        // Atualiza nome do admin
        document.getElementById('adminName').textContent = usuario.nome.split(' ')[0];
        this.atualizarUltimoAcesso();
    }
    
    // Configura event listeners
    initializeEventListeners() {
        // Navigation
        document.querySelectorAll('[data-section]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.trocarSecao(e.target.closest('[data-section]').dataset.section);
            });
        });
        
        // Sidebar toggle
        document.getElementById('toggleSidebar').addEventListener('click', () => {
            this.toggleSidebar();
        });
        
        // Logout e navegação
        document.getElementById('logout').addEventListener('click', () => this.logout());
        document.getElementById('voltarSistema').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
        
        // Refresh data
        document.getElementById('refreshData').addEventListener('click', () => {
            this.carregarDadosSecaoAtual();
        });
        
        // Usuários
        document.getElementById('searchUsuarios').addEventListener('input', (e) => {
            this.filtrarUsuarios(e.target.value);
        });
        
        document.getElementById('exportarUsuarios').addEventListener('click', () => {
            this.exportarUsuarios();
        });
        
        // Configurações
        document.getElementById('salvarPrecos').addEventListener('click', () => {
            this.salvarPrecos();
        });
        
        document.getElementById('salvarConfiguracoes').addEventListener('click', () => {
            this.salvarConfiguracoes();
        });
        
        // Modal confirmação
        document.getElementById('cancelarConfirmacao').addEventListener('click', () => {
            this.fecharModalConfirmacao();
        });
    }
    
    // Inicializa sidebar
    initializeSidebar() {
        this.sidebarCollapsed = false;
    }
    
    // Toggle sidebar
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const sidebarTexts = document.querySelectorAll('.sidebar-text');
        const logoArea = document.getElementById('logoArea');
        
        this.sidebarCollapsed = !this.sidebarCollapsed;
        
        if (this.sidebarCollapsed) {
            sidebar.classList.add('collapsed');
            sidebarTexts.forEach(text => text.style.display = 'none');
            logoArea.style.display = 'none';
        } else {
            sidebar.classList.remove('collapsed');
            sidebarTexts.forEach(text => text.style.display = 'block');
            logoArea.style.display = 'flex';
        }
    }
    
    // Troca de seção
    trocarSecao(secao) {
        // Remove active de todos os botões
        document.querySelectorAll('[data-section]').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Adiciona active no botão clicado
        document.querySelector(`[data-section="${secao}"]`).classList.add('active');
        
        // Esconde todas as seções
        document.querySelectorAll('[id^="section-"]').forEach(section => {
            section.classList.add('hidden');
        });
        
        // Mostra seção atual
        document.getElementById(`section-${secao}`).classList.remove('hidden');
        
        // Atualiza título
        this.atualizarTituloSecao(secao);
        
        this.currentSection = secao;
        this.carregarDadosSecaoAtual();
    }
    
    // Atualiza título da seção
    atualizarTituloSecao(secao) {
        const titulos = {
            dashboard: { titulo: 'Dashboard', subtitulo: 'Visão geral do sistema' },
            usuarios: { titulo: 'Usuários', subtitulo: 'Gerenciar usuários cadastrados' },
            assinaturas: { titulo: 'Assinaturas', subtitulo: 'Controlar planos e pagamentos' },
            estatisticas: { titulo: 'Estatísticas', subtitulo: 'Análise detalhada de uso' },
            configuracoes: { titulo: 'Configurações', subtitulo: 'Configurações do sistema' }
        };
        
        document.getElementById('pageTitle').textContent = titulos[secao].titulo;
        document.getElementById('pageSubtitle').textContent = titulos[secao].subtitulo;
    }
    
    // Carrega dados iniciais
    carregarDadosIniciais() {
        this.carregarEstatisticasGerais();
        this.carregarDashboard();
    }
    
    // Carrega dados da seção atual
    carregarDadosSecaoAtual() {
        this.mostrarMensagem('Atualizando dados...', 'info');
        
        switch (this.currentSection) {
            case 'dashboard':
                this.carregarDashboard();
                break;
            case 'usuarios':
                this.carregarUsuarios();
                break;
            case 'assinaturas':
                this.carregarAssinaturas();
                break;
            case 'estatisticas':
                this.carregarEstatisticas();
                break;
            case 'configuracoes':
                this.carregarConfiguracoes();
                break;
        }
    }
    
    // Carrega estatísticas gerais
    carregarEstatisticasGerais() {
        const stats = this.authManager.obterEstatisticasAdmin();
        
        document.getElementById('totalUsuarios').textContent = stats.totalUsuarios;
        document.getElementById('usuariosAtivos').textContent = stats.usuariosAtivos;
        document.getElementById('assinantePagos').textContent = stats.assinantesPagos;
        document.getElementById('jogosGerados').textContent = stats.jogosGerados;
    }
    
    // Carrega dashboard
    carregarDashboard() {
        this.carregarEstatisticasGerais();
        this.criarGraficoUsuariosPorPeriodo();
        this.criarGraficoTiposAssinatura();
        this.carregarAtividadeRecente();
    }
    
    // Carrega usuários
    carregarUsuarios() {
        const usuarios = this.authManager.listarTodosUsuarios();
        const tbody = document.getElementById('tabelaUsuarios');
        
        tbody.innerHTML = usuarios.map(usuario => `
            <tr class="hover:bg-gray-50">
                <td class="py-4 px-6">
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-user text-purple-600 text-sm"></i>
                        </div>
                        <div>
                            <p class="font-semibold text-gray-800">${usuario.nome}</p>
                            <p class="text-sm text-gray-600">${usuario.contato}</p>
                        </div>
                    </div>
                </td>
                <td class="py-4 px-6 text-gray-800">${usuario.email}</td>
                <td class="py-4 px-6">
                    <span class="px-2 py-1 rounded-full text-xs font-semibold ${this.getAssinaturaBadgeClass(usuario.assinatura)}"">
                        ${this.getAssinaturaLabel(usuario.assinatura)}
                    </span>
                </td>
                <td class="py-4 px-6">
                    <span class="px-2 py-1 rounded-full text-xs font-semibold ${usuario.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${usuario.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td class="py-4 px-6 text-gray-600 text-sm">
                    ${new Date(usuario.dataCriacao).toLocaleDateString('pt-BR')}
                </td>
                <td class="py-4 px-6">
                    <div class="flex space-x-2">
                        ${usuario.tipo !== 'ADMIN' ? `
                            <button onclick="adminManager.alterarAssinatura('${usuario.id}')" 
                                    class="text-blue-600 hover:text-blue-800" title="Alterar Assinatura">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="adminManager.toggleUsuarioAtivo('${usuario.id}')" 
                                    class="text-yellow-600 hover:text-yellow-800" title="${usuario.ativo ? 'Desativar' : 'Ativar'}">
                                <i class="fas fa-${usuario.ativo ? 'pause' : 'play'}"></i>
                            </button>
                            <button onclick="adminManager.excluirUsuario('${usuario.id}')" 
                                    class="text-red-600 hover:text-red-800" title="Excluir">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : `
                            <span class="text-gray-400 text-sm">Admin</span>
                        `}
                    </div>
                </td>
            </tr>
        `).join('');
    }
    
    // Carrega assinaturas
    carregarAssinaturas() {
        const usuarios = this.authManager.listarTodosUsuarios();
        const contadores = {
            TESTE: 0,
            MENSAL: 0,
            SEMESTRAL: 0,
            ANUAL: 0
        };
        
        usuarios.forEach(usuario => {
            if (usuario.tipo !== 'ADMIN') {
                contadores[usuario.assinatura]++;
            }
        });
        
        document.getElementById('countTeste').textContent = contadores.TESTE;
        document.getElementById('countMensal').textContent = contadores.MENSAL;
        document.getElementById('countSemestral').textContent = contadores.SEMESTRAL;
        document.getElementById('countAnual').textContent = contadores.ANUAL;
        
        // Tabela de assinaturas
        const tbody = document.getElementById('tabelaAssinaturas');
        const assinaturas = usuarios.filter(u => u.tipo !== 'ADMIN');
        
        tbody.innerHTML = assinaturas.map(usuario => {
            const vencimento = this.calcularVencimento(usuario);
            const status = this.getStatusAssinatura(usuario);
            
            return `
                <tr class="hover:bg-gray-50">
                    <td class="py-4 px-6">
                        <div class="flex items-center space-x-3">
                            <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-user text-purple-600 text-sm"></i>
                            </div>
                            <div>
                                <p class="font-semibold text-gray-800">${usuario.nome}</p>
                                <p class="text-sm text-gray-600">${usuario.email}</p>
                            </div>
                        </div>
                    </td>
                    <td class="py-4 px-6">
                        <span class="px-2 py-1 rounded-full text-xs font-semibold ${this.getAssinaturaBadgeClass(usuario.assinatura)}">
                            ${this.getAssinaturaLabel(usuario.assinatura)}
                        </span>
                    </td>
                    <td class="py-4 px-6 text-gray-600 text-sm">${vencimento}</td>
                    <td class="py-4 px-6">
                        <span class="px-2 py-1 rounded-full text-xs font-semibold ${this.getStatusBadgeClass(status)}">
                            ${status}
                        </span>
                    </td>
                    <td class="py-4 px-6">
                        <div class="flex space-x-2">
                            <button onclick="adminManager.renovarAssinatura('${usuario.id}')" 
                                    class="text-green-600 hover:text-green-800" title="Renovar">
                                <i class="fas fa-sync"></i>
                            </button>
                            <button onclick="adminManager.alterarPlano('${usuario.id}')" 
                                    class="text-blue-600 hover:text-blue-800" title="Alterar Plano">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="adminManager.cancelarAssinatura('${usuario.id}')" 
                                    class="text-red-600 hover:text-red-800" title="Cancelar">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }
    
    // Carrega estatísticas detalhadas
    carregarEstatisticas() {
        this.criarGraficoEstrategias();
        this.criarGraficoUsoDia();
    }
    
    // Carrega configurações
    carregarConfiguracoes() {
        const config = this.authManager.obterConfiguracoes();
        
        if (config.precos) {
            document.getElementById('precoMensal').value = config.precos.mensal || 29.90;
            document.getElementById('precoSemestral').value = config.precos.semestral || 149.90;
            document.getElementById('precoAnual').value = config.precos.anual || 299.90;
        }
        
        if (config.limites) {
            document.getElementById('diasTeste').value = config.limites.diasTeste || 15;
            document.getElementById('limiteJogosTeste').value = config.limites.jogosTeste || 5;
            document.getElementById('limiteJogosPago').value = config.limites.jogosPago || 100;
        }
    }
    
    // Ações de usuário
    alterarAssinatura(userId) {
        // Implementar modal para alterar assinatura
        this.mostrarMensagem('Funcionalidade de alteração em desenvolvimento', 'info');
    }
    
    toggleUsuarioAtivo(userId) {
        const resultado = this.authManager.alterarStatusUsuario(userId);
        
        if (resultado.sucesso) {
            this.mostrarMensagem('Status do usuário alterado com sucesso', 'success');
            this.carregarUsuarios();
        } else {
            this.mostrarMensagem(resultado.erro || 'Erro ao alterar status', 'error');
        }
    }
    
    excluirUsuario(userId) {
        this.mostrarConfirmacao(
            'Excluir Usuário',
            'Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.',
            () => {
                const resultado = this.authManager.excluirUsuario(userId);
                
                if (resultado.sucesso) {
                    this.mostrarMensagem('Usuário excluído com sucesso', 'success');
                    this.carregarUsuarios();
                    this.carregarEstatisticasGerais();
                } else {
                    this.mostrarMensagem(resultado.erro || 'Erro ao excluir usuário', 'error');
                }
            }
        );
    }
    
    // Ações de assinatura
    renovarAssinatura(userId) {
        const resultado = this.authManager.renovarAssinatura(userId);
        
        if (resultado.sucesso) {
            this.mostrarMensagem('Assinatura renovada com sucesso', 'success');
            this.carregarAssinaturas();
        } else {
            this.mostrarMensagem(resultado.erro || 'Erro ao renovar assinatura', 'error');
        }
    }
    
    alterarPlano(userId) {
        this.mostrarMensagem('Funcionalidade de alteração de plano em desenvolvimento', 'info');
    }
    
    cancelarAssinatura(userId) {
        this.mostrarConfirmacao(
            'Cancelar Assinatura',
            'Tem certeza que deseja cancelar esta assinatura?',
            () => {
                const resultado = this.authManager.cancelarAssinatura(userId);
                
                if (resultado.sucesso) {
                    this.mostrarMensagem('Assinatura cancelada com sucesso', 'success');
                    this.carregarAssinaturas();
                } else {
                    this.mostrarMensagem(resultado.erro || 'Erro ao cancelar assinatura', 'error');
                }
            }
        );
    }
    
    // Salvar configurações
    salvarPrecos() {
        const precos = {
            mensal: parseFloat(document.getElementById('precoMensal').value),
            semestral: parseFloat(document.getElementById('precoSemestral').value),
            anual: parseFloat(document.getElementById('precoAnual').value)
        };
        
        const resultado = this.authManager.salvarConfiguracoes({ precos });
        
        if (resultado.sucesso) {
            this.mostrarMensagem('Preços salvos com sucesso', 'success');
        } else {
            this.mostrarMensagem('Erro ao salvar preços', 'error');
        }
    }
    
    salvarConfiguracoes() {
        const limites = {
            diasTeste: parseInt(document.getElementById('diasTeste').value),
            jogosTeste: parseInt(document.getElementById('limiteJogosTeste').value),
            jogosPago: parseInt(document.getElementById('limiteJogosPago').value)
        };
        
        const resultado = this.authManager.salvarConfiguracoes({ limites });
        
        if (resultado.sucesso) {
            this.mostrarMensagem('Configurações salvas com sucesso', 'success');
        } else {
            this.mostrarMensagem('Erro ao salvar configurações', 'error');
        }
    }
    
    // Filtros e busca
    filtrarUsuarios(termo) {
        const tbody = document.getElementById('tabelaUsuarios');
        const linhas = tbody.querySelectorAll('tr');
        
        linhas.forEach(linha => {
            const texto = linha.textContent.toLowerCase();
            if (texto.includes(termo.toLowerCase())) {
                linha.style.display = '';
            } else {
                linha.style.display = 'none';
            }
        });
    }
    
    // Exportar dados
    exportarUsuarios() {
        const usuarios = this.authManager.listarTodosUsuarios();
        const dados = usuarios.map(u => ({
            nome: u.nome,
            email: u.email,
            contato: u.contato,
            assinatura: this.getAssinaturaLabel(u.assinatura),
            status: u.ativo ? 'Ativo' : 'Inativo',
            cadastro: new Date(u.dataCriacao).toLocaleDateString('pt-BR')
        }));
        
        const csv = this.arrayParaCSV(dados);
        this.downloadCSV(csv, `usuarios_${new Date().toISOString().slice(0, 10)}.csv`);
        
        this.mostrarMensagem('Dados exportados com sucesso', 'success');
    }
    
    // Gráficos
    criarGraficoUsuariosPorPeriodo() {
        const ctx = document.getElementById('usuariosPorPeriodoChart').getContext('2d');
        
        if (this.charts.usuariosPeriodo) {
            this.charts.usuariosPeriodo.destroy();
        }
        
        this.charts.usuariosPeriodo = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Novos Usuários',
                    data: [12, 19, 8, 15, 22, 30],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    criarGraficoTiposAssinatura() {
        const ctx = document.getElementById('tiposAssinaturaChart').getContext('2d');
        
        if (this.charts.tiposAssinatura) {
            this.charts.tiposAssinatura.destroy();
        }
        
        const usuarios = this.authManager.listarTodosUsuarios();
        const contadores = { TESTE: 0, MENSAL: 0, SEMESTRAL: 0, ANUAL: 0 };
        
        usuarios.forEach(u => {
            if (u.tipo !== 'ADMIN') {
                contadores[u.assinatura]++;
            }
        });
        
        this.charts.tiposAssinatura = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Teste', 'Mensal', 'Semestral', 'Anual'],
                datasets: [{
                    data: [contadores.TESTE, contadores.MENSAL, contadores.SEMESTRAL, contadores.ANUAL],
                    backgroundColor: ['#fbbf24', '#3b82f6', '#10b981', '#8b5cf6']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
    
    criarGraficoEstrategias() {
        const ctx = document.getElementById('estrategiasChart').getContext('2d');
        
        if (this.charts.estrategias) {
            this.charts.estrategias.destroy();
        }
        
        this.charts.estrategias = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Fibonacci', 'Frequência', 'Pares/Ímpares', 'Sequencial', 'Posicional', 'Soma', 'Aleatória'],
                datasets: [{
                    label: 'Usos',
                    data: [45, 38, 52, 28, 35, 42, 60],
                    backgroundColor: '#667eea'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    criarGraficoUsoDia() {
        const ctx = document.getElementById('usoDiaChart').getContext('2d');
        
        if (this.charts.usoDia) {
            this.charts.usoDia.destroy();
        }
        
        this.charts.usoDia = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
                datasets: [{
                    label: 'Uso por Dia',
                    data: [20, 45, 55, 48, 52, 40, 25],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.2)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
    
    // Atividade recente
    carregarAtividadeRecente() {
        const feed = document.getElementById('activityFeed');
        const atividades = [
            { tipo: 'user', mensagem: 'Novo usuário cadastrado: João Silva', tempo: '5 min atrás' },
            { tipo: 'subscription', mensagem: 'Assinatura mensal renovada por Maria Santos', tempo: '12 min atrás' },
            { tipo: 'game', mensagem: '50 jogos gerados hoje', tempo: '1 hora atrás' },
            { tipo: 'system', mensagem: 'Sistema atualizado com sucesso', tempo: '2 horas atrás' }
        ];
        
        const icones = {
            user: 'fas fa-user-plus text-green-500',
            subscription: 'fas fa-credit-card text-blue-500',
            game: 'fas fa-dice text-purple-500',
            system: 'fas fa-cog text-gray-500'
        };
        
        feed.innerHTML = atividades.map(atividade => `
            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <i class="${icones[atividade.tipo]}"></i>
                <div class="flex-1">
                    <p class="text-sm text-gray-800">${atividade.mensagem}</p>
                    <p class="text-xs text-gray-500">${atividade.tempo}</p>
                </div>
            </div>
        `).join('');
    }
    
    // Utilitários
    getAssinaturaBadgeClass(tipo) {
        const classes = {
            TESTE: 'bg-yellow-100 text-yellow-800',
            MENSAL: 'bg-blue-100 text-blue-800',
            SEMESTRAL: 'bg-green-100 text-green-800',
            ANUAL: 'bg-purple-100 text-purple-800'
        };
        return classes[tipo] || 'bg-gray-100 text-gray-800';
    }
    
    getAssinaturaLabel(tipo) {
        const labels = {
            TESTE: 'Teste',
            MENSAL: 'Mensal',
            SEMESTRAL: 'Semestral', 
            ANUAL: 'Anual'
        };
        return labels[tipo] || 'N/A';
    }
    
    calcularVencimento(usuario) {
        if (!usuario.dataAssinatura) return 'N/A';
        
        const inicio = new Date(usuario.dataAssinatura);
        const dias = {
            TESTE: 15,
            MENSAL: 30,
            SEMESTRAL: 180,
            ANUAL: 365
        };
        
        const vencimento = new Date(inicio);
        vencimento.setDate(vencimento.getDate() + (dias[usuario.assinatura] || 15));
        
        return vencimento.toLocaleDateString('pt-BR');
    }
    
    getStatusAssinatura(usuario) {
        if (!usuario.dataAssinatura) return 'Pendente';
        
        const vencimento = new Date(usuario.dataAssinatura);
        const dias = {
            TESTE: 15,
            MENSAL: 30,
            SEMESTRAL: 180,
            ANUAL: 365
        };
        
        vencimento.setDate(vencimento.getDate() + (dias[usuario.assinatura] || 15));
        
        return vencimento > new Date() ? 'Ativo' : 'Vencido';
    }
    
    getStatusBadgeClass(status) {
        const classes = {
            'Ativo': 'bg-green-100 text-green-800',
            'Vencido': 'bg-red-100 text-red-800',
            'Pendente': 'bg-yellow-100 text-yellow-800'
        };
        return classes[status] || 'bg-gray-100 text-gray-800';
    }
    
    atualizarUltimoAcesso() {
        document.getElementById('ultimoAcesso').textContent = new Date().toLocaleString('pt-BR');
    }
    
    // CSV utilities
    arrayParaCSV(dados) {
        if (dados.length === 0) return '';
        
        const headers = Object.keys(dados[0]);
        const csvContent = [
            headers.join(','),
            ...dados.map(row => headers.map(header => `"${row[header]}"`).join(','))
        ].join('\n');
        
        return csvContent;
    }
    
    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Confirmações
    mostrarConfirmacao(titulo, mensagem, callback) {
        document.getElementById('tituloConfirmacao').textContent = titulo;
        document.getElementById('mensagemConfirmacao').textContent = mensagem;
        
        const modal = document.getElementById('modalConfirmacao');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        // Remove listeners anteriores
        const btnConfirmar = document.getElementById('confirmarAcao');
        const novoBtn = btnConfirmar.cloneNode(true);
        btnConfirmar.parentNode.replaceChild(novoBtn, btnConfirmar);
        
        // Adiciona novo listener
        novoBtn.addEventListener('click', () => {
            this.fecharModalConfirmacao();
            callback();
        });
    }
    
    fecharModalConfirmacao() {
        const modal = document.getElementById('modalConfirmacao');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
    
    // Logout
    logout() {
        this.mostrarConfirmacao(
            'Confirmar Logout',
            'Tem certeza que deseja sair do painel administrativo?',
            () => {
                this.authManager.logout();
                window.location.href = 'login.html';
            }
        );
    }
    
    // Mensagens
    mostrarMensagem(mensagem, tipo = 'info') {
        // Remove notificações existentes
        const existentes = document.querySelectorAll('.notification-toast');
        existentes.forEach(n => n.remove());
        
        const cores = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500',
            warning: 'bg-yellow-500'
        };
        
        const icones = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-triangle'
        };
        
        const toast = document.createElement('div');
        toast.className = `notification-toast fixed top-4 right-4 ${cores[tipo]} text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center space-x-3 transform translate-x-full transition-transform duration-300`;
        
        toast.innerHTML = `
            <i class="${icones[tipo]}"></i>
            <span>${mensagem}</span>
            <button class="ml-4 hover:bg-white hover:bg-opacity-20 rounded p-1">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);
        
        toast.querySelector('button').addEventListener('click', () => {
            toast.classList.add('translate-x-full');
            setTimeout(() => toast.remove(), 300);
        });
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.add('translate-x-full');
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }
}

// Inicializa quando DOM estiver pronto
let adminManager;
document.addEventListener('DOMContentLoaded', () => {
    adminManager = new AdminManager();
});