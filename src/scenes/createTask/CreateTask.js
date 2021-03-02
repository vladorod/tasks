import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, View } from 'react-native'
import { Button, TextInput, Title } from 'react-native-paper'
import { createTask } from '../../modules/app.module'
import { useDispatch } from 'react-redux'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: 10,
  },
  title: {
    marginTop: 20,
  },
  input: {
    marginTop: 20,
  },
  button: {
    marginTop: 30,
  },
})

const Details = ({ route, navigation }) => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [text, setText] = useState('')

  const dispatch = useDispatch()

  return (
    <View style={styles.root}>
      <Title style={styles.title}>Создание задачи</Title>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        label="Имя пользователя"
      />
      <TextInput
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
        label="e-mail"
      />
      <TextInput
        value={text}
        onChangeText={setText}
        style={styles.input}
        multiline={true}
        label="Тест задачи"
      />
      <Button
        style={styles.button}
        onPress={async () => {
          const task = await dispatch(createTask(username, email, text))
          task && navigation.navigate('Home')
        }}
        mode="contained"
      >
        Создать
      </Button>
    </View>
  )
}

Details.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({ from: PropTypes.string }),
  }),
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
  }),
}

Details.defaultProps = {
  route: { params: { from: '' } },
  navigation: { goBack: () => null },
}

export default Details
