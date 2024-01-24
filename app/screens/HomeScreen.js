import React, {useRef} from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Swipper from 'react-native-deck-swiper';

import Screen from '../components/Screen';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import routes from '../navigation/routes';
import colors from '../config/colors';

const DUMMY_PERSON_DATA = [
    {
        id: '1',
        name: 'John Doe',
        age: 27,
        occupation: 'Software Engineer',
        bio: 'I like to play guitar and make music',
        images: [
            require('../assets/user.png'),
            require('../assets/user.png'),
            require('../assets/user.png'),
        ]
    },
    {
        id: '2',
        name: 'Jane Doe',
        age: 22,
        occupation: 'UI/UX Designer',
        bio: 'I like to draw and make art',
        images: [
            require('../assets/user2.png'),
            require('../assets/user2.png'),
            require('../assets/user2.png'),
        ]
    },
    {
        id: '3',
        name: 'James Doe',
        age: 25,
        occupation: 'Product Manager',
        bio: 'I like to make products and manage people',
        images: [
            require('../assets/user1.png'),
            require('../assets/user1.png'),
            require('../assets/user1.png'),
        ]
    },
    {
        id: '4',
        name: 'Jenny Doe',
        age: 24,
        occupation: 'Software Engineer',
        bio: 'I like to make software and manage people',
        images: [
            require('../assets/user3.jpg'),
            require('../assets/user3.jpg'),
            require('../assets/user3.jpg'),
        ]
    },
]


function HomeScreen({navigation}) {
    const swiperRef = useRef(null);
  return (
    <Screen style={styles.container}>
        {/* header */}
        <View className="bg-red-300 flex-row items-center justify-between px-5">
            <TouchableOpacity >
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
        <View className="flex-1 -mt-6 p-0">
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
                onSwipedRight={() => console.log('swiped right')}
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

                cards={DUMMY_PERSON_DATA}
                renderCard={(card) => {
                    return (
                        <View key={card.id} className="bg-pink-100 h-3/4 rounded-xl justify-center items-center -ml-4 overflow-hidden">
                            <Image className="w-full h-full" source={card.images[0]} />
                            <View className="absolute bottom-2 left-0 w-9/12 p-5 bg-white rounded-r-xl">
                                <AppText className="text-3xl font-bold">{card.name}, {card.age}</AppText>
                                <AppText className="text-2xl font-bold">{card.occupation}</AppText>
                            </View>
                        </View>
                    )
                }
                }
            />
        </View>
        {/* end of swipe cards */}
        <View className="flex-row justify-between items-center px-5 py-10">
            <TouchableOpacity onPress={() => swiperRef.current.swipeLeft()}>
                <MaterialCommunityIcons name="close" size={40} color={colors.FireBush} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => swiperRef.current.swipeRight()}>
                <MaterialCommunityIcons name="heart" size={40} color={colors.Amaranth} />
            </TouchableOpacity>
        </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {}
});

export default HomeScreen;