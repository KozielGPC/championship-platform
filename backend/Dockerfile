FROM python:3.10.2

WORKDIR /api

ADD . .
RUN pip install -r requirements.txt

EXPOSE 8080

COPY ./api /api

CMD ["python3", "main.py"]