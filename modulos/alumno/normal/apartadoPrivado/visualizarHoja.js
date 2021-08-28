import React,  {useRef, useState, useEffect , useCallback} from 'react';
import {TouchableOpacity, FlatList, TouchableWithoutFeedback,ActivityIndicator,ToastAndroid , TouchableNativeFeedback , Modal , TextInput, Image,Text, View, StyleSheet, Alert, SafeAreaView, ScrollView, Picker, StatusBar, Button, Dimensions, Easing, Animated, AppState } from 'react-native';

import YoutubeIframe, { getYoutubeMeta } from "react-native-youtube-iframe";
//https://facebook.github.io/react-native/docs/signed-apk-android.

//NO TE PREOCUPES, TODO ESTO FUNCIONA A LA PERFECCION

import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/FontAwesome5';
import Icon4 from 'react-native-vector-icons/AntDesign';
import Icon5 from 'react-native-vector-icons/Entypo';
import Icon6 from 'react-native-vector-icons/SimpleLineIcons';
import Icon7 from 'react-native-vector-icons/Ionicons';
import Icon8 from 'react-native-vector-icons/Octicons';
import Icon9 from 'react-native-vector-icons/FontAwesome';
import Icon10 from 'react-native-vector-icons/Foundation';

//import { PanGestureHandler, State } from 'react-native-gesture-handler';
//import Animated, { Easing } from 'react-native-reanimated';
import Orientation from 'react-native-orientation-locker';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Icon,CheckBox } from 'react-native-elements';

//import ComponenteYoutubeVideoPrueba from "./componenteYoutubeVideo.js"

//respaldo xd

import AsyncStorage from "@react-native-async-storage/async-storage";
import WebView from "react-native-webview";
/*
const {
	set,
	cond,
	eq,
	add,
	spring,
	startClock,
	stopClock,
	clockRunning,
	sub,
	defined,
	Value,
	Clock,
	event,
} = Animated;
*/


import Video from 'react-native-video';
import { Slider } from 'react-native-elements';

import {RetornarSegundosEnFormatoHHMMSS} from './../../../global/codigosJS/Metodos.js';

import MensajeDeTipoTostada from './../../../global/codigosJS/MensajeDeTipoTostada.js';
/*
import ToastExample from './ToastExample';

MensajeDeTipoTostada.show('Awesome', MensajeDeTipoTostada.SHORT);
*/

import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import FilePickerManager from 'react-native-file-picker';

import {useSelector, useDispatch} from 'react-redux';

//DESDE UN INICIO TENDRE UNAS VARIABLES CONSTANTES QUE PUEDEN SER UTILIZADAS EN TODO EL CODIGO
const alturaNativaInicial = Math.round(Dimensions.get('window').height);
const anchoNativoInicial =  Math.round(Dimensions.get('window').width);
const alturaBarraInicial = Math.round(StatusBar.currentHeight);
const alturaDeVistaInicial = Math.round(Dimensions.get('window').height) - Math.round(StatusBar.currentHeight);


const urlDelServidor = 'http://backpack.sytes.net';

