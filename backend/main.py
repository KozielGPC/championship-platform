from fastapi import FastAPI, APIRouter

app = FastAPI()
router = APIRouter()


@router.get("/")
def first():
    return "hello world"


app.include_router(router=router, prefix="/first")
