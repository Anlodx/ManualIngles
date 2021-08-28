import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  FlatList,
  Modal,
  Image,
  Switch,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
  ToastAndroid
} from 'react-native';
import { Icon,CheckBox } from 'react-native-elements';
import { ListItem,ButtonGroup,Badge } from 'react-native-elements';

import { Button,SearchBar, Avatar as IconoDeAvatar} from 'react-native-elements';


import ImageViewer from 'react-native-image-zoom-viewer';


import * as ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob'

import BotonAgregarChatSalon from "./botonAgregarChatSalon"
import ModalChat from "./ModalChat"
import ModalSalon from "./ModalSalon"
const anchoNativoInicial =  Math.round(Dimensions.get('window').width);
const alturaDeVistaInicial = Math.round(Dimensions.get('window').height) - Math.round(StatusBar.currentHeight);


const AltoPantalla = Dimensions.get("window").height;
const AnchoPantalla = Dimensions.get("window").width;



import {useSelector} from 'react-redux';


import {useFocusEffect } from "@react-navigation/native";
import {Fecha,SonSoloEspecios} from "./../../../global/codigosJS/Metodos.js";


const Mensajes = (props) => {




	const datosDeCredencial = useSelector(store => store.datosDeCredencial);
	const [datosEspecificosS, modificarDatosEspecificosS] = useState({
		selectedIndex: 0,
		Usuario: {//esto se puede entender como datos_viajantes
			//this.state.Usuario SON VARIABLES CON RESPECTO A MIIII (SOY YOOO)
			Id: datosDeCredencial.matricula,
			Avatar: datosDeCredencial.rutaDeFoto,
			Nombre:{
				Nombres: datosDeCredencial.nombreCompleto.nombres,
				ApellidoPaterno: datosDeCredencial.nombreCompleto.apellidoPaterno,
				ApellidoMaterno: datosDeCredencial.nombreCompleto.apellidoMaterno
			}
		},
		DatosParaChat:null,//datos que le pasamos al archivo ModalChat para reconocer los ids de los usuarios
		DatosParaSalon:null,
		MensajesPreCargadosParaChat : null,
		MensajesPreCargadosParaSalon : null,
		ModalNuevoSalon:false,//visibilidad del modal
		ModalNuevoChat:false,//visibilidad del modal
		ModalChat:false,//visibilidad del modal
		ModalSalon:false,
		Chats : [],
		Salones : [],
		ContactosParaChat: null,
		//ContactosParaSalon: null, NO NOS SIRVE ESTA VARIABLE
	});

	const updateIndex = (index) => {
		modificarDatosEspecificosS({
			...datosEspecificosS,
			selectedIndex: index
		});

	}
	const eventosEspecificos = {
		traerConversacionesDeTipoChatYSalon: async () => {
			let datos = new FormData();
			datos.append('indice', datosEspecificosS.Usuario.Id);

			let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/mensajes/traerConversaciones/traerConversacionesDeTipoChatYSalon.php',{
				method: 'POST',
				body: datos
			})
			.then((mensaje) => mensaje.text())
			.then((respuesta) => {
				//console.log('ESTA FUE LA RESPUESTA DEL SERVIDOR = ', respuesta);
				/*
					respuesta TIENE EL OBJETO JSON QUE NECESITO
				*/
				console.log(respuesta);
				let objeto = JSON.parse(respuesta); //respuesta LO CONVIERTO A UN OBJETO JAVASCRIPT

				/*
					objeto ES UN OBJETO JAVASCRIPT

					objeto : {
						arregloConConversacionesDeTipoChat : [],
						arregloConConversacionesDeTipoSalon : []
					}
				*/


				modificarDatosEspecificosS({
					...datosEspecificosS,
					Chats: objeto.arregloConConversacionesDeTipoChat,
					Salones: objeto.arregloConConversacionesDeTipoSalon
				});
			})
			.catch((error) => {
				console.log("linea 127 mensajes: ",error);
			});

			/*console.log('Arreglo con Chats = ', this.state.Chats);
			console.log('Arreglo con Salones = ', this.state.Salones);*/
		},
		crearConversacionDeTipoChat: async (matriculaDelCreador, matriculaDelIntegrante) => {
			//ModalNuevoChat
			//ContactosParaChat
			let objetoConTodaLaInformacion = {
				matriculaDelCreador: matriculaDelCreador,
				matriculaDelIntegrante: matriculaDelIntegrante
			};
			let json = JSON.stringify(objetoConTodaLaInformacion);
			let datos = new FormData();
			datos.append('indice', json);
			let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/mensajes/crearConversacion/crearConversacionDeTipoChat.php',{
				method: 'POST',
				body: datos
			})
			.then((mensaje) => mensaje.text())
			.then((respuesta) => {
        console.log("Respuesta = ", respuesta);

				if(respuesta === "Hecho"){
          
		  ToastAndroid.show('Chat creado correctamente' , ToastAndroid.SHORT);
          modificarDatosEspecificosS({
            ...datosEspecificosS,
            //Chats: objeto.arregloConConversacionesDeTipoChat,
            //Salones: objeto.arregloConConversacionesDeTipoSalon,
            ModalNuevoChat: false,
            ContactosParaChat: null
          });
				}
				else{
					
					ToastAndroid.show('Error al crear Chat' , ToastAndroid.SHORT);
				}
			})
			.catch((error) => {
				console.log("linea 168: ",error);
			});
		}

	}

	const MetodoAbreChat = async (Destinatario) => {
		let array=[];
		/*
			array[0] = TODO LO RELACIONADO A MI (AL USUARIO)
			array[1] = TODO LO RELACIONADO AL DESTINATARIO
		*/

        array.push(datosEspecificosS.Usuario); //AQUI YA TIENE LOS VALORES CORRECTOS
        array.push(Destinatario);
		//2.- ME FALTA TRAER EN UN ARREGLO TODOS LOS MENSAJES DE LA CONVERSACION
		let objetoConTodaLaInformacion = {
			idDeConversacion : Destinatario.Id, //17419070110074_17419070110040
			alumnoProtagonista : datosEspecificosS.Usuario,
			destinatario : {
				Id : ((Destinatario.Id).split('_'))[1],
				Avatar : Destinatario.Avatar,
				Nombre : Destinatario.Nombre
			},
			variableVerMasOMenos: 0,
		}

		let json = JSON.stringify(objetoConTodaLaInformacion);
		let datos = new FormData();
		datos.append('indice', json);

		let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/mensajes/traerMensajesDeUnaConversacion/traerMensajesDeUnaConversacionDeTipoChat.php',{
			method: 'POST',
			body: datos
		})
		.then((mensaje) => mensaje.text())
		.then((respuesta) => {
			//respuesta TIENE LOS MENSAJES EN ARRAY JSON STRING


      console.log("respuesta metodo abrir chat => ",respuesta)

			let objeto = JSON.parse(respuesta);


			modificarDatosEspecificosS({
				...datosEspecificosS,
				DatosParaChat: array,
				ModalChat: true,
				MensajesPreCargadosParaChat: objeto.arregloConObjetosDeMensajeDeTipoChat
			});

		})
		.catch((error) => {
			
			ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
			 console.log("linea 224: ",error);
			});


	}

	const MetodoAbreSalon = async (Salon) => {
		let array = [];
        array.push(datosEspecificosS.Usuario);
        array.push(Salon); //Tiene informacion especifica del SALON : idDelSalon, avatarDelSalon, integrantesDelSalon, etc.

		let objetoConTodaLaInformacion = {
			idDeConversacion: Salon.Nombre,
			variableVerMasOMenos: 0
		}

		let json = JSON.stringify(objetoConTodaLaInformacion);
		let datos = new FormData();
		datos.append('indice', json);

		let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/mensajes/traerMensajesDeUnaConversacion/traerMensajesDeUnaConversacionDeTipoSalon.php',{
			method : 'POST',
			body : datos
		})
		.then( (mensaje) => mensaje.text() )
		.then( (respuesta) => {
			//respuesta ES UN stringJSON





			if( respuesta === 'ERROR' ){
				
				ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
				console.log("linea 259 error");
			}
			else{

				/*
					respuesta = {
						arregloConObjetosDeAlumnoDeIntegrantes : [],
						arregloConObjetosDeMensajeDeTipoSalon : []
					}
				*/

				let objeto = JSON.parse(respuesta);

				array.push(objeto.arregloConObjetosDeAlumnoDeIntegrantes);

				modificarDatosEspecificosS({
					...datosEspecificosS,
					DatosParaSalon: array,
					ModalSalon: true,
					MensajesPreCargadosParaSalon: objeto.arregloConObjetosDeMensajeDeTipoSalon
				});
			}

		} )
		.catch( (error) => {
			
			ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
			console.log("Linea 285 error");
		} );
	}

	const MetodoCreaChat = (Destinatario) => {
		Alert.alert(
          'Pregunta:',
          "¿Estás seguro de crear un chat con " + Destinatario.Nombre.Nombres + "?",
          [
            {
              text: 'No',
            },
            {
				text: 'Sí',
				onPress: () => {
					modificarDatosEspecificosS({
						...datosEspecificosS,
						//Chats: objeto.arregloConConversacionesDeTipoChat,
						//Salones: objeto.arregloConConversacionesDeTipoSalon,
						ModalNuevoChat: false,
						//ContactosParaChat: null
					  });
					eventosEspecificos.crearConversacionDeTipoChat(datosEspecificosS.Usuario.Id, Destinatario.Id);
				}
            }
          ],
          { cancelable: false }
        );
	}

  const ListaDeChats = () => {
    const [arregloChats,setArregloChats] = useState(null);

    const referenciaVerRecientesOAnteriores = useRef(0);

    const [variables, modificarVariables] = useState({
        verRecientes: null,
        verAnteriores: null
    });

    const eventos = {
      traerConversacionesDeTipoChat: async () => {
            let objetoConTodaLaInformacion = {
                matricula: datosEspecificosS.Usuario.Id,
                variableVerRecientesOAnteriores: referenciaVerRecientesOAnteriores.current
            }

            let json = JSON.stringify(objetoConTodaLaInformacion);
  			let datos = new FormData();
  			datos.append('indice', json);

  			let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/mensajes/traerConversaciones/traerConversacionesDeTipoChat.php',{
  				method: 'POST',
  				body: datos
  			})
  			.then((mensaje) => mensaje.text())
  			.then((respuesta) => {
          console.log(respuesta);
                if(respuesta === "Error"){
                    setArregloChats(null);
                    modificarVariables({
                        verRecientes: null,
                        verAnteriores: null
                    });
                }
                else{
                    let objeto = JSON.parse(respuesta);
                    setArregloChats(objeto.conversaciones);
                    modificarVariables({
                        verRecientes: objeto.variableVerRecientes,
                        verAnteriores: objeto.variableVerAnteriores
                    });
                }
  			})
  			.catch((error) => {
				  
				  ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
				  console.log("linea 355 error: ",error)
				});

  		}
    }

    const timeri = useRef(null);
        useFocusEffect(
          React.useCallback(()=>{


            timeri.current = setInterval(()=>{
            //  console.log("mensajes montado desde lista creada de chat")
              eventos.traerConversacionesDeTipoChat();
            },1000);

            return  () => {
              clearInterval(timeri.current)
            //  console.log("desmontado")
             }
          },[props])
        );



    return(
      <>
        {(arregloChats === null) ?
          <>
            <ActivityIndicator size={'large'} color={'black'} style={{alignSelf: "center"}}/>
          </>
        :
          <>
            <FlatList
              data={arregloChats}
              keyExtractor={(item) => item.Id}
              ListHeaderComponent={()=>(
                <>{(variables.verRecientes === null || variables.verRecientes === false) ?
                    <View style={{width:"100%",height:20}}/>
                :
                    <View style={{width:"100%", height:40, alignItems: "center", justifyContent: "center"}}>
                        <View style={{width: "90%", height: "95%", overflow: "hidden", borderRadius: 2,backgroundColor: "#26de81"}}>
                            <TouchableNativeFeedback onPress={() => {
                                setArregloChats(null);
                                referenciaVerRecientesOAnteriores.current = referenciaVerRecientesOAnteriores.current - 1;
                            }}>
                                <View style={{width: "100%", height: "100%", alignItems: "center", justifyContent: "center"}}>
								<Text style={{textAlign:"center",color:"#111",fontSize:17,fontFamily: "Viga-Regular"}}>{"Ver Recientes"}</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                }
                </>
              )}
              ListFooterComponent={()=>(
                <>{(variables.verAnteriores === null || variables.verAnteriores === false) ?
                    <View style={{width:"100%",height:20}}/>
                :
                    <View style={{width:"100%", height:40, alignItems: "center", justifyContent: "center"}}>
                        <View style={{width: "90%", height: "95%", overflow: "hidden", borderRadius: 2,backgroundColor: "#26de81"}}>
                            <TouchableNativeFeedback onPress={() => {
                                setArregloChats(null);
                                referenciaVerRecientesOAnteriores.current = referenciaVerRecientesOAnteriores.current + 1;
                            }}>
                                <View style={{width: "100%", height: "100%", alignItems: "center", justifyContent: "center"}}>
								<Text style={{textAlign:"center",color:"#111",fontSize:17,fontFamily: "Viga-Regular"}}>{"Ver Anteriores"}</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                }
                </>
              )}
              ItemSeparatorComponent={()=>(<View style={{width:"100%",height:10}}/>)}

              ListEmptyComponent={
                ()=>(
				<View style={{width:AnchoPantalla * (0.8),padding:10,justifyContent:"center",alignSelf:"center",alignItems:"center",backgroundColor:"#111",borderRadius:10}}>
                  <Text style={{textAlign:"center",color:"#fff",fontSize:16,fontFamily: "Viga-Regular"}}>Ningún chat localizado</Text>
               </View>
                )
              }
              renderItem={
                ({item})=>(
                  <ItemChat
                    Id={item.Id}
                    Nombre={item.Nombre}
                    Avatar={item.Avatar}
                    UltVez={item.UltVez}
                    Accion={()=>{MetodoAbreChat(item)}}
                    TraerConversaciones={eventos.traerConversacionesDeTipoChat}
                  />
                )
              }
            />
          </>
        }
      </>
    );
  }


    const ListaDeSalones = () => {
      const [arregloSalon,setArregloSalon] = useState(null);

      const referenciaVerRecientesOAnteriores = useRef(0);

        const [variables, modificarVariables] = useState({
            verRecientes: null,
            verAnteriores: null
        });

      const eventos = {
        traerConversacionesDeTipoSalon: async () => {
            let objetoConTodaLaInformacion = {
                matricula: datosEspecificosS.Usuario.Id,
                variableVerRecientesOAnteriores: referenciaVerRecientesOAnteriores.current
            }

            let json = JSON.stringify(objetoConTodaLaInformacion);
  			let datos = new FormData();
  			datos.append('indice', json);

    			let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/mensajes/traerConversaciones/traerConversacionesDeTipoSalon.php',{
    				method: 'POST',
    				body: datos
    			})
    			.then((mensaje) => mensaje.text())
    			.then((respuesta) => {

    				//console.log(respuesta);

    				let objeto = JSON.parse(respuesta); //respuesta LO CONVIERTO A UN OBJETO JAVASCRIPT
                    setArregloSalon(objeto.conversaciones);
                    modificarVariables({
                        verRecientes: objeto.variableVerRecientes,
                        verAnteriores: objeto.variableVerAnteriores
                    });

    			})
    			.catch((error) => {
					ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
				  console.log("linea 499 error: ",error)
				});

    		}
      }

      const timerj = useRef(null);
          useFocusEffect(
            React.useCallback(()=>{


              timerj.current = setInterval(()=>{
              //  console.log("mensajes montado desde lista creada de Salon")
                eventos.traerConversacionesDeTipoSalon();
              },1000);

              return  () => {
                clearInterval(timerj.current)
              //  console.log("desmontado => salones")
               }
            },[props])
          );



      return(
        <>
        {(arregloSalon === null) ?
          <ActivityIndicator size={'large'} color={'black'} style={{alignSelf: "center"}}/>
        :
          <FlatList
            data={arregloSalon}
            keyExtractor={(item) => item.Id}
            ListFooterComponent={()=>(
                <>{(variables.verAnteriores === null || variables.verAnteriores === false) ?
                    <View style={{width:"100%",height:20}}/>
                :
                    <View style={{width:"100%", height:40, alignItems: "center", justifyContent: "center"}}>
                        <View style={{width: "90%", height: "95%", overflow: "hidden", borderRadius: 2,backgroundColor: "#26de81"}}>
                            <TouchableNativeFeedback onPress={() => {
                                setArregloSalon(null);
                                referenciaVerRecientesOAnteriores.current = referenciaVerRecientesOAnteriores.current + 1;
                            }}>
                                <View style={{width: "100%", height: "100%", alignItems: "center", justifyContent: "center"}}>
								<Text style={{textAlign:"center",color:"#111",fontSize:17,fontFamily: "Viga-Regular"}}>{"Ver Anteriores"}</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                }
                </>
              )}
              ItemSeparatorComponent={()=>(<View style={{width:"100%",height:10}}/>)}
              ListHeaderComponent={()=>(
                <>{(variables.verRecientes === null || variables.verRecientes === false) ?
                    <View style={{width:"100%",height:20}}/>
                :
                    <View style={{width:"100%", height:40, alignItems: "center", justifyContent: "center"}}>
                        <View style={{width: "90%", height: "95%", overflow: "hidden", borderRadius: 2,backgroundColor: "#26de81"}}>
                            <TouchableNativeFeedback onPress={() => {
                                setArregloSalon(null);
                                referenciaVerRecientesOAnteriores.current = referenciaVerRecientesOAnteriores.current - 1;
                            }}>
                                <View style={{width: "100%", height: "100%", alignItems: "center", justifyContent: "center"}}>
								<Text style={{textAlign:"center",color:"#111",fontSize:17,fontFamily: "Viga-Regular"}}>{"Ver Recientes"}</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                }
                </>
              )}
            ListEmptyComponent={
              ()=>(
                <View style={{width:AnchoPantalla * (0.8),padding:10,justifyContent:"center",alignSelf:"center",alignItems:"center",backgroundColor:"#111",borderRadius:10}}>
                  <Text style={{textAlign:"center",color:"#fff",fontSize:16,fontFamily: "Viga-Regular"}}>Ningun salon localizado</Text>
               </View>
              )
            }
            renderItem={
              ({item})=>(
                <ItemSalon
                  Id={item.Id}
                  Nombre={item.Nombre}
                  Avatar={item.Avatar}
                  UltVez={item.UltVez}
                  Accion={()=>MetodoAbreSalon(item)}
                  TraerConversaciones={eventos.traerConversacionesDeTipoSalon}
                  Matricula={datosEspecificosS.Usuario.Id}
                />
              )
            }
          />
        }
        </>
      );
    }


	const DevuelveApartado = (props) => {

		if(props.index === 0){
			return(



				<View style={{flex:1,backgroundColor:"rgba(218, 218, 218, 0.61)"}}>
					<View style={{width:"100%",alignItems:"center",justifyContent:"space-around",padding:10}}>
						<Text style={{fontSize:16,color:"#130f40",fontFamily: "Viga-Regular"}}>Conversaciones</Text>
					</View>

          <ListaDeChats/>



					{(datosEspecificosS.ModalChat) ?
						<Modal visible={true} onRequestClose={
								()=>modificarDatosEspecificosS({
										...datosEspecificosS,
										ModalChat: false,
										DatosParaChat: null,
										MensajesPreCargadosParaChat: null
									})
							} animationType="slide" transparent={true}>
								<ModalChat CerrarModal={
									()=>modificarDatosEspecificosS({
										...datosEspecificosS,
										ModalChat: false,
										DatosParaChat: null,
										MensajesPreCargadosParaChat: null
									})}
									data={datosEspecificosS.DatosParaChat}
									mensajesPreCargados={datosEspecificosS.MensajesPreCargadosParaChat}
								/>
						</Modal>
					:
						null
					}

				</View>


			);
		}else{
			return(
				<View style={{flex:1,backgroundColor:"rgba(218, 218, 218, 0.61)"}}>

					<View style={{width:"100%",alignItems:"center",justifyContent:"space-around",padding:10}}>
						<Text style={{fontSize:16,color:"#130f40",fontFamily: "Viga-Regular"}}> Salones en los que estas </Text>
					</View>


          <ListaDeSalones/>

					{(datosEspecificosS.ModalSalon) ?
						<Modal visible={true} onRequestClose={
							()=>modificarDatosEspecificosS({
								...datosEspecificosS,
								ModalSalon: false,
								DatosParaSalon: null,
								MensajesPreCargadosParaSalon: null
							})}
							animationType="slide" transparent={true}>
								<ModalSalon CerrarModal={
									()=>modificarDatosEspecificosS({
										...datosEspecificosS,
										ModalSalon: false,
										DatosParaSalon: null,
										MensajesPreCargadosParaSalon : null
									})}
									data={datosEspecificosS.DatosParaSalon}
									mensajesPreCargados={datosEspecificosS.MensajesPreCargadosParaSalon}
								/>
						</Modal>
					:
						null
					}


				</View>
			)
		}
	}

	const traerLosAlumnosCorrectosParaIniciarUnChat = async () => {
		let datos = new FormData();
		datos.append('indice', datosEspecificosS.Usuario.Id);
		let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/mensajes/crearConversacion/traerLosAlumnosCorrectosParaIniciarUnChat.php',{
			method: 'POST',
			body: datos
		})
		.then((mensaje) => mensaje.text())
		.then((respuesta) => {
			let arreglo = JSON.parse(respuesta);
			modificarDatosEspecificosS({
				...datosEspecificosS,
				ModalNuevoChat: true,
				ContactosParaChat: arreglo
			});
		})
		.catch((error) => {
			ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
			console.log("linea 701 error: ",error)
		});

	}

	const funcion = () => {
		console.log('Hola mundo');
	}

	const component1 = () => (
		<View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
			<Icon type="entypo" name="chat" size={20} color={"#F02A48"} />
		</View>
	)
	const component2 = () => <Icon type="font-awesome-5" name="school" size={20} color={"#F02A48"} />

	const buttons = [{ element: component1 }, { element: component2 }];

	return(
		<View style={{flex:1}}>
			<ButtonGroup
				onPress={updateIndex}
				selectedIndex={datosEspecificosS.selectedIndex}
				buttons={buttons}
				selectedButtonStyle={{backgroundColor:"none",borderBottomWidth:3,borderBottomColor:"#ff6b6b"}}
				containerStyle={{borderRadius:15,width:AnchoPantalla,alignSelf:"center"}}
				innerBorderStyle={{width:0}}
			/>

			<DevuelveApartado index={datosEspecificosS.selectedIndex} />

			{(datosEspecificosS.ModalNuevoChat) ?
				<Modal visible={true} onRequestClose={
					()=>modificarDatosEspecificosS({
							...datosEspecificosS,
							ModalNuevoChat: false,
							ContactosParaChat: null
						})
					}
					transparent={true}
				>

					<View style={{backgroundColor:"rgba(1,1,1,.5)",flex:1,justifyContent:"center",alignItems:"center"}}>{/* acomoda el modal al centro */}

						<View style={{width:AnchoPantalla * (0.95),height:AltoPantalla * (0.8),justifyContent:"flex-start",alignItems:"center",backgroundColor:"#c8d6e5",borderRadius:10}}>{/* contenido del modal*/}

							<View style={{width:AnchoPantalla * (0.95), alignItems:"center", justifyContent:"space-around",flexDirection:"row",padding:20,backgroundColor:"#222f3e",borderTopLeftRadius:10,borderTopRightRadius:10}}>
								<Text style={{textAlign:"center",color:"#fff",fontSize:17,width:(AnchoPantalla * (0.95)) * (0.60),fontFamily: "Viga-Regular"}}>Contactos: </Text>
								<Icon type="font-awesome" name="close" containerStyle={{width: (AnchoPantalla * (0.95)) * (0.20)}} size={24} color={"#fff"}
									onPress={
										()=>modificarDatosEspecificosS({
											...datosEspecificosS,
											ModalNuevoChat: false,
											ContactosParaChat: null
											})
									}/>
							</View>


							{(datosEspecificosS.ContactosParaChat === null) ?
								<>
									<ActivityIndicator size={'large'} color={'black'}/>
								</>
							:
								<FlatList
									data={datosEspecificosS.ContactosParaChat}
									keyExtractor={(item) => item.Id}
									initialNumToRender={5}
									ListHeaderComponent={()=>(<View style={{width:AnchoPantalla * (0.95),height:25}}/>)}
									ItemSeparatorComponent={()=>(<View style={{width:AnchoPantalla * (0.95),height:15}}/>)}
									ListFooterComponent={()=>(<View style={{width:AnchoPantalla * (0.95),height:25}}/>)}
									renderItem={
										({item}) => (
											
											<ItemContacto
												Id={item.Id}
												Nombre={item.Nombre}
												Avatar={item.Avatar}
												Especialidad={item.Especialidad}
												Accion={()=>MetodoCreaChat(item)}
											/>
											
										)
									}
								/>
							}

						</View>

					</View>

				</Modal>
			:
				null
			}


			{(datosEspecificosS.ModalNuevoSalon) ?
				<Modal visible={true}
					onRequestClose={
						()=>modificarDatosEspecificosS({
								...datosEspecificosS,
								ModalNuevoSalon: false,
							})
					} transparent={true}
				>
					<View style={{flex:1,alignItems:"center",justifyContent:"center",backgroundColor:"rgba(0,0,0,0.8)"}}>
						<NuevoSalon
							CerrarModal={
								()=>modificarDatosEspecificosS({
									...datosEspecificosS,
									ModalNuevoSalon: false,
								})
							}
							Administrador={datosEspecificosS.Usuario}
							ModificarDatosEspecificosS={(objeto) => {
								modificarDatosEspecificosS({
									...datosEspecificosS,
									...objeto
								});
							}}
						/>
					</View>
				</Modal>
			:
				null
			}

			<BotonAgregarChatSalon style={{bottom:140,right:60}}
				AgregaNuevoSalon={
					()=>{
						modificarDatosEspecificosS({
							...datosEspecificosS,
							ModalNuevoSalon: true
						});

					}
				}
				AgregaNuevoChat={
					()=>{
						modificarDatosEspecificosS({
							...datosEspecificosS,
							ModalNuevoChat: true
						});
						traerLosAlumnosCorrectosParaIniciarUnChat();
					}
				}
			/>
		</View>
	);
}

