/*import React,{Component,useState} from 'react';
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
  Alert
} from 'react-native';

import { Icon,CheckBox } from 'react-native-elements';
import { ListItem, Avatar as IconoDeAvatar } from 'react-native-elements';
import { Slider } from 'react-native-elements';

import { Button,SearchBar,ButtonGroup } from 'react-native-elements';



const ModalAmigos = (props) =>{
  const [usuario, setUsuario] = useState(props.matricula);
  const [ModalAmigosVisible, setModalAmigosVisible] = useState(true)

  const [server, setServer] = useState("backpack.sytes.net");
  const [data, setData] = useState([]);



  function crearRegistroAQuienesSiguesAlert(matricula,nombre){
        Alert.alert(
          'Pregunta:',
          "¿Quieres seguir a ?"+nombre,
          [
            {
              text: 'No',
              onPress: () => null,
            },
            {
              text: 'Claro !!!',
               onPress: () => crearRegistroAQuienesSigues(matricula),
            }
          ],
          { cancelable: false }
        )
      }
  function crearRegistroAQuienesSigues(arg){

      fetch('http://'+server+'/servidorApp/php/Seguidores/CrearRegistroAQuienesSigo.php',{
          method:'post',
          header:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body:JSON.stringify({
            matriculaDuenio:usuario,
            matriculaSeguidor:arg
          })

        })
        .then((response) => response.text())
         .then((response)=>{
           console.log(response);
           insertarNotificacionDeSeguidorNuevo(arg);
           traerSeguidores();
         })
         .catch((error)=>{
         console.error(error);
         });

  }
  function traerSeguidores(){

      fetch('http://'+server+'/servidorApp/php/Seguidores/TraerSeguidores.php',{
          method:'post',
          header:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body:JSON.stringify({
            matricula:usuario
          })

        })
        .then((response) => response.json())
         .then((responseJson)=>{
           setData(responseJson)
           console.log(responseJson);
         })
         .catch((error)=>{
         console.error(error);
         });

  }
  function insertarNotificacionDeSeguidorNuevo(arg){

      fetch('http://'+server+'/servidorApp/php/Seguidores/insertarNotificacionDeSeguidorNuevo.php',{
          method:'post',
          header:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body:JSON.stringify({
            matriculaDuenio:usuario,//yo
            matriculaSeguidor:arg//a quien quiero seguir
          })

        })
        .then((response) => response.text())
         .then((response)=>{
           console.log("respuesta desde notifcaciones quienes me siguen => ",response);
         })
         .catch((error)=>{
         console.error(error);
         });

  }

  return(
    <View>

      <Modal onShow={()=>{
        console.log("quienes me siguen")
        traerSeguidores();
      }} visible={ModalAmigosVisible} onRequestClose={props.cerrarModal} animationType="slide" transparent={false}>
        <View style={{flex:1}}>

            <View style={{width:"100%",height:50,backgroundColor:"#fff",justifyContent:"space-around",alignItems:"center",alignSelf:"center",paddingTop:5,paddingBottom:5,flexDirection:"row"}}>
              <Text style={{textAlign:"center",color:"#130f40",fontSize:20}}>Te estan Siguiendo</Text>
              <Icon name={"close"} type={"font-awesome"} size={25} color={"#130f40"} onPress={props.cerrarModal} containerStyle={{padding:8}}/>
            </View>
            <View style={{width:"100%",height:50,justifyContent:"space-around",alignItems:"center",alignSelf:"center",paddingTop:5,paddingBottom:5,flexDirection:"row"}}>
              <Text style={{textAlign:"center",color:"#3498db",fontSize:18}}>Cada vez que subas algo al apartado publico ellos se daran cuenta.</Text>
            </View>

            <View style={{width:"100%",height:"100%",backgroundColor:"#30336b",justifyContent:"center",alignItems:"center",alignSelf:"center",paddingTop:5,paddingBottom:5,alignContent:"center"}}>

                <FlatList
                  data={data}
                  keyExtractor={(item)=>item.matricula}
                  ListHeaderComponent={()=>(<View style={{width:"100%",height:25}}/>)}
                  ItemSeparatorComponent={()=>(<View style={{width:"100%",height:15}}/>)}
                  ListFooterComponent={()=>(<View style={{width:"100%",height:25}}/>)}
                  ListEmptyComponent={
                    ()=>(
                      <View style={{width:"100%",height:100,justifyContent:"center",alignSelf:"center",alignItems:"center",backgroundColor:"#f9ca24",padding:8,borderRadius:15}}>
                        <Text style={{textAlign:"center",color:"#686de0",fontSize:20,margin:3}}>Aun no hay Amigos =)</Text>
                      </View>
                      )
                  }
                  renderItem={
                  ({item})=>{
                  return(
                      <View style={{width:"100%",alignSelf:"center",justifyContent:"center",alignItems:"center",flexDirection:"column",alignContent:"center"}}>


                              <View style={{width:"95%",alignSelf:"center",justifyContent:"center",alignItems:"center",flexDirection:"row", backgroundColor: "#fff",flexWrap: 'nowrap',padding: 10}}>
                                  <View style={{width: "25%",flexWrap: 'nowrap',alignItems: 'center',justifyContent: 'center'}}>
                                    <IconoDeAvatar rounded title={"AG"} source={{uri: item.rutaFoto}} size={"medium"}/>
                                  </View>

                                  <>
                                  {
                                    <View  style={{margin:8,justifyContent:"space-around",flexDirection:"row",alignItems:"center",width: "75%"}}>
                                        <View style={{flexDirection:"column",justifyContent:"space-around",alignItems:"center",width:"100%"}}>
                                          <Text style={{color:"#2980b9",textAlign:"center",fontSize:18}}>{item.nombres + " " +item.apellido_paterno + " " + item.apellido_materno}</Text>
                                          {
                                        (item.Agregado=="FALSE") ?
                                        (<Text style={{color:"#111",textAlign:"center",fontSize:17}}>Te esta Siguiendo</Text>)
                                        :
                                        (<Text style={{color:"#111",textAlign:"center",fontSize:17}}>Te esta Siguiendo Y tu lo sigues</Text>)
                                        }

                                        </View>
                                        {
                                        (item.Agregado=="FALSE") ?
                                        (<Icon name={"plus-box"} type={"material-community"} size={33} color={"#eb3b5a"} onPress={()=>crearRegistroAQuienesSiguesAlert(item.matricula,item.nombres)} containerStyle={{padding:10}}/>)
                                        :
                                        (null)
                                        }
                                    </View>
                                     }
                                  </>

                              </View>
                      </View>
                     )
                   }
                  }
                />

            </View>

        </View>
      </Modal>

    </View>
    )
}

export default ModalAmigos;


*/



