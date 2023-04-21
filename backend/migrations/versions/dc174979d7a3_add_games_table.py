"""add_games_table

Revision ID: dc174979d7a3
Revises: d40c92d9fdac
Create Date: 2023-04-12 20:38:24.452256

"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime



# revision identifiers, used by Alembic.
revision = 'dc174979d7a3'
down_revision = 'd40c92d9fdac'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "games",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(50), nullable=False),
        sa.Column('created_at', sa.DateTime(), default=datetime.utcnow)
    )


def downgrade() -> None:
    op.drop_table("games")
