# Configuração do LotoFácil Estratégica

## 🎯 Sistema de Autenticação Implementado

✅ **Sistema Completo de Autenticação**

- Página de boas-vindas (`welcome.html`)
- Sistema de login e registro (`login.html`)
- Painel administrativo (`admin.html`)
- Controle de sessão e segurança
- Sistema de planos e assinaturas

## 📁 Estrutura de Arquivos Principais

```text
/
├── welcome.html          # Página inicial de boas-vindas
├── login.html           # Sistema de login/registro
├── index.html           # Aplicação principal (requer login)
├── admin.html           # Painel administrativo
├── assets/
│   ├── js/
│   │   ├── auth.js      # Gerenciador de autenticação
│   │   ├── login.js     # Lógica da página de login
│   │   ├── admin.js     # Painel administrativo
│   │   └── app.js       # Aplicação principal
│   └── css/
│       └── style.css    # Estilos customizados
├── server.js            # Servidor Node.js
├── server.py            # Servidor Python
├── run.bat             # Script Windows
└── run.sh              # Script Linux/Mac
```

## 🔐 Credenciais de Acesso

### Admin (Demonstração)

- **Email**: [admin@lotofacilestrategica.com](mailto:admin@lotofacilestrategica.com)
- **Senha**: Admin@2024!
- **Tipo**: Administrador (acesso total)

### Usuário Teste

- Criar nova conta através do registro
- **Benefícios**: 15 dias gratuitos
- **Limite**: 5 jogos por dia durante teste

## 🚀 Como Iniciar

1. **Clone o projeto**:

```bash
git clone https://github.com/cristiano-superacao/geradorlotofacil.git
cd geradorlotofacil
```

1. **Inicie o servidor**:

```bash
# Opção 1: Python (recomendado para teste)
python server.py

# Opção 2: Node.js
node server.js

# Opção 3: Script automático
# Windows: run.bat
# Linux/Mac: ./run.sh
```

1. **Acesse no navegador**:

- **Início**: [http://localhost:8000/welcome.html](http://localhost:8000/welcome.html)
- **Login**: [http://localhost:8000/login.html](http://localhost:8000/login.html)
- **Sistema**: [http://localhost:8000/index.html](http://localhost:8000/index.html) (após login)
- **Admin**: [http://localhost:8000/admin.html](http://localhost:8000/admin.html) (apenas admin)

## 🎯 Fluxo de Uso

1. **Primeira visita**: `welcome.html` → apresentação do sistema
2. **Login/Registro**: `login.html` → autenticação necessária
3. **Sistema principal**: `index.html` → geração de jogos (pós-login)
4. **Administração**: `admin.html` → gestão do sistema (apenas admin)

## 📱 Características do Sistema

### ✅ Autenticação

- [x] Sistema de login/registro completo
- [x] Recuperação de senha
- [x] Controle de sessão
- [x] Segurança com hash de senhas
- [x] Validações robustas

### ✅ Planos de Assinatura

- [x] Teste gratuito (15 dias, 5 jogos/dia)
- [x] Plano mensal (100 jogos/dia)
- [x] Plano semestral (100 jogos/dia)
- [x] Plano anual (100 jogos/dia)

### ✅ Painel Administrativo

- [x] Dashboard com estatísticas
- [x] Gestão de usuários
- [x] Controle de assinaturas
- [x] Configurações do sistema
- [x] Gráficos e relatórios

### ✅ Funcionalidades Principais

- [x] 7 estratégias matemáticas
- [x] Geração inteligente de jogos
- [x] Controle de limites por plano
- [x] Interface responsiva
- [x] Notificações visuais

## 🔧 Configurações Técnicas

### Armazenamento

- **LocalStorage**: Dados de usuários e sessões
- **Persistência**: Automática no navegador
- **Backup**: Funcionalidade de exportação

### Segurança

- **Hash de senhas**: Implementado
- **Controle de tentativas**: 3 tentativas de login
- **Sessões seguras**: Tokens únicos
- **Validações**: Client-side e proteções

### Performance

- **Carregamento otimizado**: Lazy loading
- **Responsividade**: Mobile-first
- **Cache**: Armazenamento local eficiente

## 📞 Suporte

Em caso de problemas:

1. Verifique se o servidor está rodando
2. Teste as credenciais de admin
3. Limpe o cache do navegador se necessário
4. Verifique o console para erros JavaScript

---

✨ **LotoFácil Estratégica v1.0** - Sistema completo de autenticação e geração inteligente de jogos!
