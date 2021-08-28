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
import {establecerMatriculaDelPropietarioDeLaMochila} from '../../../store/actions.js';

const AnchoPantalla = Dimensions.get("window").width;
const AltoPantalla = Dimensions.get("window").height;


export default function CredencialVisitante(props){
	const dispatch = useDispatch();

	const datosDeCredencial = useSelector(store => ({
		//store.datosDeCredencial
		Id: store.datosDeCredencial.matricula,
		Avatar: store.datosDeCredencial.rutaDeFoto,
		Nombre: {
			Nombres: store.datosDeCredencial.nombreCompleto.nombres,
			ApellidoPaterno: store.datosDeCredencial.nombreCompleto.apellidoPaterno,
			ApellidoMaterno: store.datosDeCredencial.nombreCompleto.apellidoMaterno
		},
		Especialidad: store.datosDeCredencial.especialidad,
		Frase: store.datosDeCredencial.frase,
		Hobbies: store.datosDeCredencial.hobbies
	}));

  const {Evento,Cierra} = props;




    return (
        <SafeAreaView style={styles.container}>

            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={styles.titleBar}>
                    <Icon type="material" name="arrow-back" size={24} color="#111" onPress={Evento}/>
                </View>

                <View style={{ alignSelf: "center"}}>
                    <View style={styles.profileImage}>
                        <Image source={{uri:datosDeCredencial.Avatar}} style={styles.image} resizeMode="center"></Image>
                    </View>
                </View>

{
  //Datos del usuario
}
                <View style={{width: AnchoPantalla * (0.9),flexDirection:"column",justifyContent:"center",alignItems:"center",marginTop:15,marginBottom:15}}>


                      <View style={{width:(AnchoPantalla * (0.9))*(0.8),justifyContent:"center",alignItems:"center",alignContent:"center"}}>
                           <Text style={{fontFamily: "AkayaKanadaka-Regular",color: "#111",fontWeight: "200", fontSize: 21,textAlign:"center"}}>{datosDeCredencial.Nombre.Nombres + " " + datosDeCredencial.Nombre.ApellidoPaterno + " " + datosDeCredencial.Nombre.ApellidoMaterno}</Text>
                      </View>


                      <View style={{width:(AnchoPantalla * (0.9))*(0.8),justifyContent:"center",alignItems:"center",alignContent:"center"}}>
                           <Text style={{fontFamily: "AkayaKanadaka-Regular",fontWeight: "200",color: "#0652DD", fontSize: 18 ,textAlign:"center"}}>{datosDeCredencial.Especialidad}</Text>
                      </View>


                </View>


{//Detalles de usuario
}
                <View style={{ alignItems: "center",width: AnchoPantalla * (0.9),backgroundColor: null,paddingTop: 10,paddingBottom: 30}}>
                  <Text style={{color:"#8c7ae6",fontSize:14,paddingTop:10,paddingBottom:10,fontFamily: "Viga-Regular"}}>Sobre mí:</Text>

                    <View style={{width: AnchoPantalla * (0.9),justifyContent: 'center',alignItems: 'center'}}>
                      <View style={{width: (AnchoPantalla * (0.9)) * (0.5),backgroundColor: null,flexDirection: 'row',alignSelf: 'center',justifyContent: 'center',alignItems: 'center'}}>
                        <Icon name='cloud' type="font-awesome" color='#3498db'/>
                        <Text style={{marginLeft: 10,backgroundColor: null,textAlign: 'center',fontFamily: "Viga-Regular"}}>Frase:</Text>
                      </View>
                        <View style={{width: (AnchoPantalla * (0.9)) * (0.8),backgroundColor: null}}>
                            <Text style={{ fontSize: 16,color: "#0652DD",textAlign:"center",fontFamily: "AkayaKanadaka-Regular"}}>
                                {datosDeCredencial.Frase}
                            </Text>
                        </View>
                    </View>

                    <View style={{width: AnchoPantalla * (0.9),justifyContent: 'center',alignItems: 'center'}}>
                      <View  style={{width: (AnchoPantalla * (0.9)) * (0.5),backgroundColor: null,flexDirection: 'row',alignSelf: 'center',justifyContent: 'center',alignItems: 'center'}}>
                        <Icon name='favorite' type='material' color='#e74c3c'/>
                        <Text  style={{marginLeft: 10,backgroundColor: null,textAlign: 'center',fontFamily: "Viga-Regular"}}>Hobbies:</Text>
                      </View>
                        <View style={{width: (AnchoPantalla * (0.9)) * (0.8),backgroundColor: null}}>
                            <Text style={{ fontSize: 16,color: "#e74c3c",textAlign:"center",fontFamily: "AkayaKanadaka-Regular"}}>
                              {datosDeCredencial.Hobbies}
                            </Text>
                        </View>
                    </View>


                  </View>

                <TouchableOpacity onPress={() => {
						//dispatch(establecerMatriculaDelPropietarioDeLaMochila(datosDeCredencial.Id));
						Cierra();
					}} style={{alignSelf:"center",width:(AnchoPantalla * (0.9)) * (0.4),padding:20,borderRadius:10,backgroundColor:"rgb(66,66,132)",marginTop:10,justifyContent:"center"}}>
                  <Text style={{textAlign:"center",color:"white",fontFamily: "Viga-Regular",fontSize: 16}}>Mochila</Text>
                </TouchableOpacity>


            </ScrollView>
        </SafeAreaView>
    );


}




const styles = StyleSheet.create({
    container: {
        width: AnchoPantalla * (0.9),
        height: AltoPantalla * (0.9),
        backgroundColor: "rgb(250, 250, 250)",
        borderRadius:20,
        borderWidth:1
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
      width: (AnchoPantalla * (0.9)) * (0.75),
      height: (AltoPantalla * (0.9)) * (0.26),
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
/*

                <View style={styles.statsContainer}>

                        <TouchableOpacity  style={[styles.statsBox, { borderColor: "#DFD8C8", borderRightWidth: 1 }]}>
                          <Text style={[styles.text, { fontSize: 24 }]}>45,844</Text>
                          <Text style={[styles.text, styles.subText]}>Me siguen</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.statsBox}>
                          <Text style={[styles.text, { fontSize: 24 }]}>302</Text>
                          <Text style={[styles.text, styles.subText]}>Estas Siguiendo</Text>
                        </TouchableOpacity>
                </View>

                ///////////////////////////////////////////////
                //Matricula
                <View style={[styles.recentItem,{alignItems:"center",justifyContent:"center",alignSelf:"center"}]}>
                  <View>
                    <Icon type='font-awesome-5' name='id-card-alt' color='#f1c40f'/>
                    <Text>Matricula:</Text>
                  </View>
                        <Text style={[styles.text, { color: "#41444B", fontWeight: "300",paddingLeft:30,textAlign:"center" }]}>
            {datosDeCredencial.Id}
                        </Text>
                </View>

*/
