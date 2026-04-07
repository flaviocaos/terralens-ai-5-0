import { useState, useRef, useEffect } from "react";

const C = {
  bg:"#080c14",bg2:"#0d1422",bg3:"#111827",panel:"#131d2e",
  border:"#1e3050",border2:"#243a5e",
  blue:"#1e7fff",blue2:"#3b9eff",cyan:"#00d4ff",
  green:"#00ff88",yellow:"#ffe44d",red:"#ff4d6d",orange:"#ff9f1c",
  purple:"#a855f7",teal:"#0fffc1",
  text:"#e2eeff",text2:"#8ba3c7",text3:"#4a6a9a",
};

const PAL = [
  {n:"Vegetacao Densa",c:[34,139,34]},{n:"Agricultura",c:[107,142,35]},
  {n:"Solo Exposto",c:[194,154,108]},{n:"Corpo d Agua",c:[30,120,200]},
  {n:"Area Urbana",c:[150,150,160]},{n:"Floresta",c:[0,100,0]},
  {n:"Pastagem",c:[210,180,100]},{n:"Area Umida",c:[0,180,180]},
];

const ANALYSES = [
  {id:"lulc",icon:"🌍",label:"Classificacao LULC",desc:"Uso e cobertura do solo",tags:["ML","DL"],
   models:[
    {name:"Random Forest",lib:"scikit-learn",rec:true,gpu:false,time:"15-40min",compl:"Media",acc:"89-94%",pros:"Alta acuracia, sem GPU",cons:"Nao captura textura espacial"},
    {name:"XGBoost",lib:"xgboost",gpu:false,time:"10-30min",compl:"Media",acc:"88-93%",pros:"Menos overfitting",cons:"Sensivel a escala"},
    {name:"U-Net",lib:"pytorch",gpu:true,time:"2-8h",compl:"Alta",acc:"91-96%",pros:"Bordas precisas",cons:"Requer GPU"},
    {name:"DeepLab v3+",lib:"tensorflow",gpu:true,time:"3-10h",compl:"Alta",acc:"92-97%",pros:"SOTA multiescala",cons:"Alto custo"},
   ]},
  {id:"vigor",icon:"🌿",label:"Vigor e Biomassa",desc:"Saude vegetativa e biomassa",tags:["Indice","ML"],
   models:[
    {name:"RF Regressor",lib:"scikit-learn",rec:true,gpu:false,time:"10-25min",compl:"Media",acc:"R2>0.85",pros:"Rapido, sem GPU",cons:"Limitado para textura"},
    {name:"XGBoost Reg.",lib:"xgboost",gpu:false,time:"8-20min",compl:"Media",acc:"R2>0.87",pros:"Feature importance",cons:"Requer tuning"},
    {name:"EfficientNet",lib:"timm",gpu:true,time:"4-12h",compl:"Alta",acc:"R2>0.91",pros:"Alta capacidade",cons:"300+ amostras"},
    {name:"NDVI Stack",lib:"numpy",gpu:false,time:"<5min",compl:"Baixa",acc:"Proxy",pros:"Instantaneo",cons:"Sem padrao espacial"},
   ]},
  {id:"queimadas",icon:"🔥",label:"Queimadas e Severidade",desc:"Areas queimadas e fogo",tags:["Indice","ML"],
   models:[
    {name:"NBR + dNBR",lib:"numpy",rec:true,gpu:false,time:"<10min",compl:"Baixa",acc:"OA>90%",pros:"Padrao USGS",cons:"Precisa pre/pos-fogo"},
    {name:"Random Forest",lib:"scikit-learn",gpu:false,time:"15-30min",compl:"Media",acc:"OA>92%",pros:"Contexto espacial",cons:"Amostras de treino"},
    {name:"U-Net Fire",lib:"pytorch",gpu:true,time:"2-6h",compl:"Alta",acc:"OA>94%",pros:"Cicatrizes sutis",cons:"Requer GPU"},
    {name:"DeepLab v3+",lib:"tensorflow",gpu:true,time:"3-8h",compl:"Alta",acc:"OA>95%",pros:"Grandes areas",cons:"Complexo"},
   ]},
  {id:"urban",icon:"🏙️",label:"Expansao Urbana",desc:"Impermeabilizacao e ilhas de calor",tags:["ML","DL"],
   models:[
    {name:"Random Forest",lib:"scikit-learn",rec:true,gpu:false,time:"15-40min",compl:"Media",acc:"OA>90%",pros:"Robusto, sem GPU",cons:"Objetos pequenos"},
    {name:"U-Net Urban",lib:"pytorch",gpu:true,time:"2-8h",compl:"Alta",acc:"OA>94%",pros:"Edificacoes precisas",cons:"Requer GPU"},
    {name:"Mask R-CNN",lib:"torchvision",gpu:true,time:"4-16h",compl:"M.Alta",acc:"mAP>0.82",pros:"Instance segmentation",cons:"Muito lento"},
    {name:"SegFormer-B2",lib:"transformers",gpu:true,time:"3-10h",compl:"Alta",acc:"OA>95%",pros:"SOTA cenas densas",cons:"Pesado"},
   ]},
  {id:"hidro",icon:"💧",label:"Dinamica Hidrica",desc:"Corpos d agua e inundacoes",tags:["Indice","ML"],
   models:[
    {name:"NDWI+MNDWI",lib:"numpy",rec:true,gpu:false,time:"<10min",compl:"Baixa",acc:"OA>92%",pros:"Rapido e validado",cons:"Confunde sombra"},
    {name:"Random Forest",lib:"scikit-learn",gpu:false,time:"10-25min",compl:"Media",acc:"OA>94%",pros:"Tipos de agua",cons:"Amostras de treino"},
    {name:"U-Net Hydro",lib:"pytorch",gpu:true,time:"2-6h",compl:"Alta",acc:"OA>96%",pros:"Rios estreitos",cons:"Requer GPU"},
    {name:"DeepLab v3+",lib:"tensorflow",gpu:true,time:"3-8h",compl:"Alta",acc:"OA>96%",pros:"Deltas e zonas umidas",cons:"Complexo"},
   ]},
  {id:"floresta",icon:"🌲",label:"Cobertura Florestal",desc:"Densidade e fragmentacao",tags:["ML","DL"],
   models:[
    {name:"Random Forest",lib:"scikit-learn",rec:true,gpu:false,time:"15-40min",compl:"Media",acc:"OA>91%",pros:"Robusto, sem GPU",cons:"Sub-dossel limitado"},
    {name:"XGBoost",lib:"xgboost",gpu:false,time:"10-25min",compl:"Media",acc:"OA>92%",pros:"Com indices espectrais",cons:"Requer tuning"},
    {name:"U-Net Forest",lib:"pytorch",gpu:true,time:"2-8h",compl:"Alta",acc:"OA>95%",pros:"Clareiras e bordas",cons:"Requer GPU"},
    {name:"EfficientNet+UNet",lib:"pytorch",gpu:true,time:"3-10h",compl:"Alta",acc:"OA>96%",pros:"Transfer learning",cons:"Dados especificos"},
   ]},
  {id:"erosao",icon:"🏔️",label:"Erosao e Degradacao",desc:"Risco erosivo e degradacao",tags:["ML"],
   models:[
    {name:"Random Forest",lib:"scikit-learn",rec:true,gpu:false,time:"15-35min",compl:"Media",acc:"OA>88%",pros:"Combina indices+MDE",cons:"Precisa de MDE"},
    {name:"XGBoost",lib:"xgboost",gpu:false,time:"10-25min",compl:"Media",acc:"OA>89%",pros:"Variaveis mistas",cons:"Feature engineering"},
    {name:"SVM RBF",lib:"scikit-learn",gpu:false,time:"20-60min",compl:"Media",acc:"OA>87%",pros:"Amostras pequenas",cons:"Lento em imagens grandes"},
    {name:"CNN+MDE",lib:"pytorch",gpu:true,time:"3-8h",compl:"Alta",acc:"OA>93%",pros:"Imagem+elevacao",cons:"Dados auxiliares+GPU"},
   ]},
  {id:"fragmentacao",icon:"🕸️",label:"Fragmentacao",desc:"Conectividade ecologica",tags:["ML"],
   models:[
    {name:"RF+FRAGSTATS",lib:"scikit-learn",rec:true,gpu:false,time:"20-50min",compl:"Media",acc:"OA>89%",pros:"Metricas de paisagem",cons:"Requer LULC"},
    {name:"XGBoost",lib:"xgboost",gpu:false,time:"15-35min",compl:"Media",acc:"OA>90%",pros:"Multiplas metricas",cons:"Complexo"},
    {name:"Graph Net",lib:"pytorch-geometric",gpu:true,time:"4-12h",compl:"M.Alta",acc:"OA>94%",pros:"Conectividade como grafo",cons:"GPU+expertise"},
    {name:"OBIA+Grafos",lib:"scikit-learn",gpu:false,time:"30-90min",compl:"Alta",acc:"OA>91%",pros:"Orientado a objetos",cons:"Configuracao complexa"},
   ]},
  {id:"segmentation",icon:"🧩",label:"Segmentacao Semantica",desc:"Pixel a pixel com bordas",tags:["DL","GPU"],
   models:[
    {name:"U-Net Geo",lib:"pytorch",rec:true,gpu:true,time:"2-8h",compl:"Alta",acc:"mIoU>0.82",pros:"Padrao ouro SR",cons:"GPU+ground truth"},
    {name:"SegFormer-B4",lib:"transformers",gpu:true,time:"4-12h",compl:"Alta",acc:"mIoU>0.86",pros:"SOTA atual",cons:"Pesado"},
    {name:"DeepLab v3+",lib:"tensorflow",gpu:true,time:"3-10h",compl:"Alta",acc:"mIoU>0.84",pros:"Dilated conv",cons:"Complexo"},
    {name:"SAM",lib:"segment-anything",gpu:true,time:"1-3h",compl:"Alta",acc:"Zero-shot",pros:"Sem anotacoes",cons:"Apenas RGB"},
   ]},
  {id:"detection",icon:"🔍",label:"Deteccao de Objetos",desc:"Pivos, edificacoes, silos",tags:["DL","GPU"],
   models:[
    {name:"YOLOv8-x",lib:"ultralytics",rec:true,gpu:true,time:"1-4h",compl:"Alta",acc:"mAP50>0.78",pros:"Rapido, excelente mAP",cons:"Objetos>10px GSD"},
    {name:"Mask R-CNN",lib:"torchvision",gpu:true,time:"4-16h",compl:"M.Alta",acc:"mAP50>0.75",pros:"Instance segmentation",cons:"Muito lento"},
    {name:"RT-DETR",lib:"transformers",gpu:true,time:"2-8h",compl:"Alta",acc:"mAP50>0.81",pros:"Sem anchor boxes",cons:"Muitos dados"},
    {name:"RetinaNet",lib:"torchvision",gpu:true,time:"2-6h",compl:"Alta",acc:"mAP50>0.72",pros:"Classes raras",cons:"Mais lento que YOLO"},
   ]},
  {id:"change",icon:"📊",label:"Mudancas Temporais",desc:"Alteracoes entre datas",tags:["DL","ML"],
   models:[
    {name:"Siamese U-Net",lib:"pytorch",rec:true,gpu:true,time:"2-6h",compl:"Alta",acc:"OA>91%",pros:"Mudancas sutis pixel a pixel",cons:"Pares anotados"},
    {name:"CVA+K-Means",lib:"scikit-learn",gpu:false,time:"<30min",compl:"Baixa",acc:"OA>84%",pros:"Sem supervisao",cons:"Variacoes sazonais"},
    {name:"BIT Transformer",lib:"pytorch",gpu:true,time:"3-8h",compl:"Alta",acc:"OA>93%",pros:"Attention cross-temporal",cons:"Pesado"},
    {name:"PCA-KMeans",lib:"scikit-learn",gpu:false,time:"<15min",compl:"Baixa",acc:"OA>80%",pros:"Ultra-rapido",cons:"Baixa discriminacao"},
   ]},
  {id:"spectral",icon:"📈",label:"Indices Espectrais",desc:"NDVI, EVI, NDWI, NBR",tags:["Indice"],
   models:[
    {name:"Stack RGB JS",lib:"JavaScript",rec:true,gpu:false,time:"<1min",compl:"Baixa",acc:"Proxy RGB",pros:"100% browser",cons:"Sem NIR real"},
    {name:"NDVI/EVI reais",lib:"rasterio+numpy",gpu:false,time:"<5min",compl:"Baixa",acc:"Alta (NIR)",pros:"Padrao ouro",cons:"Requer multiespectral"},
    {name:"Hiperespectral",lib:"spectral",gpu:false,time:"10-30min",compl:"Media",acc:"Alta",pros:"Assinatura completa",cons:"Sensor especifico"},
    {name:"RF Indices",lib:"scikit-learn",gpu:false,time:"10-25min",compl:"Media",acc:"R2>0.88",pros:"Combina indices",cons:"Requer calibracao"},
   ]},
];

