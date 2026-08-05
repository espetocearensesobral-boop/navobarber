@echo off
title Git Auto Deploy
color 0A

echo ==========================================
echo         GIT AUTO DEPLOY
echo ==========================================
echo.

set /p msg=Mensagem do commit:

if "%msg%"=="" set msg=Atualização limpa do projeto

:: Inicializa o repositório se necessário
if not exist ".git" (
    echo [1/6] Inicializando repositório...
    git init
)

:: Configura identidade apenas neste projeto
git config user.name "Tauan Pires"
git config user.email "tauanpires7@gmail.com"

:: Garante a branch main
echo [2/6] Configurando branch...
git branch -M main

:: Configura o repositório remoto apenas se necessário
echo [3/6] Verificando repositório remoto...
git remote get-url origin >nul 2>nul
if errorlevel 1 (
    git remote add origin https://github.com/espetocearensesobral-boop/navobarber.git
)

:: Adiciona tudo (inclusive exclusões)
echo [4/6] Preparando arquivos...
git add -A

:: Só cria commit se houver alterações
echo [5/6] Criando commit...
git diff --cached --quiet
if errorlevel 1 (
    git commit -m "%msg%"
) else (
    echo Nenhuma alteração encontrada.
)

:: Sincroniza completamente com o GitHub
echo [6/6] Enviando para GitHub...
git push -u -f origin main

echo.
echo ==========================================
echo      DEPLOY FINALIZADO COM SUCESSO
echo ==========================================
pause