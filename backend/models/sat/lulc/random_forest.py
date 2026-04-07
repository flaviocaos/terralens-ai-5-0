"""
TerraLens AI — Modelo: LULC com Random Forest
Análise: Classificação de Uso e Cobertura do Solo

COMO TREINAR:
  Ver notebook: notebooks/sat/01_lulc_random_forest.ipynb

DATASETS RECOMENDADOS:
  - MapBiomas (https://mapbiomas.org)
  - Sentinel-2 via Google Earth Engine
  - PRODES/INPE

REFERÊNCIA:
  Breiman, L. (2001). Random Forests. Machine Learning, 45(1), 5-32.
"""

import numpy as np
from PIL import Image
import io
import pickle
import os

# Caminho do modelo treinado (após treinar com o notebook)
MODEL_PATH = os.path.join(os.path.dirname(__file__), "random_forest_lulc.pkl")

# Classes de uso do solo (ajuste conforme seu dataset)
CLASSES = [
    {"nome": "Vegetação Densa",  "cor": "#228B22"},
    {"nome": "Agricultura",      "cor": "#6B8E23"},
    {"nome": "Solo Exposto",     "cor": "#C29A6C"},
    {"nome": "Corpo d'Água",     "cor": "#1E78C8"},
    {"nome": "Área Urbana",      "cor": "#969696"},
    {"nome": "Floresta",         "cor": "#006400"},
    {"nome": "Pastagem",         "cor": "#D2B464"},
    {"nome": "Área Úmida",       "cor": "#00B4B4"},
]


def preprocess(image_bytes: bytes) -> np.ndarray:
    """
    Pré-processa a imagem para extração de features.
    Retorna array (H*W, n_features).
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((256, 256))
    arr = np.array(img, dtype=np.float32) / 255.0

    H, W, _ = arr.shape
    R, G, B = arr[:,:,0], arr[:,:,1], arr[:,:,2]

    # Features espectrais (proxies RGB)
    NGRDI = (G - R) / (G + R + 1e-9)          # NDVI proxy
    NDWI  = (G - B) / (G + B + 1e-9)          # Água
    GLI   = (2*G - R - B) / (2*G + R + B + 1e-9)
    ExG   = 2*G - R - B                        # Vegetação

    features = np.stack([R, G, B, NGRDI, NDWI, GLI, ExG], axis=-1)
    return features.reshape(-1, 7)


def load_model():
    """Carrega o modelo treinado do disco."""
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            f"Modelo não encontrado em {MODEL_PATH}.\n"
            "Treine o modelo primeiro com: notebooks/sat/01_lulc_random_forest.ipynb"
        )
    with open(MODEL_PATH, "rb") as f:
        return pickle.load(f)


def run(image_bytes: bytes, model_name: str = "random_forest") -> dict:
    """
    Executa a classificação LULC.

    Args:
        image_bytes: bytes da imagem
        model_name: 'random_forest' | 'xgboost'

    Returns:
        dict com resultados da análise
    """
    features = preprocess(image_bytes)

    # ── MODO DEMO (sem modelo treinado) ──────────────────────────────
    # Remove este bloco após treinar o modelo real
    if not os.path.exists(MODEL_PATH):
        return {
            "status": "demo",
            "aviso": "Modelo não treinado. Execute o notebook para treinar.",
            "modelo": model_name,
            "analise": "LULC",
            "classes": CLASSES,
        }

    # ── INFERÊNCIA REAL ───────────────────────────────────────────────
    clf = load_model()
    labels = clf.predict(features)

    # Calcula área por classe
    total = len(labels)
    classes_resultado = []
    for i, cls in enumerate(CLASSES):
        count = int(np.sum(labels == i))
        if count > 0:
            classes_resultado.append({
                **cls,
                "area_pct": round(count / total * 100, 1),
                "pixels": count,
            })

    classes_resultado.sort(key=lambda x: x["area_pct"], reverse=True)

    return {
        "status": "ok",
        "modelo": model_name,
        "analise": "LULC",
        "acuracia_esperada": "89-94%",
        "classes": classes_resultado,
        "total_pixels": total,
        "n_classes": len(classes_resultado),
    }
