import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthNavigator from './app/navigation/AuthNavigator'
import AppNavigation from './app/navigation/AppNavigation';
import UserContext from './app/hooks/userContext';

const App = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken')
        if (token) {
          setUser(token)
        }
      } catch (error) {
        console.log("Error getting login status", error)
      }
    }
    checkLoginStatus()
  }, [])

  return (
    <UserContext.Provider value={{user, setUser}}>
      <NavigationContainer>
        {user?<AppNavigation/>: <AuthNavigator />}
      </NavigationContainer>
    </UserContext.Provider>
  )
}

export default App
