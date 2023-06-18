"""add_round_column_to_championships_table

Revision ID: 41197dc92dd1
Revises: f5191b0310d5
Create Date: 2023-06-18 19:25:39.748292

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '41197dc92dd1'
down_revision = 'f5191b0310d5'
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.add_column('championships', sa.Column('round', sa.Integer, nullable=True))

def downgrade() -> None:
    op.drop_column('championships', 'round')
