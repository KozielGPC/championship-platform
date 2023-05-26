"""add_team_has_users_table

Revision ID: a39f81727889
Revises: 005068dcf08f
Create Date: 2023-05-24 20:07:01.893567

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a39f81727889'
down_revision = '005068dcf08f'
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.create_table(
        "team_has_users",
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("team_id", sa.Integer, sa.ForeignKey("teams.id"), nullable=False),
        sa.PrimaryKeyConstraint("user_id", "team_id"),
    )

def downgrade() -> None:
    op.drop_table("team_has_users")