// ── helpers ──
const Box = ({style,...p}) => <div style={style} {...p}/>;
const Btn = ({variant="primary",style,...p}) => {
  const v = {
    primary:{background:`linear-gradient(135deg,${C.blue},${C.cyan})`,color:"#fff",border:"none"},
    secondary:{background:"transparent",border:`1px solid ${C.border2}`,color:C.text},
    ghost:{background:"transparent",border:`1px solid ${C.border}`,color:C.text2},
  };
  return <button style={{padding:"8px 18px",borderRadius:7,fontSize:12,fontWeight:700,cursor:"pointer",...v[variant],...style}} {...p}/>;
};
const Card = ({style,...p}) => <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:12,padding:16,...style}} {...p}/>;
const Pill = ({color,children}) => <span style={{padding:"3px 9px",borderRadius:20,fontSize:10,fontWeight:700,background:`${color}18`,border:`1px solid ${color}44`,color}}>{children}</span>;
const Tag = ({t}) => <span style={{padding:"2px 7px",borderRadius:10,fontSize:9,fontWeight:700,background:t==="DL"?"rgba(168,85,247,.12)":t==="ML"?"rgba(59,158,255,.12)":"rgba(0,255,136,.12)",border:`1px solid ${t==="DL"?"rgba(168,85,247,.3)":t==="ML"?"rgba(59,158,255,.3)":"rgba(0,255,136,.3)"}`,color:t==="DL"?C.purple:t==="ML"?C.blue2:C.green}}>{t}</span>;
const MetCard = ({label,value,color}) => (
  <Card style={{padding:13,textAlign:"center"}}>
    <div style={{fontSize:19,fontWeight:800,color:color||C.cyan,marginBottom:3}}>{value??"-"}</div>
    <div style={{fontSize:9,color:C.text3,textTransform:"uppercase",letterSpacing:.4}}>{label}</div>
  </Card>
);

