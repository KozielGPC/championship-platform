"""add teams table

Revision ID: d40c92d9fdac
Revises: dc174979d7a3
Create Date: 2023-04-18 22:33:38.309900

"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime


# revision identifiers, used by Alembic.
revision = "d40c92d9fdac"
down_revision = "dc174979d7a3"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "teams",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(50), nullable=False),
        sa.Column("password", sa.String(225), nullable=True),
        sa.Column("owner_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("game_id", sa.Integer(), sa.ForeignKey("games.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(), default=datetime.utcnow),
    )


def downgrade() -> None:
    op.drop_table("teams")
