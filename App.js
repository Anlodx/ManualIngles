/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
 import 'react-native-gesture-handler';
import React from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  TouchableOpacity,
  View,
} from 'react-native';
import VistaTiempos from "./templates/vistaTiempos"
import VistaQuist from "./templates/vistaQuist"
import VistaVerbos from "./templates/vistaVerbos"
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Go back Home again bro</Text>
      </TouchableOpacity>
    </View>
  );
}

const Drawer = createDrawerNavigator();
const App = () => {
  return(
    <VistaVerbos/>
  )
/*
  return (
    <NavigationContainer>
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
    </Drawer.Navigator>
  </NavigationContainer>
  );
*/
};


function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
        <Text>Go to notifications</Text>
      </TouchableOpacity>
    </View>
  );
}

export default App;
