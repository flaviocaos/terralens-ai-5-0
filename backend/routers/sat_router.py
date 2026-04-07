"""
Router — Análises de Satélite / Drone (21 análises)
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from models.sat import (
    lulc, vigor, queimadas, urban, hidro,
    floresta, erosao, fragmentacao, segmentation,
    detection, change, spectral, telhados,
    agricultura_precisao, desmatamento, inundacao,
    mineracao, vias, carbono, solos, topografia
)

router = APIRouter()

# ── 1. LULC ──────────────────────────────────────────────────────────
@router.post("/lulc")
async def analyze_lulc(file: UploadFile = File(...), model: str = "random_forest"):
    img = await file.read()
    return lulc.run(img, model)

# ── 2. VIGOR E BIOMASSA ───────────────────────────────────────────────
@router.post("/vigor")
async def analyze_vigor(file: UploadFile = File(...), model: str = "random_forest"):
    img = await file.read()
    return vigor.run(img, model)

# ── 3. QUEIMADAS ──────────────────────────────────────────────────────
@router.post("/queimadas")
async def analyze_queimadas(file: UploadFile = File(...), model: str = "nbr_dnbr"):
    img = await file.read()
    return queimadas.run(img, model)

# ── 4. EXPANSÃO URBANA ────────────────────────────────────────────────
@router.post("/urban")
async def analyze_urban(file: UploadFile = File(...), model: str = "random_forest"):
    img = await file.read()
    return urban.run(img, model)

# ── 5. DINÂMICA HÍDRICA ───────────────────────────────────────────────
@router.post("/hidro")
async def analyze_hidro(file: UploadFile = File(...), model: str = "ndwi_mndwi"):
    img = await file.read()
    return hidro.run(img, model)

# ── 6. COBERTURA FLORESTAL ────────────────────────────────────────────
@router.post("/floresta")
async def analyze_floresta(file: UploadFile = File(...), model: str = "random_forest"):
    img = await file.read()
    return floresta.run(img, model)

# ── 7. EROSÃO E DEGRADAÇÃO ────────────────────────────────────────────
@router.post("/erosao")
async def analyze_erosao(file: UploadFile = File(...), model: str = "random_forest"):
    img = await file.read()
    return erosao.run(img, model)

# ── 8. FRAGMENTAÇÃO ECOLÓGICA ─────────────────────────────────────────
@router.post("/fragmentacao")
async def analyze_fragmentacao(file: UploadFile = File(...), model: str = "rf_fragstats"):
    img = await file.read()
    return fragmentacao.run(img, model)

# ── 9. SEGMENTAÇÃO SEMÂNTICA ──────────────────────────────────────────
@router.post("/segmentation")
async def analyze_segmentation(file: UploadFile = File(...), model: str = "unet"):
    img = await file.read()
    return segmentation.run(img, model)

# ── 10. DETECÇÃO DE OBJETOS ───────────────────────────────────────────
@router.post("/detection")
async def analyze_detection(file: UploadFile = File(...), model: str = "yolov8"):
    img = await file.read()
    return detection.run(img, model)

# ── 11. MUDANÇAS TEMPORAIS ────────────────────────────────────────────
@router.post("/change")
async def analyze_change(
    file_before: UploadFile = File(...),
    file_after: UploadFile = File(...),
    model: str = "siamese_unet"
):
    img_before = await file_before.read()
    img_after = await file_after.read()
    return change.run(img_before, img_after, model)

# ── 12. ÍNDICES ESPECTRAIS ────────────────────────────────────────────
@router.post("/spectral")
async def analyze_spectral(file: UploadFile = File(...), model: str = "ndvi_evi"):
    img = await file.read()
    return spectral.run(img, model)

# ── 13. EXTRAÇÃO DE TELHADOS ──────────────────────────────────────────
@router.post("/telhados")
async def analyze_telhados(file: UploadFile = File(...), model: str = "yolov8_seg"):
    img = await file.read()
    return telhados.run(img, model)

# ── 14. AGRICULTURA DE PRECISÃO ───────────────────────────────────────
@router.post("/agricultura-precisao")
async def analyze_agricultura(file: UploadFile = File(...), model: str = "rf_zonas"):
    img = await file.read()
    return agricultura_precisao.run(img, model)

# ── 15. ALERTA DE DESMATAMENTO ────────────────────────────────────────
@router.post("/desmatamento")
async def analyze_desmatamento(file: UploadFile = File(...), model: str = "prodes_rf"):
    img = await file.read()
    return desmatamento.run(img, model)

# ── 16. MAPEAMENTO DE INUNDAÇÃO ───────────────────────────────────────
@router.post("/inundacao")
async def analyze_inundacao(file: UploadFile = File(...), model: str = "ndwi_temporal"):
    img = await file.read()
    return inundacao.run(img, model)

# ── 17. IMPACTO DE MINERAÇÃO ──────────────────────────────────────────
@router.post("/mineracao")
async def analyze_mineracao(file: UploadFile = File(...), model: str = "rf_mining"):
    img = await file.read()
    return mineracao.run(img, model)

# ── 18. EXTRAÇÃO DE VIAS ──────────────────────────────────────────────
@router.post("/vias")
async def analyze_vias(file: UploadFile = File(...), model: str = "dlinknet"):
    img = await file.read()
    return vias.run(img, model)

# ── 19. ESTOQUE DE CARBONO ────────────────────────────────────────────
@router.post("/carbono")
async def analyze_carbono(file: UploadFile = File(...), model: str = "rf_carbon"):
    img = await file.read()
    return carbono.run(img, model)

# ── 20. CLASSIFICAÇÃO DE SOLOS ────────────────────────────────────────
@router.post("/solos")
async def analyze_solos(file: UploadFile = File(...), model: str = "rf_solos"):
    img = await file.read()
    return solos.run(img, model)

# ── 21. ANÁLISE TOPOGRÁFICA ───────────────────────────────────────────
@router.post("/topografia")
async def analyze_topografia(file: UploadFile = File(...), model: str = "dem_analysis"):
    img = await file.read()
    return topografia.run(img, model)
