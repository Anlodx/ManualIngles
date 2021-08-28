import React,  {useRef, useState,useEffect} from 'react';
import {ToastAndroid,TouchableOpacity,TextInput, Image,Text, View, StyleSheet, Alert, SafeAreaView, ScrollView, Picker, StatusBar, Button, Dimensions, TouchableNativeFeedback, TouchableNativeFeedbackBase } from 'react-native';

//ESTE ES EL ARCHIVO PRINCIPAL PARA TODO LO RELACIONADO A libretas, hojas, libros, visualizarHoja


//ASYNC FUNCIONA CORRECTAMENTE
//APARTADOS DE MOCHILA COMO PROPIETARIO
//COMPONENTES NECESARIOS PARA apartadosDeMochila
import ApartadoElegido from './apartadoElegido.js';

import MostrarLibretasDelApartadoPrivado from './apartadoPrivado/mostrarLibretas.js';

import MostrarHojasDeLibretaDelApartadoPrivado from './apartadoPrivado/mostrarHojasDeLibreta.js';
import VisualizarHojaDelApartadoPrivado from './apartadoPrivado/visualizarHoja.js';

import {useSelector, useDispatch} from 'react-redux';
import {establecerVariablesDentroDeMochilaEnApartadosDeMochila, traerAVariablesDentroDeMochilaEnApartadosDeMochila} from '../../../store/actions.js';
import {traerDatosDeLibretasAVariablesDentroDeMochilaEnApartadoElegido, traerDatosDeLibrosAVariablesDentroDeMochilaEnApartadoElegido} from '../../../store/actions.js';


import MostrarLibretasDelApartadoPublico from './apartadoPublico/mostrarLibretas.js';
import MostrarHojasDeLibretaDelApartadoPublico from './apartadoPublico/mostrarHojasDeLibreta.js';
import VisualizarHojaDelApartadoPublico from './apartadoPublico/visualizarHoja.js';

import MostrarLibrosDelApartadoPrivado from './apartadoPrivado/mostrarLibros.js';
import MostrarLibrosDelApartadoPublico from './apartadoPublico/mostrarLibros.js';

import Icon7 from 'react-native-vector-icons/Ionicons';
import { Icon } from 'react-native-elements';


const alturaNativaInicial = Math.round(Dimensions.get('window').height);
const anchoNativoInicial =  Math.round(Dimensions.get('window').width);
const alturaBarraInicial = Math.round(StatusBar.currentHeight);
const alturaDeVistaInicial = Math.round(Dimensions.get('window').height) - Math.round(StatusBar.currentHeight);

const AnchoPantalla = Dimensions.get("window").width;
const AltoPantalla = Dimensions.get("window").height;