import React,{Component,useState} from 'react';
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
  Alert,
  ToastAndroid
} from 'react-native';

import { Icon,CheckBox } from 'react-native-elements';
import { ListItem, Avatar as IconoDeAvatar } from 'react-native-elements';
import { Slider } from 'react-native-elements';

import { Button,SearchBar,ButtonGroup } from 'react-native-elements';

const AnchoPantalla = Dimensions.get("window").width;
const AltoPantalla = Dimensions.get("window").height;

const ModalAmigos = (props) =>{
  const [usuario, setUsuario] = useState(props.matricula);
  const [ModalAmigosVisible, setModalAmigosVisible] = useState(true)

  const [server, setServer] = useState("backpack.sytes.net");
  const [data, setData] = useState([]);
  const [modalCargando ,setModalCargando] = useState(true);




  function crearRegistroAQuienesSiguesAlert(matricula,nombre){
        Alert.alert(
          'Pregunta:',
          "¿Quieres seguir a "+nombre+" ?",
          [
            {
              text: 'No',
              onPress: () => null,
            },
            {
              text: 'Claro!!!',
               onPress: () => crearRegistroAQuienesSigues(matricula),
            }
          ],
          { cancelable: false }
        )
      }
  function crearRegistroAQuienesSigues(arg){

      fetch('http://'+server+'/servidorApp/php/Seguidores/CrearRegistroAQuienesSigo.php',{
          method:'post',
          header:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body:JSON.stringify({
            matriculaDuenio:usuario,
            matriculaSeguidor:arg
          })

        })
        .then((response) => response.text())
         .then((response)=>{
           console.log(response);
           insertarNotificacionDeSeguidorNuevo(arg);
           ToastAndroid.show('Lo has empezado ha seguir' , ToastAndroid.SHORT);
           traerSeguidores();
         })
         .catch((error)=>{
         console.error(error);
         ToastAndroid.show('Rayos hubo un error.' , ToastAndroid.SHORT);
         });

  }
  function traerSeguidores(){

      fetch('http://'+server+'/servidorApp/php/Seguidores/TraerSeguidores.php',{
          method:'post',
          header:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body:JSON.stringify({
            matricula:usuario
          })

        })
        .then((response) => response.json())
         .then((responseJson)=>{
           setData(responseJson)
           setModalCargando(false);
           console.log(responseJson);
         })
         .catch((error)=>{
         console.error(error);
         });

  }
  function insertarNotificacionDeSeguidorNuevo(arg){

      fetch('http://'+server+'/servidorApp/php/Seguidores/insertarNotificacionDeSeguidorNuevo.php',{
          method:'post',
          header:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body:JSON.stringify({
            matriculaDuenio:usuario,//yo
            matriculaSeguidor:arg//a quien quiero seguir
          })

        })
        .then((response) => response.text())
         .then((response)=>{
           console.log("respuesta desde notifcaciones quienes me siguen => ",response);
         })
         .catch((error)=>{
         console.error(error);
         });

  }

  return(
    <View  style={{width:AnchoPantalla , height: AltoPantalla, backgroundColor: "#fff"}}>

      <Modal onShow={()=>{
        console.log("quienes me siguen")
        traerSeguidores();
      }} visible={ModalAmigosVisible} onRequestClose={props.cerrarModal} animationType="slide" transparent={false}>
        <View  style={{width:AnchoPantalla , height: AltoPantalla, backgroundColor: "#95afc0"}}>


            <View style={{width:AnchoPantalla ,padding:15,backgroundColor:"#130f40",justifyContent:"center",alignItems:"center",alignSelf:"center"}}>
              <Text style={{textAlign:"center",fontFamily: "Viga-Regular",color:"#3498db",fontSize:18,margin:3}}>Cada vez que subas algo al apartado público ellos se darán cuenta.</Text>
            </View>
            <View style={{width:AnchoPantalla ,padding:15,backgroundColor:"#130f40",justifyContent:"center",alignItems:"center",alignSelf:"center",flexDirection:"row"}}>
              <Icon name={"close"} type={"font-awesome"} size={25} color={"#3498db"} onPress={props.cerrarModal} containerStyle={{margin:3}}/>
              <Text style={{textAlign:"center",fontFamily: "Viga-Regular",color:"#fff",fontSize:18,marginLeft: 3}}>Te están Siguiendo:  </Text>
            </View>


                <FlatList
                  data={data}
                  keyExtractor={(item)=>item.matricula}
                  ListHeaderComponent={()=>(<View style={{width:"100%",height:25}}/>)}
                  ItemSeparatorComponent={()=>(<View style={{width:"100%",height:15}}/>)}
                  ListFooterComponent={()=>(<View style={{width:"100%",height:25}}/>)}
                  ListEmptyComponent={
                    ()=>(
                      <>
                      {
                        (!modalCargando) ?
                        <View style={{width:AnchoPantalla * (0.8),padding:10,justifyContent:"center",alignSelf:"center",alignItems:"center",backgroundColor:"#111",borderRadius:10}}>
                          <Text style={{textAlign:"center",color:"#fff",fontSize:16,fontFamily: "Viga-Regular"}}>Aún no te han seguido,no te desanimes =)</Text>
                        </View>
                        :
                        <View style={{width:AnchoPantalla * (0.8),padding:10,justifyContent:"center",alignSelf:"center",alignItems:"center",backgroundColor:"#111",borderRadius:10}}>
                          <Text style={{textAlign:"center",color:"#fff",fontSize:15,fontFamily: "Viga-Regular"}}>Cargado...</Text>
                        </View>

                      }
                      </>
                      )
                  }
                  renderItem={
                  ({item})=>{
                  return(
                      <View  style={{width:AnchoPantalla * (0.95),alignSelf:"center",justifyContent:"center",alignItems:"center", backgroundColor: "#fff",padding: 5,borderRadius: 10}}>



                                  <View style={{width: (AnchoPantalla * (0.95)),alignItems: 'center',justifyContent: 'center',backgroundColor: null}}>
                                    <IconoDeAvatar rounded title={"AG"} source={{uri: item.rutaFoto}} size={"large"}/>
                                  </View>

                                  <>
                                  {
                                    <View  style={{justifyContent:"center",alignItems:"center",alignSelf:"center",width: AnchoPantalla * (0.95),backgroundColor: null}}>
                                        <View style={{justifyContent:"center",alignItems:"center",width:AnchoPantalla * (0.95)}}>
                                          <Text style={{color:"#2980b9",textAlign:"center",fontFamily: "Viga-Regular",fontSize:18}}>{item.nombres + " " +item.apellido_paterno + " " + item.apellido_materno}</Text>
                                          {
                                        (item.Agregado=="FALSE") ?
                                        (<Text style={{color:"#111",textAlign:"center",fontSize:15,fontFamily: "Viga-Regular",}}>Te esta Siguiendo</Text>)
                                        :
                                        (<Text style={{color:"#111",textAlign:"center",fontSize:15,fontFamily: "Viga-Regular",}}>Te esta Siguiendo Y tu lo sigues</Text>)
                                        }

                                        </View>
                                        {
                                        (item.Agregado=="FALSE") ?
                                        (<Icon name={"plus-box"} type={"material-community"} size={33} color={"#eb3b5a"} onPress={()=>crearRegistroAQuienesSiguesAlert(item.matricula,item.nombres)}/>)
                                        :
                                        (null)
                                        }
                                    </View>
                                     }
                                  </>


                      </View>
                     )
                   }
                  }
                />



        </View>
      </Modal>

    </View>
    )
}

export default ModalAmigos;
