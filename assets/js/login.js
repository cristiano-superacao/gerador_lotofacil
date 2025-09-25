// JavaScript para página de login e registro
class LoginManager {
    constructor() {
        this.authManager = new AuthManager();
        this.initializeEventListeners();
        this.setupFormSwitching();
        this.setupPasswordToggles();
        this.setupPhoneMask();
        this.checkRedirect();
    }
    
    // Verifica se já está logado e redireciona se necessário
    checkRedirect() {
        const usuario = this.authManager.obterUsuarioLogado();
        if (usuario) {
            // Se já está logado, redireciona para a página apropriada
            if (usuario.tipo === 'ADMIN') {
                // Admin pode escolher entre admin panel ou sistema principal
                const escolha = confirm('Deseja acessar o painel administrativo?\n\nOK = Painel Admin\nCancelar = Sistema Principal');
                if (escolha) {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                window.location.href = 'index.html';
            }
        }
    }
    
    // Configura todos os event listeners
    initializeEventListeners() {
        // Botões principais
        document.getElementById('btnLogin').addEventListener('click', () => this.fazerLogin());
        document.getElementById('btnRegister').addEventListener('click', () => this.fazerRegistro());
        
        // Recuperação de senha
        document.getElementById('esqueceuSenha').addEventListener('click', () => this.abrirModalRecuperacao());
        document.getElementById('enviarCodigo').addEventListener('click', () => this.enviarCodigoRecuperacao());
        document.getElementById('redefinirSenha').addEventListener('click', () => this.redefinirSenha());
        document.getElementById('fecharModal').addEventListener('click', () => this.fecharModalRecuperacao());
        
        // Enter para submeter formulários
        document.getElementById('loginForm').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.fazerLogin();
        });
        
