import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, Image, Alert } from 'react-native'
import React, {useState} from 'react'
import * as Yup from 'yup'
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../config/colors'
import AppButton from '../components/AppButton'
import routes from '../navigation/routes'
import { AppForm, AppFormField, SubmitButton } from '../components/forms'
import Screen from '../components/Screen'
import AppText from '../components/AppText';

const validationSchema = Yup.object().shape({
  email: Yup.string().label("Email").email("Please enter a valid email").required("Please enter your email"),
  password:  Yup.string().required("Please insert password").min(8).label("Password").matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/, "Must contain at least one uppercase, one lowercase, and one number."),
})

const LoginScreen = ({navigation}) => {
  const [isSecure, setIsSecure] = useState(true)

  const handleLogin = ({email, password}) => {
    const user = {email, password,}

    axios.post('http://192.168.99.148:3000/login', user).then(res => {
      const token = res.data.token
      AsyncStorage.setItem('authToken', token)
      navigation.navigate(routes.SELECT)
    }).catch(err => {
      console.log("Error logging in user",err)
      Alert.alert(
        "Error",
        "Error logging in user",
        [
          { text: "OK", }
        ]
      );
    }
    )
  }

  return (
    <Screen style={{backgroundColor: colors.DeepBlush}}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{height: "100%"}}>
      <View style={{height: "100%"}}>
        <View className="w-full flex-row items-center p-2 rounded-xl" style={{backgroundColor: colors.Amaranth}}>
          <AntDesign 
            name="left" 
            size={30} 
            color="white" 
            onPress={()=> navigation.goBack()}
          />
          <Text style={{fontSize: 26, letterSpacing: 2}} className="uppercase text-white ml-5 font-bold">Login</Text>
        </View>
        <View className="w-full h-64 my-2">
          <Image source={require('../assets/login_pic.png')} className="w-full h-full" style={{objectFit: "contain"}}/>
        </View>
        <AppForm
          initialValues={{email: '', password: ''}}
          onSubmit={handleLogin}
          validationSchema={validationSchema}
        >
          <AppFormField
            name="email"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="Enter your email"
            textContentType="emailAddress"
            color={colors.white}
            textColor={colors.white}
          />
          <AppFormField
            name="password"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Enter your password"
            secureTextEntry={isSecure}
            icon={isSecure ? "eye" : "eye-off"}
            iconColor={colors.white}
            onPress={()=> setIsSecure(!isSecure)}
            color={colors.white}
            textColor={colors.white}
          />
         
          <SubmitButton 
            title="Login" 
            />
        </AppForm>
        <View className="justify-center items-center gap-1 p-1 my-5" style={styles.container}>
          <AppText style={{color: colors.white}}>Don't have an account?</AppText>
          <AppButton 
            name="Register"  
            bgColor={colors.DeepBlush}
            onPress={()=> navigation.navigate(routes.REGISTER)}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.Amaranth,
    borderRadius: 15,
    marginTop: 50,
  }
})
export default LoginScreen