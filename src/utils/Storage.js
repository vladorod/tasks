import AsyncStorage from '@react-native-community/async-storage'

class Storage {
  storage = AsyncStorage

  sendError = (message) => {
    console.warn(message)
  }

  getItem = async (key) => {
    try {
      const item = await this.storage.getItem(`@${key}`)
      const json = JSON.parse(item)
      return json
    } catch (error) {
      this.sendError(error)
      return false
    }
  }
  setItem = async ({ key, value }) => {
    try {
      await this.storage.setItem(`@${key}`, JSON.stringify(value))
    } catch (error) {
      this.sendError(error)
    }
  }
}

export default new Storage()
