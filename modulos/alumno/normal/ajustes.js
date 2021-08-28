import React,  {useRef,useState, useEffect} from 'react';
import {ActivityIndicator,RefreshControl,TouchableOpacity,TextInput, Image,Text, View, StyleSheet, Alert, SafeAreaView, ScrollView, Picker, StatusBar, Dimensions, FlatList,Modal } from 'react-native';

import {ItemUsuario,ItemHoja,ItemLibro,ItemLibreta,ItemChat} from "./formatos.js";


import { Icon,CheckBox } from 'react-native-elements';

import { ListItem, Avatar as IconoDeAvatar } from 'react-native-elements';
import { Slider } from 'react-native-elements';

import { Button,SearchBar,ButtonGroup } from 'react-native-elements';

import {Fecha,SonSoloEspecios} from "../../global/codigosJS/Metodos.js"

import AsyncStorage from '@react-native-async-storage/async-storage';

import {establecerDatosDeCredencialDesdeIniciarSesion} from '../../../store/actions.js';

import {useSelector, useDispatch} from 'react-redux';



const Ajustes = ({navigation, route}) => {
  const datosDeCredencial = useSelector(store => store.datosDeCredencial);
  const dispatch = useDispatch();

	const [data,setData]=useState([]);


  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('@UserToken:key', jsonValue)
      console.log("cerro sesion y los datos nuevos son =>",jsonValue)
    } catch (e) {
      // saving error
      console.log("lo siento hubo un error al establecer => ",e)
    }
  }

  const cerrarSesion = () => {
    let objetoAux = {

    matricula : null,
    nombres : null,
    apellidoPaterno : null,
    apellidoMaterno : null,
    usuario : null,
    contrasenia : null,
    especialidad : null,
    fechaDeNacimiento : null,
    genero : null,
    frase : null,
    rutaDeFoto : null,
    hobbies : null
    }


    dispatch(establecerDatosDeCredencialDesdeIniciarSesion(objetoAux));
    storeData(objetoAux);
    //console.log("Cerro sesion");
  }



	useEffect(()=>{
		console.log("bienvenido ajustes")
	},[]);

	return (



			<View style={{flex:1,backgroundColor:"#c8d6e5"}}>
        <TouchableOpacity onPress={()=>{
          Alert.alert(
                      'Pregunta:',
                      "¿Esta seguro de cerrar sesión?",
                      [
                        {
                          text: 'No',
                          onPress: () => null,
                        },
                        {
                          text: 'Claro !!!',
                           onPress: () => cerrarSesion(),
                        }
                      ],
                      { cancelable: false }
                    );
        }} style={{backgroundColor: "#5f27cd",width: "40%",alignItems: 'center',justifyContent: 'center',alignSelf: 'center',margin: 5,paddingTop: 10,paddingBottom: 10,borderRadius: 10}}>
          <Text style={{color:"#c8d6e5"}}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

	);
}

export default Ajustes;



