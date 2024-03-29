"""add_championships_table

Revision ID: 69f5210af90e
Revises: d40c92d9fdac
Create Date: 2023-04-18 17:30:55.752864

"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime 

# revision identifiers, used by Alembic.
revision = '69f5210af90e'
down_revision = 'd40c92d9fdac'
branch_labels = None
depends_on = None


def upgrade() -> None:
     op.create_table(
        "championships",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(50), unique=True, nullable=False),
        sa.Column("start_time",  sa.DateTime(), default=datetime.utcnow, nullable=False),
        sa.Column("min_teams", sa.Integer, nullable=True),
        sa.Column("max_teams", sa.Integer, nullable=True),
        sa.Column("prizes", sa.Text(), nullable=True),
        sa.Column("format", sa.Enum('chaveamento','pontos_corridos', name='championship_format'), nullable=False),
        sa.Column("rules", sa.Text(), nullable=True),
        sa.Column("contact", sa.Text(), nullable=True),
        sa.Column("visibility", sa.Enum('publico','privado', name='championship_visibility'), nullable=False),
        sa.Column("created_at", sa.DateTime(), default=datetime.utcnow),
        sa.Column("admin_id", sa.Integer, sa.ForeignKey('users.id'), nullable=False),
        sa.Column("game_id", sa.Integer, sa.ForeignKey('games.id'), nullable=False),
    )
    


def downgrade() -> None:
    op.drop_table("championships")
