# AppIntranet

**AppIntranet** es una aplicación móvil diseñada para la gestión interna de procesos, utilizando Capacitor para crear aplicaciones nativas para Android e iOS. Sigue estos pasos para ejecutar y probar el proyecto en tu entorno local.

## Requisitos previos

Antes de comenzar, asegúrate de tener los siguientes programas instalados:

1. **Node.js** y **npm**:
   - Descarga [Node.js](https://nodejs.org/), lo que también instalará npm, el gestor de dependencias.

2. **Android Studio** o **Xcode** (dependiendo de tu sistema operativo):
   - Android Studio es necesario para compilar y probar en dispositivos Android.
   - Xcode es necesario si planeas probar en un dispositivo iOS (solo en macOS).

3. **Capacitor CLI**:
   Si no tienes Capacitor instalado, puedes agregarlo al proyecto ejecutando:
   ```bash
   npm install @capacitor/cli @capacitor/core
Pasos para ejecutar el proyecto
Sigue los pasos a continuación para clonar el repositorio, instalar las dependencias y ejecutar la aplicación con Capacitor.

1. Clona el repositorio
Clona el repositorio de AppIntranet desde GitHub a tu máquina local. Abre una terminal y ejecuta:

bash
Copiar código
git clone https://github.com/AlejandriaTI/AppIntranet.git
cd AppIntranet
2. Inicializa Capacitor en el proyecto
Capacitor es la herramienta que permite crear aplicaciones nativas para Android e iOS. Para agregar Capacitor a tu proyecto, ejecuta:

bash
Copiar código
npx cap init
Este comando creará un archivo de configuración llamado capacitor.config.ts, donde se almacenan los detalles del proyecto y la configuración de Capacitor.

3. Añadir plataformas (Android)
Para agregar la plataforma de Android, ejecuta:

bash
Copiar código
npx cap add android
Este comando crea los directorios android/ y ios/ (cuando agregues iOS) que contienen la estructura del proyecto nativo, donde podrás hacer configuraciones específicas para Android y iOS.

4. Construir el proyecto
Antes de sincronizar y ejecutar la aplicación en un emulador o dispositivo, asegúrate de construir el proyecto web. Para hacerlo, ejecuta:

bash
Copiar código
npm run build
Este comando genera los archivos estáticos (HTML, CSS, JS) necesarios para la aplicación móvil.

5. Sincronizar los cambios con Capacitor
Después de agregar plataformas y realizar cualquier cambio en el código web, sincroniza los cambios con las plataformas nativas (Android/iOS) ejecutando:

bash
Copiar código
npx cap sync
Este comando copia los archivos necesarios del directorio web (www/) a las plataformas nativas y asegura que todo esté actualizado.

6. Abrir el proyecto en Android Studio
Para ejecutar la aplicación en un emulador de Android o en un dispositivo físico, abre el proyecto en Android Studio ejecutando:

bash
Copiar código
npx cap open android
Este comando abrirá Android Studio, donde podrás compilar, ejecutar y probar la aplicación. Si ya tienes un emulador configurado, puedes seleccionarlo y ver la aplicación en ejecución.