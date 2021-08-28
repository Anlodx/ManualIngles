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
  TouchableNativeFeedback,
  FlatList,
  Modal,
  Image,
  Switch,
  TextInput,
  Dimensions,
  ActivityIndicator
} from 'react-native';

import { Icon,CheckBox } from 'react-native-elements';
import { ListItem } from 'react-native-elements';
import { Slider } from 'react-native-elements';

import { Button,SearchBar,ButtonGroup, Avatar as IconoDeAvatar } from 'react-native-elements';

const AltoPantalla = Dimensions.get("window").height;
const AnchoPantalla = Dimensions.get("window").width;


import ImageViewer from 'react-native-image-zoom-viewer';


import * as ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob'
import {useSelector, useDispatch} from 'react-redux';
import {establecerDatosDeCredencialDesdeIniciarSesion} from '../../store/actions.js';

import AsyncStorage from '@react-native-async-storage/async-storage';


//ASYNC ESTA CORRECTO
//CUANDO LO MODIFIQUE, VERIFICA QUE NO ESTE DAÑANDO NADA

//AL PARECER, TENEMOS QUE MODIFICAR TODO ESTE ARCHIVO. RAZONES:
//
// 1.- YA NO USAREMOS LA VARIABLE EN datos LLAMADA Esc : 'CECyTE Escobedo'
//ESTO LO HARE EN UN FUTURO

const anchoNativoInicial =  Math.round(Dimensions.get('window').width);
const alturaDeVistaInicial = Math.round(Dimensions.get('window').height) - Math.round(StatusBar.currentHeight);


const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('@UserToken:key', jsonValue)
  } catch (e) {
    // saving error
    console.log("lo siento hubo un error al establecer => ",e)
  }
}

