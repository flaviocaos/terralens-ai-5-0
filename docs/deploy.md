# 🚀 Deploy — TerraLens AI

## Frontend (Vercel) — Atual

### Passo a passo
```bash
# 1. Clone e instale
git clone https://github.com/SEU_USUARIO/terralens-ai
cd terralens-ai/frontend
npm install

# 2. Configure variável de ambiente no Vercel Dashboard:
#    VITE_ANTHROPIC_KEY = sua_chave_aqui

# 3. Build
npm run build

# 4. Deploy (automático via GitHub + Vercel)
```

### Variáveis de Ambiente no Vercel
```
VITE_ANTHROPIC_KEY=sk-ant-...
VITE_BACKEND_URL=https://seu-backend.render.com
```

---

## Proxy Seguro (Vercel Functions) — Recomendado

Evita expor a API key no frontend:

### Estrutura
```
frontend/
└── api/
    └── claude.js    ← Vercel Function (serverless)
```

### api/claude.js
```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,  // Segura no servidor!
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    })

    const data = await response.json()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao chamar API' })
  }
}
```

### vercel.json
```json
{
  "functions": {
    "api/claude.js": {
      "memory": 256,
      "maxDuration": 30
    }
  }
}
```

### No frontend — troque a URL:
```javascript
// Antes (inseguro):
fetch("https://api.anthropic.com/v1/messages", { ... })

// Depois (seguro):
fetch("/api/claude", { ... })
```

---

## Backend FastAPI (Render.com) — Próxima Fase

### Passo a passo
```bash
# 1. Crie conta em render.com (gratuito)

# 2. New Web Service → Connect GitHub → selecione terralens-ai

# 3. Configurações:
#    Root Directory: backend
#    Build Command: pip install -r requirements.txt
#    Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT

# 4. Variáveis de ambiente:
#    ANTHROPIC_API_KEY = sua_chave_aqui
```

### Alternativas gratuitas ao Render
| Plataforma | Limite gratuito | Ideal para |
|---|---|---|
| Render.com | 750h/mês, 512MB RAM | Backend leve |
| Railway.app | $5 crédito/mês | Backend com mais RAM |
| Fly.io | 3 VMs gratuitas | Backend persistente |
| HuggingFace Spaces | Ilimitado (CPU) | Modelos ML/DL |

---

## Backend com GPU (Para Modelos DL)

Para rodar U-Net, YOLOv8, SegFormer em produção:

### Google Colab (Gratuito para teste)
```python
# No Colab, instale o ngrok para expor a API:
!pip install fastapi uvicorn pyngrok
from pyngrok import ngrok
ngrok.set_auth_token("SEU_TOKEN_NGROK")
public_url = ngrok.connect(8000)
print(f"Backend disponível em: {public_url}")
```

### AWS EC2 com GPU (Produção)
```
Instância recomendada: g4dn.xlarge (T4 GPU)
Custo: ~$0.50/hora (spot) ou ~$150/mês (on-demand)
```

### HuggingFace Spaces (Gratuito com GPU limitada)
```yaml
# space.yaml
sdk: gradio
python_version: "3.11"
hardware: t4-small   # GPU gratuita limitada
```

---

## Estrutura Final de Produção

```
Usuário
   │
   ▼
Vercel (Frontend React)
   │
   ├── /api/claude → Anthropic API (Vision)
   │
   └── /api/analyze → Render.com (FastAPI)
                           │
                           ├── Random Forest (CPU)
                           ├── XGBoost (CPU)
                           └── [Futuro] U-Net (GPU)
```

---

## Monitoramento

### Vercel Analytics (gratuito)
```javascript
// frontend/src/main.jsx
import { inject } from '@vercel/analytics'
inject()
```

### Sentry (erros)
```bash
npm install @sentry/react
```

### Uptime Robot (monitoramento gratuito)
- Monitora se o backend está online
- Alertas por email/Telegram
- https://uptimerobot.com
