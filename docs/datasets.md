# 📊 Datasets — TerraLens AI

## 🛰️ Satélite / Drone

### Imagens de Satélite Gratuitas

| Dataset | Resolução | Bandas | Acesso | Análises |
|---|---|---|---|---|
| **Sentinel-2** | 10-60m | 13 bandas | ESA Copernicus Hub | LULC, NDVI, Queimadas, Inundação |
| **Landsat 8/9** | 30m | 11 bandas | USGS Earth Explorer | Séries temporais, Carbono |
| **MODIS** | 250m-1km | 36 bandas | NASA Earthdata | Grandes áreas, temporal |
| **SRTM** | 30m | MDE (elevação) | NASA/USGS | Topografia, Erosão |
| **NASADEM** | 30m | MDE melhorado | NASA Earthdata | Topografia avançada |

### Como Baixar Sentinel-2 (Google Earth Engine)
```javascript
// Cole no GEE Code Editor (code.earthengine.google.com)
var regiao = ee.Geometry.Rectangle([-50, -15, -45, -10]); // Ajuste para sua área

var imagem = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(regiao)
  .filterDate('2024-01-01', '2024-12-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
  .median()
  .select(['B2', 'B3', 'B4', 'B8', 'B11', 'B12']); // RGB + NIR + SWIR

Export.image.toDrive({
  image: imagem,
  description: 'sentinel2_minha_area',
  region: regiao,
  scale: 10,
  maxPixels: 1e13
});
```

---

## 🌿 Ground Truth (Dados de Referência)

### LULC / Cobertura do Solo

| Dataset | Cobertura | Resolução | Acesso |
|---|---|---|---|
| **MapBiomas** | Brasil | 30m | mapbiomas.org |
| **PRODES/INPE** | Amazônia | 30m | terrabrasilis.dpi.inpe.br |
| **DETER/INPE** | Amazônia | 30m | terrabrasilis.dpi.inpe.br |
| **ESA WorldCover** | Mundial | 10m | esa-worldcover.org |
| **Dynamic World** | Mundial | 10m | dynamicworld.app |

### Queimadas e Desmatamento

| Dataset | Descrição | Acesso |
|---|---|---|
| **BDQUEIMADAS/INPE** | Focos de calor no Brasil | bdqueimadas.inpe.br |
| **FIRMS/NASA** | Focos mundiais (MODIS/VIIRS) | firms.modaps.eosdis.nasa.gov |
| **Global Forest Watch** | Desmatamento mundial | globalforestwatch.org |

### Hidrografia

| Dataset | Descrição | Acesso |
|---|---|---|
| **ANA** | Hidrografia Brasil | ana.gov.br |
| **HydroSHEDS** | Rede hidrográfica global | hydrosheds.org |
| **Copernicus EMS** | Mapeamento de inundações | emergency.copernicus.eu |

---

## 🔄 Imagens 360°

### Fontes de Imagens para Treino

| Fonte | Tipo | Acesso | Análises |
|---|---|---|---|
| **Google Street View API** | Panorâmicas | Pago por requisição | Buracos, fachadas, placas |
| **Mapillary** | Colaborativo | Gratuito (API) | Todas as 360° |
| **OpenStreetCam** | Colaborativo | Gratuito | Todas as 360° |
| **KartaView** | Colaborativo | Gratuito | Todas as 360° |

### Datasets Específicos por Análise

| Análise | Dataset | Link |
|---|---|---|
| **Buracos** | Pothole Detection | universe.roboflow.com |
| **Buracos** | CrackForest | github.com/fyangneil |
| **Rachaduras** | SDNET2018 | digitalcommons.usu.edu |
| **Veículos** | VIRAT | viratdata.org |
| **Pedestres** | CityPersons | cityscapes-dataset.com |
| **Placas de Rua** | Mapillary Signs | mapillary.com/dataset |
| **LPR (Placas)** | OpenALPR | github.com/openalpr |
| **Arborização** | TreeDetection | zenodo.org |

---

## 📁 Estrutura Recomendada de Dados

```
data/
├── raw/
│   ├── sentinel2/
│   │   ├── area_estudo_2024_01.tif
│   │   └── area_estudo_2024_06.tif
│   ├── drone/
│   │   └── voo_2024_rgb.tif
│   └── view360/
│       ├── imagem_001.jpg
│       └── imagem_002.jpg
│
├── processed/
│   ├── features/
│   │   └── features_lulc.npy
│   └── labels/
│       └── labels_lulc.npy
│
└── samples/
    ├── exemplo_satelite.jpg    ← Para testar o app
    ├── exemplo_drone.jpg
    └── exemplo_360.jpg
```

---

## 🔧 Como Preparar Amostras de Treino

### Opção 1: QGIS (Gratuito, Recomendado)
```
1. Abra a imagem Sentinel-2 no QGIS
2. Plugins → Orfeo Toolbox OU use a ferramenta "Sample"
3. Digitalize polígonos de cada classe
4. Exporte como CSV ou Shapefile
5. Use no notebook de treino
```

### Opção 2: Google Earth Engine
```javascript
// Colete pontos de treinamento no GEE
var treinamento = imagem.sample({
  region: regiao,
  scale: 10,
  numPixels: 5000,
  seed: 42
});
Export.table.toDrive({collection: treinamento, description: 'amostras_treino'});
```

### Opção 3: Label Studio (Imagens 360°)
```bash
# Instale o Label Studio
pip install label-studio

# Rode localmente
label-studio start

# Acesse: http://localhost:8080
# Configure projeto → Object Detection ou Semantic Segmentation
# Importe suas imagens 360°
# Anote manualmente
# Exporte em formato YOLO
```

---

## 💡 Dicas de Qualidade

1. **Balanceamento de classes** — colete amostras proporcionais para cada classe
2. **Variabilidade temporal** — inclua imagens de diferentes épocas do ano
3. **Variabilidade espacial** — inclua amostras de diferentes regiões
4. **Mínimo recomendado** — 200+ amostras por classe para Random Forest, 500+ para DL
5. **Validação independente** — separe 20% dos dados apenas para teste final
