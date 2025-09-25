// Sistema de Autenticação e Gerenciamento de Usuários
// LotoFácil Estratégica - Versão Profissional

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.users = new Map();
        this.adminEmail = 'admin@lotofacilestrategica.com';
        this.adminPassword = 'Admin@2024!';
        this.sessionTimeout = 24 * 60 * 60 * 1000; // 24 horas
        
        this.planos = {
            TESTE: {
                nome: 'Teste Gratuito',
                dias: 15,
                preco: 0,
                descricao: '15 dias grátis para testar todas as funcionalidades',
                cor: 'text-green-600',
                bgColor: 'bg-green-100'
            },
            MENSAL: {
                nome: 'Plano Mensal',
                dias: 30,
                preco: 19.90,
                descricao: 'Acesso completo por 30 dias',
                cor: 'text-blue-600',
                bgColor: 'bg-blue-100'
            },
            SEMESTRAL: {
                nome: 'Plano Semestral',
                dias: 180,
                preco: 89.90,
                descricao: '6 meses de acesso com 25% de desconto',
                cor: 'text-purple-600',
                bgColor: 'bg-purple-100',
                desconto: '25% OFF'
            },
            ANUAL: {
                nome: 'Plano Anual',
                dias: 365,
                preco: 149.90,
                descricao: '12 meses de acesso com 40% de desconto',
                cor: 'text-yellow-600',
                bgColor: 'bg-yellow-100',
                desconto: '40% OFF'
            }
        };
        
        this.init();
    }
    
    init() {
        this.loadUsersFromStorage();
        this.checkSession();
        this.createAdminUser();
        this.createCristianoAdmin();
    }
    
    // Criar usuário administrador padrão
    createAdminUser() {
        if (!this.users.has(this.adminEmail)) {
            const adminUser = {
                id: 'admin',
                nome: 'Administrador',
                email: this.adminEmail,
                contato: '(11) 99999-9999',
                senha: this.hashPassword(this.adminPassword),
                tipo: 'admin',
                perfil: 'admin',
                plano: 'UNLIMITED',
                assinatura: 'UNLIMITED',
                dataRegistro: new Date(),
                dataExpiracao: new Date(2099, 11, 31), // Never expires
                status: 'ativo',
                ultimoLogin: null,
                tentativasLogin: 0
            };
            
            this.users.set(this.adminEmail, adminUser);
            this.saveUsersToStorage();
        }
    }
    
    // Criar usuário administrador Cristiano
    createCristianoAdmin() {
        const cristianoEmail = 'cristiano@lotofacil.com';
        const cristianoPassword = 'Cristiano@2024!';
        
        if (!this.users.has(cristianoEmail)) {
            const cristianoUser = {
                id: 'cristiano_admin',
                nome: 'Cristiano',
                email: cristianoEmail,
                contato: '(11) 98765-4321',
                senha: this.hashPassword(cristianoPassword),
                tipo: 'admin',
                perfil: 'admin',
                plano: 'UNLIMITED',
                assinatura: 'UNLIMITED',
                dataRegistro: new Date(),
                dataExpiracao: new Date(2099, 11, 31), // Never expires
                status: 'ativo',
                ultimoLogin: null,
                tentativasLogin: 0
            };
            
            this.users.set(cristianoEmail, cristianoUser);
            this.saveUsersToStorage();
            console.log('✅ Usuário administrador Cristiano criado com sucesso!');
            console.log(`📧 Email: ${cristianoEmail}`);
            console.log(`🔐 Senha: ${cristianoPassword}`);
        }
    }
    
    // Registrar novo usuário
    async registrarUsuario(dadosUsuario) {
        try {
            const { nome, email, contato, senha } = dadosUsuario;
            
            // Validações
            if (!nome || !email || !contato || !senha) {
                return {
                    sucesso: false,
                    erro: 'Todos os campos são obrigatórios'
                };
            }
            
            if (!this.validarEmail(email)) {
                return {
                    sucesso: false,
                    erro: 'Email inválido'
                };
            }
            
            if (this.users.has(email.toLowerCase().trim())) {
                return {
                    sucesso: false,
                    erro: 'Email já cadastrado no sistema'
                };
            }
            
            if (senha.length < 6) {
                return {
                    sucesso: false,
                    erro: 'Senha deve ter pelo menos 6 caracteres'
                };
            }
            
            // Criar usuário com plano teste
            const novoUsuario = {
                id: this.generateUserId(),
                nome: nome.trim(),
                email: email.toLowerCase().trim(),
                contato: contato.trim(),
                senha: this.hashPassword(senha),
                tipo: 'usuario',
                perfil: 'user',
                plano: 'TESTE',
                assinatura: 'TESTE',
                dataRegistro: new Date(),
                dataExpiracao: new Date(Date.now() + (15 * 24 * 60 * 60 * 1000)), // 15 dias
                status: 'ativo',
                ultimoLogin: null,
                tentativasLogin: 0,
                jogosGerados: 0,
                limiteDiario: 50
            };
            
            this.users.set(novoUsuario.email, novoUsuario);
            this.saveUsersToStorage();
            
            return {
                sucesso: true,
                mensagem: 'Usuário registrado com sucesso! Você tem 15 dias de teste gratuito.',
                usuario: this.sanitizeUser(novoUsuario)
            };
        } catch (error) {
            console.error('Erro no registro:', error);
            return {
                sucesso: false,
                erro: 'Erro interno do sistema'
            };
        }
    }
    
    // Login de usuário
    async login(email, senha) {
        try {
            email = email.toLowerCase().trim();
            const usuario = this.users.get(email);
            
            if (!usuario) {
                return {
                    sucesso: false,
                    erro: 'Email não encontrado'
                };
            }
            
            if (usuario.status === 'bloqueado') {
                return {
                    sucesso: false,
                    erro: 'Usuário bloqueado. Contate o administrador.'
                };
            }
            
            if (usuario.tentativasLogin >= 5) {
                usuario.status = 'bloqueado';
                this.saveUsersToStorage();
                return {
                    sucesso: false,
                    erro: 'Muitas tentativas de login. Usuário bloqueado.'
                };
            }
            
            if (!this.verifyPassword(senha, usuario.senha)) {
                usuario.tentativasLogin++;
                this.saveUsersToStorage();
                return {
                    sucesso: false,
                    erro: 'Senha incorreta'
                };
            }
            
            // Verificar se a assinatura está ativa (exceto admin)
            if (usuario.tipo !== 'admin' && new Date() > new Date(usuario.dataExpiracao)) {
                return {
                    sucesso: false,
                    erro: 'Assinatura expirada. Renove seu plano para continuar.'
                };
            }
            
            // Login bem-sucedido
            usuario.ultimoLogin = new Date();
            usuario.tentativasLogin = 0;
            this.currentUser = usuario;
            
            // Criar sessão
            const sessionData = {
                userId: usuario.id,
                email: usuario.email,
                loginTime: new Date(),
                expiresAt: new Date(Date.now() + this.sessionTimeout)
            };
            
            localStorage.setItem('lotofacil_session', JSON.stringify(sessionData));
            this.saveUsersToStorage();
            
            return {
                sucesso: true,
                usuario: this.sanitizeUser(usuario),
                mensagem: `Bem-vindo, ${usuario.nome}!`
            };
        } catch (error) {
            console.error('Erro no login:', error);
            return {
                sucesso: false,
                erro: 'Erro interno do sistema'
            };
        }
    }
    
    // Logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem('lotofacil_session');
        return { sucesso: true, mensagem: 'Logout realizado com sucesso' };
    }
    
    // Verificar sessão ativa
    checkSession() {
        const sessionData = localStorage.getItem('lotofacil_session');
        
        if (!sessionData) return false;
        
        try {
            const session = JSON.parse(sessionData);
            const now = new Date();
            
            if (now > new Date(session.expiresAt)) {
                localStorage.removeItem('lotofacil_session');
                return false;
            }
            
            const usuario = this.users.get(session.email);
            if (usuario && usuario.status === 'ativo') {
                this.currentUser = usuario;
                return true;
            }
            
        } catch (error) {
            localStorage.removeItem('lotofacil_session');
        }
        
        return false;
    }
    
    // Atualizar plano do usuário (só admin)
    atualizarPlano(email, novoPlano, usuarioAdmin) {
        if (!usuarioAdmin || usuarioAdmin.tipo !== 'admin') {
            throw new Error('Acesso negado. Apenas administradores podem alterar planos.');
        }
        
        const usuario = this.users.get(email);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }
        
        if (!this.planos[novoPlano]) {
            throw new Error('Plano inválido');
        }
        
        const planoInfo = this.planos[novoPlano];
        usuario.plano = novoPlano;
        usuario.dataExpiracao = new Date(Date.now() + (planoInfo.dias * 24 * 60 * 60 * 1000));
        usuario.status = 'ativo';
        
        this.saveUsersToStorage();
        
        return {
            sucesso: true,
            mensagem: `Plano ${planoInfo.nome} ativado para ${usuario.nome}`,
            usuario: this.sanitizeUser(usuario)
        };
    }
    
    // Listar usuários (só admin)
    listarUsuarios(usuarioAdmin) {
        if (!usuarioAdmin || usuarioAdmin.tipo !== 'admin') {
            throw new Error('Acesso negado');
        }
        
        const usuarios = Array.from(this.users.values())
            .filter(u => u.tipo !== 'admin')
            .map(u => this.sanitizeUser(u));
            
        return usuarios;
    }
    
    // Bloquear/desbloquear usuário (só admin)
    alterarStatusUsuario(email, novoStatus, usuarioAdmin) {
        if (!usuarioAdmin || usuarioAdmin.tipo !== 'admin') {
            throw new Error('Acesso negado');
        }
        
        const usuario = this.users.get(email);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }
        
        usuario.status = novoStatus;
        this.saveUsersToStorage();
        
        return {
            sucesso: true,
            mensagem: `Usuário ${novoStatus === 'ativo' ? 'desbloqueado' : 'bloqueado'} com sucesso`
        };
    }
    
    // Verificar se usuário pode usar funcionalidade
    podeUsarFuncionalidade(funcionalidade) {
        if (!this.currentUser) return false;
        if (this.currentUser.tipo === 'admin') return true;
        
        // Verificar se assinatura está ativa
        if (new Date() > new Date(this.currentUser.dataExpiracao)) {
            return false;
        }
        
        // Verificar limite diário
        const hoje = new Date().toDateString();
        const jogosHoje = this.currentUser.jogosHoje || {};
        const jogosHojeCount = jogosHoje[hoje] || 0;
        
        if (funcionalidade === 'gerar_jogos' && jogosHojeCount >= this.currentUser.limiteDiario) {
            return false;
        }
        
        return true;
    }
    
    // Registrar uso de funcionalidade
    registrarUso(funcionalidade) {
        if (!this.currentUser || this.currentUser.tipo === 'admin') return;
        
        const hoje = new Date().toDateString();
        
        if (!this.currentUser.jogosHoje) {
            this.currentUser.jogosHoje = {};
        }
        
        this.currentUser.jogosHoje[hoje] = (this.currentUser.jogosHoje[hoje] || 0) + 1;
        this.currentUser.jogosGerados = (this.currentUser.jogosGerados || 0) + 1;
        
        this.saveUsersToStorage();
    }
    
    // Utilitários
    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    hashPassword(password) {
        // Em produção, usar uma biblioteca de hash mais segura
        return btoa(password + 'lotofacil_salt');
    }
    
    verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    }
    
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    sanitizeUser(usuario) {
        const { senha, ...userSafe } = usuario;
        return userSafe;
    }
    
    saveUsersToStorage() {
        const usersArray = Array.from(this.users.entries());
        localStorage.setItem('lotofacil_users', JSON.stringify(usersArray));
    }
    
    loadUsersFromStorage() {
        const userData = localStorage.getItem('lotofacil_users');
        if (userData) {
            try {
                const usersArray = JSON.parse(userData);
                this.users = new Map(usersArray);
            } catch (error) {
                console.error('Erro ao carregar usuários:', error);
                this.users = new Map();
            }
        }
    }
    
    // Estatísticas para o admin
    getEstatisticas() {
        if (!this.currentUser || this.currentUser.tipo !== 'admin') {
            throw new Error('Acesso negado');
        }
        
        const usuarios = Array.from(this.users.values()).filter(u => u.tipo !== 'admin');
        const agora = new Date();
        
        return {
            totalUsuarios: usuarios.length,
            usuariosAtivos: usuarios.filter(u => u.status === 'ativo').length,
            usuariosBloqueados: usuarios.filter(u => u.status === 'bloqueado').length,
            usuariosExpirados: usuarios.filter(u => new Date(u.dataExpiracao) < agora).length,
            planTeste: usuarios.filter(u => u.plano === 'TESTE').length,
            planMensal: usuarios.filter(u => u.plano === 'MENSAL').length,
            planSemestral: usuarios.filter(u => u.plano === 'SEMESTRAL').length,
            planAnual: usuarios.filter(u => u.plano === 'ANUAL').length,
            totalJogosGerados: usuarios.reduce((total, u) => total + (u.jogosGerados || 0), 0)
        };
    }
    
    // Recuperação de senha
    solicitarRecuperacaoSenha(email) {
        email = email.toLowerCase().trim();
        const usuario = this.users.get(email);
        
        if (!usuario) {
            throw new Error('Email não encontrado');
        }
        
        // Em produção, enviar email real
        // Por enquanto, gerar código temporário
        const codigoRecuperacao = Math.random().toString(36).substr(2, 8).toUpperCase();
        usuario.codigoRecuperacao = codigoRecuperacao;
        usuario.codigoExpiracao = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
        
        this.saveUsersToStorage();
        
        return {
            sucesso: true,
            mensagem: 'Código de recuperação gerado',
            codigo: codigoRecuperacao // Remover em produção
        };
    }
    
    redefinirSenha(email, codigo, novaSenha) {
        email = email.toLowerCase().trim();
        const usuario = this.users.get(email);
        
        if (!usuario || !usuario.codigoRecuperacao) {
            throw new Error('Código inválido');
        }
        
        if (new Date() > new Date(usuario.codigoExpiracao)) {
            throw new Error('Código expirado');
        }
        
        if (usuario.codigoRecuperacao !== codigo.toUpperCase()) {
            throw new Error('Código incorreto');
        }
        
        if (novaSenha.length < 6) {
            throw new Error('Nova senha deve ter pelo menos 6 caracteres');
        }
        
        usuario.senha = this.hashPassword(novaSenha);
        delete usuario.codigoRecuperacao;
        delete usuario.codigoExpiracao;
        usuario.tentativasLogin = 0;
        
        this.saveUsersToStorage();
        
        return {
            sucesso: true,
            mensagem: 'Senha redefinida com sucesso'
        };
    }
    
    // Registra jogo gerado pelo usuário
    registrarJogoGerado() {
        const usuario = this.obterUsuarioLogado();
        if (!usuario) return;
        
        if (!usuario.jogosGerados) {
            usuario.jogosGerados = [];
        }
        
        usuario.jogosGerados.push({
            data: new Date().toISOString(),
            timestamp: Date.now()
        });
        
        // Atualiza usuário no storage
        const usuarios = this.getStoredUsers();
        const index = usuarios.findIndex(u => u.id === usuario.id);
        if (index !== -1) {
            usuarios[index] = usuario;
            this.saveUsersToStorage(usuarios);
            
            // Atualiza sessão atual
            localStorage.setItem('usuario_logado', JSON.stringify(usuario));
        }
    }
    
    // Obter estatísticas do usuário
    obterEstatisticasUsuario(userId = null) {
        const usuario = userId ? 
            this.getStoredUsers().find(u => u.id === userId) : 
            this.obterUsuarioLogado();
            
        if (!usuario) return null;
        
        const hoje = new Date().toDateString();
        const jogosHoje = usuario.jogosGerados?.filter(j => 
            new Date(j.data).toDateString() === hoje
        ).length || 0;
        
        const totalJogos = usuario.jogosGerados?.length || 0;
        
        return {
            jogosHoje,
            totalJogos,
            plano: usuario.assinatura,
            membro_desde: usuario.dataCriacao
        };
    }
}

// Instância global do gerenciador de autenticação
const authManager = new AuthManager();