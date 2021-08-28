import React,  {useState, useEffect, useCallback, useRef} from 'react';
import {FlatList, ToastAndroid, TouchableOpacity, TouchableNativeFeedback, TextInput, Image,Text, View, StyleSheet, Alert, SafeAreaView, ScrollView, Picker, StatusBar, Dimensions, Animated, Easing, Modal } from 'react-native';
import {RetornarNombreCompleto} from './codigosJS/Metodos.js';

import YoutubeIframe, { getYoutubeMeta } from "react-native-youtube-iframe"
import { Icon,CheckBox } from 'react-native-elements';

import {useSelector, useDispatch} from 'react-redux';
import {establecerDatosDeCredencialDesdeIniciarSesion} from '../../store/actions.js';

import PushNotification from 'react-native-push-notification';
import NetInfo from '@react-native-community/netinfo'

import Orientation from 'react-native-orientation-locker';
import messaging from '@react-native-firebase/messaging';



import AsyncStorage from '@react-native-async-storage/async-storage';
import YoutubePlayer from "react-native-youtube-iframe";
//import YouTubePlayer from "react-native-youtube-sdk";
//ASYNC ESTA CORRECTO

const pantallaIniciarSesion = ({route, navigation}) => {
	const datosDeCredencial = useSelector(store => store.datosDeCredencial);
	var tokenDeFirebase = null;

	var NetInfoSubscribtion = null;
	const [state,setState] = useState({
		connection_status:false,
		connection_type:null,
		connection_net_reachable: true
	})

	useEffect(() => {
		NetInfoSubscribtion = NetInfo.addEventListener(_handleConnectivityChange);
		console.log("Iniciar sesion useEffect => ",datosDeCredencial)

		messaging().getToken()
		.then((token) => {
			datos.current = {
				...datos.current,
				Token: token
			}

		});
		console.log("Hola mundo");

		return ()=>{
		NetInfoSubscribtion && NetInfoSubscribtion()
		messaging().onTokenRefresh(token => {
			datos.current = {
				...datos.current,
				Token: token
			}
		});
	}

	}, []);

	const _handleConnectivityChange = (state) => {
		setState({
			connection_status: state.isConnected,
			connection_type: state.type,
			connection_net_reachable: state.isInternetReachable
		})
	}


	const dispatch = useDispatch();


	const datos = useRef({
		Us: '',
		Contra: '',
		Token: ''
	});

	const [prueba, modificarPrueba] = useState(true);

	const InputTexto = (props) => {


		return (
      <TextInput style={{
				width: (Dimensions.get('window').width) * (0.9),
				borderRadius:5,
				backgroundColor:'#dfe6e9',
				color:"#111",
				fontFamily: "Viga-Regular",
				borderWidth: 1,
				borderColor: "#111",
				height:40,
				alignSelf: 'center',
				textAlign: 'center',
				fontSize: 14
			}}
			secureTextEntry={
				(props.tipo === "Contra") ? true : false
			}

			placeholderTextColor={"#576574"}
			 placeholder={props.invisible} onChangeText={(e) => {

      if(props.tipo === "Usuario"){
        // modificarDatos({...datos,Mat : e});
		datos.current = {...datos.current,Us : e}
      }
      else if(props.tipo === "Contra"){
        // modificarDatos({...datos,ApP : e});
		datos.current = {...datos.current,Contra : e}
      }

      }} />
		);

	}


  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('@UserToken:key', jsonValue)
    } catch (e) {
      // saving error
      console.log("lo siento hubo un error al establecer => ",e)
    }
  }

	//GRACIAS A DIOS, ESTO NO RENDERIZA
	const comprobarIniciarSesion = async (datosAEnviar) => {

	console.log("Token = ", datos.current.Token);
	let promesa = await fetch("http://backpack.sytes.net/servidorApp/php/comprobacionDeIniciarSesion.php",{
     method : 'POST',
     body: datosAEnviar
   })
   .then((respuesta) => respuesta.text())
   .then((mensaje) => {
	   //MENSAJE ES UN STRING
	   if(mensaje === "1"){
		   //ERROR
		   //alert("Hubo un error al iniciar sesión :(");
		   ToastAndroid.show('¿Estas seguro de los datos?' , ToastAndroid.SHORT);
	   }
	   else{
		   //SI ENTRA AQUI, ES PORQUE RETORNO EL ARREGLO CON LOS DATOS DE LA CREDENCIAL
			//console.log(mensaje);
			console.log(mensaje);
			let objeto = JSON.parse(mensaje);
			console.log("arreglo de iniciar sesion => ",objeto)

		   //RECUERDA QUE NECESITO QUE ME RETORNE MAS DATOS

		   //ES DECIR, EXITO
		   //REDIRECCIONAR A MURO

		   //TEN CUIDADO PORQUE (AL MENOS POR ESTE MOMENTO) REDIRECCIONARAS A 2 TIPOS DE MUROS
		   //1.- Muro Para Alumno Normal (MIENTRAS ENFOCATE EN ESTE)
		   //2.- Muro Para Explorador

		   //MODIFICACION 02/08/2020: EN VEZ DE REDIRECCIONAR A Muro Para Alumno Normal, VAMOS A IR A todoLoRelacionadoParaAlumnoNormal (POR EL MOMENTO)
		   //navigation.navigate("Muro Para Alumno Normal",{matricula:mensaje});
		   dispatch(establecerDatosDeCredencialDesdeIniciarSesion(objeto));

 			 storeData(objeto);
		   navigation.navigate("Todo Lo Relacionado Para Alumno Normal");
			//console.log('ArregloDeDatosDeCredencialDesdeIniciarSesion = ', arreglo['contrasenia'] );
		   //navigation.navigate("Todo Lo Relacionado Para Alumno Normal");

	   }
   })
   .catch((error) => {
			console.log("Este es el error: ", error);
			//alert(error);
	   });
	}

	const eventoDeBoton1 = () => {
		let ContadorDeErrores = 0;
		if(datos.current.Us === ""){
    //ESTA VACIO
			ContadorDeErrores++;
		}
		if(datos.current.Contra === ""){
    //ESTA VACIO
			ContadorDeErrores++;
		}

		if(ContadorDeErrores === 0){
			//NO HAY NINGUN ERROR
			//LAS DOS CAJAS TIENEN ALGO DE DATOS
			//alert('Us = ' + datos.current.Us + ". Contra = " + datos.current.Contra);
			let json = JSON.stringify(datos.current);
			let formdata = new FormData();
			formdata.append('indice',json);
			comprobarIniciarSesion(formdata);
		}
		else{
			//HAY ALGUNA CAJA QUE LE FALTA INTRODUCIR DATOS
			//CAJA VACIA, O 2 CAJAS VACIAS
			//alert("¡Rayos, hay algun dato faltante!");
			ToastAndroid.show('Hay un dato faltante.' , ToastAndroid.SHORT);
		}
	}

	const eventoDeBoton2 = () => {
		navigation.navigate('Registrarse',{
			Token:datos.current.Token
		});
	}

	const eventoDeBoton3 = () => {
		//alert('Estas en modo explorador (invitado)');

		//modificarPrueba(!prueba);
		//dispatch(cambiarNombres('Angel Gabriel'));

	}

	//Variables que ayudan a: VistaAnimada
	const evento = () => {

		/*
			if(muestreo === true){
				console.log('ES IGUAL A TRUE');

				Animated.timing(ejeY.current, {
					delay: 0,
					duration: 500,
					toValue: 300,
					useNativeDriver: true,
					easing:  Easing.bezier(0.19, 1.0, 0.22, 1.0),
				}).start(() => {
					modificarCompuerta(false);
					modificarMuestreo(false);



				});
			}
			else if(muestreo === false){
				console.log('ES IGUAL A FALSE');
				//modificarMuestreo(true);
				modificarCompuerta(true);

				Animated.timing(ejeY.current, {
					delay: 100,
					duration: 500,
					toValue: 0,
					useNativeDriver: true,
					easing:  Easing.bezier(0.19, 1.0, 0.22, 1.0),
				}).start(() => {
					modificarMuestreo(true);
				});
			}
		*/



	}



	const ejeY = useRef(new Animated.Value(300));
	const [muestreo, modificarMuestreo] = useState(false);
	const [compuerta, modificarCompuerta] = useState(false);

	const VistaAnimada = () => {
		const estilo = StyleSheet.create({
			vista : {
				backgroundColor: 'lightblue',
				height: 50,
				borderWidth: 2
			}
		});




		//<Animated.View style={[{backgroundColor:'yellow',width:60, height: 10,position:'absolute',bottom:10,right:10}, {transform: [{scaleY: ancho.current}]}]}/>

		return (
			<>
				{(compuerta) ?
					<View style={{width: 60, height: 300, position: 'absolute', bottom: 30, right: 10, backgroundColor: 'transparent', zIndex: 2, overflow: 'hidden'}}>
						<Animated.View style={[{backgroundColor:'yellow', borderRadius: 20, borderWidth: 2, width: '100%', height: 300, position: 'absolute', bottom:0, right: 0}, {transform: [{translateY: ejeY.current}]}]}/>
					</View>
				:
					null
				}




				<TouchableNativeFeedback onPress={() => {
					evento();
				}}>
					<View style={{width: 60, height: 60, borderRadius: 100, borderWidth: 1, position: 'absolute', bottom: 10, right: 10, zIndex: 3,  backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
						<Text>{'<>'}</Text>
					</View>
				</TouchableNativeFeedback>
			</>
		);
	}


	return(
	(state.connection_net_reachable != null && state.connection_net_reachable != false) ?
	<View>

	<StatusBar backgroundColor={"rgb(66,66,132)"}/>
		<ScrollView>
			<View style={{backgroundColor:"#dfe6e9",height:Dimensions.get('screen').height}}>
				<Image style={{height:150,width:150,alignSelf:"center"}} source={{uri:"http://backpack.sytes.net/servidorApp/imagenes/mochila.png"}}/>
				<Text style={{alignSelf:"center",textAlign: 'center',fontFamily: "AkayaKanadaka-Regular",fontSize: 18,color:"#111"}}>Bienvenido a BackPack</Text>
				<InputTexto invisible={'Ingresa tu usuario'} tipo={'Usuario'} />
				<Text />
				<InputTexto invisible={'Ingresa tu contraseña'} tipo={'Contra'} />
				<Text style={{height:10}}></Text>
				<TouchableOpacity onPress={eventoDeBoton1} style={{left:(Dimensions.get('window').width / 2) - 75,borderRadius:10,width:150,backgroundColor:'#3498db', height:40, alignItems:'center',justifyContent:'center'}} ><Text style={{fontFamily: "Viga-Regular",color:"#111",textAlign: 'center'}}>Inicia sesión</Text></TouchableOpacity>
				<Text style={{height:10}}></Text>
				<TouchableOpacity onPress={eventoDeBoton2} style={{left:(Dimensions.get('window').width / 2) - 75,borderRadius:10,width:150,backgroundColor:'darkorange', height:40, alignItems:'center',justifyContent:'center'}} ><Text style={{fontFamily: "Viga-Regular",color:"#111",textAlign: 'center'}}>Ir a registrarse</Text></TouchableOpacity>
				<Text style={{height:10}}></Text>


			</View>
		</ScrollView>
	</View>
	:
	<View style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height, backgroundColor: "#dfe6e9",alignItems: 'center',justifyContent: 'center'}}>
		<Icon name={"signal-off"} type={"material-community"} size={40} color={"#ff4757"}/>
		<Text style={{marginTop: 10,alignSelf:"center",textAlign: 'center',fontFamily: "AkayaKanadaka-Regular",fontSize: 20,color:"#111"}}>
		Rayos...no tienes conexión a internet
		</Text>
	</View>

	);

