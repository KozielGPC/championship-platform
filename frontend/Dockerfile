# Utiliza uma imagem do Node.js como base
FROM node:14-alpine

# Cria uma pasta para a aplicação
WORKDIR /app

# Copia os arquivos de configuração do projeto para a pasta da aplicação
COPY package.json yarn.lock ./

# Instala as dependências do projeto
RUN yarn install

# Copia os arquivos da aplicação para a pasta da aplicação
COPY . .

# Compila a aplicação
RUN yarn build

# Expõe a porta 3000
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["yarn", "start"]
