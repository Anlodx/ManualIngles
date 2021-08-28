import React,{Component,useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Modal,
  Image,
  Switch,
  TextInput,
  Dimensions,
  ActivityIndicator,
  ToastAndroid,
  Alert
} from 'react-native';

import { Icon,CheckBox } from 'react-native-elements';
import { ListItem } from 'react-native-elements';
import { Slider } from 'react-native-elements';

import { Button,SearchBar,ButtonGroup, Avatar as IconoDeAvatar } from 'react-native-elements';
import {Fecha} from "./../../../global/codigosJS/Metodos.js";


import ImageViewer from 'react-native-image-zoom-viewer';


import * as ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob'
import {useSelector, useDispatch} from 'react-redux';

const AltoPantalla = Dimensions.get("window").height;
const AnchoPantalla = Dimensions.get("window").width;



const ModalChat = (props) =>{
  const datosDeCredencial = useSelector(store => store.datosDeCredencial);
  const [ModalSalonVisible, setModalSalonVisible] = useState(true);
  const [ModalSalonDetallesVisible, setModalSalonDetallesVisible] = useState(false);
  const [MSJ, setMSJ] = useState(null);
  const VariableVerMasOMenos = useRef(0);


	//Usuario ES YO
  const Usuario = props.data[0];

	//La constante Salon tiene toda la informacion relacionada a: Detalles del salon, y Mensajes dentro del salon
  const [Salon, setSalon] = useState(
    {
		Detalles: props.data[1],
		Integrantes: props.data[2],
		Mensajes: props.mensajesPreCargados,
	    	CondicionalDeRegistros: 0,
		VisualizarBotonVerMasRecientes: false,
    });

  const [NombreSalon, setNombreSalon] = useState(Salon.Detalles.Nombre);
  const [FotoSalon, setFotoSalon] = useState(Salon.Detalles.Avatar);

  const eventosEspecificos = {
	traerMensajesDeUnaConversacionDeTipoSalon : async () => {
		//Salon.Detalles.Id

		let objetoConInformacion = {
			idDeConversacion: Salon.Detalles.Nombre,
			variableVerMasOMenos: VariableVerMasOMenos.current
		}

		let json = JSON.stringify(objetoConInformacion);
		let datos = new FormData();
		datos.append('indice', json);

		let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/mensajes/traerMensajesDeUnaConversacion/traerMensajesDeUnaConversacionDeTipoSalon.php', {
			method: 'POST',
			body: datos
		})
		.then((mensaje) => mensaje.text())
		.then((respuesta) => {
      //console.log("Respuesta en salon = ", respuesta);
			if(respuesta === "ERROR"){
				ToastAndroid.show('Rayos hubo un error.' , ToastAndroid.SHORT);
        console.log("linea 87 error");
			}
			else{
				let objeto = JSON.parse(respuesta);
        //console.log("mensajes => ",objeto.arregloConObjetosDeMensajeDeTipoSalon)
				/*
					$ObjetoConTodaLaInformacion->arregloConObjetosDeAlumnoDeIntegrantes = $ArregloConObjetosDeAlumnoDeIntegrantes;
					$ObjetoConTodaLaInformacion->arregloConObjetosDeMensajeDeTipoSalon = $ArregloConObjetosDeMensajeDeTipoSalon;
				*/

				setSalon({...Salon, Integrantes: objeto.arregloConObjetosDeAlumnoDeIntegrantes, Mensajes: objeto.arregloConObjetosDeMensajeDeTipoSalon, CondicionalDeRegistros: objeto.condicionalDeRegistros, VisualizarBotonVerMasRecientes: objeto.visualizarBotonVerMasRecientes});
			}
		})
		.catch((error) => {
			ToastAndroid.show('Rayos hubo un error.' , ToastAndroid.SHORT);
      console.log("linea 102 error : ",error);
		});

	},

  traerMaestroDeUnaConversacionDeTipoSalon : async () => {
		//Salon.Detalles.Id

		let objetoConInformacion = {
			idDeConversacion: Salon.Detalles.Nombre,
		}

		let json = JSON.stringify(objetoConInformacion);
		let datos = new FormData();
		datos.append('indice', json);

		let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/mensajes/detallesDeConversacion/traerMaestroDelSalon.php', {
			method: 'POST',
			body: datos
		})
		.then((mensaje) => mensaje.text())
		.then((respuesta) => {
//				console.log("respuesta del php de maestro => ",respuesta)
        if(respuesta != "ERROR"){
          let objeto = JSON.parse(respuesta)
          if(objeto.Id !== profe.Id){
          setProfe(objeto);
          //	console.log("respuesta del php de maestro todo bien (creo) => ",objeto)
          }
        }else{
          
          ToastAndroid.show('Rayos hubo un error.' , ToastAndroid.SHORT);
          console.log("linea 134 error al traer al profe");
        }


		})
		.catch((error) => {
			ToastAndroid.show('Rayos hubo un error.' , ToastAndroid.SHORT);
        console.log("linea 141 error: ",error);
		});

	},

	insertarMensajeEnConversacionDeTipoSalon : async (mensaje, tipoDeMensaje) => {
		let fechaActual = Fecha();

		let objetoConInformacion = {
			idDeConversacion: Salon.Detalles.Nombre,
			matriculaDeRemitente: Usuario.Id,
			contenido: mensaje,
			tipo: tipoDeMensaje,
			fechaDeSubida: fechaActual
		}

		let json = JSON.stringify(objetoConInformacion);
		let datos = new FormData();
		datos.append('indice', json);

		let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/mensajes/insertarMensajeEnConversacion/insertarMensajeEnConversacionDeTipoSalon.php',{
			method: 'POST',
			body: datos
		})
		.then((mensaje) => mensaje.text())
		.then((respuesta) => {
		//	console.log(respuesta);
      eventosEspecificos.insertarNotificacionDeConversacionDeTipoSalon();
		})
		.catch((error) => {
			ToastAndroid.show('Rayos hubo un error.' , ToastAndroid.SHORT);
      console.log("linea 172 error: ",error);
		});
	},

  insertarNotificacionDeConversacionDeTipoSalon: async () => {

    let objetoConInformacion = {
			matricula: Usuario.Id,
      idDelSalon : Salon.Detalles.Nombre
    };

    let json = JSON.stringify(objetoConInformacion);
    let datos = new FormData();
    datos.append('indice', json);

    let promesa = await fetch("http://backpack.sytes.net/servidorApp/php/mensajes/insertarNotificacion/insertarNotificacionDeConversacionDeTipoSalon.php", {
      method: 'POST',
      body: datos
    })
    .then((mensaje) => mensaje.text())
    .then((respuesta) => {
    //  console.log("respuesta => ",respuesta)
      if(respuesta !== "Hecho"){
        ToastAndroid.show('Rayos hubo un error.' , ToastAndroid.SHORT);
        console.log("linea 196 error: ",respuesta);
      }
    })
    .catch((error) => {
      ToastAndroid.show('Rayos hubo un error.' , ToastAndroid.SHORT);
      console.log("linea 201 error: ",error);
    });
  },

  traerComprobacionDeEstanciaEnElSalon : async () => {
		//Salon.Detalles.Id

		let objetoConInformacion = {
			idDeConversacion: Salon.Detalles.Nombre,
      idUsuario:datosDeCredencial.matricula
		}

		let json = JSON.stringify(objetoConInformacion);
		let datos = new FormData();
		datos.append('indice', json);

		let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/mensajes/detallesDeConversacion/traerComprobacionDeEstanciaEnElSalon.php', {
			method: 'POST',
			body: datos
		})
		.then((mensaje) => mensaje.text())
		.then((respuesta) => {
		    //console.log("respuesta del php de traer instancia => ",respuesta)
        if(respuesta === "SalonYaNoExiste"){

          ToastAndroid.show('Salón ya no existe' , ToastAndroid.SHORT);
          props.CerrarModal()
        }else if(respuesta==="NoEresParteDelSalon"){

          ToastAndroid.show('Ya no eres parte del salón' , ToastAndroid.SHORT);
          props.CerrarModal()
        }


		})
		.catch((error) => {
			ToastAndroid.show('Rayos hubo un error.' , ToastAndroid.SHORT);
      console.log("linea 238 error: ",error);
		});

	},

  salirDeSalonDesdeDetallesElSalon : async () => {
		//Salon.Detalles.Id

		let objetoConInformacion = {
			idDeSalon: Salon.Detalles.Nombre,
      matricula:datosDeCredencial.matricula
		}

		let json = JSON.stringify(objetoConInformacion);
		let datos = new FormData();
		datos.append('indice', json);

		let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/mensajes/eliminarConversacion/salirDelSalon.php', {
			method: 'POST',
			body: datos
		})
		.then((mensaje) => mensaje.text())
		.then((respuesta) => {
		    console.log("respuesta del php de salir desde detalles => ",respuesta)
        if(respuesta === "Hecho"){

          ToastAndroid.show('Ya no formas parte del Salón' , ToastAndroid.SHORT);
          setModalSalonDetallesVisible(false)
          props.CerrarModal()
        }else{
          
          ToastAndroid.show('Rayos hubo un error.' , ToastAndroid.SHORT);
          console.log("linea 270 error: ",respuesta);
        }


		})
		.catch((error) => {
			ToastAndroid.show('Rayos hubo un error.' , ToastAndroid.SHORT);
      console.log("linea 277 error: ",error);
		});

	},


  }




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
          //console.log(response)
          RNFetchBlob.fetch('POST', 'http://backpack.sytes.net/servidorApp/php/mensajes/detallesDeConversacion/establecerFotoNuevaParaSalon.php', {
            Authorization : "Bearer access-token",
            otherHeader : "foo",
            'Content-Type' : 'multipart/form-data',
          },
          [
            { name : 'fotoSalonNueva', filename : response.fileName, type:response.type, data: response.base64},
            { name : 'indice', data:Salon.Detalles.Nombre}
          ]).then((response) => response.text())
               .then((responseText)=>{
                 console.log(responseText)
                 ToastAndroid.show('Foto Cambiada, vuelve a entrar para ver cambios' , ToastAndroid.SHORT);

               }).catch((err) => {
            console.log(err)
          })


          }
        });
        }

        const uploadPhoto = () =>
        {

        }



  const cambiarNombreSalon = (variableRemplazar,variableNueva) => {
    console.log(" metodo para cambiar Nombre de salon");
    console.log(" variable va a cambiar de => ",variableRemplazar," , a =>",variableNueva);
  }
  const cambiarFotoSalon = () => {
    console.log(" metodo para cambiar foto de salon");
    selectPhoto();

  }

  const [listadoRetornado,setListadoRetornado] = useState(null)

  const idDelTimer = useRef(null);

  const [profe,setProfe] = useState({
    Id:null,
    Avatar:null,
    Especialidad:null,
    Nombre:{
      Nombres:null,
      ApellidoMaterno:null,
      ApellidoPaterno:null
    }

  })

  useEffect(() => {

	idDelTimer.current = setInterval(() => {
    eventosEspecificos.traerComprobacionDeEstanciaEnElSalon();
    eventosEspecificos.traerMaestroDeUnaConversacionDeTipoSalon();
		eventosEspecificos.traerMensajesDeUnaConversacionDeTipoSalon();

    //console.log("hola desde el timer modal salon de salon")


	}, 1000);

	return (() => {
		clearInterval(idDelTimer.current);
	});
  }, []);
  return(
    <>
        <View style={{flex:1,backgroundColor:"#dfe4ea"}}>



                <TouchableOpacity  onPress={()=>{
                  setModalSalonDetallesVisible(true)
                }} style={{width:AnchoPantalla,alignSelf:"center",justifyContent:"center",alignItems:"center",flexDirection:"row", backgroundColor: "#111",padding: 3}}>
                    <View style={{width: AnchoPantalla * (0.20),flexWrap: 'nowrap',alignItems: 'center',justifyContent: 'center',overflow:"hidden"}}>
                      <IconoDeAvatar rounded title={"AG"} source={{uri: Salon.Detalles.Avatar}} size={"small"}/>
                    </View>

                      <View style={{flexDirection:"row",justifyContent:"space-around",width:AnchoPantalla * (0.70),alignContent:"center",alignItems:"center",alignSelf:"center"}}>
                        <Text style={{color:"#fff",textAlign:"center",fontSize:14,fontFamily: "Viga-Regular",width: (AnchoPantalla * (0.70)) * (0.8) }}>{Salon.Detalles.Nombre}</Text>
                        <Icon name={"close"} type={"font-awesome"} size={29} color={"#dcdde1"} onPress={props.CerrarModal} containerStyle={{width: (AnchoPantalla * (0.70)) * (0.2)}}/>
                      </View>

                </TouchableOpacity>




            


                
                <FlatList

data={Salon.Mensajes}
keyExtractor={(item)=>item.Orden}
ListHeaderComponent={()=>(
<>{(Salon.CondicionalDeRegistros <= 0) ?
  <View style={{width:"100%",height:15}}/>
:
        <TouchableOpacity onPress={()=>{
            VariableVerMasOMenos.current=VariableVerMasOMenos.current + 1;
          }} style={{width: Dimensions.get("window").width, height: (Dimensions.get("window").height) * (0.05), padding: 2,color:"#fff",backgroundColor: "#26de81",marginBottom: 15}}>
            <Text style={{textAlign:"center",color:"#111",fontSize:17,fontFamily: "Viga-Regular"}}> Ver Anteriores </Text>
        </TouchableOpacity>
}</>
)}
ItemSeparatorComponent={()=>(<View style={{width:"100%",height:15}}/>)}
ListFooterComponent={()=>(
<>{(Salon.VisualizarBotonVerMasRecientes) ?
<TouchableOpacity onPress={()=>{
  VariableVerMasOMenos.current=VariableVerMasOMenos.current - 1;
}} style={{width: Dimensions.get("window").width, height: (Dimensions.get("window").height) * (0.05), padding: 2,color:"#fff",backgroundColor: "#26de81",marginTop: 15}}>
<Text style={{textAlign:"center",color:"#111",fontSize:17,fontFamily: "Viga-Regular"}}> Ver Más Recientes </Text>
</TouchableOpacity>
:
<View style={{width:"100%",height:15}}/>
}</>
)}

ListEmptyComponent={
  ()=>(
    <View style={{width:AnchoPantalla * (0.8),padding:10,justifyContent:"center",alignSelf:"center",alignItems:"center",backgroundColor:"#111",borderRadius:10}}>
      <Text style={{textAlign:"center",color:"#fff",fontSize:17,fontFamily: "Viga-Regular"}}> Inicia La conversación. </Text>
    </View>
    )
}
renderItem={
({item})=>{
return(
    <View style={{width:AnchoPantalla * (0.65),padding:8,marginLeft:5,marginRight:5,backgroundColor:item.Id===Usuario.Id ? "#ff9f43" : "#2e86de" ,alignSelf: item.Id===Usuario.Id ? "flex-end" : "flex-start" ,justifyContent:"center",alignItems:"center",alignContent:"center",borderRadius:10}}>

        <Text style={{color:"#6F1E51",fontFamily: "Viga-Regular",textAlign:item.Id===Usuario.Id ? "right" : "left",fontSize:16,width:"100%"}}>{item.Nombre.Nombres + " " +item.Nombre.ApellidoPaterno + " " + item.Nombre.ApellidoMaterno}</Text>
        
        
      <Text style={{color:"#fff",fontFamily: "Viga-Regular",textAlign:item.Id===Usuario.Id ? "right" : "left",fontSize:16,width:"100%"}}>{item.Mensaje}</Text>
      <Text style={{color:"#222f3e",fontFamily: "Viga-Regular",textAlign:item.Id===Usuario.Id ? "right" : "left",fontSize:13,width:"100%"}}>{item.Fecha}</Text>
        
            
    </View>
  )
 }
}
/>
               

                



          <View style={{alignSelf:"center",flexDirection:"row",justifyContent:"space-around",alignItems:"center",width:AnchoPantalla,backgroundColor:"#ced6e0"}}>
                  <TextInput
                   textAlign={"center"}
                   value={MSJ}
                   style={{borderWidth:1,borderColor:"#777",padding:5,margin:8,width:AnchoPantalla * (0.70),color:"#fff",borderRadius:15,backgroundColor:"#2f3542"}}
                   //placeholder={"Comenta algo..."}
                   //placeholderTextColor={"#fff"}
                   onChangeText={(Val)=>setMSJ(Val)}
                   autoFocus={true}
                   //maxLength={60}
                  />
                  <Icon name='send' type="material-community" color='#ff4757' size={28} containerStyle={{width:AnchoPantalla * (0.20),backgroundColor:null}} onPress={() => {


					if(MSJ === null || MSJ === ""){
            ToastAndroid.show('No puedes enviar mensajes vacios.' , ToastAndroid.SHORT);
					}
					else{
						//POR DEFECTO, EL TIPO DE MENSAJE ES 'texto'
						eventosEspecificos.insertarMensajeEnConversacionDeTipoSalon(MSJ, 'texto');
						setMSJ(null);
					}

				  }}/>
          </View>
        </View>

      <Modal visible={ModalSalonDetallesVisible}
       onShow={()=>{
         clearInterval(idDelTimer.current);

      }}
       onRequestClose={()=>{
         setModalSalonDetallesVisible(false)
         idDelTimer.current = setInterval(() => {
           eventosEspecificos.traerComprobacionDeEstanciaEnElSalon();
           eventosEspecificos.traerMaestroDeUnaConversacionDeTipoSalon();
       		eventosEspecificos.traerMensajesDeUnaConversacionDeTipoSalon();
          console.log("hola desde el timer modal salon de salon desde cerrar <-")
       	}, 1000);

       }}
      animationType="slide" transparent={true}>
        <View style={{width: AnchoPantalla,height: AltoPantalla,justifyContent:"center",alignItems:"center",backgroundColor:"#535c68"}}>


              <View style={{width: AnchoPantalla,padding:12,backgroundColor:"#111",justifyContent:"space-around",alignItems:"center",alignSelf:"center",flexDirection:"row"}}>

                <Text style={{width:(AnchoPantalla * (0.75)),color:"#fff",textAlign:"center",fontSize:16,fontFamily: "Viga-Regular"}}>Detalles: {Salon.Detalles.Nombre}</Text>
                <Icon name={"close"} type={"font-awesome"} size={30} color={"#dcdde1"}
                 onPress={()=>{
                   setModalSalonDetallesVisible(false)
                   idDelTimer.current = setInterval(() => {
                     eventosEspecificos.traerComprobacionDeEstanciaEnElSalon();
                     eventosEspecificos.traerMaestroDeUnaConversacionDeTipoSalon();
                 		eventosEspecificos.traerMensajesDeUnaConversacionDeTipoSalon();
                    console.log("hola desde el timer modal salon de salon desde cerrar  X")
                 	}, 1000);

                 }}
                  containerStyle={{width:(AnchoPantalla * (0.15))}}/>

              </View>

              <ScrollView>
              <View style={{width: AnchoPantalla,backgroundColor:null,justifyContent:"center",alignItems:"center",alignSelf:"center",alignContent:"center"}}>


                <View style={{width: AnchoPantalla * (0.8),justifyContent:"space-around",alignItems:"center",alignSelf:"center",flexDirection:"row",margin:10}}>
                  <Icon name='photo' type="font-awesome" color='#7ed6df' size={25}/>
                  <Text style={{color:"#fff",fontSize:18,fontFamily: "Viga-Regular"}}>Foto del Salón</Text>
                </View>
                <Text style={{color:"#fff",fontSize:14,textAlign:"center",margin:10,fontFamily: "Viga-Regular"}}>Sal y vuelve a entrar al Salón para ver cambios.</Text>

                <ComponenteDeImagen urlDeImagen={Salon.Detalles.Avatar}/>

                <>
                {

                (profe.Id===datosDeCredencial.matricula) ?

                      
                  <TouchableOpacity onPress={cambiarFotoSalon} style={{backgroundColor:"#3c40c6",padding:10,width: (AnchoPantalla * (0.95)) * (0.4),borderRadius:13,flexDirection:"row",justifyContent:"space-around",alignItems:"center",alignSelf: 'center',margin: 5}}>
                    <Icon name='plus' type="font-awesome" color='#ffa801' size={28}/>
                    <Text style={{textAlign:"center",fontSize:15,color:"white",marginLeft:10,fontFamily: "Viga-Regular"}}>Nueva</Text>
                  </TouchableOpacity>
                  :
                  null
                }
                </>

                <Text style={{textAlign:"center",fontSize:15,color:"white",marginTop: 15,marginBottom: 15,fontFamily: "Viga-Regular"}}>  Maestro del Salón </Text>

                <ItemContactoSeleccionable
                  Id={profe.Id}
                  Nombre={profe.Nombre}
                  Avatar={profe.Avatar}
                  Especialidad={profe.Especialidad}
                  Accion={
                    ()=>null//AgregaIntegrante(item.Id, index)
                  }
                  Selected={false}
                />

                <TouchableOpacity onPress={()=>{
                  Alert.alert(
                      'Pregunta:',
                      "¿Estas seguro de querer Salir de este salón?",
                      [
                        {
                          text: 'No',
                        },
                        {
                          text: 'Si',
                          onPress: () => {
                            eventosEspecificos.salirDeSalonDesdeDetallesElSalon()
                          }
                        }
                      ],
                      {
                        cancelable: false
                      }
                    );
                  
                }} style={{backgroundColor:"#3c40c6",padding:13,width: (AnchoPantalla * (0.95)) * (0.4),borderRadius:13,flexDirection:"row",justifyContent:"space-around",alignItems:"center",alignSelf: 'center',margin: 5}}>
                  <Icon name='exit-run' type="material-community" color='#7ed6df' size={28}/>
                    <Text style={{textAlign:"center",fontSize:15,color:"white",marginLeft:10,fontFamily: "Viga-Regular"}}>Abandonar</Text>
                </TouchableOpacity>


              </View>




              <View style={{width: AnchoPantalla,justifyContent:"center",alignItems:"center",flexDirection: 'row',backgroundColor:null,marginBottom: 20}}>
                    <>
                    {

                    (profe.Id===datosDeCredencial.matricula) ? //aqui hay que corregir
                    <>
                    <TouchableOpacity onPress={()=>setListadoRetornado("AGREGAR")} style={{backgroundColor:"#130f40",padding:13,width: (AnchoPantalla * (0.95)) * (0.4),borderRadius:13,flexDirection:"row",justifyContent:"space-around",alignItems:"center",alignSelf: 'center',margin: 5}}>
                      <Icon name='plus' type="font-awesome" color='#7ed6df' size={25}/>
                      <Text style={{textAlign:"center",fontSize:15,color:"white",marginLeft:10,fontFamily: "Viga-Regular"}}>Agregar</Text>
                    </TouchableOpacity>

                      <TouchableOpacity onPress={()=>setListadoRetornado("ELIMINAR")} style={{backgroundColor:"#130f40",padding:13,width: (AnchoPantalla * (0.95)) * (0.4),borderRadius:13,flexDirection:"row",justifyContent:"space-around",alignItems:"center",alignSelf: 'center',margin: 5}}>
                        <Icon name='database-settings' type="material-community" color='#7ed6df' size={25}/>
                        <Text style={{textAlign:"center",fontSize:15,color:"white",marginLeft:10,fontFamily: "Viga-Regular"}}>Visualizar/Expulsar</Text>
                      </TouchableOpacity>
                      </>
                      :
                      <TouchableOpacity onPress={()=>setListadoRetornado("VISUALIZAR")} style={{backgroundColor:"#130f40",padding:13,width: (AnchoPantalla * (0.95)) * (0.4),borderRadius:13,flexDirection:"row",justifyContent:"space-around",alignItems:"center",alignSelf: 'center',margin: 5}}>
                        <Icon name='eye' type="font-awesome-5" color='#7ed6df' size={25}/>
                        <Text style={{textAlign:"center",fontSize:15,color:"white",marginLeft:10,fontFamily: "Viga-Regular"}}>Visualizar Integrantes</Text>
                      </TouchableOpacity>
                    }
                    </>

              </View>
              <>
              {
                  (listadoRetornado === "AGREGAR") ?
                    <IntegrantesListaAgregar idSalon={Salon.Detalles.Nombre} cerrarModalPrincipal={props.CerrarModal}/>
                  : (listadoRetornado === "ELIMINAR") ?
                    <IntegrantesListaELiminar idSalon={Salon.Detalles.Nombre} cerrarModalPrincipal={props.CerrarModal}/>
                  : (listadoRetornado === "VISUALIZAR") ?
                    <IntegrantesListaVisualizar idSalon={Salon.Detalles.Nombre} cerrarModalPrincipal={props.CerrarModal}/>
                  :
                  null
              }
              </>
              <View style={{height:30, width:AnchoPantalla,backgroundColor:null}}/>
              </ScrollView>

        </View>
      </Modal>

    </>
    )
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
            backgroundColor: "#30336b"

        }} resizeMode="contain"/>
      </TouchableWithoutFeedback>
    </View>

    <Modal style={{flex:1}} visible={ModalVisible} onRequestClose={()=>setModalVisible(false)} transparent={false} animationType={"fade"}>
      <View  style={{flex:1, justifyContent:"center",flexDirection:"column"}}>

        <ImageViewer imageUrls={[{url: props.urlDeImagen}]}
          renderIndicator={()=>null}
          renderHeader={()=>(
            <View style={{width:"100%",height:50,justifyContent:"flex-start",flexDirection:"row",alignItems:"center",alignSelf:"center"}}>
              <Icon type="material" name="arrow-back" size={28} color="#52575D" onPress={()=>setModalVisible(false)}/>
            </View>
          )}
        />
      </View>
    </Modal>
  </View>
