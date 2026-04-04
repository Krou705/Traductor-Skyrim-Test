import { useState, useRef, useEffect, useCallback } from "react";

const CATEGORIES = ["Lugares", "Armas", "Armaduras", "Pociones", "Items", "Habilidades", "Otros"];
const catColors = { Lugares:"#4a9eff", Armas:"#ff6b6b", Armaduras:"#ff9f43", Pociones:"#a29bfe", Items:"#55efc4", Habilidades:"#fdcb6e", Otros:"#aaa" };

// ── NUEVO: lista de idiomas ───────────────────────────────────────────────────
const LANGUAGES = [
  { code:"en",    label:"Inglés" },
  { code:"es",    label:"Español Latino" },
  { code:"es-ES", label:"Español Castellano" },
  { code:"pt",    label:"Portugués" },
  { code:"pt-BR", label:"Portugués (Brasil)" },
  { code:"fr",    label:"Francés" },
  { code:"de",    label:"Alemán" },
  { code:"it",    label:"Italiano" },
  { code:"ja",    label:"Japonés" },
  { code:"ko",    label:"Coreano" },
  { code:"zh",    label:"Chino Simplificado" },
  { code:"ru",    label:"Ruso" },
  { code:"pl",    label:"Polaco" },
  { code:"tr",    label:"Turco" },
];

const DEFAULT_GLOSSARY = [
  { "id": 1,  "en": "Skyrim",              "es": "Skyrim",                           "cat": "Lugares" },
  { "id": 2,  "en": "Whiterun",            "es": "Carrera Blanca",                   "cat": "Lugares" },
  { "id": 3,  "en": "Solitude",            "es": "Soledad",                          "cat": "Lugares" },
  { "id": 4,  "en": "Windhelm",            "es": "Ventalia",                         "cat": "Lugares" },
  { "id": 5,  "en": "Riften",              "es": "Riften",                           "cat": "Lugares" },
  { "id": 6,  "en": "Markarth",            "es": "Markarth",                         "cat": "Lugares" },
  { "id": 7,  "en": "Winterhold",          "es": "Hibernalia",                       "cat": "Lugares" },
  { "id": 8,  "en": "Falkreath",           "es": "Falkreath",                        "cat": "Lugares" },
  { "id": 9,  "en": "Morthal",             "es": "Morthal",                          "cat": "Lugares" },
  { "id": 10, "en": "Dawnstar",            "es": "Lucero del Alba",                  "cat": "Lugares" },
  { "id": 11, "en": "Riverwood",           "es": "Cauce Boscoso",                    "cat": "Lugares" },
  { "id": 12, "en": "Helgen",              "es": "Helgen",                           "cat": "Lugares" },
  { "id": 13, "en": "Bleak Falls Barrow",  "es": "Túmulo de las Cataratas Lúgubres", "cat": "Lugares" },
  { "id": 14, "en": "High Hrothgar",       "es": "Alto Hrothgar",                    "cat": "Lugares" },
  { "id": 15, "en": "Throat of the World", "es": "Garganta del Mundo",               "cat": "Lugares" },
  { "id": 16, "en": "Iron Sword",          "es": "Espada de hierro",                 "cat": "Armas" },
  { "id": 17, "en": "Steel Sword",         "es": "Espada de acero",                  "cat": "Armas" },
  { "id": 18, "en": "Daedric Sword",       "es": "Espada daédrica",                  "cat": "Armas" },
  { "id": 19, "en": "Dragonbone Sword",    "es": "Espada de hueso de dragón",        "cat": "Armas" },
  { "id": 20, "en": "Dragonscale Armor",   "es": "Armadura de escamas de dragón",    "cat": "Armaduras" },
  { "id": 21, "en": "Ebony Armor",         "es": "Armadura de ébano",                "cat": "Armaduras" },
  { "id": 22, "en": "Glass Armor",         "es": "Armadura de cristal",              "cat": "Armaduras" },
  { "id": 23, "en": "Health Potion",       "es": "Poción de salud",                  "cat": "Pociones" },
  { "id": 24, "en": "Mana Potion",         "es": "Poción de magia",                  "cat": "Pociones" },
  { "id": 25, "en": "Dragonborn",          "es": "Dovahkiin",                        "cat": "Otros" },
  { "id": 26, "en": "Fus Ro Dah",          "es": "Fus Ro Dah",                       "cat": "Habilidades" },
  { "id": 27, "en": "Fire Breath",         "es": "Aliento de fuego",                 "cat": "Habilidades" },
  { "id": 28, "en": "Unrelenting Force",   "es": "Fuerza implacable",                "cat": "Habilidades" },
  { "id": 29, "en": "Jarl",               "es": "Jarl",                             "cat": "Otros" },
  { "id": 30, "en": "Thane",              "es": "Thane",                            "cat": "Otros" },
  { "id": 31, "en": "Companions",         "es": "Compañeros",                       "cat": "Otros" },
  { "id": 32, "en": "Thieves Guild",      "es": "Gremio de ladrones",               "cat": "Otros" },
  { "id": 33, "en": "College of Winterhold","es": "Colegio de Hibernalia",          "cat": "Lugares" },
  { "id": 34, "en": "Dark Brotherhood",   "es": "Hermandad Oscura",                 "cat": "Otros" },
  { "id": 35, "en": "Imperial Legion",    "es": "Legión Imperial",                  "cat": "Otros" },
  { "id": 36, "en": "Stormcloaks",        "es": "Capas de la Tormenta",             "cat": "Otros" },
  { "id": 37, "en": "Dragon",             "es": "Dragón",                           "cat": "Otros" },
  { "id": 38, "en": "Giant",              "es": "Gigante",                          "cat": "Otros" },
  { "id": 39, "en": "Troll",              "es": "Trol",                             "cat": "Otros" },
  { "id": 40, "en": "Draugr",             "es": "Draugr",                           "cat": "Otros" },
  { "id": 41, "en": "Falmer",             "es": "Falmer",                           "cat": "Otros" },
  { "id": 42, "en": "Dwemer",             "es": "Dwemer",                           "cat": "Otros" },
  { "id": 43, "en": "Daedra",             "es": "Daedra",                           "cat": "Otros" },
  { "id": 44, "en": "Iron Dagger",        "es": "Daga de hierro",                   "cat": "Armas" },
  { "id": 45, "en": "Steel Dagger",       "es": "Daga de acero",                    "cat": "Armas" },
  { "id": 46, "en": "War Axe",            "es": "Hacha de guerra",                  "cat": "Armas" },
  { "id": 47, "en": "Battleaxe",          "es": "Gran hacha",                       "cat": "Armas" },
  { "id": 48, "en": "Greatsword",         "es": "Mandoble",                         "cat": "Armas" },
  { "id": 49, "en": "Warhammer",          "es": "Martillo de guerra",               "cat": "Armas" },
  { "id": 50, "en": "Bow",               "es": "Arco",                             "cat": "Armas" },
  { "id": 51, "en": "Arrow",             "es": "Flecha",                           "cat": "Armas" },
  { "id": 52, "en": "Bolt",              "es": "Virote",                           "cat": "Armas" },
  { "id": 53, "en": "Staff",             "es": "Bastón",                           "cat": "Armas" },
  { "id": 54, "en": "Magicka Potion",    "es": "Poción de magia",                  "cat": "Pociones" },
  { "id": 55, "en": "Stamina Potion",    "es": "Poción de resistencia",            "cat": "Pociones" },
  { "id": 56, "en": "Poison",            "es": "Veneno",                           "cat": "Pociones" },
  { "id": 57, "en": "Cure Disease",      "es": "Curar enfermedad",                 "cat": "Pociones" },
  { "id": 58, "en": "Light Armor",       "es": "Armadura ligera",                  "cat": "Armaduras" },
  { "id": 59, "en": "Heavy Armor",       "es": "Armadura pesada",                  "cat": "Armaduras" },
  { "id": 60, "en": "Shield",            "es": "Escudo",                           "cat": "Armaduras" },
  { "id": 61, "en": "Helmet",            "es": "Casco",                            "cat": "Armaduras" },
  { "id": 62, "en": "Boots",             "es": "Botas",                            "cat": "Armaduras" },
  { "id": 63, "en": "Gauntlets",         "es": "Guanteletes",                      "cat": "Armaduras" },
  { "id": 64, "en": "Dragonplate Armor", "es": "Armadura de placas de dragón",     "cat": "Armaduras" },
  { "id": 65, "en": "Daedric Armor",     "es": "Armadura daédrica",                "cat": "Armaduras" },
  { "id": 66, "en": "Dragon Priest",     "es": "Sacerdote dragón",                 "cat": "Otros" },
  { "id": 67, "en": "Dragon Priest Mask","es": "Máscara de sacerdote dragón",      "cat": "Items" },
  { "id": 68, "en": "Gold",              "es": "Oro",                              "cat": "Items" },
  { "id": 69, "en": "Lockpick",          "es": "Ganzúa",                           "cat": "Items" },
  { "id": 70, "en": "Lockpicks",         "es": "Ganzúas",                          "cat": "Items" },
  { "id": 71, "en": "Key",               "es": "Llave",                            "cat": "Items" },
  { "id": 72, "en": "Chest",             "es": "Cofre",                            "cat": "Items" },
  { "id": 73, "en": "Door",              "es": "Puerta",                           "cat": "Items" },
  { "id": 74, "en": "Food",              "es": "Comida",                           "cat": "Items" },
  { "id": 75, "en": "Drink",             "es": "Bebida",                           "cat": "Items" },
  { "id": 76, "en": "Water",             "es": "Agua",                             "cat": "Items" },
  { "id": 77, "en": "Meat",              "es": "Carne",                            "cat": "Items" },
  { "id": 78, "en": "Bread",             "es": "Pan",                              "cat": "Items" },
  { "id": 79, "en": "Cheese",            "es": "Queso",                            "cat": "Items" },
  { "id": 80, "en": "Health",            "es": "Salud",                            "cat": "Habilidades" },
  { "id": 81, "en": "Magicka",           "es": "Magia",                            "cat": "Habilidades" },
  { "id": 82, "en": "Stamina",           "es": "Aguante",                          "cat": "Habilidades" },
  { "id": 83, "en": "Carry Weight",      "es": "Capacidad de carga",               "cat": "Habilidades" },
];

