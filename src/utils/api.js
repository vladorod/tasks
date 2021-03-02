import axios from 'axios'
import { Alert } from 'react-native'

const server = axios.create({
  baseURL: 'https://uxcandy.com/~shapoval/test-task-backend/v2/',
})

class API {
  devName = 'Vlad'
  totalCount = 0

  setError = ({ message }) => {
    Alert.alert('Ошибка', message)
  }

  createTask = async (username, email, text) => {
    try {
      const form = new FormData()
      form.append('username', username)
      form.append('email', email)
      form.append('text', text)

      const { data } = await server.post(
        `create?developer=${this.devName}`,
        form,
      )
      const { message, status } = data

      if (status !== 'ok') {
        const getFieldName = {
          username: 'Имя пользователя',
          email: 'E-mail',
          text: 'Текст задачи',
        }

        const getMassage = (object) => {
          const firstEl = Object.keys(object)[0]
          const first = object[firstEl]
          delete object[firstEl]
          if (first) {
            return `\n${first.replace(
              'Поле',
              getFieldName[firstEl] ? getFieldName[firstEl] : 'Поле',
            )}`
          } else {
            return getMassage(array)
          }
        }

        throw new Error(`${getMassage(message)}`)
      }

      return message
    } catch (error) {
      this.setError(error)
      return false
    }
  }

  editTask = async (token, id, object) => {
    try {
      if (!id) throw Error('id is undefined')
      if (!token) throw Error('token is undefined')

      const form = new FormData()
      form.append('token', token)

      for (let item in object) {
        form.append(item, object[item])
      }

      const { data } = await server.post(
        `edit/${id}?developer=${this.devName}`,
        form,
      )

      if (data.status !== 'ok') {
        throw new Error(`Ошибка сервера`)
      }

      return data
    } catch (error) {
      this.setError(error)
      return false
    }
  }

  login = async (username, password) => {
    try {
      const form = new FormData()
      form.append('username', username)
      form.append('password', password)

      const { data } = await server.post(
        `login?developer=${this.devName}`,
        form,
      )

      const { message, status } = data

      if (status !== 'ok') {
        const username = message.username
          ? message.username.replace('Поле', 'Имя пользователя')
          : ''
        const password = message.password
          ? message.password.replace('Поле', 'Пароль')
          : ''

        throw new Error(`${username !== '' ? username : password}`)
      }

      return message.token
    } catch (error) {
      this.setError(error)
      return false
    }
  }

  getTasks = async (sortField, sortDirection, page) => {
    try {
      const sort = sortField ? `&sort_field=${sortField}` : ''
      const direction = sortDirection ? `&sort_direction=${sortDirection}` : ''
      const tasksPage = page ? `&page=${page}` : ''
      const { data } = await server.get(
        `?developer=${this.devName}${sort}${direction}${tasksPage}`,
      )

      const { message, status } = data

      if (status !== 'ok') throw new Error('Ошибка сервера')

      this.total_task_count = message.total_task_count
      return message.tasks
    } catch (error) {
      this.setError(error)
      return false
    }
  }

  getTotalTaskCount = () => this.total_task_count
}

export default new API()