const VisualizarHojaDelApartadoPrivado = (props) => {
	const variablesDentroDeMochila = useSelector(store => store.variablesDentroDeMochila);
	const dispatch = useDispatch();

	//DATOS ESPECIFICOS PARA ESTE ARCHIVO .JS
	//R => Ref
	//S => State
	const datosEspecificosR = useRef({
		reproduciendoAlgunVideoOAudio : false,
		arregloDeComponentesAEliminarse: [],
		arregloDeComponentesAIntercambiarse: [],

		arregloDeTareasPendientes: [], //TareasPendientes solo son para ComponentesDeTexto
	});
	/*
	NOTA IMPORTATE
	ES BUENA LA FUNCIONALIDAD QUE PENSE
	- CONTENEDOR
	|
	----- CONJUNTO DE COMPONENTES DENTRO DEL ScrollView
		  |
		  -------COMPONENTE DE TEXTO
		  -------COMPONENTE DE AUDIO
		  -------COMPONENTE DE VIDEO
		  -------COMPONENTE DE IMAGEN
	*/

	const [datosEspecificosS, modificarDatosEspecificosS] = useState({
		modoEliminacion: false,
		modoIntercambioDePosicion: false,

		datosDeComponentes: []
	});

	const eventosEspecificos = {
		traerDatosDeComponentesAVisualizarHoja: async () => {
			datosEspecificosR.current = {
				...datosEspecificosR.current,
				reproduciendoAlgunVideoOAudio : false,
				arregloDeComponentesAEliminarse: [],
				arregloDeComponentesAIntercambiarse: [],

				arregloDeTareasPendientes: [], //TareasPendientes solo son para ComponentesDeTexto
			};

			let objetoConInformacion = {
				eleccionDeApartado: variablesDentroDeMochila.eleccionDeApartado,
				eleccionIdDeLibreta: variablesDentroDeMochila.eleccionIdDeLibreta,
				eleccionIdDeHoja: variablesDentroDeMochila.eleccionIdDeHoja,
				matricula: variablesDentroDeMochila.matriculaDelPropietario
			};

			let json = JSON.stringify(objetoConInformacion);
			let datos = new FormData();
			datos.append('indice', json);

			let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/accionesEnApartados/mostrar/traerDatosDeComponentesAVisualizarHoja.php', {
				method: 'POST',
				body: datos
			})
			.then((mensaje) => mensaje.text())
			.then((respuesta) => {
				if(respuesta === 'Error'){
					//HAY ERRORES
					ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
  					console.log("error linea : ",respuesta)
				}
				else{
					let arreglo = JSON.parse(respuesta);
					modificarDatosEspecificosS({
						...datosEspecificosS,
						datosDeComponentes: arreglo,

						//VERIFICA (EN EL FUTURO) QUE ESTO ESTE BIEN COLOCARLO AQUI D:
						//MIENTRAS, LO PONDRE AQUI
						modoEliminacion: false,
						modoIntercambioDePosicion: false
					}); //RE-RENDER


				}


				modificarMuestreoDelCargandoInicial(false);
			})
			.catch((error) => {
				ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
  				console.log("error linea : ",error)
				modificarMuestreoDelCargandoInicial(false);
			});
		},

		//SUPUESTAMENTE ESTA TERMINADA

		//Retorna: "Error" o Objeto
		agregarComponenteOPosicionAlArreglo: (componenteOPosicion) => {
			if((datosEspecificosR.current.arregloDeComponentesAIntercambiarse).length === 0){
				//Caso 1: No hay ningun componente para intercambiarse
				if((typeof componenteOPosicion) === "string"){
					return "Error";
				}
				else{
					//SI ES POSIBLE HACER ESTO
					(datosEspecificosR.current.arregloDeComponentesAIntercambiarse).push({
						movimientoInicial: componenteOPosicion,
						movimientoFinal: null
					});
					return ({
						numeroDelIntercambio: 1,
						tipoDeMovimiento: "Inicial" //OR "Final"
					});
				}
			}
			else if((datosEspecificosR.current.arregloDeComponentesAIntercambiarse).length > 0){
				var permisoParaSeguirDentroDelFor = true;
				var indiceAVerificar = null;

				for(var i = 0; (i < ((datosEspecificosR.current.arregloDeComponentesAIntercambiarse).length)) && (permisoParaSeguirDentroDelFor === true); i++){
					if( ((datosEspecificosR.current.arregloDeComponentesAIntercambiarse)[i].movimientoInicial === null) || ((datosEspecificosR.current.arregloDeComponentesAIntercambiarse)[i].movimientoFinal	=== null) ){
						//LLEGAMOS A UN INTERCAMBIO (POSICION) DONDE HAY UNO O DOS MOVIMIENTOS NULOS
						indiceAVerificar = i;
						permisoParaSeguirDentroDelFor = false;
					}
				}

				if(indiceAVerificar === null){
					//NO HUBO ALGUN COMPONENTE CON MOVIMIENTOS NULOS

					//CREAR NUEVO INTERCAMBIO
					if((typeof componenteOPosicion) === "string"){
						return "Error";
					}
					else{
						//SIGNIFICA QUE ES UN NUMERITO
						let numeroDelIntercambioADevolver = ((datosEspecificosR.current.arregloDeComponentesAIntercambiarse).length) + 1;

						(datosEspecificosR.current.arregloDeComponentesAIntercambiarse).push({
							movimientoInicial: componenteOPosicion,
							movimientoFinal: null
						});
						return({
							numeroDelIntercambio: numeroDelIntercambioADevolver,
							tipoDeMovimiento: "Inicial"
						});
					}
				}
				else{
					//SI HUBO UN COMPONENTE CON MOVIMIENTO NULO O MOVIMIENTOS NULOS
					if( ((datosEspecificosR.current.arregloDeComponentesAIntercambiarse)[indiceAVerificar]).movimientoInicial === null ){
						//ME VALE MADRE movimientoFinal//////////////////////////////////

						//INSERTAREMOS EN movimientoInicial
						if((typeof componenteOPosicion) === "string"){
							//NO PODEMOS INSERTAR UN STRING EN movimientoInicial
							return "Error";
						}
						else{
							((datosEspecificosR.current.arregloDeComponentesAIntercambiarse)[indiceAVerificar]).movimientoInicial = componenteOPosicion;

							return({
								numeroDelIntercambio: (indiceAVerificar + 1),
								tipoDeMovimiento: "Inicial"
							});
						}
					}
					else{
						//(...).movimientoFinal = null 		ES EL UNICO NULO

						//SIEMPRE SE AGREGA EL componenteOPosicion, DADO QUE ACEPTA string e int
						((datosEspecificosR.current.arregloDeComponentesAIntercambiarse)[indiceAVerificar]).movimientoFinal = componenteOPosicion;

						return({
							numeroDelIntercambio: (indiceAVerificar + 1),
							tipoDeMovimiento: "Final"
						});
					}
				}
			}
		},

		//SIEMPRE RETORNA "Exito"
		eliminarComponenteOPosicionDelArreglo: (componenteOPosicion) => {
			//Tengo la ideologia de que unicamente tengo que convertir a NULL donde mi componenteOPosicion aparezca
			var permisoParaSeguirDentroDelFor = true;

			for(var i = 0; (i < ((datosEspecificosR.current.arregloDeComponentesAIntercambiarse).length)) && (permisoParaSeguirDentroDelFor === true); i++){
				if((	((datosEspecificosR.current.arregloDeComponentesAIntercambiarse)[i]).movimientoInicial === componenteOPosicion	) || (	((datosEspecificosR.current.arregloDeComponentesAIntercambiarse)[i]).movimientoFinal === componenteOPosicion	)){
					permisoParaSeguirDentroDelFor = false;
					if(		((datosEspecificosR.current.arregloDeComponentesAIntercambiarse)[i]).movimientoInicial === componenteOPosicion	){
						//El componenteOPosicion esta en movimientoInicial AQUI NOS QUEDAMOS
						//El componenteOPosicion esta en movimientoInicial AQUI NOS QUEDAMOS
						((datosEspecificosR.current.arregloDeComponentesAIntercambiarse)[i]).movimientoInicial = null;
					}
					else{
						//El componenteOPosicion esta en movimientoFinal AQUI NOS QUEDAMOS
						//El componenteOPosicion esta en movimientoFinal AQUI NOS QUEDAMOS
						((datosEspecificosR.current.arregloDeComponentesAIntercambiarse)[i]).movimientoFinal = null;
					}
				}
			}

			if(permisoParaSeguirDentroDelFor === false){
				//SIEMPRE permisoParaSeguirDentroDelFor SERÁ IGUAL A false
				return "Exito";
			}
		},

		eliminacionDeComponentesEnElServidor: async () => {


			//SI HAY UNO O MAS ELEMENTOS, SI HAGO ALGO
			if(datosEspecificosR.current.arregloDeComponentesAEliminarse.length > 0){
				let objetoConInformacion = {
					eleccionIdDeLibreta: variablesDentroDeMochila.eleccionIdDeLibreta,
					eleccionIdDeHoja: variablesDentroDeMochila.eleccionIdDeHoja,
					matricula: variablesDentroDeMochila.matriculaDelPropietario,
					arreglo: datosEspecificosR.current.arregloDeComponentesAEliminarse
				};

				let json = JSON.stringify(objetoConInformacion);
				let datos = new FormData();
				datos.append('indice', json);

				let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/accionesEnApartados/eliminacionDeComponentes/eliminacionDeComponentesEnHojaDeLibreta.php',{
					method: 'POST',
					body: datos
				})
				.then((mensaje) => mensaje.text())
				.then((respuesta) => {

					datosEspecificosR.current = {
						...datosEspecificosR.current,
						arregloDeComponentesAEliminarse: []
					};



					console.log(respuesta);

					if(respuesta === "Exito"){
						modificarMuestreoDelCargandoInicial(true);
						eventosEspecificos.traerDatosDeComponentesAVisualizarHoja();
					}
					else{
						ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
  						console.log("error linea : 323")
					}
				})
				.catch((error) => {

					datosEspecificosR.current = {
						...datosEspecificosR.current,
						arregloDeComponentesAEliminarse: []
					};



					ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
  					console.log("error linea : ",error)
				});
			}
			else{
				datosEspecificosR.current = {
					...datosEspecificosR.current,
					arregloDeComponentesAEliminarse: []
				};
				modificarDatosEspecificosS({
						...datosEspecificosS,


						//VERIFICA (EN EL FUTURO) QUE ESTO ESTE BIEN COLOCARLO AQUI D:
						//MIENTRAS, LO PONDRE AQUI
						modoEliminacion: false,
						modoIntercambioDePosicion: false,

						datosDeComponentes: eventosEspecificos.retornarDatosDeComponentesDespuesDeEjecutarTareasPendientes()
				}); //RE-RENDER
			}
		},

		intercambiosDePosicionDeComponentesEnElServidor: async () => {
			//TOMARE LA MISMA IDEOLOGIA UTILIZADA EN EL METODO eliminacionDeComponentesEnElServidor
			//ESPERO QUE FUNCIONE


			//AQUI NOS QUEDAMOS ALONSOOOOOOOOOOOOOOOOOOOOOOOO, TRATANDO DE DARLE ESTE EVENTO AL BotonDeMenu

			//SOLO HAGO ALGO, SI HAY UNO O MAS ELEMENTOS QUE TENGAN {mI: (dato), mF: (dato)}
			if( (eventosEspecificos.comprobarAlgunaNoNulicidadEnArregloDeComponentesAIntercambiarse()) && ((datosEspecificosS.datosDeComponentes.length)>1) ){
				//SI EJECUTAMOS EL INTERCAMBIO EN EL SERVIDOR
				let objetoConInformacion = {
					eleccionIdDeLibreta: variablesDentroDeMochila.eleccionIdDeLibreta,
					eleccionIdDeHoja: variablesDentroDeMochila.eleccionIdDeHoja,
					matricula: variablesDentroDeMochila.matriculaDelPropietario,
					arreglo: datosEspecificosR.current.arregloDeComponentesAIntercambiarse
				};

				let json = JSON.stringify(objetoConInformacion);
				let datos = new FormData();
				datos.append('indice', json);

				let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/accionesEnApartados/intercambiosDePosicionDeComponentes/intercambiosDePosicionDeComponentesEnHojaDeLibreta.php', {
					method: 'POST',
					body: datos
				})
				.then((mensaje) => mensaje.text())
				.then((respuesta) => {
					datosEspecificosR.current = {
						...datosEspecificosR.current,
						arregloDeComponentesAIntercambiarse: []
					};

					if(respuesta === "Exito"){
						modificarMuestreoDelCargandoInicial(true);
						eventosEspecificos.traerDatosDeComponentesAVisualizarHoja();
					}
					else{
						modificarDatosEspecificosS({
							...datosEspecificosS,


							//VERIFICA (EN EL FUTURO) QUE ESTO ESTE BIEN COLOCARLO AQUI D:
							//MIENTRAS, LO PONDRE AQUI
							modoEliminacion: false,
							modoIntercambioDePosicion: false,


							//ESPERO QUE ESTO ESTE BIEN
							datosDeComponentes: eventosEspecificos.retornarDatosDeComponentesDespuesDeEjecutarTareasPendientes()
						}); //RE-RENDER

						ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
  						console.log("error linea : 410")
					}

					console.log('RESPUESTA DEL SERVIDOR = ' + respuesta);
				})
				.catch((error) => {
					datosEspecificosR.current = {
						...datosEspecificosR.current,
						arregloDeComponentesAIntercambiarse: []
					};
					modificarDatosEspecificosS({
						...datosEspecificosS,


						//VERIFICA (EN EL FUTURO) QUE ESTO ESTE BIEN COLOCARLO AQUI D:
						//MIENTRAS, LO PONDRE AQUI
						modoEliminacion: false,
						modoIntercambioDePosicion: false,

						//ESPERO QUE ESTO ESTE CORRECTO AQUI
						datosDeComponentes: eventosEspecificos.retornarDatosDeComponentesDespuesDeEjecutarTareasPendientes()
					}); //RE-RENDER

					ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
  					console.log("error linea : 434")
				});
			}
			else{
				//NO EJECUTAMOS EL INTERCAMBIO, DEBIDO A QUE TODO ESTA VACIO; O NO HAY SUFICIENTES COMPONENTES
				datosEspecificosR.current = {
					...datosEspecificosR.current,
					arregloDeComponentesAIntercambiarse: []
				};
				modificarDatosEspecificosS({
						...datosEspecificosS,


						//VERIFICA (EN EL FUTURO) QUE ESTO ESTE BIEN COLOCARLO AQUI D:
						//MIENTRAS, LO PONDRE AQUI
						modoEliminacion: false,
						modoIntercambioDePosicion: false,

						datosDeComponentes: eventosEspecificos.retornarDatosDeComponentesDespuesDeEjecutarTareasPendientes()
				}); //RE-RENDER
			}
		},

		comprobarAlgunaNoNulicidadEnArregloDeComponentesAIntercambiarse: () => {
			//COMPROBAR QUE HAYA, POR LO MENOS, UN COMPONENTE CON {mI: (dato), mF: (dato)}
			for(let i = 0; i < (datosEspecificosR.current.arregloDeComponentesAIntercambiarse.length); i++){
				if( (((datosEspecificosR.current.arregloDeComponentesAIntercambiarse[i]).movimientoInicial) !== null) && (((datosEspecificosR.current.arregloDeComponentesAIntercambiarse[i]).movimientoFinal) !== null) ){
					//LLEGAMOS A UN ELEMENTO QUE CUMPLE CON {mI: (dato), mF: (dato)}
					return (true);
				}
			}

			//NO HUBO ALGUN ELEMENTO QUE CUMPLIERA CON {mI: (dato), mF: (dato)}
			return (false);
		},

		agregarUnaTareaPendienteAlArreglo: (orden, contenidoNuevo) => {
			let coincidencia = false;
			let indice = null;

			for(let i = 0; (i < (datosEspecificosR.current.arregloDeTareasPendientes.length)) && (coincidencia === false) ; i++){
				if(((datosEspecificosR.current.arregloDeTareasPendientes)[i].orden) === (orden)){
					coincidencia = true;
					indice = i;
				}
			}

			if(coincidencia){
				(datosEspecificosR.current.arregloDeTareasPendientes)[indice].contenidoNuevo = contenidoNuevo;
			}
			else{
				//INSERTAR UNA NUEVA TAREA PENDIENTE
				(datosEspecificosR.current.arregloDeTareasPendientes).push({
					orden: orden,
					contenidoNuevo: contenidoNuevo
				});
			}
		},

		retornarDatosDeComponentesDespuesDeEjecutarTareasPendientes: () => {
			//AQUI NOS QUEDAMOS
			if(datosEspecificosR.current.arregloDeTareasPendientes.length > 0){
				let datosLocalesDeComponentes = datosEspecificosS.datosDeComponentes;

				for(let i = 0; i < (datosEspecificosR.current.arregloDeTareasPendientes.length); i++){
					//datosLocalesDeComponentes[(datosEspecificosR.current.arregloDeTareasPendientes)[i].orden - 1]//.tipo
					if((datosLocalesDeComponentes[(datosEspecificosR.current.arregloDeTareasPendientes)[i].orden - 1].tipo) === "TEXTO"){
						datosLocalesDeComponentes[(datosEspecificosR.current.arregloDeTareasPendientes)[i].orden - 1].contenido = (datosEspecificosR.current.arregloDeTareasPendientes)[i].contenidoNuevo;
					}
				}
				datosEspecificosR.current = {
					...datosEspecificosR.current,
					arregloDeTareasPendientes: []
				};
				return datosLocalesDeComponentes;
			}
			else{
				return datosEspecificosS.datosDeComponentes;
			}
		}
	}

	//mostrarAlert que diga "Te falta por cerrar los siguientes intercambios"

	//$consulta="SELECT * FROM `libretas` ORDER BY rand() LIMIT 0, 2";

	//CONSTANTE PARA OCULTAR (Y MOSTRAR) EL MODAL DE EL INICIO DE ESTA VISTA : "CARGANDO... POR FAVOR ESPERE";
	const [mostrarCargandoInicial, modificarMuestreoDelCargandoInicial] = useState(true);

	useEffect(() => {

	//DESPUES DE 5 SEGUNDOS, QUIERO QUE QUITE EL MODAL INICIAL
	//PRUEBA, RECUERDA MODIFICAR DESPUES ESTO
	/*setTimeout(() => {
		modificarMuestreoDelCargandoInicial(false);
	},5000);*/
		eventosEspecificos.traerDatosDeComponentesAVisualizarHoja();
	}, []);

	const CargandoInicial = () => {
		return (
			<View style={{width : '100%' , height : '100%', justifyContent : 'center', alignItems : 'center'}}>
				<View style={{width : '80%' , height : '30%' , flexDirection : 'column' , alignItems : 'center', justifyContent : 'space-around', backgroundColor : 'lavender', borderRadius : 10}}>
					<ActivityIndicator size={'large'} color={'black'}/>
					<Text>{'Cargando componentes. Por favor, espera...'}</Text>
				</View>
			</View>
		);
	}



	const ComponenteDeYoutubeVideo = (props)=>{
	  const [fondo,setFondo] = useState(AppState.currentState)
	  const [mostrarVideo,setMostrarVideo] = useState(false)
	  useEffect(()=>{
	    AppState.addEventListener('change', handleAppStateChange);
	    return ()=>AppState.removeEventListener('change', handleAppStateChange);
	  },[]);

	  const handleAppStateChange = (nextAppState) => {
	     setFondo(nextAppState);
	 }
	 let estilos = StyleSheet.create({
		 contenedorPrincipal :  {
				 width : "100%",
				 height : (anchoNativoInicial) * .6,
				 alignItems : 'center'
			 },
		 contenedorSecundario : (datosEspecificosS.modoEliminacion || datosEspecificosS.modoIntercambioDePosicion) ?
			 {
				 height : '100%',
				 width : '70%',
				 backgroundColor : 'black',
				 borderRadius : 5,
				 overflow : 'hidden',
				 justifyContent : 'center',

				 position: 'absolute',
				 right: '2.5%'
			 }
		 :
			 {
				 height : '100%',
				 width : '95%',
				 backgroundColor : 'black',
				 borderRadius : 5,
				 overflow : 'hidden',
				 justifyContent : 'center',
				 alignItems:'center',

				 position: 'absolute',
				 right: '2.5%'
			 },
		 contenedorTerciario : {
			 width : '100%',
			 height : '95%',
			 zIndex : 1,

		 }
		 ,
		 miniatura : {
			 height : '100%',
		 },
		 video : {
			 height : '100%',
		 },
		 botonReproduccion : {
			 height : '30%',
			 width : '20%',
			 backgroundColor : 'rgba(100,100,100,0.4)',
			 overflow : 'hidden',
			 borderRadius : 100,
			 zIndex : 3,
			 position : 'absolute',
			 top : '35%',
			 left : '40%',
			 alignItems : 'center',
			 justifyContent : 'center'
		 },
		 botonMaximizar : {
			 height : '20%',
			 width : '19%',
			 backgroundColor : 'rgba(100,100,100,0.4)',
			 overflow : 'hidden',
			 borderRadius : 20,
			 zIndex : 3,
			 position : 'absolute',
			 //bottom : '2.5%',
			 //right : '1%',
			 bottom : '1%',
			 right : '1%',
			 alignItems : 'center',
			 justifyContent : 'center'
		 },
		 botonCerrar : {
			 height : '20%',
			 width : '19%',
			 backgroundColor : 'rgba(100,100,100,0.4)',
			 overflow : 'hidden',
			 borderRadius : 20,
			 zIndex : 3,
			 position : 'absolute',
			 //bottom : '2.5%',
			 //right : '1%',
			 top : '1%',
			 right : '1%',
			 alignItems : 'center',
			 justifyContent : 'center'
		 },
		 botonOcultarControles : {
			 height : '20%',
			 width : '19%',
			 backgroundColor : 'rgba(100,100,100,0.4)',
			 overflow : 'hidden',
			 borderRadius : 20,
			 zIndex : 3,
			 position : 'absolute',
			 //bottom : '2.5%',
			 //right : '1%',
			 top : '1%',
			 left : '1%',
			 alignItems : 'center',
			 justifyContent : 'center'
		 },
		 botonOcultarSoloBotonOcultarControles : {
			 height : '100%',
			 width : '100%',
			 zIndex : 2,
			 position : 'absolute',
			 top : 0,
			 left : 0,
			 overflow : 'hidden'
		 },
		 barraDeslizadora : {
			 height : '20%',
			 width : '78%',
			 backgroundColor : 'rgba(100,100,100,0.4)',
			 overflow : 'hidden',
			 borderRadius : 10,
			 zIndex : 3,
			 position : 'absolute',
			 //bottom : '2.5%',
			 //right : '1%',
			 bottom : '1%',
			 left : '1%',
			 justifyContent : 'space-around',
			 alignItems : 'center',
			 flexDirection : 'row'
		 },
		 touchableWithDoubleTap : {
			 position:'absolute',
			 width : '40%',
			 height : '79%',
			 zIndex : 2,
			 top:0
		 },
		 tWDT : {
			 backgroundColor:'rgba(100,100,100,0.4)',
			 borderRadius : 100,
			 width : '45%',
			 height : '35%',
			 overflow : 'hidden',
			 justifyContent : 'center',
			 alignItems : 'center'
		 },
	 });



	 		const [datosDelComponenteS, modificarDatosDelComponenteS] = useState({
	 			estado : 1,
	 			/*
	 			ESTADOS QUE TIENE EL COMPONENTE DE VIDEO
	 			estado : 1 => ESTADO APAGADO
	 			estado : 2 => ESTADO ENCENDIDO
	 			estado : 3 => ESTADO ACABADO
	 			*/
	 			reproduciendo : false,
	 			cargandoVideoMinimizadamente : false,

	 			duracion : 1,
	 			adelantoOAtraso : 5,

	 			ocultarControles : false,
	 			ocultarSoloBotonOcultarControles : false,

	 			mostrarVideoMaximizadamente : false,

	 			estadoDelComponenteInternoDeVideo : null,
	 			ubicacionDelComponenteInternoDeVideo : null,


	 			//VARIABLES ENCARGADOS DE LA EDICION DEL COMPONENTE
	 			//1.- ELIMINACION
	 			checkedDelCheckBoxModoEliminacion: false,
	 			checkedDelCheckBoxModoIntercambioDePosicion: false,


	 			//VARIABLES PARA INTERCAMBIO DE POSICION
	 			numeroDelIntercambioActual: null,
	 			tipoDeMovimientoActual: null
	 		});

			const eventos = {
				checkBoxDelModoEliminacion: () => {
					if(datosDelComponenteS.checkedDelCheckBoxModoEliminacion){
						//PASARA A FALSE
						let indiceDeEliminacion = (datosEspecificosR.current.arregloDeComponentesAEliminarse).indexOf(props.orden);

						if(indiceDeEliminacion != (-1)){
							//SI HAY NUMERITO QUE ELIMINAR
							(datosEspecificosR.current.arregloDeComponentesAEliminarse).splice(indiceDeEliminacion, 1);
						}
					}
					else{
						//PASARA A TRUE
						(datosEspecificosR.current.arregloDeComponentesAEliminarse).push(props.orden);
					}

					modificarDatosDelComponenteS({...datosDelComponenteS, checkedDelCheckBoxModoEliminacion: !(datosDelComponenteS.checkedDelCheckBoxModoEliminacion)});
				},
				checkBoxDelModoIntercambioDePosicion: () => {
					if(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion){
						//PASARA A FALSE
						let mensaje = eventosEspecificos.eliminarComponenteOPosicionDelArreglo(props.orden);

						if(mensaje === "Exito"){
							//SIEMPRE ENTRARA AQUI
							modificarDatosDelComponenteS({
								...datosDelComponenteS,
								checkedDelCheckBoxModoIntercambioDePosicion: !(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion),
								numeroDelIntercambioActual: null,
								tipoDeMovimientoActual: null
							});
						}
					}
					else{
						//PASARA A TRUE

						//AGREGAR EL COMPONENTE A datosEspecificosR.current.arregloDeComponentesAIntercambiarse
						//AQUI TE QUEDASTE ALONSOOOOOOOOOOOOOOOOOOOOOOOO TE DORMIRAS PRONTO CUANDO TERMINES ESTO

						let objeto = eventosEspecificos.agregarComponenteOPosicionAlArreglo(props.orden);

						modificarDatosDelComponenteS({
							...datosDelComponenteS,
							checkedDelCheckBoxModoIntercambioDePosicion: !(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion),
							numeroDelIntercambioActual: objeto.numeroDelIntercambio,
							tipoDeMovimientoActual: objeto.tipoDeMovimiento
						});
					}
				}
			}


	  return(
	<>
	    {fondo == 'active' ?


	            <>
	            {
	              mostrarVideo ?
								<View style={estilos.contenedorPrincipal}>
								{(datosEspecificosS.modoEliminacion) ?
								<View style={{width: (anchoNativoInicial) * .275, height: (anchoNativoInicial * .6) * .35, position: 'absolute', left: 0 /*ESTA ES LA VARIABLE QUE VA A CAMBIAR*/, top: (250 / 2) - (((anchoNativoInicial * .6) * .35) / 2), overflow: 'hidden', zIndex: -1}}>
									<View style={{width: (anchoNativoInicial) * .09, height: '100%', position: 'absolute', left: 0}}>
										<View style={{
											width: 0,
											height: 0,
											backgroundColor: 'transparent',
											borderStyle: 'solid',
											borderRightWidth: (anchoNativoInicial) * .09,
											borderBottomWidth: (anchoNativoInicial) * .105,
											borderRightColor: 'rgb(212,12,29)',
											borderBottomColor: 'transparent',
											position: 'absolute',
											left: 0,
											top: 0
										}}/>
										<View style={{
											width: 0,
											height: 0,
											backgroundColor: 'transparent',
											borderStyle: 'solid',
											borderRightWidth: (anchoNativoInicial) * .09,
											borderTopWidth: (anchoNativoInicial) * .105,
											borderRightColor: 'rgb(212,12,29)',
											borderTopColor: 'transparent',
											position: 'absolute',
											left: 0,
											bottom: 0
										}}/>
									</View>
									<View style={{width: (anchoNativoInicial) * 0.185, height: '100%', position: 'absolute', right: 0, backgroundColor: 'rgb(212,12,29)'}}>
										<View style={{width: '100%', height: '50%', position: 'absolute', left: 0, top: 0, alignItems: 'center', justifyContent: 'center'}}>
											<Icon8 name={"trashcan"} size={(anchoNativoInicial) * 0.085} color={'black'}/>
										</View>
										<View style={{width: '100%', height: '50%', position: 'absolute', left: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'}}>
											<CheckBox checked={datosDelComponenteS.checkedDelCheckBoxModoEliminacion} onPress={eventos.checkBoxDelModoEliminacion} size={(anchoNativoInicial) * 0.085}/>
										</View>
									</View>
								</View>
							:	(datosEspecificosS.modoIntercambioDePosicion) ?
								<View style={{width: (anchoNativoInicial) * .275, height: (anchoNativoInicial * .6) * .35, position: 'absolute', left: 0 /*ESTA ES LA VARIABLE QUE VA A CAMBIAR*/, top: (250 / 2) - (((anchoNativoInicial * .6) * .35) / 2), overflow: 'hidden', zIndex: -1}}>
									<View style={{width: (anchoNativoInicial) * .09, height: '100%', position: 'absolute', left: 0}}>
										<View style={{
											width: 0,
											height: 0,
											backgroundColor: 'transparent',
											borderStyle: 'solid',
											borderRightWidth: (anchoNativoInicial) * .09,
											borderBottomWidth: (anchoNativoInicial) * .105,
											borderRightColor: 'rgb(255, 201, 14)',
											borderBottomColor: 'transparent',
											position: 'absolute',
											left: 0,
											top: 0
										}}/>
										<View style={{
											width: 0,
											height: 0,
											backgroundColor: 'transparent',
											borderStyle: 'solid',
											borderRightWidth: (anchoNativoInicial) * .09,
											borderTopWidth: (anchoNativoInicial) * .105,
											borderRightColor: 'rgb(255, 201, 14)',
											borderTopColor: 'transparent',
											position: 'absolute',
											left: 0,
											bottom: 0
										}}/>
									</View>
									<View style={{width: (anchoNativoInicial) * 0.185, height: '100%', position: 'absolute', right: 0, backgroundColor: 'rgb(255, 201, 14)'}}>
										<View style={(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion) ? {width: '100%', height: '50%', position: 'absolute', left: 0, top: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'} : {width: '100%', height: '50%', position: 'absolute', left: 0, top: 0, alignItems: 'center', justifyContent: 'center'}}>
											{(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion) ?
												<>
													<Text style={{fontSize: (((anchoNativoInicial * .6) * .35) * .5) * .45, textAlign: 'center', fontWeight: 'bold'}} >{datosDelComponenteS.numeroDelIntercambioActual + '°'}</Text>
													{(datosDelComponenteS.tipoDeMovimientoActual === "Inicial") ?
														<Icon9 name={"long-arrow-up"} size={((anchoNativoInicial) * 0.085) * .8} color={'black'}/>
													: (datosDelComponenteS.tipoDeMovimientoActual === "Final") ?
														<Icon9 name={"long-arrow-down"} size={((anchoNativoInicial) * 0.085) * .8} color={'black'}/>
													:
														null
													}
												</>
											:
												<Icon9 name={"exchange"} size={((anchoNativoInicial) * 0.085) * .8} color={'black'} style={{transform: [{rotate: '90deg'}]}}/>
											}
										</View>
										<View style={{width: '100%', height: '50%', position: 'absolute', left: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'}}>
											<CheckBox checked={datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion} onPress={eventos.checkBoxDelModoIntercambioDePosicion} size={(anchoNativoInicial) * 0.085}/>
										</View>
									</View>
								</View>
							:
								null
							}

									<View style={estilos.contenedorSecundario}> 
			              <YoutubeIframe
			                play={false}
			                videoId={props.videoId}
											width={"100%"}
			                height={"90%"}
											//webViewStyle={{width:"100%",flex:0,height:"90%",backgroundColor:"yellow",padding:1,margin:0}}
			              />
									</View>
								</View>
	              :
								<View style={estilos.contenedorPrincipal}>
									{(datosEspecificosS.modoEliminacion) ?
									<View style={{width: (anchoNativoInicial) * .275, height: (anchoNativoInicial * .6) * .35, position: 'absolute', left: 0 /*ESTA ES LA VARIABLE QUE VA A CAMBIAR*/, top: (250 / 2) - (((anchoNativoInicial * .6) * .35) / 2), overflow: 'hidden', zIndex: -1}}>
										<View style={{width: (anchoNativoInicial) * .09, height: '100%', position: 'absolute', left: 0}}>
											<View style={{
												width: 0,
												height: 0,
												backgroundColor: 'transparent',
												borderStyle: 'solid',
												borderRightWidth: (anchoNativoInicial) * .09,
												borderBottomWidth: (anchoNativoInicial) * .105,
												borderRightColor: 'rgb(212,12,29)',
												borderBottomColor: 'transparent',
												position: 'absolute',
												left: 0,
												top: 0
											}}/>
											<View style={{
												width: 0,
												height: 0,
												backgroundColor: 'transparent',
												borderStyle: 'solid',
												borderRightWidth: (anchoNativoInicial) * .09,
												borderTopWidth: (anchoNativoInicial) * .105,
												borderRightColor: 'rgb(212,12,29)',
												borderTopColor: 'transparent',
												position: 'absolute',
												left: 0,
												bottom: 0
											}}/>
										</View>
										<View style={{width: (anchoNativoInicial) * 0.185, height: '100%', position: 'absolute', right: 0, backgroundColor: 'rgb(212,12,29)'}}>
											<View style={{width: '100%', height: '50%', position: 'absolute', left: 0, top: 0, alignItems: 'center', justifyContent: 'center'}}>
												<Icon8 name={"trashcan"} size={(anchoNativoInicial) * 0.085} color={'black'}/>
											</View>
											<View style={{width: '100%', height: '50%', position: 'absolute', left: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'}}>
												<CheckBox checked={datosDelComponenteS.checkedDelCheckBoxModoEliminacion} onPress={eventos.checkBoxDelModoEliminacion} size={(anchoNativoInicial) * 0.085}/>
											</View>
										</View>
									</View>
								:	(datosEspecificosS.modoIntercambioDePosicion) ?
									<View style={{width: (anchoNativoInicial) * .275, height: (anchoNativoInicial * .6) * .35, position: 'absolute', left: 0 /*ESTA ES LA VARIABLE QUE VA A CAMBIAR*/, top: (250 / 2) - (((anchoNativoInicial * .6) * .35) / 2), overflow: 'hidden', zIndex: -1}}>
										<View style={{width: (anchoNativoInicial) * .09, height: '100%', position: 'absolute', left: 0}}>
											<View style={{
												width: 0,
												height: 0,
												backgroundColor: 'transparent',
												borderStyle: 'solid',
												borderRightWidth: (anchoNativoInicial) * .09,
												borderBottomWidth: (anchoNativoInicial) * .105,
												borderRightColor: 'rgb(255, 201, 14)',
												borderBottomColor: 'transparent',
												position: 'absolute',
												left: 0,
												top: 0
											}}/>
											<View style={{
												width: 0,
												height: 0,
												backgroundColor: 'transparent',
												borderStyle: 'solid',
												borderRightWidth: (anchoNativoInicial) * .09,
												borderTopWidth: (anchoNativoInicial) * .105,
												borderRightColor: 'rgb(255, 201, 14)',
												borderTopColor: 'transparent',
												position: 'absolute',
												left: 0,
												bottom: 0
											}}/>
										</View>
										<View style={{width: (anchoNativoInicial) * 0.185, height: '100%', position: 'absolute', right: 0, backgroundColor: 'rgb(255, 201, 14)'}}>
											<View style={(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion) ? {width: '100%', height: '50%', position: 'absolute', left: 0, top: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'} : {width: '100%', height: '50%', position: 'absolute', left: 0, top: 0, alignItems: 'center', justifyContent: 'center'}}>
												{(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion) ?
													<>
														<Text style={{fontSize: (((anchoNativoInicial * .6) * .35) * .5) * .45, textAlign: 'center', fontWeight: 'bold'}} >{datosDelComponenteS.numeroDelIntercambioActual + '°'}</Text>
														{(datosDelComponenteS.tipoDeMovimientoActual === "Inicial") ?
															<Icon9 name={"long-arrow-up"} size={((anchoNativoInicial) * 0.085) * .8} color={'black'}/>
														: (datosDelComponenteS.tipoDeMovimientoActual === "Final") ?
															<Icon9 name={"long-arrow-down"} size={((anchoNativoInicial) * 0.085) * .8} color={'black'}/>
														:
															null
														}
													</>
												:
													<Icon9 name={"exchange"} size={((anchoNativoInicial) * 0.085) * .8} color={'black'} style={{transform: [{rotate: '90deg'}]}}/>
												}
											</View>
											<View style={{width: '100%', height: '50%', position: 'absolute', left: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'}}>
												<CheckBox checked={datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion} onPress={eventos.checkBoxDelModoIntercambioDePosicion} size={(anchoNativoInicial) * 0.085}/>
											</View>
										</View>
									</View>
								:
									null
								}


	              	<VideoItem videoId={props.videoId} onPress={()=>setMostrarVideo(true)} styles={estilos.contenedorSecundario}/>

								</View>

	            }
	              </>




	              :
	              null

	     }
	</>
	  )
	}


	const VideoItem = ({ videoId, onPress,styles }) => {
	  const [videoMeta, setVideoMeta] = useState(null);
	  useEffect(() => {
	    getYoutubeMeta(videoId).then((data) => {
	      setVideoMeta(data);
	    });
	  }, [videoId]);

	  if (videoMeta) {
	    return (
	      <TouchableOpacity
	        onPress={() => onPress()}
	        style={styles}
	      >
	        <Image
	          source={{ uri: videoMeta.thumbnail_url }}
	          style={{
	            width: videoMeta.thumbnail_width / 3,
	            height: videoMeta.thumbnail_height / 3,
	          }}
	        />
	        <View style={{ justifyContent: "center", marginStart: 16 }}>
	          <Text style={{ marginVertical: 4, fontWeight: "bold" ,color:"#fff",textAlign: 'center'}}>
	            {videoMeta.title}
	          </Text>
	          <Text style={{color:"#fff",textAlign: 'center'}}>{videoMeta.author_name}</Text>
	        </View>
	      </TouchableOpacity>
	    );
	  }
	  return null;
	};



	//Este ComponenteDeVideo solo es de READ-ONLY o SOLO-LECTURA
	//Falta programar el botoncito para 'CAMBIAR POSICION DE COMPONENTE' y 'ELIMINAR COMPONENTE'
	const ComponenteDeVideo = (props) => {
		//SOLO MUESTREO
		//PARA INSERTACION HAY QUE CREAR UN COMPONENTE DIFERENTE

		//NO PONGAS position:'absolute'

		//anchoInicial VA A CAMBIAR SI LO MUEVO A OTRO ARCHIVO .JS
		const datosDelComponenteR = useRef({
			anchoInicial : anchoNativoInicial,
			referencia : null,
			permisoParaProgresarElSlider : true,
			ubicacionParaRedireccionarElVideo : null,
			ubicacionDelSliderIndicadaConElDedo : null,
		});
		//ubicacionParaRedireccionarElVideo ES EN SEGUNDOS



		const [datosDelComponenteS, modificarDatosDelComponenteS] = useState({
			estado : 1,
			/*
			ESTADOS QUE TIENE EL COMPONENTE DE VIDEO
			estado : 1 => ESTADO APAGADO
			estado : 2 => ESTADO ENCENDIDO
			estado : 3 => ESTADO ACABADO
			*/
			reproduciendo : false,
			cargandoVideoMinimizadamente : false,

			duracion : 1,
			adelantoOAtraso : 5,

			ocultarControles : false,
			ocultarSoloBotonOcultarControles : false,

			mostrarVideoMaximizadamente : false,

			estadoDelComponenteInternoDeVideo : null,
			ubicacionDelComponenteInternoDeVideo : null,


			//VARIABLES ENCARGADOS DE LA EDICION DEL COMPONENTE
			//1.- ELIMINACION
			checkedDelCheckBoxModoEliminacion: false,
			checkedDelCheckBoxModoIntercambioDePosicion: false,


			//VARIABLES PARA INTERCAMBIO DE POSICION
			numeroDelIntercambioActual: null,
			tipoDeMovimientoActual: null
		});

		//VARIABLES SUELTAS PORQUE SI
		const [tiempoActual , modificarTiempoActual] = useState(0);


		//EVENTOS DE BOTONES DEL COMPONENTE DE VIDEO
		const eventos = {
			botonReproduccion : () => {
				if(datosDelComponenteS.estado === 1){
					//ESTAMOS EN ESTADO APAGADO

					//ESTA LA MINIATURA DEL VIDEO

					//VAMOS A MOSTRAR EL "Loading"
					//VAMOS A CAMBIAR A ESTADO : 2
					//VAMOS A CAMBIAR REPRODUCCIENDO : TRUE

					//MODIFICACION PARA NO MOSTRAR TODOS LOS VIDEOS AL MISMO TIEMPO
					//BORRA LOS CIRCULITOS AZULES EN CASO DE ERROR
					if(datosEspecificosR.current.reproduciendoAlgunVideoOAudio === false){
						datosEspecificosR.current = {...datosEspecificosR.current , reproduciendoAlgunVideoOAudio : true};
						modificarDatosDelComponenteS({...datosDelComponenteS, estado : 2, reproduciendo : true, cargandoVideoMinimizadamente:true});
					}
					else if(datosEspecificosR.current.reproduciendoAlgunVideoOAudio === true){
						//QUIERE DECIR QUE YA HAY UN VIDEO REPRODUCIENDOSE EN EL FONDO
						ToastAndroid.show('Solo puedes reproducir un video o audio a la vez' , ToastAndroid.SHORT);
					}
				}
				else if(datosDelComponenteS.estado === 2){
					//ESTAMOS EN ESTADO ENCENDIDO
					modificarDatosDelComponenteS({...datosDelComponenteS, reproduciendo : !(datosDelComponenteS.reproduciendo)});
				}
				else if(datosDelComponenteS.estado === 3){
					//YA ACABO EL VIDEO

					//1.- CAMBIAR ubicacionDelSliderIndicadaConElDedo = null
					datosDelComponenteR.current = {...datosDelComponenteR.current, ubicacionDelSliderIndicadaConElDedo : null};

					//2.- SEEK DEL VIDEO HASTA 0
					if(datosDelComponenteR.current.referencia){
						datosDelComponenteR.current.referencia.seek(0);
					}
					//3.- BARRA SLIDER HASTA 0 TAMBIEN
					modificarTiempoActual(0);

					//4.- MODIFICAR VARIABLES: reproduciendo = true, estado = 2,
					modificarDatosDelComponenteS({...datosDelComponenteS, reproduciendo : true, estado : 2});
				}
			},
			botonMaximizar : () => {


				if(datosDelComponenteS.estado === 1){
					//SOLAMENTE PASARA POR AQUI UNA VEZ, (LA PRIMERA VEZ)
					if(datosEspecificosR.current.reproduciendoAlgunVideoOAudio === false){
						//NO HAY PROBLEMA, REPRODUZCO Y MODIFICO VARIABLE
						StatusBar.setHidden(true);
						Orientation.unlockAllOrientations();
						Orientation.lockToLandscape();
						modificarDatosDelComponenteS({...datosDelComponenteS, mostrarVideoMaximizadamente : true});

						datosEspecificosR.current = {...datosEspecificosR.current , reproduciendoAlgunVideoOAudio : true};
					}
					else if(datosEspecificosR.current.reproduciendoAlgunVideoOAudio === true){
						//NO PUEDO REPRODUCIR NADA, DEBIDO A QUE YA HAY UN VIDEO O AUDIO REPRODUCIENDOSE EN EL FONDO
						ToastAndroid.show('Solo puedes reproducir un video o audio a la vez' , ToastAndroid.SHORT);
					}
				}
				else{
					//datosDelComponenteS.estado === 2 || datosDelComponenteS.estado === 3
					StatusBar.setHidden(true);
					Orientation.unlockAllOrientations();
					Orientation.lockToLandscape();
					modificarDatosDelComponenteS({...datosDelComponenteS, mostrarVideoMaximizadamente : true});
				}
				//botonMinimizar
			},
			botonCerrar : () => {
				//SIGNIFICA EMPEZAR OTRA VEZ TODO DE NUEVO

				modificarDatosDelComponenteS({...datosDelComponenteS, estado : 1, reproduciendo : false, cargandoVideoMinimizadamente : false, duracion : 1, ocultarControles : false , estadoDelComponenteInternoDeVideo : null, ubicacionDelComponenteInternoDeVideo : null});
				datosDelComponenteR.current = {...datosDelComponenteR.current, ubicacionDelSliderIndicadaConElDedo : null};
				modificarTiempoActual(0);

				datosEspecificosR.current = {...datosEspecificosR.current , reproduciendoAlgunVideoOAudio : false};
			},
			botonOcultarControles : () => {
				if(datosDelComponenteS.ocultarControles === false){
					//PROCEDERE A OCULTAR TODOS LOS CONTROLES
					//PASARE DE: VER CONTROLES => NO VER CONTROLES
					modificarDatosDelComponenteS({...datosDelComponenteS, ocultarControles : true, ocultarSoloBotonOcultarControles : true});

					//ME QUEDE AQUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII
				}
				else{
					//datosDelComponenteS.ocultarControles === true
					//PASARE DE: NO VER CONTROLES => VER CONTROLES
					modificarDatosDelComponenteS({...datosDelComponenteS, ocultarControles : false, ocultarSoloBotonOcultarControles : false});
				}
				//modificarDatosDelComponenteS({...datosDelComponenteS, ocultarControles : !(datosDelComponenteS.ocultarControles)});
			},
			botonOcultarSoloBotonOcultarControles : () => {
				modificarDatosDelComponenteS({...datosDelComponenteS, ocultarSoloBotonOcultarControles : !(datosDelComponenteS.ocultarSoloBotonOcultarControles)});
			},
			onLoadVideoMinimizadamente : (datos) => {

				if(datosDelComponenteS.estadoDelComponenteInternoDeVideo && datosDelComponenteS.ubicacionDelComponenteInternoDeVideo){
					if(datosDelComponenteS.estadoDelComponenteInternoDeVideo === 2){
						modificarDatosDelComponenteS({...datosDelComponenteS, cargandoVideoMinimizadamente:false, duracion : datos.duration});

						//SIMPLEMENTE VOY A ESA PARTE DEL VIDEO
						//1.- SEEK
						datosDelComponenteR.current.referencia.seek(datosDelComponenteS.ubicacionDelComponenteInternoDeVideo);

						//2.- modificarTiempoActual
						modificarTiempoActual(datosDelComponenteS.ubicacionDelComponenteInternoDeVideo);

					}
					else if(datosDelComponenteS.estadoDelComponenteInternoDeVideo === 3){
						//VOY A ESA PARTE DEL VIDEO, Y TAMBIEN CAMBIO ESTADO 2 => 3
						//CAMBIARE MANUALMENTE EL ESTADO DE 2 => 3
						modificarDatosDelComponenteS({...datosDelComponenteS, reproduciendo : false, estado : 3, cargandoVideoMinimizadamente:false, duracion : datos.duration});

						datosDelComponenteR.current.referencia.seek(datosDelComponenteS.ubicacionDelComponenteInternoDeVideo);

						modificarTiempoActual(datosDelComponenteS.ubicacionDelComponenteInternoDeVideo);

					}
				}
				else{
					//SIGNIFICA QUE NO HEMOS ABIERTO EL VIDEO EN PANTALLA GRANDE, POR LO TANTO, NO TE PREOCUPES BROTHER
					modificarDatosDelComponenteS({...datosDelComponenteS, cargandoVideoMinimizadamente:false, duracion : datos.duration});
				}

				//modificarDatosDelComponenteS({...datosDelComponenteS, cargandoVideoMinimizadamente:false, duracion : datos.duration});

			},
			onProgressVideoMinimizadamente : (datos) => {
				if(datosDelComponenteR.current.permisoParaProgresarElSlider){

					//SI EN TU MOMENTO DEL ONPROGRESS, TE LLEGAS A TOPAR CON QUE datosDelComponenteR.current.ubicacionDelSliderIndicadaConElDedo = 1
					if(datosDelComponenteR.current.ubicacionDelSliderIndicadaConElDedo === 1){
						//NO QUIERO QUE MODIFIQUES EL TIEMPO ACTUAL, DEBIDO A QUE YA ESTAMOS EN EL FINAL DEL VIDEO
					}
					else{
						//EN TODOS LOS DEMAS CASOS, SI MODIFICAS EL TIEMPO ACTUAL
						if(datosDelComponenteS.estado === 2){
							modificarTiempoActual(datos.currentTime);
						}
					}
				}
			},
			onSlidingStartSlider : () => {
				datosDelComponenteR.current = {...datosDelComponenteR.current, permisoParaProgresarElSlider : false};
			},
			onSlidingCompleteSlider : () => {

				//dato puede ser:
				/*
				dato = 1
				dato < 1
				*/

				//CUANDO SUELTE EL SLIDER, QUIERO CAMBIAR A ESA POSICION DEL VIDEO
				//SOLO PODEMOS IR A DICHA POSICION, SI EL VIDEO YA ESTA CARGADO
				if(datosDelComponenteS.cargandoVideoMinimizadamente === false){

					//YA ESTA CARGADO EL VIDEO
					//datosDelComponenteS.duracion YA TIENE EL VALOR CORRECTO
					//POR LO TANTO, YA PODEMOS IR A ESA DIRECCION :D
					datosDelComponenteR.current.referencia.seek(datosDelComponenteR.current.ubicacionParaRedireccionarElVideo);

					//SI dato === 1
					if(datosDelComponenteR.current.ubicacionDelSliderIndicadaConElDedo === 1){
						//CON EL SLIDER, INDICASTE EL FINAL DEL VIDEO

						//1.- PONER TODO EN PAUSA, Y PASAR A ESTADO 3
						funciones.pasarDeEstado2A3();

						//2.- MODIFICAR TIEMPO ACTUAL SI TODO ESTE TIEMPO ESTUVO EN PAUSA
						modificarTiempoActual(datosDelComponenteR.current.ubicacionParaRedireccionarElVideo);

						//3.- COMO AQUI ubicacionDelSliderIndicadaConElDedo = 1, VOY A CAMBIAR ubicacionDelSliderIndicadaConElDedo = 0
						//datosDelComponenteR.current = {...datosDelComponenteR.current, ubicacionDelSliderIndicadaConElDedo : null};

					}
					else if(datosDelComponenteR.current.ubicacionDelSliderIndicadaConElDedo < 1){

						modificarTiempoActual(datosDelComponenteR.current.ubicacionParaRedireccionarElVideo);

						//CAMBIAMOS A ESTADO 2 IF ESTAS EN ESTADO 3
						if(datosDelComponenteS.estado === 3){
							modificarDatosDelComponenteS({...datosDelComponenteS, estado : 2});
						}
					}

					datosDelComponenteR.current = {...datosDelComponenteR.current, permisoParaProgresarElSlider : true};
				}


			},
			onValueChangeSlider : (dato) => {
				//( datosDelComponenteR.current.ubicacionParaRedireccionarElVideo )

				datosDelComponenteR.current = {...datosDelComponenteR.current, ubicacionParaRedireccionarElVideo : ((datosDelComponenteS.duracion) * (dato)), ubicacionDelSliderIndicadaConElDedo : dato};


			},
			tWDTIzquierdo : () => {
				//SE SUPONE QUE YA ESTA TERMINADO ESTE EVENTO
				contadorDelTWDTIzquierdo.current = contadorDelTWDTIzquierdo.current + 1;

				if(contadorDelTWDTIzquierdo.current === 2){
					//ESTAMOS EN EL DOBLE TOQUE
					//datosDelComponenteR.current.permisoParaProgresarElSlider
					datosDelComponenteR.current = {...datosDelComponenteR.current, permisoParaProgresarElSlider : false};


					//AQUI AGREGO EL EVENTITO SI estado === 3

					console.log('!PASO A ATRAS O ADELANTE!');
					borrarTimerDelTWDTIzquierdo();
					//contadorDelTWDTIzquierdo.current = 0;

					modificarVerIconoDelTWDTIzquierdo(true);
					atrasarXSegundos();
					/*
					if(props.tipo === 'adelantar'){
						//SUMAR 5
						//console.log('TIEMPO ACTUAL : ' + datosDelComponenteS.tiempoActual);
						//console.log('RESULTADO : ' + (datosDelComponenteS.tiempoActual + 5));
						//console.log('SEPARADOR');
						console.log('HOLA');
					}
					else{
						//RESTAR 5
						//console.log('TIEMPO ACTUAL : ' + datosDelComponenteS.tiempoActual);
						//console.log('RESULTADO : ' + (datosDelComponenteS.tiempoActual - 5));
						//console.log('SEPARADOR');
						console.log('ADIOS');
					}
					*/
					//adelantoOAtraso();

					//AQUI AGREGO EL EVENTITO SI estado === 3
					if(datosDelComponenteS.estado === 3){
						//NO TE PREOCUPES, TODO ESTA EN PAUSA

						modificarDatosDelComponenteS({...datosDelComponenteS, estado : 2});

						datosDelComponenteR.current = {...datosDelComponenteR.current, ubicacionDelSliderIndicadaConElDedo : null}

					}

					activarTimerDeIconoDelTWDTIzquierdo();
				}
				else if(contadorDelTWDTIzquierdo.current === 1){
					//TIENES MEDIO SEGUNDO PARA VOLVER A PRESIONAR EL BOTON
					activarTimerDelTWDTIzquierdo();
				}
				else if(contadorDelTWDTIzquierdo.current > 2){
					borrarTimerDeIconoDelTWDTIzquierdo();
					atrasarXSegundos();
					activarTimerDeIconoDelTWDTIzquierdo();
				}
			},
			tWDTDerecho : () => {

				console.log('TOC');
				contadorDelTWDTDerecho.current = contadorDelTWDTDerecho.current + 1;

				if(contadorDelTWDTDerecho.current === 2){
					//ESTAMOS EN EL DOBLE TOQUE

					//datosDelComponenteR.current.permisoParaProgresarElSlider
					datosDelComponenteR.current = {...datosDelComponenteR.current, permisoParaProgresarElSlider : false};

					console.log('!PASO A ADELANTE!');
					borrarTimerDelTWDTDerecho();
					//contadorDelTWDTIzquierdo.current = 0;

					modificarVerIconoDelTWDTDerecho(true);
					adelantarXSegundos();
					/*
					if(props.tipo === 'adelantar'){
						//SUMAR 5
						//console.log('TIEMPO ACTUAL : ' + datosDelComponenteS.tiempoActual);
						//console.log('RESULTADO : ' + (datosDelComponenteS.tiempoActual + 5));
						//console.log('SEPARADOR');
						console.log('HOLA');
					}
					else{
						//RESTAR 5
						//console.log('TIEMPO ACTUAL : ' + datosDelComponenteS.tiempoActual);
						//console.log('RESULTADO : ' + (datosDelComponenteS.tiempoActual - 5));
						//console.log('SEPARADOR');
						console.log('ADIOS');
					}
					*/
					//adelantoOAtraso();
					activarTimerDeIconoDelTWDTDerecho();
				}
				else if(contadorDelTWDTDerecho.current === 1){
					//TIENES MEDIO SEGUNDO PARA VOLVER A PRESIONAR EL BOTON
					activarTimerDelTWDTDerecho();
				}
				else if(contadorDelTWDTDerecho.current > 2){
					borrarTimerDeIconoDelTWDTDerecho();
					adelantarXSegundos();
					activarTimerDeIconoDelTWDTDerecho();
				}
			},
			checkBoxDelModoEliminacion: () => {
				if(datosDelComponenteS.checkedDelCheckBoxModoEliminacion){
					//PASARA A FALSE
					let indiceDeEliminacion = (datosEspecificosR.current.arregloDeComponentesAEliminarse).indexOf(props.orden);

					if(indiceDeEliminacion != (-1)){
						//EL NUMERITO SI FUE ENCONTRADO
						(datosEspecificosR.current.arregloDeComponentesAEliminarse).splice(indiceDeEliminacion, 1);
					}
				}
				else{
					//PASARA A TRUE
					//AGREGAMOS EL `orden` A datosEspecificosR.current.arregloDeComponentesEliminados
					datosEspecificosR.current.arregloDeComponentesAEliminarse.push(props.orden);
				}
				modificarDatosDelComponenteS({...datosDelComponenteS, checkedDelCheckBoxModoEliminacion: !(datosDelComponenteS.checkedDelCheckBoxModoEliminacion)});
			},
			checkBoxDelModoIntercambioDePosicion: () => {
				if(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion){
					//PASARA A FALSE
					let mensaje = eventosEspecificos.eliminarComponenteOPosicionDelArreglo(props.orden);

					if(mensaje === "Exito"){
						//SIEMPRE ENTRARA AQUI
						modificarDatosDelComponenteS({
							...datosDelComponenteS,
							checkedDelCheckBoxModoIntercambioDePosicion: !(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion),
							numeroDelIntercambioActual: null,
							tipoDeMovimientoActual: null
						});
					}
				}
				else{
					//PASARA A TRUE

					//AGREGAR EL COMPONENTE A datosEspecificosR.current.arregloDeComponentesAIntercambiarse
					//AQUI TE QUEDASTE ALONSOOOOOOOOOOOOOOOOOOOOOOOO TE DORMIRAS PRONTO CUANDO TERMINES ESTO

					let objeto = eventosEspecificos.agregarComponenteOPosicionAlArreglo(props.orden);

					modificarDatosDelComponenteS({
						...datosDelComponenteS,
						checkedDelCheckBoxModoIntercambioDePosicion: !(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion),
						numeroDelIntercambioActual: objeto.numeroDelIntercambio,
						tipoDeMovimientoActual: objeto.tipoDeMovimiento
					});
				}


			}
		}



		let estilos = StyleSheet.create({
			contenedorPrincipal :  {
					width : "100%",
					height : (datosDelComponenteR.current.anchoInicial) * .6,
					alignItems : 'center'
				},
			contenedorSecundario : (datosEspecificosS.modoEliminacion || datosEspecificosS.modoIntercambioDePosicion) ?
				{
					height : '100%',
					width : '70%',
					backgroundColor : 'black',
					borderRadius : 5,
					overflow : 'hidden',
					justifyContent : 'center',

					position: 'absolute',
					right: '2.5%'
				}
			:
				{
					height : '100%',
					width : '95%',
					backgroundColor : 'black',
					borderRadius : 5,
					overflow : 'hidden',
					justifyContent : 'center',

					position: 'absolute',
					right: '2.5%'
				},
			contenedorTerciario : {
				width : '100%',
				height : '95%',
				zIndex : 1,

			}
			,
			miniatura : {
				height : '100%',
			},
			video : {
				height : '100%',
			},
			botonReproduccion : {
				height : '30%',
				width : '20%',
				backgroundColor : 'rgba(100,100,100,0.4)',
				overflow : 'hidden',
				borderRadius : 100,
				zIndex : 3,
				position : 'absolute',
				top : '35%',
				left : '40%',
				alignItems : 'center',
				justifyContent : 'center'
			},
			botonMaximizar : {
				height : '20%',
				width : '19%',
				backgroundColor : 'rgba(100,100,100,0.4)',
				overflow : 'hidden',
				borderRadius : 20,
				zIndex : 3,
				position : 'absolute',
				//bottom : '2.5%',
				//right : '1%',
				bottom : '1%',
				right : '1%',
				alignItems : 'center',
				justifyContent : 'center'
			},
			botonCerrar : {
				height : '20%',
				width : '19%',
				backgroundColor : 'rgba(100,100,100,0.4)',
				overflow : 'hidden',
				borderRadius : 20,
				zIndex : 3,
				position : 'absolute',
				//bottom : '2.5%',
				//right : '1%',
				top : '1%',
				right : '1%',
				alignItems : 'center',
				justifyContent : 'center'
			},
			botonOcultarControles : {
				height : '20%',
				width : '19%',
				backgroundColor : 'rgba(100,100,100,0.4)',
				overflow : 'hidden',
				borderRadius : 20,
				zIndex : 3,
				position : 'absolute',
				//bottom : '2.5%',
				//right : '1%',
				top : '1%',
				left : '1%',
				alignItems : 'center',
				justifyContent : 'center'
			},
			botonOcultarSoloBotonOcultarControles : {
				height : '100%',
				width : '100%',
				zIndex : 2,
				position : 'absolute',
				top : 0,
				left : 0,
				overflow : 'hidden'
			},
			barraDeslizadora : {
				height : '20%',
				width : '78%',
				backgroundColor : 'rgba(100,100,100,0.4)',
				overflow : 'hidden',
				borderRadius : 10,
				zIndex : 3,
				position : 'absolute',
				//bottom : '2.5%',
				//right : '1%',
				bottom : '1%',
				left : '1%',
				justifyContent : 'space-around',
				alignItems : 'center',
				flexDirection : 'row'
			},
			touchableWithDoubleTap : {
				position:'absolute',
				width : '40%',
				height : '79%',
				zIndex : 2,
				top:0
			},
			tWDT : {
				backgroundColor:'rgba(100,100,100,0.4)',
				borderRadius : 100,
				width : '45%',
				height : '35%',
				overflow : 'hidden',
				justifyContent : 'center',
				alignItems : 'center'
			},
		});
		//<Image source={{uri:datosDelComponenteR.current.urlDeMiniatura}} style={estilos.miniatura} resizeMode={'contain'} />

		//COMO NO DEBO DE CREAR UN COMPONENTE LLAMADO touchableWithDoubleTap (POR RAZONES DE RE-RENDER), VOY A TENER VARIABLES AQUI DEFINIDAS
		//QUE SON ESPECIFICAS PARA LOS touchableWithDoubleTap
		//		TWDT = TouchableWithDoubleTap

		//TouchableWithDoubleTapIzquierdo
		const contadorDelTWDTIzquierdo = useRef(0);
		const [verIconoDelTWDTIzquierdo, modificarVerIconoDelTWDTIzquierdo] = useState(false);
		const timerDelTWDTIzquierdo = useRef(null);
		const timerDeIconoDelTWDTIzquierdo = useRef(null);
		const activarTimerDelTWDTIzquierdo = () => {
			timerDelTWDTIzquierdo.current = setTimeout(() => {
				contadorDelTWDTIzquierdo.current = 0;
				console.log('Contador ha reiniciado a : ' + contadorDelTWDTIzquierdo.current);
			}, 500);
		}
		const borrarTimerDelTWDTIzquierdo = () => {
			clearTimeout(timerDelTWDTIzquierdo.current);
		}
		const activarTimerDeIconoDelTWDTIzquierdo = () => {
			timerDeIconoDelTWDTIzquierdo.current = setTimeout(() => {
				datosDelComponenteR.current = {...datosDelComponenteR.current, permisoParaProgresarElSlider : true};
				modificarVerIconoDelTWDTIzquierdo(false);
				contadorDelTWDTIzquierdo.current = 0;
				console.log('ICONO ELIMINADO');
			},500);
		}
		const borrarTimerDeIconoDelTWDTIzquierdo = () => {
			clearTimeout(timerDeIconoDelTWDTIzquierdo.current);
		}
		const atrasarXSegundos = () => {
			if(datosDelComponenteS.cargandoVideoMinimizadamente === false){
				//datosDelComponenteR.current.referencia
				//SI LA REFERENCIA EXISTE, HACEMOS TODO LO DEMAS
				//SI EL VIDEO YA ESTA CARGADO, HACEMOS TODO LO DEMAS
				if(tiempoActual < datosDelComponenteS.adelantoOAtraso){
					//VOY A DIRIGIR EL VIDEO A 0
					datosDelComponenteR.current.referencia.seek(0);

					modificarTiempoActual(0);

				}
				else{
					//RESTO adelantoOAtraso
					datosDelComponenteR.current.referencia.seek( tiempoActual - datosDelComponenteS.adelantoOAtraso );

					modificarTiempoActual( tiempoActual - datosDelComponenteS.adelantoOAtraso );

				}
			}
		}

		//TouchableWithDoubleTapDerecho
		const contadorDelTWDTDerecho = useRef(0);
		const [verIconoDelTWDTDerecho, modificarVerIconoDelTWDTDerecho] = useState(false);
		const timerDelTWDTDerecho = useRef(null);
		const timerDeIconoDelTWDTDerecho = useRef(null);
		const activarTimerDelTWDTDerecho = () => {
			timerDelTWDTDerecho.current = setTimeout(() => {
				contadorDelTWDTDerecho.current = 0;
				console.log('Contador ha reiniciado a : ' + contadorDelTWDTDerecho.current);
			}, 500);
		}
		const borrarTimerDelTWDTDerecho = () => {
			clearTimeout(timerDelTWDTDerecho.current);
		}
		const activarTimerDeIconoDelTWDTDerecho = () => {
			timerDeIconoDelTWDTDerecho.current = setTimeout(() => {
				datosDelComponenteR.current = {...datosDelComponenteR.current, permisoParaProgresarElSlider : true};
				modificarVerIconoDelTWDTDerecho(false);
				contadorDelTWDTDerecho.current = 0;
				console.log('ICONO ELIMINADO');
			},500);
		}
		const borrarTimerDeIconoDelTWDTDerecho = () => {
			clearTimeout(timerDeIconoDelTWDTDerecho.current);
		}
		const adelantarXSegundos = () => {
			if(datosDelComponenteS.cargandoVideoMinimizadamente === false){
				//datosDelComponenteR.current.referencia
				//SI LA REFERENCIA EXISTE, HACEMOS TODO LO DEMAS
				//SI EL VIDEO YA ESTA CARGADO, HACEMOS TODO LO DEMAS
				if(tiempoActual > (datosDelComponenteS.duracion - datosDelComponenteS.adelantoOAtraso)){
					//VOY A DIRIGIR EL VIDEO A DURACION FINAL, O DURACION
					console.log('ESTE ES EL ULTIMO ADELANTO');

					//POR LO QUE PUDE COMPROBAR, IR A DURACION NO ES PERFECTO
					datosDelComponenteR.current.referencia.seek(datosDelComponenteS.duracion);


					modificarTiempoActual(datosDelComponenteS.duracion);



					//COMO ES EL ULTIMO AVANCE (DADO QUE YA SE ACABO EL VIDEO), PASAREMOS DE ESTADO2 A ESTADO3
					funciones.pasarDeEstado2A3();
				}
				else{
					//SUMO adelantoOAtraso
					datosDelComponenteR.current.referencia.seek( tiempoActual + datosDelComponenteS.adelantoOAtraso );


					modificarTiempoActual( tiempoActual + datosDelComponenteS.adelantoOAtraso );

				}
			}
		}

		const funciones = {
			pasarDeEstado2A3 : () => {
				modificarDatosDelComponenteS({...datosDelComponenteS, reproduciendo : false, estado : 3});


			}
		}

		const ComponenteInternoDeVideoEnPantallaCompleta = (propsInternas) => {

			////////////ComponenteInternoDeVideoEnPantallaCompleta/////////

			const [datosDelComponenteInternoS, modificarDatosDelComponenteInternoS] = useState({
				ocultarControles : false,
				ocultarSoloBotonOcultarControles : false,
				cargandoVideoMaximizadamente : true,
				estado : 2,
				reproduciendo : datosDelComponenteS.reproduciendo,
				duracion : 1,
				adelantoOAtraso : 5
			});


			const [tiempoActualInterno , modificarTiempoActualInterno] = useState(0);

			const datosDelComponenteInternoR = useRef({
				referencia : null,
				permisoParaProgresarElSlider : true,
				ubicacionDelSliderIndicadaConElDedo : null,
				ubicacionParaRedireccionarElVideo : null
			});

			const eventosInternos = {
				botonOcultarControles :  () => {
					if(datosDelComponenteInternoS.ocultarControles === false){
					//PROCEDERE A OCULTAR TODOS LOS CONTROLES
					//PASARE DE: VER CONTROLES => NO VER CONTROLES
					modificarDatosDelComponenteInternoS({...datosDelComponenteInternoS, ocultarControles : true, ocultarSoloBotonOcultarControles : true});

					//ME QUEDE AQUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII
					}
					else{
					//datosDelComponenteInternoS.ocultarControles === true
					//PASARE DE: NO VER CONTROLES => VER CONTROLES
					modificarDatosDelComponenteInternoS({...datosDelComponenteInternoS, ocultarControles : false, ocultarSoloBotonOcultarControles : false});
					}
					//modificarDatosDelComponenteS({...datosDelComponenteS, ocultarControles : !(datosDelComponenteS.ocultarControles)});
				},
				botonMinimizar : () => {


					StatusBar.setHidden(false);
					/*APARECEMOS LA NAVIGATION BAR*/
					Orientation.unlockAllOrientations();
					Orientation.lockToPortrait();




					//modificarDatosDelComponenteS({...datosDelComponenteS, mostrarVideoMaximizadamente : false});
					modificarDatosDelComponenteS({...datosDelComponenteS, mostrarVideoMaximizadamente : false, estadoDelComponenteInternoDeVideo : (datosDelComponenteInternoS.estado) , ubicacionDelComponenteInternoDeVideo : (tiempoActualInterno) , reproduciendo : (datosDelComponenteInternoS.reproduciendo) , estado : 2, cargandoVideoMinimizadamente : true});
				},
				botonReproduccion : () => {
					if(datosDelComponenteInternoS.estado === 2){
					//ESTAMOS EN ESTADO ENCENDIDO
					modificarDatosDelComponenteInternoS({...datosDelComponenteInternoS, reproduciendo : !(datosDelComponenteInternoS.reproduciendo)});
					}
					else if(datosDelComponenteInternoS.estado === 3){
						//YA ACABO EL VIDEO

						//1.- CAMBIAR ubicacionDelSliderIndicadaConElDedo = null
						datosDelComponenteInternoR.current = {...datosDelComponenteInternoR.current, ubicacionDelSliderIndicadaConElDedo : null};

						//2.- SEEK DEL VIDEO HASTA 0
						if(datosDelComponenteInternoR.current.referencia){
							datosDelComponenteInternoR.current.referencia.seek(0);
						}
						//3.- BARRA SLIDER HASTA 0 TAMBIEN
						modificarTiempoActualInterno(0);

						//4.- MODIFICAR VARIABLES: reproduciendo = true, estado = 2,
						modificarDatosDelComponenteInternoS({...datosDelComponenteInternoS, reproduciendo : true, estado : 2});
					}
				},
				onLoadVideoMaximizadamente : (datos) => {
					//onLoadVideoMinimizadamente

					if(datosDelComponenteS.estado === 1){
						modificarDatosDelComponenteInternoS({...datosDelComponenteInternoS, cargandoVideoMaximizadamente:false, duracion : datos.duration});
					}
					else if(datosDelComponenteS.estado === 2){
						modificarDatosDelComponenteInternoS({...datosDelComponenteInternoS, cargandoVideoMaximizadamente:false, duracion : datos.duration});
						//AL TERMINAR DE CARGAR, TENGO QUE IR A X PARTE DEL VIDEO
						//1.- seek
						datosDelComponenteInternoR.current.referencia.seek(tiempoActual);

						//2.- modificarTiempoActualInterno
						modificarTiempoActualInterno(tiempoActual);

						/*
						if(datosDelComponenteS.estado === 3){
							//PASAR DE ESTADO 2 INICIAL, A ESTADO 3 ENTONCES
							funcionesInternas.pasarDeEstado2A3();
						}
						*/
					}
					else if( datosDelComponenteS.estado === 3 ){
						//PASARE DE ESTADO 2 A 3 MANUALMENTE
						modificarDatosDelComponenteInternoS({...datosDelComponenteInternoS, cargandoVideoMaximizadamente:false, duracion : datos.duration, reproduciendo : false, estado : 3});
						//modificarDatosDelComponenteInternoS({...datosDelComponenteInternoS, reproduciendo : false, estado : 3});


						datosDelComponenteInternoR.current.referencia.seek(tiempoActual);
						modificarTiempoActualInterno(tiempoActual);

						//PASARE DE ESTADO 2 A 3 MANUALMENTE
						//funcionesInternas.pasarDeEstado2A3();
					}
				},
				onProgressVideoMaximizadamente : (datos) => {
					//onProgressVideoMinimizadamente
					if(datosDelComponenteInternoR.current.permisoParaProgresarElSlider){

					//SI EN TU MOMENTO DEL ONPROGRESS, TE LLEGAS A TOPAR CON QUE datosDelComponenteR.current.ubicacionDelSliderIndicadaConElDedo = 1
						if(datosDelComponenteInternoR.current.ubicacionDelSliderIndicadaConElDedo === 1){
							//NO QUIERO QUE MODIFIQUES EL TIEMPO ACTUAL, DEBIDO A QUE YA ESTAMOS EN EL FINAL DEL VIDEO
						}
						else{
							//EN TODOS LOS DEMAS CASOS, SI MODIFICAS EL TIEMPO ACTUAL
							if(datosDelComponenteInternoS.estado === 2){
								modificarTiempoActualInterno(datos.currentTime);
							}
						}
					}
				},
				botonOcultarSoloBotonOcultarControles : () => {
					modificarDatosDelComponenteInternoS({...datosDelComponenteInternoS, ocultarSoloBotonOcultarControles : !(datosDelComponenteInternoS.ocultarSoloBotonOcultarControles)});
				},
				onSlidingStartSlider : () => {
					datosDelComponenteInternoR.current = {...datosDelComponenteInternoR.current, permisoParaProgresarElSlider : false};
				},
				onSlidingCompleteSlider : () => {
					//dato puede ser:
					/*
					dato = 1
					dato < 1
					*/

					//CUANDO SUELTE EL SLIDER, QUIERO CAMBIAR A ESA POSICION DEL VIDEO
					//SOLO PODEMOS IR A DICHA POSICION, SI EL VIDEO YA ESTA CARGADO
					if(datosDelComponenteInternoS.cargandoVideoMaximizadamente === false){

						//YA ESTA CARGADO EL VIDEO
						//datosDelComponenteS.duracion YA TIENE EL VALOR CORRECTO
						//POR LO TANTO, YA PODEMOS IR A ESA DIRECCION :D
						datosDelComponenteInternoR.current.referencia.seek(datosDelComponenteInternoR.current.ubicacionParaRedireccionarElVideo);

						//SI dato === 1
						if(datosDelComponenteInternoR.current.ubicacionDelSliderIndicadaConElDedo === 1){
							//CON EL SLIDER, INDICASTE EL FINAL DEL VIDEO

							//1.- PONER TODO EN PAUSA, Y PASAR A ESTADO 3
							funcionesInternas.pasarDeEstado2A3();

							//2.- MODIFICAR TIEMPO ACTUAL SI TODO ESTE TIEMPO ESTUVO EN PAUSA
							modificarTiempoActualInterno(datosDelComponenteInternoR.current.ubicacionParaRedireccionarElVideo);

							//3.- COMO AQUI ubicacionDelSliderIndicadaConElDedo = 1, VOY A CAMBIAR ubicacionDelSliderIndicadaConElDedo = 0
							//datosDelComponenteR.current = {...datosDelComponenteR.current, ubicacionDelSliderIndicadaConElDedo : null};

						}
						else if(datosDelComponenteInternoR.current.ubicacionDelSliderIndicadaConElDedo < 1){

							modificarTiempoActualInterno(datosDelComponenteInternoR.current.ubicacionParaRedireccionarElVideo);

							//CAMBIAMOS A ESTADO 2 IF ESTAS EN ESTADO 3
							if(datosDelComponenteInternoS.estado === 3){
								modificarDatosDelComponenteInternoS({...datosDelComponenteInternoS, estado : 2});
							}
						}

						datosDelComponenteInternoR.current = {...datosDelComponenteInternoR.current, permisoParaProgresarElSlider : true};
					}


				},
				onValueChangeSlider : (dato) => {
					//( datosDelComponenteR.current.ubicacionParaRedireccionarElVideo )

					datosDelComponenteInternoR.current = {...datosDelComponenteInternoR.current, ubicacionParaRedireccionarElVideo : ((datosDelComponenteInternoS.duracion) * (dato)), ubicacionDelSliderIndicadaConElDedo : dato};

				},
				tWDTIzquierdo : () => {
					//MODIFICAR TODO A "Interno"
					//SE SUPONE QUE YA ESTA TERMINADO ESTE EVENTO
					contadorDelTWDTIzquierdoInterno.current = contadorDelTWDTIzquierdoInterno.current + 1;

					if(contadorDelTWDTIzquierdoInterno.current === 2){
						//ESTAMOS EN EL DOBLE TOQUE
						//datosDelComponenteR.current.permisoParaProgresarElSlider
						datosDelComponenteInternoR.current = {...datosDelComponenteInternoR.current, permisoParaProgresarElSlider : false};


						//AQUI AGREGO EL EVENTITO SI estado === 3

						console.log('!PASO A ATRAS O ADELANTE INTERNO!');
						borrarTimerDelTWDTIzquierdoInterno();
						//contadorDelTWDTIzquierdo.current = 0;

						modificarVerIconoDelTWDTIzquierdoInterno(true);
						atrasarXSegundosInternos();
						/*
							if(props.tipo === 'adelantar'){
							//SUMAR 5
						//console.log('TIEMPO ACTUAL : ' + datosDelComponenteS.tiempoActual);
						//console.log('RESULTADO : ' + (datosDelComponenteS.tiempoActual + 5));
						//console.log('SEPARADOR');
						console.log('HOLA');
						}
						else{
						//RESTAR 5
						//console.log('TIEMPO ACTUAL : ' + datosDelComponenteS.tiempoActual);
						//console.log('RESULTADO : ' + (datosDelComponenteS.tiempoActual - 5));
						//console.log('SEPARADOR');
						console.log('ADIOS');
						}
						*/
						//adelantoOAtraso();

						//AQUI AGREGO EL EVENTITO SI estado === 3
						if(datosDelComponenteInternoS.estado === 3){
							//NO TE PREOCUPES, TODO ESTA EN PAUSA

							modificarDatosDelComponenteInternoS({...datosDelComponenteInternoS, estado : 2});

							datosDelComponenteInternoR.current = {...datosDelComponenteInternoR.current, ubicacionDelSliderIndicadaConElDedo : null};

						}

						activarTimerDeIconoDelTWDTIzquierdoInterno();
					}
					else if(contadorDelTWDTIzquierdoInterno.current === 1){
						//TIENES MEDIO SEGUNDO PARA VOLVER A PRESIONAR EL BOTON
						activarTimerDelTWDTIzquierdoInterno();
					}
					else if(contadorDelTWDTIzquierdoInterno.current > 2){
						borrarTimerDeIconoDelTWDTIzquierdoInterno();
						atrasarXSegundosInternos();
						activarTimerDeIconoDelTWDTIzquierdoInterno();
					}
				},
				tWDTDerecho : () => {
					//MODIFICAR TODO A "Interno"

					console.log('TOC INTERNO');
					contadorDelTWDTDerechoInterno.current = contadorDelTWDTDerechoInterno.current + 1;

					if(contadorDelTWDTDerechoInterno.current === 2){
						//ESTAMOS EN EL DOBLE TOQUE

						//datosDelComponenteR.current.permisoParaProgresarElSlider
						datosDelComponenteInternoR.current = {...datosDelComponenteInternoR.current, permisoParaProgresarElSlider : false};

						console.log('!PASO A ADELANTE INTERNAMENTE!');
						borrarTimerDelTWDTDerechoInterno();
						//contadorDelTWDTIzquierdo.current = 0;

						modificarVerIconoDelTWDTDerechoInterno(true);
						adelantarXSegundosInternos();
						/*
						if(props.tipo === 'adelantar'){
							//SUMAR 5
							//console.log('TIEMPO ACTUAL : ' + datosDelComponenteS.tiempoActual);
							//console.log('RESULTADO : ' + (datosDelComponenteS.tiempoActual + 5));
							//console.log('SEPARADOR');
							console.log('HOLA');
						}
						else{
							//RESTAR 5
							//console.log('TIEMPO ACTUAL : ' + datosDelComponenteS.tiempoActual);
							//console.log('RESULTADO : ' + (datosDelComponenteS.tiempoActual - 5));
							//console.log('SEPARADOR');
							console.log('ADIOS');
						}
						*/
						//adelantoOAtraso();
						activarTimerDeIconoDelTWDTDerechoInterno();
					}
					else if(contadorDelTWDTDerechoInterno.current === 1){
						//TIENES MEDIO SEGUNDO PARA VOLVER A PRESIONAR EL BOTON
						activarTimerDelTWDTDerechoInterno();
					}
					else if(contadorDelTWDTDerechoInterno.current > 2){
						borrarTimerDeIconoDelTWDTDerechoInterno();
						adelantarXSegundosInternos();
						activarTimerDeIconoDelTWDTDerechoInterno();
					}
					//AQUI ACABA
				},
			}

			const estilosInternos = StyleSheet.create({
				contenedorSecundario : {
					width : '100%',
					height : '100%',
					backgroundColor : 'black'
				},
				contenedorTerciario : {
					width : '100%',
					height : '100%',
					zIndex : 1,

				},
				video : {
					height : '100%'
				},
				botonReproduccion : {
					height : '25%',
					width : '15%',
					backgroundColor : 'rgba(100,100,100,0.4)',
					overflow : 'hidden',
					borderRadius : 100,
					zIndex : 3,
					position : 'absolute',
					top : '37.5%',
					left : '42.5%',
					alignItems : 'center',
					justifyContent : 'center'
				},
				botonMinimizar : {
					height : '18%',
					width : '10%',
					backgroundColor : 'rgba(100,100,100,0.4)',
					overflow : 'hidden',
					borderRadius : 20,
					zIndex : 3,
					position : 'absolute',
					//bottom : '2.5%',
					//right : '1%',
					bottom : '1%',
					right : '1%',
					alignItems : 'center',
					justifyContent : 'center'
				},
				botonOcultarSoloBotonOcultarControles : {
					height : '100%',
					width : '100%',
					zIndex : 2,
					position : 'absolute',
					top : 0,
					left : 0,
					overflow : 'hidden',

				},
				barraDeslizadora : {
					height : '18%',
					width : '87%',
					backgroundColor : 'rgba(100,100,100,0.4)',
					overflow : 'hidden',
					borderRadius : 10,
					zIndex : 3,
					position : 'absolute',
					//bottom : '2.5%',
					//right : '1%',
					bottom : '1%',
					left : '1%',
					//justifyContent : 'space-around',
					alignItems : 'center',
					//flexDirection : 'row'
				},
				touchableWithDoubleTap : {
					position:'absolute',
					width : '42.5%',
					height : '81%',
					zIndex : 2,
					top:0,
				},
				tWDT : {
					backgroundColor:'rgba(100,100,100,0.4)',
					borderRadius : 100,
					width : '35.3%',
					height : '30.87%',
					overflow : 'hidden',
					justifyContent : 'center',
					alignItems : 'center'
				},
				botonOpciones : {
					height : '18%',
					width : '13%',
					backgroundColor : 'rgba(100,100,100,0.4)',
					overflow : 'hidden',
					borderRadius : 20,
					zIndex : 3,
					position : 'absolute',
					//bottom : '2.5%',
					//right : '1%',
					top : '1%',
					right : '1%',
					alignItems : 'center',
					justifyContent : 'center'
				},
				botonOcultarControles : {
					height : '18%',
					width : '13%',
					backgroundColor : 'rgba(100,100,100,0.4)',
					overflow : 'hidden',
					borderRadius : 20,
					zIndex : 3,
					position : 'absolute',
					//bottom : '2.5%',
					//right : '1%',
					top : '1%',
					left : '1%',
					alignItems : 'center',
					justifyContent : 'center'
				}
			});

			//TouchableWithDoubleTapIzquierdoInterno
			//verIconoDelTWDTIzquierdo
		const contadorDelTWDTIzquierdoInterno = useRef(0);
		const [verIconoDelTWDTIzquierdoInterno, modificarVerIconoDelTWDTIzquierdoInterno] = useState(false);
		const timerDelTWDTIzquierdoInterno = useRef(null);
		const timerDeIconoDelTWDTIzquierdoInterno = useRef(null);
		const activarTimerDelTWDTIzquierdoInterno = () => {
			timerDelTWDTIzquierdoInterno.current = setTimeout(() => {
				contadorDelTWDTIzquierdoInterno.current = 0;
				console.log('Contador ha reiniciado a : ' + contadorDelTWDTIzquierdoInterno.current);
			}, 500);
		}
		const borrarTimerDelTWDTIzquierdoInterno = () => {
			clearTimeout(timerDelTWDTIzquierdoInterno.current);
		}
		const activarTimerDeIconoDelTWDTIzquierdoInterno = () => {
			timerDeIconoDelTWDTIzquierdoInterno.current = setTimeout(() => {
				datosDelComponenteInternoR.current = {...datosDelComponenteInternoR.current, permisoParaProgresarElSlider : true};
				modificarVerIconoDelTWDTIzquierdoInterno(false);
				contadorDelTWDTIzquierdoInterno.current = 0;
				console.log('ICONO ELIMINADO');
			},500);
		}
		const borrarTimerDeIconoDelTWDTIzquierdoInterno = () => {
			clearTimeout(timerDeIconoDelTWDTIzquierdoInterno.current);
		}
		const atrasarXSegundosInternos = () => {
			if(datosDelComponenteInternoS.cargandoVideoMaximizadamente === false){
				//datosDelComponenteR.current.referencia
				//SI LA REFERENCIA EXISTE, HACEMOS TODO LO DEMAS
				//SI EL VIDEO YA ESTA CARGADO, HACEMOS TODO LO DEMAS
				if(tiempoActualInterno < datosDelComponenteInternoS.adelantoOAtraso){
					//VOY A DIRIGIR EL VIDEO A 0
					datosDelComponenteInternoR.current.referencia.seek(0);

					modificarTiempoActualInterno(0);

				}
				else{
					//RESTO adelantoOAtraso
					datosDelComponenteInternoR.current.referencia.seek( tiempoActualInterno - datosDelComponenteInternoS.adelantoOAtraso );

					modificarTiempoActualInterno( tiempoActualInterno - datosDelComponenteInternoS.adelantoOAtraso );

				}
			}
			//modificarTiempoActual( tiempoActual );
		}

		//TouchableWithDoubleTapDerechoInterno
		const contadorDelTWDTDerechoInterno = useRef(0);
		const [verIconoDelTWDTDerechoInterno, modificarVerIconoDelTWDTDerechoInterno] = useState(false);
		const timerDelTWDTDerechoInterno = useRef(null);
		const timerDeIconoDelTWDTDerechoInterno = useRef(null);
		const activarTimerDelTWDTDerechoInterno = () => {
			timerDelTWDTDerechoInterno.current = setTimeout(() => {
				contadorDelTWDTDerechoInterno.current = 0;
				console.log('Contador ha reiniciado a : ' + contadorDelTWDTDerechoInterno.current);
			}, 500);
		}
		const borrarTimerDelTWDTDerechoInterno = () => {
			clearTimeout(timerDelTWDTDerechoInterno.current);
		}
		const activarTimerDeIconoDelTWDTDerechoInterno = () => {
			timerDeIconoDelTWDTDerechoInterno.current = setTimeout(() => {
				datosDelComponenteInternoR.current = {...datosDelComponenteInternoR.current, permisoParaProgresarElSlider : true};
				modificarVerIconoDelTWDTDerechoInterno(false);
				contadorDelTWDTDerechoInterno.current = 0;
				console.log('ICONO ELIMINADO');
			},500);
		}
		const borrarTimerDeIconoDelTWDTDerechoInterno = () => {
			clearTimeout(timerDeIconoDelTWDTDerechoInterno.current);
		}
		const adelantarXSegundosInternos = () => {
			if(datosDelComponenteInternoS.cargandoVideoMaximizadamente === false){
				//datosDelComponenteR.current.referencia
				//SI LA REFERENCIA EXISTE, HACEMOS TODO LO DEMAS
				//SI EL VIDEO YA ESTA CARGADO, HACEMOS TODO LO DEMAS
				if(tiempoActualInterno > (datosDelComponenteInternoS.duracion - datosDelComponenteInternoS.adelantoOAtraso)){
					//VOY A DIRIGIR EL VIDEO A DURACION FINAL, O DURACION
					console.log('ESTE ES EL ULTIMO ADELANTO');

					//POR LO QUE PUDE COMPROBAR, IR A DURACION NO ES PERFECTO
					datosDelComponenteInternoR.current.referencia.seek(datosDelComponenteInternoS.duracion);


					modificarTiempoActualInterno(datosDelComponenteInternoS.duracion);



					//COMO ES EL ULTIMO AVANCE (DADO QUE YA SE ACABO EL VIDEO), PASAREMOS DE ESTADO2 A ESTADO3
					funcionesInternas.pasarDeEstado2A3();
				}
				else{
					//SUMO adelantoOAtraso
					datosDelComponenteInternoR.current.referencia.seek( tiempoActualInterno + datosDelComponenteInternoS.adelantoOAtraso );


					modificarTiempoActualInterno( tiempoActualInterno + datosDelComponenteInternoS.adelantoOAtraso );

				}
			}
		}

		//TODO LO DE ARRIBA SON VARIABLES NECESARIAS PARA QUE FUNCIONEN LOS BOTONES DE ADELANTAR X SEGUNDOS, Y ATRASAR X SEGUNDOS

		const funcionesInternas = {
			pasarDeEstado2A3 : () => {

				modificarDatosDelComponenteInternoS({...datosDelComponenteInternoS, reproduciendo : false, estado : 3});
			},
		}
			return(
				<>
					<Modal visible={true} transparent={true}>
						<View style={estilosInternos.contenedorSecundario}>

							<View style={estilosInternos.contenedorTerciario}>
								<Video onEnd={funcionesInternas.pasarDeEstado2A3} ref={(r) => { datosDelComponenteInternoR.current = {...datosDelComponenteInternoR.current, referencia : r} }} source={{uri: props.urlDeVideo}} style={estilosInternos.video} resizeMode={'contain'} onLoad={eventosInternos.onLoadVideoMaximizadamente} paused={!(datosDelComponenteInternoS.reproduciendo)} onProgress={eventosInternos.onProgressVideoMaximizadamente}/>
							</View>

							{(datosDelComponenteInternoS.ocultarControles) ?
								null
							:
								<View style={estilosInternos.botonReproduccion}>
									{(datosDelComponenteInternoS.cargandoVideoMaximizadamente) ?
										<ActivityIndicator size={'large'} color={'white'} />
									:
										<TouchableNativeFeedback onPress={eventosInternos.botonReproduccion}>
											<View style={{height : '100%', width : '100%', alignItems : 'center', justifyContent : 'center'}}>
												{(datosDelComponenteInternoS.estado === 2) ?
													<>
														{(datosDelComponenteInternoS.reproduciendo) ?
															<Icon1 name={"pause"} size={(anchoNativoInicial) * .17} color={'rgba(255,255,255,0.7)'}/>
														:
															<Icon1 name={"play"} size={(anchoNativoInicial) * .17} color={'rgba(255,255,255,0.7)'}/>
														}
													</>
												: (datosDelComponenteInternoS.estado === 3) ?
													<Icon1 name={"restart"} size={(anchoNativoInicial) * .145} color={'rgba(255,255,255,0.7)'}/>
												:
													null
												}
											</View>
										</TouchableNativeFeedback>
									}
								</View>
							}


							{(datosDelComponenteInternoS.ocultarControles) ?
								null
							:
								<View style={estilosInternos.botonMinimizar}>
									<TouchableNativeFeedback onPress={eventosInternos.botonMinimizar}>
										<View style={{height : '100%', width : '100%', alignItems : 'center', justifyContent : 'center'}}>
											<Icon1 name={"fullscreen-exit"} size={(anchoNativoInicial) * .12} color={'rgba(255,255,255,0.7)'}/>
										</View>
									</TouchableNativeFeedback>
								</View>
							}

							{(datosDelComponenteInternoS.estado === 2 || datosDelComponenteInternoS.estado === 3) ?
								<>

									{(datosDelComponenteInternoS.ocultarControles) ?
										//AQUI DEBE DE IR EL BOTONSOTE GRANDOTE
										//ESTE BOTONSOTE GRANDOTE, TIENE LA FUNCION DE APARECER O DESAPARECER EL OJITO
										<View style={estilosInternos.botonOcultarSoloBotonOcultarControles}>
											<TouchableWithoutFeedback onPress={eventosInternos.botonOcultarSoloBotonOcultarControles}>
												<View style={{width : '100%', height : '100%'}}>
												</View>
											</TouchableWithoutFeedback>
										</View>

									:
										<>
											<View style={estilosInternos.barraDeslizadora}>
												<View style={{height : '50%', width : '100%', justifyContent : 'flex-end'}}>
													<View style={{position : 'absolute' , left : 0, justifyContent : 'center' , alignItems : 'center'}}>
														<Text style={{color:'rgba(255,255,255,0.7)'}}>{RetornarSegundosEnFormatoHHMMSS( tiempoActualInterno)} / {RetornarSegundosEnFormatoHHMMSS( datosDelComponenteInternoS.duracion )}</Text>
													</View>

													<View style={{position : 'absolute' , right  : 0, justifyContent : 'center' , alignItems : 'center'}}>
														<Text style={{color:'rgba(255,255,255,0.7)'}}>{RetornarSegundosEnFormatoHHMMSS( (datosDelComponenteInternoS.duracion) - tiempoActualInterno )}</Text>
													</View>
												</View>

												<View style={{height : '50%', width : '100%',justifyContent : 'center' , alignItems : 'center'}}>
													<Slider onSlidingStart={eventosInternos.onSlidingStartSlider} onSlidingComplete={eventosInternos.onSlidingCompleteSlider} onValueChange={eventosInternos.onValueChangeSlider} style={{width : '90%'}} maximumTrackTintColor={'rgba(100,100,100,0.3)'} minimumTrackTintColor={'rgba(255,255,255,0.5)'} thumbTintColor={'rgba(255,255,255,0.5)'} thumbStyle={{width: 16, height : 16}} value={tiempoActualInterno / datosDelComponenteInternoS.duracion}/>
												</View>
											</View>



											<TouchableNativeFeedback onPress={eventosInternos.tWDTIzquierdo}>
												<View style={[estilosInternos.touchableWithDoubleTap, {left : 0}]}>
													{(verIconoDelTWDTIzquierdoInterno) ?
														<View style={[estilosInternos.tWDT,{position : 'absolute', bottom : '20%', right : '25%'}]}>
															<Icon2 name={"fast-rewind"} size={(anchoNativoInicial) * .16} color={'rgba(255,255,255,0.7)'}/>
														</View>
													:
														null
													}
												</View>
											</TouchableNativeFeedback>


											{(datosDelComponenteInternoS.estado === 3) ?
												null
											:
												<TouchableNativeFeedback onPress={eventosInternos.tWDTDerecho}>
													<View style={[estilosInternos.touchableWithDoubleTap, {right : 0}]}>
														{(verIconoDelTWDTDerechoInterno) ?
															<View style={[estilosInternos.tWDT,{position : 'absolute', bottom : '20%', left : '25%'}]}>
																<Icon1 name={"fast-forward"} size={(anchoNativoInicial) * .16} color={'rgba(255,255,255,0.7)'}/>
															</View>
														:
															null
														}
													</View>
												</TouchableNativeFeedback>
											}

											<View style={estilosInternos.botonOpciones}>
												<TouchableNativeFeedback onPress={/*eventosInternos.botonOpciones*/() => {}}>
													<View style={{height : '100%', width : '100%', alignItems : 'center', justifyContent : 'center'}}>
														<Icon6 name={"options"} size={(anchoNativoInicial) * .08} color={'rgba(255,255,255,0.7)'}/>
													</View>
												</TouchableNativeFeedback>
											</View>

										</>
									}

									{(datosDelComponenteInternoS.ocultarSoloBotonOcultarControles) ?
										null
									:
										<View style={estilosInternos.botonOcultarControles}>
											<TouchableNativeFeedback onPress={eventosInternos.botonOcultarControles}>
												<View style={{height : '100%', width : '100%', alignItems : 'center', justifyContent : 'center'}}>
													{(datosDelComponenteInternoS.ocultarControles) ?
														<Icon3 name={"eye"} size={(anchoNativoInicial) * .07} color={'rgba(255,255,255,0.7)'}/>
													:
														<Icon3 name={"eye-slash"} size={(anchoNativoInicial) * .07} color={'rgba(255,255,255,0.7)'}/>
													}
												</View>
											</TouchableNativeFeedback>
										</View>
									}


								</>
							:
								null
							}

				{/*AQUI TERMINA EL COMPONENTE*/}

						</View>
					</Modal>
				</>
			);
		}

		/*
		 ALTURA INICIAL DEL COMPONENTE = (datosDelComponenteR.current.anchoInicial) * .6
		*/
		useEffect(() => {
		}, []);

		return (
		<View style={estilos.contenedorPrincipal}>
			{/*AQUI IRIA EL BOTON PARA 'CAMBIAR POSICION DE COMPONENTE, O ELIMINAR COMPONENTE'*/}
			{(datosEspecificosS.modoEliminacion) ?
				<View style={{width: (datosDelComponenteR.current.anchoInicial) * .275, height: '35%', position: 'absolute', left: 0 /*ESTA ES LA VARIABLE QUE VA A CAMBIAR*/, top: '32.5%', overflow: 'hidden', zIndex: -1}}>
					<View style={{width: (datosDelComponenteR.current.anchoInicial) * .09, height: '100%', position: 'absolute', left: 0}}>
						<View style={{
							width: 0,
							height: 0,
							backgroundColor: 'transparent',
							borderStyle: 'solid',
							borderRightWidth: (datosDelComponenteR.current.anchoInicial) * .09,
							borderBottomWidth: (datosDelComponenteR.current.anchoInicial) * .105,
							borderRightColor: 'rgb(212,12,29)',
							borderBottomColor: 'transparent',
							position: 'absolute',
							left: 0,
							top: 0
						}}/>
						<View style={{
							width: 0,
							height: 0,
							backgroundColor: 'transparent',
							borderStyle: 'solid',
							borderRightWidth: (datosDelComponenteR.current.anchoInicial) * .09,
							borderTopWidth: (datosDelComponenteR.current.anchoInicial) * .105,
							borderRightColor: 'rgb(212,12,29)',
							borderTopColor: 'transparent',
							position: 'absolute',
							left: 0,
							bottom: 0
						}}/>
					</View>
					<View style={{width: (datosDelComponenteR.current.anchoInicial) * 0.185, height: '100%', position: 'absolute', right: 0, backgroundColor: 'rgb(212,12,29)'}}>
						<View style={{width: '100%', height: '50%', position: 'absolute', left: 0, top: 0, alignItems: 'center', justifyContent: 'center'}}>
							<Icon8 name={"trashcan"} size={(datosDelComponenteR.current.anchoInicial) * 0.085} color={'black'}/>
						</View>
						<View style={{width: '100%', height: '50%', position: 'absolute', left: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'}}>
							<CheckBox checked={datosDelComponenteS.checkedDelCheckBoxModoEliminacion} onPress={eventos.checkBoxDelModoEliminacion} size={(datosDelComponenteR.current.anchoInicial) * 0.085}/>
						</View>
					</View>
				</View>
			: (datosEspecificosS.modoIntercambioDePosicion) ?
				<View style={{width: (datosDelComponenteR.current.anchoInicial) * .275, height: '35%', position: 'absolute', left: 0 /*ESTA ES LA VARIABLE QUE VA A CAMBIAR*/, top: '32.5%', overflow: 'hidden', zIndex: -1}}>
					<View style={{width: (datosDelComponenteR.current.anchoInicial) * .09, height: '100%', position: 'absolute', left: 0}}>
						<View style={{
							width: 0,
							height: 0,
							backgroundColor: 'transparent',
							borderStyle: 'solid',
							borderRightWidth: (datosDelComponenteR.current.anchoInicial) * .09,
							borderBottomWidth: (datosDelComponenteR.current.anchoInicial) * .105,
							borderRightColor: 'rgb(255,201,14)',
							borderBottomColor: 'transparent',
							position: 'absolute',
							left: 0,
							top: 0
						}}/>
						<View style={{
							width: 0,
							height: 0,
							backgroundColor: 'transparent',
							borderStyle: 'solid',
							borderRightWidth: (datosDelComponenteR.current.anchoInicial) * .09,
							borderTopWidth: (datosDelComponenteR.current.anchoInicial) * .105,
							borderRightColor: 'rgb(255,201,14)',
							borderTopColor: 'transparent',
							position: 'absolute',
							left: 0,
							bottom: 0
						}}/>
					</View>
					<View style={{width: (datosDelComponenteR.current.anchoInicial) * 0.185, height: '100%', position: 'absolute', right: 0, backgroundColor: 'rgb(255,201,14)'}}>
						<View style={(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion) ? {width: '100%', height: '50%', position: 'absolute', left: 0, top: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'} : {width: '100%', height: '50%', position: 'absolute', left: 0, top: 0, alignItems: 'center', justifyContent: 'center'}}>
							{(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion) ?
								<>
									<Text style={{fontSize: (((anchoNativoInicial * .6) * .35) * .5) * .45, textAlign: 'center', fontWeight: 'bold'}} >{datosDelComponenteS.numeroDelIntercambioActual + '°'}</Text>
									{(datosDelComponenteS.tipoDeMovimientoActual === "Inicial") ?
										<Icon9 name={"long-arrow-up"} size={((anchoNativoInicial) * 0.085) * .8} color={'black'}/>
									: (datosDelComponenteS.tipoDeMovimientoActual === "Final") ?
										<Icon9 name={"long-arrow-down"} size={((anchoNativoInicial) * 0.085) * .8} color={'black'}/>
									:
										null
									}
								</>
							:
								<Icon9 name={"exchange"} size={((anchoNativoInicial) * 0.085) * .8} color={'black'} style={{transform: [{rotate: '90deg'}]}}/>
							}
						</View>
						<View style={{width: '100%', height: '50%', position: 'absolute', left: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'}}>
							<CheckBox checked={datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion} onPress={eventos.checkBoxDelModoIntercambioDePosicion} size={(datosDelComponenteR.current.anchoInicial) * 0.085}/>
						</View>
					</View>
				</View>
			:
				null
			}


			<View style={estilos.contenedorSecundario}>
			{(datosDelComponenteS.mostrarVideoMaximizadamente) ?
				<ComponenteInternoDeVideoEnPantallaCompleta />
			:
			<>
				<View style={estilos.contenedorTerciario}>
				{(datosDelComponenteS.estado === 1) ?
					<Image source={{uri:props.urlDeMiniatura}} style={estilos.miniatura} resizeMode={'contain'} />
				:
					<Video onEnd={funciones.pasarDeEstado2A3} ref={(r) => { datosDelComponenteR.current = {...datosDelComponenteR.current, referencia : r}; }} source={{uri: props.urlDeVideo}} style={estilos.video} resizeMode={'contain'} onLoad={eventos.onLoadVideoMinimizadamente} paused={!(datosDelComponenteS.reproduciendo)} onProgress={eventos.onProgressVideoMinimizadamente}/>
				}
				</View>

				{(datosDelComponenteS.ocultarControles) ?
				null
				:
				<View style={estilos.botonReproduccion}>
					{(datosDelComponenteS.cargandoVideoMinimizadamente) ?
					<ActivityIndicator size={'large'} color={'white'} />
					:
					<TouchableNativeFeedback onPress={eventos.botonReproduccion}>
						<View style={{height : '100%', width : '100%', alignItems : 'center', justifyContent : 'center'}}>
							{(datosDelComponenteS.estado === 2 || datosDelComponenteS.estado === 1) ?
								<>
									{(datosDelComponenteS.reproduciendo) ?
										<Icon1 name={"pause"} size={(datosDelComponenteR.current.anchoInicial) * .15} color={'rgba(255,255,255,0.7)'}/>
									:
										<Icon1 name={"play"} size={(datosDelComponenteR.current.anchoInicial) * .15} color={'rgba(255,255,255,0.7)'}/>
									}
								</>
							: (datosDelComponenteS.estado === 3) ?
								<Icon1 name={"restart"} size={(datosDelComponenteR.current.anchoInicial) * .125} color={'rgba(255,255,255,0.7)'}/>
							:
							null
							}
						</View>
					</TouchableNativeFeedback>
					}
				</View>
				}

				{(datosDelComponenteS.ocultarControles) ?
				null
				:
				<View style={estilos.botonMaximizar}>
					<TouchableNativeFeedback onPress={eventos.botonMaximizar}>
						<View style={{height : '100%', width : '100%', alignItems : 'center', justifyContent : 'center'}}>
							<Icon1 name={"fullscreen"} size={(datosDelComponenteR.current.anchoInicial) * .1} color={'rgba(255,255,255,0.7)'}/>
						</View>
					</TouchableNativeFeedback>
				</View>
				}

				{(datosDelComponenteS.estado === 2 || datosDelComponenteS.estado === 3) ?
				<>

				{(datosDelComponenteS.ocultarControles) ?
				//AQUI DEBE DE IR EL BOTONSOTE GRANDOTE
				<View style={estilos.botonOcultarSoloBotonOcultarControles}>
					<TouchableWithoutFeedback onPress={eventos.botonOcultarSoloBotonOcultarControles}>
						<View style={{width : '100%', height : '100%'}}>
						</View>
					</TouchableWithoutFeedback>
				</View>

				:
				<>
				<View style={estilos.barraDeslizadora}>

					<Slider onSlidingStart={eventos.onSlidingStartSlider} onSlidingComplete={eventos.onSlidingCompleteSlider} onValueChange={eventos.onValueChangeSlider} style={{width : '78%'}} maximumTrackTintColor={'rgba(100,100,100,0.3)'} minimumTrackTintColor={'rgba(255,255,255,0.5)'} thumbTintColor={'rgba(255,255,255,0.5)'} thumbStyle={{width: 16, height : 16}} value={tiempoActual / datosDelComponenteS.duracion}/>

					<Text style={{color:'rgba(255,255,255,0.7)'}}>{RetornarSegundosEnFormatoHHMMSS( (datosDelComponenteS.duracion) - tiempoActual )}</Text>


				</View>



				<TouchableNativeFeedback onPress={eventos.tWDTIzquierdo}>
					<View style={[estilos.touchableWithDoubleTap, {left : 0}]}>
						{(verIconoDelTWDTIzquierdo) ?
						<View style={[estilos.tWDT,{position : 'absolute', bottom : '20%', right : '25%'}]}>
							<Icon2 name={"fast-rewind"} size={(datosDelComponenteR.current.anchoInicial) * .15} color={'rgba(255,255,255,0.7)'}/>
						</View>
						:
						null
						}
					</View>
				</TouchableNativeFeedback>


				{(datosDelComponenteS.estado === 3) ?
					null
				:
				<TouchableNativeFeedback onPress={eventos.tWDTDerecho}>
					<View style={[estilos.touchableWithDoubleTap, {right : 0}]}>
						{(verIconoDelTWDTDerecho) ?
						<View style={[estilos.tWDT,{position : 'absolute', bottom : '20%', left : '25%'}]}>
							<Icon1 name={"fast-forward"} size={(datosDelComponenteR.current.anchoInicial) * .15} color={'rgba(255,255,255,0.7)'}/>
						</View>
						:
						null
						}
					</View>
				</TouchableNativeFeedback>
				}

				<View style={estilos.botonCerrar}>
					<TouchableNativeFeedback onPress={eventos.botonCerrar}>
						<View style={{height : '100%', width : '100%', alignItems : 'center', justifyContent : 'center'}}>
							<Icon1 name={"window-close"} size={(datosDelComponenteR.current.anchoInicial) * .1} color={'rgba(255,255,255,0.7)'}/>
						</View>
					</TouchableNativeFeedback>
				</View>

				</>
				}

				{(datosDelComponenteS.ocultarSoloBotonOcultarControles) ?
				null
				:
				<View style={estilos.botonOcultarControles}>
					<TouchableNativeFeedback onPress={eventos.botonOcultarControles}>
						<View style={{height : '100%', width : '100%', alignItems : 'center', justifyContent : 'center'}}>
							{(datosDelComponenteS.ocultarControles) ?
							<Icon3 name={"eye"} size={(datosDelComponenteR.current.anchoInicial) * .07} color={'rgba(255,255,255,0.7)'}/>
							:
							<Icon3 name={"eye-slash"} size={(datosDelComponenteR.current.anchoInicial) * .07} color={'rgba(255,255,255,0.7)'}/>
							}
						</View>
					</TouchableNativeFeedback>
				</View>
				}


				</>
				:
				null
				}


			</>
			}
			</View>
		</View>
		);

	}

	//Este ComponenteDeAudio solo es de READ-ONLY o SOLO-LECTURA
	//Falta programar el botoncito para 'CAMBIAR POSICION DE COMPONENTE' y 'ELIMINAR COMPONENTE'
	const ComponenteDeAudio = (props) => {

		const [datosDelComponenteS, modificarDatosDelComponenteS] = useState({
			estado : 1,
			reproduciendo : false,
			duracion : 1,
			cargandoAudio : false,
			deshabilitacionDelSlider : true,
			adelantoOAtraso : 5,

			checkedDelCheckBoxModoEliminacion: false,
			checkedDelCheckBoxModoIntercambioDePosicion: false,

			//VARIABLES NECESARIAS PARA EL INTERCAMBIO DE POSICION
			numeroDelIntercambioActual: null,
			tipoDeMovimientoActual: null
		});

		const datosDelComponenteR = useRef({
			referencia : null,
			ubicacionDelSliderIndicadaConElDedo : null,
			permisoParaProgresarElSlider : true,
			ubicacionParaRedireccionarElAudio : null,

		});

		const [tiempoActual , modificarTiempoActual] = useState(0);

		const eventos = {
			botonReproduccion : () => {
				if(datosDelComponenteS.estado === 1){
					//ESTAMOS EN ESTADO APAGADO


					//VAMOS A MOSTRAR EL "Loading"
					//VAMOS A CAMBIAR A ESTADO : 2
					//VAMOS A CAMBIAR REPRODUCCIENDO : TRUE

					//MODIFICACION PARA NO MOSTRAR TODOS LOS VIDEOS AL MISMO TIEMPO
					//BORRA LOS CIRCULITOS AZULES EN CASO DE ERROR
					if(datosEspecificosR.current.reproduciendoAlgunVideoOAudio === false){
						//SI PUEDO REPRODUCIR ESTE AUDIO

						datosEspecificosR.current = {...datosEspecificosR.current , reproduciendoAlgunVideoOAudio : true};
						modificarDatosDelComponenteS({...datosDelComponenteS, estado : 2, reproduciendo : true, cargandoAudio : true});
					}
					else if(datosEspecificosR.current.reproduciendoAlgunVideoOAudio === true){
						//QUIERE DECIR QUE YA HAY UN AUDIO O VIDEO REPRODUCIENDOSE EN EL FONDO
						ToastAndroid.show('Solo puedes reproducir un video o audio a la vez' , ToastAndroid.SHORT);
					}
				}
				else if(datosDelComponenteS.estado === 2){
					//ESTAMOS EN ESTADO ENCENDIDO
					modificarDatosDelComponenteS({...datosDelComponenteS, reproduciendo : !(datosDelComponenteS.reproduciendo)});
				}
				else if(datosDelComponenteS.estado === 3){
					//LE PICASTE AL BOTON REPRODUCCION, AUN CUANDO YA ACABO EL AUDIO
					//YA ACABO EL AUDIO

					//1.- CAMBIAR ubicacionDelSliderIndicadaConElDedo = null
					datosDelComponenteR.current = {...datosDelComponenteR.current, ubicacionDelSliderIndicadaConElDedo : null};

					//2.- SEEK DEL VIDEO HASTA 0
					if(datosDelComponenteR.current.referencia){
						datosDelComponenteR.current.referencia.seek(0);
					}
					//3.- BARRA SLIDER HASTA 0 TAMBIEN
					modificarTiempoActual(0);

					//4.- MODIFICAR VARIABLES: reproduciendo = true, estado = 2,
					modificarDatosDelComponenteS({...datosDelComponenteS, reproduciendo : true, estado : 2});
				}
			},
			botonCerrar : () => {
				//SIGNIFICA EMPEZAR OTRA VEZ TODO DE NUEVO

				modificarDatosDelComponenteS({...datosDelComponenteS, estado : 1, reproduciendo : false, cargandoAudio : false, duracion : 1 , deshabilitacionDelSlider : true });
				datosDelComponenteR.current = {...datosDelComponenteR.current, ubicacionDelSliderIndicadaConElDedo : null};
				modificarTiempoActual(0);

				datosEspecificosR.current = {...datosEspecificosR.current , reproduciendoAlgunVideoOAudio : false};
			},
			onLoadAudio : (datos) => {

				modificarDatosDelComponenteS({...datosDelComponenteS, cargandoAudio : false, duracion : datos.duration, deshabilitacionDelSlider : false});

			},
			onProgressAudio : (datos) => {
				//onProgressVideoMinimizadamente
				if(datosDelComponenteR.current.permisoParaProgresarElSlider){

					//SI EN TU MOMENTO DEL ONPROGRESS, TE LLEGAS A TOPAR CON QUE datosDelComponenteR.current.ubicacionDelSliderIndicadaConElDedo = 1
					if(datosDelComponenteR.current.ubicacionDelSliderIndicadaConElDedo === 1){
						//NO QUIERO QUE MODIFIQUES EL TIEMPO ACTUAL, DEBIDO A QUE YA ESTAMOS EN EL FINAL DEL AUDIO
					}
					else{
						//EN TODOS LOS DEMAS CASOS, SI MODIFICAS EL TIEMPO ACTUAL
						if(datosDelComponenteS.estado === 2){
							//console.log(datosDelComponenteR.current.ubicacionDelSliderIndicadaConElDedo);
							modificarTiempoActual(datos.currentTime);
						}
					}
				}
			},
			onSlidingStartSlider : () => {
				datosDelComponenteR.current = {...datosDelComponenteR.current, permisoParaProgresarElSlider : false};
			},
			onSlidingCompleteSlider : () => {
				//dato puede ser:
				/*
				dato = 1
				dato < 1
				*/

				//CUANDO SUELTE EL SLIDER, QUIERO CAMBIAR A ESA POSICION DEL VIDEO
				//SOLO PODEMOS IR A DICHA POSICION, SI EL AUDIO YA ESTA CARGADO
				if(datosDelComponenteS.cargandoAudio === false){

					//YA ESTA CARGADO EL AUDIO
					//datosDelComponenteS.duracion YA TIENE EL VALOR CORRECTO
					//POR LO TANTO, YA PODEMOS IR A ESA DIRECCION :D
					datosDelComponenteR.current.referencia.seek(datosDelComponenteR.current.ubicacionParaRedireccionarElAudio);

					//SI dato === 1
					if(datosDelComponenteR.current.ubicacionDelSliderIndicadaConElDedo === 1){
						//CON EL SLIDER, INDICASTE EL FINAL DEL VIDEO

						//1.- PONER TODO EN PAUSA, Y PASAR A ESTADO 3
						funciones.pasarDeEstado2A3();

						//2.- MODIFICAR TIEMPO ACTUAL SI TODO ESTE TIEMPO ESTUVO EN PAUSA
						modificarTiempoActual(datosDelComponenteR.current.ubicacionParaRedireccionarElAudio);

						//3.- COMO AQUI ubicacionDelSliderIndicadaConElDedo = 1, VOY A CAMBIAR ubicacionDelSliderIndicadaConElDedo = 0
						//datosDelComponenteR.current = {...datosDelComponenteR.current, ubicacionDelSliderIndicadaConElDedo : null};

					}
					else if(datosDelComponenteR.current.ubicacionDelSliderIndicadaConElDedo < 1){

						modificarTiempoActual(datosDelComponenteR.current.ubicacionParaRedireccionarElAudio);

						//CAMBIAMOS A ESTADO 2 IF ESTAS EN ESTADO 3
						if(datosDelComponenteS.estado === 3){
							modificarDatosDelComponenteS({...datosDelComponenteS, estado : 2});
						}
					}

					datosDelComponenteR.current = {...datosDelComponenteR.current, permisoParaProgresarElSlider : true};
				}


			},
			onValueChangeSlider : (dato) => {
				datosDelComponenteR.current = {...datosDelComponenteR.current, ubicacionParaRedireccionarElAudio : ((datosDelComponenteS.duracion) * (dato)), ubicacionDelSliderIndicadaConElDedo : dato};
			},
			botonAdelantarXSegundos : () => {
				if(datosDelComponenteS.estado === 2){
					datosDelComponenteR.current = {...datosDelComponenteR.current, permisoParaProgresarElSlider : false};
					borrarTimerDelBotonAdelantarOAtrasarXSegundos();
					adelantarXSegundos();
					activarTimerDelBotonAdelantarOAtrasarXSegundos();
				}
			},
			botonAtrasarXSegundos : () => {
				if(datosDelComponenteS.estado === 2 || datosDelComponenteS.estado === 3){
					datosDelComponenteR.current = {...datosDelComponenteR.current, permisoParaProgresarElSlider : false};
					borrarTimerDelBotonAdelantarOAtrasarXSegundos();
					atrasarXSegundos();

					//AQUI ME QUEDE
					if(datosDelComponenteS.estado === 3){
						//NO TE PREOCUPES, TODO ESTA EN PAUSA
						modificarDatosDelComponenteS({...datosDelComponenteS, estado: 2});

						datosDelComponenteR.current = {...datosDelComponenteR.current, ubicacionDelSliderIndicadaConElDedo: null};
					}

					activarTimerDelBotonAdelantarOAtrasarXSegundos();
				}
			},
			checkBoxDelModoEliminacion: () => {
				if(datosDelComponenteS.checkedDelCheckBoxModoEliminacion){
					//PASARA A FALSE
					let indiceDeEliminacion = (datosEspecificosR.current.arregloDeComponentesAEliminarse).indexOf(props.orden);

					if(indiceDeEliminacion != (-1)){
						//SI HAY NUMERITO QUE ELIMINAR
						(datosEspecificosR.current.arregloDeComponentesAEliminarse).splice(indiceDeEliminacion, 1);
					}
				}
				else{
					//PASARA A TRUE
					(datosEspecificosR.current.arregloDeComponentesAEliminarse).push(props.orden);
				}

				modificarDatosDelComponenteS({...datosDelComponenteS, checkedDelCheckBoxModoEliminacion: !(datosDelComponenteS.checkedDelCheckBoxModoEliminacion)});
			},
			checkBoxDelModoIntercambioDePosicion: () => {
				if(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion){
					//PASARA A FALSE
					let mensaje = eventosEspecificos.eliminarComponenteOPosicionDelArreglo(props.orden);

					if(mensaje === "Exito"){
						//SIEMPRE ENTRARA AQUI
						modificarDatosDelComponenteS({
							...datosDelComponenteS,
							checkedDelCheckBoxModoIntercambioDePosicion: !(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion),
							numeroDelIntercambioActual: null,
							tipoDeMovimientoActual: null
						});
					}
				}
				else{
					//PASARA A TRUE

					//AGREGAR EL COMPONENTE A datosEspecificosR.current.arregloDeComponentesAIntercambiarse
					//AQUI TE QUEDASTE ALONSOOOOOOOOOOOOOOOOOOOOOOOO TE DORMIRAS PRONTO CUANDO TERMINES ESTO

					let objeto = eventosEspecificos.agregarComponenteOPosicionAlArreglo(props.orden);

					modificarDatosDelComponenteS({
						...datosDelComponenteS,
						checkedDelCheckBoxModoIntercambioDePosicion: !(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion),
						numeroDelIntercambioActual: objeto.numeroDelIntercambio,
						tipoDeMovimientoActual: objeto.tipoDeMovimiento
					});
				}
			}
		}

		const estilos = StyleSheet.create({
			contenedorPrincipal : {
				width : '100%',
				height : (anchoNativoInicial) * .4,
				overflow : 'hidden',
				//backgroundColor : 'green',
				zIndex : 1
			},
			contenedorSecundario :  (datosEspecificosS.modoEliminacion || datosEspecificosS.modoIntercambioDePosicion) ?
				{
					height : ((anchoNativoInicial) * .4) * .775,
					backgroundColor : 'rgba(218, 218, 218, 1)',
					borderRadius : 20,
					position : 'absolute',
					top : 0,
					right : '5%',
					zIndex : 2,
					borderWidth : 2,
					borderColor : '#111',
					overflow : 'hidden',
					width: '67.5%'
				}
			:
				{
					width : '90%',
					height : ((anchoNativoInicial) * .4) * .775,
					backgroundColor : 'rgba(218, 218, 218, 1)',
					borderRadius : 20,
					position : 'absolute',
					top : 0,
					right : '5%',
					zIndex : 2,
					borderWidth : 2,
					borderColor : '#111',
					overflow : 'hidden'
				},
			botonReproduccion : (datosEspecificosS.modoEliminacion || datosEspecificosS.modoIntercambioDePosicion) ?
				{
					//height : (((anchoNativoInicial) * .4) * .225) * 2,
					//width : (((anchoNativoInicial) * .4) * .225) * 2,
					height : (anchoNativoInicial) * .214,
					width : /*(anchoNativoInicial) * .214*/ ((anchoNativoInicial * .675) * .65) * .373134,
					zIndex : 4,
					backgroundColor : 'rgba(218, 218, 218, 1)',
					borderRadius  : 100,
					position : 'absolute',
					bottom : 0,
					//left : '39.3%',
					right: (anchoNativoInicial * .05) + (((anchoNativoInicial) * .675) * .025) + (((anchoNativoInicial) * .675) * .15) + (((anchoNativoInicial * .675) * .65) * .5) - ((((anchoNativoInicial * .675) * .65) * .373134) / 2) ,
					overflow : 'hidden',
					justifyContent : 'center',
					alignItems : 'center',
					borderWidth : 2,
				}
			:
				{
					//height : (((anchoNativoInicial) * .4) * .225) * 2,
					//width : (((anchoNativoInicial) * .4) * .225) * 2,
					height : (anchoNativoInicial) * .214,
					width : (anchoNativoInicial) * .214,
					zIndex : 4,
					backgroundColor : 'rgba(218, 218, 218, 1)',
					borderRadius  : 100,
					position : 'absolute',
					bottom : 0,
					left : '39.3%',
					overflow : 'hidden',
					justifyContent : 'center',
					alignItems : 'center',
					borderWidth : 2,
				},
			botonAdelantarOAtrasarXSegundos : (datosEspecificosS.modoEliminacion || datosEspecificosS.modoIntercambioDePosicion) ?
				{

					overflow : 'hidden',
					zIndex : 3,
					height : ((anchoNativoInicial) * .214) * .8,
					width : ((anchoNativoInicial) * .675) * .3,
					position : 'absolute',
					bottom : ((anchoNativoInicial) * .214) * .1,
					left : (anchoNativoInicial) - (anchoNativoInicial * .05) - ((anchoNativoInicial * .675) / 2),
					backgroundColor : 'rgba(218, 218, 218, 1)',
					borderWidth : 2,
					borderColor : '#111',
					borderRadius : 20,
					justifyContent : 'center',
					alignItems : 'center'
				}
			:
				{
					overflow : 'hidden',
					zIndex : 3,
					height : ((anchoNativoInicial) * .214) * .8,
					width : ((anchoNativoInicial) * .9) * .3,
					position : 'absolute',
					bottom : ((anchoNativoInicial) * .214) * .1,
					left : '50%',
					backgroundColor : 'rgba(218, 218, 218, 1)',
					borderWidth : 2,
					borderColor : '#111',
					borderRadius : 20,
					justifyContent : 'center',
					alignItems : 'center'
				},
			botonAjustes : (datosEspecificosS.modoEliminacion || datosEspecificosS.modoIntercambioDePosicion) ?
				{
					overflow : 'hidden',
					height : (((anchoNativoInicial) * .4) * .775) * .3,
					width : ((anchoNativoInicial) * .675) * .15,
					backgroundColor : 'rgba(218, 218, 218, 1)',

					position : 'absolute',
					left : ((anchoNativoInicial) * .675) * .025,
					bottom : (((anchoNativoInicial) * .4) * .775) * .1,
					borderWidth : 1,
					borderColor : '#111',
					borderRadius : 20,
					justifyContent : 'center',
					alignItems : 'center'
				}
			:
				{
					overflow : 'hidden',
					height : (((anchoNativoInicial) * .4) * .775) * .3,
					width : ((anchoNativoInicial) * .9) * .15,
					backgroundColor : 'rgba(218, 218, 218, 1)',

					position : 'absolute',
					left : ((anchoNativoInicial) * .9) * .025,
					bottom : (((anchoNativoInicial) * .4) * .775) * .1,
					borderWidth : 1,
					borderColor : '#111',
					borderRadius : 20,
					justifyContent : 'center',
					alignItems : 'center'
				},
			botonCerrar : (datosEspecificosS.modoEliminacion || datosEspecificosS.modoIntercambioDePosicion) ?
				{
					overflow : 'hidden',
					height : (((anchoNativoInicial) * .4) * .775) * .3,
					width : ((anchoNativoInicial) * .675) * .15,
					backgroundColor : 'rgba(218, 218, 218, 1)',
					position : 'absolute',
					right : ((anchoNativoInicial) * .675) * .025,
					bottom : (((anchoNativoInicial) * .4) * .775) * .1,
					borderWidth : 1,
					borderColor : 'red',
					borderRadius : 20,
					justifyContent : 'center',
					alignItems : 'center'
				}
			:
				{
					overflow : 'hidden',
					height : (((anchoNativoInicial) * .4) * .775) * .3,
					width : ((anchoNativoInicial) * .9) * .15,
					backgroundColor : 'rgba(218, 218, 218, 1)',
					position : 'absolute',
					right : ((anchoNativoInicial) * .9) * .025,
					bottom : (((anchoNativoInicial) * .4) * .775) * .1,
					borderWidth : 1,
					borderColor : 'red',
					borderRadius : 20,
					justifyContent : 'center',
					alignItems : 'center'
				},
		});

		/*VARIABLES NECESARIAS PARA LOS BOTONES...
		1.- botonAdelantarXSegundos
		2.- botonAtrasarXSegundos
		*/

		const timerDelBotonAdelantarOAtrasarXSegundos = useRef(null);
		const activarTimerDelBotonAdelantarOAtrasarXSegundos = () => {
			timerDelBotonAdelantarOAtrasarXSegundos.current = setTimeout(() => {
				datosDelComponenteR.current = {...datosDelComponenteR.current, permisoParaProgresarElSlider : true};
			}, 500);
		}
		const borrarTimerDelBotonAdelantarOAtrasarXSegundos = () => {
			if(timerDelBotonAdelantarOAtrasarXSegundos.current){
				//SI HAY UN TIMER QUE BORRAR, LO BORRAMOS
				clearTimeout(timerDelBotonAdelantarOAtrasarXSegundos.current);
			}

		}

		const adelantarXSegundos = () => {
			if(datosDelComponenteS.cargandoAudio === false){
				//datosDelComponenteR.current.referencia
				//SI LA REFERENCIA EXISTE, HACEMOS TODO LO DEMAS
				//SI EL AUDIO YA ESTA CARGADO, HACEMOS TODO LO DEMAS
				if(tiempoActual > (datosDelComponenteS.duracion - datosDelComponenteS.adelantoOAtraso)){
					//VOY A DIRIGIR EL VIDEO A DURACION FINAL, O DURACION
					/////////console.log('ESTE ES EL ULTIMO ADELANTO');

					//POR LO QUE PUDE COMPROBAR, IR A DURACION NO ES PERFECTO
					datosDelComponenteR.current.referencia.seek(datosDelComponenteS.duracion);


					modificarTiempoActual(datosDelComponenteS.duracion);



					//COMO ES EL ULTIMO AVANCE (DADO QUE YA SE ACABO EL VIDEO), PASAREMOS DE ESTADO2 A ESTADO3
					funciones.pasarDeEstado2A3();
				}
				else{
					//SUMO adelantoOAtraso
					datosDelComponenteR.current.referencia.seek( tiempoActual + datosDelComponenteS.adelantoOAtraso );


					modificarTiempoActual( tiempoActual + datosDelComponenteS.adelantoOAtraso );

				}
			}
		}

		const atrasarXSegundos = () => {
			if(datosDelComponenteS.cargandoAudio === false){
				//datosDelComponenteR.current.referencia
				//SI LA REFERENCIA EXISTE, HACEMOS TODO LO DEMAS
				//SI EL AUDIO YA ESTA CARGADO, HACEMOS TODO LO DEMAS
				if(tiempoActual < datosDelComponenteS.adelantoOAtraso){
					//VOY A DIRIGIR EL VIDEO A 0
					datosDelComponenteR.current.referencia.seek(0);

					modificarTiempoActual(0);

				}
				else{
					//RESTO adelantoOAtraso
					datosDelComponenteR.current.referencia.seek( tiempoActual - datosDelComponenteS.adelantoOAtraso );

					modificarTiempoActual( tiempoActual - datosDelComponenteS.adelantoOAtraso );

				}
			}
		}



		const funciones = {
			pasarDeEstado2A3 : () => {
				modificarDatosDelComponenteS({...datosDelComponenteS, reproduciendo : false, estado : 3});
			}
		}
		//http://backpack.sytes.net/servidorApp/ALMACENAMIENTO/MOCHILAS/MOCHILA_17419070110031/APARTADOPRIVADO/libreta1/hoja1/AUDIOS/Josh%20A%20-%20Pain%20(Lyrics)(MP3_160K)_1.mp3
		return(
		<View style={estilos.contenedorPrincipal}>
			<>
			{ (datosEspecificosS.modoEliminacion) ?
				<View style={{width: (anchoNativoInicial) * .275, height: (anchoNativoInicial * .6) * .35, position: 'absolute', left: 0 /*ESTA ES LA VARIABLE QUE VA A CAMBIAR*/, top: ( (((anchoNativoInicial) * .4) * .775) / 2 ) - ( ((anchoNativoInicial * .6) * .35) / 2 ), overflow: 'hidden', zIndex: -1}}>
					<View style={{width: (anchoNativoInicial) * .09, height: '100%', position: 'absolute', left: 0}}>
						<View style={{
							width: 0,
							height: 0,
							backgroundColor: 'transparent',
							borderStyle: 'solid',
							borderRightWidth: (anchoNativoInicial) * .09,
							borderBottomWidth: (anchoNativoInicial) * .105,
							borderRightColor: 'rgb(212,12,29)',
							borderBottomColor: 'transparent',
							position: 'absolute',
							left: 0,
							top: 0
						}}/>
						<View style={{
							width: 0,
							height: 0,
							backgroundColor: 'transparent',
							borderStyle: 'solid',
							borderRightWidth: (anchoNativoInicial) * .09,
							borderTopWidth: (anchoNativoInicial) * .105,
							borderRightColor: 'rgb(212,12,29)',
							borderTopColor: 'transparent',
							position: 'absolute',
							left: 0,
							bottom: 0
						}}/>
					</View>
					<View style={{width: (anchoNativoInicial) * 0.185, height: '100%', position: 'absolute', right: 0, backgroundColor: 'rgb(212,12,29)'}}>
						<View style={{width: '100%', height: '50%', position: 'absolute', left: 0, top: 0, alignItems: 'center', justifyContent: 'center'}}>
							<Icon8 name={"trashcan"} size={(anchoNativoInicial) * 0.085} color={'black'}/>
						</View>
						<View style={{width: '100%', height: '50%', position: 'absolute', left: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'}}>
							<CheckBox checked={datosDelComponenteS.checkedDelCheckBoxModoEliminacion} onPress={eventos.checkBoxDelModoEliminacion} size={(anchoNativoInicial) * 0.085}/>
						</View>
					</View>
				</View>
			:	(datosEspecificosS.modoIntercambioDePosicion) ?
				<View style={{width: (anchoNativoInicial) * .275, height: (anchoNativoInicial * .6) * .35, position: 'absolute', left: 0 /*ESTA ES LA VARIABLE QUE VA A CAMBIAR*/, top: ( (((anchoNativoInicial) * .4) * .775) / 2 ) - ( ((anchoNativoInicial * .6) * .35) / 2 ), overflow: 'hidden', zIndex: -1}}>
					<View style={{width: (anchoNativoInicial) * .09, height: '100%', position: 'absolute', left: 0}}>
						<View style={{
							width: 0,
							height: 0,
							backgroundColor: 'transparent',
							borderStyle: 'solid',
							borderRightWidth: (anchoNativoInicial) * .09,
							borderBottomWidth: (anchoNativoInicial) * .105,
							borderRightColor: 'rgb(255, 201, 14)',
							borderBottomColor: 'transparent',
							position: 'absolute',
							left: 0,
							top: 0
						}}/>
						<View style={{
							width: 0,
							height: 0,
							backgroundColor: 'transparent',
							borderStyle: 'solid',
							borderRightWidth: (anchoNativoInicial) * .09,
							borderTopWidth: (anchoNativoInicial) * .105,
							borderRightColor: 'rgb(255, 201, 14)',
							borderTopColor: 'transparent',
							position: 'absolute',
							left: 0,
							bottom: 0
						}}/>
					</View>
					<View style={{width: (anchoNativoInicial) * 0.185, height: '100%', position: 'absolute', right: 0, backgroundColor: 'rgb(255, 201, 14)'}}>
						<View style={(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion) ? {width: '100%', height: '50%', position: 'absolute', left: 0, top: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'} : {width: '100%', height: '50%', position: 'absolute', left: 0, top: 0, alignItems: 'center', justifyContent: 'center'}}>
							{(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion) ?
								<>
									<Text style={{fontSize: (((anchoNativoInicial * .6) * .35) * .5) * .45, textAlign: 'center', fontWeight: 'bold'}} >{datosDelComponenteS.numeroDelIntercambioActual + '°'}</Text>
									{(datosDelComponenteS.tipoDeMovimientoActual === "Inicial") ?
										<Icon9 name={"long-arrow-up"} size={((anchoNativoInicial) * 0.085) * .8} color={'black'}/>
									: (datosDelComponenteS.tipoDeMovimientoActual === "Final") ?
										<Icon9 name={"long-arrow-down"} size={((anchoNativoInicial) * 0.085) * .8} color={'black'}/>
									:
										null
									}
								</>
							:
								<Icon9 name={"exchange"} size={((anchoNativoInicial) * 0.085) * .8} color={'black'} style={{transform: [{rotate: '90deg'}]}}/>
							}
						</View>
						<View style={{width: '100%', height: '50%', position: 'absolute', left: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'}}>
							<CheckBox checked={datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion} onPress={eventos.checkBoxDelModoIntercambioDePosicion} size={(anchoNativoInicial) * 0.085}/>
						</View>
					</View>
				</View>
			:
				null
			}
			</>

			<>
			{/*TODO ESTO TIENE QUE VER CON LOS CONTROLES PRINCIPALES DEL COMPONENTE DE AUDIO*/}
			<View style={estilos.contenedorSecundario}>
				<View style={{ width : '100%' , height : '50%' , position : 'absolute', top : 0 , }}>

					<View style={{ width :  '100%' , height : '50%' , justifyContent : 'flex-start' , flexDirection : 'row'}}>
						<Text style={{position : 'absolute' , left : '1%', bottom : 0}}>
							{(datosDelComponenteS.estado === 1) ?
								'00:00:00 / 00:00:00'
							:
								<>
									{(datosDelComponenteS.cargandoAudio) ?
										'00:00:00 / 00:00:00'
									:
										(RetornarSegundosEnFormatoHHMMSS( tiempoActual )) + ' / ' + (RetornarSegundosEnFormatoHHMMSS( datosDelComponenteS.duracion ))
									}
								</>
							}
						</Text>

						<Text style={{position : 'absolute' , right : '1%', bottom : 0}}>
							{(datosDelComponenteS.estado === 1) ?
								'00:00:00'
							:
								<>
									{(datosDelComponenteS.cargandoAudio) ?
										'00:00:00'
									:
										'' + ( RetornarSegundosEnFormatoHHMMSS( (datosDelComponenteS.duracion) - tiempoActual ) )
									}
								</>
							}
						</Text>
					</View>

					<View style={{ width :  '100%' , height : '50%', justifyContent : 'center', alignItems : 'center'}}>
						<Slider onSlidingStart={eventos.onSlidingStartSlider} onSlidingComplete={eventos.onSlidingCompleteSlider} onValueChange={eventos.onValueChangeSlider} disabled={datosDelComponenteS.deshabilitacionDelSlider} style={{width : '90%'}} maximumTrackTintColor={'rgba(100,100,100,0.3)'} minimumTrackTintColor={'#111'} thumbTintColor={'#27ae60'} thumbStyle={{width: 16, height : 16}} value={tiempoActual / datosDelComponenteS.duracion}/>
					</View>




				</View>

				<View style={estilos.botonAjustes}>
					<TouchableNativeFeedback>
						<View style={{width : '100%', height : '100%', justifyContent : 'center', alignItems : 'center'}}>
							<Icon7 name={'md-settings'} size={((((anchoNativoInicial) * .4) * .775) * .3) * .7} color={'#2980b9'} />
						</View>
					</TouchableNativeFeedback>
				</View>

				{ (datosDelComponenteS.estado === 2 || datosDelComponenteS.estado === 3) ?
					<View style={estilos.botonCerrar}>
						<TouchableNativeFeedback onPress={eventos.botonCerrar}>
							<View style={{width : '100%' , height : '100%' , justifyContent : 'center' , alignItems : 'center'}}>
								<Icon1 name={"window-close"} size={((((anchoNativoInicial) * .4) * .775) * .3) * .7} color={'red'}/>
							</View>
						</TouchableNativeFeedback>
					</View>
				:
					null
				}

				<>
					{ (datosDelComponenteS.estado === 2 || datosDelComponenteS.estado === 3) ?
						<Video onEnd={funciones.pasarDeEstado2A3} ref={(r) => { datosDelComponenteR.current = {...datosDelComponenteR.current, referencia : r}; }} source={{uri: "" + props.urlDeAudio}} onLoad={eventos.onLoadAudio} paused={!(datosDelComponenteS.reproduciendo)} onProgress={eventos.onProgressAudio} />
					:
						null
					}
				</>
			</View>

			<View style={[estilos.botonReproduccion,{ borderColor : (datosDelComponenteS.estado === 3 || datosDelComponenteS.cargandoAudio) ? '#d35400' : (datosDelComponenteS.reproduciendo) ? '#2980b9' : (datosDelComponenteS.reproduciendo === false) ? '#6c5ce7' : 'black'}]}>
				{(datosDelComponenteS.cargandoAudio) ?
					<ActivityIndicator size={'large'} color={'#111'} />
				:
					<TouchableNativeFeedback onPress={eventos.botonReproduccion}>
						<View style={{height : '100%', width : '100%', alignItems : 'center', justifyContent : 'center'}}>
							{(datosDelComponenteS.estado === 2 || datosDelComponenteS.estado === 1) ?
								<>
									{(datosDelComponenteS.reproduciendo) ?
										<Icon1 name={"pause"} size={((anchoNativoInicial) * .214) * .7} color={'#2980b9'}/>
									:
										<Icon1 name={"play"} size={((anchoNativoInicial) * .214) * .7} color={'#6c5ce7'}/>
									}
								</>
							: (datosDelComponenteS.estado === 3) ?
								<Icon1 name={"restart"} size={((anchoNativoInicial) * .214) * .7} color={'#111'}/>
							:
								null
							}
						</View>
					</TouchableNativeFeedback>
				}
			</View>

			<View style={[estilos.botonAdelantarOAtrasarXSegundos]}>
				<TouchableNativeFeedback onPress={eventos.botonAdelantarXSegundos}>
					<View style={{width : '100%' , height : '100%', justifyContent : 'center' , alignItems : 'center'}}>
						<Icon1 name={"fast-forward"} size={(((anchoNativoInicial) * .214) * .8) * .7} color={'#2980b9'} style={{position : 'absolute' , right : 0}}/>
					</View>
				</TouchableNativeFeedback>
			</View>


			<View style={[estilos.botonAdelantarOAtrasarXSegundos,{left : (datosEspecificosS.modoEliminacion || datosEspecificosS.modoIntercambioDePosicion) ? (((anchoNativoInicial) - (anchoNativoInicial * .05) - ((anchoNativoInicial * .675) / 2)) - (((anchoNativoInicial) * .675) * .3)) : ((anchoNativoInicial * .5) - (((anchoNativoInicial) * .9) * .3))}]}>
				<TouchableNativeFeedback onPress={eventos.botonAtrasarXSegundos}>
					<View style={{width : '100%' , height : '100%', justifyContent : 'center' , alignItems : 'center'}}>
						<Icon2 name={"fast-rewind"} size={(((anchoNativoInicial) * .214) * .8) * .7} color={'#2980b9'} style={{position : 'absolute', left : 0}}/>
					</View>
				</TouchableNativeFeedback>
			</View>


			</>

		</View>
		);
	}

	//ESTE COMPONENTE DE TEXTO EN apartadoPrivado TIENE QUE SER FORSOZAMENTE TANTO DE LECTURA COMO DE EDICION
	//EDICION: Tiene una cajita naranja con el lapiz de EDITAR, y los banderines de MODO ELIMINACION y MODO INTERCAMBIO DE POSICION
	//LECTURA: Texto plano
	const ComponenteDeTexto = (props) => {
		const [datosDelComponenteS, modificarDatosDelComponenteS] = useState({
			contenidoInicial: props.contenido,
			contenidoCambiante: props.contenido,
			alturaActualDelTexto: (anchoNativoInicial) * .23,
			editable: false,
 			checkedDelCheckBoxModoEliminacion: false,
			checkedDelCheckBoxModoIntercambioDePosicion: false,

			//VARIABLES NECESARIAS PARA EL INTERCAMBIO DE POSICION
			numeroDelIntercambioActual: null,
			tipoDeMovimientoActual: null,

			estadoSubiendoContenidoNuevo: false,
		});

		const datosDelComponenteR = useRef({
			alturaInicialDelTexto: (anchoNativoInicial) * .23,
		});

		const eventos = {
			botonEditar : async () => {
				if(datosDelComponenteS.editable){
					//ES TRUE, PASAREMOS A MODO LECTURA

					if(datosDelComponenteS.contenidoCambiante !== datosDelComponenteS.contenidoInicial){
						modificarDatosDelComponenteS({
							...datosDelComponenteS,
							estadoSubiendoContenidoNuevo: true
						});

						//1.- Guardar en MySQL
						let objetoConInformacion = {
							eleccionIdDeLibreta: variablesDentroDeMochila.eleccionIdDeLibreta,
							eleccionIdDeHoja: variablesDentroDeMochila.eleccionIdDeHoja,
							matricula: variablesDentroDeMochila.matriculaDelPropietario,
							ordenDelComponente: props.orden,
							contenidoNuevo: datosDelComponenteS.contenidoCambiante
						};
						let json = JSON.stringify(objetoConInformacion);
						let datos = new FormData();
						datos.append('indice', json);
						let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/accionesEnApartados/actualizar/actualizarComponenteDeTextoEnHojaDeLibreta.php',{
							method: 'POST',
							body: datos
						})
						.then((mensaje) => mensaje.text())
						.then((respuesta) => {
							//2.- Guardar en JavaScript
							if(respuesta === "Exito"){
								eventosEspecificos.agregarUnaTareaPendienteAlArreglo(props.orden, datosDelComponenteS.contenidoCambiante);

								modificarDatosDelComponenteS({
									...datosDelComponenteS,
									editable: false,
									contenidoInicial: datosDelComponenteS.contenidoCambiante,
									estadoSubiendoContenidoNuevo: false
								});
							}
							else{
								//NUNCA ENTRARA AQUI
								ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
  								console.log("error linea : 3430")
							}
						})
						.catch((error) => {
							ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
  							console.log("error linea : ",error)
						});

					}
					else{
						modificarDatosDelComponenteS({...datosDelComponenteS, editable: false});
					}

				}
				else{
					//ES FALSE, PASAREMOS A EDICION
					modificarDatosDelComponenteS({...datosDelComponenteS, editable: true});
				}


			},
			checkBoxDelModoEliminacion: () => {
				if(datosDelComponenteS.checkedDelCheckBoxModoEliminacion){
					//PASARA A FALSE
					let indiceDeEliminacion = (datosEspecificosR.current.arregloDeComponentesAEliminarse).indexOf(props.orden);

					if(indiceDeEliminacion != (-1)){
						//SI HAY NUMERITO QUE ELIMINAR
						(datosEspecificosR.current.arregloDeComponentesAEliminarse).splice(indiceDeEliminacion, 1);
					}
				}
				else{
					//PASARA A TRUE
					(datosEspecificosR.current.arregloDeComponentesAEliminarse).push(props.orden);
				}

				modificarDatosDelComponenteS({...datosDelComponenteS, checkedDelCheckBoxModoEliminacion: !(datosDelComponenteS.checkedDelCheckBoxModoEliminacion)});
			},
			checkBoxDelModoIntercambioDePosicion: () => {
				if(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion){
					//PASARA A FALSE
					let mensaje = eventosEspecificos.eliminarComponenteOPosicionDelArreglo(props.orden);

					if(mensaje === "Exito"){
						//SIEMPRE ENTRARA AQUI
						modificarDatosDelComponenteS({
							...datosDelComponenteS,
							checkedDelCheckBoxModoIntercambioDePosicion: !(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion),
							numeroDelIntercambioActual: null,
							tipoDeMovimientoActual: null
						});
					}
				}
				else{
					//PASARA A TRUE

					//AGREGAR EL COMPONENTE A datosEspecificosR.current.arregloDeComponentesAIntercambiarse
					//AQUI TE QUEDASTE ALONSOOOOOOOOOOOOOOOOOOOOOOOO TE DORMIRAS PRONTO CUANDO TERMINES ESTO

					let objeto = eventosEspecificos.agregarComponenteOPosicionAlArreglo(props.orden);

					modificarDatosDelComponenteS({
						...datosDelComponenteS,
						checkedDelCheckBoxModoIntercambioDePosicion: !(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion),
						numeroDelIntercambioActual: objeto.numeroDelIntercambio,
						tipoDeMovimientoActual: objeto.tipoDeMovimiento
					});
				}
			},

		}

		const estilos = StyleSheet.create({
			contenedorPrincipal: {
				width: '100%',
				//height: ((anchoNativoInicial) * .23) + (((anchoNativoInicial / 6) * .7) * .7),
				overflow: 'hidden',
				backgroundColor: 'transparent',
				flexDirection: 'column'
			},
			botonEditar: {
				width: anchoNativoInicial / 6,
				height: '100%' ,
				backgroundColor: 'rgb(255,255,141)',
				position: 'absolute',
				right: '2.5%',
				top: 0,
				borderTopLeftRadius: 5,
				borderTopRightRadius: 5,
				overflow: 'hidden',
				justifyContent: 'center',
				alignItems: 'center',
				borderLeftWidth: 2,
				borderRightWidth: 2,
				borderTopWidth: 2
			},
			contenedorDeLosBotonesDeEdicion: {
				width: '100%',
				height: ((anchoNativoInicial / 6) * .7) * .7,

			},
			contenedorDelTexto: {
				width: '100%',
				flexDirection: 'row-reverse'
			},
			texto:	(datosEspecificosS.modoEliminacion || datosEspecificosS.modoIntercambioDePosicion)	?
				{
					height: datosDelComponenteS.alturaActualDelTexto,
					width: '70%',
					backgroundColor: 'rgb(255,255,141)',
					//position: 'absolute',
					//right: '2.5%',
					borderRadius: 5,
					borderWidth: 1,
					borderTopRightRadius: 0
				}
			:
				{
					height: datosDelComponenteS.alturaActualDelTexto,
					width: '95%',
					backgroundColor: 'rgb(255,255,141)',
					//position: 'absolute',
					//right: 0,
					borderRadius: 5,
					borderWidth: 1,
					borderTopRightRadius: 0
				},
		});


		return(
			<View style={estilos.contenedorPrincipal}>
				<View style={estilos.contenedorDeLosBotonesDeEdicion}>
					<View style={estilos.botonEditar}>
						{(datosDelComponenteS.estadoSubiendoContenidoNuevo) ?
							<View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
								<Icon1 name={'progress-upload'} size={(((anchoNativoInicial / 6) * .7) * .7) * .8} color={'black'}/>
							</View>
						:
							<TouchableOpacity onPress={eventos.botonEditar} style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
								{(datosDelComponenteS.editable) ?
									<Icon8 name={'check'} color={'black'} size={(((anchoNativoInicial / 6) * .7) * .7) * .8}/>
								:
									<Icon10 name={'pencil'} size={(((anchoNativoInicial / 6) * .7) * .7) * .8} color={'black'}/>
								}
							</TouchableOpacity>
						}
					</View>
				</View>

				<View style={estilos.contenedorDelTexto}>
					<>
						{(datosEspecificosS.modoEliminacion) ?
							<View style={{width: (anchoNativoInicial) * .275, height: (anchoNativoInicial * .6) * .35, position: 'absolute', right: 0 /*ESTA ES LA VARIABLE QUE VA A CAMBIAR*/, top: ((datosDelComponenteS.alturaActualDelTexto) / 2) - ( ((anchoNativoInicial * .6) * .35) / 2) , overflow: 'hidden', zIndex: -1}}>
								<View style={{width: (anchoNativoInicial) * .09, height: '100%', position: 'absolute', left: 0}}>
									<View style={{
										width: 0,
										height: 0,
										backgroundColor: 'transparent',
										borderStyle: 'solid',
										borderRightWidth: (anchoNativoInicial) * .09,
										borderBottomWidth: (anchoNativoInicial) * .105,
										borderRightColor: 'rgb(212,12,29)',
										borderBottomColor: 'transparent',
										position: 'absolute',
										left: 0,
										top: 0
									}}/>
									<View style={{
										width: 0,
										height: 0,
										backgroundColor: 'transparent',
										borderStyle: 'solid',
										borderRightWidth: (anchoNativoInicial) * .09,
										borderTopWidth: (anchoNativoInicial) * .105,
										borderRightColor: 'rgb(212,12,29)',
										borderTopColor: 'transparent',
										position: 'absolute',
										left: 0,
										bottom: 0
									}}/>
								</View>
								<View style={{width: (anchoNativoInicial) * 0.185, height: '100%', position: 'absolute', right: 0, backgroundColor: 'rgb(212,12,29)'}}>
									<View style={{width: '100%', height: '50%', position: 'absolute', left: 0, top: 0, alignItems: 'center', justifyContent: 'center'}}>
										<Icon8 name={"trashcan"} size={(anchoNativoInicial) * 0.085} color={'black'}/>
									</View>
									<View style={{width: '100%', height: '50%', position: 'absolute', left: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'}}>
										<CheckBox checked={datosDelComponenteS.checkedDelCheckBoxModoEliminacion} onPress={eventos.checkBoxDelModoEliminacion}
											size={(anchoNativoInicial) * 0.085}
										/>
									</View>
								</View>
							</View>
						: (datosEspecificosS.modoIntercambioDePosicion) ?
							<View style={{width: (anchoNativoInicial) * .275, height: (anchoNativoInicial * .6) * .35, position: 'absolute', right: 0 /*ESTA ES LA VARIABLE QUE VA A CAMBIAR*/, top: ((datosDelComponenteS.alturaActualDelTexto) / 2) - ( ((anchoNativoInicial * .6) * .35) / 2) , overflow: 'hidden', zIndex: -1}}>
								<View style={{width: (anchoNativoInicial) * .09, height: '100%', position: 'absolute', left: 0}}>
									<View style={{
										width: 0,
										height: 0,
										backgroundColor: 'transparent',
										borderStyle: 'solid',
										borderRightWidth: (anchoNativoInicial) * .09,
										borderBottomWidth: (anchoNativoInicial) * .105,
										borderRightColor: 'rgb(255, 201, 14)',
										borderBottomColor: 'transparent',
										position: 'absolute',
										left: 0,
										top: 0
									}}/>
									<View style={{
										width: 0,
										height: 0,
										backgroundColor: 'transparent',
										borderStyle: 'solid',
										borderRightWidth: (anchoNativoInicial) * .09,
										borderTopWidth: (anchoNativoInicial) * .105,
										borderRightColor: 'rgb(255, 201, 14)',
										borderTopColor: 'transparent',
										position: 'absolute',
										left: 0,
										bottom: 0
									}}/>
								</View>
								<View style={{width: (anchoNativoInicial) * 0.185, height: '100%', position: 'absolute', right: 0, backgroundColor: 'rgb(255, 201, 14)'}}>
									<View style={(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion) ? {width: '100%', height: '50%', position: 'absolute', left: 0, top: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'} : {width: '100%', height: '50%', position: 'absolute', left: 0, top: 0, alignItems: 'center', justifyContent: 'center'}}>
										{(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion) ?
											<>
												<Text style={{fontSize: (((anchoNativoInicial * .6) * .35) * .5) * .45, textAlign: 'center', fontWeight: 'bold'}} >{datosDelComponenteS.numeroDelIntercambioActual + '°'}</Text>
													{(datosDelComponenteS.tipoDeMovimientoActual === "Inicial") ?
														<Icon9 name={"long-arrow-up"} size={((anchoNativoInicial) * 0.085) * .8} color={'black'}/>
													: (datosDelComponenteS.tipoDeMovimientoActual === "Final") ?
														<Icon9 name={"long-arrow-down"} size={((anchoNativoInicial) * 0.085) * .8} color={'black'}/>
													:
														null
													}
											</>
										:
											<Icon9 name={"exchange"} size={((anchoNativoInicial) * 0.085) * .8} color={'black'} style={{transform: [{rotate: '90deg'}]}}/>
										}
									</View>
									<View style={{width: '100%', height: '50%', position: 'absolute', left: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'}}>
										<CheckBox checked={datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion} onPress={eventos.checkBoxDelModoIntercambioDePosicion} size={(anchoNativoInicial) * 0.085}
										/>
									</View>
								</View>
							</View>
						:
							null
						}
					</>

					<View style={{height: '100%', width: '2.5%'}}/>
					<View style={estilos.texto}>
						<TextInput
							editable={datosDelComponenteS.editable}
							multiline={true}
							value={datosDelComponenteS.contenidoCambiante}
							onChangeText={(valor) => {
								modificarDatosDelComponenteS({...datosDelComponenteS, contenidoCambiante: valor});
							}}
							onContentSizeChange={(e) => {
									//console.log('INFORMACION DEL onContentSizeChange = ', e.nativeEvent.contentSize.height);

									if(e.nativeEvent.contentSize.height > datosDelComponenteR.current.alturaInicialDelTexto){
										modificarDatosDelComponenteS({...datosDelComponenteS, alturaActualDelTexto: e.nativeEvent.contentSize.height});
									}
									else{
										modificarDatosDelComponenteS({...datosDelComponenteS, alturaActualDelTexto: datosDelComponenteR.current.alturaInicialDelTexto});
									}
							}}
							style={{color: 'black'}}
							placeholder={'Escribe texto aquí...'}
						/>
					</View>
				</View>
			</View>
		);
	}

	//ESTE COMPONENTE QUE CREO ANGEL, SUPUESTAMENTE SOLO ES DE LECTURA
	const ComponenteDeImagen = (props)=> {
	const [ModalVisible, setModalVisible] = useState(false);

	const [datosDelComponenteS, modificarDatosDelComponenteS] = useState({
		checkedDelCheckBoxModoEliminacion: false,
		checkedDelCheckBoxModoIntercambioDePosicion: false,

		//VARIABLES NECESARIAS PARA EL INTERCAMBIO DE POSICION
		numeroDelIntercambioActual: null,
		tipoDeMovimientoActual: null
	});

	const estilos = StyleSheet.create({
		contenedorPrincipal : {
			width: '100%',
			height: 250,
			flexDirection: 'row',

		},
		contenedorSecundario: (datosEspecificosS.modoEliminacion || datosEspecificosS.modoIntercambioDePosicion) ?
			{
				height: '100%',
				flexDirection: 'row',
				width: '70%',
				position: 'absolute',
				right: '2.5%',
				backgroundColor: '#c8d6e5'
			}
		:
			{
				width: '100%',
				height: '100%',
				flexDirection: 'row',
				backgroundColor: '#c8d6e5'
			},
	});

	const eventos = {
		checkBoxDelModoEliminacion: () => {
			if(datosDelComponenteS.checkedDelCheckBoxModoEliminacion){
				//PASARA A FALSE
				let indiceDeEliminacion = (datosEspecificosR.current.arregloDeComponentesAEliminarse).indexOf(props.orden);

				if(indiceDeEliminacion != (-1)){
					//SI HAY NUMERITO QUE ELIMINAR
					(datosEspecificosR.current.arregloDeComponentesAEliminarse).splice(indiceDeEliminacion, 1);
				}
			}
			else{
				//PASARA A TRUE
				(datosEspecificosR.current.arregloDeComponentesAEliminarse).push(props.orden);
			}

			modificarDatosDelComponenteS({...datosDelComponenteS, checkedDelCheckBoxModoEliminacion: !(datosDelComponenteS.checkedDelCheckBoxModoEliminacion)});
		},
		checkBoxDelModoIntercambioDePosicion: () => {
			if(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion){
				//PASARA A FALSE
				let mensaje = eventosEspecificos.eliminarComponenteOPosicionDelArreglo(props.orden);

				if(mensaje === "Exito"){
					//SIEMPRE ENTRARA AQUI
					modificarDatosDelComponenteS({
						...datosDelComponenteS,
						checkedDelCheckBoxModoIntercambioDePosicion: !(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion),
						numeroDelIntercambioActual: null,
						tipoDeMovimientoActual: null
					});
				}
			}
			else{
				//PASARA A TRUE

				//AGREGAR EL COMPONENTE A datosEspecificosR.current.arregloDeComponentesAIntercambiarse
				//AQUI TE QUEDASTE ALONSOOOOOOOOOOOOOOOOOOOOOOOO TE DORMIRAS PRONTO CUANDO TERMINES ESTO

				let objeto = eventosEspecificos.agregarComponenteOPosicionAlArreglo(props.orden);

				modificarDatosDelComponenteS({
					...datosDelComponenteS,
					checkedDelCheckBoxModoIntercambioDePosicion: !(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion),
					numeroDelIntercambioActual: objeto.numeroDelIntercambio,
					tipoDeMovimientoActual: objeto.tipoDeMovimiento
				});
			}
		}
	}

  return(
	<>
		<View style={estilos.contenedorPrincipal}>
			{(datosEspecificosS.modoEliminacion) ?
				<View style={{width: (anchoNativoInicial) * .275, height: (anchoNativoInicial * .6) * .35, position: 'absolute', left: 0 /*ESTA ES LA VARIABLE QUE VA A CAMBIAR*/, top: (250 / 2) - (((anchoNativoInicial * .6) * .35) / 2), overflow: 'hidden', zIndex: -1}}>
					<View style={{width: (anchoNativoInicial) * .09, height: '100%', position: 'absolute', left: 0}}>
						<View style={{
							width: 0,
							height: 0,
							backgroundColor: 'transparent',
							borderStyle: 'solid',
							borderRightWidth: (anchoNativoInicial) * .09,
							borderBottomWidth: (anchoNativoInicial) * .105,
							borderRightColor: 'rgb(212,12,29)',
							borderBottomColor: 'transparent',
							position: 'absolute',
							left: 0,
							top: 0
						}}/>
						<View style={{
							width: 0,
							height: 0,
							backgroundColor: 'transparent',
							borderStyle: 'solid',
							borderRightWidth: (anchoNativoInicial) * .09,
							borderTopWidth: (anchoNativoInicial) * .105,
							borderRightColor: 'rgb(212,12,29)',
							borderTopColor: 'transparent',
							position: 'absolute',
							left: 0,
							bottom: 0
						}}/>
					</View>
					<View style={{width: (anchoNativoInicial) * 0.185, height: '100%', position: 'absolute', right: 0, backgroundColor: 'rgb(212,12,29)'}}>
						<View style={{width: '100%', height: '50%', position: 'absolute', left: 0, top: 0, alignItems: 'center', justifyContent: 'center'}}>
							<Icon8 name={"trashcan"} size={(anchoNativoInicial) * 0.085} color={'black'}/>
						</View>
						<View style={{width: '100%', height: '50%', position: 'absolute', left: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'}}>
							<CheckBox checked={datosDelComponenteS.checkedDelCheckBoxModoEliminacion} onPress={eventos.checkBoxDelModoEliminacion} size={(anchoNativoInicial) * 0.085}/>
						</View>
					</View>
				</View>
			:	(datosEspecificosS.modoIntercambioDePosicion) ?
				<View style={{width: (anchoNativoInicial) * .275, height: (anchoNativoInicial * .6) * .35, position: 'absolute', left: 0 /*ESTA ES LA VARIABLE QUE VA A CAMBIAR*/, top: (250 / 2) - (((anchoNativoInicial * .6) * .35) / 2), overflow: 'hidden', zIndex: -1}}>
					<View style={{width: (anchoNativoInicial) * .09, height: '100%', position: 'absolute', left: 0}}>
						<View style={{
							width: 0,
							height: 0,
							backgroundColor: 'transparent',
							borderStyle: 'solid',
							borderRightWidth: (anchoNativoInicial) * .09,
							borderBottomWidth: (anchoNativoInicial) * .105,
							borderRightColor: 'rgb(255, 201, 14)',
							borderBottomColor: 'transparent',
							position: 'absolute',
							left: 0,
							top: 0
						}}/>
						<View style={{
							width: 0,
							height: 0,
							backgroundColor: 'transparent',
							borderStyle: 'solid',
							borderRightWidth: (anchoNativoInicial) * .09,
							borderTopWidth: (anchoNativoInicial) * .105,
							borderRightColor: 'rgb(255, 201, 14)',
							borderTopColor: 'transparent',
							position: 'absolute',
							left: 0,
							bottom: 0
						}}/>
					</View>
					<View style={{width: (anchoNativoInicial) * 0.185, height: '100%', position: 'absolute', right: 0, backgroundColor: 'rgb(255, 201, 14)'}}>
						<View style={(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion) ? {width: '100%', height: '50%', position: 'absolute', left: 0, top: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'} : {width: '100%', height: '50%', position: 'absolute', left: 0, top: 0, alignItems: 'center', justifyContent: 'center'}}>
							{(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion) ?
								<>
									<Text style={{fontSize: (((anchoNativoInicial * .6) * .35) * .5) * .45, textAlign: 'center', fontWeight: 'bold'}} >{datosDelComponenteS.numeroDelIntercambioActual + '°'}</Text>
									{(datosDelComponenteS.tipoDeMovimientoActual === "Inicial") ?
										<Icon9 name={"long-arrow-up"} size={((anchoNativoInicial) * 0.085) * .8} color={'black'}/>
									: (datosDelComponenteS.tipoDeMovimientoActual === "Final") ?
										<Icon9 name={"long-arrow-down"} size={((anchoNativoInicial) * 0.085) * .8} color={'black'}/>
									:
										null
									}
								</>
							:
								<Icon9 name={"exchange"} size={((anchoNativoInicial) * 0.085) * .8} color={'black'} style={{transform: [{rotate: '90deg'}]}}/>
							}
						</View>
						<View style={{width: '100%', height: '50%', position: 'absolute', left: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'}}>
							<CheckBox checked={datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion} onPress={eventos.checkBoxDelModoIntercambioDePosicion} size={(anchoNativoInicial) * 0.085}/>
						</View>
					</View>
				</View>
			:
				null
			}

			<View style={estilos.contenedorSecundario}>
				<TouchableWithoutFeedback onPress={()=>setModalVisible(true)} style={{flex:1}}>
					<Image source={{uri:props.urlDeImagen}} style={{flex:1,alignSelf:"stretch"}} resizeMode="contain"/>
				</TouchableWithoutFeedback>
			</View>

			<Modal style={{flex:1}} visible={ModalVisible} onRequestClose={()=>setModalVisible(false)} transparent={false} animationType={"fade"}>
				<View  style={{flex:1, justifyContent:"center",flexDirection:"column"}}>

					<ImageViewer imageUrls={[{url: props.urlDeImagen}]}
						renderIndicator={()=>null}
						renderHeader={()=>(
							<View style={{width:"90%",height:50,justifyContent:"flex-start",flexDirection:"row",alignItems:"center",alignSelf:"center"}}>
								<Icon type="material" name="arrow-back" size={24} color="#52575D" onPress={()=>setModalVisible(false)}/>
							</View>
						)}
					/>
				</View>
			</Modal>
		</View>
	</>
    );
	}

	const ConjuntoDeComponentes = () => {
		//CONJUNTO DE TODOS LOS TIPOS DE COMPONENTES (IMAGENES, VIDEOS, AUDIOS, Y TEXTOS)
		//OBVIAMENTE, YA DEBEN DE ESTAR ORDENADOS ADECUADAMENTE

		//COMO AUN NO TENGO TODOS LOS TIPOS DE COMPONENTES, SOLO RETORNARE ALGO DE PRUEBA
		//PRUEBA1 : RECUERDA MODIFICAR ESTO
		/*
		return(
		<>
		<ComponenteDeVideo urlDeVideo={'http://backpack.sytes.net/KINGSMAN.mp4'} urlDeMiniatura={urlDelServidor + '/mrrobot.jpg'}/>
		<View style={{height : 20, width : '100%'}}>
		</View>
		<ComponenteDeAudio urlDeAudio={'http://backpack.sytes.net/servidorApp/ALMACENAMIENTO/MOCHILAS/MOCHILA_17419070110031/APARTADOPRIVADO/libreta1/hoja1/AUDIOS/I%20Wanna%20Be%20Yours(M4A_128K)_1.m4a'}/>
		<View style={{height : 20, width : '100%'}}>
		</View>
		<ComponenteDeAudio urlDeAudio={'http://backpack.sytes.net/servidorApp/ALMACENAMIENTO/MOCHILAS/MOCHILA_17419070110031/APARTADOPRIVADO/libreta1/hoja1/AUDIOS/I%20Wanna%20Be%20Yours(M4A_128K)_1.m4a'}/>
		<View style={{height : 20, width : '100%'}}>
		</View>
		<ComponenteDeVideo urlDeVideo={'http://backpack.sytes.net/KINGSMAN.mp4'} urlDeMiniatura={urlDelServidor + '/mrrobot.jpg'}/>
		<View style={{height : 20, width : '100%'}}>
		</View>
		<ComponenteDeVideo urlDeVideo={'http://backpack.sytes.net/KINGSMAN.mp4'} urlDeMiniatura={urlDelServidor + '/mrrobot.jpg'}/>
		<View style={{height : 20, width : '100%'}}>
		</View>
		<ComponenteDeImagen urlDeImagen={ 'http://backpack.sytes.net/mrrobot.jpg'}/>
		</>
		);
		*/

		/*
		return(
			<>
				<ComponenteDeTexto />
				<View style={{width: '100%', height: 20, backgroundColor: 'red'}}/>
			</>
		);
		*/

		return(
			<FlatList
				data={datosEspecificosS.datosDeComponentes}
				keyExtractor={(item)=>item.orden}
                ListHeaderComponent={()=>(<SeparadorInicio />)}
                ItemSeparatorComponent={({leadingItem})=>(<SeparadorDebajoDe ordenDeArriba={leadingItem.orden} />)}
                ListFooterComponent={()=>(<SeparadorFin />)}
                ListEmptyComponent={
                    ()=>(
						<View style={{width:"80%",padding:10,justifyContent:"center",alignSelf:"center",alignItems:"center",backgroundColor:"#111",borderRadius:10}}>
							<Text style={{textAlign:"center",color:"#fff",fontSize:16,fontFamily: "Viga-Regular"}}>Aún no Cuenta Con Componentes.</Text>
						</View>
                      )
                }
                renderItem={
					({item})=>{
						return(
						<>{(item.tipo === 'VIDEO') ?
							<ComponenteDeVideo urlDeVideo={item.contenido} urlDeMiniatura={null} orden={item.orden}/>
						: (item.tipo === 'IMAGEN') ?
							<ComponenteDeImagen urlDeImagen={item.contenido} orden={item.orden}/>
						: (item.tipo === 'AUDIO') ?
							<ComponenteDeAudio urlDeAudio={item.contenido} orden={item.orden}/>
						: (item.tipo === 'TEXTO') ?
							<ComponenteDeTexto contenido={item.contenido} orden={item.orden}/>
						: (item.tipo === 'YOUTUBEVIDEO') ?

							<ComponenteDeYoutubeVideo orden={item.orden} videoId={ (((item.contenido).split("https://youtu.be/")).length === 2) ? ((item.contenido).split("https://youtu.be/"))[1] : null } />

						:
							null
						}
						</>
						);
					}
                }
                />);
	}

	//Estos son componentes necesarios para ConjuntoDeComponentes: Inicio, SeparadorDebajoDe y Fin
	const SeparadorInicio = () => {
		const [datosDelComponenteS, modificarDatosDelComponenteS] = useState({
			checkedDelCheckBoxModoIntercambioDePosicion: false,

			//VARIABLES PARA INTERCAMBIO DE POSICION
			numeroDelIntercambioActual: null,
			tipoDeMovimientoActual: null
		});

		const eventos = {
			checkBoxDelModoIntercambioDePosicion: () => {
				if(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion){
					//PASARA A FALSE
					let mensaje = eventosEspecificos.eliminarComponenteOPosicionDelArreglo("Inicio");

					if(mensaje === "Exito"){
						//SIEMPRE ENTRARA AQUI
						modificarDatosDelComponenteS({
							...datosDelComponenteS,
							checkedDelCheckBoxModoIntercambioDePosicion: false,
							numeroDelIntercambioActual: null,
							tipoDeMovimientoActual: null
						});
					}
				}
				else{
					//INTENTARA PASAR A TRUE
					let mensaje = eventosEspecificos.agregarComponenteOPosicionAlArreglo("Inicio");
					if(mensaje === "Error"){
						//NO SE PUDO AGREGAR LA POSICION, DEBIDO A QUE NO PUEDE PONERSE COMO MOVIMIENTO INICIAL
						ToastAndroid.show('No puedes elegir una posicion como movimiento inicial. Primero selecciona un componente, después ya podrás seleccionar esta posición.', ToastAndroid.LONG);
					}
					else{
						//mensaje ES EL OBJETO
						//SI SE PUDO INSERTAR EN EL ARREGLO, RE-RENDERIZAMOS
						modificarDatosDelComponenteS({
							...datosDelComponenteS,
							checkedDelCheckBoxModoIntercambioDePosicion: true,
							numeroDelIntercambioActual: mensaje.numeroDelIntercambio,
							tipoDeMovimientoActual: mensaje.tipoDeMovimiento
						});
					}
				}
			}
		}

		return(
			<>
				{(datosEspecificosS.modoIntercambioDePosicion) ?
					<>
						<View style={{width: '100%', height: 20}}></View>
						<View style={{width: '100%', height: (anchoNativoInicial * .6) * .35, overflow: 'hidden', zIndex: 10, flexDirection: 'row'}}>
							<View style={{width: (anchoNativoInicial) * .09, height: '100%'}}>
								<View style={{
									width: 0,
									height: 0,
									backgroundColor: 'transparent',
									borderStyle: 'solid',
									borderRightWidth: (anchoNativoInicial) * .09,
									borderBottomWidth: (anchoNativoInicial) * .105,
									borderRightColor: 'rgb(255, 201, 14)',
									borderBottomColor: 'transparent',
									position: 'absolute',
									left: 0,
									top: 0
								}}/>
								<View style={{
									width: 0,
									height: 0,
									backgroundColor: 'transparent',
									borderStyle: 'solid',
									borderRightWidth: (anchoNativoInicial) * .09,
									borderTopWidth: (anchoNativoInicial) * .105,
									borderRightColor: 'rgb(255, 201, 14)',
									borderTopColor: 'transparent',
									position: 'absolute',
									left: 0,
									bottom: 0
								}}/>
							</View>
							<View style={{width: (anchoNativoInicial) * 0.185, height: '100%', backgroundColor: 'rgb(255, 201, 14)'}}>
								<View style={(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion) ? {width: '100%', height: '50%', position: 'absolute', left: 0, top: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'} : {width: '100%', height: '50%', position: 'absolute', left: 0, top: 0, alignItems: 'center', justifyContent: 'center'}}>
									{(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion) ?
										<>
											<Text style={{fontSize: (((anchoNativoInicial * .6) * .35) * .5) * .45, textAlign: 'center', fontWeight: 'bold'}} >{datosDelComponenteS.numeroDelIntercambioActual + '°'}</Text>
											<Icon9 name={"long-arrow-down"} size={((anchoNativoInicial) * 0.085) * .8} color={'black'}/>
										</>
									:
										<Icon9 name={"exchange"} size={((anchoNativoInicial) * 0.085) * .8} color={'black'} style={{transform: [{rotate: '90deg'}]}}/>
									}
								</View>
								<View style={{width: '100%', height: '50%', position: 'absolute', left: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'}}>
									<CheckBox checked={datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion} onPress={eventos.checkBoxDelModoIntercambioDePosicion} size={(anchoNativoInicial) * 0.085}/>
								</View>
							</View>
							<View style={{width: (anchoNativoInicial) * .725 - (anchoNativoInicial) * .01, height: '100%', backgroundColor: 'rgb(255, 201, 14)', borderTopRightRadius: 5, borderBottomRightRadius: 5, borderRightWidth: 1, alignItems: 'center', justifyContent: 'center'}}>
								<Text style={{fontSize: ((anchoNativoInicial * .6) * .35) * .2, textAlign: 'center', fontWeight: 'bold'}} >Inicio</Text>
							</View>
						</View>
						<View style={{width: '100%', height: 20}}></View>
					</>
				:
					<View style={{width: '100%', height: 0}}></View>
				}
			</>
		);
	}
	const SeparadorDebajoDe = (props) => {
		const [datosDelComponenteS, modificarDatosDelComponenteS] = useState({
			checkedDelCheckBoxModoIntercambioDePosicion: false,
			numeroDelIntercambioActual: null,
			tipoDeMovimientoActual: null
		});

		const eventos = {
			checkBoxDelModoIntercambioDePosicion: () => {
				if(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion){
					//PASARA A FALSE
					let mensaje = eventosEspecificos.eliminarComponenteOPosicionDelArreglo("SeparadorDebajoDe_" + (props.ordenDeArriba));

					if(mensaje === "Exito"){
						//SIEMPRE ENTRARA AQUI
						modificarDatosDelComponenteS({
							...datosDelComponenteS,
							checkedDelCheckBoxModoIntercambioDePosicion: false,
							numeroDelIntercambioActual: null,
							tipoDeMovimientoActual: null
						});
					}
				}
				else{
					//INTENTARA PASAR A TRUE
					let mensaje = eventosEspecificos.agregarComponenteOPosicionAlArreglo("SeparadorDebajoDe_" + (props.ordenDeArriba));
					if(mensaje === "Error"){
						//NO SE PUDO AGREGAR LA POSICION, DEBIDO A QUE NO PUEDE PONERSE COMO MOVIMIENTO INICIAL
						ToastAndroid.show('No puedes elegir una posicion como movimiento inicial. Primero selecciona un componente, después ya podrás seleccionar esta posición.', ToastAndroid.LONG);
					}
					else{
						//mensaje ES EL OBJETO
						//SI SE PUDO INSERTAR EN EL ARREGLO, RE-RENDERIZAMOS
						modificarDatosDelComponenteS({
							...datosDelComponenteS,
							checkedDelCheckBoxModoIntercambioDePosicion: true,
							numeroDelIntercambioActual: mensaje.numeroDelIntercambio,
							tipoDeMovimientoActual: mensaje.tipoDeMovimiento
						});
					}
				}
			}
		}

		return(
			<>
				{(datosEspecificosS.modoIntercambioDePosicion) ?
					<>
						<View style={{width: '100%', height: 20}}></View>
						<View style={{width: '100%', height: (anchoNativoInicial * .6) * .35, overflow: 'hidden', zIndex: 10, flexDirection: 'row'}}>
							<View style={{width: (anchoNativoInicial) * .09, height: '100%'}}>
								<View style={{
									width: 0,
									height: 0,
									backgroundColor: 'transparent',
									borderStyle: 'solid',
									borderRightWidth: (anchoNativoInicial) * .09,
									borderBottomWidth: (anchoNativoInicial) * .105,
									borderRightColor: 'rgb(255, 201, 14)',
									borderBottomColor: 'transparent',
									position: 'absolute',
									left: 0,
									top: 0
								}}/>
								<View style={{
									width: 0,
									height: 0,
									backgroundColor: 'transparent',
									borderStyle: 'solid',
									borderRightWidth: (anchoNativoInicial) * .09,
									borderTopWidth: (anchoNativoInicial) * .105,
									borderRightColor: 'rgb(255, 201, 14)',
									borderTopColor: 'transparent',
									position: 'absolute',
									left: 0,
									bottom: 0
								}}/>
							</View>
							<View style={{width: (anchoNativoInicial) * 0.185, height: '100%', backgroundColor: 'rgb(255, 201, 14)'}}>
								<View style={(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion) ? {width: '100%', height: '50%', position: 'absolute', left: 0, top: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'} : {width: '100%', height: '50%', position: 'absolute', left: 0, top: 0, alignItems: 'center', justifyContent: 'center'}}>
									{(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion) ?
										<>
											<Text style={{fontSize: (((anchoNativoInicial * .6) * .35) * .5) * .45, textAlign: 'center', fontWeight: 'bold'}} >{datosDelComponenteS.numeroDelIntercambioActual + '°'}</Text>
											<Icon9 name={"long-arrow-down"} size={((anchoNativoInicial) * 0.085) * .8} color={'black'}/>
										</>
									:
										<Icon9 name={"exchange"} size={((anchoNativoInicial) * 0.085) * .8} color={'black'} style={{transform: [{rotate: '90deg'}]}}/>
									}
								</View>
								<View style={{width: '100%', height: '50%', position: 'absolute', left: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'}}>
									<CheckBox checked={datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion} onPress={eventos.checkBoxDelModoIntercambioDePosicion} size={(anchoNativoInicial) * 0.085}/>
								</View>
							</View>
							<View style={{width: (anchoNativoInicial) * .725 - (anchoNativoInicial) * .01, height: '100%', backgroundColor: 'rgb(255, 201, 14)', borderTopRightRadius: 5, borderBottomRightRadius: 5, borderRightWidth: 1, alignItems: 'center', justifyContent: 'center'}}>
								<Text style={{fontSize: ((anchoNativoInicial * .6) * .35) * .2, textAlign: 'center', fontWeight: 'bold'}} >{'Separador entre ' + props.ordenDeArriba + '° y ' + (props.ordenDeArriba + 1) + '°'}</Text>
							</View>
						</View>
						<View style={{width: '100%', height: 20}}></View>
					</>
				:
					<View style={{width: '100%', height: 20}}></View>
				}
			</>
		);
	}

	const SeparadorFin = () => {
		const [datosDelComponenteS, modificarDatosDelComponenteS] = useState({
			checkedDelCheckBoxModoIntercambioDePosicion: false,
			numeroDelIntercambioActual: null,
			tipoDeMovimientoActual: null
		});

		const eventos = {
			checkBoxDelModoIntercambioDePosicion: () => {
				if(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion){
					//PASARA A FALSE
					let mensaje = eventosEspecificos.eliminarComponenteOPosicionDelArreglo("Fin");

					if(mensaje === "Exito"){
						//SIEMPRE ENTRARA AQUI
						modificarDatosDelComponenteS({
							...datosDelComponenteS,
							checkedDelCheckBoxModoIntercambioDePosicion: false,
							numeroDelIntercambioActual: null,
							tipoDeMovimientoActual: null
						});
					}
				}
				else{
					//INTENTARA PASAR A TRUE
					let mensaje = eventosEspecificos.agregarComponenteOPosicionAlArreglo("Fin");
					if(mensaje === "Error"){
						//NO SE PUDO AGREGAR LA POSICION, DEBIDO A QUE NO PUEDE PONERSE COMO MOVIMIENTO INICIAL
						ToastAndroid.show('No puedes elegir una posicion como movimiento inicial. Primero selecciona un componente, después ya podrás seleccionar esta posición.', ToastAndroid.LONG);
					}
					else{
						//mensaje ES EL OBJETO
						//SI SE PUDO INSERTAR EN EL ARREGLO, RE-RENDERIZAMOS
						modificarDatosDelComponenteS({
							...datosDelComponenteS,
							checkedDelCheckBoxModoIntercambioDePosicion: true,
							numeroDelIntercambioActual: mensaje.numeroDelIntercambio,
							tipoDeMovimientoActual: mensaje.tipoDeMovimiento
						});
					}
				}
			}
		}

		return(
			<>
				{(datosEspecificosS.modoIntercambioDePosicion) ?
					<>
						<View style={{width: '100%', height: 20}}></View>
						<View style={{width: '100%', height: (anchoNativoInicial * .6) * .35, overflow: 'hidden', zIndex: 10, flexDirection: 'row'}}>
							<View style={{width: (anchoNativoInicial) * .09, height: '100%'}}>
								<View style={{
									width: 0,
									height: 0,
									backgroundColor: 'transparent',
									borderStyle: 'solid',
									borderRightWidth: (anchoNativoInicial) * .09,
									borderBottomWidth: (anchoNativoInicial) * .105,
									borderRightColor: 'rgb(255, 201, 14)',
									borderBottomColor: 'transparent',
									position: 'absolute',
									left: 0,
									top: 0
								}}/>
								<View style={{
									width: 0,
									height: 0,
									backgroundColor: 'transparent',
									borderStyle: 'solid',
									borderRightWidth: (anchoNativoInicial) * .09,
									borderTopWidth: (anchoNativoInicial) * .105,
									borderRightColor: 'rgb(255, 201, 14)',
									borderTopColor: 'transparent',
									position: 'absolute',
									left: 0,
									bottom: 0
								}}/>
							</View>
							<View style={{width: (anchoNativoInicial) * 0.185, height: '100%', backgroundColor: 'rgb(255, 201, 14)'}}>
								<View style={(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion) ? {width: '100%', height: '50%', position: 'absolute', left: 0, top: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'} : {width: '100%', height: '50%', position: 'absolute', left: 0, top: 0, alignItems: 'center', justifyContent: 'center'}}>
									{(datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion) ?
										<>
											<Text style={{fontSize: (((anchoNativoInicial * .6) * .35) * .5) * .45, textAlign: 'center', fontWeight: 'bold'}} >{datosDelComponenteS.numeroDelIntercambioActual + '°'}</Text>
											<Icon9 name={"long-arrow-down"} size={((anchoNativoInicial) * 0.085) * .8} color={'black'}/>
										</>
									:
										<Icon9 name={"exchange"} size={((anchoNativoInicial) * 0.085) * .8} color={'black'} style={{transform: [{rotate: '90deg'}]}}/>
									}
								</View>
								<View style={{width: '100%', height: '50%', position: 'absolute', left: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'}}>
									<CheckBox checked={datosDelComponenteS.checkedDelCheckBoxModoIntercambioDePosicion} onPress={eventos.checkBoxDelModoIntercambioDePosicion} size={(anchoNativoInicial) * 0.085}/>
								</View>
							</View>
							<View style={{width: (anchoNativoInicial) * .725 - (anchoNativoInicial) * .01, height: '100%', backgroundColor: 'rgb(255, 201, 14)', borderTopRightRadius: 5, borderBottomRightRadius: 5, borderRightWidth: 1, alignItems: 'center', justifyContent: 'center'}}>
								<Text style={{fontSize: ((anchoNativoInicial * .6) * .35) * .2, textAlign: 'center', fontWeight: 'bold'}} >{'Fin'}</Text>
							</View>
						</View>
						<View style={{width:"100%",height: (anchoNativoInicial / 6) + 40}}/>
					</>
				:
					<View style={{width:"100%",height: (anchoNativoInicial / 6) + 40}}/>
				}
			</>
		);
	}

	//https://facebook.github.io/react-native/docs/signed-apk-android.
	const BotonDeMenu = () => {
		const datosDelComponenteR = useRef({
			//El anchoInicial tendremos que cambiarlo un poco, debido a que en otro tipo de celulares, se vera raro
			anchoInicial: anchoNativoInicial / 6,
			cantidadDeFuncionalidades: 3,
			separadorEntreFuncionalidades: 18,
			finalizadorArribaYAbajo: 18,
			tamanioDeFuncionalidad: (anchoNativoInicial / 6) * .7
		});

		const [datosDelComponenteS, modificarDatosDelComponenteS] = useState({
			visualizacionDelMenuPrincipal: false,
			visualizacionDelMenuAgregar: false,

			estado: 1,
			/*
				Estados Posibles
				1 => Normal,
				2 => SubiendoArchivo
			*/
			visualizacionDelMenuAgregarYoutubeVideo: false,
			textoDelTextInputYoutubeVideo: null
		});

		const ejesY = useRef({
			menuDesplegablePrincipal : new Animated.Value((datosDelComponenteR.current.finalizadorArribaYAbajo) + (datosDelComponenteR.current.cantidadDeFuncionalidades * (datosDelComponenteR.current.tamanioDeFuncionalidad)) + (datosDelComponenteR.current.cantidadDeFuncionalidades * (datosDelComponenteR.current.separadorEntreFuncionalidades)) + (datosDelComponenteR.current.anchoInicial - 22))
		});

		const ejesX = useRef({
			menuDesplegableAgregar : new Animated.Value(((datosDelComponenteR.current.separadorEntreFuncionalidades / 2) * 4) + (datosDelComponenteR.current.anchoInicial * 3))
		})


		const eventos = {
			aparecerODesaparecerElMenuPrincipal : () => {
				if(datosDelComponenteS.visualizacionDelMenuPrincipal === true){

					if(datosDelComponenteS.visualizacionDelMenuAgregar === true){
						//HAY PROBLEMAS

						setTimeout(() => {
							modificarDatosDelComponenteS({...datosDelComponenteS, visualizacionDelMenuAgregar: false});
						}, 200);

						Animated.timing(ejesX.current.menuDesplegableAgregar, {
							delay: 0,
							toValue: ((datosDelComponenteR.current.separadorEntreFuncionalidades / 2) * 4) + (datosDelComponenteR.current.anchoInicial * 3),
							duration: 800,
							useNativeDriver: true,
							easing: Easing.bezier(0.19, 1.0, 0.22, 1.0)
						}).start(() => {
							setTimeout(() => {
								modificarDatosDelComponenteS({...datosDelComponenteS, visualizacionDelMenuPrincipal: false, visualizacionDelMenuAgregar: false});
							}, 200);

							Animated.timing(ejesY.current.menuDesplegablePrincipal, {
								delay: 0,
								toValue: (datosDelComponenteR.current.finalizadorArribaYAbajo) + (datosDelComponenteR.current.cantidadDeFuncionalidades * (datosDelComponenteR.current.tamanioDeFuncionalidad)) + (datosDelComponenteR.current.cantidadDeFuncionalidades * (datosDelComponenteR.current.separadorEntreFuncionalidades)) + (datosDelComponenteR.current.anchoInicial - 22),
								duration: 800,
								useNativeDriver: true,
								easing: Easing.bezier(0.19, 1.0, 0.22, 1.0)
							}).start();
						});
					}
					else if(datosDelComponenteS.visualizacionDelMenuAgregar === false){
						//EJECUTAMOS TODO NORMALMENTE
						setTimeout(() => {
							modificarDatosDelComponenteS({...datosDelComponenteS, visualizacionDelMenuPrincipal: false});
						}, 200);

						Animated.timing(ejesY.current.menuDesplegablePrincipal, {
							delay: 0,
							toValue: (datosDelComponenteR.current.finalizadorArribaYAbajo) + (datosDelComponenteR.current.cantidadDeFuncionalidades * (datosDelComponenteR.current.tamanioDeFuncionalidad)) + (datosDelComponenteR.current.cantidadDeFuncionalidades * (datosDelComponenteR.current.separadorEntreFuncionalidades)) + (datosDelComponenteR.current.anchoInicial - 22),
							duration: 800,
							useNativeDriver: true,
							easing: Easing.bezier(0.19, 1.0, 0.22, 1.0)
						}).start();
					}

				}
				else if(datosDelComponenteS.visualizacionDelMenuPrincipal === false){
					modificarDatosDelComponenteS({...datosDelComponenteS, visualizacionDelMenuPrincipal: true});

					Animated.timing(ejesY.current.menuDesplegablePrincipal, {
						delay: 100,
						toValue: 0,
						duration: 1000,
						useNativeDriver: true,
						easing: Easing.bezier(0.19, 1.0, 0.22, 1.0)
					}).start();

				}
			},
			botonPrincipal: () => {

				if(datosDelComponenteS.estado === 1){
					if(datosEspecificosS.modoEliminacion){

						eventosEspecificos.eliminacionDeComponentesEnElServidor();


						//FALTA MAS CODIGO...
					}
					else if(datosEspecificosS.modoIntercambioDePosicion){
						eventosEspecificos.intercambiosDePosicionDeComponentesEnElServidor();
					}
					else{
						//NO HAY NINGUN MODO ACTIVO EN LA RE-RENDERIZACION
						eventos.aparecerODesaparecerElMenuPrincipal();
					}
				}
			},
			botonAgregar: () => {
				eventos.aparecerODesaparecerElMenuAgregar();
			},
			aparecerODesaparecerElMenuAgregar: () => {
				if(datosDelComponenteS.visualizacionDelMenuAgregar === true){
					//ES TRUE, PASARA A FALSE
					setTimeout(() => {
						modificarDatosDelComponenteS({...datosDelComponenteS, visualizacionDelMenuAgregar: false});
					}, 200);

					Animated.timing(ejesX.current.menuDesplegableAgregar, {
						delay: 0,
						toValue: ((datosDelComponenteR.current.separadorEntreFuncionalidades / 2) * 4) + (datosDelComponenteR.current.anchoInicial * 3),
						duration: 800,
						useNativeDriver: true,
						easing: Easing.bezier(0.19, 1.0, 0.22, 1.0)
					}).start();
				}
				else if(datosDelComponenteS.visualizacionDelMenuAgregar === false){
					//ES FALSE, PASARA A TRUE
					modificarDatosDelComponenteS({...datosDelComponenteS, visualizacionDelMenuAgregar: true});

					Animated.timing(ejesX.current.menuDesplegableAgregar, {
						delay: 100,
						toValue: 0,
						duration: 1000,
						useNativeDriver: true,
						easing: Easing.bezier(0.19, 1.0, 0.22, 1.0)
					}).start();
				}
			},
			botonAgregarComponenteDeArchivo: () => {
				//De Imagen, De Video, De Audio, De .pdf?

				//ESTO ES UN EJEMPLO, PARA RECORDAR COMO LE HACIA PARA SUBIR ARCHIVOS AL SERVIDOR


				/*
				ImagePicker.showImagePicker(opciones, (response) => {
					console.log('Response = ', response);
					// You can also display the image using data:
					// const source = { uri: 'data:image/jpeg;base64,' + response.data };
					//console.log('ContenidoBase64 = ', RNFetchBlob.wrap(response.path));
					/*
					RNFetchBlob.fetch("POST","http://backpack.sytes.net/servidorApp/php/accionesEnApartados/guardarNuevoComponente/subirComponente.php", {
						Authorization : "Bearer access-token",
						otherHeader : "foo",
						'Content-Type' : 'multipart/form-data',
					}, [
						{name: 'archivo', filename: 'imagen.png', data: RNFetchBlob.wrap(response.uri)}
					])
					.then((res) => {
						console.log('Respuesta desde el servidor => ' , res);
					})
					.catch((error) => {
						alert(error);
					});
					*/
				/*
				});
				*/

				FilePickerManager.showFilePicker(null, (response) => {
					console.log('Response actualizada= ', response);

					//1.- Detectar si el archivo es solamente un ComponenteDeVideo, ComponenteDeAudio, ComponenteDeImagen
					let tipoDeComponente = "";

					if(response.didCancel){
						console.log("el usuario ha cancelado la seleccion")
					}
					else if(response.error){
						console.log("ha habido un error")
					}
					else{
					if((response.type).includes("video") || (response.type).includes("audio") || (response.type).includes("image")){
						//ComponenteDeVideo o ComponenteDeAudio o ComponenteDeImagen

						if(response.size <= 150000000){

							if((response.type).includes("video")){
								//ComponenteDeVideo
								tipoDeComponente = 'VIDEO';
							}
							else if((response.type).includes("audio")){
								//ComponenteDeAudio
								tipoDeComponente = 'AUDIO';
							}
							else if((response.type).includes("image")){
								tipoDeComponente = 'IMAGEN';
							}



							Alert.alert('¡Aviso!', 'Si el archivo elegido pesa mucho, el tiempo de espera para subirlo también será mucho.', [
								{
									text: 'Cancelar Subida',
									onPress: () => {
										//LimpiarCache();
									}
								},
								{
									text: 'Continuar Subida',
									onPress: () => {
										setTimeout(() => {
											modificarDatosDelComponenteS({...datosDelComponenteS, visualizacionDelMenuAgregar: false});
										}, 200);

										Animated.timing(ejesX.current.menuDesplegableAgregar, {
											delay: 0,
											toValue: ((datosDelComponenteR.current.separadorEntreFuncionalidades / 2) * 3) + (datosDelComponenteR.current.anchoInicial * 2),
											duration: 800,
											useNativeDriver: true,
											easing: Easing.bezier(0.19, 1.0, 0.22, 1.0)
										}).start(() => {
											setTimeout(() => {
												modificarDatosDelComponenteS({...datosDelComponenteS, visualizacionDelMenuPrincipal: false, visualizacionDelMenuAgregar: false});
											}, 200);

											Animated.timing(ejesY.current.menuDesplegablePrincipal, {
												delay: 0,
												toValue: (datosDelComponenteR.current.finalizadorArribaYAbajo) + (datosDelComponenteR.current.cantidadDeFuncionalidades * (datosDelComponenteR.current.tamanioDeFuncionalidad)) + (datosDelComponenteR.current.cantidadDeFuncionalidades * (datosDelComponenteR.current.separadorEntreFuncionalidades)) + (datosDelComponenteR.current.anchoInicial - 22),
												duration: 800,
												useNativeDriver: true,
												easing: Easing.bezier(0.19, 1.0, 0.22, 1.0)
											}).start(() => {
												modificarDatosDelComponenteS({...datosDelComponenteS, visualizacionDelMenuPrincipal: false, visualizacionDelMenuAgregar: false, estado: 2});

												let objetoConInformacion = {
													tipoDeComponente: tipoDeComponente,
													matricula: variablesDentroDeMochila.matriculaDelPropietario,
													eleccionDeApartado: variablesDentroDeMochila.eleccionDeApartado,
													eleccionIdDeLibreta: variablesDentroDeMochila.eleccionIdDeLibreta,
													eleccionIdDeHoja: variablesDentroDeMochila.eleccionIdDeHoja,
													informacionAdicional: null,//Esto puede cambiar en el futuro si lo necesitamos
													path: response.path
												};

												RNFetchBlob.fetch("POST", urlDelServidor + "/servidorApp/php/accionesEnApartados/guardarNuevoComponente/guardarNuevoComponenteDeArchivoEnHojaDeLibreta.php", {
													Authorization : "Bearer access-token",
													otherHeader : "foo",
													'Content-Type' : 'multipart/form-data',
												}, [
													{name: 'archivo', filename: response.fileName, data: RNFetchBlob.wrap(response.uri)},
													{name: 'info', data: JSON.stringify(objetoConInformacion)}
												]) .uploadProgress((written, total) => {
										        console.log('uploaded', written / total)
										    })
										    // listen to download progress event
										    .progress((received, total) => {
										        console.log('progress', received / total)
										    })
												.then((mensaje) => mensaje.text())
												.then((respuesta) => {
													console.log('Respuesta desde el servidor = |' + respuesta + '|');

													if(respuesta === "Exito"){
														//LimpiarCache();
														modificarDatosDelComponenteS({...datosDelComponenteS, visualizacionDelMenuPrincipal: false, visualizacionDelMenuAgregar: false, estado: 1});

														modificarMuestreoDelCargandoInicial(true);
														eventosEspecificos.traerDatosDeComponentesAVisualizarHoja();
													}
													else{
														//LimpiarCache();
														Alert.alert('Error', 'Hubo algún error durante la subida y el guardado del archivo.', null, {cancelable: true});
														modificarDatosDelComponenteS({...datosDelComponenteS, visualizacionDelMenuPrincipal: false, visualizacionDelMenuAgregar: false, estado: 1});
													}
												})
												.catch((error) => {
													Alert.alert('Error', 'Hubo algún error durante la subida y el guardado del archivo.', null, {cancelable: true});
													modificarDatosDelComponenteS({...datosDelComponenteS, visualizacionDelMenuPrincipal: false, visualizacionDelMenuAgregar: false, estado: 1});
												});
											});
										});
									}
								}
							], {
								cancelable: false
							});

						}
						else{
							Alert.alert('Error', 'Este archivo supera los 150 MB que un componente de BackPack puede aceptar. Elige otro archivo.', null, {cancelable: true});
							//LimpiarCache();
						}
					}
					else{
						//El archivo no es aceptado por BackPack
						Alert.alert('Error', 'El tipo de archivo no puede ser aceptado como un componente. Elige otro tipo de archivo.', null, {cancelable: true});
					}
				}

					/*
					RNFetchBlob.fetch("POST","http://backpack.sytes.net/servidorApp/php/accionesEnApartados/guardarNuevoComponente/subirComponente.php", {
						Authorization : "Bearer access-token",
						otherHeader : "foo",
						'Content-Type' : 'multipart/form-data',
					}, [
						{name: 'archivo', filename: 'file.js', data: RNFetchBlob.wrap(response.uri)},
						{name: 'info', data: JSON.stringify({
							tipoDeComponente: 'PDF',
							matricula: '17419070110040',
							eleccionDeApartado: 'apartado privado',
						})}
					])
					.then((res) => {
						console.log('Respuesta desde el servidor => ' , res);
					})
					.catch((error) => {
						alert(error);
					});
					*/
				});

			},
			botonAgregarComponenteDeTexto: async () => {
				let objetoConInformacion = {
					eleccionIdDeLibreta: variablesDentroDeMochila.eleccionIdDeLibreta,
					eleccionIdDeHoja: variablesDentroDeMochila.eleccionIdDeHoja,
					matricula: variablesDentroDeMochila.matriculaDelPropietario
				};

				let json = JSON.stringify(objetoConInformacion);
				let datos = new FormData();
				datos.append('indice', json);

				let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/accionesEnApartados/guardarNuevoComponente/guardarNuevoComponenteDeTextoEnHojaDeLibreta.php', {
					method: 'POST',
					body: datos
				})
				.then((mensaje) => mensaje.text())
				.then((respuesta) => {
					if(respuesta === "Exito"){
						modificarMuestreoDelCargandoInicial(true);
						modificarDatosDelComponenteS({
							...datosDelComponenteS,
							visualizacionDelMenuPrincipal: false,
							visualizacionDelMenuAgregar: false
						});
						eventosEspecificos.traerDatosDeComponentesAVisualizarHoja();
					}
					else{
						ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
  						console.log("error linea : 4673")
					}
				})
				.catch((error) => {
					ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
  					console.log("error linea : ",error)
				});
			},
			agregarComponenteDeYoutubeVideo: async () => {
				let objetoConInformacion = {
					eleccionIdDeLibreta: variablesDentroDeMochila.eleccionIdDeLibreta,
					eleccionIdDeHoja: variablesDentroDeMochila.eleccionIdDeHoja,
					matricula: variablesDentroDeMochila.matriculaDelPropietario,
					urlYoutube: datosDelComponenteS.textoDelTextInputYoutubeVideo
				};

				let json = JSON.stringify(objetoConInformacion);
				let datos = new FormData();
				datos.append("indice", json);

				let promesa = await fetch("http://backpack.sytes.net/servidorApp/php/accionesEnApartados/guardarNuevoComponente/guardarNuevoComponenteDeYoutubeVideoEnHojaDeLibreta.php", {
					method: "POST",
					body: datos
				})
				.then(msj => msj.text())
				.then(respuesta => {
					if(respuesta === "Exito"){
						modificarMuestreoDelCargandoInicial(true);
						modificarDatosDelComponenteS({
							...datosDelComponenteS,
							visualizacionDelMenuPrincipal: false,
							visualizacionDelMenuAgregar: false,
							visualizacionDelMenuAgregarYoutubeVideo: false,
							textoDelTextInputYoutubeVideo: null
						});
						eventosEspecificos.traerDatosDeComponentesAVisualizarHoja();
					}
					else{
						ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
  						console.log("error linea : 4712")
					}
				})
				.catch(error => {
					ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
  					console.log("error linea : ",error)
				});

			}
		}

		let estilos = StyleSheet.create({
			contenedorPrincipal : {
				zIndex : 4,
				width : datosDelComponenteR.current.anchoInicial,
				height : datosDelComponenteR.current.anchoInicial,
				position : 'absolute',
				bottom : 20,
				right : 20,
				borderRadius : 100,
				alignItems : 'center',
				justifyContent : 'center',
				overflow : 'hidden'
			},
			botonPrincipal : {
				width : '100%',
				height : '100%',
				borderRadius : 100,
				backgroundColor : 'lavender',
				borderWidth : 2,
				alignItems : 'center',
				justifyContent : 'center',
				overflow : 'hidden',
				//zIndex: 4,
			},
			contenedorDelMenuDesplegablePrincipal: {
				zIndex: 3,
				width: datosDelComponenteR.current.anchoInicial,
				height: (datosDelComponenteR.current.finalizadorArribaYAbajo) + (datosDelComponenteR.current.cantidadDeFuncionalidades * (datosDelComponenteR.current.tamanioDeFuncionalidad)) + (datosDelComponenteR.current.cantidadDeFuncionalidades * (datosDelComponenteR.current.separadorEntreFuncionalidades)) + (datosDelComponenteR.current.anchoInicial - 22),
				position: 'absolute',
				right: 20,
				bottom: 42,
				overflow: 'hidden',
				backgroundColor: 'transparent'
			},
			menuDesplegablePrincipal: {
				width: '100%',
				height: '100%',
				backgroundColor: 'lavender',
				borderRadius: 20,
				borderWidth: 1.5,
				position: 'absolute',
				bottom: 0,
				overflow: 'hidden',
				transform: [{translateY: ejesY.current.menuDesplegablePrincipal}]
			},
			contenedorDelMenuDesplegableAgregar: {
				zIndex: 2,
				width: (datosDelComponenteR.current.anchoInicial * 3) + ((datosDelComponenteR.current.separadorEntreFuncionalidades / 2) * 4),
				height: datosDelComponenteR.current.tamanioDeFuncionalidad ,
				backgroundColor: 'transparent',
				overflow: 'hidden',
				position: 'absolute',
				right: 20 + datosDelComponenteR.current.anchoInicial - 1,
				bottom: 20 + datosDelComponenteR.current.anchoInicial + (datosDelComponenteR.current.separadorEntreFuncionalidades),
				//backgroundColor: 'red'
			},
			menuDesplegableAgregar: {
				overflow: 'hidden',
				width: '100%',
				height: '100%',
				borderTopLeftRadius: 20,
				borderBottomLeftRadius: 20,
				borderWidth: 1,
				position: 'absolute',
				left: 0,
				backgroundColor: 'lavender',
				transform: [{translateX: ejesX.current.menuDesplegableAgregar}]
			},
			botonFuncionalidad: {
				width: '100%',
				height: datosDelComponenteR.current.tamanioDeFuncionalidad,
				position: 'absolute',
				//backgroundColor: 'pink',
				justifyContent: 'center',
				alignItems: 'center'
			},
			botonFuncionalidadMenuHorizontal: {
				width: datosDelComponenteR.current.anchoInicial,
				height: '100%',
				position: 'absolute',
				justifyContent: 'center',
				alignItems: 'center',
				//backgroundColor: 'pink'
			}
		});

		//const [prueba, modificarPrueba] = useState(true);
		//MensajeDeTipoTostada.show('Valor = ' + prueba, MensajeDeTipoTostada.SHORT);

		/*
			Te servira en el futuro
			<TouchableNativeFeedback onPress={() => {

							}}>
								<View style={[estilos.botonFuncionalidad, {top: datosDelComponenteR.current.finalizadorArribaYAbajo + (datosDelComponenteR.current.tamanioDeFuncionalidad * 2) + (datosDelComponenteR.current.separadorEntreFuncionalidades * 2)}]}>
									<Icon8 name={"comment-discussion"} size={datosDelComponenteR.current.tamanioDeFuncionalidad * .7} color={'black'}/>
								</View>
							</TouchableNativeFeedback>

		*/

		return(
		<>
			<View style={estilos.contenedorPrincipal}>
				<TouchableNativeFeedback onPress={eventos.botonPrincipal}>
					<View style={estilos.botonPrincipal}>
						{(datosEspecificosS.modoEliminacion || datosEspecificosS.modoIntercambioDePosicion) ?
							<Icon8 name={'check'} color={'black'} size={(anchoNativoInicial / 6) - 10}/>
						: (datosDelComponenteS.estado === 2) ?
							<Icon1 name={'progress-upload'} color={'black'} size={(anchoNativoInicial / 6) - 10}/>
						:
							<Icon1 name={'menu-swap'} color={'black'} size={(anchoNativoInicial / 6) - 10}/>
						}
					</View>
				</TouchableNativeFeedback>

			</View>

			{(datosDelComponenteS.visualizacionDelMenuPrincipal) ?
				<>
					<View style={estilos.contenedorDelMenuDesplegablePrincipal}>
						<Animated.View style={[estilos.menuDesplegablePrincipal]}>
							<TouchableNativeFeedback onPress={() => {
								modificarDatosEspecificosS({...datosEspecificosS, modoEliminacion: true, datosDeComponentes: eventosEspecificos.retornarDatosDeComponentesDespuesDeEjecutarTareasPendientes()});
							}}>
								<View style={[estilos.botonFuncionalidad, {top: datosDelComponenteR.current.finalizadorArribaYAbajo}]}>
									<Icon8 name={"trashcan"} size={datosDelComponenteR.current.tamanioDeFuncionalidad * .7} color={'black'}/>
								</View>
							</TouchableNativeFeedback>
							<TouchableNativeFeedback onPress={() => {
								modificarDatosEspecificosS({...datosEspecificosS, modoIntercambioDePosicion: true, datosDeComponentes: eventosEspecificos.retornarDatosDeComponentesDespuesDeEjecutarTareasPendientes()});
							}}>
								<View style={[estilos.botonFuncionalidad, {top: datosDelComponenteR.current.finalizadorArribaYAbajo + datosDelComponenteR.current.tamanioDeFuncionalidad + datosDelComponenteR.current.separadorEntreFuncionalidades}]}>
									<Icon9 name={"exchange"} size={datosDelComponenteR.current.tamanioDeFuncionalidad * .7} color={'black'} style={{transform: [{rotate: '90deg'}]}}/>
								</View>
							</TouchableNativeFeedback>
							<TouchableNativeFeedback onPress={eventos.botonAgregar}>
								<View style={[estilos.botonFuncionalidad, {top: datosDelComponenteR.current.finalizadorArribaYAbajo + (datosDelComponenteR.current.tamanioDeFuncionalidad * 2) + (datosDelComponenteR.current.separadorEntreFuncionalidades * 2)}]}>
									<Icon2 name={"add"} size={datosDelComponenteR.current.tamanioDeFuncionalidad * .7} color={'black'}/>
								</View>
							</TouchableNativeFeedback>
						</Animated.View>
					</View>
					{(datosDelComponenteS.visualizacionDelMenuAgregar) ?
						<View style={estilos.contenedorDelMenuDesplegableAgregar}>
							<Animated.View style={estilos.menuDesplegableAgregar}>
								<TouchableNativeFeedback onPress={() => {
									modificarDatosDelComponenteS({
										...datosDelComponenteS,
										visualizacionDelMenuAgregarYoutubeVideo: true
									});
								}}>
									<View style={[estilos.botonFuncionalidadMenuHorizontal, {left: (datosDelComponenteR.current.separadorEntreFuncionalidades / 2)}]}>
										<Icon4 name={"youtube"} size={datosDelComponenteR.current.tamanioDeFuncionalidad * .7} color={'black'}/>
									</View>
								</TouchableNativeFeedback>

								<>{(datosDelComponenteS.visualizacionDelMenuAgregarYoutubeVideo) ?
									<Modal visible={true} onRequestClose={() => {
										modificarDatosDelComponenteS({
											...datosDelComponenteS,
											visualizacionDelMenuAgregarYoutubeVideo: false,
											textoDelTextInputYoutubeVideo: null
										});
									}} transparent={true}>
										<View style={{backgroundColor: "rgba(1,1,1,.5)", width: "100%", height: "100%", justifyContent: "center", alignItems: "center", }}>
											<View style={{width: "95%", height: "90%", alignItems: "center", backgroundColor:"#c8d6e5", borderRadius:20, overflow: "hidden"}}>
												<View style={{width: "100%", height: "10%", backgroundColor:"#222f3e", flexDirection: "row", justifyContent: "space-around", alignItems: "center", overflow: "hidden"}}>
													<Text style={{fontSize: 18, color: "#2e86de"}}>"Agregar Un Vídeo De Youtube"</Text>
													<Icon type="font-awesome" name="close" size={24} color={"#fff"} onPress={() => {
														modificarDatosDelComponenteS({
															...datosDelComponenteS,
															visualizacionDelMenuAgregarYoutubeVideo: false,
															textoDelTextInputYoutubeVideo: null
														});
													}} />
												</View>

												<View style={{width: "100%", height: "90%", overflow: "hidden"}}>
													<ScrollView contentContainerStyle={{ alignItems: "center" }}>
														<Text style={{alignSelf: "center"}}>{"Pega el link del vídeo de Youtube:"}</Text>
														<TextInput
															style={{alignSelf: "center"}}
															placeholder={"Pega aquí el link..."}
															value={datosDelComponenteS.textoDelTextInputYoutubeVideo}
															onChangeText={(text) => {
																modificarDatosDelComponenteS({
																	...datosDelComponenteS,
																	textoDelTextInputYoutubeVideo: text
																});
															}}
														/>
														<View style={{alignSelf: "center", width: "50%", height: 30, backgroundColor: "#2e86de", overflow: "hidden", borderRadius: 20}}>
															<TouchableNativeFeedback onPress={eventos.agregarComponenteDeYoutubeVideo}>
																<View style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
																	<Text>Crear Componente</Text>
																</View>
															</TouchableNativeFeedback>
														</View>
													</ScrollView>
												</View>
											</View>
										</View>
									</Modal>
								:
									null
								}
								</>

								<TouchableNativeFeedback onPress={eventos.botonAgregarComponenteDeArchivo}>
									<View style={[estilos.botonFuncionalidadMenuHorizontal, {left: ((datosDelComponenteR.current.separadorEntreFuncionalidades / 2) * 2)+ (datosDelComponenteR.current.anchoInicial)}]}>
										<Icon9 name={"files-o"} size={datosDelComponenteR.current.tamanioDeFuncionalidad * .7} color={'black'}/>
									</View>
								</TouchableNativeFeedback>
								<TouchableNativeFeedback onPress={eventos.botonAgregarComponenteDeTexto}>
									<View style={[estilos.botonFuncionalidadMenuHorizontal, {left: ((datosDelComponenteR.current.separadorEntreFuncionalidades / 2) * 3)+ (datosDelComponenteR.current.anchoInicial * 2) }]}>
										<Icon1 name={"format-text"} size={datosDelComponenteR.current.tamanioDeFuncionalidad * .7} color={'black'}/>
									</View>
								</TouchableNativeFeedback>
							</Animated.View>
						</View>
					:
						null
					}
				</>
			:
				null
			}
		</>
		);
	}


	const Triangulo = () => {
		const estilos = StyleSheet.create({
			cuadrado: {
				backgroundColor: 'red',
				height: '100%',
				width: 60,
				position: 'absolute',
				left: 30
			},
			triangulo1: {
				width: 0,
				height: 0,
				backgroundColor: 'transparent',
				borderStyle: 'solid',
				borderRightWidth: 30,
				borderBottomWidth: 25,
				borderRightColor: 'red',
				borderBottomColor: 'transparent',
				position: 'absolute',
				left: 0,
				top: 0



			},
			triangulo2: {
				width: 0,
				height: 0,
				backgroundColor: 'transparent',
				borderStyle: 'solid',
				borderRightWidth: 30,
				borderTopWidth: 25,
				borderTopColor: 'transparent',
				borderRightColor: 'red',
				position: 'absolute',
				left: 0,
				bottom: 0
			}
		});

		return (
			<View style={{width: '100%', height: 50, backgroundColor: 'lightblue'}}>
				<View style={estilos.cuadrado}/>
				<View style={estilos.triangulo1}/>
				<View style={estilos.triangulo2}/>
			</View>

		);
	}

	return (
	<Modal  animationType="slide" transparent={true} visible={true} onRequestClose={() => {
		props.modificarIndice("Mostrar Hojas De Libreta Del Apartado Privado");
	}}>
		<View style={{backgroundColor : 'rgba(218, 218, 218, 1)' , width : '100%' , height : '100%'}}>
			<StatusBar backgroundColor={'#111'}/>

			{(mostrarCargandoInicial) ?
				<CargandoInicial />
			:
				null
			}

			<ScrollView style={{zIndex : 1}}>
			{(mostrarCargandoInicial) ?
				null
			:
				<><>{console.log('TareasPendientes = ', datosEspecificosR.current.arregloDeTareasPendientes)}</>
				<Text style={{fontFamily: "Viga-Regular",fontSize: 18,textAlign:"center", color: "#111",marginTop:17,marginBottom:17}}>{variablesDentroDeMochila.eleccionNombreDeHoja}</Text>
				<ConjuntoDeComponentes />
				</>
			}
			</ScrollView>

			{(mostrarCargandoInicial) ?
				null
			:
				<BotonDeMenu />
			}
		</View>
	</Modal>

	);
}

export default VisualizarHojaDelApartadoPrivado;
//xd pues nose