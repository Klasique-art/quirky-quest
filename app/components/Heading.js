import { View, Text } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'

import colors from '../config/colors'
import AppText from './AppText'

const Heading = ({children, onPress, Icon}) => {
  return (
    <View className="w-full flex-row items-center p-2 rounded-xl" style={{backgroundColor: colors.Amaranth}}>
        {Icon && <AntDesign 
            name="left" 
            size={30} 
            color="white" 
            onPress={onPress}
          />}
          <AppText style={{fontSize: 18, letterSpacing: 2}} className="uppercase text-white ml-5 font-bold">{children}</AppText>
    </View>
  )
}

export default Heading