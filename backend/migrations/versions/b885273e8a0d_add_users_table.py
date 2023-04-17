"""add users table

Revision ID: b885273e8a0d
Revises: 
Create Date: 2023-04-07 17:41:48.901729

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "b885273e8a0d"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("username", sa.String(50), unique=True, nullable=False),
        sa.Column("password", sa.String(255), nullable=False),
        sa.Column("email", sa.String(100), nullable=False),
    )
    pass


def downgrade() -> None:
    op.drop_table("users")
    pass
