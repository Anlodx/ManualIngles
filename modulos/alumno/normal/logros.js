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
  Alert,
  ToastAndroid
} from 'react-native';
import { Icon,CheckBox } from 'react-native-elements';
import { Rating, AirbnbRating } from 'react-native-elements';
import { ListItem, Avatar as IconoDeAvatar } from 'react-native-elements';
import ImageViewer from 'react-native-image-zoom-viewer';

import * as ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob'

const AnchoPantalla = Dimensions.get("window").width;
const AltoPantalla = Dimensions.get("window").height;


export default class g extends Component {
  constructor(props) {
    super(props);

	console.log('ESTAMOS EN LOGROS = ', this.props.data);

    this.state = {
    usuario:{
      matricula: this.props.data.matricula,
      Nombre:{
        Nombres: this.props.data.nombreCompleto.nombres,
        ApellidoPaterno: this.props.data.nombreCompleto.apellidoPaterno,
        ApellidoMaterno: this.props.data.nombreCompleto.apellidoMaterno
      },
      urlFoto: this.props.data.rutaDeFoto//"https://images.unsplash.com/photo-1542044896530-05d85be9b11a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
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
    selectedId:null,
    ModalLogro:false,
    server:"backpack.sytes.net"
    };
    this.setDataforDeleting = this.setDataforDeleting.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.getImage = this.getImage.bind(this);
    this.traeLogros = this.traeLogros.bind(this);
    this.traeComentarios = this.traeComentarios.bind(this);
    this.traeComentariosInterval = this.traeComentariosInterval.bind(this);
    this.creaComentario = this.creaComentario.bind(this);
    this.borrarLogro = this.borrarLogro.bind(this);
    this.borrarLogroAlert = this.borrarLogroAlert.bind(this);
    this.insertaNotificacion = this.insertaNotificacion.bind(this);
  }

  componentDidMount(){
    this.traeLogros();

  }
  componentWillUnmount(){
    clearInterval(this.intervalComentarios)
  }

  setModalVisible(Visible,imageKey){
    this.setState({modalImage:this.state.arreglo[imageKey].urlFoto});
    this.setState({modalVisible:Visible,fecha:this.state.arreglo[imageKey].fecha,descripcion:this.state.arreglo[imageKey].descripcion,opiniones:[],idLogro:this.state.arreglo[imageKey].contador});
  }
  setDataforDeleting(imageKey){
    this.setState({selectedId:this.state.arreglo[imageKey].contador});
    //alert(this.state.selectedId)
    this.borrarLogroAlert();
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
            nombreComento:this.state.usuario.Nombre.Nombres +" "+this.state.usuario.Nombre.ApellidoPaterno +" "+this.state.usuario.Nombre.ApellidoMaterno,
            fotoComento:this.state.usuario.urlFoto,
            matriculaComento:this.state.usuario.matricula,
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

  borrarLogro(){
      fetch('http://'+this.state.server+'/servidorApp/Logros_usuarios/Tarea/BorrarLogro.php',{
          method:'post',
          header:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body:JSON.stringify({
            matriculaPropietario:this.state.usuario.matricula,
            idLogro:this.state.selectedId
          })

        })
        .then((response) => response.json())
         .then((responseJson)=>{
           if(responseJson == "ok"){
                 this.traeLogros()
                 console.log("SE BORRO EL LOGRO");
               }else{
                 console.log("NO SE BORRO EL LOGRO");
               }
         })
         .catch((error)=>{
         console.error(error);
         });

  }

  borrarLogroAlert(){
        Alert.alert(
          'Pregunta:',
          "¿Quieres que borre el Logro?",
          [
            {
              text: 'No',
              onPress: () => null,
            },
            {
              text: 'Claro !!!',
               onPress: () => this.borrarLogro(),
            }
          ],
          { cancelable: false }
        );
      }


  insertaNotificacion(){
      fetch('http://'+this.state.server+'/servidorApp/Logros_usuarios/Tarea/insertarNotificacionDeLogro.php',{
          method:'post',
          header:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body:JSON.stringify({
            matricula:this.state.usuario.matricula,
          })

        })
        .then((response) => response.text())
         .then((response)=>{
           //this.setState({...this.state,opiniones:responseJson});
           console.log("respuesta de notificacion => ",response)
           if(response !== "Hecho"){
            ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
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
          <TouchableWithoutFeedback key={key} onLongPress={()=>this.setDataforDeleting(key)} onPress={()=>{

            this.setModalVisible(true,key)

          }}>

            <View style={Styles.imageWrap}>
              <ImageElement imgsource={val.urlFoto}/>

            </View>
          </TouchableWithoutFeedback>
         );
    });


  const NuevoLogro = (props) =>{

    const [Logro, setLogro] = useState({
      Id:this.state.usuario.matricula,
      Descripcion:" ",
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
          const source = { uri: response.uri };
       //$cadena="&MATRICULA&DESCRIPCION&FECHA&_img.jpg";
          setLogro({...Logro,src: source,data:response.base64,type:response.type,name:("&"+Logro.Id+"&"+Logro.Descripcion+"&"+Fecha()+"&_"+response.fileName)});
          console.log(response)
        }
      });
      }

      const uploadPhoto = () =>
      {
        this.setState({ModalLogro:false})
        console.log(this.state.usuario.matricula);
        RNFetchBlob.fetch('POST', 'http://'+this.state.server+'/servidorApp/Logros_usuarios/Tarea/CreaLogro.php', {
          Authorization : "Bearer access-token",
          otherHeader : "foo",
          'Content-Type' : 'multipart/form-data',
        },
        [
          { name : 'logro', filename : Logro.name, type:Logro.type, data: Logro.data}
        ]).then((response) => response.json())
             .then((responseJson)=>{
               console.log(responseJson)
               if(responseJson=="ok"){
                this.insertaNotificacion();
                this.traeLogros();
                console.log("felicidades")
               }else{
                console.log("lo siento bro")
               }
             }).catch((err) => {
          console.log(err)
        })

      }


    const [Ubiacacion, setUbicacion] = useState("Descripcion")

    switch(Ubiacacion){
      case "Descripcion":
      return(
       <View style={{backgroundColor:"#111",borderWidth:1,borderColor:"black",borderRadius:15,width:AnchoPantalla * (0.95),height:AltoPantalla * (0.8),justifyContent:'flex-start',alignItems:"center",alignSelf:"center"}}>
          <View style={{backgroundColor:"#111",width:(AnchoPantalla * (0.95)) * (0.95),height: (AltoPantalla * (0.8)) * (0.15),padding: 10,justifyContent:"space-around",alignItems:"center",alignSelf:"center",flexDirection:"row"}}>
            <Icon type="material-community" name="trophy-award" size={40} color={"#ffa801"}/>
            <Text style={{textAlign:"center",fontFamily: "Viga-Regular",color:"#fff",fontSize: 18}}>Descripción de tu logro: </Text>
          </View>
          <View style={{backgroundColor:"#111",width:AnchoPantalla * (0.95),height: (AltoPantalla * (0.8)) * (0.85),justifyContent:"space-around",alignItems:"center",alignSelf:"center",flexDirection:"column"}}>

            <Text style={{textAlign:"center",fontFamily: "AkayaKanadaka-Regular",color:"#fff",fontSize: 17}}>Esto aparecera en la Descripción:{"\n"}{Logro.Descripcion}</Text>
            <TextInput
            textAlign={"center"}
            value={Logro.Descripcion}
             style={{borderWidth:1,borderColor:"#fff",padding:8,margin:5,width:(AnchoPantalla * (0.95)) * (0.8) ,color:"#fff",backgroundColor: "#111",borderRadius:15}}
             //placeholder={"Cuentame..."}
             onChangeText={(Val)=>setLogro({...Logro,Descripcion:filtraDescripcion(Val)})}
             maxLength={60}
             autoFocus={true}
             />
             <View style={{width:(AnchoPantalla * (0.95)),flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
              <TouchableOpacity onPress={props.CerrarModal} style={{backgroundColor:"#f53b57",padding:20,borderRadius:14,justifyContent: 'center',alignItems: 'center',borderBottomWidth: 4,borderBottomColor: "rgba(1,1,1,0.4)",borderBottomRightRadius: 14,borderBottomLeftRadius: 14}}>
                <Text style={{textAlign:"center",fontSize:15,color:"white",fontFamily: "AkayaKanadaka-Regular"}}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>setUbicacion("Foto")} style={{backgroundColor:"#05c46b",padding:20,borderRadius:14,justifyContent: 'center',alignItems: 'center',borderBottomWidth: 4,borderBottomColor: "rgba(1,1,1,0.4)",borderBottomRightRadius: 14,borderBottomLeftRadius: 14}}>
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
            <Icon name='picture' type="ant-design" color='#fff' size={30}/>
            <Text  style={{fontSize: 15,fontFamily: "Viga-Regular",color:"#fff",marginLeft: 20}}>Logro</Text>
            </View>

            <View style={{width: (AnchoPantalla * (0.95)) * (0.6),height: (AltoPantalla * (0.8)) * (0.45),borderRadius: 10,overflow: "hidden",borderWidth: 1,borderColor: "#fff"}}>
              <Image source={
              Logro.src != null ? Logro.src : null//require("../../../assets/media2.jpg")
              }
               style={{flex: 1,height: undefined,width: undefined}} resizeMode="center">
               </Image>
            </View>


              <TouchableOpacity onPress={selectPhoto} style={{backgroundColor:"#3c40c6",padding:10,width: (AnchoPantalla * (0.95)) * (0.4),borderRadius:13,flexDirection:"row",justifyContent:"space-around",alignItems:"center",alignSelf: 'center',margin: 5}}>
                <Icon name='plus' type="font-awesome" color='#ffa801' size={28}/>
                <Text style={{textAlign:"center",fontSize:15,color:"white",marginLeft:10,fontFamily: "Viga-Regular"}}>Nueva</Text>
              </TouchableOpacity>


            <View style={{width:AnchoPantalla * (0.95),flexDirection:"row",justifyContent:"space-around",alignItems:"center",margin:10}}>
              <TouchableOpacity onPress={()=>setUbicacion("Descripcion")} style={{backgroundColor:"#f53b57",padding:15,width: (AnchoPantalla * (0.95)) * (0.40),borderRadius:13}}>
              <Text style={{textAlign:"center",fontSize:15,color:"white",fontFamily: "Viga-Regular"}}>Cancelar</Text>
             </TouchableOpacity>

            <TouchableOpacity
            onPress={
              //subeDatos
              uploadPhoto
              //traeDatos
              //()=>alert(Logro.Descripcion+" "+Logro.src)
            }
              style={{backgroundColor:"#05c46b",padding:15,width: (AnchoPantalla * (0.95)) * (0.40),borderRadius:13}}>
              <Text style={{textAlign:"center",fontSize:15,color:"white",fontFamily: "Viga-Regular"}}>Guardar</Text>
              </TouchableOpacity>
             </View>

          </View>
    );break;
    }
  }



    return (
    <View style={{flex:1}}>
      <ScrollView>
        <View style={Styles.container}>

          <Modal onShow={()=>{
            clearInterval(this.intervalComentarios)
            this.traeComentarios();
          }} style={Styles.modal} animation={"fade"} transparent={true} visible={this.state.modalVisible} onRequestClose={()=>{this.setState({modalImage:null,modalVisible:false})}}>
            <View style={Styles.modal}>




                <View  style={{flex:1, justifyContent:"center",flexDirection:"column"}}>

                <View style={{width: Dimensions.get("window").width,height: (Dimensions.get("window").height) * (0.2), backgroundColor: null}}>

                    <View style={{alignSelf:"center",marginBottom:4,justifyContent:"center",alignItems:"center",flexDirection:"row",width:"100%",backgroundColor: null,height: "60%"}}>
                      <Text style={{color:"#c8d6e5",fontSize:16,textAlign:"center",fontFamily: "AkayaKanadaka-Regular",padding:3,width: "90%"}}>{this.state.descripcion}</Text>
                      <Icon name='close' type="font-awesome" color='white' size={30} onPress={()=>{this.setState({modalImage:null,modalVisible:false})}}/>
                    </View>

                    <View style={{width:"100%",flexDirection:"row",justifyContent:"space-around",alignItems:"center",backgroundColor: null,height: "40%"}}>

                      <View style={{width:"50%",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                          <Text style={{textAlign:"center",fontSize:18,color:"#fff",fontFamily: "Viga-Regular"}}>{this.state.fecha}</Text>
                      </View>

                      <TouchableOpacity onPress={()=>this.setState({modalComentarioVisible:true})} style={{width:"40%",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                         <Icon name='comments' type="font-awesome" color='#00BCD4' size={27}/>
                         <Text style={{color:"#fff",marginLeft:10,fontFamily: "Viga-Regular"}}>Comentar</Text>
                      </TouchableOpacity>
                    </View>
                </View>

                <View style={{width: Dimensions.get("window").width,height: (Dimensions.get("window").height) * (0.8) }}>
                  <ImageViewer imageUrls={[{url: this.state.modalImage}]}
                    renderIndicator={()=>null}
                    maxOverflow={0}
                    saveToLocalByLongPress={false}
                  />
                  </View>
                </View>


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
                              <Text style={{color:"#130f40",fontSize:18}}>Aún no hay comentarios, se el primero.</Text>
                            </View>
                          )}
                      />

                    <View style={{alignSelf:"center",flexDirection:"row",justifyContent:"space-between",alignItems:"center",width:AnchoPantalla,backgroundColor:"#fff"}}>
                        <TextInput
                          textAlign={"center"}
                          value={this.state.comentario}
                           style={{borderWidth:1,borderColor:"#777",width:AnchoPantalla * (0.75),color:"#fff",borderRadius:12,backgroundColor:"#111"}}
                           placeholder={"Comenta"}
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
                                ToastAndroid.show('No puede ser vacio' , ToastAndroid.SHORT);
                                this.setState({comentario:null})
                              }
                            }
                          }

                            containerStyle={{width: AnchoPantalla * (0.25)}}/>
                    </View>

                    </View>
                   </View>
                 </Modal>




          {imagenes}


        </View>

      </ScrollView>
        <TouchableOpacity onPress={()=>this.setState({ModalLogro:true})} style={{position:"absolute",bottom:50,right:60,backgroundColor:"#f0932b",width:60,height:60,borderRadius:15,alignItems:"center",justifyContent:"center",shadowOpacity:0.9,elevation:6}}>
             <Icon type="material-community" name="trophy" size={24} color={"#fff"}/>
        </TouchableOpacity>

        <View style={{width:"100%",height:10}}/>


        <Modal visible={this.state.ModalLogro} transparent={true}
        onRequestClose={()=>{
                  this.setState({ModalLogro:false})
        }}>
          <View style={{backgroundColor:"rgba(1,1,1,.6)",flex:1,justifyContent:"center",alignItems:"center"}}>
             <NuevoLogro CerrarModal={()=>this.setState({ModalLogro:false})}/>
          </View>
        </Modal>
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

    backgroundColor:"rgba(0,0,0,1)"
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
