import React,  {useRef} from 'react';
import {ToastAndroid,TouchableOpacity,TextInput, Image,Text, View, StyleSheet, Alert, SafeAreaView, ScrollView, Picker, StatusBar, Button, Dimensions } from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {traerDatosDeLibretasAVariablesDentroDeMochilaEnApartadoElegido, traerDatosDeLibrosAVariablesDentroDeMochilaEnApartadoElegido} from '../../../store/actions.js';

const AnchoPantalla = Dimensions.get("window").width;
const AltoPantalla = Dimensions.get("window").height;


//AUN NO ESTA ACABADO
//ASYNC FUNCIONA CORRECTAMENTE

//YO NO QUIERO RE-RENDERIZAR
//PORQUE TARDA MUCHO EN RE-RENDERIZAR

//APARTADO ELEGIDO COMO DUEÑO
//(TAMBIEN TENDRA UNA COPIA PARA ESPECTADOR)

const ApartadoElegido = (props) => {
	const variablesDentroDeMochila = useSelector(store => store.variablesDentroDeMochila);
	const dispatch = useDispatch();

	const Boton = (props) => {
		return(
			<TouchableOpacity style={[props.estilo,{alignSelf:"center",justifyContent: 'center',alignItems: 'center',width:AnchoPantalla * (0.7) ,padding:15,margin:8,borderRadius:10}]} onPress={() => {establecerTraerYRedireccionar(props.tipo);} }>{props.children}</TouchableOpacity>
		);
	}

	const establecerTraerYRedireccionar = async (eleccion) => {
		//EVENTO DEL BOTON

		//BORRA ESTO
		//ESTABLECER
		//NULO
		//datosViajantes.current = {...datosViajantes.current,eleccionDeVisualizacion:eleccion};

		//TRAER (DATOS DE LIBRETAS)
		/*
			Se necesita LLEVAR esto:
			$datos->matricula
			$datos->eleccionDeApartado
		*/
		let json = JSON.stringify({
			matricula: variablesDentroDeMochila.matriculaDelPropietario,
			eleccionDeApartado: variablesDentroDeMochila.eleccionDeApartado
		});
		let datos = new FormData();
		datos.append('indice', json);
		//PROCEDEMOS A CREAR LA PROMESA
		if(eleccion === 'libretas'){
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
				//REDIRECCIONAR
				//IR A mostrarLibretasDelApartadoElegido.js
				//ENVIO TODO EL OBJETO "DATOSVIAJANTES"

				//mostrarLibretas.js VA A TENER 3 COPIAS (1 PARA APARTADO PRIVADO, 1 PARA APARTADO PUBLICO, 1 PARA ESPECTADOR)
				//MIENTRAS, REDIRECCIONA A mostrarLibretas.js DEL APARTADO PRIVADO (PARA ALUMNO NORMAL)
				if(variablesDentroDeMochila.eleccionDeApartado === 'apartado privado'){

					//navigation.navigate('Mostrar Libretas Del Apartado Privado',datosViajantes.current);
					props.modificarIndice('Mostrar Libretas Del Apartado Privado');
				}
				else if(variablesDentroDeMochila.eleccionDeApartado === 'apartado publico'){
					//REDIRECCIONAR A APARTADO PUBLICO O ESPECTADOR
					props.modificarIndice('Mostrar Libretas Del Apartado Publico');
				}
			})
			.catch((error) => {
				console.log(error);
				ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
			});



		}
		else if(eleccion === 'examenes'){

		}
		else if(eleccion === 'libros'){
			let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/accionesEnApartados/mostrar/traerDatosDeLibrosAApartadoElegido.php', {
				method: 'POST',
				body: datos
			})
			.then(msj => msj.text())
			.then(respuesta => {
				let arreglo = null;
				if(respuesta === "Error"){
					ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
					arreglo = [];
				}
				else{
					arreglo = JSON.parse(respuesta);
				}

				dispatch(traerDatosDeLibrosAVariablesDentroDeMochilaEnApartadoElegido(arreglo));

				if(variablesDentroDeMochila.eleccionDeApartado === 'apartado privado'){

					//navigation.navigate('Mostrar Libretas Del Apartado Privado',datosViajantes.current);
					props.modificarIndice('Mostrar Libros Del Apartado Privado');
				}
				else if(variablesDentroDeMochila.eleccionDeApartado === 'apartado publico'){
					//REDIRECCIONAR A APARTADO PUBLICO O ESPECTADOR
					props.modificarIndice('Mostrar Libros Del Apartado Publico');
				}
			})
			.catch(error => {
				ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
				console.log("error 165_ :",error)
			});
		}

	}






	/*
	datosViajantes.current.eleccionDeApartado = 'apartado privado'
	datosViajantes.current.eleccionDeApartado = 'apartado publico'
	*/
	return (
	<View>


		<Text style={{fontFamily: "Viga-Regular",textAlign: 'center',color:"#6F1E51"}}>{"Estás en: " + variablesDentroDeMochila.eleccionDeApartado}</Text>
		<Text style={{fontFamily: "Viga-Regular",textAlign: 'center'}}>Elige que deseas visualizar dentro de este apartado</Text>
		<Text />
		<Boton estilo={{backgroundColor:'lightsalmon'}} tipo={'libretas'}><Text style={{textAlign:'center',width:AnchoPantalla * (0.7)}}>{(variablesDentroDeMochila.eleccionDeApartado === 'apartado privado') ? 'Libretas privadas' : 'Libretas públicas'}</Text><Text style={{textAlign: 'center',width:AnchoPantalla * (0.7)}}>{'No. de libretas : ' + (variablesDentroDeMochila.cantidadDeLibretas)}</Text></Boton>
		<Text />
		<Boton estilo={{backgroundColor:'lightseagreen'}} tipo={'libros'}><Text style={{textAlign:'center',width:AnchoPantalla * (0.7)}}>{(variablesDentroDeMochila.eleccionDeApartado === 'apartado privado') ? 'Libros privados' : 'Libros públicos'}</Text><Text style={{textAlign: 'center',width:AnchoPantalla * (0.7)}}>{'No. de libros : ' + (variablesDentroDeMochila.cantidadDeLibros)}</Text></Boton>
		<Text />


	</View>
	);
}

export default ApartadoElegido;
