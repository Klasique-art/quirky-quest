import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Alert} from 'react-native'
import React, {useState} from 'react'
import * as Yup from 'yup'
import axios from 'axios'

import colors from '../config/colors'
import AppButton from '../components/AppButton'
import routes from '../navigation/routes'
import { AppForm, AppFormField, SubmitButton } from '../components/forms'
import Screen from '../components/Screen'
import AppText from '../components/AppText';

const validationSchema = Yup.object().shape({
  name: Yup.string().label("Name").required("Please enter your name").min(3),
  email: Yup.string().label("Email").email("Please enter a valid email").required("Please enter your email"),
  password:  Yup.string().required("Please insert password").min(8).label("Password").matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/, "Must contain at least one uppercase, one lowercase, and one number."),
  confirmPassword: Yup.string().required("Please confirm password").oneOf([Yup.ref('password'), null], 'Passwords must match')
})

const RegisterScreen = ({navigation}) => {
  const [isSecure, setIsSecure] = useState(true)
  const [isConfirmSecure, setIsConfirmSecure] = useState(true)

  const handleSubmit = ({name, email, password,}) => {
    const user = {name, email, password,}

    axios.post('http://192.168.99.148:3000/register',user).then(res => {
        Alert.alert(
          "Success",
          "You have successfully registered",
          [
            { text: "OK", onPress: () => navigation.navigate(routes.LOGIN) }
          ]
        );
        user.email = ''
        user.password = ''
        user.name = ''

    }).catch(err => {
      console.log("Error registering user",err.response.data.message)
      Alert.alert(
        "Error",
        `Error registering user: ${err.response.data.message}`, 
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
          <Text style={{fontSize: 26, letterSpacing: 2}} className="uppercase text-white ml-5 font-bold">register</Text>
        </View>
        <View className="w-full my-2">
        </View>
        <AppForm
          initialValues={{name: '', email: '', password: '', confirmPassword: ''}}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <AppFormField
            name="name"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="Enter your name"
            textContentType="emailAddress"
            color={colors.white}
            textColor={colors.white}
          />
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
          <AppFormField
            name="confirmPassword"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Confirm your password"
            secureTextEntry={isConfirmSecure}
            icon={isConfirmSecure ? "eye" : "eye-off"}
            iconColor={colors.white}
            onPress={()=> setIsConfirmSecure(!isConfirmSecure)}
            color={colors.white}
            textColor={colors.white}
          />
          <SubmitButton 
            title="Register" 
            />
        </AppForm>
        <View className="justify-center items-center gap-1 p-1 my-5" style={styles.container}>
          <AppText style={{color: colors.white}}>Already a member?</AppText>
          <AppButton 
            name="Login"  
            bgColor={colors.DeepBlush}
            onPress={()=> navigation.navigate(routes.LOGIN)}
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
    marginTop: 100,
  }
})
export default RegisterScreen
