## Para rodar o projeto
- Na pasta `./backend`, crie um ambiente virtual usando `python -m venv venv`
- Ative o ambiente virtual com `.\venv\Scripts\activate` se você está usando Windows, caso use Linux digite `source /venv/bin/activate`
- Instale os pacotes com `pip install -r requirements.txt`
- Rode `uvicorn main:app --reload`

## Migrações
### Atualizar banco de dados
Para atualizar o banco para as migrações mais recentes, execute `alembic upgrade head`

### Novas migrações
Para criar novas migrações, execute `alembic revision -m ""`, onde dentro das aspas irá o nome da migração.
Esse comando fará com que um arquivo `.py` seja gerado na pasta `migrations`. Edite-o para que a migração sejá construída.
Lembre-se que para cada coisa nova adicionada na sessão `def upgrade()`, deve ser adicionado um para remoção na sessão `def downgrade()`