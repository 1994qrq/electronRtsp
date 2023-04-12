import { contextBridge, ipcRenderer, shell } from 'electron'

// Whitelist of valid channels used for IPC communication (Send message from Renderer to Main)
const mainAvailChannels: string[] = [
  'msgRequestGetVersion',
  'msgOpenExternalLink',
  'appQuit',
  'openRtsp',
  'closeRtsp'
]
const rendererAvailChannels: string[] = ['msgReceivedVersion']

contextBridge.exposeInMainWorld('shell', shell)

contextBridge.exposeInMainWorld('mainApi', {
  sendSync: (channel, data) => {
    if (mainAvailChannels.includes(channel)) {
      return ipcRenderer.sendSync(channel, data)
    }
  },
  send: (channel: string, ...data: any[]): void => {
    if (mainAvailChannels.includes(channel)) {
      ipcRenderer.send.apply(null, [channel, ...data])
    } else {
      throw new Error(`Send failed: Unknown ipc channel name: ${channel}`)
    }
  },
  receive: (channel: string, cbFunc: Function): void => {
    if (rendererAvailChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => cbFunc(event, ...args))
    } else {
      throw new Error(`Receive failed: Unknown ipc channel name: ${channel}`)
    }
  },
  invoke: async (channel: string, ...data: any[]): Promise<any> => {
    if (mainAvailChannels.includes(channel)) {
      const result = await ipcRenderer.invoke.apply(null, [channel, ...data])
      return result
    }
    throw new Error(`Invoke failed: Unknown ipc channel name: ${channel}`)
  }
})
