import React, {useRef, useEffect, useState} from 'react';
import { StyleSheet, TouchableOpacity, View, Image, FlatList } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Swipper from 'react-native-deck-swiper';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode'
import "core-js/stable/atob"

import Screen from '../components/Screen';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import routes from '../navigation/routes';
import colors from '../config/colors';

function HomeScreen({navigation}) {
    const [userId, setUserId] = useState();
    const [user, setUser] = useState();
    const [profiles, setProfiles] = useState([]);
    const [liked, setLiked] = useState(false);
    const [selected, setSelected] = useState(false);
  
    const swiperRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = await AsyncStorage.getItem('authToken')
            const decodedToken = jwtDecode(token)
            const userId = decodedToken.userId
            setUserId(userId)
        }
        fetchUser()
    }, [])
    useEffect(() => {
        if(userId){
          fetchUserDescription()
        }
      },[userId])
      useEffect(() => {
        if(userId && user){
            fetchProfiles()
            }
        },[userId, user])

    const fetchProfiles = async () => {
        try {
          const response = await axios.get(`http://192.168.99.148:3000/profiles`,{
            params: {
                userId: userId,
                gender: user?.gender,
                turnOns: user?.turnOns,
                lookingFor: user?.lookingFor
            }
          })
        setProfiles(response.data.profiles)
        console.log("Profiles",response.data.profiles[0])
        } catch (error) {
            console.log("Error fetching profiles",error)
        }
    }

    const fetchUserDescription = async () => {
        try {
          const response = await axios.get(`http://192.168.99.148:3000/users/${userId}`)
          const user = response.data
          setUser(user)
        } catch (error) {
          console.log("Error fetching user description",error)
        }
      }

    const handleLike = async (profileId) => {
        try {
          setLiked(true)
          await axios.post(`http://192.168.99.148:3000/send-like`, {
            currentUserId: userId,
            selectedUserId: profileId
          })

          setLiked(false)

        } catch (error) {
          console.log("Error liking profile",error)
        }
    }
    useEffect(() => {
      if (liked) {
          fetchProfiles();
      }
    }, [liked])
  return (
    <Screen style={styles.container}>
        {/* header */}
        <View className="bg-red-300 flex-row items-center justify-between px-5 rounded-2xl">
            <TouchableOpacity onPress={()=> navigation.navigate(routes.PROFILE)}>
                <Image className="w-12 h-12" source={require('../assets/user.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> navigation.navigate(routes.MODAL)}>
                <Image className="w-20 h-20" source={require('../assets/logo_pic2.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> navigation.navigate(routes.CHAT)}>
                <Ionicons name="chatbubbles-sharp" size={30} color="black" />
            </TouchableOpacity>
        </View>
        {/* end of header */}

        {/* swipe cards */}
        <View className="flex-1 -mt-8 p-0">
            <Swipper
                containerStyle={{
                    backgroundColor: "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                ref={swiperRef}
                stackSize={4}
                cardIndex={0}
                verticalSwipe={false}
                animateCardOpacity
                onSwipedLeft={() => console.log('swiped left')}
                onSwipedRight={(index) => handleLike(profiles[index]?._id)}
                overlayLabels={{
                    left: {
                        title: 'NOPE 😔',
                        style: {
                            label: {
                                backgroundColor: colors.FireBush,
                                color: colors.white,
                                fontSize: 24
                            },
                            wrapper: {
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                justifyContent: 'flex-start',
                                marginTop: 20,
                                marginLeft: -20
                            }
                        }
                    },
                    right: {
                        title: 'LIKE 😍',
                        style: {
                            label: {
                                backgroundColor: colors.Amaranth,
                                color: colors.white,
                                fontSize: 24
                            },
                            wrapper: {
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                marginTop: 20,
                                marginLeft: 20
                            }
                        }
                    }
                }}

                cards={profiles}
                renderCard={(card) => card ? (
                    <View key={card.id} className="bg-pink-100 h-4/5 rounded-xl justify-center items-center -ml-4 overflow-hidden border-2 border-pink-500">
                            <Image className="w-full" source={{uri: card.profileImages[0].image}} style={{height: "65%"}}/>          
                            <View className="w-full p-2 bg-white rounded-r-xl" style={{height: "35%"}}>
                              <View className="w-full flex-row justify-between pr-4">
                                <AppText className="text-3xl font-bold capitalize">{card.name}</AppText>
                                <AppText className="text-4xl font-bold text-pink-800">25</AppText>
                              </View>
                                <AppText className="text-base"
                                numberOfLines={4}
                                >{card.description} sun got bet quiet draw afraid snow crowd positive doctor rubbed winter respect fifty pie belong spread closer living climate broad zero paint interior</AppText>
                            </View>
                        </View>
                    ) : (
                        <View className="bg-pink-500 h-3/4 w-full rounded-xl -ml-2 overflow-hidden p-2">
                            <Image className="w-full h-1/2 object-contain rounded-xl" source={{uri: "https://img.freepik.com/free-photo/sad-crying-face-emoticon-symbol_53876-165339.jpg"}} />           
                            <View className="w-full h-1/2 p-5 bg-white rounded-xl justify-center items-center">
                                <AppText className="text-3xl font-bold">No more profiles</AppText>
                            </View>
                        </View>
                    )
                }
            />
        </View>
        {/* end of swipe cards */}
        <View className="flex-row justify-between items-center px-4 py-6 bg-red-300 mb-5 rounded-md mx-2">
            <TouchableOpacity onPress={() => swiperRef.current.swipeLeft()} className="p-1 bg-pink-200 rounded-full">
                <MaterialCommunityIcons name="close" size={45} color="black"/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => swiperRef.current.swipeRight()}>
                <MaterialCommunityIcons name="heart" size={45} color={colors.Amaranth} />
            </TouchableOpacity>
        </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {}
});

export default HomeScreen;