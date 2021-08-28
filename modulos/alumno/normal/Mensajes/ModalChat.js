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
  ToastAndroid
} from 'react-native';


const AltoPantalla = Dimensions.get("window").height;
const AnchoPantalla = Dimensions.get("window").width;


import { Icon,CheckBox } from 'react-native-elements';
import { ListItem } from 'react-native-elements';
import { Slider } from 'react-native-elements';

import { Button,SearchBar,ButtonGroup, Avatar as IconoDeAvatar } from 'react-native-elements';
import {Fecha} from "./../../../global/codigosJS/Metodos.js";


const ModalChat = (props) =>{




  const [MSJ, setMSJ] = useState(null);
  //const [VariableVerMasOMenos, setVariableVerMasOMenos] = useState(1);
  const VariableVerMasOMenos = useRef(0)
  //const Usuario="17419070110074";
  //Id : '17419070110040_17419070110074';
  //Id : '17419070110040_17419070110031';
  const [Chat, setChat] = useState(
    {


    Mensajes:props.mensajesPreCargados,
Detalles:{
	CondicionalDeRegistros: 0,
	VisualizarBotonVerMasRecientes: false,
      IdDeConversacion:(props.data[1]).Id, //'17419070110074_17419070110040'
 CantidadDeMensajes : (props.mensajesPreCargados).length,
      ConversacionEntre:/*props.data*/
      [
      /*{
          Id:"17419070110074",
          Avatar:"https://images.unsplash.com/photo-1542044896530-05d85be9b11a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60 ",
          Nombre:{
            Nombres:"Angel Gabriel",
            ApellidoPaterno:"Hernandez",
            ApellidoMaterno:"Hernandez"
          }
      }*/
 props.data[0]
 ,
      {
//AQUI TENDRIA QUE IR TODO LO DE props.data[1] PERO HAY ALGUNOS FALLOS

//TODO LO RELACIONADO CON DESTINATARIO

        Id: ( ((props.data[1]).Id).split('_') )[1],


        Avatar:(props.data[1]).Avatar,
        Nombre:{
            Nombres:(props.data[1]).Nombre.Nombres,
            ApellidoPaterno:(props.data[1]).Nombre.ApellidoPaterno,
            ApellidoMaterno:(props.data[1]).Nombre.ApellidoMaterno
          }
      }
      ]
    },
/*[
      {
        Orden:"1",
        Id:"17419070110074",
        NombreCompleto:{
          Nombres:"Angel Gabriel",
          ApellidoPaterno:"Hernandez",
          ApellidoMaterno:"Hernandez"
        },
        //Avatar:"https://images.unsplash.com/photo-1542044896530-05d85be9b11a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60 ",
        Fecha:"12/09/02",
        Mensaje:"Hola soy Angel"
      },
      {
        Orden:"2",
        Id:"1741907091",
        NombreCompleto:{
          Nombres:"Alonso",
          ApellidoPaterno:"Hernandez",
          ApellidoMaterno:"Hernandez"
        },
        //Avatar:"https://images.unsplash.com/photo-1542044896530-05d85be9b11a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60 ",
        Fecha:"12/09/02",
        Mensaje:"Hola soy Alonso"
      },
      {
        Orden:"3",
        Id:"17419073",
        NombreCompleto:{
          Nombres:"Angel",
          ApellidoPaterno:"Lopez",
          ApellidoMaterno:"Lopez"
        },
        //Avatar:"https://images.unsplash.com/photo-1542044896530-05d85be9b11a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60 ",
        Fecha:"12/09/02",
        Mensaje:"Hola soy Lopez"
      }

]*/
})

  const Remitente = Chat.Detalles.ConversacionEntre[0];//Usuario===Chat.Detalles.ConversacionEntre[0].Id ? Chat.Detalles.ConversacionEntre[0] : Chat.Detalles.ConversacionEntre[1]
  const Destinatario = Chat.Detalles.ConversacionEntre[1];//Usuario===Chat.Detalles.ConversacionEntre[0].Id ? Chat.Detalles.ConversacionEntre[1] : Chat.Detalles.ConversacionEntre[0]

/*
Remitente SOY YO
Destinatario ES EL(LA) OTR@
*/

const idDelTimer = useRef(null);


	const eventosEspecificos = {
		traerMensajesDeUnaConversacionDeTipoChat : async () => {

			let objetoConTodaLaInformacion = {
				idDeConversacion : Chat.Detalles.IdDeConversacion,
				alumnoProtagonista : Remitente,
				destinatario : Destinatario,
				variableVerMasOMenos: VariableVerMasOMenos.current
			}

      console.log("Visualiar VariableVerMasOMenos => ", VariableVerMasOMenos.current);

			let json = JSON.stringify(objetoConTodaLaInformacion);
			let datos = new FormData();
			datos.append('indice', json);



			let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/mensajes/traerMensajesDeUnaConversacion/traerMensajesDeUnaConversacionDeTipoChat.php', {
				method: 'POST',
				body: datos
			})
			.then((resultado) => resultado.text())
			.then((respuesta) => {

				let objeto = JSON.parse(respuesta);

				setChat({...Chat, Mensajes: objeto.arregloConObjetosDeMensajeDeTipoChat, Detalles: {...Chat.Detalles, CondicionalDeRegistros: objeto.condicionalDeRegistros, VisualizarBotonVerMasRecientes: objeto.visualizarBotonVerMasRecientes}});
				//setChat({...Chat, Mensajes: objeto.arregloConObjetosDeMensajeDeTipoChat});

				//console.log('PASAMOS POR EL METODO');



			})
			.catch((error) => {
        ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
        console.log("linea 174 : ",error);
			});


		},

		insertarMensajeEnConversacionDeTipoChat : async (mensaje, tipoDeMensaje) => {
			//$IdDeConversacion, $MatriculaDeRemitente, $MatriculaDeDestinatario, $Contenido, $Tipo, $FechaDeSubida

			let fechaActual = Fecha();

			let objetoConInformacion = {
				idDeConversacion : Chat.Detalles.IdDeConversacion,
				matriculaDeRemitente : Remitente.Id,
				matriculaDeDestinatario : Destinatario.Id,
				contenido : mensaje,
				tipo : tipoDeMensaje,
				fechaDeSubida : fechaActual
			}



			let json = JSON.stringify(objetoConInformacion);
			let datos = new FormData();
			datos.append('indice', json);

			let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/mensajes/insertarMensajeEnConversacion/insertarMensajeEnConversacionDeTipoChat.php', {
				method: 'POST',
				body: datos
			})
			.then((mensaje) => mensaje.text())
			.then((respuesta) => {
				//console.log(respuesta);
				eventosEspecificos.insertarNotificacionDeConversacionDeTipoChat();
			})
			.catch((error) => {
				ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
        console.log("linea 210 : ",error);
			});
		},

		insertarNotificacionDeConversacionDeTipoChat: async () => {

			let objetoConInformacion = {
				matriculaDeRemitente : Remitente.Id,
				matriculaDeDestinatario : Destinatario.Id
			};

			let json = JSON.stringify(objetoConInformacion);
			let datos = new FormData();
			datos.append('indice', json);

			let promesa = await fetch("http://backpack.sytes.net/servidorApp/php/mensajes/insertarNotificacion/insertarNotificacionDeConversacionDeTipoChat.php", {
				method: 'POST',
				body: datos
			})
			.then((mensaje) => mensaje.text())
			.then((respuesta) => {
        //console.log("respuesta => ",respuesta)
				if(respuesta === "Error"){
					ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
          console.log("linea 234 : ",respuesta);
				}
			})
			.catch((error) => {
				ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
        console.log("linea 239 : ",error);
			});
		}
	};

  useEffect(()=>{

//EL COMPONENTE SE MONTO

idDelTimer.current = setInterval(() => {
eventosEspecificos.traerMensajesDeUnaConversacionDeTipoChat();
}, 1000);



return (() => {
//EL COMPONENTE SE DESMONTARA
clearInterval(idDelTimer.current);
});
  }, []);


  return(
    


        <View style={{flex:1,backgroundColor:"#dfe4ea"}}>




            <View  onPress={null} style={{width:AnchoPantalla,alignSelf:"center",justifyContent:"center",alignItems:"center",flexDirection:"row", backgroundColor: "#111",padding: 3}}>
                <View style={{width: AnchoPantalla * (0.20),flexWrap: 'nowrap',alignItems: 'center',justifyContent: 'center',overflow:"hidden"}}>
                  <IconoDeAvatar rounded title={"AG"} source={{uri: Destinatario.Avatar}} size={"medium"}/>
                </View>

                  <View style={{flexDirection:"row",justifyContent:"space-around",width:AnchoPantalla * (0.70),alignContent:"center",alignItems:"center",alignSelf:"center"}}>
                    <Text style={{color:"#fff",textAlign:"center",fontSize:14,fontFamily: "Viga-Regular",width: (AnchoPantalla * (0.70)) * (0.8) }}>
                    {
                      Destinatario.Nombre.Nombres 
                      //+ " " 
                      //+ Destinatario.Nombre.ApellidoPaterno 
                      //+ " " 
                      //+Destinatario.Nombre.ApellidoMaterno
                      }
                    </Text>
                    <Icon name={"close"} type={"font-awesome"} size={29} color={"#dcdde1"} onPress={props.CerrarModal} containerStyle={{width: (AnchoPantalla * (0.70)) * (0.2)}}/>
                  </View>

            </View>











                <FlatList
                  data={Chat.Mensajes}
                  keyExtractor={(item)=>item.Orden}
                  ListHeaderComponent={()=>(
      <>{(Chat.Detalles.CondicionalDeRegistros <= 0) ?
				<View style={{width:"100%",height:15}}/>
			:
        <TouchableOpacity onPress={()=>{VariableVerMasOMenos.current=VariableVerMasOMenos.current + 1}} style={{width: Dimensions.get("window").width, height: (Dimensions.get("window").height) * (0.05), padding: 2,color:"#fff",backgroundColor: "#26de81",marginBottom: 15}}>
        <Text style={{textAlign:"center",color:"#111",fontSize:17,fontFamily: "Viga-Regular"}}> Ver Anteriores </Text>
        </TouchableOpacity>
			}</>

                  )}
            	ListFooterComponent={()=>(
      <>{(Chat.Detalles.VisualizarBotonVerMasRecientes) ?
        <TouchableOpacity onPress={()=>{VariableVerMasOMenos.current=VariableVerMasOMenos.current - 1}} style={{width: Dimensions.get("window").width, height: (Dimensions.get("window").height) * (0.05), padding: 2,color:"#fff",backgroundColor: "#26de81",marginTop: 15}}>
        <Text style={{textAlign:"center",color:"#111",fontSize:17,fontFamily: "Viga-Regular"}}> Ver Más Recientes </Text>
		     </TouchableOpacity>
			:
      <View style={{width:"100%",height:15}}/>
			}</>
            	)}

                  ItemSeparatorComponent={()=>(<View style={{width:"100%",height:15}}/>)}

                  ListEmptyComponent={
                    ()=>(
                      <View style={{width:AnchoPantalla * (0.8),padding:10,justifyContent:"center",alignSelf:"center",alignItems:"center",backgroundColor:"#111",borderRadius:10}}>
                        <Text style={{textAlign:"center",color:"#fff",fontSize:17,fontFamily: "Viga-Regular"}}> Rompe el hielo. </Text>
                      </View>
                      )
                  }
                  renderItem={
                  ({item})=>{
                  return(
                      <View style={{width:AnchoPantalla * (0.65),padding:8,marginLeft:5,marginRight:5,backgroundColor:item.Id===Remitente.Id ? "#ff9f43" : "#2e86de" ,alignSelf: item.Id===Remitente.Id ? "flex-end" : "flex-start" ,justifyContent:"center",alignItems:"center",alignContent:"center",borderRadius:10}}>

                        <Text style={{color:"#fff",fontFamily: "Viga-Regular",textAlign:item.Id===Remitente.Id ? "right" : "left",fontSize:16,width:"100%"}}>{item.Mensaje}</Text>
                        <Text style={{color:"#222f3e",fontFamily: "Viga-Regular",textAlign:item.Id===Remitente.Id ? "right" : "left",fontSize:13,width:"100%"}}>{item.Fecha}</Text>
                          
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
                   //placeholder={"Escribe tu mensaje..."}
                   //placeholderTextColor={"#fff"}
                   autoFocus={true}
                   onChangeText={(Val)=>setMSJ(Val)}

                  />

                  <Icon name='send' type="material-community" color='#ff4757' size={28} containerStyle={{width:AnchoPantalla * (0.20),backgroundColor:null}}
                   onPress={/*()=>{

                    setChat({...Chat,Mensajes:[...Chat.Mensajes,
                  {
 //Un nuevo objeto de MensajeDeTipoChat
                    Orden:"3",
                    Id:"17419070110074",
                    NombreCompleto:{
                      Nombres:"Angel",
                      ApellidoPaterno:"Lopez",
                      ApellidoMaterno:"Lopez"
                    },
                    Avatar:"https://images.unsplash.com/photo-1542044896530-05d85be9b11a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60 ",
                    Fecha:Fecha(),
                    Mensaje:MSJ
                  }

                            ]});
setMSJ(null);
                  }
 */
 () => {
//MSJ CONTIENE EL MENSAJE A ENVIAR
//Nosotros le pondremos tipo = 'texto' por defecto


if(MSJ === null || MSJ === ""){

ToastAndroid.show('No puedes enviar mensajes vacíos' , ToastAndroid.SHORT);
}
else{
eventosEspecificos.insertarMensajeEnConversacionDeTipoChat(MSJ, 'texto');
setMSJ(null);
}

 }
 }/>
          </View>
        </View>


    
    )
}

export default ModalChat;
