"""
Router — Análises de Imagens 360° (14 análises)
"""
from fastapi import APIRouter, UploadFile, File
from models.view360 import (
    buracos, bueiros, postes, placas_rua,
    placas_automoveis, fachadas, arborizacao,
    acessibilidade, descarte, rachaduras,
    veiculos, pedestres, comercios, inspecao_predial
)

router = APIRouter()

# ── 1. BURACOS ───────────────────────────────────────────────────────
@router.post("/buracos")
async def analyze_buracos(file: UploadFile = File(...), model: str = "yolov8"):
    img = await file.read()
    return buracos.run(img, model)

# ── 2. BUEIROS ───────────────────────────────────────────────────────
@router.post("/bueiros")
async def analyze_bueiros(file: UploadFile = File(...), model: str = "yolov8"):
    img = await file.read()
    return bueiros.run(img, model)

# ── 3. POSTES ────────────────────────────────────────────────────────
@router.post("/postes")
async def analyze_postes(file: UploadFile = File(...), model: str = "yolov8"):
    img = await file.read()
    return postes.run(img, model)

# ── 4. PLACAS DE RUA ─────────────────────────────────────────────────
@router.post("/placas-rua")
async def analyze_placas_rua(file: UploadFile = File(...), model: str = "yolov8"):
    img = await file.read()
    return placas_rua.run(img, model)

# ── 5. PLACAS DE AUTOMÓVEIS (LPR) ────────────────────────────────────
@router.post("/placas-automoveis")
async def analyze_placas_automoveis(file: UploadFile = File(...), model: str = "lpr_yolov8"):
    img = await file.read()
    return placas_automoveis.run(img, model)

# ── 6. FACHADAS ──────────────────────────────────────────────────────
@router.post("/fachadas")
async def analyze_fachadas(file: UploadFile = File(...), model: str = "resnet_classifier"):
    img = await file.read()
    return fachadas.run(img, model)

# ── 7. ARBORIZAÇÃO URBANA ─────────────────────────────────────────────
@router.post("/arborizacao")
async def analyze_arborizacao(file: UploadFile = File(...), model: str = "yolov8_seg"):
    img = await file.read()
    return arborizacao.run(img, model)

# ── 8. ACESSIBILIDADE URBANA ──────────────────────────────────────────
@router.post("/acessibilidade")
async def analyze_acessibilidade(file: UploadFile = File(...), model: str = "yolov8"):
    img = await file.read()
    return acessibilidade.run(img, model)

# ── 9. DESCARTE IRREGULAR ─────────────────────────────────────────────
@router.post("/descarte")
async def analyze_descarte(file: UploadFile = File(...), model: str = "yolov8"):
    img = await file.read()
    return descarte.run(img, model)

# ── 10. RACHADURAS ESTRUTURAIS ────────────────────────────────────────
@router.post("/rachaduras")
async def analyze_rachaduras(file: UploadFile = File(...), model: str = "crack_unet"):
    img = await file.read()
    return rachaduras.run(img, model)

# ── 11. CONTAGEM DE VEÍCULOS ──────────────────────────────────────────
@router.post("/veiculos")
async def analyze_veiculos(file: UploadFile = File(...), model: str = "yolov8"):
    img = await file.read()
    return veiculos.run(img, model)

# ── 12. FLUXO DE PEDESTRES ───────────────────────────────────────────
@router.post("/pedestres")
async def analyze_pedestres(file: UploadFile = File(...), model: str = "yolov8_pose"):
    img = await file.read()
    return pedestres.run(img, model)

# ── 13. MAPEAMENTO DE COMÉRCIOS ───────────────────────────────────────
@router.post("/comercios")
async def analyze_comercios(file: UploadFile = File(...), model: str = "sign_detector"):
    img = await file.read()
    return comercios.run(img, model)

# ── 14. INSPEÇÃO PREDIAL ──────────────────────────────────────────────
@router.post("/inspecao-predial")
async def analyze_inspecao(file: UploadFile = File(...), model: str = "multiclass_cnn"):
    img = await file.read()
    return inspecao_predial.run(img, model)
