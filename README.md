
### 🚀 Requisitos

- 🟢 **Node.js** (caso não tenha instalado, baixe em: [Node.js](https://nodejs.org/))

---

### 🔧 Backend

#### Passo 1: Instalar Dependências

1. **Clone o repositório**:
   ```
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
   cd server
   ```

2. **Instale as dependências**:
   ```
   npm install --save-dev
   ```

#### Passo 2: Configurar a YouTube API Key

1. **Obter a YouTube API Key**:
   - 🔗 Vá para o [Google Cloud Console](https://console.cloud.google.com/)
   - ➕ Crie um novo projeto (se ainda não tiver um)
   - 📚 Navegue até **API & Services > Library**
   - 🔍 Pesquise por \"YouTube Data API v3\" e ative-a
   - 🛠️ Vá para **API & Services > Credentials**
   - ➕ Clique em **Create Credentials** e selecione **API Key**
   - 📋 Copie a chave gerada

2. **Adicionar a YouTube API Key ao projeto**:
   - 📝 Crie um arquivo \`.env\` na raiz do projeto
   - ➕ Adicione a linha a seguir no arquivo \`.env\`:
     ```
     YOUTUBE_API_KEY=SUA_YOUTUBE_API_KEY
     ```
#### Passo 3: Executando o projeto
1. **Rodando o servidor**
  - Após realizar os passos anteriores, acesse a pasta **server** e abra em seu VSCODE
  - Execute o comando para rodar o servidor
```
   npm run dev
```

---

### 🌐 Web

#### Requisitos

- **Extensão Live Server no VSCode**: Para rodar o servidor local

#### Passo 1: Instalar a Extensão Live Server

1. **Abra o VSCode**.
2. **Vá para a aba de Extensões** (ou pressione \`Ctrl+Shift+X\`).
3. **Pesquise por \"Live Server\"**.
4. **Instale a extensão Live Server** desenvolvida por **Ritwick Dey**.

#### Passo 2: Rodar o Servidor Local

1.  **Abra a pasta **web** no VSCode**.
2. **Clique com o botão direito no arquivo \`index.html\`** (ou qualquer arquivo HTML principal).
3. **Selecione \"Open with Live Server\"**.

Agora, o navegador deve abrir automaticamente e carregar o projeto.

---

🎉 Pronto! Seu ambiente está configurado tanto para o backend quanto para a parte web. Se tiver qualquer problema, não hesite em consultar a documentação ou abrir uma issue no repositório."
