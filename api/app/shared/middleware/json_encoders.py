import json
import datetime
from uuid import UUID


class ModelEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, UUID):
            return str(obj)
        if isinstance(obj, (datetime.datetime, datetime.date)):
            return str(obj)
        if isinstance(
            obj,
            (object),
        ):
            return None
        # if isinstance(obj, User):
        #     return None
        # if isinstance(obj, (datetime.datetime, datetime.date)):
        #     return obj.isoformat()
        return json.JSONEncoder.default(self, obj)
