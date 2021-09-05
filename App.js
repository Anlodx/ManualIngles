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
import VistaSlangs from "./templates/vistaSlangs"
import VistaNouns from "./templates/vistaNouns"
import VistaSpeechToText from "./templates/VistaSpeechToText"

import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';


const Drawer = createDrawerNavigator();
const App = () => {
  
  return (
    <NavigationContainer>
    <Drawer.Navigator initialRouteName="Nouns">
      <Drawer.Screen name="Nouns" component={VistaNouns} />
      <Drawer.Screen name="Slangs" component={VistaSlangs} />
      <Drawer.Screen name="Verbs" component={VistaVerbos} />
      <Drawer.Screen name="Quiz" component={VistaQuist} />
      <Drawer.Screen name="Speech" component={VistaSpeechToText} />
    </Drawer.Navigator>
  </NavigationContainer>
  );

};

export default App;
