import { View, StyleSheet, ImageBackground, Image, TouchableWithoutFeedback, ScrollView, TouchableHighlight, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native'
import React, {useState, useEffect} from 'react'
import Carousel from 'react-native-snap-carousel'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode'
import "core-js/stable/atob"
import * as ImagePicker from 'expo-image-picker'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import Screen from '../components/Screen'
import AppButton from '../components/AppButton'
import routes from '../navigation/routes'
import AppText from '../components/AppText'
import Heading from '../components/Heading'
import colors from '../config/colors'

const turnonsData = [
  {
    id: "0",
    name: "Music",
    description: "Pop Rock-Indie pick our sound track",
  },
  {
    id: "10",
    name: "Kissing",
    description:
      " It's a feeling of closeness, where every touch of lips creates a symphony of emotions.",
  },
  {
    id: "1",
    name: "Fantasies",
    description:
      "Fantasies can be deeply personal, encompassing diverse elements such as romance",
  },
  {
    id: "2",
    name: "Nibbling",
    description:
      "playful form of biting or taking small, gentle bites, typically done with the teeth",
  },
  {
    id: "3",
    name: "Desire",
    description: "powerful emotion or attainment of a particular person.",
  },
];
const lookingForData = [
  {
    id: "0",
    name: "Casual",
    description: "Let's keep it easy and see where it goes",
  },
  {
    id: "1",
    name: "Long Term",
    description: "How about a one life stand",
  },
  {
    id: "2",
    name: "Virtual",
    description: "Let's have some virtual fun",
  },
  {
    id: "3",
    name: "Open for Anything",
    description: "Let's Vibe and see where it goes",
  },
];

const ProfileScreen = ({navigation}) => {
  const [option, setOption] = useState('AD')
  const [about, setAbout] = useState('')
  const [name, setName] = useState('')
  const [activeSlide, setActiveSlide] = useState(0)
  const [userId, setUserId] = useState('')
  const [selectedTurnOns, setSelectedTurnOns] = useState([])
  const [selectedLookingFor, setSelectedLookingFor] = useState([])
  const [imageUrl, setImageUrl] = useState('')
  const [images, setImages] = useState([])  

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
      requestPermission()
    }, [])

    // requesting permission to access camera roll
    const requestPermission = async () => {
      try {
        const {granted} = await ImagePicker.requestMediaLibraryPermissionsAsync()

        if(!granted){
          alert("We need permission to access your camera roll")
          }
        } catch (error) {
        console.log("Error requesting permission",error)
        
      }
    }
    // picking image from camera roll for main profile image
    const pickMainProfileImage = async () => {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.6,
        })
        if(!result.canceled){
          setImageUrl(result.assets[0].uri)
        }
      } catch (error) {
        console.log("Error picking image",error)
      }
    }

    // picking image from camera roll for profile images
    const pickProfileImage = async () => {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.6,
        })
        if(!result.canceled){
          addProfileImageToBackend(result.assets[0].uri);
        }
      } catch (error) {
        console.log("Error picking image",error)
      }
    }
     // adding each profile image to backend
     const addProfileImageToBackend = async (image) => {
      try {
        const response = await axios.post(`http://192.168.99.148:3000/users/${userId}/profile-images`, {imageUrl: image})

        console.log("response",response.data)
        if(response.status === 200){
          setImages([...images, {image: image}])
        }
      } catch (error) {
        console.log("Error adding profile image to backend",error)
      }
    }

    const fetchUserDescription = async () => {
      try {
        const response = await axios.get(`http://192.168.99.148:3000/users/${userId}`)
        const user = response.data
        setAbout(user?.user?.description)
        setName(user?.user?.name)
        setSelectedTurnOns(user?.user?.turnOns)
        setSelectedLookingFor(user?.user?.lookingFor)
        setImages(user?.user?.profileImages)
      } catch (error) {
        console.log("Error fetching user description",error)
      }
    }
  
    const updateUserDescription = async () => {
      try {
        const response = await axios.put(`http://192.168.99.148:3000/users/${userId}/description`, {description: about})
  
        if(response.status === 200){
          Alert.alert(
            "Success",
            "Your bio was updated successfully",
          );
        }
      } catch (error) {
        console.log("Error updating user description",error)
      }
    }

    const handleTurnOnToggle = (name) => {
      if(selectedTurnOns.includes(name)){
        removeTurnOnFromBackend(name)
      }else{
        addTurnOnToBackend(name)
      }
    }
    const handleLookingForToggle = (lookingFor) => {
      if(selectedLookingFor.includes(lookingFor)){
        removeLookingForFromBackend(lookingFor)
      }else{
        addLookingForToBackend(lookingFor)
      }
    }

    const addLookingForToBackend = async (lookingFor) => {
      try {
        const response = await axios.put(`http://192.168.99.148:3000/users/${userId}/looking-for/`, {lookingFor: lookingFor})

        if(response.status === 200){
          setSelectedLookingFor([...selectedLookingFor, lookingFor])
        }

      } catch (error) {
        console.log("Error adding looking for to backend",error)
      }
    }

    const removeLookingForFromBackend = async (lookingFor) => {
      try {
        const response = await axios.put(`http://192.168.99.148:3000/users/${userId}/looking-for/remove`, {lookingFor: lookingFor})

        if(response.status === 200){
          setSelectedLookingFor(selectedLookingFor.filter(item => item !== lookingFor))
        }

      } catch (error) {
        console.log("Error removing looking for from backend",error)
      }
    }
    const addTurnOnToBackend = async (turnOn) => {
      try {
        const response = await axios.put(`http://192.168.99.148:3000/users/${userId}/turn-ons/add`, {turnOn: turnOn})
        
        if(response.status === 200){
          setSelectedTurnOns([...selectedTurnOns, turnOn])
        }
      } catch (error) {
        console.log("Error adding turn on to backend",error)
      }
    }

    const removeTurnOnFromBackend = async (turnOn) => {
      try {
        const response = await axios.put(`http://192.168.99.148:3000/users/${userId}/turn-ons/remove`, {turnOn: turnOn})
        
        if(response.status === 200){
          setSelectedTurnOns(selectedTurnOns.filter(item => item !== turnOn))
        }
      } catch (error) {
        console.log("Error removing turn on from backend",error)
      }
    }

   
    // delete each profile image
    const deleteProfileImage = (image) => {
      const newImages = images.filter(item => item.image !== image)
      // setImages(newImages)
    }

  const renderImageCarousel = ({item}) => {
    return (
      <View className="w-full justify-center">
        <View className="w-full bg-slate-400" style={{
          width: "85%", 
          height: 290, 
          overflow: "hidden",
          transform: [{rotate: "-3deg"}],
          borderRadius: 10,

        }}>
          <Image
            source={{uri: item.image}}
            style={{
              width: "100%", 
              height: "100%", 
              resizeMode: "cover",
            }}
          />
        </View>
        <View className="flex-row items-center gap-5 w-full justify-center p-4">
          <View className="mb-5 mt-1 bg-pink-600 px-2 rounded-lg">
            <AppText className="text-white font-bold">{activeSlide + 1} / {images.length}</AppText>
          </View>
          <AppButton
            name="Delete"
            style={{padding: 5, height: 40, width: 100, transform: [{rotate: "3deg"}]}}
            onPress={()=> 
              Alert.alert(
                "Delete Image",
                "Are you sure you want to delete this image?",
                [
                  { text: "Yes ", onPress: () => deleteProfileImage(item.image) },
                  {
                    text: "Cancel",
                    style: "cancel"
                  },
                ]
              )
            }
            bgColor={colors.FireBush}
          />
        </View>
      </View>
    )
  }

  return (
    <Screen>
      <Heading onPress={() => navigation.navigate(routes.HOME)} Icon>Profile</Heading>
      <ScrollView>
        <ImageBackground className="w-full h-48 justify-center items-center mt-2" source={require('../assets/bg_profile.jpg')} blurRadius={2}>
          <TouchableWithoutFeedback onPress={pickMainProfileImage}>
            <View className="w-24 h-24 rounded-full overflow-hidden bg-pink-600 justify-center items-center">
              {imageUrl ? 
                <Image className="w-full h-full" source={{ uri: imageUrl}} />
                : <MaterialCommunityIcons name="camera" size={40} color={colors.white} />}
            </View>
          </TouchableWithoutFeedback>
        </ImageBackground>
        <View className="w-full bg-pink-200 mb-5">
          <AppText className="text-center text-2xl font-bold">{name}</AppText>
          <AppText className="text-center text-lg">35 years</AppText>
        </View>
        {/* tabs */}
        <View className="flex-row items-center justify-center mt-10 gap-5 mx-2 p-2 ">
          <TouchableHighlight onPress={()=> setOption("AD")} className="px-1" underlayColor={colors.ShockingLite}>
            <AppText 
              className="text-base font-medium"
              style={{
                color: option === "AD" ?colors.Amaranth:"gray"
              }}
            >About</AppText>
          </TouchableHighlight>
          <TouchableHighlight onPress={()=> setOption("photos")} className="px-1" underlayColor={colors.ShockingLite}>
            <AppText 
            className="text-base font-medium"
            style={{
              color: option === "photos" ?colors.Amaranth:"gray"
            }}
            >Photos</AppText>
          </TouchableHighlight>
          <TouchableHighlight onPress={()=> setOption("lookingFor")} className="px-1" underlayColor={colors.ShockingLite}>
            <AppText 
              className="text-base font-medium"
              style={{
                color: option === "lookingFor" ?colors.Amaranth:"gray"
              }}
            >Looking For</AppText>
          </TouchableHighlight>
          <TouchableHighlight onPress={()=> setOption("turnon")} className="px-1" underlayColor={colors.ShockingLite}>
            <AppText 
              className="text-base font-medium"
              style={{
                color: option === "turnon" ?colors.Amaranth:"gray"
              }}
            >Turn-ons</AppText>
          </TouchableHighlight>
        </View>
        {/* end of tabs */}
        {/* content */}
        <View className="w-full py-5 p-2">
          {option === "AD" && (
            <View className="w-full px-2 border-2 border-pink-300 rounded-lg p-2 h-72">
              <TextInput
                placeholder="Write what you want to say about yourself"
                multiline
                style={{
                  fontSize: 16,
                  textAlignVertical: 'top',
                }}
                className="w-full h-full"
                value={about}
                onChangeText={text => setAbout(text)}
              />
              {about && <AppButton 
                name="publish in feed"
                className="w-full"
                style={{marginTop: "auto"}} 
                onPress={updateUserDescription}
              />}
            </View>
          )}
          {option === "photos" && (
            <View className="w-full px-2">
              <Carousel
                data={images}
                renderItem={renderImageCarousel}
                sliderWidth={350}
                itemWidth={300}
                onSnapToItem={(index) => setActiveSlide(index)}
              />
              <View>
                <AppButton
                  name="Add Photo"
                  className="self-center my-5"
                  style={{marginTop: "auto"}}
                  onPress={pickProfileImage}
                />
              </View>
            </View>
          )}
          {option === "lookingFor" && (
            <View className="w-full px-2">
                <FlatList
                  data={lookingForData}
                  numColumns={2}
                  columnWrapperStyle={{justifyContent: 'space-between'}}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({item}) => (
                    <TouchableOpacity 
                      className="w-44 m-1 p-2 h-36 rounded-lg" 
                      onPress={()=> handleLookingForToggle(item?.name)}
                      style={{
                        backgroundColor: selectedLookingFor.includes(item?.name) ?colors.Amaranth:colors.Shocking
                      }}
                    >
                      <View className="w-full h-full p-2 rounded-lg bg-pink-100">
                        <AppText className="font-bold mb-1 text-center" style={{fontSize: 17}}>{item.name}</AppText>
                        <AppText className="text-base text-center">{item.description}</AppText>
                      </View>
                    </TouchableOpacity>
                  )}
                />
            </View>
          )}
          {option === "turnon" && (
            <View className="w-full px-2">
             {turnonsData?.map((item, index) => (
               <TouchableOpacity 
                  key={index} 
                  className="w-full my-2"
                  onPress={() => handleTurnOnToggle(item?.name)}
                >
                  <View 
                    className="w-full p-2 rounded-lg h-28"
                    style={{
                      backgroundColor: selectedTurnOns.includes(item?.name) ?colors.Amaranth:colors.Shocking
                    }}
                  >
                    <AppText className="text-lg font-bold text-white">{item.name}</AppText>
                    <AppText className="text-base text-white">{item.description}</AppText>
                  </View>
                </TouchableOpacity>
             ))}
            </View>
          )}
        </View>
        {/* end of content */}
      </ScrollView>
    </Screen>
  )
}

export default ProfileScreen