"""add_matches_table

Revision ID: f5191b0310d5
Revises: 1474b7898268
Create Date: 2023-06-05 16:52:03.175147

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f5191b0310d5'
down_revision = '1474b7898268'
branch_labels = None
depends_on = None

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.sql import table
from alembic import op


def upgrade() -> None:
    op.create_table(
        "matches",
        Column('id', Integer, primary_key=True),
        Column('championship_id', Integer, ForeignKey('championships.id')),
        Column('team_1_id', Integer, ForeignKey('teams.id')),
        Column('team_2_id', Integer, ForeignKey('teams.id')),
        Column('winner_team_id', Integer, ForeignKey('teams.id'), nullable=True),
        Column('bracket', Integer),
        Column('round', Integer),
        Column('result', String, nullable=True)
    )

def downgrade() -> None:
    op.drop_table("matches")