const PRESET_SKYRIM = `Traduce el siguiente texto del juego Skyrim al español latino, priorizando la traducción oficial cuando sea posible, manteniendo estrictamente la estructura original, conservando intactas todas las <etiquetas> (como HTML), sin modificar números ni símbolos, respetando exactamente los saltos de línea (el resultado debe tener la misma cantidad de líneas que el original), usando modo imperativo singular para las acciones (por ejemplo: Lleva, Captura, Entrega), evitando caracteres especiales (usa ... o ' en su lugar) y permitiendo el uso de ñ y tildes, y entrega el resultado dentro de un bloque de código.`;

const SYSTEM_PROMPT_DEFAULT = `Eres un traductor experto del videojuego The Elder Scrolls V: Skyrim.
Tu tarea es traducir texto del inglés al español latino (variante latinoamericana).
Reglas:
- Usa el glosario de términos oficiales que se te proporciona y respétalos exactamente.
- Mantén el tono épico y medieval del juego.
- No traduzcas nombres propios que no estén en el glosario.
- Responde ÚNICAMENTE con el texto traducido, sin explicaciones ni comentarios.`;

const DEFAULT_CONFIG = {
  engine: "google",
  claudeKey: "", claudeModel: "claude-sonnet-4-20250514",
  openaiKey: "", openaiModel: "gpt-4o",
  geminiKey: "", geminiModel: "gemini-1.5-pro",
  deeplKey: "",
  customUrl: "", customKey: "", customModel: "",
};