const pantallaFaltaMasInformacion = ({navigation,route}) => {

  const dispatch = useDispatch();

    const datos = useRef({
        Matricula: route.params.matricula,
        Especialidad: "",
        FechaDeNacimiento: "",
        Genero: "",
        Frase: "",
        Hobbies: "",
        ObjetoFile: null,
        ComprobacionDeFoto: false
    });

    const InputTexto = (props) => {
		//xd
		return (
      <TextInput
      style={{
				width: (Dimensions.get('window').width) * (0.9),
				borderRadius:5,
				backgroundColor:'#dfe6e9',
				color:"#111",
				fontFamily: "Viga-Regular",
				borderWidth: 1,
				borderColor: "#111",
				height:40,
				alignSelf: 'center',
				textAlign: 'center',
				fontSize: 14
			}}
      placeholderTextColor={"#576574"} placeholder={props.invisible} onChangeText={(e) => {
      
     
      if(props.tipo === "Especialidad"){
        // modificarDatos({...datos,ApP : e});
        datos.current = {...datos.current, Especialidad : e};
      }
      else if(props.tipo === "Genero"){
        // modificarDatos({...datos,ApM : e});
		datos.current = {...datos.current, Genero : e};
      }
      else if(props.tipo === "Frase"){
        datos.current = {...datos.current, Frase : e};
      }
      else if(props.tipo === "Hobbies"){
        datos.current = {...datos.current, Hobbies : e};
      }

      }} />
		);

	}


  const [modalCargando ,setModalCargando] = useState(false);
        
  const ModalCargando = () => {
    return (
      <Modal visible={true} transparent={true}>
        <View style={{width : '100%' , height : '100%', justifyContent : 'center', alignItems : 'center', backgroundColor : 'rgba(0,0,0,.5)'}}>
          <View style={{width : '80%' , height : '30%' , flexDirection : 'column' , alignItems : 'center', justifyContent : 'space-around', backgroundColor : 'lavender', borderRadius : 10}}>
            <ActivityIndicator size={'large'} color={'black'}/>
            <Text>{'Cargando...'}</Text>
          </View>
        </View>
      </Modal>
    );
  }
    
    const [fotoNueva, setFotoNueva] = useState({
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
            //alert('User cancelled image picker');
            //datos.current = {...datos.current,ComprobacionDeFoto:false};
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
            //datos.current = {...datos.current,ComprobacionDeFoto:false};
          } else {
            const source = { uri: response.uri }
            setFotoNueva({...fotoNueva,src: source.uri,data:response.base64,type:response.type,name:response.fileName})
            datos.current = {...datos.current,ComprobacionDeFoto:true};


          }
        });
        }


        const subirInfo = () => {
            //console.log(response)
            setModalCargando(true);
          RNFetchBlob.fetch('POST', 'http://backpack.sytes.net/servidorApp/php/comprobacionFaltaMAsInformacion.php', {
            Authorization : "Bearer access-token",
            otherHeader : "foo",
            'Content-Type' : 'multipart/form-data',
          },
          [
            { name : 'fotoNueva', filename : fotoNueva.name, type:fotoNueva.type, data: fotoNueva.data},
           { name : 'indice', data:JSON.stringify(datos.current)}
          ]).then((response) => response.text())
               .then((responseText)=>{
                 console.log(responseText)

                 if(responseText == "Error"){
                  console.log("Hubo un Error");
                 }else{
                   let objeto = JSON.parse(responseText);

                  dispatch(establecerDatosDeCredencialDesdeIniciarSesion(objeto));

                  storeData(objeto);
                  setModalCargando(false);
                  navigation.navigate("Todo Lo Relacionado Para Alumno Normal");

                 }

               }).catch((err) => {
            console.log(err)
            setModalCargando(false);
          })
          //setModalCargando(false);
        }

    return(
        <View style={{width: "100%", height: "100%"}}>
            <ScrollView contentContainerStyle={{ alignItems: "center" }}>

                <View style={{width: AnchoPantalla * (0.8),justifyContent:"space-around",alignItems:"center",alignSelf:"center",flexDirection:"row",margin:10}}>
                  <Icon name='photo' type="font-awesome" color='#222f3e' size={25}/>
                  <Text style={{color:"#111",fontSize:18,fontFamily: "Viga-Regular"}}>Foto del Salón</Text>
                </View>

                <Text></Text>
                

                <ComponenteDeImagen urlDeImagen={fotoNueva.src != null ? fotoNueva.src : null}/>

                
                <View style={{overflow: "hidden", width: anchoNativoInicial * .5, height: ((alturaDeVistaInicial * .9) * .9) * .15, backgroundColor: "#576574",borderWidth:2,borderRadius:5,borderColor:"#222f3e",margin:10}}>
                    <TouchableNativeFeedback onPress={selectPhoto}>
                        <View style={{width: "100%", height: "100%", alignItems: "center", justifyContent: "center"}}>
                        <Text style={{fontFamily: "Viga-Regular",fontSize: 14,textAlign:"center", color: "#fff"}}>{"Elegir foto de perfil"}</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>


                <InputTexto invisible={'Ingresa tu especialidad'} tipo={'Especialidad'} />
                <Text></Text>



                <InputTexto invisible={'Ingresa tu frase'} tipo={'Frase'} />
                <Text></Text>

                <InputTexto invisible={'Ingresa tus hobbies'} tipo={'Hobbies'} />
                <Text></Text>

                
                <View style={{overflow: "hidden", width: anchoNativoInicial * .5, height: ((alturaDeVistaInicial * .9) * .9) * .15, backgroundColor: "#576574",borderWidth:2,borderRadius:5,borderColor:"#222f3e",margin:10}}>
                    <TouchableNativeFeedback onPress={subirInfo}>
                        <View style={{width: "100%", height: "100%", alignItems: "center", justifyContent: "center"}}>
                        <Text style={{fontFamily: "Viga-Regular",fontSize: 14,textAlign:"center", color: "#fff"}}>{"Subir Información"}</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>

            </ScrollView>
            <>
            {
              (modalCargando) ? 
              <ModalCargando/>
              : 
              null
            } 
            </>
        </View>
    );
};


const ComponenteDeImagen = (props)=> {
    const [ModalVisible, setModalVisible] = useState(false);
    
    const estilos = StyleSheet.create({
      contenedorPrincipal : {
          width: 200,
          height: 200,
          borderRadius: 100,
          overflow: "hidden",
          borderWidth:2//respaldo xd
    
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
                backgroundColor: null
    
            }} resizeMode="contain"/>
          </TouchableWithoutFeedback>
        </View>
    
        <Modal style={{flex:1}} visible={ModalVisible} onRequestClose={()=>setModalVisible(false)} transparent={false} animationType={"fade"}>
          <View  style={{flex:1, justifyContent:"center",flexDirection:"column"}}>
    
            <ImageViewer imageUrls={[{url: props.urlDeImagen}]}
              renderIndicator={()=>null}
              renderHeader={()=>(
                <View style={{width:"90%",height:50,justifyContent:"flex-start",flexDirection:"row",alignItems:"center",alignSelf:"center"}}>
                  <Icon type="material" name="arrow-back" size={24} color="#52575D" onPress={()=>setModalVisible(false)}/>
                </View>
              )}
            />
          </View>
        </Modal>
      </View>
    </>
      );
    }
    

export default pantallaFaltaMasInformacion;
