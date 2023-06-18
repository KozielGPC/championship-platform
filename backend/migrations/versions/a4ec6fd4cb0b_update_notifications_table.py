"""update notifications table

Revision ID: a4ec6fd4cb0b
Revises: f5191b0310d5
Create Date: 2023-06-18 19:10:33.836857

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "a4ec6fd4cb0b"
down_revision = "f5191b0310d5"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("notifications", sa.Column("team_id", sa.Integer))
    op.add_column("notifications", sa.Column("team_name", sa.String))
    op.add_column("notifications", sa.Column("sender_name", sa.String))
    op.drop_column("notifications", "name")
    op.drop_column("notifications", "text")


def downgrade():
    op.add_column("notifications", sa.Column("name", sa.String))
    op.add_column("notifications", sa.Column("text", sa.String))
    op.drop_column("notifications", "team_id")
    op.drop_column("notifications", "team_name")
    op.drop_column("notifications", "sender_name")