const ApartadosDeMochila = (props) => {
	const dispatch = useDispatch();
	const variablesDentroDeMochila = useSelector(store => store.variablesDentroDeMochila);


	//VARIABLE NECESARIA PARA EL INTERCAMBIO A: apartadosDeMochila, apartadoElegido, mostrarLibretas, mostrarHojasDeLibreta, visualizarHoja
	const [indice, modificarIndice] = useState('Apartados De Mochila');

		//NO OCUPO RE-RENDERIZAR


	const BotonDeApartado = (props) => {
		return (
			<TouchableOpacity style={props.estilo} onPress={() => {establecerTraerYRedireccionar(props.tipo);}}>{props.children}</TouchableOpacity>
		);
	}

	const establecerTraerYRedireccionar = async (apartado) => {

		//establecer apartado elegido
		//traer cantidad de libretas, examenes y hojas sueltas de dicho apartado (apartado privado)
		//redireccionar a la siguiente ventana

		//EJEMPLOS
		//apartado = "apartado privado"
		//apartado = "apartado publico"
		//alert(apartado);

		//ESTABLECER
		dispatch(establecerVariablesDentroDeMochilaEnApartadosDeMochila(apartado));





		//TRAER
		/*
			$datos->matricula
			$datos->eleccionDeApartado
		*/

		let json = JSON.stringify({
			matricula: variablesDentroDeMochila.matriculaDelPropietario,
			eleccionDeApartado: apartado
		});
		let datos = new FormData();
		datos.append('indice', json);
		let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/accionesEnApartados/mostrar/traerCantidadesAApartadosDeMochila.php',{
			method:'POST',
			body:datos
		})
		.then((mensaje) => mensaje.text())
		.then((respuesta) => {
			//respuesta = String
			//respuesta = Objeto con informacion
			//respuesta es un JSON y String
			let cantidades = JSON.parse(respuesta);
			//cantidades es un objeto
			//cantidades.cantidadDeLibretas
			//cantidades...

			//ACTUALIZO LOS DATOS VIAJANTES
			dispatch(traerAVariablesDentroDeMochilaEnApartadosDeMochila(cantidades));

			//DESPUES DE ESTABLECER, Y TRAER (ESTABLECIENDO NUEVAMENTE LAS CANTIDADES DE LIBRETAS, EXAMENES Y HOJAS SUELTAS)
			//EJECUTO REDIRECCIONAR


			//REDIRECCIONAR
			modificarIndice('Apartado Elegido');
		})
		.catch((error) => {
			console.log("acaso es el alert 1: "+error);
			console.log("variables dentro de mochila con el error de hace rato: ",variablesDentroDeMochila.matriculaDelPropietario)
			console.log("esto es el apartado que le pasamos al metodo que da el error: ",apartado)
		});
		//nunca debe de llegar a este error

		//ELECCION DE APARTADO YA ESTA MODIFICADO
		//YA TIENE eleccionDeApartado = 'apartado privado' (por ejemplo)

	}

	const MenuHorizontal = (props) => {

		return(
			<>

				<View style={{flexDirection: "row"}}>

					<View style={{left: (anchoNativoInicial * .1), borderRadius: 15, height: 30, width: (anchoNativoInicial * .2), backgroundColor:"none", borderBottomWidth:3, borderBottomColor:"#00E676", overflow: "hidden"}}>
						<TouchableNativeFeedback
						 onPress={()=>{
							 modificarIndice(props.direccion)
							 if(props.evento != null){
								 	props.evento();
							 }

						 }}>
							<View style={{width: "100%", height: "100%", alignItems: "center", justifyContent: "center"}}>
								<Icon7 name={"arrow-back"} size={(anchoNativoInicial * .1)}/>
							</View>
						</TouchableNativeFeedback>
					</View>

				</View>

				<View style={{height: 5}} />
			</>
		);
	}

	return (
		<>
			{(indice === 'Apartados De Mochila') ?
				<ScrollView>
					<>{/*<StatusBar backgroundColor={'rgb(66,66,132)'}/>*/}</>
					<BotonDeApartado tipo={"apartado publico"} estilo={{alignSelf:"center",width:AnchoPantalla * (0.7) ,padding:20,flexDirection:"row",justifyContent:"space-around",alignItems:"center",backgroundColor:"#FF5722",margin:20,borderRadius:20}}>
						<Icon type="material" name="public" size={35} color="#FFC107" />
	          <Text style={{fontFamily: "Viga-Regular",color:"white",fontSize:17,fontWeight:"200",textAlign:"center"}}>Apartado Público</Text>
					</BotonDeApartado>
					<Text></Text>
					<BotonDeApartado tipo={"apartado privado"} estilo={{alignSelf:"center",width:AnchoPantalla * (0.7) ,padding:20,flexDirection:"row",justifyContent:"space-around",alignItems:"center",backgroundColor:"#FFC107",margin:20,borderRadius:20}}>
						<Icon type="material" name="phonelink-lock" size={35} color="#FF5722" />
	          <Text style={{fontFamily: "Viga-Regular",color:"white",fontSize:17,fontWeight:"200",textAlign:"center"}}>Apartado Privado</Text>
					</BotonDeApartado>
				</ScrollView>
			: (indice === 'Apartado Elegido') ?
				<>

				<MenuHorizontal direccion={'Apartados De Mochila'}/>
					<ApartadoElegido
						modificarIndice={(valor) => {
							//ESTA ES UNA PRUEBA, RECUERDA MODIFICARLO DESPUES
							modificarIndice(valor);
						}}
					/>
				</>
			: (indice === 'Mostrar Libretas Del Apartado Privado') ?//ya quedo hecho para recargar y viajar
			<>
			<MenuHorizontal direccion={'Apartado Elegido'}
			evento={()=>{
				establecerTraerYRedireccionar("apartado privado")
			}}/>
				<MostrarLibretasDelApartadoPrivado
					modificarIndice={(valor) => {
						//ESTA ES UNA PRUEBA, RECUERDA MODIFICARLO DESPUES
						modificarIndice(valor);
					}}
				/>
				</>
			: (indice === 'Mostrar Hojas De Libreta Del Apartado Privado') ?//ya quedo hecho para recargar y viajar
			<>
			<MenuHorizontal direccion={'Mostrar Libretas Del Apartado Privado'}
			evento={async ()=>{
				let json = JSON.stringify({
					matricula: variablesDentroDeMochila.matriculaDelPropietario,
					eleccionDeApartado: variablesDentroDeMochila.eleccionDeApartado
				});
				let datos = new FormData();
				datos.append('indice', json);


					//EN ESTE EJEMPLO, ENTRARE AQUI
					//TRAER
					//TRAER LIBRETAS (NOMBRES DE LIBRETAS, CANTIDAD DE HOJAS EN LAS LIBRETAS)
					let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/accionesEnApartados/mostrar/traerDatosDeLibretasAApartadoElegido.php',{
						method:'POST',
						body:datos
					})
					.then((mensaje) => mensaje.text())
					.then((respuesta) => {
						//respuesta puede ser un objeto JSON en STRING de la siguiente manera
						/*
						{
							"nombres" : ["React Js", "Cocina",...],
							"numerosDeHojas" : [1,0,...],
							"idsDeElemento" : ['libreta1','libreta2',...]

						}
						*/
						let objeto = null;
						//respuesta tambien puede ser "0"
						if(respuesta === "Error"){
							ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
							objeto = {
								nombres: [],
								numerosDeHojas: [],
								idsDeElemento: [],
								descripciones: [],
								fechasDeSubida: []
							}
						}
						else if(respuesta === "0"){
							//NO HAY NINGUNA LIBRETA CREADA
							//NO MODIFICO LOS ARREGLOS
							objeto = {
								nombres: [],
								numerosDeHojas: [],
								idsDeElemento: [],
								descripciones: [],
								fechasDeSubida: []
							}
						}
						else{
							//respuesta = "{..."
							//SI HAY LIBRETAS
							//ENTONCES SI MODIFICO LOS ARREGLOS
							objeto = JSON.parse(respuesta);
							//objeto TIENE TODA LA INFORMACION ACERCA DE LAS LIBRETAS
							//objeto.nombres
							//objeto.numerosDeHojas
							//objeto.idsDeElemento

							//TRAER

							//AQUI YA TRAJE LOS DATOS

						}
						dispatch(traerDatosDeLibretasAVariablesDentroDeMochilaEnApartadoElegido(objeto));

					})
					.catch((error) => {console.log("acaso es el alert 2: "+error);});






			}}/>
				<MostrarHojasDeLibretaDelApartadoPrivado
					modificarIndice={(valor) => {
						//ESTA ES UNA PRUEBA, RECUERDA MODIFICARLO DESPUES
						modificarIndice(valor);
					}}
				/>
				</>
			: (indice === 'Visualizar Hoja Del Apartado Privado') ?//ya quedo hecho para recargar y viajar
			<>

				<VisualizarHojaDelApartadoPrivado
					modificarIndice={(valor) => {
						//ESTA ES UNA PRUEBA, RECUERDA MODIFICARLO DESPUES
						modificarIndice(valor);
					}}
				/>
				</>
			: (indice === 'Mostrar Libretas Del Apartado Publico') ?//----------No se si ya quedo hecho para recargar y viajar
			<>
			<MenuHorizontal direccion={'Apartado Elegido'}
			evento={()=>{
				establecerTraerYRedireccionar("apartado publico")
			}}/>
				<MostrarLibretasDelApartadoPublico
					modificarIndice={(valor) => {
						//ESTA ES UNA PRUEBA, RECUERDA MODIFICARLO DESPUES
						modificarIndice(valor);
					}}
				/>
			</>
			: (indice === 'Mostrar Hojas De Libreta Del Apartado Publico') ?//----------No se si ya quedo hecho para recargar y viajar
			<>
			<MenuHorizontal direccion={'Mostrar Libretas Del Apartado Publico'}
			evento={async ()=>{
				let json = JSON.stringify({
					matricula: variablesDentroDeMochila.matriculaDelPropietario,
					eleccionDeApartado: variablesDentroDeMochila.eleccionDeApartado
				});
				let datos = new FormData();
				datos.append('indice', json);


					//EN ESTE EJEMPLO, ENTRARE AQUI
					//TRAER
					//TRAER LIBRETAS (NOMBRES DE LIBRETAS, CANTIDAD DE HOJAS EN LAS LIBRETAS)
					let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/accionesEnApartados/mostrar/traerDatosDeLibretasAApartadoElegido.php',{
						method:'POST',
						body:datos
					})
					.then((mensaje) => mensaje.text())
					.then((respuesta) => {

						let objeto = null;
						//respuesta tambien puede ser "0"
						if(respuesta === "Error"){
							ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
							objeto = {
								nombres: [],
								numerosDeHojas: [],
								idsDeElemento: [],
								descripciones: [],
								fechasDeSubida: []
							}
						}
						else if(respuesta === "0"){
							//NO HAY NINGUNA LIBRETA CREADA
							//NO MODIFICO LOS ARREGLOS
							objeto = {
								nombres: [],
								numerosDeHojas: [],
								idsDeElemento: [],
								descripciones: [],
								fechasDeSubida: []
							}
						}
						else{
							//respuesta = "{..."
							objeto = JSON.parse(respuesta);

						}
						dispatch(traerDatosDeLibretasAVariablesDentroDeMochilaEnApartadoElegido(objeto));

					})
					.catch((error) => {console.log("acaso es el alert 3: "+error);});


			}}/>
				<MostrarHojasDeLibretaDelApartadoPublico
					modificarIndice={(valor) => {
						//ESTA ES UNA PRUEBA, RECUERDA MODIFICARLO DESPUES
						modificarIndice(valor);
					}}
				/>
				</>

			: (indice === 'Visualizar Hoja Del Apartado Publico') ?//ya quedo hecho para recargar y viajar
				<VisualizarHojaDelApartadoPublico
					modificarIndice={(valor) => {
						//ESTA ES UNA PRUEBA, RECUERDA MODIFICARLO DESPUES
						modificarIndice(valor);
					}}
				/>
			: (indice === 'Mostrar Libros Del Apartado Privado') ?//ya quedo hecho para recargar y viajar
			<>
			<MenuHorizontal direccion={'Apartado Elegido'}
			evento={()=>{
				establecerTraerYRedireccionar("apartado privado")
				console.log("hola mundo => Mostrar Libros Del Apartado Privado")
			}}/>
				<MostrarLibrosDelApartadoPrivado
					modificarIndice={(valor) => {
						//ESTA ES UNA PRUEBA, RECUERDA MODIFICARLO DESPUES
						modificarIndice(valor);
					}}
				/>
				</>
			: (indice === "Mostrar Libros Del Apartado Publico") ?//----------No se si ya quedo hecho para recargar y viajar
			<>
			<MenuHorizontal direccion={'Apartado Elegido'}
			evento={()=>{
				establecerTraerYRedireccionar("apartado publico")
			}}/>
				<MostrarLibrosDelApartadoPublico
					modificarIndice={(valor) => {
						modificarIndice(valor);
					}}
				/>
				</>
			:
				null
			}
		</>
	);
}

export default ApartadosDeMochila;
