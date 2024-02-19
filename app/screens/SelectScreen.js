import React, {useState, useEffect, useContext} from 'react';
import { View, StyleSheet, TouchableHighlight, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import "core-js/stable/atob"
import {jwtDecode} from 'jwt-decode'
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';

import Screen from '../components/Screen';
import colors from '../config/colors';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import routes from '../navigation/routes';
import UserContext from '../hooks/userContext';

function SelectScreen({navigation}) {
    const [option, setOption] = useState('')
    const [userId, setUserId] = useState('')

    const userContext = useContext(UserContext)

    useEffect(() => {
        const fetchUser = async () => {
            const token = await AsyncStorage.getItem('authToken')
            const decodedToken = jwtDecode(token)
            const userId = decodedToken.userId
            setUserId(userId)
        }
        fetchUser()
    }, [])

    const updateUserGender = async () => {
        try {
            const response = await axios.put(`http://192.168.99.148:3000/users/${userId}/gender`, {
                gender: option
            })
            if(response.status === 200){
                userContext.setUser(userId)
                navigation.dispatch(
                    CommonActions.navigate({
                        name: routes.PROFILE, 
                    })
                );
            }
        } catch (error) {
            console.log("error updating gender",error)
        }
    }

  return (
    <Screen>
        <View className="w-full flex-row items-center p-2 rounded-xl" style={{backgroundColor: colors.Amaranth}}>
          <AppText style={{fontSize: 18, letterSpacing: 2}} className="uppercase text-white ml-5 font-bold">Please select your gender</AppText>
        </View>
        <View className="w-full p-1 justify-center items-center">
            <Image
                source={require('../assets/logo_pic1.png')}
                style={{width: 100, height: 100, objectFit: "contain"}}
            />
        </View>
        <View className="w-full h-72 bg-red-200 justify-between">
            <TouchableHighlight
                className="w-full p-2 rounded-xl"
                style={{
                    backgroundColor: option === "male" ?colors.Amaranth:colors.DeepBlush
                }}
                underlayColor={colors.AmaranthOpac}
                onPress={() => setOption("male")}
            >
                <View className="w-full flex-row items-center justify-between">
                    <AppText className="text-white">I am a man</AppText>
                    <View>
                        <Image
                            source={require('../assets/man_icon.png')}
                            style={{width: 70, height: 70, borderRadius: 35}}
                        />
                    </View>
                </View>
            </TouchableHighlight>
            <TouchableHighlight
                className="w-full p-2 rounded-xl"
                style={{
                    backgroundColor: option === "female" ?colors.Amaranth:colors.DeepBlush
                }}
                underlayColor={colors.AmaranthOpac}
                onPress={() => setOption("female")}
            >
                <View className="w-full flex-row items-center justify-between">
                    <AppText className="text-white">I am a woman</AppText>
                    <View>
                        <Image
                            source={require('../assets/woman_icon.png')}
                            style={{width: 70, height: 70, borderRadius: 35}}
                        />
                    </View>
                </View>
            </TouchableHighlight>
            <TouchableHighlight
                className="w-full p-2 rounded-xl"
                style={{
                    backgroundColor: option === "trans" ?colors.Amaranth:colors.DeepBlush
                }}
                underlayColor={colors.AmaranthOpac}
                onPress={() => setOption("trans")}
            >
                <View className="w-full flex-row items-center justify-between">
                    <AppText className="text-white">I am non-binary</AppText>
                    <View>
                        <Image
                            source={require('../assets/trans_icon.jpg')}
                            style={{width: 70, height: 70, borderRadius: 35}}
                        />
                    </View>
                </View>
            </TouchableHighlight>
        </View>
        <View className="w-full py-10 items-center">
            {option && <AppButton
                name="Continue"
                style={{backgroundColor: colors.Amaranth}}
                textStyle={{color: colors.white}}
                onPress={updateUserGender}
            />}
        </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {}
});

export default SelectScreen;