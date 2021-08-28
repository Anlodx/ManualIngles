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
import { Icon , Badge } from 'react-native-elements';

import CredencialVistaGlobalUsuarioVisitante from "./credencialVistaGlobalUsuarioVisitante.js";
import BarraDeBusquedaPantalla from "./barraBusqueda.js";

import AsyncStorage from '@react-native-async-storage/async-storage';

import {establecerDatosDeCredencialDesdeIniciarSesion} from '../../../store/actions.js';


//Prueba
import {useSelector, useDispatch} from 'react-redux';
//import {cambiarNombres, cambiarApellidoPaterno, cambiarApellidoMaterno} from '../../../store/actions.js';

const header = ({navigation}) => {
	const datosDeCredencial = useSelector(store => store.datosDeCredencial);
	const dispatch = useDispatch();
  useEffect(()=>{
    console.log("header montado")
    return ()=> console.log("header desmontado")
  },[])

     const BadgeNotificaciones = (props) => {
       const [cantidadNotificaciones,setCantidadNotificaciones] = useState("0")
       const timerNotifica = useRef(null);
       useEffect(()=>{
         timerNotifica.current = setInterval(()=>{
           //console.log("traer notificaciones de notificaciones")
           traeCantidadDeNotificaciones();
         },1000);
         return () => clearInterval(timerNotifica.current);
       },[]);

       const traeCantidadDeNotificaciones = () => {
         let datos = new FormData();
         datos.append("indice",datosDeCredencial.matricula)

         fetch('http://backpack.sytes.net/servidorApp/php/datosActualizadosPorIntervalos/retornarCantidadDeNotificacionesPendientes.php',{
             method:'post',
             header:{
               'Accept': 'application/json',
               'Content-type': 'application/json'
             },
             body:datos

           })
           .then((response) => response.text())
            .then((response)=>{
              //this.setState({...this.state,opiniones:responseJson});
            //  console.log("respuesta de cantidad de Notificaciones => ",response)
              setCantidadNotificaciones(response);
            })
            .catch((error)=>{
            console.error(error);
            });
       }
       return(
       <>{
       (cantidadNotificaciones != '0') ?
       ( <Badge badgeStyle={{backgroundColor: "#111",borderWidth: 0}} value={<Text style={{color:"#fff"}}>{cantidadNotificaciones}</Text>}  />)  : (null)
        }</>
      )
     }
     const BadgeMensajes = (props) => {
       const [cantidadNotificacionesMensajes,setCantidadNotificacionesMensajes] = useState("0")
       const timerNotifica = useRef(null);
       useEffect(()=>{
         timerNotifica.current = setInterval(()=>{
           //console.log("traer notificaciones de mensajes")
           traeCantidadDeNotificacionesMensajes();
         },1000);
         return () => clearInterval(timerNotifica.current);
       },[]);

       const traeCantidadDeNotificacionesMensajes = () => {
         let datos = new FormData();
         datos.append("indice",datosDeCredencial.matricula)

         fetch('http://backpack.sytes.net/servidorApp/php/datosActualizadosPorIntervalos/retornarCantidadDeConversacionesPendientes.php',{
             method:'post',
             header:{
               'Accept': 'application/json',
               'Content-type': 'application/json'
             },
             body:datos

           })
           .then((response) => response.text())
            .then((response)=>{
              //this.setState({...this.state,opiniones:responseJson});
            //  console.log("respuesta de cantidad de Notificaciones desde mensaje => ",response)
              setCantidadNotificacionesMensajes(response);
            })
            .catch((error)=>{
            console.error(error);
            });
       }
       return(
       <>{
       (cantidadNotificacionesMensajes != '0') ?
       ( <Badge badgeStyle={{backgroundColor: "#111",borderWidth: 0}} value={<Text style={{color:"#fff"}}>{cantidadNotificacionesMensajes}</Text>}/>)  : (null)
        }</>
      )
     }
      //#522752 o #6D214F
      const ColorFondoPrincipalHeader="#95afc0"

      const ColorStatusBar="#111" //#522779 color original
      const ColorHeader="#fff"
      const ColorIconPadding=ColorHeader

      const AnchoPantalla = Dimensions.get("window").width;
      const AltoPantalla = Dimensions.get("window").height;



      const [modalVisible, setModalVisible] = useState(false);
      const [modalBusquedaVisible, setModalBusquedaVisible] = useState(false);


        const storeData = async (value) => {
          try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('@UserToken:key', jsonValue)
          } catch (e) {
            // saving error
            console.log("lo siento hubo un error al establecer => ",e)
          }
        }
      const cerrarSesion = () => {
        let arregloVacio = [];
        arregloVacio["matricula"] = null;
        arregloVacio["nombres"] = null;
        arregloVacio["apellido_paterno"] = null;
        arregloVacio["apellido_materno"] = null;
        arregloVacio["usuario"] = null;
        arregloVacio["contrasenia"] = null;
        arregloVacio["especialidad"] = null;
        arregloVacio["fecha_de_nacimiento"] = null;
        arregloVacio["genero"] = null;
        arregloVacio["frase"] = null;
        arregloVacio["ruta de foto"] = null;
        arregloVacio["hobbies"] = null;



        dispatch(establecerDatosDeCredencialDesdeIniciarSesion(arregloVacio));
        storeData(arregloVacio);
        console.log("Cerro sesion");
      }

    const eventosEspecificos = {
        establecerNotificacionesDeTipoConversacionAYaLeidas: async () => {
            let objeto = {
                matricula: datosDeCredencial.matricula
            }
            let json = JSON.stringify(objeto);
            let datos = new FormData();
            datos.append("indice", json);

            let promesa = await fetch("http://backpack.sytes.net/servidorApp/php/notificaciones/establecerNotificacionesDeTipoConversacionAYaLeidas.php", {
                method: "POST",
                body: datos
            })
            .then(mensaje => mensaje.text())
            .then(respuesta => {
                if(respuesta !== "Hecho"){
                  //ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
                  console.log("rayos hubo un error: ",respuesta)
                }
            })
            .catch(error => {
              console.log("rayos hubo un error: ",error)
            });
        },
        establecerNotificacionesDeTipoNormalAYaLeidas: async () => {
            let objeto = {
                matricula: datosDeCredencial.matricula
            }
            let json = JSON.stringify(objeto);
            let datos = new FormData();
            datos.append("indice", json);

            let promesa = await fetch("http://backpack.sytes.net/servidorApp/php/notificaciones/establecerNotificacionesDeTipoNormalAYaLeidas.php", {
                method: "POST",
                body: datos
            })
            .then(mensaje => mensaje.text())
            .then(respuesta => {
                if(respuesta !== "Hecho"){
                    console.log("header: Error, ",respuesta);
                }
            })
            .catch(error => {
                console.log("error:header: ",error);
            });
        }
    }

  return(

    <>

    <StatusBar backgroundColor={ColorStatusBar}></StatusBar>

    <View style={{width:AnchoPantalla,height:50,backgroundColor:ColorHeader,flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

        <Icon onPress={()=>setModalVisible(true)} type="font-awesome-5" name="id-card" size={27} color={"#6ab04c"} containerStyle={{width: AnchoPantalla * (0.2),height: "100%",justifyContent: 'center',alignItems: 'center'}}/>

          <TouchableOpacity style={{flexDirection:"row",justifyContent:"center",width: AnchoPantalla * (0.6),alignItems:"center",backgroundColor:"#111",borderRadius:5,paddingTop: 3,paddingBottom: 3}}
            onPress={()=>setModalBusquedaVisible(true)}>
              <Icon type="font-awesome-5" name="search" size={25} color={"#fff"} containerStyle={{backgroundColor: null}}/>
              <Text style={{backgroundColor: null,fontSize:21,color:"white",textAlign:"center",width: (AnchoPantalla * (0.3)) * (0.85)}}>Buscar</Text>
          </TouchableOpacity>

        <Icon onPress={()=>navigation.navigate('Ajustes')}  type="feather" name="settings" size={27} color={"#4834d4"} containerStyle={{width: AnchoPantalla * (0.2),height: "100%",justifyContent: 'center',alignItems: 'center'}}/>

    </View>

    <View style={{width:AnchoPantalla,height:42,flexDirection:"row",justifyContent:"space-around",alignItems:"center",borderBottomColor: "rgba(0,0,0,0.3)",borderBottomWidth: 3,borderBottomLeftRadius:9,borderBottomRightRadius:9}}>

        <TouchableOpacity  onPress={()=>navigation.navigate('Muro')} style={{borderColor:"#291429",backgroundColor:ColorIconPadding,width:AnchoPantalla * (0.25),height:"100%",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
            <Icon  iconStyle={{color:"#FFC312"}} type="entypo" name="globe" />
        </TouchableOpacity>

        <TouchableOpacity  onPress={()=>{
            navigation.navigate('Mensajes');
            eventosEspecificos.establecerNotificacionesDeTipoConversacionAYaLeidas();
        }} style={{borderColor:"#291429",backgroundColor:ColorIconPadding,width:AnchoPantalla * (0.25),height:"100%",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
            <Icon iconStyle={{color:"#ED4C67"}}type="entypo" name="chat"/>
            <BadgeMensajes/>
        </TouchableOpacity>

        <TouchableOpacity  onPress={()=>{
            navigation.navigate('Notificaciones');
            eventosEspecificos.establecerNotificacionesDeTipoNormalAYaLeidas();
        }} style={{borderColor:"#291429",backgroundColor:ColorIconPadding,width:AnchoPantalla * (0.25),height:"100%",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
            <Icon iconStyle={{color:"#12CBC4"}} type="ionicons" name="notifications" />
            <BadgeNotificaciones/>
        </TouchableOpacity>

        <TouchableOpacity  onPress={()=>{navigation.navigate('seguidores')}} style={{borderColor:"#291429",backgroundColor:ColorIconPadding,width:AnchoPantalla * (0.25),height:"100%",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
            <Icon iconStyle={{color:"#EE5A24"}} type="font-awesome-5" name="people-arrows" />
        </TouchableOpacity>






    </View>



       <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={()=>setModalVisible(false)}>
			<View style={{width:AnchoPantalla,height:AltoPantalla,alignSelf:"center",justifyContent: 'center',alignItems: 'center',backgroundColor:"rgba(1,1,1,0.6)"}}>
				<CredencialVistaGlobalUsuarioVisitante Evento={()=>setModalVisible(false)} Cierra={()=>{setModalVisible(false); navigation.navigate("Mochila");}}/>
			</View>
       </Modal>


       <Modal animationType="slide" transparent={true} visible={modalBusquedaVisible} onRequestClose={()=>setModalBusquedaVisible(false)}>
         <View style={{width:"100%",height:"100%",alignSelf:"center",backgroundColor:"#fff"}}>
            <BarraDeBusquedaPantalla Evento={()=>setModalBusquedaVisible(false)} navigation={navigation} cerrarBusqueda={()=>setModalBusquedaVisible(false)}/>
        </View>
       </Modal>
    </>

      );
}


export default header;
