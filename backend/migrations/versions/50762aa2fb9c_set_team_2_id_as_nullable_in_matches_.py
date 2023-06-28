"""set team 2 id as nullable in matches table

Revision ID: 50762aa2fb9c
Revises: a4ec6fd4cb0b
Create Date: 2023-06-25 12:42:58.676638

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "50762aa2fb9c"
down_revision = "a4ec6fd4cb0b"
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column("matches", "team_2_id", existing_type=sa.Integer(), nullable=True)


def downgrade():
    op.alter_column("matches", "team_2_id", existing_type=sa.Integer(), nullable=False)
