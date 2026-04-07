"""
TerraLens AI — Utilitários de Imagem
Funções compartilhadas para pré-processamento de imagens
"""

import numpy as np
from PIL import Image
import io
from typing import Tuple


def load_image(image_bytes: bytes, size: Tuple[int, int] = (256, 256)) -> np.ndarray:
    """
    Carrega imagem dos bytes e redimensiona.
    Retorna array numpy (H, W, 3) float32 normalizado [0,1].
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(size, Image.LANCZOS)
    return np.array(img, dtype=np.float32) / 255.0


def validate_image(image_bytes: bytes) -> bool:
    """Verifica se os bytes são uma imagem válida."""
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img.verify()
        return True
    except Exception:
        return False


def extract_rgb_features(arr: np.ndarray) -> np.ndarray:
    """
    Extrai features espectrais de imagem RGB.
    
    Args:
        arr: array (H, W, 3) float32 [0,1]
    
    Returns:
        features: array (H*W, 8) com canais + índices
    """
    R = arr[:, :, 0]
    G = arr[:, :, 1]
    B = arr[:, :, 2]

    NGRDI = (G - R) / (G + R + 1e-9)               # NDVI proxy
    NDWI  = (G - B) / (G + B + 1e-9)               # Água
    GLI   = (2*G - R - B) / (2*G + R + B + 1e-9)  # Vegetação
    ExG   = 2*G - R - B                             # Excesso de verde
    VARI  = (G - R) / (G + R - B + 1e-9)           # VARI

    features = np.stack([R, G, B, NGRDI, NDWI, GLI, ExG, VARI], axis=-1)
    H, W, _ = features.shape
    return features.reshape(H * W, 8)


def compute_basic_metrics(arr: np.ndarray) -> dict:
    """
    Calcula métricas básicas de uma imagem.
    
    Returns:
        dict com NDVI proxy, cobertura vegetal, hídrica e solo
    """
    R = arr[:, :, 0]
    G = arr[:, :, 1]
    B = arr[:, :, 2]

    ngrdi = (G - R) / (G + R + 1e-9)
    ndwi  = (G - B) / (G + B + 1e-9)

    n = R.size
    veg_pct   = float(np.sum(ngrdi > 0.05) / n * 100)
    water_pct = float(np.sum(ndwi > 0.05) / n * 100)
    bare_pct  = float(100 - veg_pct - water_pct)

    return {
        "ndvi_proxy": round(float(np.mean(ngrdi)), 4),
        "gli":        round(float(np.mean((2*G - R - B) / (2*G + R + B + 1e-9))), 4),
        "cobertura_vegetal_pct": round(veg_pct, 1),
        "cobertura_hidrica_pct": round(max(water_pct, 0), 1),
        "solo_exposto_pct":      round(max(bare_pct, 0), 1),
    }


def array_to_bytes(arr: np.ndarray, format: str = "PNG") -> bytes:
    """Converte array numpy para bytes de imagem."""
    if arr.dtype != np.uint8:
        arr = (arr * 255).clip(0, 255).astype(np.uint8)
    img = Image.fromarray(arr)
    buf = io.BytesIO()
    img.save(buf, format=format)
    return buf.getvalue()
