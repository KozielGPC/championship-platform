from fastapi import APIRouter

from api.schemas.users import Response

router = APIRouter(
    prefix="/users",
    tags=["users"],
    # dependencies=[Depends(get_token_header)],
    responses={404: {"description": "User Not Found"}},
)


@router.get(
    "/",
    response_model=Response,
    response_description="Sucesso de resposta da aplicação.",
    operation_id="ping",
)
async def ping():
    return {"pong": True, "version": "asdqwdqwd"}


# @router.get(
#     "/version",
#     response_description="String com a versão da aplicação",
#     operation_id="get_version",
# )
# async def get_version() -> str:
#     return settings.app_version
