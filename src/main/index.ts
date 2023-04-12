import { app, WebContents, RenderProcessGoneDetails, session } from 'electron'
import Constants from './utils/Constants'
import { createErrorWindow, createMainWindow } from './MainRunner'
import { macOSDisableDefaultMenuItem } from './utils/Menus'
import { initIpc } from './IPCs'

let mainWindow
let errorWindow

app.on('ready', () => {
  macOSDisableDefaultMenuItem()

  mainWindow = createMainWindow(mainWindow)
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['Access-Control-Allow-Origin'] = '*'
    callback({ cancel: false, requestHeaders: details.requestHeaders })
  })
})

app.on('activate', () => {
  if (!mainWindow) {
    mainWindow = createMainWindow(mainWindow)
  }
})

app.on('window-all-closed', () => {
  mainWindow = null
  errorWindow = null

  if (!Constants.IS_MAC) {
    app.quit()
  }
})

app.on(
  'render-process-gone',
  (event: Event, webContents: WebContents, details: RenderProcessGoneDetails) => {
    errorWindow = createErrorWindow(errorWindow, mainWindow, details)
  }
)

process.on('uncaughtException', () => {
  errorWindow = createErrorWindow(errorWindow, mainWindow)
})

initIpc()
