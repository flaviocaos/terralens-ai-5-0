# 🤖 Modelos ML/DL — TerraLens AI

## 🛰️ Análises de Satélite / Drone (21)

### 1. Classificação LULC
| Modelo | Biblioteca | GPU | Tempo | Acurácia | Status |
|---|---|---|---|---|---|
| **Random Forest** ⭐ | scikit-learn | ❌ | 15-40min | 89-94% | 🔧 Implementar |
| XGBoost | xgboost | ❌ | 10-30min | 88-93% | 🔧 Implementar |
| U-Net | pytorch | ✅ | 2-8h | 91-96% | 🔧 Implementar |
| DeepLab v3+ | tensorflow | ✅ | 3-10h | 92-97% | 🔧 Implementar |

### 2. Vigor e Biomassa
| Modelo | Biblioteca | GPU | Tempo | Acurácia | Status |
|---|---|---|---|---|---|
| **RF Regressor** ⭐ | scikit-learn | ❌ | 10-25min | R²>0.85 | 🔧 Implementar |
| XGBoost Reg. | xgboost | ❌ | 8-20min | R²>0.87 | 🔧 Implementar |
| EfficientNet | timm | ✅ | 4-12h | R²>0.91 | 🔧 Implementar |
| NDVI Stack | numpy | ❌ | <5min | Proxy | ✅ Disponível |

### 3. Queimadas e Severidade
| Modelo | Biblioteca | GPU | Tempo | Acurácia | Status |
|---|---|---|---|---|---|
| **NBR + dNBR** ⭐ | numpy | ❌ | <10min | OA>90% | 🔧 Implementar |
| Random Forest | scikit-learn | ❌ | 15-30min | OA>92% | 🔧 Implementar |
| U-Net Fire | pytorch | ✅ | 2-6h | OA>94% | 🔧 Implementar |
| DeepLab v3+ | tensorflow | ✅ | 3-8h | OA>95% | 🔧 Implementar |

### 4. Expansão Urbana
| Modelo | Biblioteca | GPU | Tempo | Acurácia | Status |
|---|---|---|---|---|---|
| **Random Forest** ⭐ | scikit-learn | ❌ | 15-40min | OA>90% | 🔧 Implementar |
| U-Net Urban | pytorch | ✅ | 2-8h | OA>94% | 🔧 Implementar |
| Mask R-CNN | torchvision | ✅ | 4-16h | mAP>0.82 | 🔧 Implementar |
| SegFormer-B2 | transformers | ✅ | 3-10h | OA>95% | 🔧 Implementar |

### 5. Dinâmica Hídrica
| Modelo | Biblioteca | GPU | Tempo | Acurácia | Status |
|---|---|---|---|---|---|
| **NDWI+MNDWI** ⭐ | numpy | ❌ | <10min | OA>92% | 🔧 Implementar |
| Random Forest | scikit-learn | ❌ | 10-25min | OA>94% | 🔧 Implementar |
| U-Net Hydro | pytorch | ✅ | 2-6h | OA>96% | 🔧 Implementar |
| DeepLab v3+ | tensorflow | ✅ | 3-8h | OA>96% | 🔧 Implementar |

### 6. Cobertura Florestal
| Modelo | Biblioteca | GPU | Tempo | Acurácia | Status |
|---|---|---|---|---|---|
| **Random Forest** ⭐ | scikit-learn | ❌ | 15-40min | OA>91% | 🔧 Implementar |
| XGBoost | xgboost | ❌ | 10-25min | OA>92% | 🔧 Implementar |
| U-Net Forest | pytorch | ✅ | 2-8h | OA>95% | 🔧 Implementar |
| EfficientNet+UNet | pytorch | ✅ | 3-10h | OA>96% | 🔧 Implementar |

### 7. Erosão e Degradação
| Modelo | Biblioteca | GPU | Tempo | Acurácia | Status |
|---|---|---|---|---|---|
| **Random Forest** ⭐ | scikit-learn | ❌ | 15-35min | OA>88% | 🔧 Implementar |
| XGBoost | xgboost | ❌ | 10-25min | OA>89% | 🔧 Implementar |
| SVM RBF | scikit-learn | ❌ | 20-60min | OA>87% | 🔧 Implementar |
| CNN+MDE | pytorch | ✅ | 3-8h | OA>93% | 🔧 Implementar |

### 8. Fragmentação Ecológica
| Modelo | Biblioteca | GPU | Tempo | Acurácia | Status |
|---|---|---|---|---|---|
| **RF+FRAGSTATS** ⭐ | scikit-learn | ❌ | 20-50min | OA>89% | 🔧 Implementar |
| XGBoost | xgboost | ❌ | 15-35min | OA>90% | 🔧 Implementar |
| Graph Net | pytorch-geometric | ✅ | 4-12h | OA>94% | 🔧 Implementar |
| OBIA+Grafos | scikit-learn | ❌ | 30-90min | OA>91% | 🔧 Implementar |

