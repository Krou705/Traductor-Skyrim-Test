// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs   = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  if (process.env.NODE_ENV === "development") {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    const appPath = app.getAppPath();
    win.loadFile(path.join(appPath, 'dist', 'index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ─── Archivos JSON (glossary, config, presets) ───────────────────────────────
const dataDir = app.isPackaged
  ? path.dirname(process.execPath)
  : path.join(__dirname);

const FILES = {
  glossary : path.join(dataDir, "glossary.json"),
  config   : path.join(dataDir, "config.json"),
  presets  : path.join(dataDir, "presets.json"),
};

function readJSON(filePath, fallback) {
  try {
    if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (e) { console.error(`Error leyendo ${filePath}:`, e.message); }
  return fallback;
}

function writeJSON(filePath, data) {
  try { fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8"); return true; }
  catch (e) { console.error(`Error escribiendo ${filePath}:`, e.message); return false; }
}

ipcMain.handle("load-data", () => ({
  glossary : readJSON(FILES.glossary, []),
  config   : readJSON(FILES.config,   {}),
  presets  : readJSON(FILES.presets,  []),
}));

ipcMain.handle("save-file", (_event, key, data) => {
  if (!FILES[key]) return { ok: false, error: "Archivo desconocido: " + key };
  return { ok: writeJSON(FILES[key], data) };
});

// ─── call-api ────────────────────────────────────────────────────────────────
ipcMain.handle("call-api", async (_event, config, userMsg, systemPrompt, glossary) => {
  try {
    const {
      engine,
      srcLang = "en", tgtLang = "es",
      claudeKey, claudeModel,
      openaiKey, openaiModel,
      geminiKey, geminiModel,
      deeplKey,
      customUrl, customKey, customModel
    } = config;

    const fullPrompt = systemPrompt + "\n\n" + glossary + "\n\n" + userMsg;

    // ── Google Translate (MyMemory — gratuito, sin API Key) ──────────────────
    if (engine === "google") {
      const src = srcLang === "es"    ? "es-419"
                : srcLang === "es-ES" ? "es"
                : srcLang;
      const tgt = tgtLang === "es"    ? "es-419"
                : tgtLang === "es-ES" ? "es"
                : tgtLang;

      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(userMsg)}&langpair=${src}|${tgt}`;
      const res  = await fetch(url);
      const data = await res.json();

      if (data.responseStatus === 429) return { error: "rate_limit" };
      if (data.responseStatus !== 200)
        return { error: data.responseDetails || "Error Google Translate" };

      return { google_text: data.responseData?.translatedText || "" };
    }

    // ── Claude ───────────────────────────────────────────────────────────────
    if (engine === "claude") {
      if (!claudeKey) return { error: "Falta API Key de Claude" };
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": claudeKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: claudeModel,
          max_tokens: 1000,
          messages: [{ role: "user", content: fullPrompt }]
        })
      });
      return await res.json();
    }

    // ── OpenAI ───────────────────────────────────────────────────────────────
    if (engine === "openai") {
      if (!openaiKey) return { error: "Falta API Key de OpenAI" };
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: openaiModel,
          messages: [
            { role: "system", content: systemPrompt + "\n\n" + glossary },
            { role: "user",   content: userMsg }
          ]
        })
      });
      return await res.json();
    }

    // ── Gemini ───────────────────────────────────────────────────────────────
    if (engine === "gemini") {
      if (!geminiKey) return { error: "Falta API Key de Gemini" };
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] })
        }
      );
      return await res.json();
    }

    // ── DeepL ────────────────────────────────────────────────────────────────
    if (engine === "deepl") {
      if (!deeplKey) return { error: "Falta API Key de DeepL" };
      const res = await fetch("https://api-free.deepl.com/v2/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `DeepL-Auth-Key ${deeplKey}`
        },
        body: JSON.stringify({
          text: [userMsg],
          source_lang: srcLang.toUpperCase().split("-")[0],
          target_lang: tgtLang.toUpperCase().split("-")[0]
        })
      });
      return await res.json();
    }

    // ── API Personalizada ────────────────────────────────────────────────────
    if (engine === "custom") {
      if (!customUrl) return { error: "Falta URL personalizada" };
      const res = await fetch(customUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(customKey ? { "Authorization": `Bearer ${customKey}` } : {})
        },
        body: JSON.stringify({
          model: customModel,
          messages: [
            { role: "system", content: systemPrompt + "\n\n" + glossary },
            { role: "user",   content: userMsg }
          ]
        })
      });
      return await res.json();
    }

    return { error: "Motor no soportado" };

  } catch (err) {
    return { error: err.message || String(err) };
  }
});