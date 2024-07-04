
# Serviço de Autenticação de Usuários

Este projeto implementa um serviço de autenticação de usuários usando Node.js, Express e MongoDB, seguindo o padrão MVC (Model-View-Controller).

## Índice

- [Visão Geral](#visão-geral)
- [Recursos](#recursos)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação](#instalação)
- [Uso](#uso)
- [Controladores](#controladores)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Licença](#licença)

## Visão Geral

Esta aplicação fornece funcionalidades básicas de autenticação de usuários, incluindo registro e login de usuários, protegidos com JSON Web Tokens (JWT). O projeto segue o padrão MVC para organizar o código de forma eficiente e promover a escalabilidade.

## Recursos

- Registro de usuários com hash de senha
- Login de usuários com geração de token JWT
- Armazenamento seguro de senhas usando bcrypt
- Configuração baseada em ambiente

## Tecnologias Utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- bcryptjs
- jsonwebtoken
- dotenv

## Instalação

1. **Clone o repositório:**

   ```sh
   git clone https://github.com/your-username/user-auth.git
   cd user-auth
   ```

2. **Instale as dependências:**

   ```sh
   npm install
   ```

4. **Inicie o servidor:**

   ```sh
   node server.js
   ```

## Uso

### Registro

- **Endpoint:** `/api/auth/register`
- **Método:** `POST`
- **Corpo da Requisição:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Login

- **Endpoint:** `/api/auth/login`
- **Método:** `POST`
- **Corpo da Requisição:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

## Controladores

Os controladores lidam com a lógica central da aplicação. Os principais controladores utilizados são:

### authController.js

- **register:** Lida com o registro de usuários. Verifica se o usuário já existe, faz o hash da senha, salva o novo usuário no banco de dados e gera um token JWT.

  ```js
  exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }
      user = new User({ name, email, password });
      await user.save();
      const payload = { user: { id: user.id } };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  ```

- **login:** Lida com o login de usuários. Verifica se o usuário existe, verifica a senha e gera um token JWT.

  ```js
  exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const payload = { user: { id: user.id } };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  ```

## Variáveis de Ambiente

A aplicação utiliza variáveis de ambiente para gerenciar dados sensíveis. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

- `MONGO_URI`: A string de conexão do MongoDB.
- `JWT_SECRET`: A chave secreta usada para assinar os tokens JWT.

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.