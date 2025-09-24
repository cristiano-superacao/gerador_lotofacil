#!/bin/bash
# LotoFácil Estratégica - Script de Automação para Linux/Mac
# Este script facilita as operações comuns do projeto

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

show_menu() {
    clear
    echo -e "${BLUE}"
    echo "================================================"
    echo "   🎯 LOTOFÁCIL ESTRATÉGICA - AUTOMAÇÃO"
    echo "================================================"
    echo -e "${NC}"
    echo
    echo -e "${CYAN}   1.${NC} Iniciar servidor local (Node.js - Porta 3000)"
    echo -e "${CYAN}   2.${NC} Iniciar servidor local (Python - Porta 8000)"
    echo -e "${CYAN}   3.${NC} Validar arquivos do projeto"
    echo -e "${CYAN}   4.${NC} Gerar build de produção"
    echo -e "${CYAN}   5.${NC} Deploy para Netlify"
    echo -e "${CYAN}   6.${NC} Deploy para Vercel"
    echo -e "${CYAN}   7.${NC} Abrir no navegador"
    echo -e "${CYAN}   8.${NC} Instalar dependências"
    echo -e "${CYAN}   9.${NC} Limpar arquivos temporários"
    echo -e "${CYAN}   0.${NC} Sair"
    echo
    read -p "   Digite sua opção (0-9): " choice
    echo
}

start_nodejs() {
    echo -e "${BLUE}🚀 Iniciando servidor Node.js na porta 3000...${NC}"
    echo
    node server.js 3000
}

start_python() {
    echo -e "${BLUE}🚀 Iniciando servidor Python na porta 8000...${NC}"
    echo
    python3 server.py 8000 || python server.py 8000
}

validate_files() {
    echo -e "${BLUE}🔍 Validando arquivos do projeto...${NC}"
    echo
    
    if [ -f "index.html" ]; then
        echo -e "${GREEN}✅ index.html encontrado${NC}"
    else
        echo -e "${RED}❌ index.html NÃO encontrado${NC}"
    fi
    
    if [ -f "assets/js/app.js" ]; then
        echo -e "${GREEN}✅ app.js encontrado${NC}"
        if node -c assets/js/app.js 2>/dev/null; then
            echo -e "${GREEN}✅ JavaScript válido${NC}"
        else
            echo -e "${RED}❌ Erro de sintaxe no JavaScript${NC}"
        fi
    else
        echo -e "${RED}❌ app.js NÃO encontrado${NC}"
    fi
    
    if [ -f "assets/css/style.css" ]; then
        echo -e "${GREEN}✅ style.css encontrado${NC}"
    else
        echo -e "${RED}❌ style.css NÃO encontrado${NC}"
    fi
    
    echo
    echo -e "${GREEN}✅ Validação concluída!${NC}"
    read -p "Pressione Enter para continuar..."
}

build_project() {
    echo -e "${BLUE}🔨 Gerando build de produção...${NC}"
    echo
    echo -e "${GREEN}✅ Projeto estático - Build concluído!${NC}"
    echo "    Todos os arquivos estão prontos para deploy"
    echo
    read -p "Pressione Enter para continuar..."
}

deploy_netlify() {
    echo -e "${BLUE}🌐 Deploy para Netlify...${NC}"
    echo
    if [ -f "netlify.toml" ]; then
        netlify deploy --prod
    else
        echo -e "${RED}❌ Arquivo netlify.toml não encontrado${NC}"
    fi
    read -p "Pressione Enter para continuar..."
}

deploy_vercel() {
    echo -e "${BLUE}🌐 Deploy para Vercel...${NC}"
    echo
    if [ -f "vercel.json" ]; then
        vercel --prod
    else
        echo -e "${RED}❌ Arquivo vercel.json não encontrado${NC}"
    fi
    read -p "Pressione Enter para continuar..."
}

open_browser() {
    echo -e "${BLUE}🌐 Abrindo no navegador...${NC}"
    
    # Detectar SO e abrir navegador
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # Mac
        open http://localhost:3000
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        xdg-open http://localhost:3000
    else
        echo "Sistema não suportado para abertura automática"
        echo "Acesse manualmente: http://localhost:3000"
    fi
    
    echo
    echo "Se o servidor não estiver rodando, inicie-o primeiro!"
    read -p "Pressione Enter para continuar..."
}

install_deps() {
    echo -e "${BLUE}📦 Instalando dependências...${NC}"
    echo
    npm install
    echo
    echo -e "${GREEN}✅ Dependências instaladas!${NC}"
    read -p "Pressione Enter para continuar..."
}

clean_project() {
    echo -e "${BLUE}🧹 Limpando arquivos temporários...${NC}"
    echo
    rm -rf node_modules
    rm -f *.log *.tmp
    echo
    echo -e "${GREEN}✅ Limpeza concluída!${NC}"
    read -p "Pressione Enter para continuar..."
}

# Loop principal
while true; do
    show_menu
    
    case $choice in
        1)
            start_nodejs
            ;;
        2)
            start_python
            ;;
        3)
            validate_files
            ;;
        4)
            build_project
            ;;
        5)
            deploy_netlify
            ;;
        6)
            deploy_vercel
            ;;
        7)
            open_browser
            ;;
        8)
            install_deps
            ;;
        9)
            clean_project
            ;;
        0)
            clear
            echo -e "${GREEN}👋 Obrigado por usar o LotoFácil Estratégica!${NC}"
            echo
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Opção inválida! Pressione Enter para tentar novamente...${NC}"
            read
            ;;
    esac
done