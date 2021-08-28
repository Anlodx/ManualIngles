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
  Dimensions
} from 'react-native';

import { Icon } from 'react-native-elements';
import AQuienesSigo from "./aQuienesSigues";
import QuienesMeSiguen from './quienesMeSiguen';

import ImageViewer from 'react-native-image-zoom-viewer';

const App = (props) => {
	return(
		<CredencialPropietario data={props.data}/>
    );
}
export default App;

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//codigo de configuracion de ventanas

const AnchoPantalla = Dimensions.get("window").width;
const AltoPantalla = Dimensions.get("window").height;


import Config from "./botonCambiarPerfil";


function abreAQuienesSigo(){
	return (<AQuienesSigo/>);
}

import {useSelector, useDispatch} from 'react-redux';


//////////////////////////////////////////////////////////////////////////////////////////////////////////
function CredencialPropietario(props) {

    const datosDeCredencial = useSelector(store => store.datosDeCredencial);

    useEffect(()=>{
      console.log("hola mundo desde credencialPropietario => ",datosDeCredencial)
    },[]);

    const [modalVisible,setModalVisible] = useState(false);
    const [Ajuste, setAjuste] = useState(null);

	const [datosEspecificosS, modificarDatosEspecificosS] = useState({
		modalAQuienesSigo : false,
		modalQuienesMeSiguen : false
	});

	//props.data

  const [DatosCredencialPropietario, setDatosCredencialPropietario] = useState({
    Id: props.data.matricula,
    Avatar: props.data.rutaDeFoto,
    Nombre:{
      Nombres: props.data.nombreCompleto.nombres,
      ApellidoPaterno: props.data.nombreCompleto.apellidoPaterno,
      ApellidoMaterno: props.data.nombreCompleto.apellidoMaterno
    },
    Especialidad: props.data.especialidad,
    Usuario: props.data.usuario,
    Constraseña: props.data.contrasenia,
    Frase: props.data.frase,
    Hobbies: props.data.hobbies
  });
  /*
	matricula : data.matricula,
		nombreCompleto : data.nombreCompleto,

		usuario : data.usuario,
		contrasenia : data.contrasenia,
		especialidad : data.especialidad,
		fechaDeNacimiento : data.fechaDeNacimiento,
		genero : data.genero,
		frase : data.frase,

		rutaDeFoto : data.rutaDeFoto,
		hobbies : data.hobbies
  */

  const ComponenteDeImagen = (props)=> {
  const [ModalVisible, setModalVisible] = useState(false);

  const estilos = StyleSheet.create({
    contenedorPrincipal : {
        width: 200,
        height: 200,
        borderRadius: 100,
        overflow: "hidden"

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
              backgroundColor: "#fff"

          }} resizeMode="contain"/>
        </TouchableWithoutFeedback>
      </View>

      <Modal style={{flex:1}} visible={ModalVisible} onRequestClose={()=>setModalVisible(false)} transparent={false} animationType={"fade"}>
        <View  style={{flex:1, justifyContent:"center",flexDirection:"column"}}>

          <ImageViewer imageUrls={[{url: props.urlDeImagen}]}
            renderIndicator={()=>null}
            renderHeader={()=>(
              <View style={{width:"100%",height:50,justifyContent:"flex-start",flexDirection:"row",alignItems:"center",alignSelf:"center"}}>
                <Icon type="material" name="arrow-back" size={28} color="#52575D" onPress={()=>setModalVisible(false)}/>
              </View>
            )}
          />
        </View>
      </Modal>
    </View>
  </>
    );
  }


    function p(arg){
      setAjuste(arg);
      setModalVisible(true);
    }

    return (
        <View style={styles.container}>


{
  ////////////////////////////////////////////////////////////////
  //modal de ajustes
}

          <Modal   animationType="slide" transparent={true} visible={modalVisible}>
            <View style={{width: AnchoPantalla,height: AltoPantalla,justifyContent:"center",alignItems:"center",alignSelf:"center",backgroundColor:"rgba(0,0,0,0.7)"}}>
            <Config

				matricula={datosDeCredencial.matricula}//{DatosCredencialPropietario.Id}
				foto={datosDeCredencial.rutaDeFoto}//{DatosCredencialPropietario.Avatar}
				nombre={datosDeCredencial.nombreCompleto}//{DatosCredencialPropietario.Nombre}
				especialidad={datosDeCredencial.especialidad}//{DatosCredencialPropietario.Especialidad}
				usuario={datosDeCredencial.usuario}//{DatosCredencialPropietario.Usuario}
				contraseña={datosDeCredencial.contrasenia}//{DatosCredencialPropietario.Constraseña}
				frase={datosDeCredencial.frase}//{DatosCredencialPropietario.Frase}
				hobbies={datosDeCredencial.hobbies}//{DatosCredencialPropietario.Hobbies}

				cerrar={()=>setModalVisible(false)}
				Eleccion={Ajuste}
              />

            </View>
          </Modal>

{
///////////////////////////////////////////////////////////////////////
//modal de contenido
}

            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={styles.titleBar}>

                    <Icon type="font-awesome-5" name="question-circle" size={24} color="#52575D" onPress={ ()=>p("QuienesSomos") }/>
                </View>

                <View style={{ alignSelf: "center" }}>


                        <ComponenteDeImagen urlDeImagen={datosDeCredencial.rutaDeFoto}/>

                    <View style={styles.add}>
                        <Icon type="font-awesome-5" onPress={()=>p("Foto")} name="pencil-alt" size={35} color="#FFC107" style={{ marginTop: 6, marginLeft: 2 }}/>
                    </View>
                </View>
{
  //Datos del usuario
}
                <View style={{width:AnchoPantalla,flexDirection:"column",justifyContent:"center",alignItems:"center",marginTop:15,marginBottom:15,backgroundColor: null}}>
                      <View style={{width:AnchoPantalla * (0.9),flexWrap:"wrap",justifyContent:"center",alignItems:"center",alignContent:"center"}}>
                          <Icon type="font-awesome-5" onPress={()=>{p("Nombre");}} name="pencil-alt" size={28} color="#30336b" containerStyle={{paddingLeft:10}}/>
                           <Text style={[styles.text, {borderWidth: 2,borderColor: "#30336b",borderRadius: 10,padding: 5,marginTop: 10,marginBottom: 10,fontWeight: "200", fontSize: 18,textAlign:"center",color:"#30336b",fontFamily: "Viga-Regular"}]}>{datosDeCredencial.nombreCompleto.nombres + " " + datosDeCredencial.nombreCompleto.apellidoPaterno + " " + datosDeCredencial.nombreCompleto.apellidoMaterno}</Text>

                      </View>

                      <View style={{width:AnchoPantalla * (0.9),flexWrap:"wrap",justifyContent:"center",alignItems:"center",alignContent:"center"}}>
                          <Icon type="font-awesome-5" onPress={()=>{p("Especialidad");}} name="pencil-alt" size={28} color="#AD1457" containerStyle={{paddingLeft:10}}/>
                           <Text style={[styles.text, {borderWidth: 2,borderColor: "#AD1457",borderRadius: 10,padding: 5,marginTop: 10,marginBottom: 10, color: "#AD1457", fontSize: 15 ,textAlign:"center",fontFamily: "Viga-Regular"}]}>{datosDeCredencial.especialidad}</Text>

                      </View>
                </View>

                <View style={{ flexDirection: "row", alignSelf: "center", marginTop: 32,width: AnchoPantalla,backgroundColor:null}}>

					  <TouchableOpacity  style={[styles.statsBox, { borderColor: "#DFD8C8", borderRightWidth: 1 }]} onPress={() => {modificarDatosEspecificosS({...datosEspecificosS , modalQuienesMeSiguen : true});}}>
                          <Text style={[styles.text, { fontSize: 18,textAlign: 'center'}]}>Me siguen</Text>
                          <Text style={[styles.text, styles.subText,{textAlign: 'center'}]}>reciben tu conocimiento</Text>
                        </TouchableOpacity>

						<>
						{(datosEspecificosS.modalQuienesMeSiguen) ?
							<QuienesMeSiguen matricula={datosDeCredencial.matricula} cerrarModal={() => {modificarDatosEspecificosS({...datosEspecificosS , modalQuienesMeSiguen : false});}}/>
						:
							null
						}
						</>


                        <TouchableOpacity style={styles.statsBox} onPress={()=>{modificarDatosEspecificosS({...datosEspecificosS, modalAQuienesSigo : !(datosEspecificosS.modalAQuienesSigo)});}}>
                          <Text style={[styles.text, { fontSize: 18,textAlign: 'center'}]}>Estas Siguiendo</Text>
                          <Text style={[styles.text, styles.subText,{textAlign: 'center'}]}>recibes su conocimiento</Text>
                        </TouchableOpacity>

						<>
						{(datosEspecificosS.modalAQuienesSigo) ?
							<AQuienesSigo matricula={datosDeCredencial.matricula} cerrarModal={() => {modificarDatosEspecificosS({...datosEspecificosS , modalAQuienesSigo : false});}}/>
						:
							null
						}
						</>
                </View>

{//Cuenta de usuario
}

                <View style={{ alignItems: "center",backgroundColor: null}}>
                  <Text style={{color:"#341f97",fontSize:15,marginTop:10,marginBottom:10,textAlign: 'center',fontFamily: "AnticSlab-Regular"}}>Cuenta(Esta información permanece privada):</Text>

                    <View style={{ flexDirection: 'column',alignItems: "center",justifyContent: 'center',marginBottom: 16,backgroundColor: null,width: AnchoPantalla}}>
                      <View style={{ width: AnchoPantalla, flexDirection:  'row',alignSelf: 'center',justifyContent: 'center',alignItems: 'center',marginBottom: 5}}>
                        <Icon name='user-circle' type="font-awesome" color='#1abc9c' size={30}/>
                        <Text style={{marginLeft: 10, fontSize: 15,fontFamily: "Viga-Regular"}}>Usuario:</Text>
                      </View>
                      <View style={{ width: AnchoPantalla, flexDirection:  'column',alignSelf: 'center',justifyContent: 'center',alignItems: 'center'}}>
                        <Icon type="font-awesome-5" onPress={()=>p("Usuario")} name="pencil-alt" size={30} color="#1abc9c"/>
                        <Text style={{ width: AnchoPantalla * (0.8),textAlign:"center",color:"#1abc9c",padding:6,marginTop: 10,marginBottom: 5,borderWidth: 2,borderColor:"#1abc9c",borderRadius:10,fontSize:17}}>{datosDeCredencial.usuario}</Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: 'column',alignItems: "center",justifyContent: 'center',marginBottom: 16,backgroundColor: null,width: AnchoPantalla}}>
                      <View  style={{ width: AnchoPantalla, flexDirection:  'row',alignSelf: 'center',justifyContent: 'center',alignItems: 'center',marginBottom: 5}}>
                        <Icon name='locked' type='fontisto' color='#222f3e'/>
                        <Text style={{marginLeft: 10, fontSize: 15,fontFamily: "Viga-Regular"}}>contraseña:</Text>
                      </View>
                        <View style={{ width: AnchoPantalla, flexDirection:  'column',alignSelf: 'center',justifyContent: 'center',alignItems: 'center'}}>
                          <Icon type="font-awesome-5" onPress={()=>p("Contraseña")} name="pencil-alt" size={35} color="#222f3e" />
                          <Text style={{ width: AnchoPantalla * (0.8),textAlign:"center",color:"#222f3e",padding:6,marginTop: 10,marginBottom: 5,borderWidth: 2,borderColor:"#222f3e",borderRadius:10,fontSize:17}}>********</Text>
                        </View>
                      </View>
                </View>


