import React,  {useRef, useState} from 'react';
import {TouchableOpacity,TextInput, Image,Text, View, StyleSheet, Modal, Alert, ActivityIndicator, SafeAreaView, ScrollView, Picker, StatusBar, Button, Dimensions, TouchableNativeFeedback } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
//ESTE CODIGO JS ES PARTE DEL APARTADO PRIVADO

import ImagenDeHoja from './../../../global/imagenes/Hoja.png';
import {useSelector, useDispatch} from 'react-redux';
import {establecerVariablesDentroDeMochilaEnMostrarHojasDeLibretaDelApartadoPublico, traerAVariablesDentroDeMochilaEnMostrarLibretasDelApartadoPrivado} from '../../../../store/actions.js';

const alturaDeVistaInicial = Math.round(Dimensions.get('window').height) - Math.round(StatusBar.currentHeight);

const MostrarHojasDeLibretaDelApartadoPublico = (props) => {
	const variablesDentroDeMochila = useSelector(store => store.variablesDentroDeMochila);
	const dispatch = useDispatch();



	//BotonDeHoja esta libre
	const BotonDeHoja = (props) => {
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
			cargandoCreacionDeCopia: false,
			respuestaDelServidorPorCreacionDeCopia: null
		});

		const estilo = StyleSheet.create({
			contenedor: {

				width: (Math.round(Dimensions.get('window').width)) - 50,
				backgroundColor : 'rgb(0,166,166)',
				left : 25,
				borderRadius : 10
			},
			imagenDeHoja : {
				position:'absolute',
				left : 10,
				top : 5
			},
			caja : {

				backgroundColor:'rgb(0,138,138)',
				borderRadius : 10,
				fontSize:17,
				textAlignVertical:'center',
				left: 45,
				color:'#000000',
				width: ((Math.round(Dimensions.get('window').width)) - 50) - (10 + 30 + 30 + 5 + 5)
			},
			opciones : {
				position:'absolute',
				backgroundColor:'rgb(0,138,138)',
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
						cargandoCreacionDeCopia: false,
						respuestaDelServidorPorCreacionDeCopia: null
					});
				}
				else{
					modificarDatosDelComponenteS({
						...datosDelComponenteS,
						muestreoDelModal: !(datosDelComponenteS.muestreoDelModal)
					});
				}

			},
			traerDatosDeHojas: async () => {
				let json = JSON.stringify({
					matricula: variablesDentroDeMochila.matriculaDelPropietario,
					eleccionDeApartado: variablesDentroDeMochila.eleccionDeApartado,
					eleccionIdDeLibreta: variablesDentroDeMochila.eleccionIdDeLibreta
				});

				let datos = new FormData();
				datos.append('indice', json);

				let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/accionesEnApartados/mostrar/traerDatosDeHojasAMostrarLibretasDelApartadoElegido.php',{
					method:'POST',
					body:datos
				})
				.then((mensaje) => mensaje.text())
				.then((respuesta) => {
					let objeto = null;
					if(respuesta === "0"){
						//NO HAY NINGUNA LIBRETA CREADA
						//NO MODIFICO LOS ARREGLOS
						objeto = {
							nombres : [],
							numerosDeComponentes : [],
							idsDeElemento : []
						}

						//Nunca entrara aqui
					}
					else{
						//respuesta = "{..."
						//SI HAY LIBRETAS
						//ENTONCES SI MODIFICO LOS ARREGLOS
						objeto = JSON.parse(respuesta);
						//objeto TIENE TODA LA INFORMACION ACERCA DE LAS LIBRETAS
						//objeto.nombres
						//objeto.numerosDeComponentes
						//objeto.idsDeElemento

						//TRAER
						//Ya se que no es Apartado Elegido

						//AQUI YA TRAJE LOS DATOS
					}
					dispatch(traerAVariablesDentroDeMochilaEnMostrarLibretasDelApartadoPrivado(objeto));
				})
				.catch((error) => {

				});
			},
			crearCopiaDeHojaDeLibretaEnApartadoPrivado: async () => {
				let objeto = {
					matricula: variablesDentroDeMochila.matriculaDelPropietario,
					idDeLibreta: variablesDentroDeMochila.eleccionIdDeLibreta,
					idDeHoja: props.elemento,
				}
				let json = JSON.stringify(objeto);
				let datos = new FormData();
				datos.append("indice", json);
				let promesa = await fetch("http://backpack.sytes.net/servidorApp/php/accionesEnApartados/crearCopiaEnApartadoPrivado/crearCopiaDeHojaDeLibretaEnApartadoPrivado.php", {
					method: "POST",
					body: datos
				})
				.then(msj => msj.text())
				.then(respuesta => {
					if(respuesta === "Exito"){
						modificarDatosDelComponenteS({
							...datosDelComponenteS,
							respuestaDelServidorPorCreacionDeCopia: "Se creó la copia exitosamente.",
							cargandoCreacionDeCopia: false
						});
					}
					else if(respuesta === "Ya existe una copia"){
						modificarDatosDelComponenteS({
							...datosDelComponenteS,
							respuestaDelServidorPorCreacionDeCopia: "Ya existe una copia. Verifica.",
							cargandoCreacionDeCopia: false
						});
					}
					else{
						modificarDatosDelComponenteS({
							...datosDelComponenteS,
							respuestaDelServidorPorCreacionDeCopia: "Ocurrió un error al crear la copia.",
							cargandoCreacionDeCopia: false
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
			eliminarHoja: async () => {
				let objeto = {
					matricula: variablesDentroDeMochila.matriculaDelPropietario,
					eleccionDeApartado: variablesDentroDeMochila.eleccionDeApartado,
					eleccionIdDeLibreta: variablesDentroDeMochila.eleccionIdDeLibreta,
					eleccionIdDeHoja: props.elemento
				}
				let json = JSON.stringify(objeto);
				let datos = new FormData();
				datos.append("indice", json);
				let promesa = await fetch("http://backpack.sytes.net/servidorApp/php/accionesEnApartados/eliminar/eliminarHoja.php", {
					method: "POST",
					body: datos
				})
				.then(mensaje => mensaje.text())
				.then(respuesta => {
					if(respuesta === "Hecho"){
						eventos.traerDatosDeHojas();
						eventos.onCloseModal();
					}
					else{
						Alert.alert("Error", "Algo fué mal.", [
							{
								text: "Ok"
							}
						]);
					}
				})
				.catch((error) => {
					Alert.alert("Error", error, [
						{
							text: "Ok"
						}
					]);
				});
			}
		}

		return (
			<>
				<TouchableOpacity style={[estilo.contenedor,props.estilo]} onPress={() => {establecerYRedireccionar(props.elemento,props.nombreDentroDeCaja,props.cantidadDeComponentesDentro);}} >
					<Image style={estilo.imagenDeHoja} source={ImagenDeHoja} />
					<TextInput defaultValue={props.nombreDentroDeCaja} editable={props.edicion} multiline={true} style={estilo.caja} />
					<TouchableOpacity onPress={eventos.onCloseModal} style={estilo.opciones}>
						<Icon name={'options-vertical'} />
					</TouchableOpacity>
					<Text style={estilo.texto}>{'Cantidad de componentes dentro : ' + (props.cantidadDeComponentesDentro)}</Text>
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
												<View style={{height: (datosDelComponenteR.current.alturaDeScrollView) * .05, width: "100%"}}></View>

												<View style={{width: "90%", height: (datosDelComponenteR.current.alturaDeScrollView) * .15, borderRadius: 20, backgroundColor: "lavender", borderWidth: 2, overflow: "hidden"}}>
													<TouchableNativeFeedback onPress={() => {
														modificarDatosDelComponenteS({
															...datosDelComponenteS,
															estadoDelModal: 2
														});
													}}>
														<View style={{width: "100%", height: "100%", borderRadius: 20, justifyContent: "center"}}>
															<Text style={{fontFamily: "Viga-Regular",fontSize:13,position: "absolute", left: "10%"}}>{"Crear Copia En Apartado Privado"}</Text>
															<Text style={{fontFamily: "Viga-Regular",position: "absolute", right: "10%"}}>{">"}</Text>
														</View>
													</TouchableNativeFeedback>
												</View>

												<View style={{height: (datosDelComponenteR.current.alturaDeScrollView) * .05, width: "100%"}}></View>

												<View style={{width: "90%", height: (datosDelComponenteR.current.alturaDeScrollView) * .15, borderRadius: 20, backgroundColor: "lavender", borderWidth: 2, overflow: "hidden"}}>
													<TouchableNativeFeedback onPress={() => {
														modificarDatosDelComponenteS({
															...datosDelComponenteS,
															estadoDelModal: 3
														});
													}}>
														<View style={{width: "100%", height: "100%", borderRadius: 20, justifyContent: "center"}}>
															<Text style={{fontFamily: "Viga-Regular",position: "absolute", left: "10%"}}>Eliminar</Text>
															<Text style={{fontFamily: "Viga-Regular",position: "absolute", right: "10%"}}>{">"}</Text>
														</View>
													</TouchableNativeFeedback>
												</View>

												<View style={{height: (datosDelComponenteR.current.alturaDeScrollView) * .05, width: "100%"}}></View>
											</>
										: (datosDelComponenteS.estadoDelModal === 2) ?
											<>
												{(datosDelComponenteS.cargandoCreacionDeCopia) ?
													<View>
														<ActivityIndicator size={'large'} color={'black'}/>
													</View>
												:
													<>
														{(datosDelComponenteS.respuestaDelServidorPorCreacionDeCopia === null) ?
															<>
															<Text style={{fontFamily: "Viga-Regular",fontSize:13,textAlign:"center"}}>{"Si no hay alguna copia de esta hoja en el apartado privado, esta se subirá; sin embargo, si ya la hay, no se hará nada. ¿Estás seguro de que quieres Crear Copia En Apartado Privado?"}</Text>

																<View style={{width: "100%", height: (datosDelComponenteR.current.alturaDeScrollView) * .05}}></View>

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

																<View style={{width: "100%", height: (datosDelComponenteR.current.alturaDeScrollView) * .05}}></View>

																<View style={{alignSelf: "center", width: "50%", height: 40, backgroundColor: "red", overflow: "hidden", borderRadius: 10,margin:5}}>
																	<TouchableNativeFeedback onPress={() => {
																		modificarDatosDelComponenteS({
																			...datosDelComponenteS,
																			cargandoCreacionDeCopia: true
																		});
																		eventos.crearCopiaDeHojaDeLibretaEnApartadoPrivado();
																	}}>
																		<View style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
																		<Text style={{fontFamily: "Viga-Regular",fontSize:13,textAlign:"center"}}>Sí</Text>
																		</View>
																	</TouchableNativeFeedback>
																</View>
															</>
														:
															<>
																<Text>{datosDelComponenteS.respuestaDelServidorPorCreacionDeCopia}</Text>
																<View style={{alignSelf: "center", width: "35%", height: 30, backgroundColor: "green", overflow: "hidden", borderRadius: 20,marginTop:30}}>
																	<TouchableNativeFeedback onPress={() => {
																		modificarDatosDelComponenteS({
																			...datosDelComponenteS,
																			estadoDelModal: 1,
																			cargandoCreacionDeCopia: false,
																			respuestaDelServidorPorCreacionDeCopia: null
																		});
																	}}>
																		<View style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
																			<Text>Ok</Text>
																		</View>
																	</TouchableNativeFeedback>
																</View>
															</>
														}
													</>
												}
											</>
										: (datosDelComponenteS.estadoDelModal === 3) ?
											<>
											<Text style={{fontFamily: "Viga-Regular",fontSize:13,textAlign:"center"}}>{"¿Estás seguro de que quieres eliminar esta hoja?"}</Text>

												<View style={{width: "100%", height: (datosDelComponenteR.current.alturaDeScrollView) * .05}}></View>

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
														<TouchableNativeFeedback onPress={eventos.eliminarHoja}>
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

	//establecerYRedireccionar esta libre
	const establecerYRedireccionar = async (id, nombre, cantidadDeComponentes) => {


		//id = 'hoja1'
		//nombre = 'Nativo real o Nativo falso'
		//cantidadDeComponentes = 0


		//1.- ESTABLECER (DATOS DE LA HOJA SELECCIONADA)
		dispatch(establecerVariablesDentroDeMochilaEnMostrarHojasDeLibretaDelApartadoPublico({
			eleccionIdDeHoja: id,
			eleccionNombreDeHoja: nombre,
			eleccionNumeroDeComponentesDeHoja: cantidadDeComponentes
		}));


		//AQUI EJECUTO props.modificarData
		//QUE MODIFICO EN SI...:
		/*
		eleccionIdDeHoja
		eleccionNombreDeHoja
		eleccionNumeroDeComponentesDeHoja
		*/



		//FALTA TRAER
		//TRAER NO LO VOY A HACER AQUI
		//LO VOY A HACER ALLA EN LA VISTA "visualizarHoja.js". ALLA MUESTRO LA VENTANITA DE "Cargando...", Y RE-RENDERIZO ALLA

		//FALTA REDIRECCIONAR ADECUADAMENTE CON INFORMACION CORRESPONDIENTE
		//REDIRECCIONARE A LA VISTA DE VISUALIZARHOJA.JS


		props.modificarIndice('Visualizar Hoja Del Apartado Publico');
	}

	//ConjuntoDeBotonesDeHojas esta libre
	const ConjuntoDeBotonesDeHojas = () => {
		let arreglo = [];
		if((variablesDentroDeMochila.arreglosDeHojas.idsDeElemento).length === 0 && (variablesDentroDeMochila.arreglosDeHojas.nombres).length === 0 && (variablesDentroDeMochila.arreglosDeHojas.numerosDeComponentes).length === 0){
			//NO HAY NINGUNA HOJA QUE MOSTRAR
			arreglo.push(<View key={0} style={{alignItems:'center'}}><Text>{'No hay ninguna hoja aún :('}</Text></View>);
		}
		else{
			//SI HAY HOJAS QUE MOSTRAR
			//HAY CORRESPONDENCIA EN i (0)
			/*
			idsDeElemento[0] : 'hoja1'
			nombres[0] : '¿Qué es React Native?'
			numerosDeComponentes[0] : 2
			*/
			let bool = false;
			let cantidad = (variablesDentroDeMochila.arreglosDeHojas.nombres).length;

			for(let i = 0; i < cantidad;i++){
				//PASO POR TODAS LAS POSICIONES DE LOS ARREGLOS
				//elemento = 'hoja1'
				arreglo.push(<BotonDeHoja elemento={variablesDentroDeMochila.arreglosDeHojas.idsDeElemento[i]} nombreDentroDeCaja={variablesDentroDeMochila.arreglosDeHojas.nombres[i]} edicion={bool} cantidadDeComponentesDentro={variablesDentroDeMochila.arreglosDeHojas.numerosDeComponentes[i]}/>);

				if((i + 1) === cantidad){
					//ES LA ULTIMA POSICION
					//ES EL ULTIMO BOTON
					arreglo.push(<View style={{height:100}} />);
				}
				else{
					//NO ES LA ULTIMA POSICION
					//NO ES EL ULTIMO BOTON
					arreglo.push(<View style={{height:22}} />);
				}
			}
		}
		return (arreglo);
	}

	return (
		<ScrollView>

			<Text style={{fontFamily: "Viga-Regular",textAlign: 'center',color:"#6F1E51"}}>{'Estás en : ' + (variablesDentroDeMochila.eleccionDeApartado) + ' / ' + ( ((variablesDentroDeMochila.eleccionDeApartado) === 'apartado privado') ? 'libretas privadas' : 'libretas públicas') + ' / "' + (variablesDentroDeMochila.eleccionNombreDeLibreta) + '"'}</Text>
			<Text style={{fontFamily: "Viga-Regular",textAlign: 'center'}}>{'Elige una hoja para visualizar su contenido'}</Text>

			<Text />
			<ConjuntoDeBotonesDeHojas />
		</ScrollView>
	);
}

export default MostrarHojasDeLibretaDelApartadoPublico;
