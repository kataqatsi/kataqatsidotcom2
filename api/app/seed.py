"""
Database seeding module for initial data setup.
"""

import logging
from sqlalchemy.exc import IntegrityError
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import app.api.user.models as user_models
from settings import Config
import uuid

logger = logging.getLogger(__name__)


def seed_database():
    """
    Seed the database with initial data.
    Only runs in non-production environments.
    """
    if Config.environment == "production":
        logger.info("Skipping database seeding in production environment")
        return

    logger.info("Starting database seeding...")

    # Create engine and session for standalone operation
    engine = create_engine(f"postgresql+psycopg2://{Config.database_connection}")
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    with SessionLocal() as session:
        try:
            # Create role
            role = user_models.Role(id="default", description="Default")
            session.add(role)
            session.commit()
            logger.info(f"Created role: {role.description}")
        except Exception as e:
            logger.error(f"Error creating role: {e}")
            session.rollback()

        try:
            # Create permission
            permission = user_models.Permission(id="read", description="Read")
            session.add(permission)
            session.commit()
            logger.info(f"Created permission: {permission.description}")
        except Exception as e:
            logger.error(f"Error creating permission: {e}")
            session.rollback()

        try:
            # Create role permission
            role_permission = user_models.RolePermission(
                role_id="default", permission_id="read"
            )
            session.add(role_permission)
            session.commit()
            logger.info(
                f"Created role permission: {role_permission.role_id} {role_permission.permission_id}"
            )
        except Exception as e:
            logger.error(f"Error creating role permission: {e}")
            session.rollback()

        try:
            # Create role
            role = user_models.Role(id="admin", description="Admin")
            session.add(role)
            session.commit()
            logger.info(f"Created role: {role.description}")
        except Exception as e:
            logger.error(f"Error creating role: {e}")
            session.rollback()

        try:
            # Create permission
            permission = user_models.Permission(id="write", description="Write")
            session.add(permission)
            session.commit()
            logger.info(f"Created permission: {permission.description}")
        except Exception as e:
            logger.error(f"Error creating permission: {e}")
            session.rollback()

        try:
            # Create role permission
            role_permission = user_models.RolePermission(
                role_id="admin", permission_id="write"
            )
            session.add(role_permission)
            session.commit()
            logger.info(
                f"Created admin role permission: {role_permission.role_id} {role_permission.permission_id}"
            )
        except Exception as e:
            logger.error(f"Error creating role permission: {e}")
            session.rollback()

        try:
            # Create tenant
            tenant = user_models.Tenant(id="default", full_name="Default Tenant")
            session.add(tenant)
            session.commit()
            logger.info(f"Created tenant: {tenant.full_name}")
        except Exception as e:
            logger.error(f"Error creating tenant: {e}")
            session.rollback()

        try:
            # Create admin user
            admin_user = user_models.User(
                id=uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa7"),
                email="admin@application.com",
                password=user_models.hash_password("admin"),
                tenant_id=tenant.id,
                role_id="admin",
            )
            session.add(admin_user)
            session.commit()
            logger.info(f"Created admin user: {admin_user.email}")
        except Exception as e:
            logger.error(f"Error creating admin user: {e}")
            session.rollback()

        try:
            # Create regular user
            regular_user = user_models.User(
                id=uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                email="user@application.com",
                password=user_models.hash_password("user"),
                tenant_id=tenant.id,
                role_id="default",
            )
            session.add(regular_user)
            session.commit()
            logger.info(f"Created regular user: {regular_user.email}")
        except Exception as e:
            logger.error(f"Error creating regular user: {e}")
            session.rollback()