const ENGINE_LABELS = {
  google:"Google Translate (Gratis)",
  claude:"Claude (Anthropic)",
  openai:"ChatGPT (OpenAI)",
  gemini:"Gemini (Google)",
  deepl:"DeepL",
  custom:"API Personalizada"
};

export default function App() {
  const [glossary, setGlossaryState] = useState([]);
  const [glossaryLoaded, setGlossaryLoaded] = useState(false);
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  // ── NUEVO: estados de idioma ──────────────────────────────────────────────
  const [srcLang, setSrcLang] = useState("en");
  const [tgtLang, setTgtLang] = useState("es");
  // ─────────────────────────────────────────────────────────────────────────
  const [systemPrompt, setSystemPrompt] = useState(SYSTEM_PROMPT_DEFAULT);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("translator");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [rateLimitMsg, setRateLimitMsg] = useState("");
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [openCats, setOpenCats] = useState(["Lugares"]);
  const [presets, setPresets] = useState([{ id:1, name:"Skyrim Oficial", text:PRESET_SKYRIM }]);
  const [usePreset, setUsePreset] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(1);
  const [newPresetName, setNewPresetName] = useState("");
  const [newPresetText, setNewPresetText] = useState("");
  const [editPresetId, setEditPresetId] = useState(null);
  const [editPresetName, setEditPresetName] = useState("");
  const [editPresetText, setEditPresetText] = useState("");
  const [newEn, setNewEn] = useState("");
  const [newEs, setNewEs] = useState("");
  const [newCat, setNewCat] = useState("");
  const [detectingCat, setDetectingCat] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editEn, setEditEn] = useState("");
  const [editEs, setEditEs] = useState("");
  const [editCat, setEditCat] = useState("");
  const [config, setConfigState] = useState(DEFAULT_CONFIG);
  const [taHeight, setTaHeight] = useState(220);
  const [showKeyMap, setShowKeyMap] = useState({});

  const exportTextareaRef = useRef();
  const fileRef = useRef();
  const resizingRef = useRef(false);
  const startYRef = useRef(0);
  const startHRef = useRef(0);

  useEffect(() => {
    try {
      const sg = localStorage.getItem("glossary_v2");
      setGlossaryState(sg ? JSON.parse(sg) : DEFAULT_GLOSSARY);
    } catch { setGlossaryState(DEFAULT_GLOSSARY); }
    try {
      const sc = localStorage.getItem("config_v1");
      if (sc) setConfigState(c => ({ ...DEFAULT_CONFIG, ...JSON.parse(sc) }));
    } catch {}
    try {
      const sp = localStorage.getItem("presets_v1");
      if (sp) setPresets(JSON.parse(sp));
    } catch {}
    setGlossaryLoaded(true);
  }, []);

  const saveGlossary = (g) => { setGlossaryState(g); localStorage.setItem("glossary_v2", JSON.stringify(g)); };
  const saveConfig   = (c) => { setConfigState(c);   localStorage.setItem("config_v1",   JSON.stringify(c)); };
  const savePresets  = (p) => { setPresets(p);        localStorage.setItem("presets_v1",  JSON.stringify(p)); };

  const onMouseDown = (e) => { resizingRef.current=true; startYRef.current=e.clientY; startHRef.current=taHeight; e.preventDefault(); };
  useEffect(() => {
    const onMove = (e) => { if (!resizingRef.current) return; setTaHeight(Math.max(120, startHRef.current+(e.clientY-startYRef.current))); };
    const onUp   = () => { resizingRef.current=false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  const buildGlossaryText = () => glossary.map(({en,es}) => `${en} → ${es}`).join("\n");

  // ── NUEVO: helper para label de idioma ────────────────────────────────────
  const langLabel = (code) => LANGUAGES.find(l => l.code === code)?.label || code;

  const callAPI = async (userMsg) => {
    const glossaryBlock = `GLOSARIO:\n${buildGlossaryText()}`;

    const result = await window.require("electron").ipcRenderer.invoke(
      "call-api",
      // ── NUEVO: se pasan srcLang y tgtLang dentro del config ───────────────
      { ...config, srcLang, tgtLang },
      userMsg,
      systemPrompt,
      glossaryBlock
    );

    if (result.error) {
      throw new Error(typeof result.error === "string" ? result.error : result.error.message || JSON.stringify(result.error));
    }

    if (config.engine === "claude")  return result.content?.map(b => b.text || "").join("") || "";
    if (config.engine === "openai")  return result.choices?.[0]?.message?.content || "";
    if (config.engine === "gemini")  return result.candidates?.[0]?.content?.parts?.[0]?.text || "";
    if (config.engine === "deepl")   return result.translations?.[0]?.text || "";
    // ── NUEVO: google ahora devuelve google_text (MyMemory) ───────────────
    if (config.engine === "google")  return result.google_text || "";
    if (config.engine === "custom")  return result.choices?.[0]?.message?.content || result.content?.[0]?.text || "";
    return "";
  };

  const translate = async () => {
    if (!inputText.trim()) return;
    setLoading(true); setError(""); setOutputText(""); setRateLimitMsg("");
    try {
      let userMsg = inputText;
      if (usePreset) { const p=presets.find(p=>p.id===selectedPreset); if(p) userMsg=p.text+"\n"+inputText; }
      const text  = await callAPI(userMsg);
      const clean = text.replace(/^```[\w]*\n?/,"").replace(/\n?```$/,"").trim();
      setOutputText(clean || "Sin respuesta.");
    } catch(e) {
      if (e.message==="rate_limit") {
        const mins = config.engine==="claude" ? 5 : 1;
        setRateLimitMsg(`⚠️ Has alcanzado el límite de mensajes permitidos para ${ENGINE_LABELS[config.engine]}. Vuelve en aproximadamente ${mins} minuto${mins>1?"s":""} para continuar la traducción, o cambia el motor en Configuración.`);
      } else { setError("Error: "+e.message); }
    }
    setLoading(false);
  };

  const detectCategory = async (enWord) => {
    if (!enWord.trim()) return "Otros";
    setDetectingCat(true);
    try {
      const prompt = `Clasifica esta palabra de Skyrim en UNA categoría:\nLugares, Armas, Armaduras, Pociones, Items, Habilidades, Otros.\nResponde SOLO con la categoría.\nPalabra: ${enWord}`;
      const res = await callAPI(prompt);
      const cat = res.trim();
      return CATEGORIES.includes(cat) ? cat : "Otros";
    } catch { return "Otros"; }
    finally { setDetectingCat(false); }
  };

  const handleAddEntry = async () => {
    if (!newEn.trim()||!newEs.trim()) return;
    const cat = newCat || await detectCategory(newEn);
    saveGlossary([...glossary, { id:Date.now(), en:newEn.trim(), es:newEs.trim(), cat }]);
    setNewEn(""); setNewEs(""); setNewCat("");
    if (!openCats.includes(cat)) setOpenCats(p=>[...p,cat]);
  };
  const deleteEntry    = (id) => saveGlossary(glossary.filter(e=>e.id!==id));
  const saveEdit       = () => { saveGlossary(glossary.map(e=>e.id===editId?{...e,en:editEn,es:editEs,cat:editCat}:e)); setEditId(null); };
  const handleCopy     = () => { const ta=exportTextareaRef.current; if(!ta) return; ta.select(); ta.setSelectionRange(0,99999); document.execCommand("copy"); window.getSelection()?.removeAllRanges(); setCopied(true); setTimeout(()=>setCopied(false),2000); };
  const importFromText = () => { try { const p=JSON.parse(importText); const arr=Array.isArray(p)?p:Object.entries(p).map(([en,es],i)=>({id:i+1,en,es,cat:"Otros"})); saveGlossary(arr); setImportText(""); setImportError(""); setShowImport(false); } catch { setImportError("JSON inválido."); } };
  const importGlossary = (e) => { const file=e.target.files[0]; if(!file) return; const r=new FileReader(); r.onload=(ev)=>{ try{ const p=JSON.parse(ev.target.result); saveGlossary(Array.isArray(p)?p:Object.entries(p).map(([en,es],i)=>({id:i+1,en,es,cat:"Otros"}))); }catch{ setImportError("Archivo inválido."); } }; r.readAsText(file); e.target.value=""; };
  const addPreset      = () => { if(!newPresetName.trim()||!newPresetText.trim()) return; const id=Date.now(); savePresets([...presets,{id,name:newPresetName.trim(),text:newPresetText.trim()}]); setSelectedPreset(id); setNewPresetName(""); setNewPresetText(""); };
  const deletePreset   = (id) => { const up=presets.filter(x=>x.id!==id); savePresets(up); if(selectedPreset===id) setSelectedPreset(up[0]?.id||null); };
  const savePresetEdit = (id) => { savePresets(presets.map(x=>x.id===id?{...x,name:editPresetName,text:editPresetText}:x)); setEditPresetId(null); };
  const toggleCat      = (cat) => setOpenCats(p=>p.includes(cat)?p.filter(c=>c!==cat):[...p,cat]);
  // ── NUEVO: intercambiar idiomas ───────────────────────────────────────────
  const swapLangs      = () => { const t=srcLang; setSrcLang(tgtLang); setTgtLang(t); };

  const tabStyle = (t) => ({ padding:"8px 16px", cursor:"pointer", border:"none", borderRadius:"6px 6px 0 0", fontWeight:tab===t?"bold":"normal", background:tab===t?"#1a1a2e":"#2d2d44", color:tab===t?"#e8c87a":"#aaa", fontSize:13 });
  const inp = (ex={}) => ({ background:"#0d0d1a", color:"#ddd", border:"1px solid #3a3a5c", borderRadius:6, padding:"6px 10px", fontSize:13, ...ex });
  const btn = (ex={}) => ({ padding:"6px 12px", background:"#2d2d44", color:"#e8c87a", border:"1px solid #3a3a5c", borderRadius:6, cursor:"pointer", fontSize:12, ...ex });

  const cfgField = (label, key, placeholder="", type="text") => (
    <div style={{ marginBottom:10 }}>
      <label style={{ color:"#888", fontSize:12, display:"block", marginBottom:4 }}>{label}</label>
      <div style={{ display:"flex", gap:6 }}>
        <input type={showKeyMap[key]?"text":type} value={config[key]||""} onChange={e=>saveConfig({...config,[key]:e.target.value})}
          placeholder={placeholder} style={{ ...inp(), flex:1 }} />
        {type==="password" && (
          <button onClick={()=>setShowKeyMap(m=>({...m,[key]:!m[key]}))} style={{ ...btn(), padding:"6px 10px" }}>
            {showKeyMap[key]?"🙈":"👁️"}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ background:"#0d0d1a", minHeight:"100vh", color:"#ddd", fontFamily:"Georgia, serif", padding:20 }}>
      <div style={{ maxWidth:800, margin:"0 auto" }}>

        {/* Header */}
        <div style={{ width:"100%", borderRadius:10, marginBottom:20, height:160, backgroundImage:"url('')", backgroundSize:"cover", backgroundPosition:"center", display:"flex", alignItems:"center", justifyContent:"center", backgroundColor:"#000" }}>
          <span style={{ color:"#e8c87a", fontSize:28, fontWeight:"bold", textShadow:"0 2px 8px #000", letterSpacing:2 }}>⚔️ Traductor Skyrim</span>
        </div>

        {/* Modal Exportar */}
        {showExport && (
          <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center" }} onClick={()=>setShowExport(false)}>
            <div style={{ background:"#1a1a2e",border:"1px solid #3a3a5c",borderRadius:10,padding:24,width:560,maxWidth:"95vw",maxHeight:"80vh",display:"flex",flexDirection:"column" }} onClick={e=>e.stopPropagation()}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
                <span style={{ color:"#e8c87a",fontWeight:"bold" }}>📋 Exportar Glosario</span>
                <button onClick={()=>setShowExport(false)} style={{ background:"none",border:"none",color:"#aaa",cursor:"pointer",fontSize:20 }}>✕</button>
              </div>
              <textarea ref={exportTextareaRef} readOnly value={JSON.stringify(glossary,null,2)}
                style={{ flex:1,minHeight:280,background:"#0d0d1a",color:"#8ddb8d",border:"1px solid #3a3a5c",borderRadius:6,padding:10,fontSize:12,resize:"none",fontFamily:"monospace" }} />
              <button onClick={handleCopy} style={{ marginTop:12,padding:"9px 0",background:copied?"#3a5c3a":"#7c4a1e",color:"#e8c87a",border:"none",borderRadius:6,cursor:"pointer",fontWeight:"bold" }}>
                {copied?"✓ ¡Copiado!":"📋 Copiar al portapapeles"}
              </button>
            </div>
          </div>
        )}

        {/* Modal Importar */}
        {showImport && (
          <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center" }} onClick={()=>setShowImport(false)}>
            <div style={{ background:"#1a1a2e",border:"1px solid #3a3a5c",borderRadius:10,padding:24,width:560,maxWidth:"95vw",maxHeight:"80vh",display:"flex",flexDirection:"column" }} onClick={e=>e.stopPropagation()}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
                <span style={{ color:"#e8c87a",fontWeight:"bold" }}>⬆️ Importar Glosario</span>
                <button onClick={()=>{ setShowImport(false); setImportText(""); setImportError(""); }} style={{ background:"none",border:"none",color:"#aaa",cursor:"pointer",fontSize:20 }}>✕</button>
              </div>
              <textarea value={importText} onChange={e=>setImportText(e.target.value)} placeholder={'[\n  {"id":1,"en":"Iron Sword","es":"Espada de Hierro","cat":"Armas"}\n]'}
                style={{ flex:1,minHeight:240,background:"#0d0d1a",color:"#ddd",border:"1px solid #3a3a5c",borderRadius:6,padding:10,fontSize:12,resize:"none",fontFamily:"monospace" }} />
              {importError && <p style={{ color:"#f87",fontSize:12,marginTop:6 }}>{importError}</p>}
              <div style={{ display:"flex",gap:8,marginTop:12 }}>
                <button onClick={()=>fileRef.current.click()} style={{ flex:1,padding:"9px 0",background:"#2d2d44",color:"#e8c87a",border:"1px solid #3a3a5c",borderRadius:6,cursor:"pointer" }}>📂 Cargar .json</button>
                <button onClick={importFromText} disabled={!importText.trim()} style={{ flex:1,padding:"9px 0",background:importText.trim()?"#7c4a1e":"#444",color:"#e8c87a",border:"none",borderRadius:6,cursor:importText.trim()?"pointer":"default",fontWeight:"bold" }}>✓ Importar texto</button>
              </div>
            </div>
          </div>
        )}

        <input ref={fileRef} type="file" accept=".json" style={{ display:"none" }} onChange={importGlossary} />

        {/* Tabs */}
        <div style={{ display:"flex", gap:4 }}>
          {[["translator","🗡️ Traductor"],["glossary","📖 Glosario"],["prompt","⚙️ Prompt"],["settings","🔧 Configuración"]].map(([id,label])=>(
            <button key={id} style={tabStyle(id)} onClick={()=>setTab(id)}>{label}</button>
          ))}
        </div>

        <div style={{ background:"#1a1a2e", borderRadius:"0 8px 8px 8px", padding:20 }}>

          {/* TRANSLATOR */}
          {tab==="translator" && (
            <div>
              {/* Engine badge */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                <span style={{ fontSize:12, color:"#555" }}>Motor activo:</span>
                <span style={{ fontSize:12, background:"#2d2d44", color:"#e8c87a", border:"1px solid #3a3a5c", borderRadius:12, padding:"2px 10px" }}>
                  {ENGINE_LABELS[config.engine]}
                </span>
              </div>

              {/* ── NUEVO: Selector de idiomas ──────────────────────────────── */}
              <div style={{ display:"flex", alignItems:"flex-end", gap:8, marginBottom:14, padding:"10px 14px", background:"#0d0d1a", borderRadius:8, border:"1px solid #3a3a5c" }}>
                <div style={{ display:"flex", flexDirection:"column", gap:4, flex:1 }}>
                  <span style={{ color:"#888", fontSize:11 }}>Idioma original</span>
                  <select value={srcLang} onChange={e=>setSrcLang(e.target.value)} style={{ ...inp(), cursor:"pointer", fontSize:12 }}>
                    {LANGUAGES.map(l=><option key={l.code} value={l.code}>{l.label}</option>)}
                  </select>
                </div>
                <button onClick={swapLangs} title="Intercambiar idiomas"
                  style={{ ...btn({ padding:"8px 12px", fontSize:18, alignSelf:"flex-end" }) }}>
                  ⇄
                </button>
                <div style={{ display:"flex", flexDirection:"column", gap:4, flex:1 }}>
                  <span style={{ color:"#888", fontSize:11 }}>Idioma destino</span>
                  <select value={tgtLang} onChange={e=>setTgtLang(e.target.value)} style={{ ...inp(), cursor:"pointer", fontSize:12 }}>
                    {LANGUAGES.map(l=><option key={l.code} value={l.code}>{l.label}</option>)}
                  </select>
                </div>
              </div>
              {/* ────────────────────────────────────────────────────────────── */}

              {/* Preset selector */}
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14, padding:"10px 14px", background:"#0d0d1a", borderRadius:8, border:"1px solid #3a3a5c" }}>
                <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", userSelect:"none" }}>
                  <input type="checkbox" checked={usePreset} onChange={e=>setUsePreset(e.target.checked)} style={{ width:16, height:16, accentColor:"#e8c87a" }} />
                  <span style={{ color:"#e8c87a", fontSize:13, fontWeight:"bold" }}>Usar prompt predefinido</span>
                </label>
                {usePreset
                  ? <select value={selectedPreset} onChange={e=>setSelectedPreset(Number(e.target.value))} style={{ ...inp(), flex:1, cursor:"pointer" }}>
                      {presets.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  : <span style={{ color:"#555", fontSize:12 }}>El texto se enviará tal cual</span>
                }
              </div>

              {/* Rate limit banner */}
              {rateLimitMsg && (
                <div style={{ background:"#2a1a0a", border:"1px solid #e8a020", borderRadius:8, padding:"12px 16px", marginBottom:14, display:"flex", gap:10, alignItems:"flex-start" }}>
                  <span style={{ fontSize:20 }}>⏳</span>
                  <div>
                    <p style={{ color:"#e8c87a", fontSize:13, margin:0 }}>{rateLimitMsg}</p>
                    <button onClick={()=>setTab("settings")} style={{ marginTop:6, padding:"3px 10px", background:"#7c4a1e", color:"#e8c87a", border:"none", borderRadius:4, cursor:"pointer", fontSize:12 }}>Cambiar motor →</button>
                  </div>
                </div>
              )}

              {/* Textareas — labels dinámicos + botón borrar */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div>
                  {/* ── NUEVO: label dinámico + botón borrar ── */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                    <label style={{ color:"#e8c87a", fontSize:13 }}>{langLabel(srcLang)}</label>
                    {inputText && (
                      <button onClick={()=>{ setInputText(""); setOutputText(""); setError(""); setRateLimitMsg(""); }}
                        style={{ padding:"2px 8px", background:"#4a1e1e", color:"#f87", border:"none", borderRadius:4, cursor:"pointer", fontSize:11 }}>
                        🗑️ Borrar
                      </button>
                    )}
                  </div>
                  <textarea value={inputText} onChange={e=>setInputText(e.target.value)}
                    placeholder={`Pega aquí el texto en ${langLabel(srcLang)}...`}
                    style={{ width:"100%", height:taHeight, background:"#0d0d1a", color:"#ddd", border:"1px solid #3a3a5c", borderRadius:6, padding:10, fontSize:13, resize:"none", boxSizing:"border-box" }} />
                </div>
                <div>
                  {/* ── NUEVO: label dinámico ── */}
                  <label style={{ color:"#e8c87a", fontSize:13, display:"block", marginBottom:6 }}>{langLabel(tgtLang)}</label>
                  <textarea value={outputText} readOnly placeholder="La traducción aparecerá aquí..."
                    style={{ width:"100%", height:taHeight, background:"#0d0d1a", color:"#8ddb8d", border:"1px solid #3a3a5c", borderRadius:6, padding:10, fontSize:13, resize:"none", boxSizing:"border-box" }} />
                </div>
              </div>

              {/* Resize handle */}
              <div onMouseDown={onMouseDown} style={{ width:"100%", height:8, cursor:"ns-resize", display:"flex", alignItems:"center", justifyContent:"center", marginTop:2, marginBottom:8 }}>
                <div style={{ width:60, height:4, background:"#3a3a5c", borderRadius:2 }} />
              </div>

              {error && <p style={{ color:"#f87", fontSize:13 }}>{error}</p>}
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={translate} disabled={loading||!inputText.trim()}
                  style={{ flex:1, padding:"10px 0", background:loading?"#555":"#7c4a1e", color:"#e8c87a", border:"none", borderRadius:6, cursor:loading?"default":"pointer", fontWeight:"bold", fontSize:14 }}>
                  {loading?"Traduciendo...":"⚔️ Traducir"}
                </button>
                {outputText && (
                  <button onClick={()=>{ const ta=document.createElement("textarea"); ta.value=outputText; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); setCopiedOutput(true); setTimeout(()=>setCopiedOutput(false),2000); }}
                    style={{ padding:"10px 16px", background:copiedOutput?"#3a5c3a":"#2d2d44", color:copiedOutput?"#8ddb8d":"#aaa", border:"1px solid #3a3a5c", borderRadius:6, cursor:"pointer", fontSize:13, transition:"all 0.2s" }}>
                    {copiedOutput?"✓ Copiado":"📋 Copiar"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* GLOSSARY — sin cambios */}
          {tab==="glossary" && (
            <div>
              <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar término..." style={{ ...inp(), flex:1, minWidth:150 }} />
                <button onClick={()=>setShowExport(true)} style={btn()}>⬇️ Exportar</button>
                <button onClick={()=>setShowImport(true)} style={btn()}>⬆️ Importar</button>
              </div>
              <div style={{ background:"#0d0d1a", borderRadius:8, padding:12, marginBottom:16, border:"1px solid #3a3a5c" }}>
                <p style={{ color:"#e8c87a", fontSize:13, fontWeight:"bold", marginBottom:8 }}>+ Nueva entrada</p>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  <input value={newEn} onChange={e=>setNewEn(e.target.value)} placeholder="Inglés" style={{ ...inp(), flex:1, minWidth:120 }} />
                  <input value={newEs} onChange={e=>setNewEs(e.target.value)} placeholder="Español Latino" style={{ ...inp(), flex:1, minWidth:120 }} />
                  <select value={newCat} onChange={e=>setNewCat(e.target.value)} style={{ ...inp(), minWidth:110, cursor:"pointer" }}>
                    <option value="">Auto-detectar</option>
                    {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                  <button onClick={handleAddEntry} disabled={!newEn.trim()||!newEs.trim()||detectingCat}
                    style={{ padding:"6px 14px", background:(!newEn.trim()||!newEs.trim()||detectingCat)?"#444":"#7c4a1e", color:"#e8c87a", border:"none", borderRadius:6, cursor:"pointer", fontWeight:"bold" }}>
                    {detectingCat?"Detectando...":"+ Agregar"}
                  </button>
                </div>
              </div>
              {!glossaryLoaded ? <p style={{ color:"#555" }}>Cargando...</p> : CATEGORIES.map(cat => {
                const entries = glossary.filter(e=>e.cat===cat&&(search===""||e.en.toLowerCase().includes(search.toLowerCase())||e.es.toLowerCase().includes(search.toLowerCase())));
                if (search && entries.length===0) return null;
                const isOpen = openCats.includes(cat);
                return (
                  <div key={cat} style={{ marginBottom:6, border:"1px solid #2a2a3e", borderRadius:8, overflow:"hidden" }}>
                    <div onClick={()=>toggleCat(cat)} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", cursor:"pointer", background:"#0d0d1a", userSelect:"none" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ width:10, height:10, borderRadius:"50%", background:catColors[cat], display:"inline-block" }} />
                        <span style={{ color:catColors[cat], fontWeight:"bold", fontSize:14 }}>{cat}</span>
                        <span style={{ color:"#555", fontSize:12 }}>({entries.length})</span>
                      </div>
                      <span style={{ color:"#555" }}>{isOpen?"▲":"▼"}</span>
                    </div>
                    {isOpen && (
                      <div style={{ padding:"0 8px 8px" }}>
                        {entries.length===0 && <p style={{ color:"#555", fontSize:12, padding:"8px 6px" }}>Sin entradas.</p>}
                        {entries.map(e=>(
                          <div key={e.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 4px", borderBottom:"1px solid #1a1a2e" }}>
                            {editId===e.id ? (
                              <>
                                <input value={editEn} onChange={ev=>setEditEn(ev.target.value)} style={{ ...inp(), flex:1, fontSize:12 }} />
                                <span style={{ color:"#555" }}>→</span>
                                <input value={editEs} onChange={ev=>setEditEs(ev.target.value)} style={{ ...inp(), flex:1, fontSize:12 }} />
                                <select value={editCat} onChange={ev=>setEditCat(ev.target.value)} style={{ ...inp(), fontSize:12, cursor:"pointer" }}>
                                  {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                                </select>
                                <button onClick={saveEdit} style={{ padding:"3px 8px", background:"#3a5c3a", color:"#8ddb8d", border:"none", borderRadius:4, cursor:"pointer" }}>✓</button>
                                <button onClick={()=>setEditId(null)} style={{ padding:"3px 8px", background:"#3a3a5c", color:"#aaa", border:"none", borderRadius:4, cursor:"pointer" }}>✗</button>
                              </>
                            ) : (
                              <>
                                <span style={{ flex:1, color:"#aad4ff", fontSize:13 }}>{e.en}</span>
                                <span style={{ color:"#555", fontSize:12 }}>→</span>
                                <span style={{ flex:1, color:"#8ddb8d", fontSize:13 }}>{e.es}</span>
                                <button onClick={()=>{ setEditId(e.id); setEditEn(e.en); setEditEs(e.es); setEditCat(e.cat); }} style={{ padding:"3px 8px", background:"#2d2d44", color:"#aaa", border:"none", borderRadius:4, cursor:"pointer", fontSize:11 }}>✏️</button>
                                <button onClick={()=>deleteEntry(e.id)} style={{ padding:"3px 8px", background:"#4a1e1e", color:"#f87", border:"none", borderRadius:4, cursor:"pointer", fontSize:11 }}>🗑️</button>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <p style={{ color:"#555", fontSize:12, marginTop:8 }}>{glossary.length} entradas en el glosario</p>
            </div>
          )}

          {/* PROMPT — sin cambios */}
          {tab==="prompt" && (
            <div>
              <div style={{ marginBottom:20, padding:14, background:"#0d0d1a", borderRadius:8, border:"1px solid #3a3a5c" }}>
                <p style={{ color:"#e8c87a", fontWeight:"bold", fontSize:14, marginBottom:12 }}>📌 Presets de Prompt</p>
                {presets.map(p=>(
                  <div key={p.id} style={{ background:"#1a1a2e", borderRadius:6, padding:"10px 12px", marginBottom:8, border:selectedPreset===p.id?"1px solid #e8c87a":"1px solid #2a2a3e" }}>
                    {editPresetId===p.id ? (
                      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                        <input value={editPresetName} onChange={e=>setEditPresetName(e.target.value)} style={inp()} />
                        <textarea value={editPresetText} onChange={e=>setEditPresetText(e.target.value)} style={{ background:"#0d0d1a", color:"#ddd", border:"1px solid #e8c87a", borderRadius:6, padding:8, fontSize:12, minHeight:80, resize:"vertical" }} />
                        <div style={{ display:"flex", gap:6 }}>
                          <button onClick={()=>savePresetEdit(p.id)} style={{ padding:"4px 12px", background:"#3a5c3a", color:"#8ddb8d", border:"none", borderRadius:4, cursor:"pointer" }}>✓ Guardar</button>
                          <button onClick={()=>setEditPresetId(null)} style={{ padding:"4px 12px", background:"#3a3a5c", color:"#aaa", border:"none", borderRadius:4, cursor:"pointer" }}>✗ Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
                        <div style={{ flex:1, cursor:"pointer" }} onClick={()=>setSelectedPreset(p.id)}>
                          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                            <span style={{ color:selectedPreset===p.id?"#e8c87a":"#aaa", fontWeight:"bold", fontSize:13 }}>{p.name}</span>
                            {selectedPreset===p.id && <span style={{ fontSize:10, color:"#e8c87a", border:"1px solid #e8c87a", borderRadius:3, padding:"1px 5px" }}>activo</span>}
                          </div>
                          <p style={{ color:"#666", fontSize:11, margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:460 }}>{p.text}</p>
                        </div>
                        <button onClick={()=>{ setEditPresetId(p.id); setEditPresetName(p.name); setEditPresetText(p.text); }} style={{ padding:"3px 8px", background:"#2d2d44", color:"#aaa", border:"none", borderRadius:4, cursor:"pointer", fontSize:11 }}>✏️</button>
                        <button onClick={()=>deletePreset(p.id)} style={{ padding:"3px 8px", background:"#4a1e1e", color:"#f87", border:"none", borderRadius:4, cursor:"pointer", fontSize:11 }}>🗑️</button>
                      </div>
                    )}
                  </div>
                ))}
                <p style={{ color:"#888", fontSize:12, margin:"12px 0 6px" }}>Agregar nuevo preset:</p>
                <input value={newPresetName} onChange={e=>setNewPresetName(e.target.value)} placeholder="Nombre del preset" style={{ ...inp(), width:"100%", marginBottom:6, boxSizing:"border-box" }} />
                <textarea value={newPresetText} onChange={e=>setNewPresetText(e.target.value)} placeholder="Escribe aquí el prompt completo..."
                  style={{ width:"100%", minHeight:80, background:"#0d0d1a", color:"#ddd", border:"1px solid #3a3a5c", borderRadius:6, padding:8, fontSize:12, resize:"vertical", boxSizing:"border-box", marginBottom:6 }} />
                <button onClick={addPreset} disabled={!newPresetName.trim()||!newPresetText.trim()}
                  style={{ padding:"7px 16px", background:newPresetName.trim()&&newPresetText.trim()?"#7c4a1e":"#444", color:"#e8c87a", border:"none", borderRadius:6, cursor:"pointer", fontWeight:"bold" }}>
                  + Guardar preset
                </button>
              </div>
              <label style={{ color:"#e8c87a", fontSize:13 }}>Prompt del sistema (instrucciones base de la IA)</label>
              <textarea value={systemPrompt} onChange={e=>setSystemPrompt(e.target.value)}
                style={{ width:"100%", height:200, marginTop:8, background:"#0d0d1a", color:"#ddd", border:"1px solid #3a3a5c", borderRadius:6, padding:12, fontSize:13, resize:"vertical", boxSizing:"border-box" }} />
              <button onClick={()=>setSystemPrompt(SYSTEM_PROMPT_DEFAULT)} style={{ marginTop:8, ...btn() }}>↺ Restaurar por defecto</button>
              <p style={{ color:"#555", fontSize:12, marginTop:8 }}>El glosario se agrega automáticamente al prompt en cada traducción.</p>
            </div>
          )}

          {/* SETTINGS — sin cambios */}
          {tab==="settings" && (
            <div>
              <p style={{ color:"#e8c87a", fontWeight:"bold", fontSize:15, marginBottom:16 }}>🔧 Configuración del Motor</p>
              <div style={{ marginBottom:16 }}>
                <label style={{ color:"#888", fontSize:12, display:"block", marginBottom:6 }}>Motor de traducción activo</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {Object.entries(ENGINE_LABELS).map(([key,label])=>(
                    <button key={key} onClick={()=>saveConfig({...config,engine:key})}
                      style={{ padding:"7px 14px", borderRadius:6, border:"1px solid", cursor:"pointer", fontSize:12, fontWeight:config.engine===key?"bold":"normal",
                        borderColor:config.engine===key?"#e8c87a":"#3a3a5c", background:config.engine===key?"#3a2a0a":"#2d2d44", color:config.engine===key?"#e8c87a":"#aaa" }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ background:"#0d0d1a", borderRadius:8, padding:16, border:"1px solid #3a3a5c" }}>
                {config.engine==="google" && (
                  <div>
                    <p style={{ color:"#e8c87a", fontSize:14, fontWeight:"bold", marginBottom:8 }}>🌐 Google Translate</p>
                    <p style={{ color:"#aaa", fontSize:13, marginBottom:6 }}>No requiere API Key. Usa MyMemory (basado en Google Translate). Límite ~5.000 caracteres/día en el plan gratuito.</p>
                    <p style={{ color:"#8ddb8d", fontSize:12 }}>✅ Predeterminado — listo para usar sin configuración.</p>
                  </div>
                )}
                {config.engine==="claude" && (<>
                  <p style={{ color:"#e8c87a", fontSize:13, marginBottom:12 }}>Claude (Anthropic)</p>
                  {cfgField("API Key (opcional)", "claudeKey", "sk-ant-...", "password")}
                  {cfgField("Modelo", "claudeModel", "claude-sonnet-4-20250514")}
                </>)}
                {config.engine==="openai" && (<>
                  <p style={{ color:"#e8c87a", fontSize:13, marginBottom:12 }}>ChatGPT (OpenAI)</p>
                  {cfgField("API Key", "openaiKey", "sk-...", "password")}
                  {cfgField("Modelo", "openaiModel", "gpt-4o")}
                </>)}
                {config.engine==="gemini" && (<>
                  <p style={{ color:"#e8c87a", fontSize:13, marginBottom:12 }}>Gemini (Google)</p>
                  {cfgField("API Key", "geminiKey", "AIza...", "password")}
                  {cfgField("Modelo", "geminiModel", "gemini-1.5-pro")}
                </>)}
                {config.engine==="deepl" && (<>
                  <p style={{ color:"#e8c87a", fontSize:13, marginBottom:12 }}>DeepL</p>
                  {cfgField("API Key", "deeplKey", "xxxxxxxx-xxxx-...:fx", "password")}
                  <p style={{ color:"#555", fontSize:11 }}>DeepL no usa el prompt del sistema, solo traduce el texto directamente.</p>
                </>)}
                {config.engine==="custom" && (<>
                  <p style={{ color:"#e8c87a", fontSize:13, marginBottom:12 }}>API Personalizada (compatible con OpenAI)</p>
                  {cfgField("URL del endpoint", "customUrl", "https://mi-api.com/v1/chat/completions")}
                  {cfgField("API Key", "customKey", "Bearer token...", "password")}
                  {cfgField("Modelo", "customModel", "nombre-del-modelo")}
                </>)}
              </div>
              <p style={{ color:"#555", fontSize:11, marginTop:10 }}>⚠️ Las API Keys se guardan en localStorage. No las compartas con nadie.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}