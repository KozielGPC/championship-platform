"""update team password lenght

Revision ID: 3cde0c5cbec8
Revises: 69f5210af90e
Create Date: 2023-04-27 19:42:52.641068

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "3cde0c5cbec8"
down_revision = "69f5210af90e"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column(
        "teams", "password", existing_type=sa.String(length=50), type_=sa.String(length=255), existing_nullable=True
    )
    pass


def downgrade() -> None:
    op.alter_column(
        "teams", "password", existing_type=sa.String(length=255), type_=sa.String(length=50), existing_nullable=True
    )
    pass
