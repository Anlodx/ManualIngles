import React,  {useRef,useState,useEffect} from 'react';
import {TouchableOpacity,ActivityIndicator,TouchableWithoutFeedback,TouchableNativeFeedback,TextInput, Image,Text, View, StyleSheet, Alert, SafeAreaView, ScrollView, Picker, StatusBar, Button, Dimensions , Modal} from 'react-native';
import {Icon} from 'react-native-elements';

//ASYNC ESTA CORRECTO
//CUANDO LO MODIFIQUE, VERIFICA QUE NO ESTE DAÑANDO NADA

//AL PARECER, TENEMOS QUE MODIFICAR TODO ESTE ARCHIVO. RAZONES:
//
// 1.- YA NO USAREMOS LA VARIABLE EN datos LLAMADA Esc : 'CECyTE Escobedo'
//ESTO LO HARE EN UN FUTURO

/*
<View style={{width: "50%", height: (datosEspecificosR.current.alturaDeScrollView) * .10, borderRadius: 20, backgroundColor: "lavender", borderWidth: 2, overflow: "hidden"}}>
		<TouchableNativeFeedback onPress={() => {
modificarDatosEspecificosS({
...datosEspecificosS,
muestreoDelModalInformacionImportante: false
});
		}}>
				<View style={{width: "100%", height: "100%", borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
						<Text>Entendido</Text>
				</View>
		</TouchableNativeFeedback>
</View>
*/

const anchoNativoInicial =  Math.round(Dimensions.get('window').width);
const alturaDeVistaInicial = Math.round(Dimensions.get('window').height) - Math.round(StatusBar.currentHeight);