        document.getElementById('registerForm').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.fazerRegistro();
        });
        
        // Validação em tempo real
        document.getElementById('registerSenha').addEventListener('input', () => this.validarSenha());
        document.getElementById('registerConfirmarSenha').addEventListener('input', () => this.validarConfirmacaoSenha());
        document.getElementById('registerEmail').addEventListener('blur', () => this.validarEmail());
    }
    
    // Configura troca entre formulários
    setupFormSwitching() {
        const loginTab = document.getElementById('loginTab');
        const registerTab = document.getElementById('registerTab');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        loginTab.addEventListener('click', () => {
            loginTab.className = "flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-300 text-white bg-gradient-to-r from-purple-500 to-blue-500";
            registerTab.className = "flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-300 text-gray-600 hover:text-gray-800";
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
        });
        
        registerTab.addEventListener('click', () => {
            registerTab.className = "flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-300 text-white bg-gradient-to-r from-purple-500 to-blue-500";
            loginTab.className = "flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-300 text-gray-600 hover:text-gray-800";
            registerForm.classList.remove('hidden');
            loginForm.classList.add('hidden');
        });
    }
    
    // Configura botões de mostrar/ocultar senha
    setupPasswordToggles() {
        document.getElementById('toggleLoginSenha').addEventListener('click', () => {
            this.togglePassword('loginSenha', 'toggleLoginSenha');
        });
        
        document.getElementById('toggleRegisterSenha').addEventListener('click', () => {
            this.togglePassword('registerSenha', 'toggleRegisterSenha');
        });
    }
    
    // Alterna visibilidade da senha
    togglePassword(inputId, buttonId) {
        const input = document.getElementById(inputId);
        const button = document.getElementById(buttonId);
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }
    
    // Configura máscara para telefone
    setupPhoneMask() {
        const phoneInput = document.getElementById('registerContato');
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length >= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 6) {
                value = value.replace(/(\d{2})(\d{4})(\d*)/, '($1) $2-$3');
            } else if (value.length >= 2) {
                value = value.replace(/(\d{2})(\d*)/, '($1) $2');
            }
            
            e.target.value = value;
        });
    }
    
    // Faz login do usuário
    async fazerLogin() {
        const email = document.getElementById('loginEmail').value.trim();
        const senha = document.getElementById('loginSenha').value;
        const lembrar = document.getElementById('lembrarLogin').checked;
        
        if (!this.validarCamposLogin(email, senha)) {
            return;
        }
        
        this.mostrarCarregamento(true);
        
        try {
            const resultado = await this.authManager.login(email, senha, lembrar);
            
            if (resultado.sucesso) {
                // Configura dados de autenticação imediatamente
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('currentUser', JSON.stringify(resultado.usuario));
                
                this.mostrarMensagem('Login realizado com sucesso!', 'success');
                
                // Redireciona baseado no tipo de usuário
                setTimeout(() => {
                    if (resultado.usuario.perfil === 'admin' || resultado.usuario.tipo === 'ADMIN') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                }, 1000); // Reduzido de 1500 para 1000ms para acesso mais rápido
            } else {
                this.mostrarMensagem(resultado.erro || 'Email ou senha incorretos', 'error');
            }
        } catch (error) {
            this.mostrarMensagem('Erro ao fazer login. Tente novamente.', 'error');
            console.error('Erro no login:', error);
        } finally {
            this.mostrarCarregamento(false);
        }
    }
    
    // Faz registro do usuário
    async fazerRegistro() {
        const nome = document.getElementById('registerNome').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const contato = document.getElementById('registerContato').value.trim();
        const senha = document.getElementById('registerSenha').value;
        const confirmarSenha = document.getElementById('registerConfirmarSenha').value;
        const aceitarTermos = document.getElementById('aceitarTermos').checked;
        
        if (!this.validarCamposRegistro(nome, email, contato, senha, confirmarSenha, aceitarTermos)) {
            return;
        }
        
        this.mostrarCarregamento(true);
        
        try {
            const resultado = await this.authManager.registrarUsuario({
                nome,
                email,
                contato,
                senha
            });
            
            if (resultado.sucesso) {
                // Configura autenticação automática após registro
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('currentUser', JSON.stringify(resultado.usuario));
                
                this.mostrarMensagem('Conta criada com sucesso! Redirecionando...', 'success');
                
                // Redireciona automaticamente para o sistema
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
                
            } else {
                this.mostrarMensagem(resultado.erro || 'Erro ao criar conta', 'error');
            }
        } catch (error) {
            this.mostrarMensagem('Erro ao criar conta. Tente novamente.', 'error');
            console.error('Erro no registro:', error);
        } finally {
            this.mostrarCarregamento(false);
        }
    }
    
    // Validações
    validarCamposLogin(email, senha) {
        if (!email) {
            this.mostrarMensagem('Por favor, digite seu email', 'error');
            document.getElementById('loginEmail').focus();
            return false;
        }
        
        if (!senha) {
            this.mostrarMensagem('Por favor, digite sua senha', 'error');
            document.getElementById('loginSenha').focus();
            return false;
        }
        
        if (!this.validarFormatoEmail(email)) {
            this.mostrarMensagem('Por favor, digite um email válido', 'error');
            document.getElementById('loginEmail').focus();
            return false;
        }
        
        return true;
    }
    
    validarCamposRegistro(nome, email, contato, senha, confirmarSenha, aceitarTermos) {
        if (!nome) {
            this.mostrarMensagem('Por favor, digite seu nome completo', 'error');
            document.getElementById('registerNome').focus();
            return false;
        }
        
        if (nome.length < 3) {
            this.mostrarMensagem('Nome deve ter pelo menos 3 caracteres', 'error');
            document.getElementById('registerNome').focus();
            return false;
        }
        
        if (!email) {
            this.mostrarMensagem('Por favor, digite seu email', 'error');
            document.getElementById('registerEmail').focus();
            return false;
        }
        
        if (!this.validarFormatoEmail(email)) {
            this.mostrarMensagem('Por favor, digite um email válido', 'error');
            document.getElementById('registerEmail').focus();
            return false;
        }
        
        if (!contato) {
            this.mostrarMensagem('Por favor, digite seu contato', 'error');
            document.getElementById('registerContato').focus();
            return false;
        }
        
        if (!senha) {
            this.mostrarMensagem('Por favor, digite uma senha', 'error');
            document.getElementById('registerSenha').focus();
            return false;
        }
        
        if (senha.length < 6) {
            this.mostrarMensagem('Senha deve ter pelo menos 6 caracteres', 'error');
            document.getElementById('registerSenha').focus();
            return false;
        }
        
        if (senha !== confirmarSenha) {
            this.mostrarMensagem('Senhas não coincidem', 'error');
            document.getElementById('registerConfirmarSenha').focus();
            return false;
        }
        
        if (!aceitarTermos) {
            this.mostrarMensagem('É necessário aceitar os termos de uso', 'error');
            document.getElementById('aceitarTermos').focus();
            return false;
        }
        
        return true;
    }
    
    validarFormatoEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    validarSenha() {
        const senha = document.getElementById('registerSenha').value;
        const input = document.getElementById('registerSenha');
        
        if (senha.length >= 6) {
            input.classList.remove('border-red-300');
            input.classList.add('border-green-300');
        } else if (senha.length > 0) {
            input.classList.remove('border-green-300');
            input.classList.add('border-red-300');
        }
    }
    
    validarConfirmacaoSenha() {
        const senha = document.getElementById('registerSenha').value;
        const confirmacao = document.getElementById('registerConfirmarSenha').value;
        const input = document.getElementById('registerConfirmarSenha');
        
        if (confirmacao && senha === confirmacao) {
            input.classList.remove('border-red-300');
            input.classList.add('border-green-300');
        } else if (confirmacao.length > 0) {
            input.classList.remove('border-green-300');
            input.classList.add('border-red-300');
        }
    }
    
    validarEmail() {
        const email = document.getElementById('registerEmail').value;
        const input = document.getElementById('registerEmail');
        
        if (this.validarFormatoEmail(email)) {
            input.classList.remove('border-red-300');
            input.classList.add('border-green-300');
        } else if (email.length > 0) {
            input.classList.remove('border-green-300');
            input.classList.add('border-red-300');
        }
    }
    
    // Recuperação de senha
    abrirModalRecuperacao() {
        const modal = document.getElementById('modalRecuperacao');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.getElementById('emailRecuperacao').focus();
    }
    
    fecharModalRecuperacao() {
        const modal = document.getElementById('modalRecuperacao');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        
        // Reset das etapas
        document.getElementById('etapaEmail').classList.remove('hidden');
        document.getElementById('etapaCodigo').classList.add('hidden');
        document.getElementById('emailRecuperacao').value = '';
        document.getElementById('codigoRecuperacao').value = '';
        document.getElementById('novaSenha').value = '';
    }
    
    async enviarCodigoRecuperacao() {
        const email = document.getElementById('emailRecuperacao').value.trim();
        
        if (!email || !this.validarFormatoEmail(email)) {
            this.mostrarMensagem('Por favor, digite um email válido', 'error');
            return;
        }
        
        this.mostrarCarregamento(true);
        
        try {
            const resultado = await this.authManager.solicitarRecuperacaoSenha(email);
            
            if (resultado.sucesso) {
                this.mostrarMensagem('Código enviado com sucesso!', 'success');
                
                // Muda para a próxima etapa
                document.getElementById('etapaEmail').classList.add('hidden');
                document.getElementById('etapaCodigo').classList.remove('hidden');
                document.getElementById('codigoRecuperacao').focus();
                
            } else {
                this.mostrarMensagem(resultado.erro || 'Email não encontrado', 'error');
            }
        } catch (error) {
            this.mostrarMensagem('Erro interno do sistema', 'error');
            console.error('Erro na recuperação:', error);
        } finally {
            this.mostrarCarregamento(false);
        }
    }
    
    async redefinirSenha() {
        const codigo = document.getElementById('codigoRecuperacao').value.trim();
        const novaSenha = document.getElementById('novaSenha').value;
        const email = document.getElementById('emailRecuperacao').value;
        
        if (!codigo || codigo.length !== 8) {
            this.mostrarMensagem('Por favor, digite o código de 8 dígitos', 'error');
            document.getElementById('codigoRecuperacao').focus();
            return;
        }
        
        if (!novaSenha || novaSenha.length < 6) {
            this.mostrarMensagem('Nova senha deve ter pelo menos 6 caracteres', 'error');
            document.getElementById('novaSenha').focus();
            return;
        }
        
        this.mostrarCarregamento(true);
        
        try {
            const resultado = await this.authManager.redefinirSenha(email, codigo, novaSenha);
            
            if (resultado.sucesso) {
                this.mostrarMensagem('Senha alterada com sucesso!', 'success');
                this.fecharModalRecuperacao();
                
                // Preenche os campos de login
                document.getElementById('loginEmail').value = email;
                document.getElementById('loginSenha').focus();
                
            } else {
                this.mostrarMensagem(resultado.erro || 'Código inválido ou expirado', 'error');
            }
        } catch (error) {
            this.mostrarMensagem('Erro interno do sistema', 'error');
            console.error('Erro na redefinição:', error);
        } finally {
            this.mostrarCarregamento(false);
        }
    }
    
    // Utilitários
    limparFormulario(formId) {
        const form = document.getElementById(formId);
        const inputs = form.querySelectorAll('input');
        
        inputs.forEach(input => {
            if (input.type !== 'checkbox') {
                input.value = '';
                input.classList.remove('border-red-300', 'border-green-300');
            } else {
                input.checked = false;
            }
        });
    }
    
    mostrarCarregamento(mostrar) {
        const overlay = document.getElementById('loadingOverlay');
        if (mostrar) {
            overlay.classList.remove('hidden');
            overlay.classList.add('flex');
        } else {
            overlay.classList.add('hidden');
            overlay.classList.remove('flex');
        }
    }
    
    mostrarMensagem(mensagem, tipo = 'info') {
        // Remove notificações existentes
        const existentes = document.querySelectorAll('.notification-toast');
        existentes.forEach(n => n.remove());
        
        // Cores baseadas no tipo
        const cores = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500',
            warning: 'bg-yellow-500'
        };
        
        // Ícones baseados no tipo
        const icones = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-triangle'
        };
        
        // Cria a notificação
        const toast = document.createElement('div');
        toast.className = `notification-toast fixed top-4 right-4 ${cores[tipo]} text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center space-x-3 transform translate-x-full transition-transform duration-300`;
        
        toast.innerHTML = `
            <i class="${icones[tipo]}"></i>
            <span>${mensagem}</span>
            <button class="ml-4 hover:bg-white hover:bg-opacity-20 rounded p-1">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Adiciona ao DOM
        document.body.appendChild(toast);
        
        // Anima entrada
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);
        
        // Evento de fechar
        toast.querySelector('button').addEventListener('click', () => {
            toast.classList.add('translate-x-full');
            setTimeout(() => toast.remove(), 300);
        });
        
        // Remove automaticamente após 5 segundos
        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.add('translate-x-full');
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }
}

// Inicializa quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
});