// ------------------------------------
// Constants
// ------------------------------------

import { element } from 'prop-types'
import { Alert } from 'react-native'
import api from '../utils/api'
import storage from '../utils/Storage'

const LOGGED_IN = 'LOGGED_IN'
const SET_TASKS = 'SET_TASKS'
const SET_PAGE = 'SET_PAGE'
const SET_SORT_FIELD = 'SET_SORT_FIELD'
const SET_DIRECTION = 'SET_DIRECTION'

const initialState = {
  checked: false,
  loggedIn: false,
  sortField: false,
  direction: false,
  token: null,
  tasks: [],
  pageCounter: 0,
  currentPage: 1,
}

export const elementsOnOnePage = 3

// ------------------------------------
// Actions
// ------------------------------------

// TODO: check the user's login state
export const authenticate = (username, password) => async (dispatch) => {
  const token = await api.login(username, password)

  if (token) {
    dispatch({
      type: LOGGED_IN,
      loggedIn: true,
      token,
    })
    storage.setItem({ key: 'token', value: token })
  }

  return token
}

export const checkUser = (username, password) => async (dispatch) => {
  const token = await storage.getItem('token')

  if (token) {
    dispatch({
      type: LOGGED_IN,
      loggedIn: true,
      token,
    })
  }

  return token
}

export const getTasks = () => async (dispatch, getState) => {
  const { direction, sortField, currentPage } = getState().app

  const tasks = await api.getTasks(sortField, direction, currentPage)
  const pageCounter = api.getTotalTaskCount()

  if (tasks) {
    dispatch({
      type: SET_TASKS,
      tasks,
      pageCounter,
    })
  }
}
export const logOut = () => (dispatch) => {
  storage.setItem({ key: 'token', value: null })
  dispatch({
    type: LOGGED_IN,
    loggedIn: false,
    token: null,
  })
}
export const createTask = (username, email, text) => async (dispatch) => {
  const data = await api.createTask(username, email, text)
  dispatch(getTasks())
  data && Alert.alert('Успешно', 'Задача создана')
  return data
}

export const editTask = (id, objectFields) => async (dispatch, getState) => {
  const { token } = getState().app
  const req = await api.editTask(token, id, objectFields)
  return req
}

const setDirection = (sortField, direction) => async (dispatch, getState) => {
  const { page } = getState().app
  const tasks = await api.getTasks(sortField, direction, page)
  const pageCounter = api.getTotalTaskCount()

  tasks &&
    dispatch({
      type: SET_TASKS,
      tasks,
      pageCounter,
    })

  dispatch({
    type: SET_SORT_FIELD,
    sortField,
  })

  dispatch({
    type: SET_DIRECTION,
    direction,
  })
}

export const setCurrentPage = (page) => async (dispatch, getState) => {
  const { direction, sortField } = getState().app

  const tasks = await api.getTasks(sortField, direction, page)
  const pageCounter = api.getTotalTaskCount()

  dispatch({
    type: SET_PAGE,
    currentPage: page,
  })

  tasks &&
    dispatch({
      type: SET_TASKS,
      tasks,
      pageCounter,
    })
}

export const actions = {
  authenticate,
  getTasks,
  setDirection,
  logOut,
  setCurrentPage,
  checkUser,
}

// ------------------------------------
// Helpers
// ------------------------------------

// 0 - задача не выполнена
// 1 - задача не выполнена, отредактирована админом
// 10 - задача выполнена
// 11 - задача отредактирована админом и выполнена

export const completeStatusCode = {
  0: 'задача не выполнена',
  1: 'отредактировано администратором',
}

export const notExecutedStatusCode = {
  10: 'задача выполнена',
  11: 'отредактировано администратором',
}

export const tasksStatusCode = {
  ...notExecutedStatusCode,
  ...completeStatusCode,
}

export const getTaskStatus = (statusCode) => {}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [LOGGED_IN]: (state, { loggedIn, token }) => ({
    ...state,
    loggedIn,
    token,
  }),
  [SET_TASKS]: (state, { tasks, pageCounter }) => ({
    ...state,
    tasks,
    pageCounter,
  }),
  [SET_PAGE]: (state, { currentPage }) => ({
    ...state,
    currentPage,
  }),
  [SET_SORT_FIELD]: (state, { sortField }) => ({
    ...state,
    sortField,
  }),
  [SET_DIRECTION]: (state, { direction }) => ({
    ...state,
    direction,
  }),
}

// ------------------------------------
// Reducer
// ------------------------------------

export default function reducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