{//Detalles de usuario
}
                <View style={{ alignItems: "center",backgroundColor: null}}>
                  <Text style={{color:"#341f97",fontSize:15,fontFamily: "Viga-Regular",marginTop:10,marginBottom:10,fontFamily: "AnticSlab-Regular"}}>Sobre mí:</Text>

                    <View style={{ flexDirection: 'column',alignItems: "center",justifyContent: 'center',marginBottom: 16,backgroundColor: null,width: AnchoPantalla}}>
                      <View style={{ width: AnchoPantalla, flexDirection:  'row',alignSelf: 'center',justifyContent: 'center',alignItems: 'center',marginBottom: 5}}>
                        <Icon name='cloud' type="font-awesome" color='#3498db'/>
                        <Text style={{marginLeft: 10, fontSize: 15,fontFamily: "Viga-Regular"}}>Frase:</Text>
                      </View>
                        <View  style={{ width: AnchoPantalla, flexDirection:  'column',alignSelf: 'center',justifyContent: 'center',alignItems: 'center'}}>
                            <Icon type="font-awesome-5" onPress={()=>p("Frase")} name="pencil-alt" size={35} color="#3498db"/>
                            <Text style={{ width: AnchoPantalla * (0.8),textAlign:"center",color:"#3498db",padding:6,marginTop: 10,marginBottom: 5,borderWidth: 2,borderColor:"#3498db",borderRadius:10,fontSize:17}}>
                                {datosDeCredencial.frase}
                            </Text>
                        </View>

                    </View>

                    <View style={{ flexDirection: 'column',alignItems: "center",justifyContent: 'center',marginBottom: 16,backgroundColor: null,width: AnchoPantalla}}>
                      <View style={{ width: AnchoPantalla, flexDirection:  'row',alignSelf: 'center',justifyContent: 'center',alignItems: 'center',marginBottom: 5}}>
                        <Icon name='favorite' type='material' color='#e74c3c'/>
                        <Text style={{marginLeft: 10, fontSize: 15,fontFamily: "Viga-Regular"}}>Hobbies:</Text>
                      </View>
                        <View  style={{ width: AnchoPantalla, flexDirection:  'column',alignSelf: 'center',justifyContent: 'center',alignItems: 'center'}}>
                          <Icon type="font-awesome-5" onPress={()=>p("Hobbies")} name="pencil-alt" size={35} color="#e74c3c"/>
                            <Text style={{ width: AnchoPantalla * (0.8),textAlign:"center",color:"#e74c3c",padding:6,marginTop: 10,marginBottom: 5,borderWidth: 2,borderColor:"#e74c3c",borderRadius:10,fontSize:17}}>
                               {datosDeCredencial.hobbies}
                            </Text>
                        </View>

                    </View>

                </View>


            </ScrollView>
      </View>
    );
}



