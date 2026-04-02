// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

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
    // Modo desarrollo: apunta al servidor de Vite
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools(); // Opcional: abre DevTools en dev
  } else {
    // Modo producción / portable: carga el HTML construido por Vite
    const appPath = app.getAppPath();
    win.loadFile(path.join(appPath, 'dist', 'index.html'));
  }
}

app.whenReady().then(createWindow);

// Mantener la app activa en macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// -------------------------
// Tu código de IPC (igual que antes)
ipcMain.handle("call-api", async (event, config, userMsg, systemPrompt, glossary) => {
  try {
    const {
      engine,
      claudeKey, claudeModel,
      openaiKey, openaiModel,
      geminiKey, geminiModel,
      deeplKey,
      customUrl, customKey, customModel
    } = config;

    const fullPrompt = systemPrompt + "\n\n" + glossary + "\n\n" + userMsg;

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

    if (engine === "google") {
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(userMsg)}`
      );
      const data = await res.json();
      return { google: data };
    }

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
            { role: "user", content: userMsg }
          ]
        })
      });
      return await res.json();
    }

    if (engine === "gemini") {
      if (!geminiKey) return { error: "Falta API Key de Gemini" };
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }]
          })
        }
      );
      return await res.json();
    }

    if (engine === "deepl") {
      if (!deeplKey) return { error: "Falta API Key de DeepL" };
      const res = await fetch("https://api-free.deepl.com/v2/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `DeepL-Auth-Key ${deeplKey}`
        },
        body: JSON.stringify({ text: [userMsg], target_lang: "ES" })
      });
      return await res.json();
    }

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
            { role: "user", content: userMsg }
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