from datetime import datetime
from settings import Config

from celery import Celery, signals
from celery.utils.log import get_task_logger
from celery.schedules import crontab

import app.api.user.models as user_models

# add models here

from app.shared.enums.enums import (
    RoleEnum,
)

from app.shared.middleware.session_handler import db

# To start celery worker locally on Windows:
# celery -A app.tasks.tasks worker --loglevel=info -P gevent

# To start celery flower locally:
# celery -A app.tasks.tasks flower

# To start celery beat locally:
# celery -A app.tasks.tasks beat

# To do worker and beat
# celery -A app.tasks.tasks worker --beat --loglevel=info -P gevent

app = Celery("tasks", broker=Config.celery_broker_url)
app.conf.broker_connection_retry_on_startup = True

logger = get_task_logger(__name__)

if Config.environment == "production":
    app.conf.beat_schedule = {}
else:
    app.conf.beat_schedule = {
        "test-task": {
            "task": "app.tasks.tasks.test_task",
            "schedule": crontab(minute="*/1"),  # every minute
        },
    }


@signals.worker_init.connect
def init(**kwargs):
    from app.shared.bases.base_test import client_get

    client_get("health", print_response=False)
    # Only print works in init for some reason, both print and log work after this
    print("Worker initialized")


@app.task
def test_task():
    logger.info("Test task executed")
    return "Test task executed"
