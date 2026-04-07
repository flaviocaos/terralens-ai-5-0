"""
TerraLens AI — Utilitários de Métricas
Funções para calcular métricas de avaliação de modelos geoespaciais
"""

import numpy as np
from typing import List, Dict


def overall_accuracy(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    """Acurácia geral (OA)."""
    return float(np.mean(y_true == y_pred))


def kappa_coefficient(y_true: np.ndarray, y_pred: np.ndarray, n_classes: int) -> float:
    """
    Coeficiente Kappa de Cohen.
    Mede concordância além do acaso.
    Kappa > 0.8 = Excelente | 0.6-0.8 = Bom | 0.4-0.6 = Moderado
    """
    n = len(y_true)
    confusion = np.zeros((n_classes, n_classes), dtype=np.int64)
    for t, p in zip(y_true, y_pred):
        confusion[t][p] += 1

    po = np.trace(confusion) / n
    pe = np.sum(confusion.sum(axis=0) * confusion.sum(axis=1)) / (n ** 2)
    return float((po - pe) / (1 - pe + 1e-9))


def mean_iou(y_true: np.ndarray, y_pred: np.ndarray, n_classes: int) -> float:
    """
    Mean Intersection over Union (mIoU).
    Métrica padrão para segmentação semântica.
    """
    ious = []
    for c in range(n_classes):
        tp = np.sum((y_true == c) & (y_pred == c))
        fp = np.sum((y_true != c) & (y_pred == c))
        fn = np.sum((y_true == c) & (y_pred != c))
        union = tp + fp + fn
        if union > 0:
            ious.append(tp / union)
    return float(np.mean(ious)) if ious else 0.0


def dice_score(y_true: np.ndarray, y_pred: np.ndarray, n_classes: int) -> float:
    """
    Dice Score (F1 por pixel).
    Complementar ao mIoU para segmentação.
    """
    dices = []
    for c in range(n_classes):
        tp = np.sum((y_true == c) & (y_pred == c))
        fp = np.sum((y_true != c) & (y_pred == c))
        fn = np.sum((y_true == c) & (y_pred != c))
        denom = 2 * tp + fp + fn
        if denom > 0:
            dices.append(2 * tp / denom)
    return float(np.mean(dices)) if dices else 0.0


def confusion_matrix_report(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    class_names: List[str]
) -> Dict:
    """
    Gera relatório completo com matriz de confusão e métricas por classe.
    """
    n = len(class_names)
    cm = np.zeros((n, n), dtype=np.int64)
    for t, p in zip(y_true, y_pred):
        cm[t][p] += 1

    per_class = []
    for i, name in enumerate(class_names):
        tp = cm[i, i]
        fp = cm[:, i].sum() - tp
        fn = cm[i, :].sum() - tp
        tn = cm.sum() - tp - fp - fn

        precision = tp / (tp + fp) if (tp + fp) > 0 else 0
        recall    = tp / (tp + fn) if (tp + fn) > 0 else 0
        f1        = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0

        per_class.append({
            "classe": name,
            "precision": round(precision, 4),
            "recall":    round(recall, 4),
            "f1":        round(f1, 4),
            "suporte":   int(cm[i, :].sum()),
        })

    return {
        "overall_accuracy": round(overall_accuracy(y_true, y_pred), 4),
        "kappa":            round(kappa_coefficient(y_true, y_pred, n), 4),
        "mean_iou":         round(mean_iou(y_true, y_pred, n), 4),
        "dice":             round(dice_score(y_true, y_pred, n), 4),
        "por_classe":       per_class,
        "confusion_matrix": cm.tolist(),
    }
