import React from 'react';
import { View, StyleSheet } from 'react-native';

import Screen from '../components/Screen';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';

function ChatScreen({navigation}) {
  return (
    <Screen style={styles.container}>
        <AppText>Chat Screen</AppText>
        <AppButton name="back"  onPress={()=> navigation.goBack()}/>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {}
});

export default ChatScreen;