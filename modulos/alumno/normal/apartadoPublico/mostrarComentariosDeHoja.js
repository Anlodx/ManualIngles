import React,  {useRef,useState, useEffect} from 'react';
import {ActivityIndicator,ToastAndroid,RefreshControl,TouchableOpacity,TextInput, Image,Text, View, StyleSheet, Alert, SafeAreaView, ScrollView, Picker, StatusBar, Dimensions, FlatList,Modal } from 'react-native';

import {ItemUsuario,ItemHoja,ItemLibro,ItemLibreta,ItemChat} from "../formatos.js";


import { Icon,CheckBox } from 'react-native-elements';

import { ListItem, Avatar as IconoDeAvatar } from 'react-native-elements';
import { Slider } from 'react-native-elements';

import { Button,SearchBar,ButtonGroup } from 'react-native-elements';

import {Fecha,SonSoloEspecios} from "../../../global/codigosJS/Metodos.js"

import AsyncStorage from '@react-native-async-storage/async-storage';

import {establecerDatosDeCredencialDesdeIniciarSesion} from '../../../../store/actions.js';

import {useSelector, useDispatch} from 'react-redux';




const AnchoPantalla = Dimensions.get("window").width;
const AltoPantalla = Dimensions.get("window").height;


 export const ModalComentariosVisualizarHoja = (props) =>{
  const [ModalComentariosVisible, setModalComentariosVisible] = useState(true)
  const [ModalRatingVisible, setModalRatingVisible] = useState(false)
  const [Apartado,setApartado] = useState("Comentario")

  const [ComentarioPrincipal, setComentarioPrincipal] = useState(null)

  const [Calificacion, setCalificacion] = useState(50)


  const [Comentarios, setComentarios] = useState([])
  const [Rating, setRating] = useState([])

  const datosDeCredencial = useSelector(store => store.datosDeCredencial);



        const crearRatingHoja = (IdHoja,MatriculaComento,Calificacion,Fecha) =>{
          fetch('http://backpack.sytes.net/servidorApp/php/phpVisualizarHoja/crearRatingHoja.php',{
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
               //traerRating(IdHoja)
               console.log("respuesta de crear Rating hoja => ",response)
             })
             .catch((error)=>{
             console.error(error);
             });
        }


        const crearComentarioHoja = (IdHoja,MatriculaComento,Comentario,Fecha) =>{
          fetch('http://backpack.sytes.net/servidorApp/php/phpVisualizarHoja/crearComentarioHoja.php',{
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
               //traerComentarios(IdHoja)
               console.log("respuesta de crear Comentario hoja => ",response)
             })
             .catch((error)=>{
             console.error(error);
             });
        }


  useEffect(()=>{
    //traerRating(props.idHoja);
    //traerComentarios(props.idHoja);
    console.log("hola este es el id de la hoja pasado desde los props => ",props.idHoja)
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





  return(
    <View>

      <Modal visible={ModalComentariosVisible}
       onRequestClose={()=>{
         setModalComentariosVisible(false)
         props.eventoSalir();
       }}
        animationType="slide" transparent={false}>
        <View style={{flex:1,backgroundColor: "#dcdde1"}}>

            <View style={{width:"100%",height:50,backgroundColor:"#111",justifyContent:"space-around",alignItems:"center",alignSelf:"center",paddingTop:5,paddingBottom:5,flexDirection:"row"}}>
              <Text style={{textAlign:"center",color:"#fff",fontSize:15,fontFamily: "Viga-Regular"}}>Comentarios</Text>
              <Icon name={"close"} type={"font-awesome"} size={25} color={"#fff"}
               onPress={()=>{
                 setModalComentariosVisible(false)
                 props.eventoSalir();
               }}
                containerStyle={{padding:8}}/>
            </View>

          <ListaComentarios idHoja={props.idHoja}/>

            
            <View style={{alignSelf:"center",flexDirection:"row",justifyContent:"space-between",alignItems:"center",width:AnchoPantalla,backgroundColor:"#fff"}}>
                  <TextInput
                   textAlign={"center"}
                   value={ComentarioPrincipal}
                   style={{borderWidth:1,borderColor:"#777",width:AnchoPantalla * (0.75),color:"#fff",borderRadius:12,backgroundColor:"#111"}}
                   //placeholder={"Comenta algo..."}
                   autoFocus={true}
                   placeholderTextColor={"#fff"}
                   onChangeText={(Val)=>setComentarioPrincipal(Val)}
                   maxLength={210}
                  />
                  <Icon name='send' type="material-community" color='#f53b57' size={25}  containerStyle={{width: AnchoPantalla * (0.25)}}
                   onPress={()=>{
                     //alert(ComentarioPrincipal)
                     if(!SonSoloEspecios(ComentarioPrincipal)){
                       crearComentarioHoja(props.idHoja,datosDeCredencial.matricula,ComentarioPrincipal,Fecha())
                       setComentarioPrincipal("")
                     }else{
                        ToastAndroid.show('comentario invalido' , ToastAndroid.SHORT);
                     }

                     }}
                   />
            </View>
            

        </View>
      </Modal>

    </View>
    )
}


  const ListaComentarios = (props)=>{

      const VariableVerMasOMenos = useRef(0);

      const [Detalles, setDetalles] = useState({
        CondicionalDeRegistros: null,
        VisualizarBotonVerMasRecientes: null
      });

      const timerComentarios = useRef(null)
      const [comentariosLista,setComentariosLista] = useState([])
      useEffect(()=>{
          console.log("trajo Comentarios de id => ",props.idHoja)
          timerComentarios.current = setInterval(()=>{
            traerComentarios(props.idHoja)
            console.log("trajo Comentarios")
          },1000)
      return ()=>clearInterval(timerComentarios.current)
      },[])



      const traerComentarios = (IdHoja) =>{
        fetch('http://backpack.sytes.net/servidorApp/php/phpVisualizarHoja/traerComentariosHoja.php',{
            method:'post',
            header:{
              'Accept': 'application/json',
              'Content-type': 'application/json'
            },
            body:JSON.stringify({
              IdHoja:props.idHoja,
              VariableVerMasOMenos: VariableVerMasOMenos.current
            })

          })
          .then((response) => response.text())
           .then((response)=>{

             let objeto = JSON.parse(response)
             setComentariosLista(objeto.arregloConObjetosDeComentarios)
             setDetalles({
               ...Detalles,
               CondicionalDeRegistros: objeto.condicionalDeRegistros,
               VisualizarBotonVerMasRecientes: objeto.visualizarBotonVerMasRecientes
             });
             //console.log("respuesta de Comentarios => ",datos)
           })
           .catch((error)=>{
           console.error(error);
           });
      }






      return(

                        <FlatList
                          data={comentariosLista}
                          keyExtractor={(item)=>item.contador}
                          ListHeaderComponent={()=>(
      <>{(Detalles.CondicionalDeRegistros <= 0) ?
				<View style={{width:"100%",height:25}}/>
			:
        <TouchableOpacity onPress={()=>{VariableVerMasOMenos.current=VariableVerMasOMenos.current + 1}} style={{width: Dimensions.get("window").width, padding: 8,color:"#fff",backgroundColor: "#7f8fa6",marginBottom: 15}}>
          <Text style={{textAlign:"center",color:"#111",fontSize:20,width:"100%"}}> Ver Anteriores </Text>
        </TouchableOpacity>
			}</>

                  )}
            	ListFooterComponent={()=>(
      <>{(Detalles.VisualizarBotonVerMasRecientes) ?
        <TouchableOpacity onPress={()=>{VariableVerMasOMenos.current=VariableVerMasOMenos.current - 1}} style={{width: Dimensions.get("window").width, padding: 8,color:"#fff",backgroundColor: "#7f8fa6",marginTop: 15}}>
					<Text style={{textAlign:"center",color:"#111",fontSize:20,width:"100%"}}> Ver Más Recientes </Text>
		     </TouchableOpacity>
			:
      <View style={{width:"100%",height:25}}/>
			}</>
            	)}
                          
                          ItemSeparatorComponent={()=>(<View style={{width:"100%",height:15}}/>)}
                          
                          ListEmptyComponent={
                            ()=>(
                              <View style={{width:"80%",height:80,justifyContent:"center",alignSelf:"center",alignItems:"center",backgroundColor:"#f9ca24",padding:8,borderRadius:15}}>
                                <Text style={{textAlign:"center",color:"#686de0",fontSize:20}}>Aún no hay Comentarios sé el primero =)</Text>
                              </View>
                              )
                          }
                          renderItem={
                          ({item})=>{
                          return(
                              <View>
                                <View style={{width:"90%",alignSelf:"center",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>

                                    <View style={{width:"100%",alignSelf:"center",justifyContent:"center",alignItems:"center",flexDirection:"row", backgroundColor: "#00a8ff",flexWrap: 'nowrap',padding: 10}}>
                                        <View style={{width: "25%",flexWrap: 'nowrap',alignItems: 'center',justifyContent: 'center'}}>
                                          <IconoDeAvatar rounded title={"AG"} source={{uri: item.rutaDeFoto}} size={"medium"}/>
                                        </View>
                                          <View style={{width: "75%",flexDirection: 'column',flexWrap: 'wrap',justifyContent: 'center',alignItems: 'center',alignSelf: 'center'}}>
                                              <Text style={{color:"#fff"}}><Text style={{color:"#2f3640"}}>{item.nombre + " " +item.apellidoPaterno + " " + item.apellidoMaterno}</Text></Text>
                                              <Text style={{color:"#ffa502"}}><Text style={{color:"#192a56"}}>{item.fecha}</Text></Text>
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



      )
  }




  const ListaRating = (props)=>{
      const timerRating = useRef(null)
      const [ratingLista,setRatingLista] = useState([])
      useEffect(()=>{
        console.log("trajo rating de id => ",props.idHoja)
          timerRating.current = setInterval(()=>{
            traerRating(props.idHoja)
            console.log("trajo rating")
          },1000)
      return ()=>clearInterval(timerRating.current)
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

      const traerRating = (IdHoja) =>{
        fetch('http://backpack.sytes.net/servidorApp/php/phpVisualizarHoja/traerRatingHoja.php',{
            method:'post',
            header:{
              'Accept': 'application/json',
              'Content-type': 'application/json'
            },
            body:JSON.stringify({
              IdHoja:props.idHoja
            })

          })
          .then((response) => response.text())
           .then((response)=>{

             let datos = JSON.parse(response)
             setRatingLista(datos)
          //   console.log("respuesta de Rating => ",datos)
           })
           .catch((error)=>{
           console.error(error);
           });
      }





      return(


                                    <FlatList
                                      data={ratingLista}
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



      )
  }


export default ModalComentariosVisualizarHoja;
