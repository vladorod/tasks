import React, { Component } from 'react'
import { Text, View } from 'react-native'

export default class Profile extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text> Hello Profile </Text>
      </View>
    )
  }
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center', 
        alignItems: 'center',
    }
}