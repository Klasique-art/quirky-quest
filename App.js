import 'react-native-gesture-handler';
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'

import AuthNavigator from './app/navigation/AuthNavigator'
import AppNavigation from './app/navigation/AppNavigation';

const App = () => {
  return (
    <NavigationContainer>
      <AuthNavigator />
      {/* <AppNavigation /> */}
    </NavigationContainer>
  )
}

export default App