import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import HomeScreen from '../screens/HomeScreen'
import ChatScreen from '../screens/ChatScreen'
import ModalScreen from '../screens/ModalScreen'
import routes from './routes'

const Stack = createStackNavigator()

const AppNavigation = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen 
            name={routes.HOME} 
            component={HomeScreen} 
            options={{
                headerShown: false
            }}
        />
        <Stack.Screen 
            name={routes.CHAT} 
            component={ChatScreen} 
            options={{
                headerShown: false
            }}
        />
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen 
                name={routes.MODAL} 
                component={ModalScreen} 
                options={{
                    headerShown: false
                }}
            />
        </Stack.Group>
    </Stack.Navigator>
  )
}

export default AppNavigation