</>
  );
}


export default ModalChat;






const  IntegrantesListaAgregar = (props) => {

    const datosDeCredencial = useSelector(store => store.datosDeCredencial);
    const [Coloreado,setColoreado]  = useState(null);
    const [ContactosParaSalon, modificarContactosParaSalon] = useState(null);

      const [Salon, setSalon] = useState({
        Descripcion: null,
        src: null,
        Seleccionados: []
      });

      useEffect(()=>{
        traerLosAlumnosCorrectosParaIniciarUnSalon();
      },[])

    	const traerLosAlumnosCorrectosParaIniciarUnSalon = async () => {
    		let datos = new FormData();
        let objetoAux = {
          matriculaUsuario:datosDeCredencial.matricula,
          idSalon: props.idSalon
        }
    		datos.append('indice', JSON.stringify(objetoAux));



    		let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/mensajes/detallesDeConversacion/traerLosAlumnosCorrectosParaAgregarIntegrantesAUnSalon.php',{
    			method: 'POST',
    			body: datos
    		})
    		.then((mensaje) => mensaje.text())
    		.then((respuesta) => {

    			let arreglo = JSON.parse(respuesta);
          console.log("respuesta de traer integrantes para agregar => ",arreglo)

    			let ArrAux = [];
    			for(let r=0;r<arreglo.length;r++){
    				ArrAux.push(false);
    			}

    			setColoreado(ArrAux);

    			modificarContactosParaSalon(arreglo);

    		})
    		.catch((error) => {
    			console.log("Error al traer informaci�n => ",error);
    		});

    	}

      const enviarLosAlumnosCorrectosParaAgregarAUnSalon = async () => {
    		let datos = new FormData();
        let objetoAux = {
          idSalon: props.idSalon,
          seleccionados:Salon.Seleccionados
        }
        //console.log("este es el objeto para agregar => ",objetoAux)

    		datos.append('indice', JSON.stringify(objetoAux));

    		let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/mensajes/detallesDeConversacion/incluirAlumnosEnSalon.php',{
    			method: 'POST',
    			body: datos
    		})
    		.then((mensaje) => mensaje.text())
    		.then((respuesta) => {

    		//	let arreglo = JSON.parse(respuesta);
          console.log("respuesta de traer integrantes para agregar => ",respuesta)
          if(respuesta==="Hecho"){
              traerLosAlumnosCorrectosParaIniciarUnSalon();
          }else{
            ToastAndroid.show('Rayos hubo un error.' , ToastAndroid.SHORT);
            console.log("linea 760 error: ",respuesta);
          }


    		})
    		.catch((error) => {
          ToastAndroid.show('Rayos hubo un error.' , ToastAndroid.SHORT);
    			console.log("linea 767 Error al enviar informacion => ",error);
    		});

    	}

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
    console.log("show me salones: ",txt);
  }

    return(

    <>



      
  			<View style={{backgroundColor:null,width:AnchoPantalla * (0.7),justifyContent:"space-around",alignItems:"center",alignSelf:"center",flexDirection:"row"}}>
  				<Icon name='users' type="font-awesome" color='#f6e58d' size={30}/>
  				<Text style={{textAlign:"center",fontSize:15,color:"#ecf0f1",marginLeft:10,fontFamily: "Viga-Regular"}}>Agregar integrantes</Text>
  			</View>



			<>


				{(ContactosParaSalon === null)?
					<>
						<ActivityIndicator size={'large'} color={'black'}/>
					</>
				:
					<FlatList
						data={ContactosParaSalon}
						keyExtractor={(item) => item.Id}
						initialNumToRender={5}
						ListHeaderComponent={()=>(<View style={{width:"100%",height:25}}/>)}
						ItemSeparatorComponent={()=>(<View style={{width:"100%",height:15}}/>)}
						ListFooterComponent={()=>(<View style={{width:"100%",height:25}}/>)}
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


			</>



				<TouchableOpacity onPress={()=>{
					//Showme(Salon.Seleccionados)
          if(Salon.Seleccionados.length > 0){
          enviarLosAlumnosCorrectosParaAgregarAUnSalon();
        }else{
          ToastAndroid.show('Tienes que seleccionar a un usuario de la lista.' , ToastAndroid.SHORT);
        }

				}} style={{backgroundColor:"#1289A7",padding:13,width: (AnchoPantalla * (0.95)) * (0.4),borderRadius:13,flexDirection:"row",justifyContent:"space-around",alignItems:"center",alignSelf: 'center',margin: 15}}>
					<Text style={{textAlign:"center",fontSize:15,color:"#fff",marginLeft:10,fontFamily: "Viga-Regular"}}>Guardar</Text>
				</TouchableOpacity>

        <View style={{height:30, width:AnchoPantalla,backgroundColor:null}}/>
			

        </>
	);

}





  const ItemContactoSeleccionable = (props) => {
    const {Id,Nombre,Avatar,Especialidad} =  props;
    return(

                  <TouchableOpacity  onPress={props.Accion} style={{width:AnchoPantalla * (0.9),alignSelf:"center",justifyContent:"center",alignItems:"center",flexDirection:"row", backgroundColor: props.Selected ? "#d63031": "#fff",flexWrap: 'nowrap',padding: 8,borderRadius: 8}}>
                      <View style={{width:(AnchoPantalla * (0.9)) * (0.20),flexWrap: 'nowrap',alignItems: 'center',justifyContent: 'center'}}>
                        <IconoDeAvatar rounded title={"AG"} source={{uri: Avatar}} size={"medium"}/>
                      </View>
                        <View style={{width: (AnchoPantalla * (0.9)) * (0.70),justifyContent: 'center',alignItems: 'center',alignSelf: 'center'}}>
                          <Text style={{color:props.Selected ? "#dff9fb": "#1e90ff"}}>Nombre: <Text style={{color:props.Selected ? "black": "#ffa502"}}>{Nombre.Nombres + " " +Nombre.ApellidoPaterno + " " + Nombre.ApellidoMaterno}</Text></Text>
                          <View>
                            <Text style={{color:props.Selected ? "#dff9fb": "#ff4757"}}>Especialidad:<Text style={{color:props.Selected ? "black": "#5352ed"}}>{Especialidad}</Text></Text>
                          </View>

                        </View>
                  </TouchableOpacity>


      )
  }




  const  IntegrantesListaELiminar = (props) => {

      const datosDeCredencial = useSelector(store => store.datosDeCredencial);
      const [Coloreado,setColoreado]  = useState(null);
      const [ContactosParaSalon, modificarContactosParaSalon] = useState(null);

        const [Salon, setSalon] = useState({
          Descripcion: null,
          src: null,
          Seleccionados: []
        });

        useEffect(()=>{
          traerLosAlumnosCorrectosParaIniciarUnSalon();
        },[])

      	const traerLosAlumnosCorrectosParaIniciarUnSalon = async () => {
      		let datos = new FormData();
          let objetoAux = {
            matriculaUsuario:datosDeCredencial.matricula,
            idSalon: props.idSalon
          }
      		datos.append('indice', JSON.stringify(objetoAux));



      		let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/mensajes/detallesDeConversacion/traerLosAlumnosIntegrantesDeUnSalonParaExcluirlos.php',{
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

            ToastAndroid.show('Rayos hubo un error.' , ToastAndroid.SHORT);
            console.log("linea 958 error: ",error);
      		});

      	}

        const enviarLosAlumnosCorrectosParaEliminarAlumnosDeUnSalon = async () => {
          let datos = new FormData();
          let objetoAux = {
            idSalon: props.idSalon,
            seleccionados:Salon.Seleccionados,
            idMaestro: datosDeCredencial.matricula
          }
          //console.log("este es el objeto para agregar => ",objetoAux)

          datos.append('indice', JSON.stringify(objetoAux));

          let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/mensajes/detallesDeConversacion/excluirAlumnosDelSalon.php',{
            method: 'POST',
            body: datos
          })
          .then((mensaje) => mensaje.text())
          .then((respuesta) => {

          //	let arreglo = JSON.parse(respuesta);
            console.log("respuesta de traer integrantes para ELIMINAR => ",respuesta)
            if(respuesta==="true"){

              ToastAndroid.show('YA no eres parte del Salón.' , ToastAndroid.SHORT);
              props.cerrarModalPrincipal();
                //traerLosAlumnosCorrectosParaIniciarUnSalon();
            }else if(respuesta==="false"){

              ToastAndroid.show('Exito al borrar alumnos.' , ToastAndroid.SHORT);
              traerLosAlumnosCorrectosParaIniciarUnSalon();
            }else{
              ToastAndroid.show('Rayos hubo un error.' , ToastAndroid.SHORT);
              console.log("linea 994 error: ",respuesta);
            }


          })
          .catch((error) => {
            console.log("Error al enviar informacion => ",error);
          });

        }

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
      console.log("show me xd: ",txt);
    }

      return(

      <>



      
  			<View style={{backgroundColor:null,width:AnchoPantalla * (0.7),justifyContent:"space-around",alignItems:"center",alignSelf:"center",flexDirection:"row"}}>
  				<Icon name='users' type="font-awesome" color='#f6e58d' size={30}/>
  				<Text style={{textAlign:"center",fontSize:15,color:"#ecf0f1",marginLeft:10,fontFamily: "Viga-Regular"}}>Expulsar Integrantes</Text>
  			</View>



  			<>


  				{(ContactosParaSalon === null)?
  					<>
  						<ActivityIndicator size={'large'} color={'black'}/>
  					</>
  				:
  					<FlatList
  						data={ContactosParaSalon}
  						keyExtractor={(item) => item.Id}
  						initialNumToRender={5}
  						ListHeaderComponent={()=>(<View style={{width:"100%",height:25}}/>)}
  						ItemSeparatorComponent={()=>(<View style={{width:"100%",height:15}}/>)}
  						ListFooterComponent={()=>(<View style={{width:"100%",height:25}}/>)}
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


  			</>


  				<TouchableOpacity onPress={()=>{
            //Showme(Salon.Seleccionados)
            if(Salon.Seleccionados.length > 0){
            enviarLosAlumnosCorrectosParaEliminarAlumnosDeUnSalon();
            console.log("alumnos seleccionados para ser eliminar",Salon.Seleccionados)

          }else{
            ToastAndroid.show('Tienes que seleccionar un alumno de la lista' , ToastAndroid.SHORT);
          }

  				}} style={{backgroundColor:"#1289A7",padding:13,width: (AnchoPantalla * (0.95)) * (0.4),borderRadius:13,flexDirection:"row",justifyContent:"space-around",alignItems:"center",alignSelf: 'center',margin: 15}}>
  					<Text style={{textAlign:"center",fontSize:15,color:"#fff",marginLeft:10,fontFamily: "Viga-Regular"}}>Guardar</Text>
  				</TouchableOpacity>
  			
          <View style={{height:30, width:AnchoPantalla,backgroundColor:null}}/>
          </>
  	);

  }



