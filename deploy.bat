@echo off
REM 🚀 Script de Deploy Automático Windows - LotoFácil Estratégica v2.1.0
REM Autor: Cristiano Superação
REM Data: %date%

setlocal enabledelayedexpansion

REM Configuração de cores (limitado no CMD)
set "HEADER================================="
set "SUCCESS=[✅]"
set "ERROR=[❌]"
set "WARNING=[⚠️ ]"
set "INFO=[📋]"

REM Header
echo %HEADER%
echo 🎯 LotoFácil Estratégica v2.1.0
echo 🚀 Deploy Automático Windows
echo %HEADER%
echo.

REM Verificar dependências
echo %INFO% Verificando dependências...

REM Git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo %ERROR% Git não encontrado. Instale o Git primeiro.
    pause
    exit /b 1
) else (
    echo %SUCCESS% Git encontrado
)

REM Node.js (opcional)
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo %SUCCESS% Node.js encontrado: !NODE_VERSION!
) else (
    echo %WARNING% Node.js não encontrado (opcional)
)

REM Python
python --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
    echo %SUCCESS% Python encontrado: !PYTHON_VERSION!
    set PYTHON_CMD=python
) else (
    python3 --version >nul 2>&1
    if %errorlevel% equ 0 (
        for /f "tokens=*" %%i in ('python3 --version') do set PYTHON_VERSION=%%i
        echo %SUCCESS% Python3 encontrado: !PYTHON_VERSION!
        set PYTHON_CMD=python3
    ) else (
        echo %ERROR% Python não encontrado. Instale Python primeiro.
        pause
        exit /b 1
    )
)

echo %SUCCESS% Todas as dependências verificadas!
echo.

REM Menu principal
:menu
echo 🎯 Escolha uma opção de deploy:
echo 1) 🧪 Executar apenas testes
echo 2) 🌐 Deploy para Netlify
echo 3) ⚡ Deploy para Vercel
echo 4) 🔄 Deploy para ambos (Netlify + Vercel)
echo 5) 🖥️  Servidor local (desenvolvimento)
echo 6) 🚀 Deploy completo (testes + deploy)
echo 0) ❌ Sair
echo.
set /p choice="Digite sua escolha (0-6): "

if "%choice%"=="1" goto run_tests
if "%choice%"=="2" goto deploy_netlify
if "%choice%"=="3" goto deploy_vercel
if "%choice%"=="4" goto deploy_both
if "%choice%"=="5" goto local_server
if "%choice%"=="6" goto full_deploy
if "%choice%"=="0" goto exit
echo %ERROR% Opção inválida. Tente novamente.
goto menu

REM Executar testes
:run_tests
echo %INFO% Executando testes automatizados...

REM Iniciar servidor temporário para testes
start /b %PYTHON_CMD% -m http.server 8082
timeout /t 3 /nobreak >nul

REM Verificar se o servidor está rodando
curl -s http://localhost:8082 >nul 2>&1
if %errorlevel% equ 0 (
    echo %SUCCESS% Servidor de teste iniciado na porta 8082
    
    echo %INFO% Testando endpoints principais...
    
    REM Teste da página principal
    curl -s -I http://localhost:8082/index.html | findstr "200 OK" >nul
    if %errorlevel% equ 0 (
        echo %SUCCESS% index.html carregando corretamente
    ) else (
        echo %ERROR% Problema com index.html
    )
    
    REM Teste do arquivo de testes
    curl -s -I http://localhost:8082/test-complete.html | findstr "200 OK" >nul
    if %errorlevel% equ 0 (
        echo %SUCCESS% test-complete.html carregando corretamente
    ) else (
        echo %ERROR% Problema com test-complete.html
    )
    
    REM Teste do service worker
    curl -s -I http://localhost:8082/sw.js | findstr "200 OK" >nul
    if %errorlevel% equ 0 (
        echo %SUCCESS% Service Worker disponível
    ) else (
        echo %WARNING% Service Worker pode ter problemas
    )
    
    REM Teste do manifest PWA
    curl -s -I http://localhost:8082/manifest.json | findstr "200 OK" >nul
    if %errorlevel% equ 0 (
        echo %SUCCESS% Manifest PWA disponível
    ) else (
        echo %WARNING% Manifest PWA pode ter problemas
    )
    
) else (
    echo %ERROR% Falha ao iniciar servidor de teste
)

REM Parar servidor
taskkill /f /im python.exe >nul 2>&1
taskkill /f /im python3.exe >nul 2>&1

echo %SUCCESS% Testes concluídos!
echo.
pause
goto menu

REM Preparar para deploy
:prepare_deploy
echo %INFO% Preparando arquivos para deploy...

REM Verificar se estamos em um repositório Git
if not exist ".git" (
    echo %WARNING% Não é um repositório Git. Inicializando...
    git init
    git add .
    git commit -m "🚀 Initial commit - LotoFácil Estratégica v2.1.0"
)

