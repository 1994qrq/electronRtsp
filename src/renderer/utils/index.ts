export default class Utils {
  static getCurrentLocale(): string {
    return navigator?.language?.split('-')[0] || 'zhHans'
  }

  static async openExternal(url: string): Promise<void> {
    // @ts-ignore
    await window.mainApi.send('msgOpenExternalLink', url)
  }
}

export const { getCurrentLocale, openExternal } = Utils
