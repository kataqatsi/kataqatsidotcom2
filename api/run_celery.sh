#!/bin/bash

celery -A app.tasks.tasks worker --beat --loglevel=info