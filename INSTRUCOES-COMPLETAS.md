# 🎯 LotoFácil Estratégica - Instruções de Uso

## 🚀 **CONFIGURAÇÃO COMPLETA REALIZADA!**

Seu projeto está 100% configurado para rodar tanto **localmente** quanto na **web**. Aqui está tudo o que você precisa saber:

---

## 📋 **Status do Projeto**

✅ **Estrutura Organizada**: Pastas CSS, JS e imagens separadas  
✅ **Servidores Locais**: Node.js e Python configurados  
✅ **Scripts de Automação**: Windows (.bat) e Linux/Mac (.sh)  
✅ **Hospedagem Web**: Netlify, Vercel e GitHub Pages prontos  
✅ **Dependências**: package.json com scripts npm  
✅ **Validação**: Testes de sintaxe implementados  

---

## 🖥️ **Como Rodar Localmente**

### **Opção 1: Scripts Automáticos (Mais Fácil)**

**Windows:**
```bash
# Execute e escolha a opção desejada
run.bat
```

**Linux/Mac:**
```bash
# Torne executável e execute
chmod +x run.sh
./run.sh
```

### **Opção 2: Comandos Diretos**

```bash
# Servidor Node.js (Porta 3000)
node server.js 3000

# Servidor Python (Porta 8000) 
python server.py 8000

# Usando NPM
npm start        # Node.js na porta 3000
npm run serve    # Python na porta 8000
```

### **Opção 3: Método Mais Simples**
- Abra `index.html` diretamente no navegador
- Funciona offline, mas pode ter limitações

---

## 🌐 **Como Hospedar na Web**

### **GitHub Pages** ⭐ (Recomendado - Gratuito)
```bash
# 1. Upload para GitHub
git add .
git commit -m "Deploy LotoFácil Estratégica"  
git push origin main

# 2. Ative GitHub Pages
# Settings > Pages > Source: Deploy from branch > main
# URL: https://seu-usuario.github.io/lotofacil-estrategica/
```

### **Netlify** (Drag & Drop - Mais Fácil)
1. Acesse [netlify.com](https://netlify.com)
2. Arraste a pasta do projeto para a área de deploy
3. Pronto! Seu site está online

### **Vercel** (Deploy Profissional)
```bash
# Instalar CLI
npm install -g vercel

# Deploy
vercel --prod
```

---

## 🧰 **Scripts e Comandos Úteis**

```bash
# Validar arquivos
npm run validate

# Gerar build
npm run build  

# Deploy Netlify
npm run deploy:netlify

# Deploy Vercel  
npm run deploy:vercel

# Criar ZIP do projeto
npm run zip
```

---

## 📁 **Estrutura Final do Projeto**

```
lotofacil-estrategica/
├── 📄 index.html                 # Página principal
├── 📁 assets/
│   ├── 📁 css/style.css         # Estilos customizados
│   ├── 📁 js/app.js             # Lógica JavaScript
│   └── 📁 images/icon-192.svg   # Ícone do projeto
├── 🔧 Hospedagem:
│   ├── netlify.toml             # Config Netlify  
│   ├── vercel.json              # Config Vercel
│   └── .github/workflows/       # GitHub Actions
├── 🖥️ Local:
│   ├── server.js & server.py    # Servidores
│   ├── run.bat & run.sh         # Scripts automação
│   └── package.json             # Dependências NPM
└── 📖 Documentação completa
```

---

## 🎯 **Como Usar o Site**

### 1. **Inserir Último Resultado** (Opcional)
- Concurso: número do sorteio
- Data: data do sorteio  
- Dezenas: 15 números separados por vírgula
- Exemplo: `01,02,03,04,05,06,07,08,09,10,11,12,13,14,15`

### 2. **Escolher Estratégia** 
- **7 estratégias disponíveis**:
  - Poder das Repetidas
  - Equilíbrio Par/Ímpar  
  - Números Atrasados
  - Sequências Inteligentes
  - Divisão por Colunas
  - Frequência Histórica
  - Matemática dos Finais

### 3. **Gerar e Usar Jogos**
- Clique em "Gerar 7 Jogos"
- Aguarde processamento (1-2 segundos)
- **Copiar**: Individual ou todos juntos
- **Exportar**: Download CSV para outros sistemas
- **Regenerar**: Novos jogos com mesma estratégia

---

## 🛠️ **Resolução de Problemas**

### **Site não carrega:**
- ✅ Certifique-se de que o servidor está rodando
- ✅ Teste outro navegador
- ✅ Verifique se a porta não está ocupada

### **JavaScript não funciona:**
- ✅ Use servidor local (não abra arquivo direto)
- ✅ Verifique console do navegador (F12)
- ✅ Teste com `npm run validate`

### **Deploy não funciona:**
- ✅ Confirme que todos os arquivos estão no repositório
- ✅ Verifique se index.html está na raiz
- ✅ Use os arquivos de configuração prontos

---

## 📞 **Suporte e Próximos Passos**

### **Para Ajuda:**
1. 📖 Leia `README.md` (documentação completa)
2. ⚡ Use `INICIO-RAPIDO.md` (instruções mínimas)
3. 🤖 Execute scripts automáticos (`run.bat` / `run.sh`)
4. 🧪 Teste localmente antes de fazer deploy

### **Melhorias Futuras:**
- 🔗 API da Caixa para resultados automáticos
- 📊 Gráficos estatísticos interativos  
- 🎯 Personalização de estratégias
- 👤 Sistema de login e favoritos

---

## 🎉 **Projeto Finalizado!**

**Seu LotoFácil Estratégica está 100% funcional!**

- ✅ Roda localmente em qualquer sistema
- ✅ Deploy automático para web
- ✅ Interface responsiva e moderna
- ✅ 7 estratégias implementadas
- ✅ Exportação e validação completa

**🚀 Comece agora:** Execute `run.bat` (Windows) ou `./run.sh` (Linux/Mac) e escolha a opção 1!