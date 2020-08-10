const { app, BrowserWindow } = require('electron')
const crawler = require('./utils/playerRankCrawler')
const fs = require('fs').promises


function createWindow () {
  // Crea la ventana del navegador.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })


  crawler
    .getRankings()
    .then(rankings => JSON.stringify(rankings, null ,2))
    .then(jsonData => fs.writeFile(`./data/rankings.json`, jsonData))
    .catch(err => console.log(err))
    .then(data => win.loadFile('./public/views/index.html'))

  // Abre las herramientas de desarrollo (DevTools).
  //win.webContents.openDevTools()
}

// Este método se llamará cuando Electron haya finalizado
// la inicialización y esté preparado para crear la ventana del navegador.
// Algunas APIs pueden usarse sólo después de que este evento ocurra.
app.whenReady().then(createWindow)

// Finaliza cuando todas las ventanas estén cerradas.
app.on('window-all-closed', () => {
  // En macOS es común para las aplicaciones y sus barras de menú
  // que estén activas hasta que el usuario salga explicitamente con Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // En macOS es común volver a crear una ventana en la aplicación cuando el
  // icono del dock es clicado y no hay otras ventanas abiertas.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// En este archivo puede incluir el resto del código del proceso principal específico
// de su aplicación. También puedes ponerlos en archivos separados y requerirlos aquí.