REM Verificar status do Git
git status --porcelain >nul 2>&1
if %errorlevel% equ 0 (
    echo %INFO% Commitando mudanças pendentes...
    git add .
    git commit -m "🚀 Deploy %date% %time% - Preparação automática"
    echo %SUCCESS% Mudanças commitadas!
) else (
    echo %SUCCESS% Repositório já está atualizado!
)

echo.
goto :eof

REM Deploy para Netlify
:deploy_netlify
call :prepare_deploy
echo %INFO% Deploy para Netlify...

netlify --version >nul 2>&1
if %errorlevel% equ 0 (
    echo %INFO% Netlify CLI encontrado. Fazendo deploy...
    
    REM Verificar se está logado
    netlify status >nul 2>&1
    if %errorlevel% neq 0 (
        echo %WARNING% É necessário fazer login no Netlify
        netlify login
    )
    
    REM Deploy
    netlify deploy --prod --dir .
    echo %SUCCESS% Deploy para Netlify concluído!
    
) else (
    echo %WARNING% Netlify CLI não encontrado.
    echo %INFO% Para instalar: npm install -g netlify-cli
    echo %INFO% Ou faça deploy manual conectando o repositório no Netlify
)

echo.
pause
goto menu

REM Deploy para Vercel
:deploy_vercel
call :prepare_deploy
echo %INFO% Deploy para Vercel...

vercel --version >nul 2>&1
if %errorlevel% equ 0 (
    echo %INFO% Vercel CLI encontrado. Fazendo deploy...
    
    REM Verificar se está logado
    vercel whoami >nul 2>&1
    if %errorlevel% neq 0 (
        echo %WARNING% É necessário fazer login no Vercel
        vercel login
    )
    
    REM Deploy
    vercel --prod --yes
    echo %SUCCESS% Deploy para Vercel concluído!
    
) else (
    echo %WARNING% Vercel CLI não encontrado.
    echo %INFO% Para instalar: npm install -g vercel
    echo %INFO% Ou faça deploy manual conectando o repositório no Vercel
)

echo.
pause
goto menu

REM Deploy para ambos
:deploy_both
call :prepare_deploy
echo %INFO% Deploy para Netlify e Vercel...

REM Netlify
netlify --version >nul 2>&1
if %errorlevel% equ 0 (
    netlify deploy --prod --dir .
    echo %SUCCESS% Deploy para Netlify concluído!
) else (
    echo %WARNING% Netlify CLI não encontrado.
)

REM Vercel
vercel --version >nul 2>&1
if %errorlevel% equ 0 (
    vercel --prod --yes
    echo %SUCCESS% Deploy para Vercel concluído!
) else (
    echo %WARNING% Vercel CLI não encontrado.
)

echo.
pause
goto menu

REM Servidor local
:local_server
echo %INFO% Iniciando servidor local...
echo.
echo 🌍 Servidores disponíveis:
echo 1) Python HTTP Server (porta 8080)
echo 2) Node.js Server (porta 3000) - se disponível
echo 3) 📋 Escolher porta manualmente
echo.
set /p server_choice="Escolha o servidor (1-3): "

if "%server_choice%"=="1" (
    echo %INFO% Iniciando Python HTTP Server na porta 8080...
    echo %SUCCESS% 🌍 Acesse: http://localhost:8080
    echo %SUCCESS% 🧪 Testes: http://localhost:8080/test-complete.html
    echo.
    echo Pressione Ctrl+C para parar o servidor
    %PYTHON_CMD% -m http.server 8080
) else if "%server_choice%"=="2" (
    if exist "server.js" (
        echo %INFO% Iniciando Node.js Server...
        echo %SUCCESS% 🌍 Acesse: http://localhost:3000
        node server.js
    ) else (
        echo %ERROR% server.js não encontrado
    )
) else if "%server_choice%"=="3" (
    set /p port="Digite a porta desejada: "
    echo %INFO% Iniciando servidor na porta !port!...
    echo %SUCCESS% 🌍 Acesse: http://localhost:!port!
    echo.
    echo Pressione Ctrl+C para parar o servidor
    %PYTHON_CMD% -m http.server !port!
) else (
    echo %ERROR% Opção inválida
)

echo.
pause
goto menu

REM Deploy completo
:full_deploy
echo %INFO% Iniciando deploy completo...

call :run_tests
call :prepare_deploy

echo %INFO% Escolha a plataforma de deploy:
echo 1) Netlify
echo 2) Vercel
echo 3) Ambos
set /p deploy_choice="Opção (1-3): "

if "%deploy_choice%"=="1" goto deploy_netlify
if "%deploy_choice%"=="2" goto deploy_vercel
if "%deploy_choice%"=="3" goto deploy_both
echo %ERROR% Opção inválida
pause
goto menu

REM Sair
:exit
echo %SUCCESS% 👋 Até logo!
pause
exit /b 0