const pantallaRegistrarse = ({navigation,route}) => {

  useEffect(()=>{
    console.log("Este es el token desde iniciar sesion: ",route.params.Token)
  },[])

	const datos = useRef({
		Us : '',
		Contra : '',
		ApP : '',
		ApM : '',
		Nom : '',
    Token : route.params.Token
    });

    const [datosEspecificosS, modificarDatosEspecificosS] = useState({
        muestreoDelModalInformacionImportante: true
    });

    const datosEspecificosR = useRef({
        alturaDeScrollView: (alturaDeVistaInicial * .9) * .9
    });

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



	const comprobarRegistro = async (datosAEnviar) => {
		let promesa = await fetch("http://backpack.sytes.net/servidorApp/php/comprobacionDeRegistrarse.php",{
     method : 'POST',
     body: datosAEnviar
   })
   .then((respuesta) => respuesta.text())
   .then((mensaje) => {
       console.log(mensaje);
       if(mensaje == "Error"){
          console.log("Lo siento no se pudo crear credencial")
          setModalCargando(false);
       }else{
         setModalCargando(false);
        console.log("Se pudo crear la credencial con matricula => ",mensaje)
        navigation.navigate("FaltaMasInformacion",{
          matricula: JSON.parse(mensaje)
        })
       }
    })
   .catch((error) => {
     console.log(error);
     setModalCargando(false);
    });
	}

	const eventoDeBoton1 = () => {

		let ContadorDeErrores = 0;
  //LOS DEMAS SI PUEDEN TENER 0 CARACTERES
  if(datos.current.ApP === ""){
    //ESTA VACIO
    ContadorDeErrores++;
  }
  if(datos.current.ApM === ""){
    //ESTA VACIO
    ContadorDeErrores++;
  }
  if(datos.current.Nom === ""){
    //ESTA VACIO
    ContadorDeErrores++;
  }
  if(datos.current.Us === ""){
    //ESTA VACIO
    ContadorDeErrores++;
  }
  if(datos.current.Contra === ""){
    //ESTA VACIO
    ContadorDeErrores++;
  }


  //ENVIO AL SERVIDOR
  if(ContadorDeErrores === 0){
  //NO HAY CAJAS VACIAS

  //CREAR EL VALOR PARA NOMCOMP
  //COMPROBACION DE REGISTRO
  //comprobarRegistro.current(10);
  //alert("FELICIDADES : Mat = " + datos.current.Mat + " ApP = " + (datos.current.ApP) + " ApM = " + (datos.current.ApM) + " Nom = " + (datos.current.Nom) + " Us = " + (datos.current.Us) + " Contra = " + (datos.current.Contra) + "");
  //Alert.alert("FELICIDADES : Mat = " + datos.Mat + " ApP = " + (datos.ApP) + " ApM = " + (datos.ApM) + " Nom = " + (datos.Nom) + " Us = " + (datos.Us) + " Contra = " + (datos.Contra) + "");

  //RETORNAR NOMBRE COMPLETO, CON LAS REGLAS DE UTF8 BINARIO
  //datos.current = {...datos.current,NomComp:RetornarNombreCompleto(datos.current.ApP,datos.current.ApM,datos.current.Nom)};
  setModalCargando(true)
  let json = JSON.stringify(datos.current);
  let formdata = new FormData();
  formdata.append('indice',json);
  comprobarRegistro(formdata);
  }
  else{
    //HAY CAJAS VACIAS, O SOLO UNA CAJA VACIA
  alert("¡Rayos, hay algun dato faltante!");
  //Alert.alert(datos.Mat);
  //Alert.alert(datos.Mat);
  }
	}


	const eventoDeBoton2 = () => {
		//Alert.alert(valor.current);
		navigation.goBack(null);
	}

	const InputTexto = (props) => {

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
      placeholderTextColor={"#576574"}
         placeholder={props.invisible} onChangeText={(e) => {


      if(props.tipo === "ApellidoPaterno"){
        // modificarDatos({...datos,ApP : e});
		datos.current = {...datos.current,ApP : e}
      }
      else if(props.tipo === "ApellidoMaterno"){
        // modificarDatos({...datos,ApM : e});
		datos.current = {...datos.current,ApM : e}
      }
      else if(props.tipo === "Nombres"){
        // modificarDatos({...datos,Nom : e});
		datos.current = {...datos.current,Nom : e}
      }
      else if(props.tipo === "Usuario"){
        // modificarDatos({...datos,Us : e});
		datos.current = {...datos.current,Us : e}
      }
      else if(props.tipo === "Contra"){
        // modificarDatos({...datos,Contra : e});
		datos.current = {...datos.current,Contra : e}
      }

      }} />
		);

	}

	return (
        <>
            <View>
                <StatusBar backgroundColor={"rgb(66,66,132)"}/>
                <ScrollView>
                    <View style={{backgroundColor:"#dfe6e9",height:Dimensions.get('screen').height + 200}}>
                        <Image style={{height:150,width:150,alignSelf:"center",resizeMode:'stretch'}} source={{uri:"http://backpack.sytes.net/servidorApp/imagenes/mochila.png"}}/>
                        
                        <Text></Text>
                        
                        <Text style={{alignSelf:"center",textAlign: 'center',fontFamily: "AkayaKanadaka-Regular",fontSize: 18,color:"#111"}}>Bienvenido a backpack</Text>
                        
                        <Text></Text>


                        <InputTexto invisible={'Ingresa tu apellido paterno'} tipo={'ApellidoPaterno'} />
                        <Text></Text>
                        <InputTexto invisible={'Ingresa tu apellido materno'} tipo={'ApellidoMaterno'} />
                        <Text></Text>
                        <InputTexto invisible={'Ingresa tu(s) nombre(s)'} tipo={'Nombres'} />
                        <Text></Text>
                        <InputTexto invisible={'Ingresa tu nombre de usuario'} tipo={'Usuario'} />
                        <Text></Text>
                        <InputTexto invisible={'Ingresa tu contraseña'} tipo={'Contra'} />

                        <Text style={{height:10}}></Text>



                        <TouchableOpacity onPress={eventoDeBoton1} style={{left:(Dimensions.get('window').width / 2) - 75,borderRadius:10,width:150,backgroundColor:'#ee5253', height:40, alignItems:'center',justifyContent:'center'}} ><Text style={{fontFamily: "Viga-Regular",color:"#111",textAlign: 'center'}}>Registrate</Text></TouchableOpacity>
                        <Text style={{height:10}}></Text>
                        <TouchableOpacity onPress={eventoDeBoton2} style={{left:(Dimensions.get('window').width / 2) - 75,borderRadius:10,width:150,backgroundColor:'#22a6b3', height:40, alignItems:'center',justifyContent:'center'}} ><Text style={{fontFamily: "Viga-Regular",color:"#111",textAlign: 'center'}}>Ir a iniciar sesión</Text></TouchableOpacity>

                  </View>
                </ScrollView>
            </View>

            <>
                {(datosEspecificosS.muestreoDelModalInformacionImportante) ?
                    <Modal visible={true} transparent={true}>
                        <View style={{backgroundColor: "rgba(1,1,1,.5)", width: "100%", height: "100%", justifyContent: "center", alignItems: "center", }}>
                            <View style={{width: "95%", height: "90%", alignItems: "center", backgroundColor:"#ecf0f1", borderRadius:20, overflow: "hidden"}}>
                                <View style={{width: "100%", height: "10%", backgroundColor:"#222f3e", flexDirection: "row", justifyContent: "space-around", alignItems: "center", overflow: "hidden"}}>
                                    <Text style={{fontFamily: "Viga-Regular",fontSize: 18, color: "#fff"}}>{"Información importante"}</Text>
                                </View>

                                <View style={{width: "100%", height: "90%", overflow: "hidden"}}>
                                    <ScrollView contentContainerStyle={{ alignItems: "center" }}>

                                        <View style={{width: "100%", height: (datosEspecificosR.current.alturaDeScrollView) * .88}}>
                                            <ScrollView contentContainerStyle={{ alignItems: "center" }}>                                   
                                                
                                                  
                                                  
                                                      <Text style={{fontFamily: "Viga-Regular",fontSize: 15,margin:4,textAlign:"center", color: "#111"}}>
                                                      Bienvenido a<Text style={{color:"#10ac84"}}> BackPack</Text> una app destinada a alumnos para ayudar a entender un tema.
                                                      {"\n"} Esta app fue desarrollada  por:{"\n"} 
                                                      <Text style={{color:"#E91E63"}}>Alonso Ramirez Paez</Text> y
                                                      {"\n"} 
                                                      <Text style={{color:"#3F51B5"}}>Angel Gabriel Hernandez Hernandez.</Text>
                                                       {"\n"}Esta app es también un proyecto para la convocatoria 
                                                       <Text style={{color:"#3498db"}}> Líderes del Mañana </Text>
                                                        del 
                                                       <Text style={{color:"#2980b9"}}> Tecnológico de Monterrey </Text>.
                                                       </Text>
                                                       <Text style={{width:"100%",padding:3,borderTopWidth:2,borderBottomWidth:2,textAlign:"center",fontFamily: "Viga-Regular",fontSize: 15,marginTop:12,marginBottom:12,borderColor:"#7f8c8d",color:"#111"}}> Asegúrate de leer </Text>
                                                       <Text style={{fontFamily: "Viga-Regular",fontSize: 15,margin:4,textAlign:"center", color: "#111"}}>-- De antemano, nos disculpamos por los errores que pudieran surgir.</Text>
                                                       <Text style={{fontFamily: "Viga-Regular",fontSize: 15,margin:4,textAlign:"center", color: "#111"}}>-- BackPack está en fase de desarrollo, así que los errores que se presenten serán resueltos en futuras versiones.</Text>
                                                       <Text style={{fontFamily: "Viga-Regular",fontSize: 15,margin:4,textAlign:"center", color: "#111"}}>-- Te sugerimos no poner datos relevantes como por ejemplo contraseñas o usuarios que uses en otro tipo de cuentas, asegúrate que sea información elegida al azar.</Text>
                                                       <Text style={{fontFamily: "Viga-Regular",fontSize: 15,margin:4,textAlign:"center", color: "#111"}}>-- Si se hace uso indebido de la app, se borrara la cuenta y contenido.</Text>
                                                       <Text style={{fontFamily: "Viga-Regular",fontSize: 15,margin:4,textAlign:"center", color: "#111"}}>-- Los desarrolladores de BackPack no se hacen responsables por el contenido o actos que se lleven a cabo dentro de la app. Cada quien es responsable de sus actos y contenido.</Text>
                                                        <Text style={{fontFamily: "Viga-Regular",fontSize: 15,margin:4,textAlign:"center", color: "#111"}}>-- Te sugerimos no utlilizar información importante ni real dentro de la app (como por ejemplo, en las conversaciones, en la información de la credencial, etc.); en cambio, te aconsejamos usar información falsa o ligeramente modificada.</Text>
                                                        <Text style={{fontFamily: "Viga-Regular",fontSize: 15,margin:4,textAlign:"center", color: "#111"}}>-- Haciendo referencia a la regla anterior, te informamos que nuestro sistema donde se almacena toda la información de BackPack no es perfecto (podría haber problemas de seguridad o pérdida de información); por lo tanto, mediante esta regla estás aceptando que toda información (imágenes, videos, audios, texto, mensajes, archivos, etc.) proporcionada por tí dentro del sistema BackPack pueda ser usada o manipulada por el mismo sistema, y dentro del mismo sistema.</Text>
                                                        <Text style={{fontFamily: "Viga-Regular",fontSize: 15,margin:4,textAlign:"center", color: "#111"}}>-- BackPack fué creado con cariño y con la intención de ayudar; por lo tanto, te pedimos que no actues con malicia ni subas contenido inapropiado.</Text>
                                                        
                                                        <Text style={{fontFamily: "Viga-Regular",fontSize: 15,margin:4,textAlign:"center", color: "red"}}>Al pulsar el botón "Entendido", confirmas que has leído, entendido y aceptado toda la información y reglas aqui presentadas.</Text>
                                                       <Text style={{fontFamily: "Viga-Regular",fontSize: 15,margin:4,textAlign:"center", color: "#111"}}>No olvides: "aprende a ayudar y ayuda a aprender"</Text>
                                                       <Text style={{fontFamily: "Viga-Regular",fontSize: 15,margin:4,textAlign:"center", color: "#111"}}>Gracias y Bienvenidos sean todos a BackPack.</Text>
                                                  
                                                
                                                
                                            </ScrollView>
                                        </View>

																				<View style={{width: "100%", height: (datosEspecificosR.current.alturaDeScrollView) * .01}}></View>

																				<View style={{width: "50%", height: (datosEspecificosR.current.alturaDeScrollView) * .10, borderRadius: 20, backgroundColor: "#222f3e", borderWidth: 2, overflow: "hidden"}}>
																						<TouchableNativeFeedback onPress={() => {
																				modificarDatosEspecificosS({
																				...datosEspecificosS,
																				muestreoDelModalInformacionImportante: false
																				});
																						}}>
																								<View style={{width: "100%", height: "100%", borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
                                                  <Text style={{fontFamily: "Viga-Regular",fontSize: 14,textAlign:"center", color: "#fff"}}>Entendido</Text>
																								</View>
																						</TouchableNativeFeedback>
																				</View>

																				<View style={{width: "100%", height: (datosEspecificosR.current.alturaDeScrollView) * .01}}></View>
                                    </ScrollView>
                                </View>
                            </View>
                        </View>
                    </Modal>
                :
                    null
                }
            </>
            <>
              {
                (modalCargando) ? 
                <ModalCargando/>
                :
                null
              }
            </>
        </>
	)
}

export default pantallaRegistrarse;
//xd respaldo juas