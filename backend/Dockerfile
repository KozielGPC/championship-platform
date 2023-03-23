# Use a imagem do Python como base
FROM python:3.9-slim

# Define o diretório de trabalho da aplicação
WORKDIR /app

# Copie os arquivos necessários para a imagem
COPY requirements.txt .
COPY main.py .

# Instale as dependências
RUN pip install --no-cache-dir -r requirements.txt

# Exponha a porta em que a API será executada
EXPOSE 8000

# Inicie a aplicação quando o contêiner for iniciado
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
