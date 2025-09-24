@echo off
:: LotoFácil Estratégica - Script de Automação para Windows
:: Este script facilita as operações comuns do projeto

title LotoFacil Estrategica - Automacao

:menu
cls
echo.
echo ================================================
echo   🎯 LOTOFACIL ESTRATEGICA - AUTOMACAO
echo ================================================
echo.
echo   1. Iniciar servidor local (Node.js - Porta 3000)
echo   2. Iniciar servidor local (Python - Porta 8000) 
echo   3. Validar arquivos do projeto
echo   4. Gerar build de producao
echo   5. Deploy para Netlify
echo   6. Deploy para Vercel  
echo   7. Abrir no navegador
echo   8. Instalar dependencias
echo   9. Limpar arquivos temporarios
echo   0. Sair
echo.
set /p choice="   Digite sua opcao (0-9): "

if "%choice%"=="1" goto nodejs
if "%choice%"=="2" goto python
if "%choice%"=="3" goto validate
if "%choice%"=="4" goto build
if "%choice%"=="5" goto netlify
if "%choice%"=="6" goto vercel
if "%choice%"=="7" goto browser
if "%choice%"=="8" goto install
if "%choice%"=="9" goto clean
if "%choice%"=="0" goto exit

echo.
echo   ❌ Opcao invalida! Pressione qualquer tecla...
pause >nul
goto menu

:nodejs
cls
echo.
echo 🚀 Iniciando servidor Node.js na porta 3000...
echo.
node server.js 3000
pause
goto menu

:python  
cls
echo.
echo 🚀 Iniciando servidor Python na porta 8000...
echo.
python server.py 8000
pause
goto menu

:validate
cls
echo.
echo 🔍 Validando arquivos do projeto...
echo.
if exist "index.html" (
    echo ✅ index.html encontrado
) else (
    echo ❌ index.html NAO encontrado
)

if exist "assets\js\app.js" (
    echo ✅ app.js encontrado
    node -c assets/js/app.js
    if errorlevel 1 (
        echo ❌ Erro de sintaxe no JavaScript
    ) else (
        echo ✅ JavaScript valido
    )
) else (
    echo ❌ app.js NAO encontrado
)

if exist "assets\css\style.css" (
    echo ✅ style.css encontrado
) else (
    echo ❌ style.css NAO encontrado
)

echo.
echo ✅ Validacao concluida!
pause
goto menu

:build
cls
echo.
echo 🔨 Gerando build de producao...
echo.
echo ✅ Projeto estatico - Build concluido!
echo    Todos os arquivos estao prontos para deploy
echo.
pause
goto menu

:netlify
cls
echo.
echo 🌐 Deploy para Netlify...
echo.
if exist "netlify.toml" (
    netlify deploy --prod
) else (
    echo ❌ Arquivo netlify.toml nao encontrado
)
pause
goto menu

:vercel
cls  
echo.
echo 🌐 Deploy para Vercel...
echo.
if exist "vercel.json" (
    vercel --prod
) else (
    echo ❌ Arquivo vercel.json nao encontrado
)
pause
goto menu

:browser
cls
echo.
echo 🌐 Abrindo no navegador...
start http://localhost:3000
echo.
echo Se o servidor nao estiver rodando, inicie-o primeiro!
pause
goto menu

:install
cls
echo.
echo 📦 Instalando dependencias...
echo.
npm install
echo.
echo ✅ Dependencias instaladas!
pause
goto menu

:clean
cls
echo.
echo 🧹 Limpando arquivos temporarios...
echo.
if exist "node_modules" rmdir /s /q node_modules
if exist "*.log" del *.log
if exist "*.tmp" del *.tmp
echo.
echo ✅ Limpeza concluida!
pause
goto menu

:exit
cls
echo.
echo 👋 Obrigado por usar o LotoFacil Estrategica!
echo.
exit