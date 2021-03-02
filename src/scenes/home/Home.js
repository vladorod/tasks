import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
  StatusBar,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native'
import { colors } from 'theme'
import Connector from '../../utils/connector'
import {
  List,
  Button,
  Text,
  Menu,
  Divider,
  Provider,
  DataTable,
  Checkbox,
  IconButton,
  TextInput,
} from 'react-native-paper'
import { FlatList } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import {
  getTasks,
  setCurrentPage,
  elementsOnOnePage,
  actions,
  logOut,
  tasksStatusCode,
  completeStatusCode,
  editTask,
} from '../../modules/app.module'
import { useEffect } from 'react'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.lightGrayPurple,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
})

const Home = ({ navigation }) => {
  const { loggedIn } = useSelector(({ app }) => app)
  const dispatch = useDispatch()

  return (
    <Connector>
      {({ actions: { app }, state }) => (
        <Provider>
          <ScrollView style={styles.root}>
            <Button
              mode="contained"
              style={{ margin: 20 }}
              onPress={() => {
                navigation.navigate('createTask')
              }}
            >
              {' '}
              Добавить задачу{' '}
            </Button>
            {!loggedIn ? (
              <Button
                mode="contained"
                style={{ margin: 20 }}
                onPress={() => {
                  navigation.navigate('Auth')
                }}
              >
                {' '}
                Авторизация{' '}
              </Button>
            ) : (
              <Button
                mode="contained"
                style={{ margin: 20 }}
                onPress={() => {
                  dispatch(logOut())
                }}
              >
                {' '}
                Выход{' '}
              </Button>
            )}
            <List.Section title="Список задач">
              <MyComponent />
              <FlatList
                data={state.app.tasks}
                renderItem={({ item }) => <ListItem {...item} />}
              />
              <Pagination />
            </List.Section>
          </ScrollView>
        </Provider>
      )}
    </Connector>
  )
}

const MyComponent = () => {
  const ASC = 'asc'
  const DESC = 'desc'

  const dispatch = useDispatch()

  const [sortBy, setSortBy] = useState(false)
  const [direction, setDirection] = useState(ASC)

  const abbreviation = {
    [ASC]: 'ascending',
    [DESC]: 'descending',
  }

  const sort = (name) => {
    setDirection(direction === DESC ? ASC : DESC)
    setSortBy(name)

    dispatch(actions.setDirection(name, direction))
  }

  const howSort = (name) => sortBy === name && abbreviation[direction]

  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title
          sortDirection={howSort('username')}
          onPress={() => sort('username')}
        >
          Имя
        </DataTable.Title>
        <DataTable.Title
          sortDirection={howSort('email')}
          onPress={() => sort('email')}
        >
          E-mail
        </DataTable.Title>
        <DataTable.Title
          sortDirection={howSort('status')}
          onPress={() => sort('status')}
        >
          Статус
        </DataTable.Title>
      </DataTable.Header>
    </DataTable>
  )
}

const Pagination = () => {
  const { pageCounter, currentPage } = useSelector((state) => state.app)
  const dispatch = useDispatch()

  const allPages = Math.round(pageCounter / elementsOnOnePage) + 1
  const to = currentPage + elementsOnOnePage
  return (
    <DataTable>
      <DataTable.Pagination
        page={currentPage}
        numberOfPages={allPages}
        onPageChange={(page) => dispatch(setCurrentPage(page))}
        label={`${
          allPages <= to ? currentPage : `${currentPage}`
        } из ${allPages}`}
      />
    </DataTable>
  )
}

const ListItem = ({ username, email, text, status, id }) => {
  const checkboxStatus = {
    false: 'unchecked',
    true: 'checked',
  }
  const checkboxStatusRevers = {
    unchecked: false,
    checked: true,
  }
  const changeTextStatus = {
    0: 1,
    10: 11,
    11: 11,
    1: 1,
  }

  const { token, loggedIn } = useSelector(({ app }) => app)
  const CheckboxStatusCode = !completeStatusCode[status]
    ? checkboxStatus[true]
    : checkboxStatus[false]

  const [checkBoxValue, setCheckBox] = useState('unchecked')
  const [textValue, setTextValue] = useState('')
  const [titleStatusCode, setTitleStatusCode] = useState('')

  const dispatch = useDispatch()

  useEffect(() => {
    setCheckBox(CheckboxStatusCode)
    setTextValue(text)
    setTitleStatusCode(tasksStatusCode[status])
  }, [null])

  return (
    <List.Accordion
      title={username}
      description={`${email} \n${titleStatusCode}`}
      left={(props) => <List.Icon {...props} icon="star" />}
    >
      <View>
        <Text style={{ fontWeight: 'bold' }}>Текст задачи :</Text>
        <TextInput
          style={{
            margin: 20,
            marginLeft: 0,
            width: '80%',
            minHeight: 40,
          }}
          multiline={true}
          disabled={!loggedIn}
          onChangeText={setTextValue}
          onBlur={async () => {
            const statusCode = changeTextStatus[status]
            const req = await dispatch(
              editTask(id, { text: textValue, status: statusCode }),
            )

            if (!req) {
              setTextValue(text)
              setTitleStatusCode(tasksStatusCode[status])
            } else {
              setTitleStatusCode(tasksStatusCode[statusCode])
            }
          }}
          value={textValue}
        />
      </View>
      <Text style={{ fontWeight: 'bold' }}>Статус :</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Checkbox
          disabled={!loggedIn}
          onPress={async () => {
            const status = checkboxStatusRevers[checkBoxValue] ? 0 : 10
            const checkbox = !checkboxStatusRevers[checkBoxValue]
              ? checkboxStatus[true]
              : checkboxStatus[false]
            const req = await dispatch(editTask(id, { status }))
            if (req) {
              setTitleStatusCode(tasksStatusCode[status])
              setCheckBox(checkbox)
            }
          }}
          color={colors.darkPurple}
          status={checkBoxValue}
        />
        <Text style={{ maxWidth: 250 }}>
          {checkBoxValue === 'checked' ? 'Выполнено' : 'Не выполнено'}
        </Text>
      </View>
    </List.Accordion>
  )
}

Home.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
}

Home.defaultProps = {
  navigation: { navigate: () => null },
}

export default Home