const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        alignSelf:"center"
    },
    text: {
        fontFamily: "HelveticaNeue",
        color: "#52575D"
    },
    image: {
        flex: 1,
        height: undefined,
        width: undefined
    },
    titleBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 24,
        marginHorizontal: 16
    },
    subText: {
        fontSize: 12,
        color: "#AEB5BC",
        textTransform: "uppercase",
        fontWeight: "500"
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        overflow: "hidden"
    },
    add: {
        backgroundColor: "transparent",
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center"
    },
    infoContainer: {
        alignSelf: "center",
        alignItems: "center",
        justifyContent:"center",
        marginTop: 16
    },
    statsContainer: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: 32
    },
    statsBox: {
        alignItems: "center",
        flex: 1
    },
    mediaImageContainer: {
        width: 180,
        height: 200,
        borderRadius: 12,
        overflow: "hidden",
        marginHorizontal: 10
    },
    mediaCount: {

        flexDirection:"row",
        alignItems: "center",
        width:"50%",
        justifyContent: "space-around",
        padding:10,
        borderRadius: 12,
    },
    recent: {
        marginLeft: 78,
        marginTop: 32,
        marginBottom: 6,
        fontSize: 10
    },
    recentItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 16
    },
    activityIndicator: {
        backgroundColor: "#8e44ad",
        padding: 4,
        height: 12,
        width: 12,
        borderRadius: 6,
        marginTop: 3,
        marginRight: 20
    }
});








