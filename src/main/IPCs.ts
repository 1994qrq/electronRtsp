import { BrowserWindow, ipcMain, shell, dialog, app } from 'electron'
import Constants from './utils/Constants'

import { MERGE_CONFIG_TOOL_PATH, fileType, appPath, asarPath } from './const'

let fs = require('fs')
const child_process = require('child_process')
const spawn = require('cross-spawn')
const os = require('os')

// rtsp相关,ffmpeg-static会自动下载对应平台windos，linux，mac(intle)，mac(M1版本)的ffmpeg二进制文件
const ffmpegPath = require('ffmpeg-static')
/**
  stream相关配置及方法
  name = options.name
  streamUrl = options.streamUrl
  width = options.width
  height = options.height
  wsPort = options.wsPort
  nputStreamStarted = false
  stream = undefined
  ffmpegPath = options?.ffmpegPath ?? ffmpeg
  stop()
 */
const Stream = require('node-rtsp-stream')
/**
 * rtsp列表
 * interface {
 *   rtspUrl: {
 *     ws: websocket地址
 *     stream: stream实例
 *   }
 * }
 */
const rtspOpenders = {}
let addPort = 9000

/**
 * 开启rtsp
 * @param rtsp {String} rtsp流地址
 */

ipcMain.on('openRtsp', (event, rtsp) => {
  /** 判断是否已开启,若已开启,直接返回ws地址, 未开启则先开启再返回 */
  if (rtspOpenders[rtsp]) {
    event.returnValue = {
      code: 200,
      msg: '开启成功',
      ws: rtspOpenders[rtsp].ws
    }
  } else {
    addPort++
    const stream = new Stream({
      name: `socket-${addPort}`,
      streamUrl: rtsp,
      wsPort: addPort,
      ffmpegPath: app.isPackaged ? ffmpegPath.replace('app.asar', 'app.asar.unpacked') : ffmpegPath,
      ffmpegOptions: {
        '-stats': '',
        '-r': 30
      }
    }).on('exitWithError', () => {
      stream.stop()
      delete rtspOpenders[rtsp]
      event.returnValue = {
        code: 400,
        msg: '开启失败'
      }
    })
    rtspOpenders[rtsp] = {
      ws: `ws://localhost:${addPort}`,
      stream: stream
    }
    event.returnValue = {
      code: 200,
      msg: '开启成功',
      ws: rtspOpenders[rtsp].ws
    }
  }
})

/**
 * 关闭rtsp
 */
ipcMain.on('closeRtsp', (event, rtsp) => {
  if (rtspOpenders[rtsp]) {
    // 停止解析
    rtspOpenders[rtsp].stream.stop()
    // 关闭WebSocket
    rtspOpenders[rtsp].stream.wsServer.close()
    // 删除该项
    delete rtspOpenders[rtsp]
    // 返回结果
    event.returnValue = {
      code: 200,
      msg: '关闭成功'
    }
  } else {
    event.returnValue = {
      code: 400,
      msg: '未找到该rtsp'
    }
  }
})

export function initIpc() {
  let lastChildProcess

  // 开始写逻辑代码
  ipcMain.handle('selectDic', async (event, arg) => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: '请选择要导入的视频',
      properties: ['openDirectory']
    })

    return filePaths[0] ? filePaths[0] + '\\' : ''
  })

  // 开始写逻辑代码
  ipcMain.handle('selectVidoeFiles', async (event, arg) => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: '请选择导出视频位置',
      properties: ['openFile', 'multiSelections'],
      filters: [
        {
          name: '视频格式',
          extensions: fileType
        }
      ]
    })

    return filePaths || []
  })
  ipcMain.handle('merge-merges', async (event, arg) => {
    return await new Promise((resolve, reject) => {
      if (lastChildProcess) {
        lastChildProcess.kill()
        lastChildProcess = null
      }

      let cmd = 'ffmpeg'
      let env = {
        ...process.env,
        PATH: '/usr/local/bin:' + child_process.execSync('echo $PATH').toString()
      }
      function hasFile(path: string) {
        return fs.existsSync(path)
      }

      if (os.platform() == 'win32') {
        cmd = MERGE_CONFIG_TOOL_PATH
      }

      let cmder = ['-y', '-i', `concat:${arg.input}`, '-c', 'copy', arg.output]
      if (arg.filetype == 'wmv' || arg.type == 'wmv' || arg.type == 'mp3') {
        // cmder = [ "-i", arg.input, '-threads',5,'-preset','ultrafast',arg.output]
        cmder = ['-i', arg.input, arg.output]
        // 判断文件是否存在
        // if (hasFile(arg.output)) {
        //     resolve({
        //         msg: '目标文件已存在,请手动删除', path: arg.output
        //     })

        //     return
        // }
      }
      lastChildProcess = spawn(cmd, cmder, {
        env: env
      })

      lastChildProcess.stdout.on('data', (data) => {
        console.log('456')

        // event.reply("merge-merge-result", {
        //     type: "stdout",
        //     data: data.toString(),
        // });
      })
      lastChildProcess.stderr.on('data', (data) => {
        console.log('123')

        // event.reply("merge-merge-result", {
        //     type: "stderr",
        //     data: data.toString(),
        // });
      })
      lastChildProcess.on('close', () => {
        resolve(true)
        console.log('over')
      })
      lastChildProcess.on('error', (data) => {
        console.log(data.toString())
        resolve(false)
        // event.reply("merge-merge-result", {
        //     type: "err",
        //     data: data.toString(),
        // });
      })
    })
  })

  ipcMain.on('merge-merge', (event, arg) => {
    if (lastChildProcess) {
      lastChildProcess.kill()
      lastChildProcess = null
    }

    let cmd = 'ffmpeg'
    let env = {
      ...process.env,
      PATH: '/usr/local/bin:' + child_process.execSync('echo $PATH').toString()
    }

    if (os.platform() == 'win32') {
      cmd = MERGE_CONFIG_TOOL_PATH
    }

    lastChildProcess = spawn(cmd, ['-y', '-i', `concat:${arg.input}`, '-c', 'copy', arg.output], {
      env: env
    })

    lastChildProcess.stdout.on('data', (data) => {
      event.reply('merge-merge-result', {
        type: 'stdout',
        data: data.toString()
      })
    })
    lastChildProcess.stderr.on('data', (data) => {
      event.reply('merge-merge-result', {
        type: 'stderr',
        data: data.toString()
      })
    })
    lastChildProcess.on('error', (data) => {
      console.log(data.toString())

      event.reply('merge-merge-result', {
        type: 'err',
        data: data.toString()
      })
    })
  })
  ipcMain.on('init', (event, arg) => {
    event.reply('merge-merge-result', {
      type: 'path',
      data: MERGE_CONFIG_TOOL_PATH,
      appPath,
      asarPath
    })
  })
}

/*
 * IPC Communications
 * */
export default class IPCs {
  static initialize(window: BrowserWindow): void {
    // Get application version
    ipcMain.on('msgRequestGetVersion', () => {
      window.webContents.send('msgReceivedVersion', Constants.APP_VERSION)
    })

    // Open url via web browser
    ipcMain.on('msgOpenExternalLink', async (event, url: string) => {
      await shell.openExternal(url)
    })
    ipcMain.on('appQuit', () => {
      app.quit()
    })
  }
}