//	return (<AppFinal/>)
}

////////////////////////////////////////////////////////////////////////////////////

const AppFinal = () => {


  return (
		<>
			<ScrollView>
          <VideoItem videoId={"DC471a9qrU4"}/>
					<VideoItem videoId={"tVCYa_bnITg"}/>
					<VideoItem videoId={"K74l26pE4YA"}/>
					<VideoItem videoId={"m3OjWNFREJo"}/>
			</ScrollView>
		</>
  );
};

const VideoItem = ({ videoId }) => {
	const [visible, setVisible] = useState(false);
  const [videoMeta, setVideoMeta] = useState(null);


  const onVideoPress = useCallback((videoId) => {
    setVisible(true);
  }, []);


  useEffect(() => {
    getYoutubeMeta(videoId).then((data) => {
      setVideoMeta(data);
    });
  }, [videoId]);

  if (videoMeta) {
    return (
			<>

			{
				(!visible) ? (


	      <TouchableOpacity
	        onPress={() => {
						setVisible(true)
						console.log("hijole")
					}}
	        style={{ flexDirection: "row", marginVertical: 16 }}
	      >
		      <Image
		        source={{ uri: videoMeta.thumbnail_url }}
		        style={{
		          width: videoMeta.thumbnail_width / 4,
		          height: videoMeta.thumbnail_height / 4,
		        }}
		      />
		      <View style={{ justifyContent: "center", marginStart: 16 }}>
		        <Text style={{ marginVertical: 4, fontWeight: "bold" }}>
		          {videoMeta.title}
		        </Text>
		        <Text>{videoMeta.author_name}</Text>
		      </View>
				</TouchableOpacity>

			) : (

					<YoutubeIframe
	//          ref={playerRef}
	          play={true}
	          videoId={videoId}
	          height={250}
	          //onReady={onPlayerReady}
	          //onChangeState={(state) => { }}
	        />


			)
			}
			</>

    );
  }
  return null;
};




/////////////////////////////////////////////////////////////////////////////
export default pantallaIniciarSesion;
/**
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 				<TouchableOpacity onPress={eventoDeBoton3} style={{left:(Dimensions.get('window').width / 2) - 75,borderRadius:10,width:150,backgroundColor:'darkorange', height:40, alignItems:'center',justifyContent:'center'}} ><Text style={{fontFamily: "Viga-Regular",color:"#111",textAlign: 'center'}}>Entrar como explorador</Text></TouchableOpacity>
				<Text style={{height:10}}></Text>

				<Text style={{alignSelf:"center",textAlign: 'center',fontFamily: "AkayaKanadaka-Regular",fontSize: 18,color:"#111"}}>connection Status : {state.connection_status ? 'connected' : 'disconnected'}</Text>
				<Text style={{alignSelf:"center",textAlign: 'center',fontFamily: "AkayaKanadaka-Regular",fontSize: 18,color:"#111"}}>connection type : {state.connection_type}</Text>
				<Text style={{alignSelf:"center",textAlign: 'center',fontFamily: "AkayaKanadaka-Regular",fontSize: 18,color:"#111"}}>connection reachable : {(state.connection_net_reachable != null && state.connection_net_reachable != false) ? 'Yes' : 'not'}</Text>

 */