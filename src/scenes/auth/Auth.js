import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, StatusBar } from 'react-native'
import { colors } from 'theme'
import Connector from '../../utils/connector'
import { TextInput, Title, Button } from 'react-native-paper'
import { authenticate } from '../../modules/app.module'
import { useDispatch } from 'react-redux'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.lightGrayPurple,
  },
  input: {
    marginTop: 20,
  },
  formWrap: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
})

const Auth = ({ navigation }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  return (
    <Connector>
      {({ actions: { app } }) => (
        <View style={styles.root}>
          <StatusBar barStyle="light-content" />
          <View style={styles.formWrap}>
            <Title>Авторизация</Title>
            <TextInput
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              label="Имя пользователя"
            />
            <TextInput
              password={true}
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              label="Пароль"
            />
            <Button
              mode="contained"
              onPress={async () =>
                (await dispatch(authenticate(username, password))) &&
                navigation.navigate('Home')
              }
              style={{ marginTop: 20 }}
            >
              Войти
            </Button>
          </View>
        </View>
      )}
    </Connector>
  )
}

Auth.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
}

Auth.defaultProps = {
  navigation: { navigate: () => null },
}

export default Auth