/*
const o= () => {
                <View style={{ marginTop: 32 }}>
                    <View style={styles.mediaCount}>
                        <Text style={[styles.text, { fontSize: 15, color: "black", textTransform: "uppercase" }]}>logros:"Una foto dice mas que mil palabras":</Text>
                        <Icon type="antdesign" name="pluscircleo" size={30} color="lightblue" onPress={()=>alert("Hola mundo")}/>
                    </View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={styles.mediaImageContainer}>
                            <Image source={require("./assets/media1.jpg")} style={styles.image} resizeMode="cover"></Image>
                        </View>
                        <View style={styles.mediaImageContainer}>
                            <Image source={require("./assets/media2.jpg")} style={styles.image} resizeMode="cover"></Image>
                        </View>
                        <View style={styles.mediaImageContainer}>
                            <Image source={require("./assets/media3.jpg")} style={styles.image} resizeMode="cover"></Image>
                        </View>
                    </ScrollView>
                </View>
}



/// matricula

                    <View style={[styles.recentItem,{alignItems:"center",justifyContent:"center",alignSelf:"center"}]}>
                      <View>
                        <Icon type='font-awesome-5' name='id-card-alt' color='#6c5ce7'/>
                        <Text>Matricula:</Text>
                      </View>
                            <Text style={[styles.text, { color: "#41444B", fontWeight: "300",paddingLeft:30,textAlign:"center" }]}>
                               {datosDeCredencial.matricula}
                            </Text>
                    </View>
*/
