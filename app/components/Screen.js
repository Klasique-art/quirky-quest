import { SafeAreaView } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import Constants from 'expo-constants'



const Screen = ({children, statusStyle="auto", style}) => {
  return (
    <>
        <StatusBar style={statusStyle} />
        <SafeAreaView className="flex-1 px-2" style={[{paddingTop: Constants.statusBarHeight},style]}>
          {children}
        </SafeAreaView>
    </>
  )
}

export default Screen