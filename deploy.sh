#!/bin/bash

# 🚀 Script de Deploy Automático - LotoFácil Estratégica v2.1.0
# Autor: Cristiano Superação
# Data: $(date)

set -e  # Parar execução em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Funções utilitárias
print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}🎯 LotoFácil Estratégica v2.1.0${NC}"
    echo -e "${PURPLE}🚀 Deploy Automático${NC}"
    echo -e "${PURPLE}================================${NC}"
    echo ""
}

print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar dependências
check_dependencies() {
    print_step "Verificando dependências..."
    
    # Git
    if ! command -v git &> /dev/null; then
        print_error "Git não encontrado. Instale o Git primeiro."
        exit 1
    fi
    
    # Node.js (opcional)
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js encontrado: $NODE_VERSION"
    else
        print_warning "Node.js não encontrado (opcional)"
    fi
    
    # Python
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 --version)
        print_success "Python encontrado: $PYTHON_VERSION"
    elif command -v python &> /dev/null; then
        PYTHON_VERSION=$(python --version)
        print_success "Python encontrado: $PYTHON_VERSION"
    else
        print_error "Python não encontrado. Instale Python primeiro."
        exit 1
    fi
    
    print_success "Todas as dependências verificadas!"
    echo ""
}

# Executar testes
run_tests() {
    print_step "Executando testes automatizados..."
    
    # Iniciar servidor temporário para testes
    if command -v python3 &> /dev/null; then
        python3 -m http.server 8082 --directory . &
        SERVER_PID=$!
    else
        python -m http.server 8082 &
        SERVER_PID=$!
    fi
    
    sleep 3  # Aguardar servidor iniciar
    
    # Verificar se o servidor está rodando
    if curl -s http://localhost:8082 > /dev/null; then
        print_success "Servidor de teste iniciado na porta 8082"
        
        # Aqui você pode adicionar testes automatizados usando curl ou outras ferramentas
        print_step "Testando endpoints principais..."
        
        # Teste da página principal
        if curl -s -I http://localhost:8082/index.html | grep -q "200 OK"; then
            print_success "✅ index.html carregando corretamente"
        else
            print_error "❌ Problema com index.html"
        fi
        
        # Teste do arquivo de testes
        if curl -s -I http://localhost:8082/test-complete.html | grep -q "200 OK"; then
            print_success "✅ test-complete.html carregando corretamente"
        else
            print_error "❌ Problema com test-complete.html"
        fi
        
        # Teste do service worker
        if curl -s -I http://localhost:8082/sw.js | grep -q "200 OK"; then
            print_success "✅ Service Worker disponível"
        else
            print_warning "⚠️  Service Worker pode ter problemas"
        fi
        
        # Teste do manifest PWA
        if curl -s -I http://localhost:8082/manifest.json | grep -q "200 OK"; then
            print_success "✅ Manifest PWA disponível"
        else
            print_warning "⚠️  Manifest PWA pode ter problemas"
        fi
        
    else
        print_error "Falha ao iniciar servidor de teste"
    fi
    
    # Parar servidor
    kill $SERVER_PID 2>/dev/null || true
    sleep 1
    
    print_success "Testes concluídos!"
    echo ""
}

# Preparar para deploy
prepare_deploy() {
    print_step "Preparando arquivos para deploy..."
    
    # Verificar se estamos em um repositório Git
    if [ ! -d ".git" ]; then
        print_warning "Não é um repositório Git. Inicializando..."
        git init
        git add .
        git commit -m "🚀 Initial commit - LotoFácil Estratégica v2.1.0"
    fi
    
    # Verificar status do Git
    if [[ -n $(git status --porcelain) ]]; then
        print_step "Commitando mudanças pendentes..."
        git add .
        git commit -m "🚀 Deploy $(date '+%Y-%m-%d %H:%M:%S') - Preparação automática"
        print_success "Mudanças commitadas!"
    else
        print_success "Repositório já está atualizado!"
    fi
    
    echo ""
}

# Deploy para Netlify
deploy_netlify() {
    print_step "Deploy para Netlify..."
    
    if command -v netlify &> /dev/null; then
        print_step "Netlify CLI encontrado. Fazendo deploy..."
        
        # Login (se necessário)
        if ! netlify status &> /dev/null; then
            print_warning "É necessário fazer login no Netlify"
            netlify login
        fi
        
        # Deploy
        netlify deploy --prod --dir .
        print_success "Deploy para Netlify concluído!"
        
        # Obter URL
        NETLIFY_URL=$(netlify status --json | grep -o '"site_url":"[^"]*"' | cut -d'"' -f4)
        if [ ! -z "$NETLIFY_URL" ]; then
            print_success "🌍 Site disponível em: $NETLIFY_URL"
        fi
        
    else
        print_warning "Netlify CLI não encontrado."
        print_step "Para instalar: npm install -g netlify-cli"
        print_step "Ou faça deploy manual conectando o repositório no Netlify"
    fi
    
    echo ""
}

