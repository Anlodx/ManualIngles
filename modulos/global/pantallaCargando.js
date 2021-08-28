import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Alert,
  Clipboard
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Orientation from 'react-native-orientation-locker';
import messaging from '@react-native-firebase/messaging';


import {useSelector, useDispatch} from 'react-redux';
import {establecerDatosDeCredencialDesdeIniciarSesion} from '../../store/actions.js';


import { store } from '../../store/store.js';
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const pantallaCargando = ({navigation}) => {
  const dispatch = useDispatch();
  const datosDeCredencial = useSelector(store => store.datosDeCredencial);
	useEffect(() => {


		let tokenDeFirebase = null;

		Orientation.lockToPortrait();

		messaging().getToken()
		.then((token) => {
			tokenDeFirebase = token;
			navigation.navigate("Iniciar Sesion", {
				tokenDeFirebase: tokenDeFirebase
			});

      //getData()
		});


    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@UserToken:key')
//        dispatch(establecerDatosDeCredencialDesdeIniciarSesion(JSON.parse(jsonValue)));
        //console.log("esto retorna el objeto desde pantalla cargando: ",JSON.parse(jsonValue))
        //console.log("data del registrado => ",datosDeCredencial)
        //setState(jsonValue);
        return (jsonValue != null) ? (JSON.parse(jsonValue)) : (null);
      } catch(e) {
        // error reading value
        console.log("lo siento hubo un error al guardar => ",e)
      }
    }



		console.log("Hola mundo");

		return messaging().onTokenRefresh(token => {
			tokenDeFirebase = token;
			navigation.navigate("Iniciar Sesion", {
				tokenDeFirebase: tokenDeFirebase
			});
			/*
			Alert.alert('Token', (token), [
				{
					text: 'Copiar',
					onPress: async () => {
						await Clipboard.setString(token);
					}
				},
				{
					text: 'Ok'
				}
			]);
			*/
		});


	}, []);

	return(
		<View>
			<View>
				<Text>Cargando...</Text>
			</View>
		</View>
	);
};

export default pantallaCargando;