### 9. Segmentação Semântica
| Modelo | Biblioteca | GPU | Tempo | Acurácia | Status |
|---|---|---|---|---|---|
| **U-Net Geo** ⭐ | pytorch | ✅ | 2-8h | mIoU>0.82 | 🔧 Implementar |
| SegFormer-B4 | transformers | ✅ | 4-12h | mIoU>0.86 | 🔧 Implementar |
| DeepLab v3+ | tensorflow | ✅ | 3-10h | mIoU>0.84 | 🔧 Implementar |
| SAM | segment-anything | ✅ | 1-3h | Zero-shot | 🔧 Implementar |

### 10. Detecção de Objetos
| Modelo | Biblioteca | GPU | Tempo | Acurácia | Status |
|---|---|---|---|---|---|
| **YOLOv8-x** ⭐ | ultralytics | ✅ | 1-4h | mAP50>0.78 | 🔧 Implementar |
| Mask R-CNN | torchvision | ✅ | 4-16h | mAP50>0.75 | 🔧 Implementar |
| RT-DETR | transformers | ✅ | 2-8h | mAP50>0.81 | 🔧 Implementar |
| RetinaNet | torchvision | ✅ | 2-6h | mAP50>0.72 | 🔧 Implementar |

### 11. Mudanças Temporais
| Modelo | Biblioteca | GPU | Tempo | Acurácia | Status |
|---|---|---|---|---|---|
| **Siamese U-Net** ⭐ | pytorch | ✅ | 2-6h | OA>91% | 🔧 Implementar |
| CVA+K-Means | scikit-learn | ❌ | <30min | OA>84% | 🔧 Implementar |
| BIT Transformer | pytorch | ✅ | 3-8h | OA>93% | 🔧 Implementar |
| PCA-KMeans | scikit-learn | ❌ | <15min | OA>80% | 🔧 Implementar |

### 12. Índices Espectrais
| Modelo | Biblioteca | GPU | Tempo | Acurácia | Status |
|---|---|---|---|---|---|
| **Stack RGB JS** ⭐ | JavaScript | ❌ | <1min | Proxy | ✅ Disponível |
| NDVI/EVI reais | rasterio+numpy | ❌ | <5min | Alta (NIR) | 🔧 Implementar |
| Hiperespectral | spectral | ❌ | 10-30min | Alta | 🔧 Implementar |
| RF Índices | scikit-learn | ❌ | 10-25min | R²>0.88 | 🔧 Implementar |

### 13. Extração de Telhados
| Modelo | Biblioteca | GPU | Tempo | Acurácia | Status |
|---|---|---|---|---|---|
| **YOLOv8-seg** ⭐ | ultralytics | ✅ | 1-4h | mAP50>0.80 | 🔧 Implementar |
| Mask R-CNN | torchvision | ✅ | 4-16h | mAP50>0.77 | 🔧 Implementar |
| SegFormer-B2 | transformers | ✅ | 3-8h | mIoU>0.83 | 🔧 Implementar |
| SAM | segment-anything | ✅ | 1-3h | Zero-shot | 🔧 Implementar |

### 14. Agricultura de Precisão
| Modelo | Biblioteca | GPU | Tempo | Acurácia | Status |
|---|---|---|---|---|---|
| **RF Zonas** ⭐ | scikit-learn | ❌ | 15-35min | OA>88% | 🔧 Implementar |
| XGBoost | xgboost | ❌ | 10-25min | OA>90% | 🔧 Implementar |
| U-Net Agro | pytorch | ✅ | 2-8h | OA>93% | 🔧 Implementar |
| NDRE+RF | scikit-learn | ❌ | 10-20min | R²>0.86 | 🔧 Implementar |

### 15. Alerta de Desmatamento
| Modelo | Biblioteca | GPU | Tempo | Acurácia | Status |
|---|---|---|---|---|---|
| **PRODES-RF** ⭐ | scikit-learn | ❌ | 15-35min | OA>91% | 🔧 Implementar |
| Siamese U-Net | pytorch | ✅ | 2-6h | OA>93% | 🔧 Implementar |
| CVA Temporal | scikit-learn | ❌ | <30min | OA>85% | 🔧 Implementar |
| BIT Transformer | pytorch | ✅ | 3-8h | OA>94% | 🔧 Implementar |

