import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import colors from '../config/colors';

function AppInput({icon,iconColor, color=colors.DeepBlush, style,onPress,textColor, ...otherProps}) {
  return (
    <View className="w-full flex-row gap-2 mb-5 h-14 overflow-hidden items-center justify-center">
      <TextInput
          placeholderTextColor={colors.FireBush}
          {...otherProps}
          style={{
            width: icon ? "85%": "100%",
            borderBottomColor: color,
            borderBottomWidth: 6,
            color: textColor,
          }}
          className="h-full text-xl"
      />
      {icon && <TouchableOpacity className="h-full" style={{
        width: "15%",
        justifyContent: "center",
        alignItems: "center",
      }}>
         <MaterialCommunityIcons
            name={icon}
            size={35}
            color={iconColor}
            style={styles.icon}
            onPress={onPress}
        />
      </TouchableOpacity>}
    </View>
  );
}

const styles = StyleSheet.create({

});

export default AppInput;