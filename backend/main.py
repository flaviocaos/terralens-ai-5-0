"""
TerraLens AI — Backend FastAPI
Pipeline real de análise geoespacial com ML/DL
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from routers import sat_router, view360_router
from utils.image_utils import load_image, validate_image

app = FastAPI(
    title="TerraLens AI — Backend",
    description="API de análise geoespacial com modelos ML/DL reais",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS — permite o frontend React chamar a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção: especifique o domínio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(sat_router.router, prefix="/sat", tags=["Satélite / Drone"])
app.include_router(view360_router.router, prefix="/360", tags=["Imagens 360°"])


@app.get("/")
def root():
    return {
        "app": "TerraLens AI Backend",
        "version": "1.0.0",
        "status": "online",
        "analyses": {
            "satellite": 21,
            "view360": 14,
            "total": 35
        },
        "docs": "/docs"
    }


@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
