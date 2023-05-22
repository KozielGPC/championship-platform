"""add championship has teams table

Revision ID: 005068dcf08f
Revises: 3cde0c5cbec8
Create Date: 2023-05-15 16:34:49.271698

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "005068dcf08f"
down_revision = "3cde0c5cbec8"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "championship_has_teams",
        sa.Column("championship_id", sa.Integer, sa.ForeignKey("championships.id"), nullable=False),
        sa.Column("team_id", sa.Integer, sa.ForeignKey("teams.id"), nullable=False),
        sa.PrimaryKeyConstraint("championship_id", "team_id"),
    )


def downgrade() -> None:
    op.drop_table("championship_has_teams")
