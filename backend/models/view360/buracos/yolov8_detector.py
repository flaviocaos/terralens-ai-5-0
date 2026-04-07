"""
TerraLens AI — Modelo: Detecção de Buracos (Imagens 360°)
Análise: Reconhecimento de Buracos e Pavimento Degradado

COMO TREINAR:
  Ver notebook: notebooks/view360/01_buracos_yolov8.ipynb

DATASETS RECOMENDADOS:
  - Pothole Detection Dataset (Roboflow Universe)
  - CrackForest Dataset
  - Dados próprios coletados com câmera 360°

REFERÊNCIA:
  Jocher, G. et al. (2023). Ultralytics YOLOv8. https://github.com/ultralytics/ultralytics
"""

import numpy as np
from PIL import Image
import io
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "yolov8_buracos.pt")

CLASSES = [
    {"nome": "Buraco",           "cor": "#FF4D6D", "severidade": "Alta"},
    {"nome": "Trinca",           "cor": "#FF9F1C", "severidade": "Média"},
    {"nome": "Deformação",       "cor": "#FFE44D", "severidade": "Média"},
    {"nome": "Pavimento Bom",    "cor": "#00FF88", "severidade": "Baixa"},
]


def run(image_bytes: bytes, model_name: str = "yolov8") -> dict:
    """
    Detecta buracos e anomalias de pavimento em imagens 360°.

    Args:
        image_bytes: bytes da imagem
        model_name: 'yolov8' | 'rt_detr' | 'mask_rcnn'

    Returns:
        dict com detecções e métricas
    """

    # ── MODO DEMO ─────────────────────────────────────────────────────
    if not os.path.exists(MODEL_PATH):
        return {
            "status": "demo",
            "aviso": "Modelo não treinado. Execute o notebook para treinar.",
            "modelo": model_name,
            "analise": "Detecção de Buracos",
            "instrucao": "notebooks/view360/01_buracos_yolov8.ipynb",
        }

    # ── INFERÊNCIA REAL ───────────────────────────────────────────────
    from ultralytics import YOLO
    model = YOLO(MODEL_PATH)

    img = Image.open(io.BytesIO(image_bytes))
    results = model(img)[0]

    deteccoes = []
    for box in results.boxes:
        deteccoes.append({
            "classe": results.names[int(box.cls)],
            "confianca": round(float(box.conf), 3),
            "bbox": box.xyxy[0].tolist(),
        })

    return {
        "status": "ok",
        "modelo": model_name,
        "analise": "Detecção de Buracos",
        "total_deteccoes": len(deteccoes),
        "deteccoes": deteccoes,
        "map50_esperado": ">0.81",
    }
