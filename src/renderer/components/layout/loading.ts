import { ElLoading } from 'element-plus'

const defaultOptions = {
  lock: true,
  text: '正在加载',
  background: 'rgba(0, 0, 0, 0.1)'
}

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
export function useLoading() {
  const className = `loaders-css__square-spin`
  const styleContent = `
  @keyframes square-spin {
    25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
    50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
    75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
    100% { transform: perspective(100px) rotateX(0) rotateY(0); }
  }
  .${className} > div {
    animation-fill-mode: both;
    width: 50px;
    height: 50px;
    background: #fff;
    animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
  }
  .app-loading-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #282c34;
    z-index: 9;
  }
      `
  const oStyle = document.createElement('style')
  const oDiv = document.createElement('div')

  oStyle.id = 'app-loading-style'
  oStyle.innerHTML = styleContent
  oDiv.className = 'app-loading-wrap'
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`

  return {
    appendLoading() {
      document.head.appendChild(oStyle)
      document.body.appendChild(oDiv)
    },
    removeLoading() {
      document.head.removeChild(oStyle)
      document.body.removeChild(oDiv)
    }
  }
}

/**
 * 传入一个方法fn,在它执行周期内,加上全屏loading
 * 如果：
 * 1. fn是同步方法，结束后隐藏loading
 * 2. 如果是异步方法，resolve后隐藏loading
 * 3. 报错后隐藏loading并抛出错误
 * @param {*} fn 函数
 * @returns Function 一个新的函数，去执行它吧
 */
export const withLoading = (fn, options = {}) => {
  let loading
  const showLoading = (options) => {
    loading = ElLoading.service(options)
  }

  const hideLoading = () => {
    if (loading) {
      loading.close()
    }
  }
  const _options = Object.assign(defaultOptions, options)
  const newFn = (...args) => {
    try {
      showLoading(_options)
      const result = fn(...args)
      const isPromise = result instanceof Promise
      if (!isPromise) {
        hideLoading()
        return result
      }
      return result
        .then((res) => {
          hideLoading()
          return res
        })
        .catch((err) => {
          hideLoading()
          throw err
        })
    } catch (err) {
      hideLoading()
      throw err
    }
  }
  return newFn
}
