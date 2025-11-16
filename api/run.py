import uvicorn
from settings import Config

if __name__ == "__main__":
    uvicorn.run(
        "app:fastapi_app",
        host=Config.fastapi_host,
        port=Config.fastapi_port,
        # ssl_keyfile="certs/local.key",
        # ssl_certfile="certs/local.pem",
        workers=Config.fastapi_workers,
    )
