# AppIntranet – Guía para instalar y arrancar Capacitor (Android)

Esta guía explica cómo preparar el entorno, instalar dependencias, compilar el frontend y ejecutar la app Android con Capacitor en este proyecto.

## 1) Requisitos
- Node.js LTS y npm (recomendado Node 18 o 20)
- Java JDK 17
- Android Studio con Android SDK (Plataforma 33+ y herramientas) y un emulador o un dispositivo físico
- Capacitor CLI (se usa vía `npx`)

Verifica versiones:
```bash
node -v
npm -v
java -version
```

## 2) Clonar e instalar dependencias
```bash
git clone https://github.com/AlejandriaTI/AppIntranet.git
cd AppIntranet
npm install
```

Si ya estás en `intranet-movil`, solo ejecuta:
```bash
npm install
```

## 3) Configuración de entorno (Windows)
Asegúrate de tener las variables de entorno configuradas:
- JAVA_HOME apuntando a JDK 17
- ANDROID_SDK_ROOT apuntando al directorio del SDK de Android

Ejemplo en PowerShell (ajusta rutas):
```powershell
$env:JAVA_HOME="C:\\Program Files\\Java\\jdk-17"
[Environment]::SetEnvironmentVariable("JAVA_HOME", $env:JAVA_HOME, "User")

$env:ANDROID_SDK_ROOT="C:\\Users\\USER\\AppData\\Local\\Android\\Sdk"
[Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $env:ANDROID_SDK_ROOT, "User")
```
Reinicia la terminal después de configurar.

## 4) Inicialización de Capacitor (solo primera vez)
El proyecto ya incluye `capacitor.config.ts`. Si necesitas inicializar Capacitor desde cero:
```bash
npx cap init
```
Luego añade Android (si aún no existe la carpeta `android/`):
```bash
npx cap add android
```

## 5) Build del frontend y sincronización con Android
Cada vez que cambies el frontend y quieras reflejarlo en Android:
```bash
npm run build
npx cap sync android
```
`npm run build` genera el contenido web y `npx cap sync android` copia los assets nativos y actualiza plugins.

## 6) Abrir en Android Studio y ejecutar
```bash
npx cap open android
```
Desde Android Studio:
- Selecciona un dispositivo (emulador o físico con depuración USB)
- Ejecuta ▶ (Run) para compilar e instalar

## 7) Opción de Live Reload (opcional)
Para desarrollar viendo cambios inmediatos:
1. Inicia el servidor de desarrollo web:
```bash
npm run dev
```
2. En otra terminal, lanza la app con recarga en vivo (ajusta puerto si tu dev server usa otro):
```bash
npx cap run android --livereload --external --port 3000
```
Nota: Live Reload requiere que el dispositivo/emulador pueda acceder a tu IP local.

## 8) Comandos útiles
- Compilar web y sincronizar:
```bash
npm run build && npx cap sync android
```
- Abrir Android Studio:
```bash
npx cap open android
```
- Ejecutar en dispositivo (sin abrir Android Studio):
```bash
npx cap run android
```
- Sincronizar solo plugins/Android:
```bash
npx cap sync android
```

## 9) Limpieza de builds (Windows)
Si algo falla en la compilación nativa, limpia y vuelve a sincronizar:
```powershell
cd android
./gradlew.bat clean
cd ..
npx cap sync android
```
También puedes eliminar manualmente `android/app/build/` y repetir la sincronización.

## 10) Solución de problemas comunes
- JDK incompatible: configura JDK 17 en Android Studio (File > Settings > Build Tools > Gradle > Gradle JDK = 17)
- SDK de Android faltante: abre Android Studio > SDK Manager e instala la plataforma requerida (API 33+)
- Permisos en dispositivo: habilita “Depuración USB” en Opciones de desarrollador
- Cambios en el frontend no aparecen: ejecuta `npm run build` y luego `npx cap sync android`
- Plugins no copian: prueba `npx cap clean` y luego `npx cap sync`

## 11) Flujo recomendado diario
1. `npm run dev` para desarrollo web
2. Para probar en Android:
   - `npm run build`
   - `npx cap sync android`
   - `npx cap open android` y ejecutar desde Android Studio, o `npx cap run android`

---
Si necesitas soporte adicional con la configuración de Android Studio, JDK o SDK, indica tu versión de Windows, Node y Android Studio, junto con cualquier mensaje de error.
