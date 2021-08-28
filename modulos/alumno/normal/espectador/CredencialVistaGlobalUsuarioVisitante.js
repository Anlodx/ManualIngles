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
  Dimensions
} from 'react-native';

import { Icon } from 'react-native-elements';

import {useSelector, useDispatch} from 'react-redux';
import ImageViewer from 'react-native-image-zoom-viewer';

const AnchoPantalla = Dimensions.get("window").width;
const AltoPantalla = Dimensions.get("window").height;


export default function CredencialVisitante(props){


    const ComponenteDeImagen = (props)=> {
    const [ModalVisible, setModalVisible] = useState(false);

    const estilos = StyleSheet.create({
      contenedorPrincipal : {
          width: 200,
          height: 200,
          borderRadius: 100,
          overflow: "hidden",
          alignSelf:"center"

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
                backgroundColor: "#ECEFF1"

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



  const datosDeCredencialEspectado = useSelector(store => store.datosDeCredencialEspectado);


    return (
        <SafeAreaView style={styles.container}>

            <ScrollView showsVerticalScrollIndicator={false}>

                

               <ComponenteDeImagen urlDeImagen={datosDeCredencialEspectado.rutaDeFoto}/>

                
                

{
  //Datos del usuario
}
                
                <View style={{width: AnchoPantalla,flexDirection:"column",justifyContent:"center",alignItems:"center",marginTop:15,marginBottom:15}}>


                      <View style={{width:(AnchoPantalla)*(0.8),justifyContent:"center",alignItems:"center",alignContent:"center"}}>
                           <Text style={{fontFamily: "AkayaKanadaka-Regular",color: "#111",fontWeight: "200", fontSize: 21,textAlign:"center"}}>{datosDeCredencialEspectado.nombreCompleto.nombres + " " +datosDeCredencialEspectado.nombreCompleto.apellidoPaterno + " " + datosDeCredencialEspectado.nombreCompleto.apellidoMaterno}</Text>
                      </View>


                      <View style={{width:(AnchoPantalla)*(0.8),justifyContent:"center",alignItems:"center",alignContent:"center"}}>
                           <Text style={{fontFamily: "AkayaKanadaka-Regular",fontWeight: "200",color: "#0652DD", fontSize: 18 ,textAlign:"center"}}>{datosDeCredencialEspectado.especialidad}</Text>
                      </View>


                </View>


{//Detalles de usuario xd
}
                 
                <View style={{ alignItems: "center",width: AnchoPantalla,backgroundColor: null,paddingTop: 10,paddingBottom: 30}}>
                  <Text style={{color:"#8c7ae6",fontSize:14,paddingTop:10,paddingBottom:10,fontFamily: "Viga-Regular"}}>Sobre mí:</Text>

                    <View style={{width: AnchoPantalla,justifyContent: 'center',alignItems: 'center'}}>
                      <View style={{width: (AnchoPantalla) * (0.5),backgroundColor: null,flexDirection: 'row',alignSelf: 'center',justifyContent: 'center',alignItems: 'center'}}>
                        <Icon name='cloud' type="font-awesome" color='#3498db'/>
                        <Text style={{marginLeft: 10,backgroundColor: null,textAlign: 'center',fontFamily: "Viga-Regular"}}>Frase:</Text>
                      </View>
                        <View style={{width: (AnchoPantalla) * (0.8),backgroundColor: null}}>
                            <Text style={{ fontSize: 16,color: "#0652DD",textAlign:"center",fontFamily: "AkayaKanadaka-Regular"}}>
                            { datosDeCredencialEspectado.frase}
                            </Text>
                        </View>
                    </View>

                    <View style={{width: AnchoPantalla,justifyContent: 'center',alignItems: 'center'}}>
                      <View  style={{width: (AnchoPantalla) * (0.5),backgroundColor: null,flexDirection: 'row',alignSelf: 'center',justifyContent: 'center',alignItems: 'center'}}>
                        <Icon name='favorite' type='material' color='#e74c3c'/>
                        <Text  style={{marginLeft: 10,backgroundColor: null,textAlign: 'center',fontFamily: "Viga-Regular"}}>Hobbies:</Text>
                      </View>
                        <View style={{width: (AnchoPantalla) * (0.8),backgroundColor: null}}>
                            <Text style={{ fontSize: 16,color: "#e74c3c",textAlign:"center",fontFamily: "AkayaKanadaka-Regular"}}>
                            {datosDeCredencialEspectado.hobbies}
                            </Text>
                        </View>
                    </View>


                  </View>

            </ScrollView>
        </SafeAreaView>
    );


}






const styles = StyleSheet.create({
  container: {
      flex:1,
      backgroundColor: "#fff",
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
  textAlign:"center",
      fontWeight: "500"
  },
  profileImage: {
    width: 200,
    height: 200,
      borderRadius:100,
      overflow: "hidden"
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
  recentItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 16
  }
});