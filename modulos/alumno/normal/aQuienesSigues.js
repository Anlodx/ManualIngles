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



const ModalSiguiendo = (props) =>{
  const [usuario, setUsuario] = useState(props.matricula);
  const [ModalSiguiendoVisible, setModalSiguiendoVisible] = useState(true);
  const [server, setServer] = useState("backpack.sytes.net");
  const [data, setData] = useState([]);



  function borrarRegistroAQuienesSiguesAlert(matricula,nombre){
        Alert.alert(
          'Pregunta:',
          "¿Quieres dejar de seguir a ?"+nombre,
          [
            {
              text: 'No',
              onPress: () => null,
            },
            {
              text: 'Claro !!!',
               onPress: () => borrarRegistroAQuienesSigues(matricula),
            }
          ],
          { cancelable: false }
        )
      }
  function borrarRegistroAQuienesSigues(arg){

      fetch('http://'+server+'/servidorApp/php/Seguidores/BorraRegistroAQuienesSigo.php',{
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
           traerAQuienesSigues();
         })
         .catch((error)=>{
         console.error(error);
         });

  }
  function traerAQuienesSigues(){

      fetch('http://'+server+'/servidorApp/php/Seguidores/TraerAQuienesSigo.php',{
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

  return(
    <View>

      <Modal  onShow={()=>{
        console.log("a quienes sigues");
        traerAQuienesSigues();
      }} visible={ModalSiguiendoVisible} onRequestClose={props.cerrarModal} animationType="slide" transparent={false}>
        <View style={{flex:1}}>

            <View style={{width:"100%",height:50,justifyContent:"space-around",alignItems:"center",alignSelf:"center",paddingTop:5,paddingBottom:5,flexDirection:"row"}}>
              <Text style={{textAlign:"center",color:"#3498db",fontSize:18,margin:3}}>Para seguir a alguien Buscalo y da click en el boton + para recibir sus conocimientos.</Text>
            </View>
            <View style={{width:"100%",height:50,backgroundColor:"#fff",justifyContent:"space-around",alignItems:"center",alignSelf:"center",paddingTop:5,paddingBottom:5,flexDirection:"row"}}>
              <Text style={{textAlign:"center",color:"#130f40",fontSize:20}}>Estas Siguiendo a :</Text>
              <Icon name={"close"} type={"font-awesome"} size={25} color={"#130f40"} onPress={props.cerrarModal} containerStyle={{padding:8}}/>
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
                      <View style={{flex:1,justifyContent:"center",alignSelf:"center",alignItems:"center",backgroundColor:"#f9ca24",padding:8,borderRadius:15}}>
                        <Text style={{textAlign:"center",color:"#686de0",fontSize:20}}>Nadie Aun...</Text>
                      </View>
                      )
                  }
                  renderItem={
                  ({item})=>{
                  return(
                      <View style={{width:"98%",alignSelf:"center",justifyContent:"center",alignItems:"center",flexDirection:"column",alignContent:"center"}}>

                                <View style={{width:"100%",alignSelf:"center",justifyContent:"center",alignItems:"center",flexDirection:"row", backgroundColor: "#fff",flexWrap: 'nowrap',padding: 10}}>
                                    <View style={{width: "25%",flexWrap: 'nowrap',alignItems: 'center',justifyContent: 'center'}}>
                                      <IconoDeAvatar rounded title={"AG"} source={{uri: item.rutaFoto}} size={"medium"}/>
                                    </View>
                                      <View style={{width: "75%",flexDirection: 'column',flexWrap: 'wrap',justifyContent: 'center',alignItems: 'center',alignSelf: 'center',flexDirection: 'row'}}>
                                        <View  style={{margin:8,flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
                                            <View style={{flexDirection:"column",justifyContent:"space-around",alignItems:"center",width:"100%"}}>
                                              <Text style={{color:"#2980b9",textAlign:"center",fontSize:18}}>{item.nombres + " " +item.apellido_paterno + " " + item.apellido_materno}</Text>
                                              <Text style={{color:"#111",textAlign:"center",fontSize:17}}>Recibiendo Contenido.</Text>
                                            </View>
                                            <Icon name={"heart-broken"} type={"material-community"} size={30} color={"#ff4757"} onPress={()=>borrarRegistroAQuienesSiguesAlert(item.matricula,item.nombres)} containerStyle={{margin:8}}/>
                                        </View>
                                      </View>
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

export default ModalSiguiendo;

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

const ModalSiguiendo = (props) =>{
  const [usuario, setUsuario] = useState(props.matricula);
  const [ModalSiguiendoVisible, setModalSiguiendoVisible] = useState(true);
  const [server, setServer] = useState("backpack.sytes.net");
  const [data, setData] = useState([]);
  const [modalCargando ,setModalCargando] = useState(true);



  function borrarRegistroAQuienesSiguesAlert(matricula,nombre){
        Alert.alert(
          'Pregunta:',
          "¿Quieres dejar de seguir a "+nombre+"? ",
          [
            {
              text: 'No',
              onPress: () => null,
            },
            {
              text: 'Claro !!!',
               onPress: () => borrarRegistroAQuienesSigues(matricula),
            }
          ],
          { cancelable: false }
        )
      }
  function borrarRegistroAQuienesSigues(arg){

      fetch('http://'+server+'/servidorApp/php/Seguidores/BorraRegistroAQuienesSigo.php',{
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
           traerAQuienesSigues();
           ToastAndroid.show('Lo has dejado de seguir' , ToastAndroid.SHORT);
         })
         .catch((error)=>{
         console.error(error);
         ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
         });

  }
  function traerAQuienesSigues(){

      fetch('http://'+server+'/servidorApp/php/Seguidores/TraerAQuienesSigo.php',{
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

  return(
    <View style={{width:AnchoPantalla , height: AltoPantalla, backgroundColor: "#fff"}}>

      <Modal  onShow={()=>{
        console.log("a quienes sigues");
        traerAQuienesSigues();
      }} visible={ModalSiguiendoVisible} onRequestClose={props.cerrarModal} animationType="slide" transparent={false}>
        <View style={{width:AnchoPantalla , height: AltoPantalla, backgroundColor: "#95afc0"}}>



              <View style={{width:AnchoPantalla ,padding:15,backgroundColor:"#130f40",justifyContent:"center",alignItems:"center",alignSelf:"center"}}>
                <Text style={{textAlign:"center",fontFamily: "Viga-Regular",color:"#3498db",fontSize:18,margin:3}}>Para seguir a alguien Buscalo y da click en el botón + para recibir sus conocimientos.</Text>
              </View>
              <View style={{width:AnchoPantalla ,padding:15,backgroundColor:"#130f40",justifyContent:"center",alignItems:"center",alignSelf:"center",flexDirection:"row"}}>
                <Icon name={"close"} type={"font-awesome"} size={25} color={"#3498db"} onPress={props.cerrarModal} containerStyle={{margin:3}}/>
                <Text style={{textAlign:"center",fontFamily: "Viga-Regular",color:"#fff",fontSize:18,marginLeft: 3}}>Estás Siguiendo a:</Text>
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
                          <Text style={{textAlign:"center",color:"#fff",fontSize:16,fontFamily: "Viga-Regular"}}>Nadie aun ... No seas timido</Text>
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

                                <View style={{width:AnchoPantalla * (0.9),alignSelf:"center",justifyContent:"center",alignItems:"center", backgroundColor: "#fff",padding: 5,borderRadius: 10}}>
                                    <View style={{width: (AnchoPantalla * (0.9)) * (0.25),alignItems: 'center',justifyContent: 'center'}}>
                                      <IconoDeAvatar rounded title={"AG"} source={{uri: item.rutaFoto}} size={"medium"}/>
                                    </View>
                                      <View style={{width: (AnchoPantalla * (0.9)) * (0.75),justifyContent: 'center',alignItems: 'center',alignSelf: 'center'}}>

                                            <View style={{justifyContent:"space-around",alignItems:"center",width:AnchoPantalla * (0.9)}}>
                                              <Text style={{color:"#2980b9",textAlign:"center",fontSize:18,fontFamily: "Viga-Regular"}}>{item.nombres + " " +item.apellido_paterno + " " + item.apellido_materno}</Text>
                                              <Text style={{color:"#111",textAlign:"center",fontSize:15,fontFamily: "Viga-Regular"}}>Recibiendo Contenido.</Text>
                                            </View>
                                            <Icon name={"heart-broken"} type={"material-community"} size={30} color={"#ff4757"} onPress={()=>borrarRegistroAQuienesSiguesAlert(item.matricula,item.nombres)}/>

                                      </View>
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

export default ModalSiguiendo;
