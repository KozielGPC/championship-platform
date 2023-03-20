# Imagem base do Node.js para o frontend em React
FROM node:14-alpine as frontend

# Diretório de trabalho do frontend
WORKDIR /app/frontend

# Copia o package.json e o yarn.lock para o diretório de trabalho
COPY frontend/package.json frontend/yarn.lock ./

# Instala as dependências do frontend
RUN yarn install

# Copia todos os arquivos do frontend para o diretório de trabalho
COPY frontend/ .

# Constrói o frontend
RUN yarn build


# Imagem base do Python para o backend em Django
FROM python:3.9-slim-buster as backend

# Define as variáveis de ambiente para o Python
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Diretório de trabalho do backend
WORKDIR /app/backend

# Copia o arquivo requirements.txt para o diretório de trabalho
COPY backend/requirements.txt .

# Instala as dependências do backend
RUN pip install -r requirements.txt

# Copia todos os arquivos do backend para o diretório de trabalho
COPY backend/ .

# Executa as migrações do banco de dados
RUN python manage.py migrate


# Imagem base do PostgreSQL
FROM postgres:13-alpine

# Define as variáveis de ambiente para o PostgreSQL
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD postgres
ENV POSTGRES_DB mydatabase

# Copia o arquivo de inicialização do banco de dados para o diretório /docker-entrypoint-initdb.d/
COPY db/init.sql /docker-entrypoint-initdb.d/


# Imagem final com o frontend, o backend e o PostgreSQL
FROM python:3.9-slim-buster

# Copia os arquivos do frontend para o diretório de trabalho
COPY --from=frontend /app/frontend/build /app/frontend/build

# Copia os arquivos do backend para o diretório de trabalho
COPY --from=backend /app/backend /app/backend

# Copia os arquivos de inicialização do banco de dados para o diretório de trabalho
COPY --from=postgres /docker-entrypoint-initdb.d/ /docker-entrypoint-initdb.d/

# Define as variáveis de ambiente para o backend
ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE myproject.settings.production

# Expõe a porta do servidor do backend
EXPOSE 8000

# Inicia o servidor do backend e o PostgreSQL
CMD ["./entrypoint.sh"]