# Deploy para Vercel
deploy_vercel() {
    print_step "Deploy para Vercel..."
    
    if command -v vercel &> /dev/null; then
        print_step "Vercel CLI encontrado. Fazendo deploy..."
        
        # Login (se necessário)
        if ! vercel whoami &> /dev/null; then
            print_warning "É necessário fazer login no Vercel"
            vercel login
        fi
        
        # Deploy
        vercel --prod --yes
        print_success "Deploy para Vercel concluído!"
        
    else
        print_warning "Vercel CLI não encontrado."
        print_step "Para instalar: npm install -g vercel"
        print_step "Ou faça deploy manual conectando o repositório no Vercel"
    fi
    
    echo ""
}

# Menu principal
show_menu() {
    echo -e "${YELLOW}Escolha uma opção de deploy:${NC}"
    echo "1) 🧪 Executar apenas testes"
    echo "2) 🌐 Deploy para Netlify"
    echo "3) ⚡ Deploy para Vercel"
    echo "4) 🔄 Deploy para ambos (Netlify + Vercel)"
    echo "5) 🖥️  Servidor local (desenvolvimento)"
    echo "6) 🚀 Deploy completo (testes + deploy)"
    echo "0) ❌ Sair"
    echo ""
    read -p "Digite sua escolha (0-6): " choice
}

# Servidor local
start_local_server() {
    print_step "Iniciando servidor local..."
    
    # Mostrar opções disponíveis
    echo -e "${YELLOW}Servidores disponíveis:${NC}"
    
    if command -v python3 &> /dev/null; then
        echo "1) Python 3 (porta 8080)"
    fi
    
    if command -v python &> /dev/null; then
        echo "2) Python 2 (porta 8080)"
    fi
    
    if command -v node &> /dev/null; then
        echo "3) Node.js (porta 3000)"
    fi
    
    echo "4) 📋 Escolher porta manualmente"
    echo ""
    read -p "Escolha o servidor (1-4): " server_choice
    
    case $server_choice in
        1)
            print_step "Iniciando Python 3 HTTP Server na porta 8080..."
            print_success "🌍 Acesse: http://localhost:8080"
            print_success "🧪 Testes: http://localhost:8080/test-complete.html"
            python3 -m http.server 8080
            ;;
        2)
            print_step "Iniciando Python 2 HTTP Server na porta 8080..."
            print_success "🌍 Acesse: http://localhost:8080"
            print_success "🧪 Testes: http://localhost:8080/test-complete.html"
            python -m SimpleHTTPServer 8080
            ;;
        3)
            if [ -f "server.js" ]; then
                print_step "Iniciando Node.js Server..."
                print_success "🌍 Acesse: http://localhost:3000"
                node server.js
            else
                print_error "server.js não encontrado"
            fi
            ;;
        4)
            read -p "Digite a porta desejada: " port
            print_step "Iniciando servidor na porta $port..."
            if command -v python3 &> /dev/null; then
                python3 -m http.server $port
            else
                python -m SimpleHTTPServer $port
            fi
            ;;
        *)
            print_error "Opção inválida"
            ;;
    esac
}

# Deploy completo
full_deploy() {
    print_step "Iniciando deploy completo..."
    
    check_dependencies
    run_tests
    prepare_deploy
    
    print_step "Escolha a plataforma de deploy:"
    echo "1) Netlify"
    echo "2) Vercel"
    echo "3) Ambos"
    read -p "Opção (1-3): " deploy_choice
    
    case $deploy_choice in
        1)
            deploy_netlify
            ;;
        2)
            deploy_vercel
            ;;
        3)
            deploy_netlify
            deploy_vercel
            ;;
        *)
            print_error "Opção inválida"
            ;;
    esac
    
    print_success "🎉 Deploy completo finalizado!"
}

# Script principal
main() {
    print_header
    check_dependencies
    
    while true; do
        show_menu
        
        case $choice in
            1)
                run_tests
                ;;
            2)
                prepare_deploy
                deploy_netlify
                ;;
            3)
                prepare_deploy
                deploy_vercel
                ;;
            4)
                prepare_deploy
                deploy_netlify
                deploy_vercel
                ;;
            5)
                start_local_server
                ;;
            6)
                full_deploy
                ;;
            0)
                print_success "👋 Até logo!"
                exit 0
                ;;
            *)
                print_error "Opção inválida. Tente novamente."
                ;;
        esac
        
        echo ""
        read -p "Pressione Enter para continuar..."
        clear
        print_header
    done
}

# Verificar se script está sendo executado diretamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi