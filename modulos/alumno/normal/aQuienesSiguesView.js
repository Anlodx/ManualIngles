import React,{Component,useState,useEffect} from 'react';
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

  const [server, setServer] = useState("backpack.sytes.net");
  const [data, setData] = useState([]);
  const [modalCargando ,setModalCargando] = useState(true);




  function borrarRegistroAQuienesSiguesAlert(matricula,nombre){
        Alert.alert(
          'Pregunta:',
          "¿Quieres dejar de seguir a "+nombre+"?",
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

  useEffect(()=>{
    console.log("a quienes sigues desde el View");
    traerAQuienesSigues();
  },[])


  return(
        <View style={{width: AnchoPantalla,backgroundColor:"rgba(218, 218, 218, 0.91)"}}>




            <View style={{width:AnchoPantalla,backgroundColor:"#fff"}}>
              <Text style={{textAlign:"center",color:"#130f40"}}>Para seguir a alguien Buscalo y da click en el botón + para recibir sus conocimientos.</Text>
            </View>
            <View style={{width:AnchoPantalla,backgroundColor: "#fff"}}>
              <Text style={{textAlign:"center",color:"#3498db",fontSize:15}}>Estás Siguiendo a:</Text>
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


    )
}

export default ModalSiguiendo;