/*
 export const ModalComentariosVisualizarHoja = (props) =>{
  const [ModalComentariosVisible, setModalComentariosVisible] = useState(true)
  const [ModalRatingVisible, setModalRatingVisible] = useState(false)
  const [Apartado,setApartado] = useState("Comentario")

  const [ComentarioPrincipal, setComentarioPrincipal] = useState(null)

  const [Calificacion, setCalificacion] = useState(50)


  const [Comentarios, setComentarios] = useState([])
  const [Rating, setRating] = useState([])

  const datosDeCredencial = useSelector(store => store.datosDeCredencial);

  const traerRating = (IdHoja) =>{
    fetch('http://192.168.0.5/servidorApp/php/phpVisualizarHoja/traerRatingHoja.php',{
        method:'post',
        header:{
          'Accept': 'application/json',
          'Content-type': 'application/json'
        },
        body:JSON.stringify({
          IdHoja:IdHoja
        })

      })
      .then((response) => response.text())
       .then((response)=>{

         let datos = JSON.parse(response)
         setRating(datos)
         //console.log("respuesta de Rating => ",datos)
       })
       .catch((error)=>{
       console.error(error);
       });
  }

    const traerComentarios = (IdHoja) =>{
      fetch('http://192.168.0.5/servidorApp/php/phpVisualizarHoja/traerComentariosHoja.php',{
          method:'post',
          header:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body:JSON.stringify({
            IdHoja:IdHoja
          })

        })
        .then((response) => response.text())
         .then((response)=>{

           let datos = JSON.parse(response)
           setComentarios(datos)
           //console.log("respuesta de Comentarios => ",datos)
         })
         .catch((error)=>{
         console.error(error);
         });
    }


        const crearRatingHoja = (IdHoja,MatriculaComento,Calificacion,Fecha) =>{
          fetch('http://192.168.0.5/servidorApp/php/phpVisualizarHoja/crearRatingHoja.php',{
              method:'post',
              header:{
                'Accept': 'application/json',
                'Content-type': 'application/json'
              },
              body:JSON.stringify({
                IdHoja:IdHoja,
                MatriculaComento:MatriculaComento,
                Calificacion:Calificacion,
                Fecha:Fecha
              })

            })
            .then((response) => response.text())
             .then((response)=>{
               //setRating(response)
               //let datos = JSON.parse(response)
               traerRating(IdHoja)
               console.log("respuesta de crear Rating hoja => ",response)
             })
             .catch((error)=>{
             console.error(error);
             });
        }


        const crearComentarioHoja = (IdHoja,MatriculaComento,Comentario,Fecha) =>{
          fetch('http://192.168.0.5/servidorApp/php/phpVisualizarHoja/crearComentarioHoja.php',{
              method:'post',
              header:{
                'Accept': 'application/json',
                'Content-type': 'application/json'
              },
              body:JSON.stringify({
                IdHoja:IdHoja,
                MatriculaComento:MatriculaComento,
                Comentario:Comentario,
                Fecha:Fecha
              })

            })
            .then((response) => response.text())
             .then((response)=>{
               //setRating(response)
               //let datos = JSON.parse(response)
               traerComentarios(IdHoja)
               console.log("respuesta de crear Comentario hoja => ",response)
             })
             .catch((error)=>{
             console.error(error);
             });
        }


  useEffect(()=>{
    traerRating("1234");
    traerComentarios("1234");
    //crearRatingHoja("1234","17419070110074",100,Fecha());
    //crearComentarioHoja("1234","17419070110074","HOLA YO SOY ANGEL",Fecha());
  },[])


  function DevuelveRating(arg){

      if(arg >= 90){
      return(
        <View>
        <Icon name='heart-multiple' type="material-community" color='#f53b57' size={30} containerStyle={{padding:10,marginLeft:10,marginRight:10}}/>
        <Text style={{color:"#2ecc71",textAlign:"center"}}>Exelente!!!</Text>
        </View>
        )
      }
      else if(arg>=80){
      return(
        <View>
       <Icon name='heart' type="material-community" color='#f53b57' size={30} containerStyle={{padding:10,marginLeft:10,marginRight:10}}/>
       <Text style={{color:"#3498db",textAlign:"center"}}>Bueno!</Text>
       </View>
       )
      }
      else if(arg<80 && arg>50){
      return(
        <View>
       <Icon name='heart-pulse' type="material-community" color='#f53b57' size={30} containerStyle={{padding:10,marginLeft:10,marginRight:10}}/>
       <Text style={{color:"#f1c40f",textAlign:"center"}}>Puede mejorar</Text>
       </View>
       )
      }
      else if(arg==50){
      return(
        <View>
       <Icon name='heart-half-full' type="material-community" color='#f53b57' size={30} containerStyle={{padding:10,marginLeft:10,marginRight:10}}/>
       <Text style={{color:"#ef5777",textAlign:"center"}}>Le falta...</Text>
       </View>
       )
      }
      else{
      return(
        <View>
        <Icon name='heart-broken' type="material-community" color='#f53b57' size={30} containerStyle={{padding:10,marginLeft:10,marginRight:10}}/>
        <Text style={{color:"red",textAlign:"center"}}>Deja dudas</Text>
        </View>
        )
      }
  }

  function DevuelveApartado(arg){
      switch(arg){
        case "Rating":
          return(

            <View style={{width: Dimensions.get("window").width , height: (Dimensions.get("window").height) * (0.25)}}>
              <View style={{alignSelf:"center",flexDirection:"row",alignItems:"center",backgroundColor:"red"}}>
                <Text style={{color:"#fff",textAlign:"center",fontSize:17,width: Dimensions.get("window").width * (0.9)}}>¿Del 0 a 100 que tanto te gusto el contenido?</Text>
                <Icon name='send' type="material-community" color='blue' size={25} containerStyle={{padding:10,marginLeft:10,marginRight:10}}
                 onPress={()=>{
                   //alert(Calificacion)
                   crearRatingHoja("1234",datosDeCredencial.matricula,Calificacion,Fecha())
                 }}/>
              </View>

              <View style={{alignSelf:"center",flexDirection:"row",justifyContent:"space-around",alignItems:"center",width:"100%",backgroundColor:"#111"}}>

                    <Icon name='heart-broken' type="material-community" color='#f53b57' size={25} containerStyle={{padding:10,marginLeft:10,marginRight:10}}/>

                  <Slider
                    value={Calificacion}
                    onValueChange={(value) => setCalificacion(value)}
                    step={1}
                    maximumValue={100}
                    minimumValue={0}
                    thumbTintColor={"#fff"}
                    //thumbTouchSize={{width: 25, height: 25}}
                    maximumTrackTintColor={"#fff"}
                    minimumTrackTintColor={"#f53b57"}
                    style={{backgroundColor:"#111",flex:2/3}}
                  />
                    <Text style={{color:"#fff",textAlign:"center",fontSize:17}}>{Calificacion}</Text>
                    <Icon name='heart' type="material-community" color='#f53b57' size={25} containerStyle={{padding:10,marginLeft:10,marginRight:10}}/>

              </View>
            </View>

            );break;

        case "Comentario":
          return(
            <View style={{alignSelf:"center",flexDirection:"row",justifyContent:"space-around",alignItems:"center",width:"100%",backgroundColor:"#fff"}}>
                  <TextInput
                   textAlign={"center"}
                   value={ComentarioPrincipal}
                   style={{borderWidth:1,borderColor:"#777",padding:8,margin:10,width:250,color:"#fff",borderRadius:20,backgroundColor:"#2c2c54",flex:1}}
                   placeholder={"Comenta algo..."}
                   placeholderTextColor={"#fff"}
                   onChangeText={(Val)=>setComentarioPrincipal(Val)}
                   maxLength={210}
                  />
                  <Icon name='send' type="material-community" color='#f53b57' size={25} containerStyle={{padding:10,marginLeft:10,marginRight:10}}
                   onPress={()=>{
                     //alert(ComentarioPrincipal)
                     if(!SonSoloEspecios(ComentarioPrincipal)){
                       crearComentarioHoja("1234",datosDeCredencial.matricula,ComentarioPrincipal,Fecha())
                       setComentarioPrincipal("")
                     }else{
                        alert("comentario invalido")
                     }

                     }}
                   />
            </View>
            );break;
      }
  }




  return(
    <View>

      <Modal visible={ModalComentariosVisible} onRequestClose={()=>setModalComentariosVisible(false)} animationType="slide" transparent={true}>
        <View style={{flex:1}}>

            <View style={{width:"100%",height:50,backgroundColor:"#fff",justifyContent:"space-around",alignItems:"center",alignSelf:"center",paddingTop:5,paddingBottom:5,flexDirection:"row"}}>
              <Text style={{textAlign:"center",color:"#130f40",fontSize:20}}>Comentarios</Text>
              <Icon name={"close"} type={"font-awesome"} size={25} color={"#130f40"} onPress={()=>setModalComentariosVisible(false)} containerStyle={{padding:8}}/>
            </View>

            <View style={{flex:1,backgroundColor:"#30336b",justifyContent:"center",alignItems:"center",alignSelf:"center",paddingTop:5,paddingBottom:5}}>

                <FlatList
                  data={Comentarios}
                  keyExtractor={(item)=>item.contador}
                  ListHeaderComponent={()=>(<View style={{width:"100%",height:25}}/>)}
                  ItemSeparatorComponent={()=>(<View style={{width:"100%",height:15}}/>)}
                  ListFooterComponent={()=>(<View style={{width:"100%",height:25}}/>)}
                  ListEmptyComponent={
                    ()=>(
                      <View style={{width:"80%",height:80,justifyContent:"center",alignSelf:"center",alignItems:"center",backgroundColor:"#f9ca24",padding:8,borderRadius:15}}>
                        <Text style={{textAlign:"center",color:"#686de0",fontSize:20}}>Aun no hay Comentarios se el primero =)</Text>
                      </View>
                      )
                  }
                  renderItem={
                  ({item})=>{
                  return(
                      <View>
                        <View style={{width:"90%",alignSelf:"center",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>

                            <View style={{width:"100%",alignSelf:"center",justifyContent:"center",alignItems:"center",flexDirection:"row", backgroundColor: "#74b9ff",flexWrap: 'nowrap',padding: 10}}>
                                <View style={{width: "25%",flexWrap: 'nowrap',alignItems: 'center',justifyContent: 'center'}}>
                                  <IconoDeAvatar rounded title={"AG"} source={{uri: item.rutaDeFoto}} size={"medium"}/>
                                </View>
                                  <View style={{width: "75%",flexDirection: 'column',flexWrap: 'wrap',justifyContent: 'center',alignItems: 'center',alignSelf: 'center'}}>
                                      <Text style={{color:"#fff"}}><Text style={{color:"#2980b9"}}>{item.nombre + " " +item.apellidoPaterno + " " + item.apellidoMaterno}</Text></Text>
                                      <Text style={{color:"#ffa502"}}><Text style={{color:"#ff6348"}}>{item.fecha}</Text></Text>
                                  </View>
                            </View>

                            <View style={{backgroundColor:"#fff",width:"100%",flexDirection:"row",justifyContent:"flex-start",alignItems:"center",padding:10,borderBottomLeftRadius:10,borderBottomRightRadius:10,borderBottomWidth:4,borderBottomColor:"rgba(0,0,0,0.2)"}}>
                              <Text style={{padding:8,marginLeft:10,textAlign:"left",color:"black",textTransform: 'none'}}>{item.comentario}</Text>
                            </View>

                        </View>
                      </View>
                     )
                   }
                  }
                />

            </View>

            <View>
                <View style={{alignSelf:"center",flexDirection:"row",justifyContent:"space-around",alignItems:"center",width:"100%",backgroundColor:"#fff"}}>
                  <TouchableOpacity onPress={()=>setModalRatingVisible(true)} style={{alignSelf:"center",justifyContent:"center",alignItems:"center",width:"100%",backgroundColor:"#fff",padding:10,borderBottomWidth:1,borderColor:"#111"}}>
                    <Text>Rating Hasta El Momento</Text>
                  </TouchableOpacity>
                </View>
                <View style={{alignSelf:"center",flexDirection:"row",justifyContent:"space-around",alignItems:"center",width:"100%",backgroundColor:"#fff"}}>
                  <TouchableOpacity onPress={()=>setApartado("Rating")} style={{alignSelf:"center",justifyContent:"center",alignItems:"center",width:"50%",backgroundColor:"#fff",padding:10,borderRightWidth:1,borderColor:"#111"}}>
                    <Icon name='hand-holding-heart' type="font-awesome-5" color='#f53b57' size={29} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>setApartado("Comentario")} style={{alignSelf:"center",justifyContent:"center",alignItems:"center",width:"50%",backgroundColor:"#fff",padding:10}}>
                    <Icon name='comment-plus' type="material-community" color='#f53b57' size={29} />
                  </TouchableOpacity>
                </View>
                {
                    DevuelveApartado(Apartado)
                }
            </View>

        </View>
      </Modal>


      <Modal visible={ModalRatingVisible} onRequestClose={()=>setModalRatingVisible(false)} animationType="slide" transparent={true}>
        <View style={{flex:1}}>

            <View style={{width:"100%",height:50,backgroundColor:"#fff",justifyContent:"space-around",alignItems:"center",alignSelf:"center",paddingTop:5,paddingBottom:5,flexDirection:"row"}}>
              <Text style={{textAlign:"center",color:"#130f40",fontSize:20}}>Rating</Text>
              <Icon name={"close"} type={"font-awesome"} size={25} color={"#130f40"} onPress={()=>setModalRatingVisible(false)} containerStyle={{padding:8}}/>
            </View>

            <View style={{flex:1,backgroundColor:"#30336b",justifyContent:"center",alignItems:"center",alignSelf:"center",paddingTop:5,paddingBottom:5,alignContent:"center"}}>

                <FlatList
                  data={Rating}
                  keyExtractor={(item)=>item.contador}
                  ListHeaderComponent={()=>(<View style={{width:"100%",height:25}}/>)}
                  ItemSeparatorComponent={()=>(<View style={{width:"100%",height:15}}/>)}
                  ListFooterComponent={()=>(<View style={{width:"100%",height:25}}/>)}
                  ListEmptyComponent={
                    ()=>(
                      <View style={{width:"80%",height:80,justifyContent:"center",alignSelf:"center",alignItems:"center",backgroundColor:"#f9ca24",padding:8,borderRadius:15}}>
                        <Text style={{textAlign:"center",color:"#686de0",fontSize:20}}>Aun no hay Calificaciones se el primero =)</Text>
                      </View>
                      )
                  }
                  renderItem={
                  ({item})=>{
                  return(
                      <View style={{width: Dimensions.get("window").width , height: (Dimensions.get("window").height) * (0.20),alignSelf:"center",justifyContent:"center",alignItems:"center",flexDirection:"column",backgroundColor:"yellow",alignContent:"center"}}>


                                  <View style={{width: "25%",flexWrap: 'nowrap',alignItems: 'center',justifyContent: 'center'}}>
                                    <IconoDeAvatar rounded title={"AG"} source={{uri: item.rutaDeFoto}} size={"medium"}/>
                                  </View>

                                    <View  style={{margin:8}}>
                                        <View style={{flexDirection:"column",justifyContent:"space-around",alignItems:"center",width:"100%"}}>
                                          <Text style={{color:"#2980b9",textAlign:"center"}}>{item.nombre + " " +item.apellidoPaterno + " " + item.apellidoMaterno}</Text>
                                          <Text style={{color:"#111",textAlign:"center",fontSize:17}}>Le gusto {item.calificacion}% de 100%</Text>
                                        </View>

                                        <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center",width:"100%"}}>
                                            <Slider
                                              value={item.calificacion}
                                              disabled={true}
                                              maximumValue={100}
                                              minimumValue={0}
                                              thumbTintColor={"#111"}
                                              thumbTouchSize={{width: 50, height: 50}}
                                              maximumTrackTintColor={"#111"}
                                              minimumTrackTintColor={"#f53b57"}
                                              style={{flex:1/2}}
                                            />
                                              {
                                                DevuelveRating(item.calificacion)
                                              }
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
*/
//export default ModalComentariosVisualizarHoja;