///////////////////////////////////////////////////////////////////////////////////////
/////////////////lista para visualizar no para editar


  const  IntegrantesListaVisualizar = (props) => {

      const datosDeCredencial = useSelector(store => store.datosDeCredencial);
      const [Coloreado,setColoreado]  = useState(null);
      const [ContactosParaSalon, modificarContactosParaSalon] = useState(null);

        const [Salon, setSalon] = useState({
          Descripcion: null,
          src: null,
          Seleccionados: []
        });

        useEffect(()=>{
          traerLosAlumnosCorrectosParaIniciarUnSalon();
        },[])

      	const traerLosAlumnosCorrectosParaIniciarUnSalon = async () => {
      		let datos = new FormData();
          let objetoAux = {
            matriculaUsuario:datosDeCredencial.matricula,
            idSalon: props.idSalon
          }
      		datos.append('indice', JSON.stringify(objetoAux));



      		let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/mensajes/detallesDeConversacion/traerLosAlumnosIntegrantesDeUnSalonParaExcluirlos.php',{
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
      			ToastAndroid.show('Rayos hubo un error.' , ToastAndroid.SHORT);
            console.log("linea 1167 error: ",error);
      		});

      	}

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
      console.log("show me xd X2: ",txt);
    }

      return(

      <>

  			<View style={{backgroundColor:null,width:AnchoPantalla * (0.7),justifyContent:"space-around",alignItems:"center",alignSelf:"center",flexDirection:"row"}}>
  				<Icon name='users' type="font-awesome" color='#f6e58d' size={30}/>
  				<Text style={{textAlign:"center",fontSize:15,color:"#ecf0f1",marginLeft:10,fontFamily: "Viga-Regular"}}>Los Integrantes del Salón</Text>
  			</View>



        <>

  				{(ContactosParaSalon === null)?
  					<>
  						<ActivityIndicator size={'large'} color={'black'}/>
  					</>
  				:
  					<FlatList
  						data={ContactosParaSalon}
  						keyExtractor={(item) => item.Id}
  						initialNumToRender={5}
  						ListHeaderComponent={()=>(<View style={{width:"100%",height:25}}/>)}
  						ItemSeparatorComponent={()=>(<View style={{width:"100%",height:15}}/>)}
  						ListFooterComponent={()=>(<View style={{width:"100%",height:25}}/>)}
  						renderItem={
  							({item,index})=>(
  								<ItemContactoSeleccionable
  									Id={item.Id}
  									Nombre={item.Nombre}
  									Avatar={item.Avatar}
  									Especialidad={item.Especialidad}
  									Accion={
  										()=>null
  									}
  									Selected={Coloreado[index]}
  								/>
  							)
  						}
  					/>
  				}

</>

<View style={{height:30, width:AnchoPantalla,backgroundColor:null}}/>

          </>
  	);

  }
//xd j