// ── JS engine ──
function computeMetrics(imageData) {
  const {data,width,height} = imageData;
  const n = width*height;
  let vegC=0,waterC=0,bareC=0,sNDVI=0,sGLI=0,sVARI=0;
  const hist = new Array(20).fill(0);
  for (let i=0;i<n;i++) {
    const r=data[i*4]/255,g=data[i*4+1]/255,b=data[i*4+2]/255;
    const ngrdi=(g-r)/(g+r+1e-9);
    const ndwi=(g-b)/(g+b+1e-9);
    const gli=(2*g-r-b)/(2*g+r+b+1e-9);
    const vari=(g-r)/(g+r-b+1e-9);
    sNDVI+=ngrdi; sGLI+=gli; sVARI+=vari;
    if(ngrdi>0.05) vegC++; else if(ndwi>0.05) waterC++; else bareC++;
    const bi=Math.floor((ngrdi+1)/2*20); hist[Math.min(Math.max(bi,0),19)]++;
  }
  return {
    ndvi_proxy:+(sNDVI/n).toFixed(4),gli:+(sGLI/n).toFixed(4),vari:+(sVARI/n).toFixed(4),
    cobertura_vegetal_pct:+(vegC/n*100).toFixed(1),
    cobertura_hidrica_pct:+(waterC/n*100).toFixed(1),
    solo_exposto_pct:+(bareC/n*100).toFixed(1),
    ndvi_hist:hist,width,height,pixels:n,
  };
}

function kMeans(pixels,k=5,iter=25) {
  const n=pixels.length;
  const centers=[pixels[Math.floor(Math.random()*n)].slice()];
  while(centers.length<k){
    const dists=pixels.map(p=>{let m=Infinity;centers.forEach(c=>{const d=p.reduce((s,v,i)=>s+(v-c[i])**2,0);if(d<m)m=d;});return m;});
    const tot=dists.reduce((a,b)=>a+b,0);let r=Math.random()*tot,cum=0;
    for(let i=0;i<n;i++){cum+=dists[i];if(cum>=r){centers.push(pixels[i].slice());break;}}
  }
  const labels=new Int32Array(n);
  for(let it=0;it<iter;it++){
    let ch=0;
    for(let i=0;i<n;i++){
      let best=0,bd=Infinity;
      centers.forEach((c,ci)=>{const d=pixels[i].reduce((s,v,j)=>s+(v-c[j])**2,0);if(d<bd){bd=d;best=ci;}});
      if(labels[i]!==best){labels[i]=best;ch++;}
    }
    if(!ch)break;
    const sums=Array.from({length:k},()=>new Float32Array(3)),counts=new Int32Array(k);
    for(let i=0;i<n;i++){pixels[i].forEach((v,j)=>{sums[labels[i]][j]+=v;});counts[labels[i]]++;}
    centers.forEach((c,ci)=>{if(counts[ci]>0)c.forEach((_,j)=>{c[j]=sums[ci][j]/counts[ci];});});
  }
  return {labels,centers};
}

function makeLULC(imageData,labels,k){
  const {width,height}=imageData;
  const cv=document.createElement("canvas");cv.width=width;cv.height=height;
  const ctx=cv.getContext("2d"),out=ctx.createImageData(width,height);
  const counts=new Array(k).fill(0);
  for(let i=0;i<labels.length;i++)counts[labels[i]]++;
  const order=counts.map((c,i)=>({i,c})).sort((a,b)=>b.c-a.c).map(x=>x.i);
  const remap=new Int32Array(k);order.forEach((orig,rank)=>{remap[orig]=rank;});
  for(let i=0;i<labels.length;i++){
    const rank=remap[labels[i]],[r,g,b]=PAL[rank%PAL.length].c;
    out.data[i*4]=r;out.data[i*4+1]=g;out.data[i*4+2]=b;out.data[i*4+3]=210;
  }
  ctx.putImageData(out,0,0);
  const classes=Array.from({length:k},(_,rank)=>{
    const orig=order[rank],pal=PAL[rank%PAL.length];
    return {nome:pal.n,cor:`#${pal.c.map(v=>v.toString(16).padStart(2,"0")).join("")}`,area_pct:+(counts[orig]/labels.length*100).toFixed(1)};
  }).sort((a,b)=>b.area_pct-a.area_pct);
  return {url:cv.toDataURL("image/png"),classes};
}

function makeNDVI(imageData){
  const {width,height,data}=imageData;
  const cv=document.createElement("canvas");cv.width=width;cv.height=height;
  const ctx=cv.getContext("2d"),out=ctx.createImageData(width,height);
  const stops=[[139,0,0],[255,69,0],[255,215,0],[124,252,0],[0,100,0]];
  const cAt=t=>{t=Math.max(0,Math.min(1,t));const seg=(stops.length-1)*t,lo=Math.floor(seg),hi=Math.min(lo+1,stops.length-1),f=seg-lo;return stops[lo].map((v,i)=>Math.round(v+(stops[hi][i]-v)*f));};
  for(let i=0;i<width*height;i++){
    const g=data[i*4+1]/255,r=data[i*4]/255,v=(g-r)/(g+r+1e-9);
    const [cr,cg,cb]=cAt((v+1)/2);
    out.data[i*4]=cr;out.data[i*4+1]=cg;out.data[i*4+2]=cb;out.data[i*4+3]=220;
  }
  ctx.putImageData(out,0,0);return cv.toDataURL("image/png");
}

function buildPrompt(id,model,js,ctx){
  const base=`Voce e o motor de analise geoespacial do TerraLens AI.
Analise: ${id.toUpperCase()} | Modelo: ${model}
Contexto: "${ctx||"nao informado"}"
Metricas JS: ${JSON.stringify(js)}
Retorne APENAS JSON valido (sem markdown):`;
  const s={
    lulc:base+'{"titulo":"Classificacao LULC","sensor_estimado":"string","bioma":"string","classes":[{"nome":"string","cor":"#hex","area_pct":0,"descricao":"string"}],"acuracia_estimada":0,"kappa_estimado":0,"interpretacao":"string","alertas":["string"],"recomendacoes":["string"]}',
    vigor:base+'{"titulo":"Vigor e Biomassa","cultura_estimada":"string","estadio_fenologico":"string","ndvi_medio":0,"saude_vegetacao":"Otima|Boa|Regular|Critica","estresse_hidrico_pct":0,"falhas_plantio_pct":0,"biomassa_relativa":"Alta|Media|Baixa","zonas":[{"nome":"string","area_pct":0,"cor":"#hex","status":"Bom|Atencao|Critico"}],"interpretacao":"string","alertas":["string"],"recomendacoes":["string"]}',
    queimadas:base+'{"titulo":"Queimadas","area_queimada_pct":0,"severidade_dominante":"Alta|Media|Baixa","nbr_estimado":0,"risco_requeimada":"Alto|Medio|Baixo","interpretacao":"string","alertas":["string"],"recomendacoes":["string"]}',
    urban:base+'{"titulo":"Expansao Urbana","impermeabilizacao_pct":0,"densidade_construcoes":"Alta|Media|Baixa","vegetacao_urbana_pct":0,"risco_ilha_calor":"Alto|Medio|Baixo","classes":[{"nome":"string","cor":"#hex","area_pct":0}],"interpretacao":"string","alertas":["string"],"recomendacoes":["string"]}',
    hidro:base+'{"titulo":"Dinamica Hidrica","cobertura_hidrica_pct":0,"ndwi_estimado":0,"risco_inundacao":"Alto|Medio|Baixo","qualidade_aparente":"Boa|Regular|Comprometida","interpretacao":"string","alertas":["string"],"recomendacoes":["string"]}',
    floresta:base+'{"titulo":"Cobertura Florestal","cobertura_total_pct":0,"tipo_vegetacao":"string","densidade_copa":"Alta|Media|Baixa","fragmentacao":"Alta|Media|Baixa","clareiras_pct":0,"conectividade":"Alta|Media|Baixa","interpretacao":"string","alertas":["string"],"recomendacoes":["string"]}',
    erosao:base+'{"titulo":"Erosao","risco_erosivo":"Alto|Medio|Baixo","solo_exposto_pct":0,"indice_integridade":0,"pressao_antropica":"Alta|Media|Baixa","interpretacao":"string","alertas":["string"],"recomendacoes":["string"]}',
    fragmentacao:base+'{"titulo":"Fragmentacao","n_fragmentos_estimado":0,"fragmentacao":"Alta|Media|Baixa","conectividade":"Alta|Media|Baixa","area_nucleo_pct":0,"interpretacao":"string","alertas":["string"],"recomendacoes":["string"]}',
    segmentation:base+'{"titulo":"Segmentacao Semantica","miou_estimado":0,"dice_estimado":0,"pixel_accuracy":0,"segmentos":[{"classe":"string","cor":"#hex","area_pct":0,"iou_estimado":0}],"qualidade_bordas":"Alta|Media|Baixa","interpretacao":"string","alertas":["string"],"recomendacoes":["string"]}',
    detection:base+'{"titulo":"Deteccao de Objetos","map50_estimado":0,"total_objetos":0,"confianca_media":0,"objetos":[{"classe":"string","quantidade":0,"confianca":0,"cor":"#hex"}],"interpretacao":"string","alertas":["string"],"recomendacoes":["string"]}',
    change:base+'{"titulo":"Mudancas Temporais","evidencias_mudanca":["string"],"area_alterada_pct":0,"pressao_principal":"string","taxa_pressao":"Alta|Media|Baixa","interpretacao":"string","alertas":["string"],"recomendacoes":["string"]}',
    spectral:base+'{"titulo":"Indices Espectrais","cobertura_vegetal_pct":0,"cobertura_hidrica_pct":0,"solo_exposto_pct":0,"indices":[{"nome":"string","valor_estimado":0,"interpretacao":"string","status":"Normal|Atencao|Critico"}],"zona_critica":"string","interpretacao":"string","alertas":["string"],"recomendacoes":["string"]}',
  };
  return s[id]||s.lulc;
}

