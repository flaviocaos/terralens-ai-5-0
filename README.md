# 🛰️ TerraLens AI

<div align="center">

![TerraLens AI](https://img.shields.io/badge/TerraLens-AI%20v5.0-00d4ff?style=for-the-badge&logo=satellite&logoColor=white)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Beta-orange?style=for-the-badge)

**Plataforma de Inteligência Geoespacial com IA**  
35 análises · 100+ modelos ML/DL · Satélite + 360° · 100% no navegador

[🚀 Demo ao Vivo](https://terralens-ai-v5.vercel.app) · [📖 Documentação](./docs) · [🐛 Issues](../../issues) · [💬 Discussões](../../discussions)

</div>

---

## 📋 Visão Geral

O **TerraLens AI** é uma plataforma profissional de análise geoespacial que combina:

- **Frontend React** — interface moderna, 100% no navegador, zero instalação
- **Claude Vision (Anthropic)** — análise visual por IA de última geração
- **Backend FastAPI** *(em desenvolvimento)* — pipeline real de modelos ML/DL
- **35 tipos de análise** — cobrindo satélite, drone, Google Earth e imagens 360°

### 🎯 Para quem é?

| Perfil | Uso |
|---|---|
| 🌾 Engenheiro Agrônomo | Análise de vigor, NDVI, agricultura de precisão |
| 🌲 Biólogo/Ambiental | Cobertura florestal, queimadas, biodiversidade |
| 🏙️ Gestor Público | Expansão urbana, pavimento, arborização |
| 🔬 Pesquisador | Pipeline ML/DL para sensoriamento remoto |
| 🏢 Empresa de Geoprocessamento | Automação de análises geoespaciais |

---

## 🗂️ Estrutura do Projeto

```
terralens-ai/
│
├── 🖥️ frontend/              # React + Vite (interface principal)
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── analyses/         # Configuração das 35 análises
│   │   └── utils/            # Helpers e funções JS
│   ├── package.json
│   └── vite.config.js
│
├── ⚙️ backend/               # FastAPI (modelos reais - em desenvolvimento)
│   ├── main.py               # Entrada da API
│   ├── requirements.txt      # Dependências Python
│   ├── routers/              # Endpoints por categoria
│   ├── utils/                # Utilitários (imagem, geo, métricas)
│   └── models/
│       ├── sat/              # 21 análises de satélite/drone
│       │   ├── lulc/         # Classificação LULC
│       │   ├── vigor/        # Vigor e Biomassa
│       │   ├── queimadas/    # Queimadas e Severidade
│       │   ├── urban/        # Expansão Urbana
│       │   ├── hidro/        # Dinâmica Hídrica
│       │   ├── floresta/     # Cobertura Florestal
│       │   ├── erosao/       # Erosão e Degradação
│       │   ├── fragmentacao/ # Fragmentação Ecológica
│       │   ├── segmentation/ # Segmentação Semântica
│       │   ├── detection/    # Detecção de Objetos
│       │   ├── change/       # Mudanças Temporais
│       │   ├── spectral/     # Índices Espectrais
│       │   ├── telhados/     # Extração de Telhados
│       │   ├── agricultura_precisao/ # Agricultura de Precisão
│       │   ├── desmatamento/ # Alerta de Desmatamento
│       │   ├── inundacao/    # Mapeamento de Inundação
│       │   ├── mineracao/    # Impacto de Mineração
│       │   ├── vias/         # Extração de Vias
│       │   ├── carbono/      # Estoque de Carbono
│       │   ├── solos/        # Classificação de Solos
│       │   └── topografia/   # Análise Topográfica
│       │
│       └── view360/          # 14 análises de imagens 360°
│           ├── buracos/      # Reconhecimento de Buracos
│           ├── bueiros/      # Reconhecimento de Bueiros
│           ├── postes/       # Detecção de Postes
│           ├── placas_rua/   # Placas de Rua
│           ├── placas_automoveis/ # LPR - Placas de Veículos
│           ├── fachadas/     # Análise de Fachadas
│           ├── arborizacao/  # Arborização Urbana
│           ├── acessibilidade/ # Acessibilidade Urbana
│           ├── descarte/     # Descarte Irregular
│           ├── rachaduras/   # Rachaduras Estruturais
│           ├── veiculos/     # Contagem de Veículos
│           ├── pedestres/    # Fluxo de Pedestres
│           ├── comercios/    # Mapeamento de Comércios
│           └── inspecao_predial/ # Inspeção Predial
│
├── 📓 notebooks/             # Jupyter para treino dos modelos
│   ├── sat/                  # 21 notebooks de satélite
│   └── view360/              # 14 notebooks de 360°
│
├── 📊 data/                  # Estrutura de dados
│   ├── raw/                  # Imagens brutas
│   ├── processed/            # Imagens processadas
│   └── samples/              # Amostras para teste
│
└── 📚 docs/                  # Documentação técnica
    ├── arquitetura.md
    ├── modelos.md
    ├── deploy.md
    └── datasets.md
```

---

## 🛰️ Análises de Satélite/Drone (21)

| # | Análise | Modelos | Tags |
|---|---|---|---|
| 1 | 🌍 Classificação LULC | Random Forest, XGBoost, U-Net, DeepLab v3+ | ML, DL |
| 2 | 🌿 Vigor e Biomassa | RF Regressor, XGBoost, EfficientNet, NDVI Stack | Índice, ML |
| 3 | 🔥 Queimadas e Severidade | NBR+dNBR, Random Forest, U-Net Fire, DeepLab v3+ | Índice, ML |
| 4 | 🏙️ Expansão Urbana | Random Forest, U-Net Urban, Mask R-CNN, SegFormer-B2 | ML, DL |
| 5 | 💧 Dinâmica Hídrica | NDWI+MNDWI, Random Forest, U-Net Hydro, DeepLab v3+ | Índice, ML |
| 6 | 🌲 Cobertura Florestal | Random Forest, XGBoost, U-Net Forest, EfficientNet+UNet | ML, DL |
| 7 | 🏔️ Erosão e Degradação | Random Forest, XGBoost, SVM RBF, CNN+MDE | ML |
| 8 | 🕸️ Fragmentação | RF+FRAGSTATS, XGBoost, Graph Net, OBIA+Grafos | ML |
| 9 | 🧩 Segmentação Semântica | U-Net Geo, SegFormer-B4, DeepLab v3+, SAM | DL, GPU |
| 10 | 🔍 Detecção de Objetos | YOLOv8-x, Mask R-CNN, RT-DETR, RetinaNet | DL, GPU |
| 11 | 📊 Mudanças Temporais | Siamese U-Net, CVA+K-Means, BIT Transformer, PCA-KMeans | DL, ML |
| 12 | 📈 Índices Espectrais | Stack RGB JS, NDVI/EVI reais, Hiperespectral, RF Índices | Índice |
| 13 | 🏠 Extração de Telhados | YOLOv8-seg, Mask R-CNN, SegFormer-B2, SAM | DL, GPU |
| 14 | 🌾 Agricultura de Precisão | RF Zonas, XGBoost, U-Net Agro, NDRE+RF | ML, DL |
| 15 | 🪓 Alerta de Desmatamento | PRODES-RF, Siamese U-Net, CVA Temporal, BIT Transformer | ML, DL |
| 16 | 🌊 Mapeamento de Inundação | NDWI Temporal, RF Flood, U-Net Flood, SAR+RF | Índice, ML |
| 17 | ⛏️ Impacto de Mineração | RF Mining, XGBoost, U-Net Mining, Change Detection | ML, DL |
| 18 | 🛣️ Extração de Vias | D-LinkNet, SegFormer-B4, DeepLab Roads, SAM Roads | DL, GPU |
| 19 | 🌡️ Estoque de Carbono | RF Carbon, XGBoost, EfficientNet, AGB+Allometric | ML, DL |
| 20 | 🟤 Classificação de Solos | RF Solos, SVM RBF, CNN Pedológica, VNIR Spectral | ML |
| 21 | ⛰️ Análise Topográfica | DEM Analysis, RF Topo, CNN Terrain, TPI+TRI+TWI | ML, DL |

---

## 🔄 Análises de Imagens 360° (14)

| # | Análise | Aplicação | Tags |
|---|---|---|---|
| 1 | 🕳️ Reconhecimento de Buracos | Manutenção de pavimento | DL, GPU |
| 2 | 🔵 Reconhecimento de Bueiros | Inventário de drenagem | DL, GPU |
| 3 | 💡 Detecção de Postes | Inventário de iluminação | DL, GPU |
| 4 | 🚦 Placas de Rua | Inventário de sinalização | DL, GPU |
| 5 | 🚗 Placas de Automóveis (LPR) | Controle de tráfego | DL, GPU |
| 6 | 🏢 Análise de Fachadas | Avaliação imobiliária | DL, GPU |
| 7 | 🌳 Arborização Urbana | Inventário de árvores | DL, ML |
| 8 | ♿ Acessibilidade Urbana | Conformidade com normas | DL, GPU |
| 9 | 🗑️ Descarte Irregular | Fiscalização ambiental | DL, GPU |
| 10 | ⚡ Rachaduras Estruturais | Inspeção de infraestrutura | DL, GPU |
| 11 | 🚙 Contagem de Veículos | Análise de tráfego | DL, GPU |
| 12 | 🚶 Fluxo de Pedestres | Planejamento urbano | DL, GPU |
| 13 | 🏪 Mapeamento de Comércios | Dados econômicos urbanos | DL, ML |
| 14 | 🔍 Inspeção Predial | Laudos automáticos | DL, GPU |

---

## 🚀 Como Usar (Frontend)

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/terralens-ai.git
cd terralens-ai/frontend

# Instale as dependências
npm install

# Configure a variável de ambiente
cp .env.example .env
# Edite .env e adicione sua chave Anthropic:
# VITE_ANTHROPIC_KEY=sua_chave_aqui

# Rode em desenvolvimento
npm run dev

# Build para produção
npm run build
```

---

## ⚙️ Backend (Em Desenvolvimento)

```bash
cd terralens-ai/backend

# Crie ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Instale dependências
pip install -r requirements.txt

# Rode o servidor
uvicorn main:app --reload --port 8000

# Acesse a documentação interativa
# http://localhost:8000/docs
```

---

## 🗺️ Roadmap

### ✅ v5.0 (Atual)
- [x] Frontend React + Vite
- [x] 35 análises (21 sat + 14 360°)
- [x] K-Means LULC no browser
- [x] Índices espectrais JS
- [x] Claude Vision integrado
- [x] Deploy Vercel

### 🔧 v6.0 (Em desenvolvimento)
- [ ] Backend FastAPI
- [ ] LULC com Random Forest real (Sentinel-2)
- [ ] Queimadas com NBR real
- [ ] Proxy seguro para API key
- [ ] Autenticação de usuários

### 🔮 v7.0 (Planejado)
- [ ] U-Net treinado para segmentação
- [ ] YOLOv8 para detecção de objetos
- [ ] Integração Google Earth Engine
- [ ] Exportação de relatório PDF
- [ ] API pública documentada

### 🚀 v8.0 (Visão)
- [ ] Todos os 35 modelos rodando de verdade
- [ ] Suporte a GeoTIFF multibanda
- [ ] Dashboard de projetos
- [ ] Modo SaaS com planos

---

## 🔐 Segurança

> ⚠️ **IMPORTANTE:** Nunca exponha sua chave da API Anthropic no frontend em produção.

Use o proxy seguro do backend:

```
Browser → /api/analyze → FastAPI Backend → Anthropic API
```

A chave fica apenas no servidor (variável de ambiente), nunca no JavaScript do cliente.

---

## 📊 Datasets Recomendados

| Dataset | Tipo | Acesso | Uso |
|---|---|---|---|
| Sentinel-2 (ESA) | Multispectral | Gratuito | LULC, NDVI, queimadas |
| Landsat 8/9 (USGS) | Multispectral | Gratuito | Séries temporais |
| MapBiomas | LULC classificado | Gratuito | Ground truth |
| PRODES/INPE | Desmatamento | Gratuito | Alerta desmatamento |
| OpenStreetMap | Vetorial | Gratuito | Extração de vias |
| SRTM/NASADEM | MDE | Gratuito | Topografia, erosão |

---

## 🤝 Como Contribuir

1. Fork o projeto
2. Crie sua branch: `git checkout -b feature/nova-analise`
3. Commit: `git commit -m 'Add: análise de solos com CNN'`
4. Push: `git push origin feature/nova-analise`
5. Abra um Pull Request

### Áreas que precisam de contribuição

- 🤖 Implementação real dos modelos ML/DL em Python
- 📊 Notebooks de treinamento com datasets públicos
- 🧪 Testes unitários e de integração
- 📖 Documentação e tutoriais
- 🌍 Tradução (EN, ES)

---

## 📄 Licença

MIT License — uso livre para fins educacionais e comerciais.

---

## 👨‍💻 Desenvolvido com

| Tecnologia | Uso |
|---|---|
| React 18 + Vite 8 | Frontend |
| Claude Vision (Anthropic) | Análise por IA |
| FastAPI + Python | Backend (em dev.) |
| PyTorch / TensorFlow | Modelos DL |
| scikit-learn | Modelos ML |
| Sentinel-2 / Landsat | Dados de satélite |

---

<div align="center">

**TerraLens AI v5.0** · Beta Público · MIT License

🛰️ Feito com IA para análise geoespacial de ponta

</div>
