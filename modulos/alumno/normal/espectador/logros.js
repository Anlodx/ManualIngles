///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//aqui esta lo de angel

import React,{Component,useState, useEffect, useRef} from 'react';
import {
  //AppRegister
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
import { Rating, AirbnbRating } from 'react-native-elements';
import { ListItem, Avatar as IconoDeAvatar } from 'react-native-elements';
import ImageViewer from 'react-native-image-zoom-viewer';

import * as ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob'
import {useSelector, useDispatch} from 'react-redux';

const AnchoPantalla = Dimensions.get("window").width;
const AltoPantalla = Dimensions.get("window").height;



const Logros = (props) => {

  const datosDeCredencialEspectado = useSelector(store => store.datosDeCredencialEspectado);//usuario visitado
  const datosDeCredencial = useSelector(store => store.datosDeCredencial);//usuario visitante

  const [state,setState] = useState(1);

  useEffect(() => {
    //console.log("datosDeCredencialEspectado.matricula = ", datosDeCredencialEspectado.matricula);

  }, [datosDeCredencialEspectado.matricula]);

const  object = {datosDeCredencialEspectado: datosDeCredencialEspectado, datosDeCredencialEspectador: datosDeCredencial};
  return(
  <>
      <G numero={0 + state} data={object}/>
  </>);

}
export default Logros;




const G = (props) => {
    const datosDeCredencialEspectado2 = useSelector(store => store.datosDeCredencialEspectado);//usuario visitado

  const [state,setState] = useState({
  arreglo:[],//estos son los logros en arreglo
  idLogro:null,
  modalVisible:false,//modal que muestra la imagen en pantalla completa
  modalImage:null,//imagen que tomara ek modal para mostrar en pantalla completa
  fecha:null,
  descripcion:null,//descripcion del logro en texto
  comentario:null,//comentario que escribe al modal comentarios
  opiniones:null,//comentarios que se usaran en el flatlist en cada foto
  modalComentarioVisible:false,//Modal que muestra los comentarios de cada logro
  ModalLogro:false,
  server:"backpack.sytes.net"
});

const [actualizacion, setActualizacion] = useState(true);

const intervalComentarios = useRef(null);
  useEffect(()=>{
    console.log("RENDER desde Logros funcion G /")
      traeLogros();
      //console.log("ESTA ES LA INFORMACION DE LOGROS => ", props.data.datosDeCredencialEspectador)
      //console.log("objeto => ",state);
      //console.log("hola comment")
      return clearInterval(intervalComentarios.current)
  },[datosDeCredencialEspectado2.matricula]);

  const setModalVisible = (Visible,imageKey) => {
    setState({...state,modalImage:state.arreglo[imageKey].urlFoto,modalVisible:Visible,fecha:state.arreglo[imageKey].fecha,descripcion:state.arreglo[imageKey].descripcion,opiniones:[],idLogro:state.arreglo[imageKey].contador});

    //setState({...state,});
  }

  const getImage = ()=>{
    return state.modalImage;
  }


  const traeLogros = ()=>{
      fetch('http://'+state.server+'/servidorApp/Logros_usuarios/Tarea/TraerLogros.php',{
          method:'post',
          header:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body:JSON.stringify({
            matricula:props.data.datosDeCredencialEspectado.matricula//
          })

        })
        .then((response) => response.json())
         .then((responseJson)=>{
           setState({...state,arreglo:responseJson});
        //   console.log(responseJson);
         })
         .catch((error)=>{
         console.error(error);
         });

  }

  const traeComentariosDesdeInicio = ()=>{
        fetch('http://'+state.server+'/servidorApp/Logros_usuarios/Tarea/TraerComentarios.php',{
            method:'post',
            header:{
              'Accept': 'application/json',
              'Content-type': 'application/json'
            },
            body:JSON.stringify({
              matricula:props.data.datosDeCredencialEspectado.matricula,//
              logro:state.idLogro
            })

          })
          .then((response) => response.json())
           .then((responseJson)=>{
             console.log("traje desde componente mayor")
             setState({...state,opiniones:responseJson});
           })
           .catch((error)=>{
           console.error(error);
           });

    }



    var imagenes = null;
     imagenes = state.arreglo.map((val,key) => {
        return (
          <TouchableWithoutFeedback key={key} onPress={()=>{
            console.log("key => ",key)
            setModalVisible(true,key)

//            setActualizacion(false);

          }}>

            <View style={Styles.imageWrap}>
              <ImageElement imgsource={val.urlFoto}/>

            </View>
          </TouchableWithoutFeedback>
         );
    });

    const ComponenteComentarios = (propiedades)=>{
      const intervalComent = useRef(null);
      const [stateComment,setStateComment] = useState(propiedades.comentarios);

      const traeComentarios = ()=>{
            fetch('http://'+state.server+'/servidorApp/Logros_usuarios/Tarea/TraerComentarios.php',{
                method:'post',
                header:{
                  'Accept': 'application/json',
                  'Content-type': 'application/json'
                },
                body:JSON.stringify({
                  matricula:props.data.datosDeCredencialEspectado.matricula,//
                  logro:state.idLogro
                })

              })
              .then((response) => response.json())
               .then((responseJson)=>{

                 setStateComment(responseJson);
               })
               .catch((error)=>{
               console.error(error);
               });

        }


      useEffect(()=>{
        //console.log("hola traidos desde function => FlatList ")
        //console.log("este es el state.logro => ",state.idLogro,"  este es la matricula =>",props.data.datosDeCredencialEspectado.matricula)
        intervalComent.current =  setInterval(() => {
          traeComentarios();
          console.log("hola traidos desde function => sin setintrval")
        },1000);
        return () => clearInterval(intervalComent.current) ;
      },[])
      return(

        <>

                              <FlatList
                                data={stateComment}
                                renderItem={
                                  ({item})=>(

                          <View style={{width:"98%",alignSelf:"center",justifyContent:"center",alignItems:"center",flexDirection:"row", backgroundColor: "#fff",flexWrap: 'nowrap',padding: 10}}>
                              <View style={{width: "25%",flexWrap: 'nowrap',alignItems: 'center',justifyContent: 'center'}}>
                                <IconoDeAvatar rounded title={"AG"} source={{uri: item.urlFoto}} size={"medium"}/>
                              </View>
                                <View style={{width: "75%",flexDirection: 'column',flexWrap: 'wrap',justifyContent: 'center',alignItems: 'center',alignSelf: 'center'}}>
                                  <Text style={{color:"#222f3e"}}>De: <Text style={{color:"#2980b9"}}>{item.nombre}</Text></Text>
                                  <View>
                                  <Text style={{color:"#222f3e"}}>Comentario: <Text style={{color:"#fa8231"}}>{item.comentario}</Text></Text>
                                  <Text style={{color:"#222f3e"}}>Fecha: <Text style={{color:"#5f27cd"}}>{item.fecha}</Text></Text>
                                  </View>
                                </View>
                          </View>


                                    )
                                }



                                keyExtractor={item =>item.contador}
                                ItemSeparatorComponent={()=>(<View style={{width:"100%",height:17}}/>)}
                                ListHeaderComponent={()=>(<View style={{width:"100%",height:17}}/>)}
                                ListFooterComponent={()=>(<View style={{width:"100%",height:17}}/>)}
                                ListEmptyComponent={()=>(
                                    <View style={{alignSelf:"center",margin:5,flexDirection:"row",justifyContent:"space-around",alignItems:"center",width:"100%"}}>
                                      <Text style={{color:"#130f40",fontSize:18}}>Aún no hay comentarios, sé el primero.</Text>
                                    </View>
                                  )}
                              />

        </>

      );
    }

    const ComponentBarra = () => {

      const [stateCommentText,setStateCommentText]  = useState(null);

      const creaComentario = () => {

          fetch('http://'+state.server+'/servidorApp/Logros_usuarios/Tarea/CreaComentario.php',{
              method:'post',
              header:{
                'Accept': 'application/json',
                'Content-type': 'application/json'
              },
              body:JSON.stringify({
                //CreaComentario($matriculaPropietario,$idLogro,$nombreComento,$fotoComento,$matriculaComento,$comentario,$fecha)
                matriculaPropietario:props.data.datosDeCredencialEspectado.matricula,//
                idLogro:state.idLogro,
                nombreComento:props.data.datosDeCredencialEspectador.nombreCompleto.nombres +" "+props.data.datosDeCredencialEspectador.nombreCompleto.apellidoPaterno +" "+props.data.datosDeCredencialEspectador.nombreCompleto.apellidoMaterno,
                fotoComento:props.data.datosDeCredencialEspectador.rutaDeFoto,
                matriculaComento:props.data.datosDeCredencialEspectador.matricula,//
                comentario:stateCommentText,
                fecha:Fecha()
              })

            })
            .then((response) => response.json())
             .then((responseJson)=>{
               if(responseJson == "ok"){
                     console.log("SE CREO EL COMENTARIO");
                   }else{
                     console.log("NO SE CREO EL COMENTARIO");
                   }
             })
             .catch((error)=>{
             console.error(error);
             });

      }

      return(

          <View style={{alignSelf:"center",flexDirection:"row",justifyContent:"space-between",alignItems:"center",width:AnchoPantalla,backgroundColor:"#fff"}}>
              <TextInput
                textAlign={"center"}
                value={stateCommentText}
                style={{borderWidth:1,borderColor:"#777",width:AnchoPantalla * (0.75),color:"#fff",borderRadius:12,backgroundColor:"#111"}}
                 placeholder={"Comenta algo..."}
                 placeholderTextColor="#fff"
                 onChangeText={(Val)=>{
                   setStateCommentText(Val)
                 }
                 }
                 maxLength={60}
                 autoFocus={true}
                 />

                 <Icon name='send' type="material-community" color='#2e86de' size={30}
                 onPress={()=>
                  {
                    if(filtraComentario(stateCommentText)!=""){
                    creaComentario()
                    setStateCommentText(null)
                    }else{
                      ToastAndroid.show('No puede ser vacio' , ToastAndroid.SHORT);
                      setStateCommentText(null)
                    }
                  }
                }

                containerStyle={{width: AnchoPantalla * (0.25)}}/>
          </View>


      );
    }

    return (
    <View style={{flex:1}}>
      <ScrollView>
        <View style={Styles.container}>

          <Modal onShow={()=>{
//            clearInterval(intervalComentarios.current)
            traeComentariosDesdeInicio();
          }} style={Styles.modal} animation={"fade"} transparent={true} visible={state.modalVisible} onRequestClose={()=>{setState({...state,modalImage:null,modalVisible:false})}}>
            <View style={Styles.modal}>




                <View  style={{flex:1, justifyContent:"center",flexDirection:"column"}}>

                <View style={{width: Dimensions.get("window").width,height: (Dimensions.get("window").height) * (0.2), backgroundColor: null}}>

                    <View style={{alignSelf:"center",marginBottom:4,justifyContent:"center",alignItems:"center",flexDirection:"row",width:"100%",backgroundColor: null,height: "60%"}}>
                    <Text style={{color:"#c8d6e5",fontSize:16,textAlign:"center",fontFamily: "AkayaKanadaka-Regular",padding:3,width: "90%"}}>{state.descripcion}</Text>
                      <Icon name='close' type="font-awesome" color='white' size={30} onPress={()=>{setState({...state,modalImage:null,modalVisible:false})}}/>
                    </View>

                    <View style={{width:"100%",flexDirection:"row",justifyContent:"space-around",alignItems:"center",backgroundColor: null,height: "40%"}}>

                      <View style={{width:"50%",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                      <Text style={{textAlign:"center",fontSize:18,color:"#fff",fontFamily: "Viga-Regular"}}>{state.fecha}</Text>
                      </View>

                      <TouchableOpacity onPress={()=>setState({...state,modalComentarioVisible:true})} style={{width:"40%",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                         <Icon name='comments' type="font-awesome" color='#00BCD4' size={27}/>
                         <Text style={{color:"#fff",marginLeft:10,fontFamily: "Viga-Regular"}}>Comentar</Text>
                      </TouchableOpacity>
                    </View>
                </View>

                <View style={{width: Dimensions.get("window").width,height: (Dimensions.get("window").height) * (0.8) }}>
                  <ImageViewer imageUrls={[{url: state.modalImage}]}
                    renderIndicator={()=>null}
                    maxOverflow={0}
                    saveToLocalByLongPress={false}
                  />
                  </View>
                </View>







            </View>

          </Modal>




                 <Modal  onShow={()=>{
                  //        traeComentariosInterval();
                        }}
                  animationType="slide" transparent={true} visible={state.modalComentarioVisible}
                  onRequestClose={()=>{
                    //clearInterval(intervalComentarios.current)
                    setState({...state,modalComentarioVisible:false})
                     }}>

                   <View style={{flex:1,backgroundColor:"rgba(0,0,0,0.8)",alignItems:"center",justifyContent:"center",alignSelf:"center",width:"100%",height:"100%"}}>

                   <View style={{alignSelf:"center",margin:5,flexDirection:"row",justifyContent:"space-around",alignItems:"center",width:"100%"}}>
                    <Text style={{color:"#fff",fontSize:18}}>Comentarios</Text>
                    <Icon name='close' type="font-awesome" color='white' size={30} containerStyle={{alignSelf:"flex-end",marginBottom:10}}
                    onPress={()=>{
                    //clearInterval(intervalComentarios.current)
                    setState({...state,modalComentarioVisible:false})
                     }}/>
                    </View>

                    <View style={{backgroundColor:"#c7ecee",width:"100%",height:"65%",borderRadius:10,flex:1}}>

                      <ComponenteComentarios comentarios={state.opiniones}/>

                      <ComponentBarra/>

                    </View>
                   </View>
                 </Modal>




          {imagenes}
          


        </View>

      </ScrollView>

        <View style={{width:"100%",height:10}}/>

</View>
    );

}



const Styles = StyleSheet.create({
  container:{
    flex:1,
    flexDirection:"row",
    flexWrap:"wrap",
    backgroundColor:"#eee"
  },
  imageWrap:{
    margin:2,
    padding:2,
    height:(Dimensions.get('window').height/3) - 12,
    width:(Dimensions.get('window').width/2) - 4,
    backgroundColor:"#fff"
  },
  modal:{
    flex:1,
    
    backgroundColor:"rgba(0,0,0,1)"
  },
  text:{
    color:"#fff"
  }
});





const ImageElement = (props) => {

    return (
      <Image source={{uri:props.imgsource}} style={styles.image} />
    );

}

const styles = StyleSheet.create({
  image:{
    flex:1,
    width:null,
    alignSelf:"stretch"
  }
});





function filtraComentario(param){
  let retorno="";
  if(param!=null){
    let i=0,aux=0;
    while(i<param.length){
      if(param[i]!=" "){
        break;
      }
      i++;
    }
    if(i==param.length){
      return retorno;
    }else{
      return param;
    }

  }else{
    return retorno;
  }
}

function filtraDescripcion(param){
  let retorno="";
  if(param!=null){
    let aux=filtraComentario(param);
    let i=0;
    let lol="";
    while(i<aux.length){
      if(aux[i]!="&"){
        lol+=aux[i];
      }else{
        lol+="y";
      }
      i++;
    }
    return lol;
  }else{
    return retorno;
  }
}

function limpiaCaracter(param){
  if(param!=null){
    return param.replace("&",param)
  }
}

function Fecha(){
  var Fecha = new Date();
  var pa="";

  switch(Fecha.getDay()){
    case 0: pa+="Dom "; break;
    case 1: pa+="Lun "; break;
    case 2: pa+="Mar "; break;
    case 3: pa+="Mie "; break;
    case 4: pa+="Jue "; break;
    case 5: pa+="Vie "; break;
    case 6: pa+="Sab "; break;
  }

  pa+=""+Fecha.getDate()+"-";


  switch(Fecha.getMonth()){
    case 0: pa+="01"; break;
    case 1: pa+="02"; break;
    case 2: pa+="03"; break;
    case 3: pa+="04"; break;
    case 4: pa+="05"; break;
    case 5: pa+="06"; break;
    case 6: pa+="07"; break;
    case 7: pa+="08"; break;
    case 8: pa+="09"; break;
    case 9: pa+="10"; break;
    case 10: pa+="11"; break;
    case 11: pa+="12"; break;
  }
  pa+="-"+Fecha.getFullYear()+" ";
  var aux="";
  if(Fecha.getHours()>=0 && Fecha.getHours()<12){
    aux="am";
  }else{
    aux="pm";
  }

  if(Fecha.getHours()>12){
    pa+=(Fecha.getHours()-12);
  }
  else if(Fecha.getHours()===0){
    pa+="12";
  }
  else{
    pa+=Fecha.getHours();
  }


  pa+=":"+Fecha.getMinutes()+" "+aux;

  return(pa);
}

























/*
export default g = () => {
    const datosDeCredencialEspectado = useSelector(store => store.datosDeCredencialEspectado);//usuario visitado
    const datosDeCredencial = useSelector(store => store.datosDeCredencial);//usuario visitante

    var intervalComentarios;

    const [state,setState] = useState({
    arreglo:[],
    idLogro:null,
    modalVisible:false,//modal que muestra la imagen en pantalla completa
    modalImage:null,//imagen que tomara ek modal para mostrar en pantalla completa
    fecha:null,
    descripcion:null,//descripcion del logro en texto
    comentario:null,//comentario que escribe al modal comentarios
    opiniones:null,//comentarios que se usaran en el flatlist en cada foto
    modalComentarioVisible:false,//Modal que muestra los comentarios de cada logro
    ModalLogro:false,
    server:"backpack.sytes.net"
    })
  useEffect(()=>{
    traeLogros();
    return () => {
      clearInterval(intervalComentarios)
    }
    //console.log("ESTA ES LA INFORMACION DE LOGROS => ", this.props.data.datosDeCredencialEspectador)
  },[])


  function setModalVisible(Visible,imageKey){
    //console.log("hola desde set Visible")
    setState({...state,modalImage:state.arreglo[imageKey].urlFoto});
    setState({...state,modalVisible:Visible,fecha:state.arreglo[imageKey].fecha,descripcion:state.arreglo[imageKey].descripcion,opiniones:[],idLogro:state.arreglo[imageKey].contador});
  }

  function getImage(){
    return state.modalImage;
  }


  function traeLogros(){
      fetch('http://'+state.server+'/servidorApp/Logros_usuarios/Tarea/TraerLogros.php',{
          method:'post',
          header:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body:JSON.stringify({
            matricula:datosDeCredencialEspectado.matricula
          })

        })
        .then((response) => response.json())
         .then((responseJson)=>{
           setState({...state,arreglo:responseJson});
           console.log(responseJson);
         })
         .catch((error)=>{
         console.error(error);
         });

  }

  function traeComentarios(){
      fetch('http://'+state.server+'/servidorApp/Logros_usuarios/Tarea/TraerComentarios.php',{
          method:'post',
          header:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body:JSON.stringify({
            matricula:datosDeCredencialEspectado.matricula,
            logro:state.idLogro
          })

        })
        .then((response) => response.json())
         .then((responseJson)=>{
           setState({...state,opiniones:responseJson});
         })
         .catch((error)=>{
         console.error(error);
         });

  }
  function traeComentariosInterval(){
    intervalComentarios=setInterval(()=>{
      console.log("traidos")
      traeComentarios()
    },1000)
  }

  function creaComentario(){
      setState({...state,comentario:null})
      fetch('http://'+state.server+'/servidorApp/Logros_usuarios/Tarea/CreaComentario.php',{
          method:'post',
          header:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body:JSON.stringify({
            //CreaComentario($matriculaPropietario,$idLogro,$nombreComento,$fotoComento,$matriculaComento,$comentario,$fecha)
            matriculaPropietario:datosDeCredencialEspectado.matricula,
            idLogro:state.idLogro,
            nombreComento:datosDeCredencial.nombreCompleto.nombres +" "+datosDeCredencial.nombreCompleto.apellidoPaterno +" "+datosDeCredencial.nombreCompleto.apellidoMaterno,
            fotoComento:datosDeCredencial.rutaDeFoto,
            matriculaComento:datosDeCredencial.matricula,
            comentario:state.comentario,
            fecha:Fecha()
          })

        })
        .then((response) => response.json())
         .then((responseJson)=>{
           if(responseJson == "ok"){
                 console.log("SE CREO EL COMENTARIO");
               }else{
                 console.log("NO SE CREO EL COMENTARIO");
               }
         })
         .catch((error)=>{
         console.error(error);
         });

  }


    var imagenes = state.arreglo.map((val,key) => {
        return (
          <TouchableWithoutFeedback key={key} onPress={()=>{

            setModalVisible(true,key)

          }}>

            <View style={Styles.imageWrap}>

              <ImageElement imgsource={val.urlFoto}/>

            </View>
          </TouchableWithoutFeedback>
         );
    });


    return (
    <View style={{flex:1}}>
      <ScrollView>
        <View style={Styles.container}>

          <Modal onShow={()=>{
            clearInterval(intervalComentarios)
            traeComentarios();
          }} style={Styles.modal} animation={"fade"} transparent={true} visible={state.modalVisible} onRequestClose={()=>{setState({...state,modalImage:null,modalVisible:false})}}>
            <View style={Styles.modal}>

                <View style={{alignSelf:"center",marginBottom:10,justifyContent:"space-around",alignItems:"space-around",flexDirection:"row",width:"100%"}}>
                  <Text style={{color:"#c8d6e5",fontSize:16,textAlign:"center",padding:15}}>{state.descripcion}</Text>
                  <Icon name='close' type="font-awesome" color='white' size={30} onPress={()=>{setState({...state,modalImage:null,modalVisible:false})}}/>
                </View>



                <View style={{width:"100%",height:40,flexDirection:"row",justifyContent:"space-around",alignItems:"center",paddingTop:20}}>

                  <View style={{width:"50%",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                      <Text style={{textAlign:"center",fontSize:18,fontWeight:"bold",color:"#fff"}}>{state.fecha}</Text>
                  </View>

                  <TouchableOpacity onPress={()=>setState({...state,modalComentarioVisible:true})} style={{width:"50%",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                     <Icon name='comments' type="font-awesome" color='#00BCD4' size={30}/>
                     <Text style={{color:"#fff",marginLeft:10}}>Comentar</Text>
                  </TouchableOpacity>
                </View>

                <Image source={{uri:state.modalImage}} style={{flex:1,width:(Dimensions.get('window').width)*(9/10),height:(Dimensions.get('window').height)*(7/10),overflow:"visible",alignSelf:"center"}} resizeMode="contain"/>

            </View>

          </Modal>




                 <Modal  onShow={()=>{
                          traeComentariosInterval();
                        }}
                  animationType="slide" transparent={true} visible={state.modalComentarioVisible}
                  onRequestClose={()=>{
                    clearInterval(intervalComentarios)
                    setState({...state,modalComentarioVisible:false})
                     }}>

                   <View style={{flex:1,backgroundColor:"rgba(0,0,0,0.8)",alignItems:"center",justifyContent:"center",alignSelf:"center",width:"100%",height:"100%"}}>

                   <View style={{alignSelf:"center",margin:5,flexDirection:"row",justifyContent:"space-around",alignItems:"center",width:"100%"}}>
                    <Text style={{color:"#fff",fontSize:18}}>Comentarios</Text>
                    <Icon name='close' type="font-awesome" color='white' size={30} containerStyle={{alignSelf:"flex-end",marginBottom:10}}
                    onPress={()=>{
                    clearInterval(intervalComentarios)
                    setState({...state,modalComentarioVisible:false})
                     }}/>
                    </View>

                    <View style={{backgroundColor:"#c7ecee",width:"100%",height:"65%",borderRadius:10,flex:1}}>

                      <FlatList
                        data={state.opiniones}
                        renderItem={
                          ({item})=>(

                  <View style={{width:"98%",alignSelf:"center",justifyContent:"center",alignItems:"center",flexDirection:"row", backgroundColor: "#fff",flexWrap: 'nowrap',padding: 10}}>
                      <View style={{width: "25%",flexWrap: 'nowrap',alignItems: 'center',justifyContent: 'center'}}>
                        <IconoDeAvatar rounded title={"AG"} source={{uri: item.urlFoto}} size={"medium"}/>
                      </View>
                        <View style={{width: "75%",flexDirection: 'column',flexWrap: 'wrap',justifyContent: 'center',alignItems: 'center',alignSelf: 'center'}}>
                          <Text style={{color:"#222f3e"}}>De: <Text style={{color:"#2980b9"}}>{item.nombre}</Text></Text>
                          <View>
                          <Text style={{color:"#222f3e"}}>Comentario: <Text style={{color:"#fa8231"}}>{item.comentario}</Text></Text>
                          <Text style={{color:"#222f3e"}}>Fecha: <Text style={{color:"#5f27cd"}}>{item.fecha}</Text></Text>
                          </View>
                        </View>
                  </View>


                            )
                        }



                        keyExtractor={item =>item.contador}
                        ItemSeparatorComponent={()=>(<View style={{width:"100%",height:17}}/>)}
                        ListHeaderComponent={()=>(<View style={{width:"100%",height:17}}/>)}
                        ListFooterComponent={()=>(<View style={{width:"100%",height:17}}/>)}
                        ListEmptyComponent={()=>(
                            <View style={{alignSelf:"center",margin:5,flexDirection:"row",justifyContent:"space-around",alignItems:"center",width:"100%"}}>
                              <Text style={{color:"#130f40",fontSize:18}}>Aun no hay comentarios, se el primero.</Text>
                            </View>
                          )}
                      />

                    <View style={{alignSelf:"center",flexDirection:"row",justifyContent:"space-between",alignItems:"center",width:"100%",backgroundColor:"#fff"}}>
                        <TextInput
                          textAlign={"center"}
                          value={state.comentario}
                           style={{borderWidth:1,borderColor:"#777",padding:8,margin:10,width:270,color:"#fff",borderRadius:20,backgroundColor:"#111"}}
                           placeholder={"Comenta algo..."}
                           placeholderTextColor="#fff"
                           onChangeText={(Val)=>setState({...state,comentario:Val})}
                           maxLength={60}
                           autoFocus={true}
                           />

                           <Icon name='send' type="material-community" color='#2e86de' size={30}
                           onPress={()=>
                            {
                              if(filtraComentario(state.comentario)!=""){
                              creaComentario()
                              }else{
                                alert("no puede ser vacio")
                                setState({...state,comentario:null})
                              }
                            }
                          }

                            containerStyle={{padding:12,marginRight:3}}/>
                    </View>

                    </View>
                   </View>
                 </Modal>




          {imagenes}


        </View>

      </ScrollView>

        <View style={{width:"100%",height:10}}/>

</View>
    );

}



const Styles = StyleSheet.create({
  container:{
    flex:1,
    flexDirection:"row",
    flexWrap:"wrap",
    backgroundColor:"#eee"
  },
  imageWrap:{
    margin:2,
    padding:2,
    height:(Dimensions.get('window').height/3) - 12,
    width:(Dimensions.get('window').width/2) - 4,
    backgroundColor:"#fff"
  },
  modal:{
    flex:1,
    padding:40,
    backgroundColor:"rgba(0,0,0,0.8)"
  },
  text:{
    color:"#fff"
  }
});





class ImageElement extends Component {
  render() {
    return (
      <Image source={{uri:this.props.imgsource}} style={styles.image} />
    );
  }
}

const styles = StyleSheet.create({
  image:{
    flex:1,
    width:null,
    alignSelf:"stretch"
  }
});





function filtraComentario(param){
  let retorno="";
  if(param!=null){
    let i=0,aux=0;
    while(i<param.length){
      if(param[i]!=" "){
        break;
      }
      i++;
    }
    if(i==param.length){
      return retorno;
    }else{
      return param;
    }

  }else{
    return retorno;
  }
}

function filtraDescripcion(param){
  let retorno="";
  if(param!=null){
    let aux=filtraComentario(param);
    let i=0;
    let lol="";
    while(i<aux.length){
      if(aux[i]!="&"){
        lol+=aux[i];
      }else{
        lol+="y";
      }
      i++;
    }
    return lol;
  }else{
    return retorno;
  }
}

function limpiaCaracter(param){
  if(param!=null){
    return param.replace("&",param)
  }
}

function Fecha(){
  var Fecha = new Date();
  var pa="";

  switch(Fecha.getDay()){
    case 0: pa+="Dom "; break;
    case 1: pa+="Lun "; break;
    case 2: pa+="Mar "; break;
    case 3: pa+="Mie "; break;
    case 4: pa+="Jue "; break;
    case 5: pa+="Vie "; break;
    case 6: pa+="Sab "; break;
  }

  pa+=""+Fecha.getDate()+"-";


  switch(Fecha.getMonth()){
    case 0: pa+="01"; break;
    case 1: pa+="02"; break;
    case 2: pa+="03"; break;
    case 3: pa+="04"; break;
    case 4: pa+="05"; break;
    case 5: pa+="06"; break;
    case 6: pa+="07"; break;
    case 7: pa+="08"; break;
    case 8: pa+="09"; break;
    case 9: pa+="10"; break;
    case 10: pa+="11"; break;
    case 11: pa+="12"; break;
  }
  pa+="-"+Fecha.getFullYear()+" ";
  var aux="";
  if(Fecha.getHours()>=0 && Fecha.getHours()<12){
    aux="am";
  }else{
    aux="pm";
  }

  if(Fecha.getHours()>12){
    pa+=(Fecha.getHours()-12);
  }
  else if(Fecha.getHours()===0){
    pa+="12";
  }
  else{
    pa+=Fecha.getHours();
  }


  pa+=":"+Fecha.getMinutes()+" "+aux;

  return(pa);
}


*/


///////////////////////////////////////////////////////////////////////////////////







/*
import React,{Component,useState} from 'react';
import {
  //AppRegister
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
import { Rating, AirbnbRating } from 'react-native-elements';
import { ListItem, Avatar as IconoDeAvatar } from 'react-native-elements';

import * as ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob'

export default class g extends Component {


  constructor(props) {
    super(props);

    this.state = {
    usuarioVisitante:{
      matricula: this.props.data.datosDeCredencialEspectador.matricula,
      Nombre:{
        Nombres: this.props.data.datosDeCredencialEspectador.nombreCompleto.nombres,
        ApellidoPaterno: this.props.data.datosDeCredencialEspectador.nombreCompleto.apellidoPaterno,
        ApellidoMaterno: this.props.data.datosDeCredencialEspectador.nombreCompleto.apellidoMaterno
      },
      urlFoto: this.props.data.datosDeCredencialEspectador.rutaDeFoto
    },
    usuario:{
      matricula: this.props.data.datosDeCredencialEspectado.Id,
      Nombre:{
        Nombres: this.props.data.datosDeCredencialEspectado.Nombre.Nombres,
        ApellidoPaterno: this.props.data.datosDeCredencialEspectado.Nombre.ApellidoPaterno,
        ApellidoMaterno: this.props.data.datosDeCredencialEspectado.Nombre.ApellidoMaterno
      },
      urlFoto: this.props.data.datosDeCredencialEspectado.Avatar
    },
    arreglo:[],
    idLogro:null,
    modalVisible:false,//modal que muestra la imagen en pantalla completa
    modalImage:null,//imagen que tomara ek modal para mostrar en pantalla completa
    fecha:null,
    descripcion:null,//descripcion del logro en texto
    comentario:null,//comentario que escribe al modal comentarios
    opiniones:null,//comentarios que se usaran en el flatlist en cada foto
    modalComentarioVisible:false,//Modal que muestra los comentarios de cada logro
    ModalLogro:false,
    server:"backpack.sytes.net"
    };
    this.setModalVisible = this.setModalVisible.bind(this);
    this.getImage = this.getImage.bind(this);
    this.traeLogros = this.traeLogros.bind(this);
    this.traeComentarios = this.traeComentarios.bind(this);
    this.traeComentariosInterval = this.traeComentariosInterval.bind(this);
    this.creaComentario = this.creaComentario.bind(this);

  }

  componentDidMount(){
    this.traeLogros();
    console.log("ESTA ES LA INFORMACION DE LOGROS => ", this.props.data.datosDeCredencialEspectador)
  }
  componentWillUnmount(){
    clearInterval(this.intervalComentarios)
  }

  setModalVisible(Visible,imageKey){
    this.setState({modalImage:this.state.arreglo[imageKey].urlFoto});
    this.setState({modalVisible:Visible,fecha:this.state.arreglo[imageKey].fecha,descripcion:this.state.arreglo[imageKey].descripcion,opiniones:[],idLogro:this.state.arreglo[imageKey].contador});
  }

  getImage(){
    return this.state.modalImage;
  }


  traeLogros(){
      fetch('http://'+this.state.server+'/servidorApp/Logros_usuarios/Tarea/TraerLogros.php',{
          method:'post',
          header:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body:JSON.stringify({
            matricula:this.state.usuario.matricula
          })

        })
        .then((response) => response.json())
         .then((responseJson)=>{
           this.setState({...this.state,arreglo:responseJson});
           console.log(responseJson);
         })
         .catch((error)=>{
         console.error(error);
         });

  }

  traeComentarios(){
      fetch('http://'+this.state.server+'/servidorApp/Logros_usuarios/Tarea/TraerComentarios.php',{
          method:'post',
          header:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body:JSON.stringify({
            matricula:this.state.usuario.matricula,
            logro:this.state.idLogro
          })

        })
        .then((response) => response.json())
         .then((responseJson)=>{
           this.setState({...this.state,opiniones:responseJson});
         })
         .catch((error)=>{
         console.error(error);
         });

  }
  traeComentariosInterval(){
    this.intervalComentarios=setInterval(()=>{
      console.log("traidos")
      this.traeComentarios()
    },1000)
  }

  creaComentario(){
      this.setState({comentario:null})
      fetch('http://'+this.state.server+'/servidorApp/Logros_usuarios/Tarea/CreaComentario.php',{
          method:'post',
          header:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body:JSON.stringify({
            //CreaComentario($matriculaPropietario,$idLogro,$nombreComento,$fotoComento,$matriculaComento,$comentario,$fecha)
            matriculaPropietario:this.state.usuario.matricula,
            idLogro:this.state.idLogro,
            nombreComento:this.state.usuarioVisitante.Nombre.Nombres +" "+this.state.usuarioVisitante.Nombre.ApellidoPaterno +" "+this.state.usuarioVisitante.Nombre.ApellidoMaterno,
            fotoComento:this.state.usuarioVisitante.urlFoto,
            matriculaComento:this.state.usuarioVisitante.matricula,
            comentario:this.state.comentario,
            fecha:Fecha()
          })

        })
        .then((response) => response.json())
         .then((responseJson)=>{
           if(responseJson == "ok"){
                 console.log("SE CREO EL COMENTARIO");
               }else{
                 console.log("NO SE CREO EL COMENTARIO");
               }
         })
         .catch((error)=>{
         console.error(error);
         });

  }


  render() {
    let imagenes=null;
     imagenes = this.state.arreglo.map((val,key) => {
        return (
          <TouchableWithoutFeedback key={key} onPress={()=>{

            this.setModalVisible(true,key)

          }}>

            <View style={Styles.imageWrap}>
              <ImageElement imgsource={val.urlFoto}/>

            </View>
          </TouchableWithoutFeedback>
         );
    });


    return (
    <View style={{flex:1}}>
      <ScrollView>
        <View style={Styles.container}>

          <Modal onShow={()=>{
            clearInterval(this.intervalComentarios)
            this.traeComentarios();
          }} style={Styles.modal} animation={"fade"} transparent={true} visible={this.state.modalVisible} onRequestClose={()=>{this.setState({modalImage:null,modalVisible:false})}}>
            <View style={Styles.modal}>

                <View style={{alignSelf:"center",marginBottom:10,justifyContent:"space-around",alignItems:"space-around",flexDirection:"row",width:"100%"}}>
                  <Text style={{color:"#c8d6e5",fontSize:16,textAlign:"center",padding:15}}>{this.state.descripcion}</Text>
                  <Icon name='close' type="font-awesome" color='white' size={30} onPress={()=>{this.setState({modalImage:null,modalVisible:false})}}/>
                </View>



                <View style={{width:"100%",height:40,flexDirection:"row",justifyContent:"space-around",alignItems:"center",paddingTop:20}}>

                  <View style={{width:"50%",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                      <Text style={{textAlign:"center",fontSize:18,fontWeight:"bold",color:"#fff"}}>{this.state.fecha}</Text>
                  </View>

                  <TouchableOpacity onPress={()=>this.setState({modalComentarioVisible:true})} style={{width:"50%",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                     <Icon name='comments' type="font-awesome" color='#00BCD4' size={30}/>
                     <Text style={{color:"#fff",marginLeft:10}}>Comentar</Text>
                  </TouchableOpacity>
                </View>

                <Image source={{uri:this.state.modalImage}} style={{flex:1,width:(Dimensions.get('window').width)*(9/10),height:(Dimensions.get('window').height)*(7/10),overflow:"visible",alignSelf:"center"}} resizeMode="contain"/>

            </View>

          </Modal>




                 <Modal  onShow={()=>{
                          this.traeComentariosInterval();
                        }}
                  animationType="slide" transparent={true} visible={this.state.modalComentarioVisible}
                  onRequestClose={()=>{
                    clearInterval(this.intervalComentarios)
                    this.setState({modalComentarioVisible:false})
                     }}>

                   <View style={{flex:1,backgroundColor:"rgba(0,0,0,0.8)",alignItems:"center",justifyContent:"center",alignSelf:"center",width:"100%",height:"100%"}}>

                   <View style={{alignSelf:"center",margin:5,flexDirection:"row",justifyContent:"space-around",alignItems:"center",width:"100%"}}>
                    <Text style={{color:"#fff",fontSize:18}}>Comentarios</Text>
                    <Icon name='close' type="font-awesome" color='white' size={30} containerStyle={{alignSelf:"flex-end",marginBottom:10}}
                    onPress={()=>{
                    clearInterval(this.intervalComentarios)
                    this.setState({modalComentarioVisible:false})
                     }}/>
                    </View>

                    <View style={{backgroundColor:"#c7ecee",width:"100%",height:"65%",borderRadius:10,flex:1}}>

                      <FlatList
                        data={this.state.opiniones}
                        renderItem={
                          ({item})=>(

                  <View style={{width:"98%",alignSelf:"center",justifyContent:"center",alignItems:"center",flexDirection:"row", backgroundColor: "#fff",flexWrap: 'nowrap',padding: 10}}>
                      <View style={{width: "25%",flexWrap: 'nowrap',alignItems: 'center',justifyContent: 'center'}}>
                        <IconoDeAvatar rounded title={"AG"} source={{uri: item.urlFoto}} size={"medium"}/>
                      </View>
                        <View style={{width: "75%",flexDirection: 'column',flexWrap: 'wrap',justifyContent: 'center',alignItems: 'center',alignSelf: 'center'}}>
                          <Text style={{color:"#222f3e"}}>De: <Text style={{color:"#2980b9"}}>{item.nombre}</Text></Text>
                          <View>
                          <Text style={{color:"#222f3e"}}>Comentario: <Text style={{color:"#fa8231"}}>{item.comentario}</Text></Text>
                          <Text style={{color:"#222f3e"}}>Fecha: <Text style={{color:"#5f27cd"}}>{item.fecha}</Text></Text>
                          </View>
                        </View>
                  </View>


                            )
                        }



                        keyExtractor={item =>item.contador}
                        ItemSeparatorComponent={()=>(<View style={{width:"100%",height:17}}/>)}
                        ListHeaderComponent={()=>(<View style={{width:"100%",height:17}}/>)}
                        ListFooterComponent={()=>(<View style={{width:"100%",height:17}}/>)}
                        ListEmptyComponent={()=>(
                            <View style={{alignSelf:"center",margin:5,flexDirection:"row",justifyContent:"space-around",alignItems:"center",width:"100%"}}>
                              <Text style={{color:"#130f40",fontSize:18}}>Aun no hay comentarios, se el primero.</Text>
                            </View>
                          )}
                      />

                    <View style={{alignSelf:"center",flexDirection:"row",justifyContent:"space-between",alignItems:"center",width:"100%",backgroundColor:"#fff"}}>
                        <TextInput
                          textAlign={"center"}
                          value={this.state.comentario}
                           style={{borderWidth:1,borderColor:"#777",padding:8,margin:10,width:270,color:"#fff",borderRadius:20,backgroundColor:"#111"}}
                           placeholder={"Comenta algo..."}
                           placeholderTextColor="#fff"
                           onChangeText={(Val)=>this.setState({comentario:Val})}
                           maxLength={60}
                           autoFocus={true}
                           />

                           <Icon name='send' type="material-community" color='#2e86de' size={30}
                           onPress={()=>
                            {
                              if(filtraComentario(this.state.comentario)!=""){
                              this.creaComentario()
                              }else{
                                alert("no puede ser vacio")
                                this.setState({comentario:null})
                              }
                            }
                          }

                            containerStyle={{padding:12,marginRight:3}}/>
                    </View>

                    </View>
                   </View>
                 </Modal>




          {imagenes}


        </View>

      </ScrollView>

        <View style={{width:"100%",height:10}}/>

</View>
    );
  }
}



const Styles = StyleSheet.create({
  container:{
    flex:1,
    flexDirection:"row",
    flexWrap:"wrap",
    backgroundColor:"#eee"
  },
  imageWrap:{
    margin:2,
    padding:2,
    height:(Dimensions.get('window').height/3) - 12,
    width:(Dimensions.get('window').width/2) - 4,
    backgroundColor:"#fff"
  },
  modal:{
    flex:1,
    padding:40,
    backgroundColor:"rgba(0,0,0,0.8)"
  },
  text:{
    color:"#fff"
  }
});





class ImageElement extends Component {
  render() {
    return (
      <Image source={{uri:this.props.imgsource}} style={styles.image} />
    );
  }
}

const styles = StyleSheet.create({
  image:{
    flex:1,
    width:null,
    alignSelf:"stretch"
  }
});





function filtraComentario(param){
  let retorno="";
  if(param!=null){
    let i=0,aux=0;
    while(i<param.length){
      if(param[i]!=" "){
        break;
      }
      i++;
    }
    if(i==param.length){
      return retorno;
    }else{
      return param;
    }

  }else{
    return retorno;
  }
}

function filtraDescripcion(param){
  let retorno="";
  if(param!=null){
    let aux=filtraComentario(param);
    let i=0;
    let lol="";
    while(i<aux.length){
      if(aux[i]!="&"){
        lol+=aux[i];
      }else{
        lol+="y";
      }
      i++;
    }
    return lol;
  }else{
    return retorno;
  }
}

function limpiaCaracter(param){
  if(param!=null){
    return param.replace("&",param)
  }
}

function Fecha(){
  var Fecha = new Date();
  var pa="";

  switch(Fecha.getDay()){
    case 0: pa+="Dom "; break;
    case 1: pa+="Lun "; break;
    case 2: pa+="Mar "; break;
    case 3: pa+="Mie "; break;
    case 4: pa+="Jue "; break;
    case 5: pa+="Vie "; break;
    case 6: pa+="Sab "; break;
  }

  pa+=""+Fecha.getDate()+"-";


  switch(Fecha.getMonth()){
    case 0: pa+="01"; break;
    case 1: pa+="02"; break;
    case 2: pa+="03"; break;
    case 3: pa+="04"; break;
    case 4: pa+="05"; break;
    case 5: pa+="06"; break;
    case 6: pa+="07"; break;
    case 7: pa+="08"; break;
    case 8: pa+="09"; break;
    case 9: pa+="10"; break;
    case 10: pa+="11"; break;
    case 11: pa+="12"; break;
  }
  pa+="-"+Fecha.getFullYear()+" ";
  var aux="";
  if(Fecha.getHours()>=0 && Fecha.getHours()<12){
    aux="am";
  }else{
    aux="pm";
  }

  if(Fecha.getHours()>12){
    pa+=(Fecha.getHours()-12);
  }
  else if(Fecha.getHours()===0){
    pa+="12";
  }
  else{
    pa+=Fecha.getHours();
  }


  pa+=":"+Fecha.getMinutes()+" "+aux;

  return(pa);
}
*/