### 16. Mapeamento de Inundação
| Modelo | Biblioteca | GPU | Tempo | Acurácia | Status |
|---|---|---|---|---|---|
| **NDWI Temporal** ⭐ | numpy | ❌ | <10min | OA>91% | 🔧 Implementar |
| RF Flood | scikit-learn | ❌ | 10-25min | OA>93% | 🔧 Implementar |
| U-Net Flood | pytorch | ✅ | 2-6h | OA>95% | 🔧 Implementar |
| SAR+RF | scikit-learn | ❌ | 15-35min | OA>94% | 🔧 Implementar |

### 17. Impacto de Mineração
| Modelo | Biblioteca | GPU | Tempo | Acurácia | Status |
|---|---|---|---|---|---|
| **RF Mining** ⭐ | scikit-learn | ❌ | 15-35min | OA>88% | 🔧 Implementar |
| XGBoost | xgboost | ❌ | 10-25min | OA>89% | 🔧 Implementar |
| U-Net Mining | pytorch | ✅ | 2-8h | OA>93% | 🔧 Implementar |
| Change Detection | pytorch | ✅ | 2-6h | OA>91% | 🔧 Implementar |

### 18. Extração de Vias
| Modelo | Biblioteca | GPU | Tempo | Acurácia | Status |
|---|---|---|---|---|---|
| **D-LinkNet** ⭐ | pytorch | ✅ | 2-6h | F1>0.84 | 🔧 Implementar |
| SegFormer-B4 | transformers | ✅ | 4-12h | F1>0.87 | 🔧 Implementar |
| DeepLab Roads | tensorflow | ✅ | 3-10h | F1>0.85 | 🔧 Implementar |
| SAM Roads | segment-anything | ✅ | 1-3h | Zero-shot | 🔧 Implementar |

### 19. Estoque de Carbono
| Modelo | Biblioteca | GPU | Tempo | Acurácia | Status |
|---|---|---|---|---|---|
| **RF Carbon** ⭐ | scikit-learn | ❌ | 15-35min | R²>0.84 | 🔧 Implementar |
| XGBoost | xgboost | ❌ | 10-25min | R²>0.86 | 🔧 Implementar |
| EfficientNet | timm | ✅ | 4-12h | R²>0.90 | 🔧 Implementar |
| AGB+Allometric | numpy | ❌ | <10min | Estimativa | 🔧 Implementar |

### 20. Classificação de Solos
| Modelo | Biblioteca | GPU | Tempo | Acurácia | Status |
|---|---|---|---|---|---|
| **RF Solos** ⭐ | scikit-learn | ❌ | 15-35min | OA>87% | 🔧 Implementar |
| SVM RBF | scikit-learn | ❌ | 20-60min | OA>86% | 🔧 Implementar |
| CNN Pedológica | pytorch | ✅ | 2-8h | OA>91% | 🔧 Implementar |
| VNIR Spectral | spectral | ❌ | 10-30min | OA>89% | 🔧 Implementar |

### 21. Análise Topográfica
| Modelo | Biblioteca | GPU | Tempo | Acurácia | Status |
|---|---|---|---|---|---|
| **DEM Analysis** ⭐ | numpy | ❌ | <10min | Alta | 🔧 Implementar |
| RF Topo | scikit-learn | ❌ | 10-25min | OA>90% | 🔧 Implementar |
| CNN Terrain | pytorch | ✅ | 2-5h | OA>93% | 🔧 Implementar |
| TPI+TRI+TWI | numpy | ❌ | <5min | Proxy | 🔧 Implementar |

---

## 🔄 Análises de Imagens 360° (14)

### 1. Reconhecimento de Buracos
| Modelo | Biblioteca | GPU | mAP50 | Status |
|---|---|---|---|---|
| **YOLOv8-x** ⭐ | ultralytics | ✅ | >0.81 | 🔧 Implementar |
| DeepLab v3+ | tensorflow | ✅ | IoU>0.79 | 🔧 Implementar |
| Mask R-CNN | torchvision | ✅ | >0.77 | 🔧 Implementar |
| RT-DETR | transformers | ✅ | >0.83 | 🔧 Implementar |

### 2-14. Demais análises 360°
> Seguem padrão similar com YOLOv8 como modelo recomendado.
> Ver `routers/view360_router.py` para endpoints de cada análise.

---

## 📊 Legenda de Status

| Símbolo | Significado |
|---|---|
| ✅ Disponível | Funcionando no frontend atual |
| 🔧 Implementar | Estrutura criada, aguarda treino |
| ⭐ Recomendado | Melhor custo-benefício |
| ❌ Sem GPU | Roda em CPU comum |
| ✅ GPU | Requer GPU NVIDIA (CUDA) |
