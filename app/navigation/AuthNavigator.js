import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'

import LoginScreen from '../screens/LoginScreen'
import WelcomeScreen from '../screens/WelcomeScreen'
import RegisterScreen from '../screens/RegisterScreen'
import SelectScreen from '../screens/SelectScreen'
import routes from './routes'

const Stack = createStackNavigator()

const AuthNavigator = () => {
  return (
    <Stack.Navigator
        screenOptions={{
            headerShown: false
        }}
    >
        <Stack.Screen 
          name={routes.WELCOME} 
          component={WelcomeScreen} 
        />
        <Stack.Screen 
          name={routes.LOGIN} 
          component={LoginScreen} 
        />
        <Stack.Screen 
          name={routes.REGISTER} 
          component={RegisterScreen}
        />
        <Stack.Screen 
          name={routes.SELECT} 
          component={SelectScreen}
        />
    </Stack.Navigator>
  )
}

export default AuthNavigator