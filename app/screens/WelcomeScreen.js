import { View, StyleSheet, Image, ImageBackground } from 'react-native'
import React from 'react'

import colors from '../config/colors'
import Screen from '../components/Screen'
import AppText from '../components/AppText'
import AppButton from '../components/AppButton'
import routes from '../navigation/routes'

const WelcomeScreen = ({navigation}) => {
  return (
    <Screen style={{backgroundColor: colors.Amaranth,}} className="p-0" statusStyle='light'>
      <ImageBackground className="w-full h-full" source={require('../assets/welcome.png')} blurRadius={2}>
        {/* overlay */}
        <View className="w-full h-full" style={{backgroundColor: "rgba(0,0,0,.5)"}}>
          <View className="w-full h-4/5 justify-center items-center">
            <AppText className="text-4xl font-bold uppercase text-yellow-200">Quirky Quest</AppText>
            <AppText className="text-xl font-bold text-white">Find your unique person</AppText>
          </View>
          <View className="w-full p-5 h-1/5 justify-center items-center">
            <AppButton
              name="Login"
              onPress={() => navigation.navigate(routes.LOGIN)}
            />
          </View>
        </View>
      </ImageBackground>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.DeepBlush
  }
})

export default WelcomeScreen