export default Mensajes;









const NuevoSalon = (props) =>{

  const [Salon, setSalon] = useState({
    Descripcion: null,
    src: null,
    Seleccionados: [props.Administrador.Id]
  });


        const [fotoSalonNueva, setFotoSalonNueva] = useState({
          src:null,
          data:null,
          type:null,
          name:null
        })
        const options = {

            quality:1,
            includeBase64:true
          };

          const selectPhoto = () =>
          {
            ImagePicker.launchImageLibrary(options, (response) => {

            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else {
              const source = { uri: response.uri }
              setFotoSalonNueva({...fotoSalonNueva,src: source,data:response.base64,type:response.type,name:response.fileName})
              console.log(response)
            }
          });
          }

          const uploadPhoto = () =>
          {
            RNFetchBlob.fetch('POST', 'http://backpack.sytes.net/servidorApp/php/.php', {
              Authorization : "Bearer access-token",
              otherHeader : "foo",
              'Content-Type' : 'multipart/form-data',
            },
            [
              { name : 'fotoSalonNueva', filename : fotoSalonNueva.name, type:fotoSalonNueva.type, data: fotoSalonNueva.data},
              { name : 'indice', data:JSON.stringify({
                //id de salon
              })}
            ]).then((response) => response.json())
                 .then((responseJson)=>{
                //   console.log(responseJson)

                 }).catch((err) => {
              console.log(err)
            })

          }




  const [Ubiacacion, setUbicacion] = useState("Descripcion");


  const [Coloreado,setColoreado]  = useState(null);
  const [ContactosParaSalon, modificarContactosParaSalon] = useState(null);


	const traerLosAlumnosCorrectosParaIniciarUnSalon = async () => {
		let datos = new FormData();
		datos.append('indice', props.Administrador.Id);


		let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/mensajes/crearConversacion/traerLosAlumnosCorrectosParaIniciarUnSalon.php',{
			method: 'POST',
			body: datos
		})
		.then((mensaje) => mensaje.text())
		.then((respuesta) => {

			let arreglo = JSON.parse(respuesta);

			let ArrAux = [];
			for(let r=0;r<arreglo.length;r++){
				ArrAux.push(false);
			}

			setColoreado(ArrAux);

			modificarContactosParaSalon(arreglo);

		})
		.catch((error) => {
			
			ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
			console.log("linea 959 error: ",error)
		});

	}


  	const enviarNombreParaComprobacionDeCreacionDeSalon = async (nombreSalon) => {
  		let datos = new FormData();
  		datos.append('indice', nombreSalon);


  		let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/mensajes/crearConversacion/comprobarNombreDeSalon.php',{
  			method: 'POST',
  			body: datos
  		})
  		.then((mensaje) => mensaje.text())
  		.then((respuesta) => {

        console.log("respuesta de comprobacion de nombre => ",respuesta)
        if(respuesta === "true"){
          
		  ToastAndroid.show('Prueba otro nombre' , ToastAndroid.SHORT);
		
        }else if(respuesta === "false"){

          setUbicacion("Foto")
        }

  		})
  		.catch((error) => {
			  ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
			  console.log("linea 990 error: ",error)
  		});

  	}

  switch(Ubiacacion){
    case "Descripcion":
    return(
     <View style={{backgroundColor:"#111",borderWidth:1,borderColor:"black",borderRadius:15,width:AnchoPantalla * (0.95),height:AltoPantalla * (0.8),justifyContent:'flex-start',alignItems:"center",alignSelf:"center"}}>
        <View style={{backgroundColor:"#111",width:(AnchoPantalla * (0.95)) * (0.95),height: (AltoPantalla * (0.8)) * (0.15),padding: 10,justifyContent:"space-around",alignItems:"center",alignSelf:"center",flexDirection:"row"}}>
		<Icon type="font-awesome-5" name="school" size={20} color={"#F02A48"} />
          <Text style={{textAlign:"center",fontFamily: "Viga-Regular",color:"#fff",fontSize: 18}}>Nombre de tu Salón: </Text>
        </View>
        <View style={{backgroundColor:"#111",width:AnchoPantalla * (0.95),height: (AltoPantalla * (0.8)) * (0.85),justifyContent:"space-around",alignItems:"center",alignSelf:"center",flexDirection:"column"}}>

          <TextInput
          textAlign={"center"}
          value={Salon.Descripcion}
		  style={{borderWidth:1,borderColor:"#fff",padding:8,margin:5,width:(AnchoPantalla * (0.95)) * (0.8) ,color:"#fff",backgroundColor: "#111",borderRadius:15}}
          // placeholder={"Cuentame..."}
		  autoFocus={true}
           onChangeText={(Val)=>setSalon({...Salon,Descripcion:Val})}
           maxLength={60}
           />
           <View style={{width:(AnchoPantalla * (0.95)),flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
            <TouchableOpacity onPress={props.CerrarModal} style={{backgroundColor:"#f53b57",padding:18,paddingLeft:25,paddingRight:25,borderRadius:16}}>
              <Text style={{textAlign:"center",fontSize:15,color:"white",fontFamily: "AkayaKanadaka-Regular"}}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={()=>{
              if(!SonSoloEspecios(Salon.Descripcion)){
                  enviarNombreParaComprobacionDeCreacionDeSalon(Salon.Descripcion)
              }else{
                
				ToastAndroid.show('Revisa bien el texto escrito' , ToastAndroid.SHORT);
				console.log("linea 1026 error:")
              }

            }}
            style={{backgroundColor:"#3c40c6",padding:18,paddingLeft:25,paddingRight:25,borderRadius:16}}>
              <Text style={{textAlign:"center",fontSize:15,color:"white",fontFamily: "AkayaKanadaka-Regular"}}>Guardar</Text>
            </TouchableOpacity>

           </View>
        </View>
       </View>
  );break;

    case "Foto":
    return(

         <View style={{backgroundColor:"#111",borderWidth:1,borderColor:"black",borderRadius:15,width:AnchoPantalla * (0.95),height:AltoPantalla * (0.8),justifyContent:'flex-start',alignItems:"center",alignSelf:"center"}}>

          <View style={{backgroundColor:"#111",width:(AnchoPantalla * (0.95)) * (0.90),height: (AltoPantalla * (0.8)) * (0.15),padding: 10,justifyContent:'center',alignItems:"center",alignSelf:"center",flexDirection:"row"}}>
		  <Icon type="font-awesome-5" name="school" size={20} color={"#F02A48"} />
            <Text style={{fontSize: 15,fontFamily: "Viga-Regular",color:"#fff",marginLeft: 20}}>Foto de Salon</Text>
          </View>

          <ComponenteDeImagen urlDeImagen={fotoSalonNueva.src == null ? null : fotoSalonNueva.src.uri}/>

          
            <TouchableOpacity onPress={selectPhoto} style={{backgroundColor:"#3c40c6",padding:10,width: (AnchoPantalla * (0.95)) * (0.4),borderRadius:13,flexDirection:"row",justifyContent:"space-around",alignItems:"center",alignSelf: 'center',margin: 5}}>
              <Icon name='plus' type="font-awesome" color='#ffa801' size={28}/>
              <Text style={{textAlign:"center",fontSize:15,color:"white",marginLeft:10,fontFamily: "Viga-Regular"}}>Nueva</Text>
            </TouchableOpacity>
          

          <View style={{width:AnchoPantalla * (0.95),flexDirection:"row",justifyContent:"space-around",alignItems:"center",margin:10}}>
            <TouchableOpacity onPress={()=>setUbicacion("Descripcion")} style={{backgroundColor:"#f53b57",padding:15,width: (AnchoPantalla * (0.95)) * (0.40),borderRadius:13}}>
            <Text style={{textAlign:"center",fontSize:15,color:"white",fontFamily: "Viga-Regular"}}>Cancelar</Text>
           </TouchableOpacity>

          <TouchableOpacity onPress={()=>{
					traerLosAlumnosCorrectosParaIniciarUnSalon();
					setUbicacion("Integrantes");
				}
			} style={{backgroundColor:"#05c46b",padding:15,width: (AnchoPantalla * (0.95)) * (0.40),borderRadius:13}}>
            <Text style={{textAlign:"center",fontSize:15,color:"white",fontFamily: "Viga-Regular"}}>Guardar</Text>
            </TouchableOpacity>
           </View>

        </View>
  );break;
        case "Integrantes":

  function AgregaIntegrante(N,index){

    let aux=Salon.Seleccionados;
    let pasa=0;
    let indice=0
    for(let i=0;i<aux.length;i++){
      if(aux[i]===N){
        pasa=1;
        indice=i;
      }
    }
    if(pasa===0){//si no se repite
      setSalon({...Salon,Seleccionados:[...Salon.Seleccionados,N]})
      //Coloreado[index]=true;
      setColoreado(() => {
          let arregloAuxiliar = [...Coloreado];
          arregloAuxiliar[index] = true;
          return arregloAuxiliar;
      });
    }else{
      Salon.Seleccionados.splice(indice,1)
      setColoreado(() => {
          let arregloAuxiliar = [...Coloreado];
          arregloAuxiliar[index] = false;
          return arregloAuxiliar;
      });
    }

  }
  function Showme(a){
    let txt=""
    let i=0
    for(i=0; i < a.length; i++){
      txt+=a[i];
      txt+="/";
    }
    console.log("show me : ",txt);
  }

	async function crearConversacionDeTipoSalon(matriculaDelMaestro, arregloDeIntegrantes, nombreDelSalon){
		//Falta la foto, pero eso sera despues
		props.ModificarDatosEspecificosS({
			//Chats: objeto.arregloConConversacionesDeTipoChat,
			//Salones: objeto.arregloConConversacionesDeTipoSalon,
			ModalNuevoSalon: false
		  });

		let fechaActual = Fecha();

		let objetoConTodaLaInformacion = {
			matriculaDelMaestro: matriculaDelMaestro,
			arregloDeIntegrantes: arregloDeIntegrantes,
			nombreDelSalon: nombreDelSalon,
			fechaDeCreacion: fechaActual,
      comprobacionDeFoto: (fotoSalonNueva.data === null ) ? false : true
		};
		let json = JSON.stringify(objetoConTodaLaInformacion);

    RNFetchBlob.fetch('POST', 'http://backpack.sytes.net/servidorApp/php/mensajes/crearConversacion/crearConversacionDeTipoSalon.php', {
      Authorization : "Bearer access-token",
      otherHeader : "foo",
      'Content-Type' : 'multipart/form-data',
    },
    [
      { name : 'fotoSalonNueva', filename : fotoSalonNueva.name, type:fotoSalonNueva.type, data: fotoSalonNueva.data},
      { name : 'indice', data:json}
    ]).then((response) => response.text())
         .then(async (respuesta)=>{
           console.log("Estado del salon = ", respuesta)
           if(respuesta === "Hecho"){
             
			 ToastAndroid.show('Salón creado Correctamente' , ToastAndroid.SHORT);
             props.ModificarDatosEspecificosS({
               //Chats: objeto.arregloConConversacionesDeTipoChat,
               //Salones: objeto.arregloConConversacionesDeTipoSalon,
               ModalNuevoSalon: false
             });
           }
           else{
             
			 ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
			 console.log("linea 1152 error: ",respuesta)
           }

         }).catch((err) => {
      console.log(err)
    })

    /*
		let datos = new FormData();
		datos.append('indice', json);
		let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/mensajes/crearConversacion/crearConversacionDeTipoSalon.php',{
			method: 'POST',
			body: datos
		})
		.then((mensaje) => mensaje.text())
		.then(async (respuesta) => {
			if(respuesta === "Hecho"){
				let formData = new FormData();
				formData.append('indice', props.Administrador.Id);

				let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/mensajes/traerConversaciones/traerConversacionesDeTipoChatYSalon.php',{
					method: 'POST',
					body: formData
				})
				.then((mensaje) => mensaje.text())
				.then((otraRespuesta) => {
					//console.log('ESTA FUE LA RESPUESTA DEL SERVIDOR = ', respuesta);


					let objeto = JSON.parse(otraRespuesta); //respuesta LO CONVIERTO A UN OBJETO JAVASCRIPT


					props.ModificarDatosEspecificosS({
						Chats: objeto.arregloConConversacionesDeTipoChat,
						Salones: objeto.arregloConConversacionesDeTipoSalon,
						ModalNuevoSalon: false
					});
				})
				.catch((error) => {alert(error);});

				alert("Sal�n creado correctamente.");
			}
			else{
				Alert.alert("Ocurri� un error.");
			}
		})
		.catch((error) => {
			Alert.alert(error);
		});
*/
	}





    return(

        <View style={{width:AnchoPantalla * (0.95),height:AltoPantalla * (0.8),justifyContent:"flex-start",alignItems:"center",backgroundColor:"#111",borderRadius:10}}>

			<View style={{backgroundColor:null,width:(AnchoPantalla * (0.95)) * (0.8),padding:10,justifyContent:"space-around",alignItems:"center",alignSelf:"center",flexDirection:"row"}}>
				<Icon name='users' type="font-awesome" color='#feca57' size={30}/>
				<Text  style={{fontSize: 15,fontFamily: "Viga-Regular",color:"#fff",marginLeft: 20}}>Integrantes</Text>
			</View>


			<View style={{backgroundColor:"#c8d6e5",width:AnchoPantalla * (0.95),padding:15,height:"70%",justifyContent:"center",alignItems:"center",alignSelf:"center"}}>


				{(ContactosParaSalon === null)?
					<>
						<ActivityIndicator size={'large'} color={'black'}/>
					</>
				:
					<FlatList
						data={ContactosParaSalon}
						keyExtractor={(item) => item.Id}
						//initialNumToRender={5}
						ListHeaderComponent={()=>(<View style={{width:(AnchoPantalla * (0.95)) * (0.9),height:25}}/>)}
						ItemSeparatorComponent={()=>(<View style={{width:(AnchoPantalla * (0.95)) * (0.9),height:15}}/>)}
						ListFooterComponent={()=>(<View style={{width:(AnchoPantalla * (0.95)) * (0.9), height:25}}/>)}
						renderItem={
							({item,index})=>(
								
								<ItemContactoSeleccionable
									Id={item.Id}
									Nombre={item.Nombre}
									Avatar={item.Avatar}
									Especialidad={item.Especialidad}
									Accion={
										()=>AgregaIntegrante(item.Id, index)
									}
									Selected={Coloreado[index]}
								/>
								
							)
						}
					/>
				}


			</View>


			<View style={{width:AnchoPantalla * (0.95),flexDirection:"row",justifyContent:"space-around",alignItems:"center",margin:10}}>
				<TouchableOpacity onPress={
					()=>{
						setColoreado(null);
						modificarContactosParaSalon(null);
						setUbicacion("Foto");

					}
				} style={{backgroundColor:"#f53b57",padding:15,width: (AnchoPantalla * (0.95)) * (0.40),borderRadius:13}}>
					<Text  style={{textAlign:"center",fontSize: 15,fontFamily: "Viga-Regular",color:"#fff"}}>Cancelar</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={()=>{
					Alert.alert(
						'Pregunta:',
						"¿Estas seguro de crear este salón con esta información?",
						[
							{
								text: 'No',
							},
							{
								text: 'Si',
								onPress: () => {
									console.log("Antes de enviar la informacion: ", Salon.Seleccionados);
									crearConversacionDeTipoSalon(props.Administrador.Id, Salon.Seleccionados, Salon.Descripcion);
								}
							}
						],
						{
							cancelable: false
						}
					);

					//Showme(Salon.Seleccionados)
				}} style={{backgroundColor:"#10ac84",padding:15,width: (AnchoPantalla * (0.95)) * (0.40),borderRadius:13}}>
					<Text  style={{textAlign:"center",fontSize: 15,fontFamily: "Viga-Regular",color:"#fff"}}>Guardar</Text>
				</TouchableOpacity>
			</View>

        </View>
	);
	break;
  }
}



const ComponenteDeImagen = (props)=> {
const [ModalVisible, setModalVisible] = useState(false);

const estilos = StyleSheet.create({
  contenedorPrincipal : {
      width: 200,
      height: 200,
      borderRadius: 100,
      overflow: "hidden"

  },
  contenedorSecundario : {
      width: '100%',
      height: '100%',
      flexDirection: 'row'

    }
});

return(
<>
  <View style={estilos.contenedorPrincipal}>

    <View style={estilos.contenedorSecundario}>
      <TouchableWithoutFeedback onPress={()=>setModalVisible(true)} style={{flex:1}}>
        <Image source={{uri:props.urlDeImagen}} style={{
            flex: 1,
            height: undefined,
            width: undefined,
            backgroundColor: "#222f3e"

        }} resizeMode="contain"/>
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


const ItemChat = (props) => {
	const {Id,Nombre,Avatar,UltVez} = props;

  const datosDelComponenteR = useRef({
    alturaDeScrollView: (alturaDeVistaInicial * .9) * .9
  });

	const [datosDelComponenteS, modificarDatosDelComponenteS] = useState({
		muestreoDelModal: false,
		estadoDelModal: 1
	});

	const eventos = {
		onCloseModal: () => {
			modificarDatosDelComponenteS({
				...datosDelComponenteS,
				muestreoDelModal: !(datosDelComponenteS.muestreoDelModal)
			});
		},
		eliminarConversacionDeTipoChat: async () => {
			console.log("IdDeConversacion: " + Id);
			let objeto = {
				idDeConversacion: Id
			}
			let json = JSON.stringify(objeto);
			let datos = new FormData();
			datos.append("indice", json);
			let promesa = await fetch("http://backpack.sytes.net/servidorApp/php/mensajes/eliminarConversacion/eliminarConversacionDeTipoChat.php", {
				method: "POST",
				body: datos
			})
			.then(msj => msj.text())
			.then(respuesta => {
				if(respuesta === "Hecho"){
					eventos.onCloseModal();
					props.TraerConversaciones();
					
				}
				else{
					ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
				  	console.log("linea 1396 error: ",respuesta)
				}
			})
			.catch(error => {
				ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
				console.log("linea 1401 error: ",error)
			});
		}
	}

  return(
	<>
    <TouchableOpacity onLongPress={eventos.onCloseModal} onPress={props.Accion} style={{backgroundColor:"#f5f6fa",borderRadius:10,borderBottomWidth:4,borderWidth:1,borderColor:"rgba(0,0,0,0.2)",borderBottomColor:"rgba(0,0,0,0.2)", width:AnchoPantalla * (0.9),alignSelf:"center", flexDirection: "row", justifyContent: 'space-around' , alignItems:"center" , padding : 5}}>
      <View style={{width: (AnchoPantalla * (0.9)) * (0.20), alignItems: "center", justifyContent: "center"}}>
        <IconoDeAvatar title={"US"} source={{uri: Avatar}} size={"medium"} rounded/>
      </View>
      <View style={{width: (AnchoPantalla * (0.9)) * (0.70)}}>
        <Text style={{color:"#222f3e",fontSize:17,fontFamily: "Viga-Regular"}}>{Nombre.Nombres + " " +Nombre.ApellidoPaterno + " " + Nombre.ApellidoMaterno}</Text>
        <Text style={{color:"#8395a7",fontSize:13,fontFamily: "Viga-Regular"}}>Última vez: <Text style={{color:"#576574",fontSize:15,fontFamily: "Viga-Regular"}}>{UltVez}</Text></Text>
      </View>
    </TouchableOpacity>

		{(datosDelComponenteS.muestreoDelModal) ?
			<Modal visible={true} onRequestClose={eventos.onCloseModal} transparent={true}>
				<View style={{backgroundColor: "rgba(1,1,1,.5)", width: "100%", height: "100%", justifyContent: "center", alignItems: "center", }}>
					<View style={{width: "95%", height: "90%", alignItems: "center", backgroundColor:"#c8d6e5", borderRadius:20, overflow: "hidden"}}>
						<View style={{width: "100%", height: "10%", backgroundColor:"#222f3e", flexDirection: "row", justifyContent: "space-around", alignItems: "center", overflow: "hidden"}}>
							<Text style={{fontSize: 18, color: "#2e86de"}}>Ajustes del chat</Text>
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
                          <Text style={{position: "absolute", left: "10%"}}>Eliminar Conversación</Text>
                          <Text style={{position: "absolute", right: "10%"}}>{">"}</Text>
                        </View>
                      </TouchableNativeFeedback>
                    </View>
                  </>
                : (datosDelComponenteS.estadoDelModal === 2) ?
                  <>
                    <Text style={{alignSelf: 'center',textAlign:"center",margin:5}}>{"¿Estás seguro de que quieres eliminar esta conversacion?"}</Text>
                    <View style={{justifyContent: 'space-around', flexDirection: 'row',width: "100%"}}>
                      <View style={{width: "35%", height: 30, backgroundColor: "green", overflow: "hidden", borderRadius: 20}}>
                        <TouchableNativeFeedback onPress={() => {
                          modificarDatosDelComponenteS({
                            ...datosDelComponenteS,
                            estadoDelModal: 1
                          });
                        }}>
                          <View style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
                            <Text>No</Text>
                          </View>
                        </TouchableNativeFeedback>
                      </View>
                      <View style={{width: "35%", height: 30, backgroundColor: "red", overflow: "hidden", borderRadius: 20}}>
                        <TouchableNativeFeedback onPress={eventos.eliminarConversacionDeTipoChat}>
                          <View style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
                            <Text>Si</Text>
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

const ItemSalon = (props) => {
  const {Id,Nombre,Avatar,UltVez, Matricula} =  props;

  const datosDelComponenteR = useRef({
    alturaDeScrollView: (alturaDeVistaInicial * .9) * .9
  });

	const [datosDelComponenteS, modificarDatosDelComponenteS] = useState({
		muestreoDelModal: false,
		estadoDelModal: 1
	});

	const eventos = {
		onCloseModal: () => {
			modificarDatosDelComponenteS({
				...datosDelComponenteS,
				muestreoDelModal: !(datosDelComponenteS.muestreoDelModal)
			});
		},
		salirDelSalon: async () => {
			console.log("Datos: ", props);
			let objeto = {
				matricula: Matricula,
				idDeSalon: Nombre
			}
			let json = JSON.stringify(objeto);
			let datos = new FormData();
			datos.append("indice", json);

			let promesa = await fetch("http://backpack.sytes.net/servidorApp/php/mensajes/eliminarConversacion/salirDelSalon.php", {
				method: "POST",
				body: datos
			})
			.then(msj => msj.text())
			.then(respuesta => {
				if(respuesta === "Hecho"){
					eventos.onCloseModal();
					props.TraerConversaciones();
					
				}
				else{
					ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
				  	console.log("linea 1528 error: ",respuesta)
				}
			})
			.catch(error => {
				ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
				console.log("linea 1533 error: ",error)
			});
		}
	}

	return(


<>
        <TouchableOpacity  onLongPress={eventos.onCloseModal} onPress={props.Accion} style={{backgroundColor:"#f5f6fa",borderRadius:10,borderBottomWidth:4,borderWidth:1,borderColor:"rgba(0,0,0,0.2)",borderBottomColor:"rgba(0,0,0,0.2)", width:AnchoPantalla * (0.9),alignSelf:"center", flexDirection: "row", justifyContent: 'space-around' , alignItems:"center" , padding : 5}}>
            <View style={{width: (AnchoPantalla * (0.9)) * (0.20), alignItems: "center", justifyContent: "center"}}>
              <IconoDeAvatar rounded title={"AG"} source={{uri: Avatar}} size={"medium"}/>
            </View>
              <View style={{width: (AnchoPantalla * (0.9)) * (0.70)}}>
                <Text style={{color:"#222f3e",fontSize:17,fontFamily: "Viga-Regular"}}>{Nombre}</Text>
                <Text style={{color:"#8395a7",fontSize:13,fontFamily: "Viga-Regular"}}>Última vez: <Text style={{color:"#576574",fontSize:15,fontFamily: "Viga-Regular"}}>{UltVez}</Text></Text>
              </View>
        </TouchableOpacity>



			{(datosDelComponenteS.muestreoDelModal) ?
				<Modal visible={true} onRequestClose={eventos.onCloseModal} transparent={true}>
					<View style={{backgroundColor: "rgba(1,1,1,.5)", width: "100%", height: "100%", justifyContent: "center", alignItems: "center", }}>
						<View style={{width: "95%", height: "90%", alignItems: "center", backgroundColor:"#c8d6e5", borderRadius:20, overflow: "hidden"}}>
							<View style={{width: "100%", height: "10%", backgroundColor:"#222f3e", flexDirection: "row", justifyContent: "space-around", alignItems: "center", overflow: "hidden"}}>
								<Text style={{fontSize: 18, color: "#2e86de"}}>Ajustes del salón</Text>
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
                            <Text style={{position: "absolute", left: "10%"}}>Salir Del Salón</Text>
                            <Text style={{position: "absolute", right: "10%"}}>{">"}</Text>
                          </View>
                        </TouchableNativeFeedback>
                      </View>
                    </>
                  : (datosDelComponenteS.estadoDelModal === 2) ?
                    <>
                      <Text style={{alignSelf: 'center',textAlign:"center",margin:5}}>{"¿Estás seguro de que quieres salir de este salon?"}</Text>
                      <View style={{justifyContent: 'space-around', flexDirection: 'row',width: "100%"}}>
                        <View style={{alignSelf: "center", width: "35%", height: 30, backgroundColor: "green", overflow: "hidden", borderRadius: 20}}>
                          <TouchableNativeFeedback onPress={() => {
                            modificarDatosDelComponenteS({
                              ...datosDelComponenteS,
                              estadoDelModal: 1
                            });
                          }}>
                            <View style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
                              <Text>No</Text>
                            </View>
                          </TouchableNativeFeedback>
                        </View>
                        <View style={{alignSelf: "center", width: "35%", height: 30, backgroundColor: "red", overflow: "hidden", borderRadius: 20}}>
                          <TouchableNativeFeedback onPress={eventos.salirDelSalon}>
                            <View style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
                              <Text>Si</Text>
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
    )
}


const ItemContacto = (props) => {
  const {Id,Nombre,Avatar,Especialidad} =  props;
  return(
    <TouchableOpacity onPress={props.Accion} style={{width: (AnchoPantalla * (0.95)) * (0.9), padding:5, alignSelf: "center", flexDirection: "row", backgroundColor: "#fff", borderRadius: 10, borderBottomWidth: 4, borderWidth: 1, borderColor: "rgba(0,0,0,0.2)", borderBottomColor: "rgba(0,0,0,0.2)"}}>
      <View style={{width: ((AnchoPantalla * (0.95)) * (0.9)) * (0.3), alignItems: "center", justifyContent: 'center'}}>
        <IconoDeAvatar title={"US"} source={{uri: Avatar}} size={"medium"} rounded/>
      </View>
      <View style={{width: ((AnchoPantalla * (0.95)) * (0.9)) * (0.7)}}>
        <Text style={{color:"#222f3e",fontSize:14,fontFamily: "Viga-Regular"}}>{Nombre.Nombres + " " +Nombre.ApellidoPaterno + " " + Nombre.ApellidoMaterno}</Text>
        <Text style={{color:"#0abde3",fontSize:13,fontFamily: "Viga-Regular"}}>Especialidad: <Text style={{color:"#ff6b6b",fontSize:13,fontFamily: "Viga-Regular"}}>{Especialidad}</Text></Text>
      </View>
    </TouchableOpacity>
  )
}



const ItemContactoSeleccionable = (props) => {
  const {Id,Nombre,Avatar,Especialidad} =  props;
  return(

                <TouchableOpacity  onPress={props.Accion} style={{width:(AnchoPantalla * (0.95)) * (0.9), padding:5,alignSelf:"center",justifyContent:"center",alignItems:"center",flexDirection:"row", backgroundColor: props.Selected ? "#2e86de": "#fff", borderRadius: 10, borderBottomWidth: 4, borderWidth: 1, borderColor: "rgba(0,0,0,0.2)", borderBottomColor: "rgba(0,0,0,0.2)"}}>
                    <View style={{width: ((AnchoPantalla * (0.95)) * (0.9)) * (0.3),alignItems: 'center',justifyContent: 'center'}}>
                      <IconoDeAvatar rounded title={"AG"} source={{uri: Avatar}} size={"medium"}/>
                    </View>
                      <View style={{width: ((AnchoPantalla * (0.95)) * (0.9)) * (0.7),justifyContent: 'center',alignItems: 'center'}}>
                        <Text style={{color:props.Selected ? "#dff9fb": "#1e90ff",fontSize:14,fontFamily: "Viga-Regular"}}>Nombre: <Text style={{color:props.Selected ? "black": "#ffa502",fontSize:14,fontFamily: "Viga-Regular"}}>{Nombre.Nombres + " " +Nombre.ApellidoPaterno + " " + Nombre.ApellidoMaterno}</Text></Text>
                        <View>
                          <Text style={{color:props.Selected ? "#dff9fb": "#ff4757",fontSize:13,fontFamily: "Viga-Regular"}}>Especialidad:<Text style={{color:props.Selected ? "black": "#5352ed",fontSize:13,fontFamily: "Viga-Regular"}}>{Especialidad}</Text></Text>
                        </View>

                      </View>
                </TouchableOpacity>


    )
}