// ── APP ──
export default function App() {
  const [page,setPage] = useState("landing");
  const [image,setImage] = useState(null);
  const [analysis,setAnalysis] = useState(null);
  const [model,setModel] = useState(null);
  const [selModelIdx,setSelModelIdx] = useState(null);
  const [nClass,setNClass] = useState(5);
  const [context,setContext] = useState("");
  const [showModal,setShowModal] = useState(false);
  const [pct,setPct] = useState(0);
  const [pStep,setPStep] = useState("");
  const [running,setRunning] = useState(false);
  const [result,setResult] = useState(null);
  const [jsMetrics,setJsMetrics] = useState(null);
  const [lulcUrl,setLulcUrl] = useState(null);
  const [lulcClasses,setLulcClasses] = useState([]);
  const [ndviUrl,setNdviUrl] = useState(null);
  const [origUrl,setOrigUrl] = useState(null);
  const [tab,setTab] = useState("result");
  const [drag,setDrag] = useState(false);
  const fileRef = useRef();

  const handleFile = f => {
    if(!f) return;
    const r=new FileReader();
    r.onload=e=>setImage({url:e.target.result,base64:e.target.result.split(",")[1],mediaType:f.type||"image/jpeg",name:f.name,size:(f.size/1048576).toFixed(2)+" MB"});
    r.readAsDataURL(f);
  };

  const runAnalysis = () => {
    if(!image||!analysis||!model) return;
    setShowModal(false);
    setRunning(true); setPct(0);
    const steps=[[8,"Carregando imagem..."],[22,"Calculando indices JS..."],[40,"K-Means LULC..."],[58,"Gerando mapas..."],[72,"Claude Vision..."],[88,"Processando..."],[100,"Concluido!"]];
    let si=0;
    const tick=setInterval(()=>{if(si<steps.length){setPct(steps[si][0]);setPStep(steps[si][1]);si++;}},800);

    const img=new Image();
    img.onload=()=>{
      const MAX=480,scale=Math.min(MAX/Math.max(img.width,img.height),1);
      const W=Math.round(img.width*scale),H=Math.round(img.height*scale);
      const cv=document.createElement("canvas");cv.width=W;cv.height=H;
      cv.getContext("2d").drawImage(img,0,0,W,H);
      const idata=cv.getContext("2d").getImageData(0,0,W,H);
      const jm=computeMetrics(idata); setJsMetrics(jm);
      const pixels=[];
      for(let i=0;i<W*H;i++)pixels.push([idata.data[i*4]/255,idata.data[i*4+1]/255,idata.data[i*4+2]/255]);
      const {labels}=kMeans(pixels,nClass,25);
      const lulc=makeLULC(idata,labels,nClass);
      setLulcUrl(lulc.url);setLulcClasses(lulc.classes);
      setNdviUrl(makeNDVI(idata));
      setOrigUrl(cv.toDataURL("image/jpeg",0.85));
      const prompt=buildPrompt(analysis.id,model,jm,context);
      fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,
          messages:[{role:"user",content:[
            {type:"image",source:{type:"base64",media_type:image.mediaType,data:image.base64}},
            {type:"text",text:prompt}
          ]}]})
      }).then(r=>r.json()).then(d=>{
        const txt=(d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("");
        const m=txt.match(/\{[\s\S]*\}/);
        let cr=null;if(m){try{cr=JSON.parse(m[0]);}catch(e){}}
        if(!cr) cr={titulo:analysis.label,interpretacao:"Analise visual concluida. K-Means e indices JS calculados. Claude Vision requer deploy no Netlify para funcionar (bloqueio CORS aqui).",alertas:["Faca deploy no Netlify para habilitar Claude Vision"],recomendacoes:["Acesse netlify.com e publique o arquivo HTML"]};
        clearInterval(tick);setPct(100);
        setResult(cr);setTab("result");
        setTimeout(()=>{setRunning(false);setPage("results");},500);
      }).catch(()=>{
        const cr={titulo:analysis.label,interpretacao:"Analise visual concluida. K-Means e indices JS calculados localmente no navegador. Claude Vision requer deploy no Netlify para funcionar pois o ambiente atual bloqueia chamadas externas.",alertas:["Faca deploy no Netlify para habilitar Claude Vision completo"],recomendacoes:["Copie o codigo, crie index.html, publique no netlify.com"]};
        clearInterval(tick);setPct(100);
        setResult(cr);setTab("result");
        setTimeout(()=>{setRunning(false);setPage("results");},500);
      });
    };
    img.src=image.url;
  };

  const resetAll = () => {
    setImage(null);setAnalysis(null);setModel(null);setSelModelIdx(null);
    setResult(null);setJsMetrics(null);setLulcUrl(null);setLulcClasses([]);
    setNdviUrl(null);setOrigUrl(null);setContext("");
  };

  // ── RUNNING OVERLAY ──
  if(running) return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"Segoe UI,sans-serif",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:C.bg2,border:`1px solid ${C.border2}`,borderRadius:14,padding:32,width:420,textAlign:"center"}}>
        <div style={{fontSize:32,marginBottom:10}}>⚙️</div>
        <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>{analysis?.label}</div>
        <div style={{fontSize:11,color:C.text2,marginBottom:18}}>{model} · TerraLens AI</div>
        <div style={{background:C.bg3,borderRadius:10,height:10,overflow:"hidden",marginBottom:8}}>
          <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${C.blue},${C.cyan})`,borderRadius:10,transition:"width .4s"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11}}>
          <span style={{color:C.text2}}>{pStep}</span>
          <span style={{color:C.cyan,fontWeight:800}}>{pct}%</span>
        </div>
        {image && <img src={image.url} alt="" style={{width:"100%",maxHeight:160,objectFit:"cover",borderRadius:8,border:`1px solid ${C.border}`,marginTop:16,opacity:.6}}/>}
      </div>
    </div>
  );

  // ── LANDING ──
  if(page==="landing") return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"Segoe UI,sans-serif",overflowY:"auto"}}>
      {/* nav */}
      <div style={{background:C.bg2,borderBottom:`1px solid ${C.border}`,padding:"0 24px",height:54,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,background:`linear-gradient(135deg,${C.blue},${C.cyan})`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🛰️</div>
          <div>
            <div style={{fontSize:15,fontWeight:800}}><span style={{color:"#fff"}}>TerraLens </span><span style={{background:`linear-gradient(90deg,${C.blue2},${C.cyan})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>AI</span></div>
            <div style={{fontSize:9,color:C.text3,textTransform:"uppercase",letterSpacing:1}}>Geospatial Intelligence</div>
          </div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <Btn variant="secondary" style={{padding:"7px 16px"}} onClick={()=>setPage("app")}>Entrar</Btn>
          <Btn style={{padding:"7px 16px"}} onClick={()=>setPage("app")}>Iniciar Analise</Btn>
        </div>
      </div>
      {/* hero */}
      <div style={{minHeight:"85vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"48px 20px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(30,127,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(30,127,255,.05) 1px,transparent 1px)`,backgroundSize:"44px 44px"}}/>
        <div style={{position:"absolute",top:"40%",left:"50%",transform:"translate(-50%,-50%)",width:600,height:600,background:`radial-gradient(circle,rgba(30,127,255,.09) 0%,transparent 70%)`,pointerEvents:"none"}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:720}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:7,background:"rgba(30,127,255,.08)",border:`1px solid rgba(30,127,255,.28)`,borderRadius:20,padding:"5px 16px",fontSize:11,color:C.cyan,marginBottom:22,letterSpacing:.5}}>
            🛰️ Sensoriamento Remoto · ML/DL · Analise Geoespacial com IA
          </div>
          <h1 style={{fontSize:"clamp(26px,5vw,52px)",fontWeight:800,lineHeight:1.1,marginBottom:18}}>
            <span style={{color:"#fff"}}>Inteligencia Geoespacial para </span>
            <span style={{background:`linear-gradient(90deg,${C.blue2},${C.cyan})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Qualquer Imagem</span>
          </h1>
          <p style={{fontSize:14,color:C.text2,lineHeight:1.8,marginBottom:32}}>
            Plataforma profissional para analise de imagens de satelite e drone.<br/>
            12 analises · 40+ modelos ML/DL · 100% no navegador · Zero instalacao.
          </p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:40}}>
            <Btn style={{fontSize:15,padding:"13px 30px"}} onClick={()=>setPage("app")}>🚀 Iniciar Analise</Btn>
            <Btn variant="secondary" style={{fontSize:15,padding:"13px 30px"}} onClick={()=>setPage("app")}>Ver Demo</Btn>
          </div>
          <div style={{display:"inline-flex",border:`1px solid ${C.border}`,borderRadius:12,background:C.panel,overflow:"hidden"}}>
            {[["12","Analises"],["40+","Modelos ML/DL"],["10+","Sensores"],["100%","Front-End"]].map(([n,l],i)=>(
              <div key={l} style={{textAlign:"center",padding:"13px 22px",borderRight:i<3?`1px solid ${C.border}`:"none"}}>
                <div style={{fontSize:20,fontWeight:800,background:`linear-gradient(90deg,${C.blue2},${C.cyan})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{n}</div>
                <div style={{fontSize:10,color:C.text3,marginTop:2,textTransform:"uppercase",letterSpacing:.5}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* analises */}
      <div style={{background:C.panel,borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,padding:"40px 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{fontSize:11,color:C.cyan,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6,textAlign:"center"}}>12 ANALISES DISPONIVEIS</div>
          <div style={{fontSize:20,fontWeight:700,textAlign:"center",marginBottom:24}}>Do indice espectral a deteccao com Deep Learning</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:10}}>
            {ANALYSES.map(a=>(
              <Card key={a.id} style={{cursor:"pointer",padding:14}} onClick={()=>{setPage("app");setAnalysis(a);}}>
                <div style={{fontSize:20,marginBottom:6}}>{a.icon}</div>
                <div style={{fontSize:12,fontWeight:700,marginBottom:4}}>{a.label}</div>
                <div style={{fontSize:10,color:C.text2,lineHeight:1.5,marginBottom:8}}>{a.desc}</div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  {a.tags.map(t=><Tag key={t} t={t}/>)}
                  <span style={{padding:"2px 7px",borderRadius:10,fontSize:9,fontWeight:700,background:C.bg3,border:`1px solid ${C.border2}`,color:C.text3}}>{a.models.length} mod.</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      {/* pipeline */}
      <div style={{padding:"40px 24px",maxWidth:1100,margin:"0 auto"}}>
        <div style={{fontSize:11,color:C.cyan,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6,textAlign:"center"}}>COMO FUNCIONA</div>
        <div style={{fontSize:20,fontWeight:700,textAlign:"center",marginBottom:24}}>Pipeline completo em 4 etapas</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
          {[["📤","Upload","Qualquer imagem - satelite, drone, Google Earth"],["🎯","Analise","12 tipos de analise geoespacial disponiveis"],["🤖","Modelo","40+ modelos ML/DL com ficha tecnica completa"],["📊","Resultado","Mapas, metricas, IA e recomendacoes"]].map(([ic,t,d],i)=>(
            <div key={t} style={{padding:"20px 14px",textAlign:"center",background:i%2===0?C.panel:C.bg3,borderRight:i<3?`1px solid ${C.border}`:"none"}}>
              <div style={{fontSize:26,marginBottom:8}}>{ic}</div>
              <div style={{fontSize:12,fontWeight:700,color:C.cyan,marginBottom:5}}>{t}</div>
              <div style={{fontSize:10,color:C.text2,lineHeight:1.5}}>{d}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:"28px",textAlign:"center",borderTop:`1px solid ${C.border}`}}>
        <Btn style={{fontSize:15,padding:"13px 36px"}} onClick={()=>setPage("app")}>Iniciar Analise →</Btn>
        <div style={{fontSize:10,color:C.text3,marginTop:8}}>TerraLens AI v2.0 · 100% Front-End · Netlify/Vercel</div>
      </div>
    </div>
  );

  // ── APP ──
  if(page==="app") return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"Segoe UI,sans-serif"}}>
      {/* nav */}
      <div style={{background:C.bg2,borderBottom:`1px solid ${C.border}`,padding:"0 20px",height:54,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setPage("landing")}>
          <div style={{width:32,height:32,background:`linear-gradient(135deg,${C.blue},${C.cyan})`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🛰️</div>
          <div style={{fontSize:14,fontWeight:800}}><span style={{color:"#fff"}}>TerraLens </span><span style={{background:`linear-gradient(90deg,${C.blue2},${C.cyan})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>AI</span></div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <Pill color={C.green}>✅ 100% Front-End</Pill>
          <Pill color={C.cyan}>⚡ Zero Backend</Pill>
        </div>
      </div>
      <div style={{display:"flex",minHeight:"calc(100vh - 54px)"}}>
        {/* left */}
        <div style={{width:320,flexShrink:0,padding:20,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",gap:14,overflowY:"auto"}}>
          <div>
            <div style={{fontSize:16,fontWeight:700,marginBottom:4}}>Nova Analise</div>
            <div style={{fontSize:11,color:C.text2}}>Upload · Analise · Modelo · Resultado</div>
          </div>
          {/* drop */}
          <div>
            <div style={{fontSize:10,fontWeight:700,color:C.cyan,textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>1. Imagem</div>
            <div onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)}
              onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0]);}}
              onClick={()=>fileRef.current.click()}
              style={{border:`2px dashed ${drag?C.cyan:image?C.green:C.border2}`,borderRadius:12,padding:image?"14px":"24px 16px",textAlign:"center",cursor:"pointer",background:image?"rgba(0,255,136,.025)":"rgba(30,127,255,.015)",transition:".2s"}}>
              <input ref={fileRef} type="file" accept="image/*,.tif,.tiff" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
              {image ? (
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <img src={image.url} alt="" style={{width:80,height:58,objectFit:"cover",borderRadius:6,border:`1px solid ${C.green}`,flexShrink:0}}/>
                  <div style={{textAlign:"left"}}>
                    <div style={{fontSize:11,fontWeight:700,color:C.green}}>{image.name}</div>
                    <div style={{fontSize:10,color:C.text3,marginTop:2}}>{image.size}</div>
                    <div style={{fontSize:10,color:C.text3}}>Clique para trocar</div>
                  </div>
                </div>
              ):(
                <>
                  <div style={{fontSize:30,marginBottom:8}}>🛰️</div>
                  <div style={{fontSize:12,fontWeight:700,marginBottom:4}}>Arraste ou clique</div>
                  <div style={{fontSize:10,color:C.text2,marginBottom:8}}>Satelite · Drone · Google Earth · Aerea</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4,justifyContent:"center"}}>
                    {["PNG","JPG","TIFF","GeoTIFF","WebP"].map(f=><span key={f} style={{padding:"1px 7px",borderRadius:10,fontSize:9,fontWeight:700,background:C.bg3,border:`1px solid ${C.border2}`,color:C.text2}}>{f}</span>)}
                  </div>
                </>
              )}
            </div>
          </div>
          {/* context */}
          <div>
            <div style={{fontSize:10,fontWeight:700,color:C.cyan,textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>2. Contexto (opcional)</div>
            <textarea value={context} onChange={e=>setContext(e.target.value)}
              placeholder="Ex: Sentinel-2, soja, MT, 10m/px, 2024. Ou: drone RGB, 5cm."
              style={{width:"100%",background:C.bg3,border:`1px solid ${C.border}`,borderRadius:7,padding:"8px 10px",color:C.text,fontSize:11,resize:"vertical",minHeight:54,outline:"none",lineHeight:1.6,fontFamily:"inherit",boxSizing:"border-box"}}/>
          </div>
          {/* classes */}
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{fontSize:10,fontWeight:700,color:C.cyan,textTransform:"uppercase",letterSpacing:.5}}>Classes LULC:</div>
            <select value={nClass} onChange={e=>setNClass(Number(e.target.value))}
              style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:6,padding:"6px 10px",color:C.text,fontSize:12,outline:"none"}}>
              {[3,4,5,6,7,8].map(n=><option key={n} value={n}>{n} classes</option>)}
            </select>
          </div>
          {/* sel analysis */}
          {analysis && (
            <div>
              <div style={{fontSize:10,fontWeight:700,color:C.cyan,textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>3. Analise selecionada</div>
              <div style={{background:"rgba(0,212,255,.06)",border:`1px solid rgba(0,212,255,.3)`,borderRadius:8,padding:"10px 12px"}}>
                <div style={{fontSize:9,color:C.text3,textTransform:"uppercase",marginBottom:3}}>Tipo</div>
                <div style={{fontSize:13,fontWeight:700}}>{analysis.icon} {analysis.label}</div>
                <div style={{fontSize:10,color:C.text2,marginTop:2}}>{analysis.desc}</div>
              </div>
            </div>
          )}
          <button onClick={()=>{if(image&&analysis)setShowModal(true);}} disabled={!image||!analysis}
            style={{width:"100%",background:`linear-gradient(135deg,${C.blue},${C.cyan})`,color:"#fff",border:"none",padding:13,borderRadius:8,fontSize:13,fontWeight:700,cursor:(!image||!analysis)?"not-allowed":"pointer",opacity:(!image||!analysis)?.4:1}}>
            {!image?"Carregue uma imagem":!analysis?"Selecione uma analise":"🚀 Executar — Escolher Modelo"}
          </button>
          <button onClick={()=>setPage("landing")} style={{width:"100%",background:"transparent",border:`1px solid ${C.border}`,color:C.text2,padding:8,borderRadius:7,fontSize:12,cursor:"pointer"}}>← Voltar</button>
        </div>
        {/* right: grid */}
        <div style={{flex:1,padding:20,overflowY:"auto",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:10,alignContent:"start"}}>
          {ANALYSES.map(a=>(
            <Card key={a.id} style={{cursor:"pointer",padding:14,border:`1px solid ${analysis?.id===a.id?C.cyan:C.border}`,background:analysis?.id===a.id?"rgba(0,212,255,.07)":C.panel,transition:".15s"}}
              onClick={()=>setAnalysis(a)}>
              <div style={{fontSize:18,marginBottom:5}}>{a.icon}</div>
              <div style={{fontSize:11,fontWeight:700,marginBottom:3}}>{a.label}</div>
              <div style={{fontSize:10,color:C.text2,lineHeight:1.4,marginBottom:6}}>{a.desc}</div>
              <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                {a.tags.map(t=><Tag key={t} t={t}/>)}
                {analysis?.id===a.id && <div style={{marginLeft:"auto",width:7,height:7,borderRadius:"50%",background:C.cyan}}/>}
              </div>
            </Card>
          ))}
        </div>
      </div>
      {/* modal */}
      {showModal && analysis && (
        <div onClick={()=>setShowModal(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.82)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(5px)"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:C.bg2,border:`1px solid ${C.border2}`,borderRadius:14,width:820,maxWidth:"95vw",maxHeight:"90vh",overflow:"hidden",display:"flex",flexDirection:"column"}}>
            <div style={{padding:"15px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:16,fontWeight:800}}>{analysis.icon} {analysis.label}</div>
                <div style={{fontSize:11,color:C.text2,marginTop:3}}>Selecione o modelo mais adequado</div>
              </div>
              <button onClick={()=>setShowModal(false)} style={{width:28,height:28,borderRadius:5,border:`1px solid ${C.border}`,background:C.panel,color:C.text2,cursor:"pointer",fontSize:14}}>✕</button>
            </div>
            <div style={{overflowY:"auto",padding:"14px 20px",flex:1}}>
              <div style={{background:"rgba(30,127,255,.07)",border:`1px solid rgba(30,127,255,.22)`,borderRadius:7,padding:"8px 12px",marginBottom:12,fontSize:11,color:C.text2}}>
                <strong style={{color:C.cyan}}>Contexto:</strong> {analysis.desc} · Imagem: {image?.name} · {image?.size}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {analysis.models.map((m,i)=>{
                  const gc={Baixa:C.green,Media:C.yellow,Alta:C.red,"M.Alta":C.red};
                  return (
                    <div key={m.name} onClick={()=>{setSelModelIdx(i);setModel(m.name);}}
                      style={{background:C.panel,border:`2px solid ${selModelIdx===i?C.green:m.rec?C.cyan:C.border}`,borderRadius:11,padding:13,cursor:"pointer",position:"relative"}}>
                      {m.rec && <div style={{position:"absolute",top:10,right:10,background:`linear-gradient(135deg,${C.cyan},${C.blue2})`,color:"#000",fontSize:9,fontWeight:800,padding:"2px 8px",borderRadius:10}}>✨ Rec.</div>}
                      <div style={{fontSize:14,fontWeight:800,marginBottom:2}}>{m.name}</div>
                      <div style={{fontSize:10,color:C.blue2,fontFamily:"monospace",background:"rgba(59,158,255,.12)",padding:"1px 6px",borderRadius:4,display:"inline-block",marginBottom:7}}>{m.lib}</div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:4,marginBottom:8}}>
                        {[["Compl.",m.compl,gc[m.compl]],["GPU",m.gpu?"Sim":"Nao",m.gpu?C.red:C.green],["Tempo",m.time,""],["Acc.",m.acc,""]].map(([k,v,c])=>(
                          <div key={k} style={{background:C.bg3,borderRadius:5,padding:"4px 5px"}}>
                            <div style={{fontSize:8,color:C.text3,textTransform:"uppercase",marginBottom:2}}>{k}</div>
                            <div style={{fontSize:9,fontWeight:600,color:c||C.text}}>{v}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
                        <div style={{background:"rgba(0,255,136,.05)",border:"1px solid rgba(0,255,136,.15)",borderRadius:5,padding:"4px 6px",fontSize:9,color:"rgba(0,255,136,.85)",lineHeight:1.4}}>✅ {m.pros}</div>
                        <div style={{background:"rgba(255,77,109,.05)",border:"1px solid rgba(255,77,109,.15)",borderRadius:5,padding:"4px 6px",fontSize:9,color:"rgba(255,77,109,.85)",lineHeight:1.4}}>⚠️ {m.cons}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{padding:"12px 20px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:C.bg}}>
              <div>
                <div style={{fontSize:10,color:C.text3}}>Selecionado:</div>
                <div style={{fontSize:13,fontWeight:700,color:selModelIdx!==null?C.green:C.text3}}>{selModelIdx!==null?analysis.models[selModelIdx].name:"—"}</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <Btn variant="secondary" onClick={()=>setShowModal(false)}>Cancelar</Btn>
                <Btn onClick={runAnalysis} style={{opacity:selModelIdx!==null?1:.4}}>▶ Executar</Btn>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ── RESULTS ──
  const r = result||{};
  const js = jsMetrics||{};
  const ai = analysis?.id||"lulc";
  const cls = r.classes||r.segmentos||r.objetos||r.corpos||r.zonas||[];

  let metrics;
  if(ai==="lulc")     metrics=[["Acuracia Est.",`${r.acuracia_estimada||"-"}%`,C.green],["Kappa Est.",r.kappa_estimado||"-",C.cyan],["Classes",r.classes?.length||"-",C.blue2],["Sensor",r.sensor_estimado||"-",C.yellow]];
  else if(ai==="vigor") metrics=[["Saude Veg.",r.saude_vegetacao||"-",C.green],["Estresse Hid.",`${r.estresse_hidrico_pct||0}%`,C.orange],["Biomassa",r.biomassa_relativa||"-",C.teal],["NDVI",r.ndvi_medio||"-",C.green]];
  else if(ai==="queimadas") metrics=[["Area Queimada",`${r.area_queimada_pct||0}%`,C.red],["Severidade",r.severidade_dominante||"-",C.orange],["NBR Est.",r.nbr_estimado||"-",C.yellow],["Risco",r.risco_requeimada||"-",C.red]];
  else if(ai==="urban") metrics=[["Impermeab.",`${r.impermeabilizacao_pct||0}%`,C.purple],["Ilha Calor",r.risco_ilha_calor||"-",C.red],["Veg. Urbana",`${r.vegetacao_urbana_pct||0}%`,C.green],["Densidade",r.densidade_construcoes||"-",C.blue2]];
  else if(ai==="hidro") metrics=[["Cobertura Hid.",`${r.cobertura_hidrica_pct||0}%`,C.cyan],["Risco Inund.",r.risco_inundacao||"-",C.orange],["Qualidade",r.qualidade_aparente||"-",C.teal],["NDWI",r.ndwi_estimado||"-",C.blue2]];
  else if(ai==="floresta") metrics=[["Cobertura",`${r.cobertura_total_pct||0}%`,C.green],["Fragmentacao",r.fragmentacao||"-",C.orange],["Conectividade",r.conectividade||"-",C.cyan],["Clareiras",`${r.clareiras_pct||0}%`,C.yellow]];
  else if(ai==="erosao") metrics=[["Risco Erosivo",r.risco_erosivo||"-",C.orange],["Solo Exposto",`${r.solo_exposto_pct||0}%`,C.red],["Integridade",r.indice_integridade||"-",C.green],["Pressao",r.pressao_antropica||"-",C.yellow]];
  else if(ai==="fragmentacao") metrics=[["Fragmentacao",r.fragmentacao||"-",C.orange],["Conectividade",r.conectividade||"-",C.cyan],["Fragmentos",r.n_fragmentos_estimado||"-",C.blue2],["Area Nucleo",`${r.area_nucleo_pct||0}%`,C.green]];
  else if(ai==="segmentation") metrics=[["mIoU Est.",r.miou_estimado||"-",C.green],["Dice Est.",r.dice_estimado||"-",C.cyan],["Pixel Acc.",r.pixel_accuracy||"-",C.blue2],["Bordas",r.qualidade_bordas||"-",C.yellow]];
  else if(ai==="detection") metrics=[["mAP50 Est.",r.map50_estimado||"-",C.green],["Objetos",r.total_objetos||0,C.yellow],["Confianca",r.confianca_media||"-",C.cyan],["Classes",r.objetos?.length||"-",C.blue2]];
  else if(ai==="change") metrics=[["Area Alterada",`${r.area_alterada_pct||0}%`,C.red],["Pressao",r.taxa_pressao||"-",C.orange],["Principal",(r.pressao_principal||"-").slice(0,14),C.yellow],["Evidencias",(r.evidencias_mudanca||[]).length,C.blue2]];
  else metrics=[["Vegetacao",`${r.cobertura_vegetal_pct||js.cobertura_vegetal_pct||0}%`,C.green],["Hidrica",`${r.cobertura_hidrica_pct||js.cobertura_hidrica_pct||0}%`,C.cyan],["Solo Exp.",`${r.solo_exposto_pct||js.solo_exposto_pct||0}%`,C.orange],["Indices",r.indices?.length||"-",C.blue2]];

  const tabs=[["result","📊 Resultado"],["maps","🗺️ Mapas"],["ia","🧠 Analise IA"],["metrics","📈 Metricas JS"]];

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"Segoe UI,sans-serif"}}>
      {/* nav */}
      <div style={{background:C.bg2,borderBottom:`1px solid ${C.border}`,padding:"0 16px",height:52,display:"flex",alignItems:"center",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>setPage("landing")}>
          <div style={{width:30,height:30,background:`linear-gradient(135deg,${C.blue},${C.cyan})`,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🛰️</div>
          <div style={{fontSize:13,fontWeight:800}}><span style={{color:"#fff"}}>TerraLens </span><span style={{background:`linear-gradient(90deg,${C.blue2},${C.cyan})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>AI</span></div>
        </div>
        {image && <img src={image.url} alt="" style={{width:30,height:30,objectFit:"cover",borderRadius:5,border:`1px solid ${C.green}`}}/>}
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:11,color:C.text2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{image?.name}</div>
          <div style={{fontSize:10,color:C.text3}}>{analysis?.label} · {model}</div>
        </div>
        <Pill color={C.green}>✅ Concluido</Pill>
        <Btn variant="secondary" style={{fontSize:11,padding:"5px 12px"}} onClick={()=>{setPage("app");resetAll();}}>+ Nova</Btn>
        <Btn variant="ghost" style={{fontSize:11,padding:"5px 12px"}} onClick={()=>setPage("landing")}>🏠 Home</Btn>
      </div>
      {/* tabs */}
      <div style={{background:C.bg2,borderBottom:`1px solid ${C.border}`,display:"flex",gap:2,padding:"0 12px",overflowX:"auto"}}>
        {tabs.map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{padding:"10px 14px",fontSize:11,fontWeight:600,cursor:"pointer",border:"none",borderBottom:`2px solid ${tab===id?C.cyan:"transparent"}`,background:"transparent",color:tab===id?C.cyan:C.text3,whiteSpace:"nowrap"}}>
            {label}
          </button>
        ))}
      </div>
      {/* content */}
      <div style={{padding:18,maxWidth:1100,margin:"0 auto",overflowY:"auto"}}>
        {tab==="result" && (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10}}>
              {metrics.map(([l,v,c])=><MetCard key={l} label={l} value={v} color={c}/>)}
            </div>
            {cls.length>0 && (
              <Card>
                <div style={{fontSize:12,fontWeight:700,color:C.cyan,marginBottom:10}}>
                  {ai==="detection"?"Objetos Detectados":ai==="segmentation"?"Segmentos":"Classes Identificadas"}
                </div>
                <div style={{display:"flex",height:16,borderRadius:5,overflow:"hidden",gap:1,marginBottom:10}}>
                  {cls.filter(c=>(c.area_pct||0)>0).map((c,i)=><div key={i} title={c.nome||c.classe||c.tipo} style={{flex:c.area_pct||1,background:c.cor||"#888"}}/>)}
                </div>
                {cls.map((c,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:9,padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                    <div style={{width:11,height:11,borderRadius:3,background:c.cor||"#888",flexShrink:0}}/>
                    <span style={{flex:1,fontSize:12,fontWeight:600}}>{c.nome||c.classe||c.tipo||`Classe ${i+1}`}</span>
                    {c.quantidade!=null && <span style={{fontSize:11,color:C.text2}}>{c.quantidade} obj.</span>}
                    {c.area_pct!=null && <><div style={{width:80,height:5,background:C.bg3,borderRadius:3}}><div style={{height:"100%",width:`${Math.min(c.area_pct,100)}%`,background:c.cor||C.blue,borderRadius:3}}/></div><span style={{fontSize:12,fontWeight:700,color:c.cor||C.text,minWidth:36,textAlign:"right"}}>{c.area_pct}%</span></>}
                  </div>
                ))}
              </Card>
            )}
            {(r.alertas||[]).map((a,i)=>(
              <div key={i} style={{background:"rgba(255,159,28,.06)",border:"1px solid rgba(255,159,28,.3)",borderRadius:8,padding:"9px 12px",fontSize:11,color:C.orange}}>⚠️ {a}</div>
            ))}
          </div>
        )}
        {tab==="maps" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {[[origUrl,"📷 Imagem Original",C.cyan],[lulcUrl,"🌍 Mapa LULC — K-Means",C.green],[ndviUrl,"📈 NDVI Proxy — RdYlGn",C.green]].map(([url,label,c])=>url&&(
              <Card key={label} style={{padding:0,overflow:"hidden"}}>
                <div style={{padding:"7px 11px",background:C.bg3,borderBottom:`1px solid ${C.border}`,fontSize:11,fontWeight:700,color:c}}>{label}</div>
                <img src={url} alt={label} style={{width:"100%",display:"block",maxHeight:260,objectFit:"contain",background:"#000"}}/>
              </Card>
            ))}
            <Card style={{padding:12}}>
              <div style={{fontSize:11,fontWeight:700,color:C.cyan,marginBottom:10}}>Legenda LULC</div>
              {lulcClasses.map((cl,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                  <div style={{width:13,height:13,borderRadius:3,background:cl.cor,flexShrink:0}}/>
                  <span style={{flex:1,fontSize:11}}>{cl.nome}</span>
                  <span style={{fontSize:11,fontWeight:700,color:cl.cor}}>{cl.area_pct}%</span>
                </div>
              ))}
            </Card>
          </div>
        )}
        {tab==="ia" && (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {r.interpretacao && (
              <Card style={{background:"rgba(30,127,255,.04)",borderColor:"rgba(30,127,255,.25)"}}>
                <div style={{fontSize:12,fontWeight:700,color:C.cyan,marginBottom:8}}>🧠 Interpretacao Tecnica — Claude Vision</div>
                <div style={{fontSize:12,color:C.text2,lineHeight:1.75}}>{r.interpretacao}</div>
              </Card>
            )}
            {(r.recomendacoes||[]).length>0 && (
              <Card>
                <div style={{fontSize:12,fontWeight:700,color:C.cyan,marginBottom:8}}>✅ Recomendacoes</div>
                {r.recomendacoes.map((rec,i)=>(
                  <div key={i} style={{display:"flex",gap:9,padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,.04)",fontSize:11,color:C.text2}}>
                    <span style={{color:C.green,fontWeight:700,flexShrink:0}}>{i+1}.</span>{rec}
                  </div>
                ))}
              </Card>
            )}
            <Card style={{background:C.bg3}}>
              <div style={{fontSize:11,fontWeight:700,color:C.cyan,marginBottom:4}}>🤖 Modelo Utilizado</div>
              <div style={{fontSize:13,fontWeight:700}}>{model}</div>
              <div style={{fontSize:10,color:C.text3,marginTop:2}}>{analysis?.label} · TerraLens AI v2.0</div>
            </Card>
          </div>
        )}
        {tab==="metrics" && (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{background:"rgba(255,228,77,.04)",border:"1px solid rgba(255,228,77,.25)",borderRadius:8,padding:"9px 12px",fontSize:11,color:C.yellow}}>
              ℹ️ Metricas calculadas em JavaScript puro no navegador. Proxies RGB: NGRDI aprox. NDVI. Para NIR real use imagem multiespectral.
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10}}>
              {[["NDVI proxy",js.ndvi_proxy,C.green],["GLI",js.gli,C.teal],["VARI",js.vari,"#adff2f"],
                ["Vegetacao",`${js.cobertura_vegetal_pct||0}%`,C.green],["Hidrica",`${js.cobertura_hidrica_pct||0}%`,C.cyan],["Solo Exp.",`${js.solo_exposto_pct||0}%`,C.orange]
              ].map(([l,v,c])=><MetCard key={l} label={l} value={v} color={c}/>)}
            </div>
            <Card>
              <div style={{fontSize:11,fontWeight:700,color:C.cyan,marginBottom:8}}>Histograma NDVI proxy — {(js.pixels||0).toLocaleString()} pixels</div>
              <div style={{display:"flex",alignItems:"flex-end",gap:1.5,height:44}}>
                {(js.ndvi_hist||[]).map((v,i)=>{
                  const maxH=Math.max(...(js.ndvi_hist||[1]),1);
                  return <div key={i} style={{flex:1,height:`${(v/maxH)*100}%`,background:`hsl(${Math.round(i/20*120)},70%,45%)`,borderRadius:"1px 1px 0 0",minHeight:1}}/>;
                })}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:C.text3,marginTop:4}}><span>-1.0</span><span>0</span><span>+1.0</span></div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
