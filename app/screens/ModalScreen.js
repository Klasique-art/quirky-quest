import { View, Text, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, {useState} from 'react'
import * as Yup from 'yup'

import {AppForm, AppFormField, SubmitButton} from '../components/forms'
import Screen from '../components/Screen'
import colors from '../config/colors'

const validationSchema = Yup.object().shape({
  profilePic: Yup.string().label("Profile pic"),
  job: Yup.string().label("Occupation").required("Please enter your occupation"),
  age: Yup.number().label("Age").min(18, "You must be at least 18 years old").max(80, "You must be at most 80 years old").required("Please enter your age")
})

const ModalScreen = () => {

    const handleSubmit = ({profilePic, job, age}) => {
      console.log(job)
      console.log(age)
      console.log(profilePic)
    }
  return (
    <Screen>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{height: "100%"}}>
        <View style={{height: "100%"}}>
          <Text style={{fontSize: 30}}>Modal Screen</Text>
          <AppForm
            initialValues={{profilePic: '', job: '', age: ''}}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <AppFormField
              name="profilePic"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              color={colors.DeepBlush}
              placeholder="Enter profile pic url"
              textContentType="emailAddress"
            />
            <AppFormField
              name="job"
              autoCapitalize="none"
              autoCorrect
              color={colors.DeepBlush}
              placeholder="Enter your occupation"
            />
            <AppFormField
              name="age"
              autoCapitalize="none"
              keyboardType="numeric"
              color={colors.DeepBlush}
              placeholder="Enter your age"
              maxLength={2}
            />
           
            <SubmitButton 
              title="Update profile" 
              style={{
                width: "100%",
                marginTop: "auto", 
                marginBottom: 10
                }}
              />
          </AppForm>
        </View>
      </TouchableWithoutFeedback>
    </Screen>
  )
}

export default ModalScreen