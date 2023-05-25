"""add notifications table

Revision ID: 1474b7898268
Revises: 005068dcf08f
Create Date: 2023-05-24 22:03:40.527829

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "1474b7898268"
down_revision = "005068dcf08f"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "notifications",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(50), unique=True, nullable=False),
        sa.Column("reference_user_id", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("text", sa.Text(), nullable=True),
        sa.Column("visualized", sa.Boolean(), default=False),
    )

    pass


def downgrade() -> None:
    op.drop_table("notifications")
    pass
