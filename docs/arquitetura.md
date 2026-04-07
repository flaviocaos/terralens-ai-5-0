# 🏗️ Arquitetura TerraLens AI

## Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                     USUÁRIO FINAL                           │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│              FRONTEND — React + Vite (Vercel)               │
│                                                             │
│   ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│   │  Upload img │  │ Sel. análise │  │  Sel. modelo     │  │
│   └──────┬──────┘  └──────┬───────┘  └────────┬─────────┘  │
│          │                │                    │            │
│          └────────────────▼────────────────────┘            │
│                    ┌──────────────┐                         │
│                    │  Processador │                         │
│                    │     JS       │                         │
│                    │  K-Means     │                         │
│                    │  NDVI proxy  │                         │
│                    └──────┬───────┘                         │
└───────────────────────────┼─────────────────────────────────┘
                            │
          ┌─────────────────┼──────────────────┐
          │                 │                  │
┌─────────▼──────┐  ┌───────▼────────┐  ┌─────▼──────────────┐
│  Claude Vision │  │ FastAPI Backend│  │  Google Earth Eng. │
│  (Anthropic)   │  │  (Em dev.)     │  │  (Opcional)        │
│                │  │                │  │                     │
│  Análise visual│  │ ML/DL Reais    │  │  Sentinel-2 direto  │
│  por IA        │  │ Random Forest  │  │                     │
│                │  │ U-Net, YOLO    │  │                     │
└────────────────┘  └───────┬────────┘  └─────────────────────┘
                            │
                   ┌────────▼────────┐
                   │  Modelos .pkl   │
                   │  .pt (PyTorch)  │
                   │  .h5 (Keras)    │
                   └─────────────────┘
```

## Stack Tecnológico

### Frontend
| Tecnologia | Versão | Uso |
|---|---|---|
| React | 18 | UI principal |
| Vite | 8 | Build tool |
| Vercel | - | Deploy |

### Backend (Em Desenvolvimento)
| Tecnologia | Versão | Uso |
|---|---|---|
| FastAPI | 0.111 | API REST |
| uvicorn | 0.30 | Servidor ASGI |
| Python | 3.11 | Runtime |

### ML/DL
| Biblioteca | Uso |
|---|---|
| scikit-learn | Random Forest, SVM, K-Means |
| XGBoost | Gradient Boosting |
| PyTorch | U-Net, SegFormer, Siamese |
| Ultralytics | YOLOv8 |
| Transformers | SegFormer, BIT, RT-DETR |
| rasterio | Leitura de GeoTIFF |

## Fluxo de Análise

### Modo Atual (v5.0 — Frontend Only)
```
1. Usuário faz upload da imagem
2. JavaScript redimensiona (max 480px)
3. K-Means classifica pixels por cor (5 classes)
4. Calcula NDVI proxy, GLI, VARI via RGB
5. Envia imagem + prompt para Claude Vision API
6. Claude retorna JSON com interpretação
7. Frontend renderiza mapas e métricas
```

### Modo Futuro (v6+ — Backend Real)
```
1. Usuário faz upload da imagem
2. Frontend envia para FastAPI backend
3. Backend carrega modelo treinado (.pkl ou .pt)
4. Modelo faz inferência real na imagem
5. Backend retorna métricas reais + mapa classificado
6. Frontend renderiza com dados reais
```

## Segurança

### Problema Atual
```
❌ ANTHROPIC_KEY exposta no frontend JS
   → Qualquer um pode ver e usar sua chave
```

### Solução Recomendada (Proxy Seguro)
```
✅ Frontend → /api/claude (Vercel Function) → Anthropic API
   → Chave fica apenas no servidor (env var)
```

```javascript
// vercel.json
{
  "functions": {
    "api/claude.js": { "memory": 256, "maxDuration": 30 }
  }
}

// api/claude.js
export default async function handler(req, res) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,  // Segura no servidor
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(req.body)
  });
  const data = await response.json();
  res.json(data);
}
```

## Datasets Recomendados por Análise

### Satélite / Drone
| Análise | Dataset | Link |
|---|---|---|
| LULC | MapBiomas | mapbiomas.org |
| Queimadas | INPE BDQUEIMADAS | bdqueimadas.inpe.br |
| Desmatamento | PRODES/INPE | terrabrasilis.dpi.inpe.br |
| Inundação | Copernicus EMS | emergency.copernicus.eu |
| Extração de Vias | OpenStreetMap | openstreetmap.org |
| Carbono | ESA CCI Biomass | esa-biomass-cci.org |

### Imagens 360°
| Análise | Dataset | Link |
|---|---|---|
| Buracos | Roboflow Universe | universe.roboflow.com |
| Rachaduras | CrackForest | github.com/fyangneil/pavement-crack-detection |
| Fachadas | Google Street View | developers.google.com/maps |
| Veículos | VIRAT Dataset | viratdata.org |
| Pedestres | CityPersons | cityscapes-dataset.com |
