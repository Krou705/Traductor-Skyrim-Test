# Traductor Skyrim (Test)

![Traductor Skyrim](https://i.postimg.cc/KjLyLZYf/portada-app-2.png)

**Traductor Skyrim** es un programa de traducción en **fase de prueba**, creado con ayuda de **Inteligencia Artificial**. No se requiere experiencia en programación para usarlo. Actualmente permite traducir texto de **inglés a español**.

---

## 🌟 Características

- Traducción automática de inglés a español.
- Basado en **React** y **Vite** para la interfaz de usuario.
- Ejecutable de escritorio gracias a **Electron**.
- Permite interactuar con distintos motores de traducción (OpenAI, Google, DeepL, Claude, Gemini y personalizado).
- Ideal para pruebas y aprendizaje de IA aplicada a traducción.

---

## 💾 Requisitos

- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- Git (para clonar el repositorio)
- Windows 10 o superior (para versión portable)

---

## 🚀 Instrucciones paso a paso

1️⃣ Clonar el repositorio  
Abre PowerShell o CMD y ejecuta:

    git clone https://github.com/Krou705/Traductor-Skyrim-Test.git

2️⃣ Entrar a la carpeta del proyecto

    cd Traductor-Skyrim-Test

3️⃣ Instalar dependencias  
Esto instalará todas las librerías necesarias para que el programa funcione:

    npm install

4️⃣ Ejecutar en modo desarrollo (opcional)  
Si quieres probar la app mientras desarrollas o haces pruebas:

    npm run dev:electron

Esto abrirá la aplicación como un programa de escritorio, conectándose al servidor de desarrollo de React/Vite.

5️⃣ Construir versión portable (Windows)  
Para crear un ejecutable que puedas compartir y usar en otras computadoras:

    npm run build

El ejecutable y los archivos necesarios se generarán en la carpeta `dist_electron`.

---

## 🛠 Tecnologías usadas

- **React** – Interfaz de usuario.  
- **Vite** – Bundler rápido para desarrollo.  
- **Electron** – Aplicación de escritorio multiplataforma.  
- **Node.js** – Lógica de backend y comunicación con APIs.  
- **APIs de traducción** – OpenAI, Google Translate, DeepL, Claude, Gemini y personalizada.  

---

## ⚠️ Nota

Este proyecto está en **fase de prueba**. Actualmente sólo traduce de inglés a español y está pensado para experimentar con IA en traducción.

✨ ¡Diviértete explorando y probando traducciones!
