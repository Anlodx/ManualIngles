import React,  {useRef, useState} from 'react';
import {ToastAndroid,TouchableOpacity,TextInput, Image,Text, View, ActivityIndicator, StyleSheet, Alert, SafeAreaView, ScrollView, Picker, StatusBar, Button, Dimensions, TouchableNativeFeedback, Modal } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon1 from 'react-native-vector-icons/SimpleLineIcons';
import ImagenDeLibreta from './../../../global/imagenes/Libreta1.png';

import {useSelector, useDispatch} from 'react-redux';
import {establecerVariablesDentroDeMochilaEnMostrarLibretasDelApartadoPrivado, traerAVariablesDentroDeMochilaEnMostrarLibretasDelApartadoPrivado, traerDatosDeLibretasAVariablesDentroDeMochilaEnApartadoElegido} from '../../../../store/actions.js';
import {Fecha} from '../../../global/codigosJS/Metodos.js';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {Icon} from 'react-native-elements';


const AnchoPantalla = Dimensions.get("window").width;
const AltoPantalla = Dimensions.get("window").height;


//ASYNC FUNCIONA CORRECTAMENTE

//MOSTRAR LIBRETAS DEL APARTADO ELEGIDO COMO PROPIETARIO
//(TAMBIEN HABRA UNA COPIA PARA ESPECTADOR)

const anchoNativoInicial =  Math.round(Dimensions.get('window').width);
const alturaDeVistaInicial = Math.round(Dimensions.get('window').height) - Math.round(StatusBar.currentHeight);

