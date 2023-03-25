### Run Backend Project

Alternatively to running inside docker, you can run it manually using

```
python3 -m venv venv
.\venv\Scripts\activate if you are on Windows or source .\venv\bin/activate if using
pip install -r requirements.txt
uvicorn run:app --reload
```

This should redirect you to http://localhost:3000

## Migrations

Migrations are run using alembic. To run all migrations:

```
docker-compose run --rm backend alembic upgrade head
```

To create a new migration:

```
alembic revision -m "create users table"
```

And fill in `upgrade` and `downgrade` methods. For more information see
[Alembic's official documentation](https://alembic.sqlalchemy.org/en/latest/tutorial.html#create-a-migration-script).

## Testing

There is a helper script for both frontend and backend tests:

```
./scripts/test.sh
```

### Backend Tests

```
docker-compose run backend pytest
```

any arguments to pytest can also be passed after this command