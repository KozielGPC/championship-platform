# Championship Platform

A web platform to manage and participate of championships of online games, developed to the classes of Software Engineer and Integrative Project of the course of Computer Science at UTFPR - CM

### Team

|  RA   | Name |
| -------- | ------- |
| 2252813  |     Reginaldo Gregório de Souza Neto |
| 1817892 |     Márcio Gabriel Pereira de Campos |
| 2252805    |  Rafael Dalacqua dos Santos  |
|1903683  |  Caio Luiz dos Santos    |
| 2300532 |     João Mateus Munuera de Souza |


### Databse Model


![database](https://user-images.githubusercontent.com/37910437/225983763-b8349082-d4a1-4470-ad44-f203d1b87cfd.png)


## Features

- **FastAPI** with Python 3.8
- **React 16** with Typescript, Redux, and react-router
- Postgres
- SqlAlchemy with Alembic for migrations
- Pytest for backend tests
- Jest for frontend tests
- Perttier/Eslint (with Airbnb style guide)
- Docker compose for easier development
- Nginx as a reverse proxy to allow backend and frontend on the same port

## Development

The only dependencies for this project should be docker and docker-compose.

### Quick Start

Starting the project with hot-reloading enabled
(the first time it will take a while):

```bash
docker-compose up -d
```

To run the alembic migrations (for the users table):

```bash
docker-compose run --rm backend alembic upgrade head
```

And navigate to http://localhost:8000

Auto-generated docs will be at
http://localhost:8000/api/docs

### Rebuilding containers:

```
docker-compose build
```

### Restarting containers:

```
docker-compose restart
```

### Bringing containers down:

```
docker-compose down
```

### Run manually

If you wanna run each project individually, check [backend](https://github.com/KozielGPC/championship-platform/tree/main/backend/README.md) and [frontend](https://github.com/KozielGPC/championship-platform/tree/main/frontend/README.md)

### Front end Docker Tests

```
docker-compose run frontend test
```

This is the same as running npm test from within the frontend directory

## Logging

```
docker-compose logs
```

Or for a specific service:

```
docker-compose logs -f name_of_service # frontend|backend|db
```

## Project Layout

```
backend
└── app
    ├── alembic
    │   └── versions # where migrations are located
    ├── api
    │   └── api_v1
    │       └── endpoints
    ├── core    # config
    ├── db      # db models
    ├── tests   # pytest
    └── main.py # entrypoint to backend

frontend
└── public
└── src
    ├── components
    │   └── Home.tsx
    ├── config
    │   └── index.tsx   # constants
    ├── __tests__
    │   └── test_home.tsx
    ├── index.tsx   # entrypoint
    └── App.tsx     # handles routing
```


## Notes

_If you see an Nginx error at first with a `502: Bad Gateway` page, you may have to wait for webpack to build the development server (the nginx container builds much more quickly)._

_If you are using windows 10 and there is an error building frontend with docker like '$'\r': command not found', you may change in the Visual Studio Code the type of the line separator symbol from CRLF to LF. Press F1 and input "Change End of Line Sequence"_