const MostrarLibretasDelApartadoPrivado = (props) => {

	const datosDeCredencial = useSelector(store => store.datosDeCredencial);
	const variablesDentroDeMochila = useSelector(store => store.variablesDentroDeMochila);
	const dispatch = useDispatch();


	//BotonDeLibreta esta libre
	const BotonDeLibreta = (props) => {
		const datosDelComponenteR = useRef({
			alturaDeScrollView: (alturaDeVistaInicial * .9) * .9
		});

		const [datosDelComponenteS, modificarDatosDelComponenteS] = useState({
			muestreoDelModal: false,
			estadoDelModal: 1,
			/*
				1 => INICIO
				2 => Editar
				3 => Eliminar
			*/
			nombreDeLibreta: "",
			descripcionDeLibreta: "",

			cargandoSubidaORemplazada: false,
			respuestaDelServidorPorSubirORemplazar: null
		});

		const estilo = StyleSheet.create({
			contenedor: {

				width: (Math.round(Dimensions.get('window').width)) - 50,
				backgroundColor : 'cornflowerblue',
				left : 25,
				borderRadius : 10
			},
			imagenDeLibreta : {
				position:'absolute',
				left : 10,
				top : 5
			},
			caja : {

				backgroundColor:'rgb(72,129,234)',
				borderRadius : 10,
				fontSize:17,
				textAlignVertical:'center',
				left: 45,
				color:'#000000',
				width: ((Math.round(Dimensions.get('window').width)) - 50) - (10 + 30 + 30 + 5 + 5)
			},
			opciones : {
				position:'absolute',
				backgroundColor:'rgb(72,129,234)',
				width:30,
				height:48,
				borderTopRightRadius:10,
				borderBottomLeftRadius:10,
				alignItems:'center',
				justifyContent:'center',
				left : ((Math.round(Dimensions.get('window').width)) - 50) - 30
			},
			texto : {
				left : 45
			}
		});

		const eventos = {
			onCloseModal: () => {
				if(datosDelComponenteS.muestreoDelModal){
					modificarDatosDelComponenteS({
						...datosDelComponenteS,
						muestreoDelModal: !(datosDelComponenteS.muestreoDelModal),
						estadoDelModal: 1,
						/*
							1 => INICIO
							2 => Editar
							3 => Eliminar
						*/
						nombreDeLibreta: "",
						descripcionDeLibreta: "",

						cargandoSubidaORemplazada: false,
						respuestaDelServidorPorSubirORemplazar: null
					});
				}
				else{
					modificarDatosDelComponenteS({
						...datosDelComponenteS,
						muestreoDelModal: !(datosDelComponenteS.muestreoDelModal)
					});
				}

			},
			traerDatosDeLibretas: async () => {
				let json = JSON.stringify({
					matricula: variablesDentroDeMochila.matriculaDelPropietario,
					eleccionDeApartado: variablesDentroDeMochila.eleccionDeApartado,
				});

				let datos = new FormData();
				datos.append('indice', json);

				let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/accionesEnApartados/mostrar/traerDatosDeLibretasAApartadoElegido.php',{
					method:'POST',
					body:datos
				})
				.then((mensaje) => mensaje.text())
				.then((respuesta) => {
					let objeto = null;
					if(respuesta === "0"){
						//NO HAY NINGUNA LIBRETA CREADA
						//NO MODIFICO LOS ARREGLOS

						//Nunca entrara aqui
						objeto = {
							nombres: [],
							numerosDeHojas: [],
							idsDeElemento: []
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
						//Ya se que no es Apartado Elegido

						//AQUI YA TRAJE LOS DATOS
					}

					dispatch(traerDatosDeLibretasAVariablesDentroDeMochilaEnApartadoElegido(objeto));
				})
				.catch((error) => {

				});
			},
			editarNombreDeLibreta: async () => {
				if(datosDelComponenteS.nombreDeLibreta != ""){
					let objeto = {
						matricula: variablesDentroDeMochila.matriculaDelPropietario,
						idDeElemento: props.elemento,
						nombreNuevo: datosDelComponenteS.nombreDeLibreta
					}
					let json = JSON.stringify(objeto);
					let datos = new FormData();
					datos.append("indice", json);

					let promesa = await fetch("http://backpack.sytes.net/servidorApp/php/accionesEnApartados/editar/editarNombreDeLibreta.php", {
						method: "POST",
						body: datos
					})
					.then((mensaje) => mensaje.text())
					.then((respuesta) => {
						if(respuesta === "Exito"){
							eventos.traerDatosDeLibretas();
							Alert.alert("Exito", "Edición de nombre se efectuó correctamente.", [
								{
									text: "Ok"
								}
							]);
						}
						else if(respuesta === "Error"){
							Alert.alert("Error", "Sucedió un error.", [
								{
									text: "OK"
								}
							]);
						}
					})
					.catch((error) => {
						Alert.alert("Error", error, [
							{
								text: "OK"
							}
						]);
					});
				}
				else{
					Alert.alert("Error", "Falta ingresar información", [
						{
							text: "OK"
						}
					]);
				}
			},
			editarDescripcionDeLibreta: async () => {
				if(datosDelComponenteS.descripcionDeLibreta != ""){
					let objeto = {
						matricula: variablesDentroDeMochila.matriculaDelPropietario,
						idDeElemento: props.elemento,
						descripcionNueva: datosDelComponenteS.descripcionDeLibreta
					}
					let json = JSON.stringify(objeto);
					let datos = new FormData();
					datos.append("indice", json);

					let promesa = await fetch("http://backpack.sytes.net/servidorApp/php/accionesEnApartados/editar/editarDescripcionDeLibreta.php", {
						method: "POST",
						body: datos
					})
					.then((mensaje) => mensaje.text())
					.then((respuesta) => {
						if(respuesta === "Exito"){
							eventos.traerDatosDeLibretas();
							Alert.alert("Exito", "Edición de descripción se efectuó correctamente.", [
								{
									text: "Ok"
								}
							])
						}
						else if(respuesta === "Error"){
							Alert.alert("Error", "Ocurrio un error.", [
								{
									text: "OK"
								}
							]);
						}
					})
					.catch((error) => {
						Alert.alert("Error", error, [
							{
								text: "OK"
							}
						]);
					});
				}
				else{
					Alert.alert("Error", "Falta ingresar información", [
						{
							text: "OK"
						}
					]);
				}
			},
			eliminarLibreta: async () => {
				let objeto = {
					matricula: variablesDentroDeMochila.matriculaDelPropietario,
					eleccionDeApartado: variablesDentroDeMochila.eleccionDeApartado,
					idDeLibreta: props.elemento
				}
				let json = JSON.stringify(objeto);
				let datos = new FormData();
				datos.append("indice", json);
				let promesa = await fetch("http://backpack.sytes.net/servidorApp/php/accionesEnApartados/eliminar/eliminarLibreta.php", {
					method: "POST",
					body: datos
				})
				.then(mensaje => mensaje.text())
				.then(respuesta => {
					if(respuesta === "Hecho"){
						eventos.traerDatosDeLibretas();
						eventos.onCloseModal();
					}
					else{
						console.log("Respuesta = ", respuesta);
						Alert.alert("Error", "Ocurrió un error, lamentablemente.", [
							{
								text: "Ok"
							}
						]);
					}
				})
				.catch((error) => {
					console.log("Error", error);
					Alert.alert("Error", "Ocurrió un error.", [
						{
							text: "Ok"
						}
					]);
				});
			},
			subirORemplazarLibretaEnApartadoPublico: async () => {
				let objeto = {
					matricula: variablesDentroDeMochila.matriculaDelPropietario,
					idDeLibreta: props.elemento
				}

				let json = JSON.stringify(objeto);
				let datos = new FormData();
				datos.append("indice", json);
				let promesa = await fetch("http://backpack.sytes.net/servidorApp/php/accionesEnApartados/subirORemplazarEnApartadoPublico/subirORemplazarLibretaEnApartadoPublico.php", {
					method: "POST",
					body: datos
				})
				.then(mensaje => mensaje.text())
				.then(respuesta => {
					if(respuesta === "HECHO"){
						modificarDatosDelComponenteS({
							...datosDelComponenteS,
							respuestaDelServidorPorSubirORemplazar: "Libreta subida o remplazada correctamente.",
							cargandoSubidaORemplazada: false
						});
						eventos.insertarNotificacionDeLibretaNueva();
					}
					else{
						console.log(respuesta);
						modificarDatosDelComponenteS({
							...datosDelComponenteS,
							respuestaDelServidorPorSubirORemplazar: "Error al subir o remplazar la libreta.",
							cargandoSubidaORemplazada: false
						});
					}
				})
				.catch((error) => {
					Alert.alert("Error", error, [
						{
							text: "Ok"
						}
					]);
				});
			},
			insertarNotificacionDeLibretaNueva: async ()=>{
				let json = JSON.stringify({
					matricula: variablesDentroDeMochila.matriculaDelPropietario,
					idDeLibreta: props.elemento + "_" + variablesDentroDeMochila.matriculaDelPropietario
				});

				let datos = new FormData();
				datos.append('indice', json);

				let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/accionesEnApartados/insertarNotificacion/insertarNotificacionDeLibretaNueva.php',{
					method:'POST',
					body:datos
				})
				.then((mensaje) => mensaje.text())
				.then((respuesta) => {
					console.log("respuesta de notificacion de libreta => ",respuesta)
					if(respuesta !=="Hecho"){
						ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
						console.log("linea 362")
					}

				})
				.catch((error) => {
					ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
					console.log("linea 362")
				});
			}
		}



		return (
			<>
				<TouchableOpacity style={[estilo.contenedor,props.estilo]} onPress={() => {establecerTraerYRedireccionar(props.elemento, props.nombreDentroDeCaja)}}>
					<Image style={estilo.imagenDeLibreta} source={ImagenDeLibreta} />
					<TextInput defaultValue={props.nombreDentroDeCaja} editable={props.edicion} multiline={true} style={estilo.caja} />
					<TouchableOpacity onPress={eventos.onCloseModal} style={estilo.opciones}>
						<Icon1 name={'options-vertical'} />
					</TouchableOpacity>
					<Text style={estilo.texto}>{'Cantidad de hojas dentro : ' + (props.cantidadDeHojasDentro)}</Text>
				</TouchableOpacity>

				{(datosDelComponenteS.muestreoDelModal) ?
					<Modal visible={true} onRequestClose={eventos.onCloseModal} transparent={true}>
						<View style={{backgroundColor: "rgba(1,1,1,.5)", width: "100%", height: "100%", justifyContent: "center", alignItems: "center", }}>
							<View style={{width: "95%", height: "90%", alignItems: "center", backgroundColor:"#c8d6e5", borderRadius:20, overflow: "hidden"}}>
								<View style={{width: "100%", height: "10%", backgroundColor:"#222f3e", flexDirection: "row", justifyContent: "space-around", alignItems: "center", overflow: "hidden"}}>
								<Text style={{fontFamily: "Viga-Regular",textAlign: 'center',color:"#fff"}}>{props.elemento}</Text>
									<Icon type="font-awesome" name="close" size={24} color={"#fff"} onPress={eventos.onCloseModal} />
								</View>

								<View style={{width: "100%", height: "90%", overflow: "hidden"}}>
									<ScrollView contentContainerStyle={{ alignItems: "center" }}>
										{(datosDelComponenteS.estadoDelModal === 1) ?
											<>
												<View style={{height: (datosDelComponenteR.current.alturaDeScrollView) * .05}}></View>

												<View style={{width: "90%", height: (datosDelComponenteR.current.alturaDeScrollView) * .15, borderRadius: 20, backgroundColor: "lavender", borderWidth: 2, overflow: "hidden"}}>
													<TouchableNativeFeedback onPress={() => {
														modificarDatosDelComponenteS({
															...datosDelComponenteS,
															estadoDelModal: 2
														});
													}}>
														<View style={{width: "100%", height: "100%", borderRadius: 20, justifyContent: "center"}}>
															<Text style={{fontFamily: "Viga-Regular",position: "absolute", left: "10%"}}>Editar</Text>
															<Text style={{fontFamily: "Viga-Regular",position: "absolute", right: "10%"}}>{">"}</Text>
														</View>
													</TouchableNativeFeedback>
												</View>

												<View style={{height: (datosDelComponenteR.current.alturaDeScrollView) * .05}}></View>

												<View style={{width: "90%", height: (datosDelComponenteR.current.alturaDeScrollView) * .15, borderRadius: 20, backgroundColor: "lavender", borderWidth: 2, overflow: "hidden"}}>
													<TouchableNativeFeedback onPress={() => {
														modificarDatosDelComponenteS({
															...datosDelComponenteS,
															estadoDelModal: 3
														});
													}}>
														<View style={{width: "100%", height: "100%", borderRadius: 20, justifyContent: "center"}}>
															<Text style={{fontFamily: "Viga-Regular",fontSize:13,position: "absolute", left: "10%"}}>{"Subir Ó Remplazar En Apartado Público"}</Text>
															<Text style={{fontFamily: "Viga-Regular",position: "absolute", right: "10%"}}>{">"}</Text>
														</View>
													</TouchableNativeFeedback>
												</View>

												<View style={{height: (datosDelComponenteR.current.alturaDeScrollView) * .05}}></View>

												<View style={{width: "90%", height: (datosDelComponenteR.current.alturaDeScrollView) * .15, borderRadius: 20, backgroundColor: "lavender", borderWidth: 2, overflow: "hidden"}}>
													<TouchableNativeFeedback onPress={() => {
														modificarDatosDelComponenteS({
															...datosDelComponenteS,
															estadoDelModal: 4
														});
													}}>
														<View style={{width: "100%", height: "100%", borderRadius: 20, justifyContent: "center"}}>
															<Text style={{fontFamily: "Viga-Regular",position: "absolute", left: "10%"}}>Eliminar</Text>
															<Text style={{fontFamily: "Viga-Regular",position: "absolute", right: "10%"}}>{">"}</Text>
														</View>
													</TouchableNativeFeedback>
												</View>
											</>
										: (datosDelComponenteS.estadoDelModal === 2) ?
											<>
											<Text style={{fontFamily: "Viga-Regular",textAlign: 'center'}}>Nombre nuevo para la libreta:</Text>
												<TextInput
													style={{alignSelf: "center",backgroundColor:null,paddingLeft:50,paddingRight:50,borderWidth:1,borderColor:"#111",borderRadius:5,margin:10}}
													placeholder={"Escribe algo"}
													value={datosDelComponenteS.nombreDeLibreta}
													onChangeText={(text) => {
														modificarDatosDelComponenteS({
															...datosDelComponenteS,
															nombreDeLibreta: text
														});
													}}
												/>
												<View style={{alignSelf: "center", width: "50%", height: 40, backgroundColor: "#2e86de", overflow: "hidden", borderRadius: 10,margin:10}}>
													<TouchableNativeFeedback onPress={eventos.editarNombreDeLibreta}>
														<View style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
															<Text>Editar Nombre De Libreta</Text>
														</View>
													</TouchableNativeFeedback>
												</View>

												<Text style={{fontFamily: "Viga-Regular",textAlign: 'center'}}>Descripción nueva:</Text>
												<TextInput
													style={{alignSelf: "center",backgroundColor:null,paddingLeft:50,paddingRight:50,borderWidth:1,borderColor:"#111",borderRadius:5,margin:10}}
													placeholder={"Escribe algo"}
													value={datosDelComponenteS.descripcionDeLibreta}
													onChangeText={(text) => {
														modificarDatosDelComponenteS({
															...datosDelComponenteS,
															descripcionDeLibreta: text
														});
													}}
												/>
												<View style={{alignSelf: "center", width: "50%", height: 40, backgroundColor: "#2e86de", overflow: "hidden", borderRadius: 10,margin:10}}>
													<TouchableNativeFeedback onPress={eventos.editarDescripcionDeLibreta}>
														<View style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
															<Text>Editar Descripción</Text>
														</View>
													</TouchableNativeFeedback>
												</View>
											</>
										: (datosDelComponenteS.estadoDelModal === 3) ?
											<>
												{(datosDelComponenteS.cargandoSubidaORemplazada) ?
													<View>
														<ActivityIndicator size={'large'} color={'black'}/>
													</View>
												:
													<>
														{(datosDelComponenteS.respuestaDelServidorPorSubirORemplazar === null) ?
															<>
															<Text style={{fontFamily: "Viga-Regular",fontSize:13,textAlign:"center"}}>Si no hay alguna copia de esta libreta en el apartado público, esta se subirá; sin embargo, si ya la hay, esta se remplazará. ¿Estás seguro de que quieres Subir O Remplazar En Apartado Público?</Text>
																<View style={{alignSelf: "center", width: "50%", height: 40, backgroundColor: "green", overflow: "hidden", borderRadius: 10,margin:5}}>
																	<TouchableNativeFeedback onPress={() => {
																		modificarDatosDelComponenteS({
																			...datosDelComponenteS,
																			estadoDelModal: 1
																		});
																	}}>
																		<View style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
																		<Text style={{fontFamily: "Viga-Regular",fontSize:13,textAlign:"center"}}>No</Text>
																		</View>
																	</TouchableNativeFeedback>
																</View>
																<View style={{alignSelf: "center", width: "50%", height: 40, backgroundColor: "red", overflow: "hidden", borderRadius: 10,margin:5}}>
																	<TouchableNativeFeedback onPress={() => {
																		modificarDatosDelComponenteS({
																			...datosDelComponenteS,
																			cargandoSubidaORemplazada: true
																		});
																		eventos.subirORemplazarLibretaEnApartadoPublico();
																	}}>
																		<View style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
																		<Text style={{fontFamily: "Viga-Regular",fontSize:13,textAlign:"center"}}>Sí</Text>
																		</View>
																	</TouchableNativeFeedback>
																</View>
															</>
														:
															<>
																<Text>{datosDelComponenteS.respuestaDelServidorPorSubirORemplazar}</Text>
																<View style={{alignSelf: "center", width: "35%", height: 30, backgroundColor: "green", overflow: "hidden", borderRadius: 20,marginTop:20}}>
																	<TouchableNativeFeedback onPress={() => {
																		modificarDatosDelComponenteS({
																			...datosDelComponenteS,
																			estadoDelModal: 1,
																			cargandoSubidaORemplazada: false,
																			respuestaDelServidorPorSubirORemplazar: null
																		});
																	}}>
																		<View style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
																		<Text style={{fontFamily: "Viga-Regular",fontSize:13,textAlign:"center"}}>Ok</Text>
																		</View>
																	</TouchableNativeFeedback>
																</View>
															</>
														}
													</>
												}
											</>
										: (datosDelComponenteS.estadoDelModal === 4) ?
											<>
											<Text style={{fontFamily: "Viga-Regular",fontSize:13,textAlign:"center"}}>{"¿Estás seguro de que quieres eliminar esta libreta?"}</Text>
												<View style={{justifyContent: "space-around", width: "100%", flexDirection: "row",marginTop:20}}>
													<View style={{alignSelf: "center", width: "40%", height: 40, backgroundColor: "green", overflow: "hidden", borderRadius: 10}}>
														<TouchableNativeFeedback onPress={() => {
															modificarDatosDelComponenteS({
																...datosDelComponenteS,
																estadoDelModal: 1
															});
														}}>
															<View style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
															<Text style={{fontFamily: "Viga-Regular",fontSize:13,textAlign:"center"}}>No</Text>
															</View>
														</TouchableNativeFeedback>
													</View>
													<View style={{alignSelf: "center", width: "40%", height: 40, backgroundColor: "red", overflow: "hidden", borderRadius: 10}}>
														<TouchableNativeFeedback onPress={eventos.eliminarLibreta}>
															<View style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
															<Text style={{fontFamily: "Viga-Regular",fontSize:13,textAlign:"center"}}>Sí</Text>
															</View>
														</TouchableNativeFeedback>
													</View>
												</View>
											</>
										:
											null
										}
									</ScrollView>
								</View>
							</View>
						</View>
					</Modal>
				:
					null
				}
			</>
		);

	}

	//establecerTraerYRedireccionar esta libre
	const establecerTraerYRedireccionar = async (id, nombre) => {
		//NECESITO QUE UNA VEZ PRESIONADO EL BOTON, BLOQUEAR ESTA ACCION
		//¿PORQUE? PORQUE ES UNA FUNCIÓN ASYNC

		//id y nombre : SON DATOS DE UNA LIBRETA ELEGIDA
		//id = 'libreta1'
		//nombre = 'React Native'

		//ESTABLECER
		//Establezco id('libreta1') y nombre('React Native')


		//HASTA AHORITA HE MODIFICADO
		/*
		eleccionIdDeLibreta
		eleccionNombreDeLibreta
		*/
		dispatch(establecerVariablesDentroDeMochilaEnMostrarLibretasDelApartadoPrivado({
			eleccionIdDeLibreta: id,
			eleccionNombreDeLibreta: nombre
		}));

		//OCUPO ACTUALIZAR LOS DATOS DE ALLA
		//OCUPO EJECUTAR props.modificarData


		//TRAER
		//No puedo llevar todo el objeto
		//Es demasiada informacion que procesar
		/*
		SOLO LLEVARE (de los datosViajantes):
		- idDeLibreta ('libreta1')
		- matricula ('17419070110031')
		- eleccionDeApartado ('apartado privado')
		*/

		let objetoConDatos = {
			eleccionIdDeLibreta : id,
			matricula : variablesDentroDeMochila.matriculaDelPropietario,
			eleccionDeApartado : variablesDentroDeMochila.eleccionDeApartado
		}
		let json = JSON.stringify(objetoConDatos);
		let datos = new FormData();
		datos.append('indice',json);

		let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/accionesEnApartados/mostrar/traerDatosDeHojasAMostrarLibretasDelApartadoElegido.php',{
			method:'POST',
			body:datos,
		})
							.then((mensaje) => mensaje.text())
							.then((respuesta) => {
								/*
									No tiene ninguna hoja creada en dicha libreta
									respuesta = '0'

									Tiene de 1 hoja en adelante creada en dicha libreta
									respuesta = {
										nombres : ['¿Qué es React Native?',...],
										numerosDeComponentes : [0,...],
										idsDeElemento : ['hoja1',...]
									}

								*/
								let objeto = null;
								if(respuesta === "0"){
									//No tiene ninguna hoja creada en dicha libreta
									//NO MODIFICO LOS ARREGLOS DE HOJAS
									objeto = {
										nombres : [],
										numerosDeComponentes : [],
										idsDeElemento : []
									}
								}
								else{
									//SI HAY 1 O MAS HOJAS CREADAS
									//SI MODIFICO LOS ARREGLOS
									objeto = JSON.parse(respuesta);

									/*
									objeto.nombres
									objeto.numerosDeComponentes
									objeto.idsDeElemento
									*/


									////HASTA AHORITA HE MODIFICADO
									/*
									eleccionIdDeLibreta
									eleccionNombreDeLibreta
									arreglosDeHojas
									*/
									//OCUPO ACTUALIZAR LOS DATOS DE ALLA
									//OCUPO EJECUTAR props.modificarData

								}
								dispatch(traerAVariablesDentroDeMochilaEnMostrarLibretasDelApartadoPrivado(objeto));

								//REDIRECCIONAR
								//Ir a mostrarHojasDeLibreta.js
								//Dependiendo si estamos en el apartado privado, o en el apartado publico; iremos a un archivo en especifico

									//Vamos al archivo en modulos/personal/apartadoPrivado/mostrarHojasDeLibreta.js
									/*
									Que necesito llevar a la otra vista:

									idDeLibreta,
									nombreDeLibreta,
									matricula,
									eleccionDeApartado,
									arreglosDeHojas





									*/
									//AQUI OCUPO EJECUTAR props.modificarData
									//RECUERDA QUE AQUI TE QUEDASTEEEEEEEEEEEEEEEEE
									/*
									eleccionIdDeLibreta
									eleccionNombreDeLibreta
									arreglosDeHojas
									*/


									//Mostrar Hojas De Libreta Del Apartado Privado Para Alumno Normal
									/*
									navigation.navigate('Mostrar Hojas De Libreta Del Apartado Privado Para Alumno Normal',{
									eleccionIdDeLibreta : datosViajantes.current.eleccionIdDeLibreta,
									eleccionNombreDeLibreta : datosViajantes.current.eleccionNombreDeLibreta,
									matricula : datosViajantes.current.matricula,
									eleccionDeApartado : datosViajantes.current.eleccionDeApartado,
									arreglosDeHojas : datosViajantes.current.arreglosDeHojas
									});
									*/
									//Mostrar Hojas De Libreta Del Apartado Privado Para Alumno Normal
									//REDIRECCIONAR
									props.modificarIndice('Mostrar Hojas De Libreta Del Apartado Privado');




							})
							.catch((error) => {
								ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
								console.log("linea 735")
							});

	}

	//ConjuntoDeBotonesDeLibretas esta libre
	const ConjuntoDeBotonesDeLibretas = () => {
		let arreglo = [];

		if((variablesDentroDeMochila.arreglosDeLibretas.nombres).length === 0 && (variablesDentroDeMochila.arreglosDeLibretas.numerosDeHojas).length === 0){
			//alert("No hay ninguna libreta");
			arreglo.push(<View key={0} style={{alignItems:'center'}}><Text>{'No hay ninguna libreta aún :('}</Text></View>);
		}
		else{
			//alert("Felicidades, si tienes libretas creadas");
			//POR LO TANTO, SI TIENES HOJAS (0,1,...)
			let bool = false;
			let cantidad = (variablesDentroDeMochila.arreglosDeLibretas.nombres).length;
			//cantidad = 4
			//             0 <   4
			for(let i = 0; i < cantidad;i++){

			//HAY UNA CORRESPONDENCIA EN I
			/*
			nombres[3]         =\
			numerosDeHojas[3]  ==> Estos datos corresponden a la misma libreta
			idsDeElemento[3]   =/
			*/

				arreglo.push(<BotonDeLibreta elemento={variablesDentroDeMochila.arreglosDeLibretas.idsDeElemento[i]} nombreDentroDeCaja={variablesDentroDeMochila.arreglosDeLibretas.nombres[i]} edicion={bool} cantidadDeHojasDentro={variablesDentroDeMochila.arreglosDeLibretas.numerosDeHojas[i]} />);

				if((i + 1) === cantidad){
					//SI ES EL ULTIMO BOTON DE LIBRETA, AGREGA UNA VISTA DE MUCHOS PIXELES
					arreglo.push(<View style={{height: (anchoNativoInicial / 6) * 1.5}} />);
				}
				else{
					//SI NO ES EL ULTIMO BOTON DE LIBRETA, AGREGA UNA VISTA DE 44 PIXELES
					arreglo.push(<View style={{height:22}} />);
				}

			}

		}
		return (arreglo);
	}

	const BotonAgregar = () => {
		const datosDelComponenteR = useRef({
			//El anchoInicial tendremos que cambiarlo un poco, debido a que en otro tipo de celulares, se vera raro
			anchoInicial: anchoNativoInicial / 6,
			//cantidadDeFuncionalidades: 1,
			//separadorEntreFuncionalidades: 18,
			//finalizadorArribaYAbajo: 18,
			//tamanioDeFuncionalidad: (anchoNativoInicial / 6) * .7
		});

		const [datosDelComponenteS, modificarDatosDelComponenteS] = useState({
			muestreoDelModal: false,
			nombreDeLibreta: "",
			descripcionDeLibreta: "",

		});

		let estilos = StyleSheet.create({
			contenedorPrincipal : {
				zIndex: 4,
				width: datosDelComponenteR.current.anchoInicial,
				height: datosDelComponenteR.current.anchoInicial,
				position: 'absolute',
				bottom: 20,
				right: 20,
				borderRadius: 100,
				alignItems: 'center',
				justifyContent: 'center',
				overflow: 'hidden'
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
		});

		const eventos = {
			eventoDeBotonPrincipal: () => {
				modificarDatosDelComponenteS({
					...datosDelComponenteS,
					muestreoDelModal: !(datosDelComponenteS.muestreoDelModal)
				});
			},
			traerDatosDeLibretas: async () => {

				let json = JSON.stringify({
					matricula: variablesDentroDeMochila.matriculaDelPropietario,
					eleccionDeApartado: variablesDentroDeMochila.eleccionDeApartado,
				});

				let datos = new FormData();
				datos.append('indice', json);

				let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/accionesEnApartados/mostrar/traerDatosDeLibretasAApartadoElegido.php',{
					method:'POST',
					body:datos
				})
				.then((mensaje) => mensaje.text())
				.then((respuesta) => {
					let objeto = null;
					if(respuesta === "0"){
						//NO HAY NINGUNA LIBRETA CREADA
						//NO MODIFICO LOS ARREGLOS

						//Nunca entrara aqui
						objeto = {
							nombres: [],
							numerosDeHojas: [],
							idsDeElemento: []
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
						//Ya se que no es Apartado Elegido

						//AQUI YA TRAJE LOS DATOS
					}
					dispatch(traerDatosDeLibretasAVariablesDentroDeMochilaEnApartadoElegido(objeto));
				})
				.catch((error) => {
					console.log("Error: ", error);
				});
			},
			crearLibretaNueva: async () => {
				if(datosDelComponenteS.nombreDeLibreta != "" && datosDelComponenteS.descripcionDeLibreta != ""){
					let fechaActual = Fecha();

					let objetoConInfo = {
						matricula: datosDeCredencial.matricula,
						nombreDeLibreta: datosDelComponenteS.nombreDeLibreta,
						descripcionDeLibreta: datosDelComponenteS.descripcionDeLibreta,
						fechaDeSubida: fechaActual
					}

					let json = JSON.stringify(objetoConInfo);
					let datos = new FormData();
					datos.append("indice", json);
					let promesa = await fetch("http://backpack.sytes.net/servidorApp/php/accionesEnApartados/crear/crearLibreta.php", {
						method: "POST",
						body: datos
					})
					.then((mensaje) => mensaje.text())
					.then((respuesta) => {
						if(respuesta === "YA HAY UNA LIBRETA CON EL MISMO NOMBRE EN EL APARTADO PRIVADO" || respuesta === "YA HAY UNA LIBRETA CON EL MISMO NOMBRE EN EL APARTADO PUBLICO"){
							let mensaje = (respuesta === "YA HAY UNA LIBRETA CON EL MISMO NOMBRE EN EL APARTADO PRIVADO") ? "Ya hay una libreta con el mismo nombre en el apartado privado." : "Ya hay una libreta con el mismo nombre en el apartado público.";
							Alert.alert("Error", mensaje, [
								{
									text: "Ok"
								}
							]);
						}
						else if(respuesta === "HECHO"){
							eventos.traerDatosDeLibretas();
							eventos.eventoDeBotonPrincipal();
						}
						else{
							Alert.alert("Error", "Ocurrio un error al crear la libreta :(", [
								{
									text: "Ok"
								}
							]);
						}
					})
					.catch((error) => {
						Alert.alert("Error", "Ocurrio un error al crear la libreta :(", [
							{
								text: "Ok"
							}
						]);
					});
				}
				else{
					Alert.alert("Error", "Hay datos faltantes", [
						{
							text: "Ok"
						}
					]);
				}
			},
		}

		return(
			<>
				<View style={estilos.contenedorPrincipal}>
					<TouchableNativeFeedback onPress={eventos.eventoDeBotonPrincipal}>
						<View style={estilos.botonPrincipal}>
							<Icon2 name={"add"} size={((anchoNativoInicial / 6) * .7) * .7} color={'black'}/>
						</View>
					</TouchableNativeFeedback>
				</View>

				{(datosDelComponenteS.muestreoDelModal) ?
					<Modal visible={true} 
					onRequestClose={()=>{
						
						modificarDatosDelComponenteS({
								...datosDelComponenteS,
								nombreDeLibreta: null,
								descripcionDeLibreta:null,
								muestreoDelModal: !(datosDelComponenteS.muestreoDelModal)
							});
							//eventos.eventoDeBotonPrincipal();
						}}
					 transparent={true}>
						<View style={{backgroundColor: "rgba(1,1,1,.5)", width: "100%", height: "100%", justifyContent: "center", alignItems: "center", }}>
							<View style={{width: "95%", height: "90%", alignItems: "center", backgroundColor:"#c8d6e5", borderRadius:20, overflow: "hidden"}}>
								<View onLayout={(e) => {
									console.log("Informacion = ", e.nativeEvent.layout);
									console.log("Informacion grande = ", alturaDeVistaInicial * (.90) * (.10));
								}} style={{width: "100%", height: "10%", backgroundColor:"#222f3e", flexDirection: "row", justifyContent: "space-around", alignItems: "center"}}>
									<Text style={{fontFamily: "Viga-Regular",textAlign: 'center',color:"#fff"}}>Libreta Nueva</Text>
									<Icon type="font-awesome" name="close" size={alturaDeVistaInicial * (.90) * (.10) * .60} color={"#fff"} onPress={()=>{
										
										modificarDatosDelComponenteS({
												...datosDelComponenteS,
												nombreDeLibreta: null,
												descripcionDeLibreta:null,
												muestreoDelModal: !(datosDelComponenteS.muestreoDelModal)
											});
											//eventos.eventoDeBotonPrincipal();
										}} />
								</View>

								<ScrollView style={{width: "100%", contentContainerStyle: "center"}}>
									<Text style={{fontFamily: "Viga-Regular",textAlign: 'center'}}>Nombre de la libreta:</Text>
									<TextInput
										style={{alignSelf: "center",backgroundColor:null,paddingLeft:50,paddingRight:50,borderWidth:1,borderColor:"#111",borderRadius:5,margin:10}}
										placeholder={"Escribe algo"}
										value={datosDelComponenteS.nombreDeLibreta}
										onChangeText={(text) => {
											modificarDatosDelComponenteS({
												...datosDelComponenteS,
												nombreDeLibreta: text
											});
										}}
									/>
									<Text style={{fontFamily: "Viga-Regular",textAlign: 'center'}}>Descripción:</Text>
									<TextInput
										style={{alignSelf: "center",backgroundColor:null,paddingLeft:50,paddingRight:50,borderWidth:1,borderColor:"#111",borderRadius:5,margin:10}}
										placeholder={"Escribe algo"}
										value={datosDelComponenteS.descripcionDeLibreta}
										onChangeText={(text) => {
											modificarDatosDelComponenteS({
												...datosDelComponenteS,
												descripcionDeLibreta: text
											});
										}}
									/>
									<View style={{alignSelf: "center", width: "50%", height: 40, backgroundColor: "#2e86de", overflow: "hidden", borderRadius: 10,margin:10}}>
										<TouchableNativeFeedback onPress={eventos.crearLibretaNueva}>
											<View style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
											<Text style={{fontFamily: "Viga-Regular",textAlign: 'center'}}>Crear</Text>
											</View>
										</TouchableNativeFeedback>
									</View>
								</ScrollView>
							</View>
						</View>
					</Modal>
				:
					null
				}
			</>
		);
	}


	return(
	<>
		<ScrollView>


			<Text style={{fontFamily: "Viga-Regular",textAlign: 'center',color:"#6F1E51"}}>{'Estás en : ' + (variablesDentroDeMochila.eleccionDeApartado) + " / " + (((variablesDentroDeMochila.eleccionDeApartado) === 'apartado privado') ? 'libretas privadas' : 'libretas públicas')}</Text>
			<Text style={{fontFamily: "Viga-Regular",textAlign: 'center'}}>{'Elige una libreta para visualizar sus hojas'}</Text>

			<Text />

			<ConjuntoDeBotonesDeLibretas />

		</ScrollView>

		<BotonAgregar />
	</>
	);
}

export default MostrarLibretasDelApartadoPrivado;
