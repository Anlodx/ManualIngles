import React,  {useRef,useState, useEffect} from 'react';
import {TouchableOpacity,TextInput, Image,Text, View, StyleSheet, Alert, SafeAreaView, ScrollView, Picker, StatusBar, Button, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator,TransitionPresets,CardStyleInterpolators} from "@react-navigation/stack";


//ARCHIVOS IMPORTANTES POR EL MOMENTO
import Header from "./header.js";
import muro from './muro.js';
import mensajes from './Mensajes/Mensajes.js';
import notificaciones from './notificaciones.js';
import mochila from './mochila.js';
import mochilaVisitante from './espectador/mochila.js';
import seguidores from "./seguidores.js";
import ajustes from './ajustes.js';

import {useSelector} from 'react-redux';

import NetInfo from '@react-native-community/netinfo'
import messaging from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification";


//OCUPO LOS COMPONENTES MURO

const Stack = createStackNavigator();

const todoLoRelacionadoParaAlumnoNormal = ({navigation}) => {
	const datosDeCredencial = useSelector(store => store.datosDeCredencial);
	
	var NetInfoSubscribtion = null;
	const [state,setState] = useState({
		connection_status:false,
		connection_type:null,
		connection_net_reachable: true
	})

	useEffect(()=>{
		NetInfoSubscribtion = NetInfo.addEventListener(_handleConnectivityChange);
		const firebaseMessaging = messaging().onMessage(async (mensaje)=>{
				console.log("respuesta del firebaseMessaging => ",mensaje);
				PushNotification.localNotification({
					title: mensaje.data.titulo,
					message: mensaje.data.mensaje
				});
		});

		return () => {
			NetInfoSubscribtion && NetInfoSubscribtion()
			return firebaseMessaging;
		}

		
	},[]);
	const _handleConnectivityChange = (state) => {
		setState({
			connection_status: state.isConnected,
			connection_type: state.type,
			connection_net_reachable: state.isInternetReachable
		})
	}
	/*
	const datosViajantes = useRef({
		matricula : route.params['matricula'],
		nombreCompleto : {
			nombres : route.params['nombres'],
			apellidoPaterno : route.params['apellido_paterno'],
			apellidoMaterno : route.params['apellido_materno']
		},
		usuario : route.params['usuario'],
		contrasenia : route.params['contrasenia'],
		especialidad : route.params['especialidad'],
		fechaDeNacimiento : route.params['fecha_de_nacimiento'],
		genero : route.params['genero'],
		frase : route.params['frase'],
		rutaDeFoto : route.params['ruta de foto'],
		hobbies : route.params['hobbies']

		//tipoDeUsuario : route.params.tipoDeUsuario

		/*
			elecciones
		*//*
	});
	*/
	//const [prueba, modificarPrueba] = useState(true);

	/*
	useEffect(() => {
		setInterval(() => {
			console.log('PASAMOS POR AQUI');
			modificarPrueba(!prueba);
		},1000);
	},[]);
	*/
	/*
	<stack.Navigator initialRouteName={"Muro"} headerMode={"float"} animation={"fade"}

           screenOptions={{
            gestureEnabled:true,
            gestureDirection:"horizontal",
            cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS//forVerticalIOS
           }}>



		    <stack.Screen name="Muro" component={muro}  options={{
			header: (props) => (<Header {...props}/>)

			}} />

    </stack.Navigator>
	*/



	return(
		(state.connection_net_reachable != null && state.connection_net_reachable != false) ?
		<Stack.Navigator initialRouteName={"Muro"} headerMode={"float"} animation={"fade"}

			screenOptions={{
				header: (props) => (<Header {...props} />),
				gestureEnabled:true,
				gestureDirection:"horizontal",
				cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS//forVerticalIOS
			}}>

			<>
			{
				console.log("este es el status de netInfo: ",state.connection_status,"--------este es state conexion type : ", state.connection_type,"-------esto es reachable: ", state.connection_net_reachable)
			}
			</>

				<Stack.Screen name="Muro" component={muro}
					initialParams={{matricula : datosDeCredencial.matricula}}
				/>

				<Stack.Screen name="Mensajes" component={mensajes}
				initialParams={{matricula : datosDeCredencial.matricula}}
				/>


				<Stack.Screen name="Mochila" component={mochila}
				initialParams={{matricula : datosDeCredencial.matricula}}
				/>

				<Stack.Screen name="MochilaVisitante" component={mochilaVisitante}
				initialParams={{matricula : datosDeCredencial.matricula}}
				/>

        <Stack.Screen name="seguidores" component={seguidores}
				initialParams={{matricula : datosDeCredencial.matricula}}
				/>

				<Stack.Screen name="Notificaciones" component={notificaciones}
				initialParams={{matricula : datosDeCredencial.matricula}}
				/>

				<Stack.Screen name="Ajustes" component={ajustes}
				initialParams={{matricula : datosDeCredencial.matricula}}
				/>

		</Stack.Navigator>

		:
		<>

		<View style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height, backgroundColor: "#dfe6e9",alignItems: 'center',justifyContent: 'center'}}>
			<Icon name={"signal-off"} type={"material-community"} size={40} color={"#ff4757"}/>
			<Text style={{marginTop: 10,alignSelf:"center",textAlign: 'center',fontFamily: "AkayaKanadaka-Regular",fontSize: 20,color:"#111"}}>
			Hijole...no tienes conexión a internet =(
			</Text>
		</View>
		
		<>
			{
				console.log("este es el status de netInfo: ",state.connection_status,"--------este es state conexion type : ", state.connection_type,"-------esto es reachable: ", state.connection_net_reachable)
			}
			</>
		</>
	
	);
}

export default todoLoRelacionadoParaAlumnoNormal;
