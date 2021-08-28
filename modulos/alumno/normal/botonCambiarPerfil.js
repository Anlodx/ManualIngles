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
  Dimensions,
  ToastAndroid
} from 'react-native';
import { Icon } from 'react-native-elements';

import * as ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';


import AsyncStorage from '@react-native-async-storage/async-storage';



import {useSelector, useDispatch} from 'react-redux';


import {cambiarNombreCompleto, cambiarEspecialidad, cambiarUsuario, cambiarContrasenia, cambiarFrase, cambiarHobbies, cambiarRutaDeFoto , establecerDatosDeCredencialDesdeIniciarSesion} from './../../../store/actions.js';


const AnchoPantalla = Dimensions.get("window").width;
const AltoPantalla = Dimensions.get("window").height;


const BotonCambiarPerfil = (props) => {

function Apartado(Apartado){
  switch(Apartado){
    case "QuienesSomos": return(<QuienesSomos AccionCerrar={cerrar} Matricula={props.matricula}/>);   break;
    case "Foto":         return(<BotonCambiarFoto AccionCerrar={cerrar} Foto={props.foto} Matricula={props.matricula} />);   break;
    case "Nombre":       return(<BotonCambiarNombre AccionCerrar={cerrar} Nombre={props.nombre} Matricula={props.matricula} />);   break;
    case "Especialidad": return(<BotonCambiarEspecialidad AccionCerrar={cerrar} Especialidad={props.especialidad}  Matricula={props.matricula} />);   break;
    case "Usuario":      return(<BotonCambiarUsuario AccionCerrar={cerrar} Usuario={props.usuario}  Matricula={props.matricula}/>);   break;
    case "Contraseña":   return(<BotonCambiarContraseña AccionCerrar={cerrar} Contraseña={props.contraseña}  Matricula={props.matricula}/>);   break;
    case "Frase":        return(<BotonCambiarFrase  AccionCerrar={cerrar} Frase={props.frase}  Matricula={props.matricula}/>);   break;
    case "Hobbies":      return(<BotonCambiarHobbies AccionCerrar={cerrar} Hobbies={props.hobbies}  Matricula={props.matricula}/>);   break;
  }
}


		const { cerrar,Eleccion } = props;
    return (

         <View>
          {
           //<BotonCambiarNombre AccionCerrar={cerrar} Nombre={props.nombre}/>
          }
          {
           //<BotonCambiarEspecialidad AccionCerrar={cerrar} Especialidad={props.especialidad}/>
          }
          {
           //<BotonCambiarUsuario AccionCerrar={cerrar} Usuario={props.usuario}/>
          }
          {
           //<BotonCambiarContraseña AccionCerrar={cerrar} Contraseña={props.contraseña}/>
          }
          {
            //<BotonCambiarFrase  AccionCerrar={cerrar} Frase={props.frase}/>
          }
          {
           //<BotonCambiarHobbies AccionCerrar={cerrar} Hobbies={props.hobbies}/>
          }
          {
            Apartado(Eleccion)
          }
         </View>
		)
}


      const storeData = async (value) => {
        try {
          console.log("valor a reemplazar en AsyncStorage desde botonCambiar perfil =>",value)
          const jsonValue = JSON.stringify(value)
          await AsyncStorage.setItem('@UserToken:key', jsonValue)
        } catch (e) {
          // saving error
          console.log("lo siento hubo un error al establecer => ",e)
        }
      }



const BotonCambiarFoto = (props) => {
	const dispatch = useDispatch();
  const datosDeCredencial = useSelector(store => store.datosDeCredencial);

    const [fotoPerfil, setFotoPerfil] = useState({
      Id:props.Matricula,
      src:null,
      data:null,
      type:null,
      name:null
    })
    const options = {
        title: 'Select Avatar',
        chooseFromLibraryButtonTitle:"choose from gallery",
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
          setFotoPerfil({...fotoPerfil,src: source,data:response.base64,type:response.type,name:response.fileName});
          //console.log(response)
        }
      });
      }

      const uploadPhoto = () =>
      {

        RNFetchBlob.fetch('POST', 'http://backpack.sytes.net/servidorApp/php/datosDeCredencial/cambiarFoto.php', {
          Authorization : "Bearer access-token",
          otherHeader : "foo",
          'Content-Type' : 'multipart/form-data',
        },
        [
          { name : 'fotoPerfil', filename : fotoPerfil.name, type:fotoPerfil.type, data: fotoPerfil.data},
		  { name : 'matricula' , data: fotoPerfil.Id}
        ]).then((response) => response.text())
             .then((response)=>{
               console.log("esto da la respuesta de la foto : ",response);
				if(response === "NO ALTERADO"){
					ToastAndroid.show('Rayos hubo un error al cambiar foto' , ToastAndroid.SHORT);
				}
				else{
					dispatch(cambiarRutaDeFoto(response));
          let objetoAux = {

          matricula : datosDeCredencial.matricula,
          nombres : datosDeCredencial.nombreCompleto.nombres,
          apellidoPaterno : datosDeCredencial.nombreCompleto.apellidoPaterno,
          apellidoMaterno : datosDeCredencial.nombreCompleto.apellidoMaterno,
          usuario : datosDeCredencial.usuario,
          contrasenia : datosDeCredencial.contrasenia,
          especialidad : datosDeCredencial.especialidad,
          fechaDeNacimiento : datosDeCredencial.fechaDeNacimiento,
          genero : datosDeCredencial.genero,
          frase : datosDeCredencial.frase,
          rutaDeFoto : response,
          hobbies : datosDeCredencial.hobbies
          }
          console.log("valor del objeto desde especialidad => ",objetoAux)
      //    dispatch(establecerDatosDeCredencialDesdeIniciarSesion(arregloAux));
         storeData(objetoAux)
         ToastAndroid.show('Cambiado exitosamente' , ToastAndroid.SHORT);
				}
             }).catch((err) => {
				console.log(err);
        ToastAndroid.show('Hubo un error lo sentimos.' , ToastAndroid.SHORT);
        })

      }


	const [Matricula, setMatricula] = useState(props.Matricula)
    const [Foto, setFoto] = useState(props.Foto)
    const {AccionCerrar} = props;

	function MetodoCambiarFoto(Variable_Remplazar,Variable_Nueva,Matricula)
	{

	}

//http://backpack.sytes.net/servidorApp/imagenes/mochila.png
    return (
         <View style={{backgroundColor:"#ecf0f1",borderWidth:1,borderColor:"black",borderRadius:20,width:AnchoPantalla * (0.9),height:AltoPantalla * (0.8),justifyContent:"space-around",alignItems:"center",alignSelf:"center",flexDirection:"column"}}>

            <View style={{backgroundColor:"#ecf0f1",width:AnchoPantalla * (0.5),height:34,justifyContent:'space-around',alignItems:"center",alignSelf:"center",flexDirection:"row"}}>
              <Icon name='picture' type="ant-design" color='#1e272e' size={27}/>
              <Text  style={{fontSize: 15,fontFamily: "Viga-Regular"}}>Foto de Perfil</Text>
            </View>

            <View style={{width:AnchoPantalla * (0.7),height:(AltoPantalla * (0.8)) * (0.35),borderRadius: 10,overflow: "hidden",backgroundColor: null}}>
              <Image
              source={
              fotoPerfil.src != null ? fotoPerfil.src : {uri:Foto}//require("../../../assets/media2.jpg")
              }

               style={{flex: 1,height: undefined,width: undefined}} resizeMode="center"></Image>
            </View>


              <TouchableOpacity onPress={selectPhoto} style={{backgroundColor:"#3c40c6",padding:14,paddingLeft:16,paddingRight:16,borderRadius:15,flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
                <Icon name='plus' type="font-awesome" color='#ffdd59' size={28}/>
                <Text style={{textAlign:"center",fontSize:15,color:"white",marginLeft:15,fontFamily: "Viga-Regular"}}>Nueva</Text>
              </TouchableOpacity>


            <View style={{width:AnchoPantalla * (0.9),flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
              <TouchableOpacity onPress={AccionCerrar} style={{backgroundColor:"#ff3f34",padding:15,paddingLeft:20,paddingRight:20,borderRadius:15}}>
              <Text style={{textAlign:"center",fontSize:15,color:"white",fontFamily: "Viga-Regular"}}>Cancelar</Text>
             </TouchableOpacity>

            <TouchableOpacity
            onPress={
            //  ()=>MetodoCambiarFoto(Foto,"source",Matricula)
            ()=>{
              uploadPhoto()
              AccionCerrar()
            }

            }
             style={{backgroundColor:"#3498db",padding:15,paddingLeft:20,paddingRight:20,borderRadius:15}}>
              <Text style={{textAlign:"center",fontSize:15,color:"white",fontFamily: "Viga-Regular"}}>Guardar</Text>
              </TouchableOpacity>
             </View>

          </View>

    )
}




const BotonCambiarNombre = (props) => {
  const datosDeCredencial = useSelector(store => store.datosDeCredencial);
	const dispatch = useDispatch();
	const [Matricula, setMatricula] = useState(props.Matricula)
	const [Nombre, setNombre] = useState(props.Nombre)

    const {AccionCerrar} = props;




	function MetodoCambiarNombre(Variable_Remplazar,Variable_Nueva,Matricula)
	{
			/*
			alert(
			"Valor a remplazar: " + Variable_Remplazar.Nombres + " " + Variable_Remplazar.ApellidoPaterno + " " + Variable_Remplazar.ApellidoMaterno +
			"\n Valor Nuevo: " + Variable_Nueva.Nombres + " " + Variable_Nueva.ApellidoPaterno + " " +Variable_Nueva.ApellidoMaterno +
			"\nAla matricula: " +Matricula
			);
			*/

			//1.- COMPROBAR SI TIENE LOS MISMOS DATOS
			let comprobacion = 0;
			if(Variable_Remplazar.nombres === Variable_Nueva.nombres){
				comprobacion++;
			}
			if(Variable_Remplazar.apellidoPaterno === Variable_Nueva.apellidoPaterno){
				comprobacion++;
			}
			if(Variable_Remplazar.apellidoMaterno === Variable_Nueva.apellidoMaterno){
				comprobacion++;
			}
			//si comprobacion = 0 modificamos
			//si comprobacion != 3 no hacemos nada

			/*
				Variable_Nueva.Nombres
				Variable_Nueva.ApellidoPaterno
				Variable_Nueva.ApellidoMaterno
			*/

			if( comprobacion != 3 ){
					  fetch('http://backpack.sytes.net/servidorApp/php/datosDeCredencial/cambiarNombre.php',{
						  method:'post',
						  header:{
							'Accept': 'application/json',
							'Content-type': 'application/json'
						  },
						  body:JSON.stringify({
							matricula:Matricula,
							nombres:Variable_Nueva.nombres,
							apellido_paterno:Variable_Nueva.apellidoPaterno,
							apellido_materno:Variable_Nueva.apellidoMaterno
						  })

						})
						.then((response) => response.text())
						 .then((message)=>{
							console.log(message);
              console.log("nombre actualizado => ",Variable_Nueva)
              dispatch(cambiarNombreCompleto(Variable_Nueva));
              let objetoAux = {

              matricula : datosDeCredencial.matricula,
              nombres : Variable_Nueva.nombres,
              apellidoPaterno : Variable_Nueva.apellidoPaterno,
              apellidoMaterno : Variable_Nueva.apellidoMaterno,
              usuario : datosDeCredencial.usuario,
              contrasenia : datosDeCredencial.contrasenia,
              especialidad : datosDeCredencial.especialidad,
              fechaDeNacimiento : datosDeCredencial.fechaDeNacimiento,
              genero : datosDeCredencial.genero,
              frase : datosDeCredencial.frase,
              rutaDeFoto : datosDeCredencial.rutaDeFoto,
              hobbies : datosDeCredencial.hobbies
              }
              console.log("valor del arreglo => ",objetoAux)
          //    dispatch(establecerDatosDeCredencialDesdeIniciarSesion(arregloAux));
             storeData(objetoAux)
             ToastAndroid.show('Cambiado exitosamente' , ToastAndroid.SHORT);
						 })
						 .catch((error)=>{
						 console.error(error);
             ToastAndroid.show('Hubo un error lo sentimos.' , ToastAndroid.SHORT);
						 });

			}

	}

    return (
         <View style={{backgroundColor:"#ecf0f1",borderWidth:1,borderColor:"black",borderRadius:20,width:AnchoPantalla * (0.9),height:AltoPantalla * (0.8),justifyContent:"center",alignItems:"center",alignSelf:"center",flexDirection:"column"}}>
          <View style={{backgroundColor:null,width:(AnchoPantalla * (0.9)) * (0.5) ,height: 30,justifyContent:"space-around",alignItems:"center",alignSelf:"center",flexDirection:"row"}}>
            <Icon name='user-circle' type="font-awesome" color='#111' size={32}/>
            <Text style={{fontSize: 14,fontFamily: "Viga-Regular"}}>Cambiar Nombre</Text>
          </View>
          <View style={{backgroundColor:null,width:AnchoPantalla * (0.9),justifyContent:"space-around",alignItems:"center",alignSelf:"center",flexDirection:"column"}}>

            <Text style={{textAlign:"center",padding:8,fontFamily: "Viga-Regular"}}>¿Cuál es tu nombre?{"\n"}{"" + Nombre.nombres + " " + Nombre.apellidoPaterno + " " + Nombre.apellidoMaterno}{"\n"}{"\n"}</Text>

            <Text style={{textAlign:"center",padding:8,fontFamily: "Viga-Regular"}}>Nombre(S):</Text>


            <TextInput
            //textAlign={"center"}
            value={Nombre.nombres}
             style={{width: (AnchoPantalla * (0.9)) * (0.8),borderWidth:1,borderColor:"#777",height: 44,color:"#3498db",borderRadius:10,textAlign: 'center',justifyContent: 'center',textAlign: 'center',alignItems: 'center'}}

             onChangeText={(Val)=>setNombre({...Nombre,nombres:Val})}
             maxLength={60}
             />




            <Text style={{textAlign:"center",padding:8,fontFamily: "Viga-Regular"}}>Apellido Paterno:</Text>
            <TextInput
            textAlign={"center"}
            value={Nombre.apellidoPaterno}
             style={{borderWidth:1,borderColor:"#777",width:AnchoPantalla * (0.8),height: 44,color:"#3498db",borderRadius:10,textAlign: 'center'}}
             //placeholder={"Cuentame..."}
             onChangeText={(Val)=>setNombre({...Nombre,apellidoPaterno:Val})}
             maxLength={60}
             />

            <Text style={{textAlign:"center",padding:8,fontFamily: "Viga-Regular"}}>Apellido Materno:</Text>
            <TextInput
            textAlign={"center"}
            value={Nombre.apellidoMaterno}
             style={{borderWidth:1,borderColor:"#777",width:AnchoPantalla * (0.8),height: 44,color:"#3498db",borderRadius:10,textAlign: 'center'}}
             //placeholder={"Cuentame..."}
             onChangeText={(Val)=>setNombre({...Nombre,apellidoMaterno:Val})}
             maxLength={60}
             />

             <View style={{width:AnchoPantalla * (0.9),flexDirection:"row",justifyContent:"space-around",alignItems:"center",marginTop:15}}>
              <TouchableOpacity onPress={AccionCerrar} style={{backgroundColor:"red",width:(AnchoPantalla * (0.9)) * (0.45) ,padding:14,paddingLeft:18,paddingRight:18,borderRadius:10}}>
                <Text style={{textAlign:"center",fontSize:15,color:"white",fontFamily: "Viga-Regular"}}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>{
                MetodoCambiarNombre(props.Nombre,Nombre,Matricula)
                AccionCerrar()
              }} style={{backgroundColor:"#3498db",width:(AnchoPantalla * (0.9)) * (0.45) ,padding:14,paddingLeft:18,paddingRight:18,borderRadius:10}}>
                <Text style={{textAlign:"center",fontSize:15,color:"white",fontFamily: "Viga-Regular"}}>Guardar</Text>
              </TouchableOpacity>

             </View>
          </View>
         </View>
    )
}
// Nombre(s)

const BotonCambiarEspecialidad = (props) => {
	const dispatch = useDispatch();
  const datosDeCredencial = useSelector(store => store.datosDeCredencial);
	const [Matricula, setMatricula] = useState(props.Matricula)
    const [Especialidad, setEspecialidad] = useState(props.Especialidad)


	function MetodoCambiarEspecialidad(Variable_Remplazar,Variable_Nueva,Matricula)
	{
			//alert("Valor a remplazar: " + Variable_Remplazar +"\n Valor Nuevo: "+ Variable_Nueva+"\nAla matricula: " +Matricula);

			if( Variable_Remplazar != Variable_Nueva ){
					  fetch('http://backpack.sytes.net/servidorApp/php/datosDeCredencial/cambiarEspecialidad.php',{
						  method:'post',
						  header:{
							'Accept': 'application/json',
							'Content-type': 'application/json'
						  },
						  body:JSON.stringify({
							matricula:Matricula,
							especialidad:Variable_Nueva
						  })

						})
						.then((response) => response.text())
						 .then((message)=>{
						   console.log(message);
						   dispatch(cambiarEspecialidad(Variable_Nueva));
               let objetoAux = {

               matricula : datosDeCredencial.matricula,
               nombres : datosDeCredencial.nombreCompleto.nombres,
               apellidoPaterno : datosDeCredencial.nombreCompleto.apellidoPaterno,
               apellidoMaterno : datosDeCredencial.nombreCompleto.apellidoMaterno,
               usuario : datosDeCredencial.usuario,
               contrasenia : datosDeCredencial.contrasenia,
               especialidad : Variable_Nueva,
               fechaDeNacimiento : datosDeCredencial.fechaDeNacimiento,
               genero : datosDeCredencial.genero,
               frase : datosDeCredencial.frase,
               rutaDeFoto : datosDeCredencial.rutaDeFoto,
               hobbies : datosDeCredencial.hobbies
               }
               console.log("valor del objeto desde especialidad => ",objetoAux)
           //    dispatch(establecerDatosDeCredencialDesdeIniciarSesion(arregloAux));
              storeData(objetoAux)
              ToastAndroid.show('Cambiado exitosamente' , ToastAndroid.SHORT);
						 })
						 .catch((error)=>{
						 console.error(error);
             ToastAndroid.show('Hubo un error lo sentimos.' , ToastAndroid.SHORT);
						 });

			}
	}

    const {AccionCerrar} = props;

    return (
         <View style={{backgroundColor:"#ecf0f1",borderWidth:1,borderColor:"black",borderRadius:20,width:AnchoPantalla * (0.9),height:AltoPantalla * (0.8),justifyContent:"center",alignItems:"center",alignSelf:"center",flexDirection:"column"}}>
          <View style={{backgroundColor:"#ecf0f1",width:(AnchoPantalla * (0.9)) * (0.7),marginTop: 10,height:30,justifyContent:"space-around",alignItems:"center",alignSelf:"center",flexDirection:"row"}}>
            <Icon name='crown' type="font-awesome-5" color='#f1c40f' size={28}/>
            <Text style={{textAlign:"center",padding:8,fontSize: 14,fontFamily: "Viga-Regular"}}>Cambiar Especialidad</Text>
          </View>
          <View style={{backgroundColor:null,width:AnchoPantalla * (0.9),justifyContent:'flex-start',height: "90%",alignItems:"center",alignSelf:"center",flexDirection:"column"}}>

            <Text style={{textAlign:"center",padding:8,marginTop:25,fontSize: 14,fontFamily: "Viga-Regular"}}>¿Cuál es tu especialidad?{"\n"}{Especialidad}</Text>
            <TextInput
            textAlign={"center"}
            value={Especialidad}
             style={{borderWidth:1,borderColor:"#777",padding:8,margin:10,width: (AnchoPantalla * (0.9)) * (0.7),color:"#3498db",borderRadius:20}}
             //placeholder={"Cuentame..."}
             onChangeText={(Val)=>setEspecialidad(Val)}
             maxLength={60}
             />
             <View style={{width:AnchoPantalla * (0.9),marginTop:50,flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
              <TouchableOpacity onPress={AccionCerrar} style={{backgroundColor:"#f53b57",width: (AnchoPantalla * (0.9)) * (0.40),padding:15,paddingLeft:10,paddingRight:10,borderRadius:12}}>
                <Text style={{textAlign:"center",fontSize:13,color:"white",fontFamily: "Viga-Regular"}}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity  onPress={()=>{
                MetodoCambiarEspecialidad(props.Especialidad,Especialidad,Matricula)
                AccionCerrar()
              }} style={{backgroundColor:"#3498db",width: (AnchoPantalla * (0.9)) * (0.40),padding:15,paddingLeft:10,paddingRight:10,borderRadius:12}}>
                <Text style={{textAlign:"center",fontSize:13,color:"white",fontFamily: "Viga-Regular"}}>Guardar</Text>
              </TouchableOpacity>

             </View>
          </View>
         </View>
    )
}

const BotonCambiarUsuario = (props) => {
	const dispatch = useDispatch();
  const datosDeCredencial = useSelector(store => store.datosDeCredencial);
	const [Matricula, setMatricula] = useState(props.Matricula)
    const [Usuario, setUsuario] = useState(props.Usuario)


    function PreparaEntrada(cadenaADividir) {
      if(cadenaADividir!==null && cadenaADividir!=="")
        {
         let i=0,aux=0;
		 for(i=0;i<cadenaADividir.length;i++){
			 if(cadenaADividir[i]==' '){
				 aux++;
			 }
		 }
		 if(aux==cadenaADividir.length){
			 return false;
		 }else{
			 return true;
		 }

      }else{
               return (false);
      }
    }

	function MetodoCambiarUsuario(Variable_Remplazar,Variable_Nueva,Matricula)
	{
			//alert("Valor a remplazar: " + Variable_Remplazar +"\n Valor Nuevo: "+ Variable_Nueva+"\nAla matricula: " +Matricula);

			if( Variable_Remplazar != Variable_Nueva && Variable_Remplazar!="" && PreparaEntrada(Variable_Nueva)){
					  fetch('http://backpack.sytes.net/servidorApp/php/datosDeCredencial/cambiarUsuario.php',{
						  method:'post',
						  header:{
							'Accept': 'application/json',
							'Content-type': 'application/json'
						  },
						  body:JSON.stringify({
							matricula:Matricula,
							usuario:Variable_Nueva
						  })

						})
						.then((response) => response.text())
						 .then((message)=>{
						   console.log(message);
						   dispatch(cambiarUsuario(Variable_Nueva));
               let objetoAux = {

               matricula : datosDeCredencial.matricula,
               nombres : datosDeCredencial.nombreCompleto.nombres,
               apellidoPaterno : datosDeCredencial.nombreCompleto.apellidoPaterno,
               apellidoMaterno : datosDeCredencial.nombreCompleto.apellidoMaterno,
               usuario : Variable_Nueva,
               contrasenia : datosDeCredencial.contrasenia,
               especialidad : datosDeCredencial.especialidad,
               fechaDeNacimiento : datosDeCredencial.fechaDeNacimiento,
               genero : datosDeCredencial.genero,
               frase : datosDeCredencial.frase,
               rutaDeFoto : datosDeCredencial.rutaDeFoto,
               hobbies : datosDeCredencial.hobbies
               }
               console.log("valor del objeto desde Usuario => ",objetoAux)
           //    dispatch(establecerDatosDeCredencialDesdeIniciarSesion(arregloAux));
              storeData(objetoAux)
              ToastAndroid.show('Cambiado exitosamente' , ToastAndroid.SHORT);
						 })
						 .catch((error)=>{
						 console.error(error);
             ToastAndroid.show('Hubo un error lo sentimos.' , ToastAndroid.SHORT);
						 });

			}
	}

    const {AccionCerrar} = props;

    return (
         <View style={{backgroundColor:"#ecf0f1",borderWidth:1,borderColor:"black",borderRadius:20,width:AnchoPantalla * (0.9),height:AltoPantalla * (0.8),justifyContent:"center",alignItems:"center",alignSelf:"center",flexDirection:"column"}}>
          <View style={{backgroundColor:"#ecf0f1",width:(AnchoPantalla * (0.9)) * (0.7),marginTop: 10,height:(AltoPantalla * (0.8))*(0.1),justifyContent:"space-around",alignItems:"center",alignSelf:"center",flexDirection:"row"}}>
            <Icon name='user-circle' type="font-awesome" color='#3c40c6' size={30}/>
            <Text style={{textAlign:"center",padding:8,fontSize: 14,fontFamily: "Viga-Regular"}}>Cambiar Usuario</Text>
          </View>
          <View style={{backgroundColor:null,width:AnchoPantalla * (0.9),marginTop:(AltoPantalla * (0.8))*(0.1),justifyContent:'flex-start',height: "80%",alignItems:"center",alignSelf:"center",flexDirection:"column"}}>

            <Text style={{textAlign:"center",padding:8,fontSize: 14,fontFamily: "Viga-Regular"}}>¿Cuál es tu Usuario?{"\n"}{"\n"}{Usuario}</Text>
            <TextInput
            textAlign={"center"}
            value={Usuario}
            style={{borderWidth:1,borderColor:"#777",padding:8,margin:10,width: (AnchoPantalla * (0.9)) * (0.7),color:"#3498db",borderRadius:20}}

             onChangeText={(Val)=>setUsuario(Val)}
             maxLength={60}
             />
             <View style={{width:AnchoPantalla * (0.9),marginTop:50,flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
              <TouchableOpacity onPress={AccionCerrar} style={{backgroundColor:"#f53b57",width: (AnchoPantalla * (0.9)) * (0.40),padding:15,paddingLeft:10,paddingRight:10,borderRadius:12}}>
                <Text style={{textAlign:"center",fontSize:15,color:"white",fontSize: 14,fontFamily: "Viga-Regular"}}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>{
                MetodoCambiarUsuario(props.Usuario,Usuario,Matricula)
                AccionCerrar()
              }} style={{backgroundColor:"#3498db",width: (AnchoPantalla * (0.9)) * (0.40),padding:15,paddingLeft:10,paddingRight:10,borderRadius:12}}>
                <Text style={{textAlign:"center",fontSize:15,color:"white",fontSize: 14,fontFamily: "Viga-Regular"}}>Guardar</Text>
              </TouchableOpacity>

             </View>
          </View>
         </View>
    )
}


const BotonCambiarContraseña = (props) => {
	const dispatch = useDispatch();
  const datosDeCredencial = useSelector(store => store.datosDeCredencial);
	const [Matricula, setMatricula] = useState(props.Matricula)
    const [Contraseña, setContraseña] = useState(props.Contraseña)


    function PreparaEntrada(cadenaADividir) {
      if(cadenaADividir!==null && cadenaADividir!=="")
        {
         let i=0,aux=0;
		 for(i=0;i<cadenaADividir.length;i++){
			 if(cadenaADividir[i]==' '){
				 aux++;
			 }
		 }
		 if(aux==cadenaADividir.length){
			 return false;
		 }else{
			 return true;
		 }

      }else{
               return (false);
      }
    }

	function MetodoCambiarContraseña(Variable_Remplazar,Variable_Nueva,Matricula)
	{
			//alert("Valor a remplazar: " + Variable_Remplazar +"\n Valor Nuevo: "+ Variable_Nueva+"\nAla matricula: " +Matricula);

			if( Variable_Remplazar != Variable_Nueva && Variable_Remplazar!="" && PreparaEntrada(Variable_Nueva)){
					  fetch('http://backpack.sytes.net/servidorApp/php/datosDeCredencial/cambiarContraseña.php',{
						  method:'post',
						  header:{
							'Accept': 'application/json',
							'Content-type': 'application/json'
						  },
						  body:JSON.stringify({
							matricula:Matricula,
							contrasenia:Variable_Nueva
						  })

						})
						.then((response) => response.text())
						 .then((message)=>{
							console.log(message);
							dispatch(cambiarContrasenia(Variable_Nueva));
              let objetoAux = {

              matricula : datosDeCredencial.matricula,
              nombres : datosDeCredencial.nombreCompleto.nombres,
              apellidoPaterno : datosDeCredencial.nombreCompleto.apellidoPaterno,
              apellidoMaterno : datosDeCredencial.nombreCompleto.apellidoMaterno,
              usuario : datosDeCredencial.usuario,
              contrasenia : Variable_Nueva,
              especialidad : datosDeCredencial.especialidad,
              fechaDeNacimiento : datosDeCredencial.fechaDeNacimiento,
              genero : datosDeCredencial.genero,
              frase : datosDeCredencial.frase,
              rutaDeFoto : datosDeCredencial.rutaDeFoto,
              hobbies : datosDeCredencial.hobbies
              }
              console.log("valor del objeto desde Contraseña => ",objetoAux)
          //    dispatch(establecerDatosDeCredencialDesdeIniciarSesion(arregloAux));
             storeData(objetoAux)
             ToastAndroid.show('Cambiado exitosamente' , ToastAndroid.SHORT);
						 })
						 .catch((error)=>{
						 console.error(error);
             ToastAndroid.show('Hubo un error lo sentimos.' , ToastAndroid.SHORT);
						 });

			}	}

    const {AccionCerrar} = props;

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
         <View style={{backgroundColor:"#ecf0f1",borderWidth:1,borderColor:"black",borderRadius:20,width:AnchoPantalla * (0.9),height:AltoPantalla * (0.8),justifyContent:"center",alignItems:"center",alignSelf:"center",flexDirection:"column"}}>
          <View style={{backgroundColor:"#ecf0f1",width:(AnchoPantalla * (0.9)) * (0.7),marginTop:(AltoPantalla * (0.8))*(0.01),height:(AltoPantalla * (0.8))*(0.06),justifyContent:"space-around",alignItems:"center",alignSelf:"center",flexDirection:"row"}}>
            <Icon name='locked' type='fontisto' color='#7C4DFF'/>
            <Text style={{textAlign:"center",padding:8,fontSize: 14,fontFamily: "Viga-Regular"}}>Cambiar Contraseña</Text>
          </View>
          <View  style={{backgroundColor:null,width:AnchoPantalla * (0.9),marginTop:(AltoPantalla * (0.8))*(0.03),justifyContent:'flex-start',height: "90%",alignItems:"center",alignSelf:"center",flexDirection:"column"}}>

            <Text style={{textAlign:"center",padding:8,fontSize: 14,fontFamily: "Viga-Regular"}}>¿Cuál es tu Contraseña?{"\n"}{"\n"} {isEnabled ?  Contraseña : "Active el Switch Para mostrar" } </Text>
               <Switch
                trackColor={{ false: "#f53b57", true: "#05c46b" }}
                thumbColor={"#f1f2f6"}
                onValueChange={toggleSwitch}
                value={isEnabled}
                //style={{width:(AnchoPantalla * (0.9)) * (0.6),backgroundColor: "yellow",justifyContent: 'center',alignItems: 'center',alignSelf: 'center'}}
              />
            <TextInput
            textAlign={"center"}
            value={Contraseña}
             //style={{fontSize:18,borderWidth:1,borderColor:"#777",padding:8,margin:10,width:250,color:'#7C4DFF',borderRadius:20}}
             style={{borderWidth:1,borderColor:"#777",padding:8,margin:10,width: (AnchoPantalla * (0.9)) * (0.7),color:"#3498db",borderRadius:20}}
             //placeholder={"Cuentame..."}
             onChangeText={(Val)=>setContraseña(Val)}
             maxLength={15}
             secureTextEntry={true}
             />
             <View style={{width:AnchoPantalla * (0.9),marginTop:50,flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
              <TouchableOpacity onPress={AccionCerrar} style={{backgroundColor:"#f53b57",width: (AnchoPantalla * (0.9)) * (0.40),padding:15,paddingLeft:10,paddingRight:10,borderRadius:12}}>
                <Text style={{textAlign:"center",fontSize:15,color:"white",fontSize: 14,fontFamily: "Viga-Regular"}}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>{
                MetodoCambiarContraseña(props.Contraseña,Contraseña,Matricula)
                AccionCerrar()
              }} style={{backgroundColor:"#3498db",width: (AnchoPantalla * (0.9)) * (0.40),padding:15,paddingLeft:10,paddingRight:10,borderRadius:12}}>
                <Text style={{textAlign:"center",fontSize:15,color:"white",fontSize: 14,fontFamily: "Viga-Regular"}}>Guardar</Text>
              </TouchableOpacity>

             </View>
          </View>
         </View>
    )
}




const BotonCambiarFrase = (props) => {
	const dispatch = useDispatch();
  const datosDeCredencial = useSelector(store => store.datosDeCredencial);
	const [Matricula, setMatricula] = useState(props.Matricula)
    const [Frase, setFrase] = useState(props.Frase)


	function MetodoCambiarFrase(Variable_Remplazar,Variable_Nueva,Matricula)
	{
			//alert("Valor a remplazar: " + Variable_Remplazar +"\n Valor Nuevo: "+ Variable_Nueva+"\nAla matricula: " +Matricula);

			if( Variable_Remplazar != Variable_Nueva ){
					  fetch('http://backpack.sytes.net/servidorApp/php/datosDeCredencial/cambiarFrase.php',{
						  method:'post',
						  header:{
							'Accept': 'application/json',
							'Content-type': 'application/json'
						  },
						  body:JSON.stringify({
							matricula:Matricula,
							frase:Variable_Nueva
						  })

						})
						.then((response) => response.text())
						 .then((message)=>{
						   console.log(message);
						   dispatch(cambiarFrase(Variable_Nueva));
               let objetoAux = {

               matricula : datosDeCredencial.matricula,
               nombres : datosDeCredencial.nombreCompleto.nombres,
               apellidoPaterno : datosDeCredencial.nombreCompleto.apellidoPaterno,
               apellidoMaterno : datosDeCredencial.nombreCompleto.apellidoMaterno,
               usuario : datosDeCredencial.usuario,
               contrasenia : datosDeCredencial.contrasenia,
               especialidad : datosDeCredencial.especialidad,
               fechaDeNacimiento : datosDeCredencial.fechaDeNacimiento,
               genero : datosDeCredencial.genero,
               frase : Variable_Nueva,
               rutaDeFoto : datosDeCredencial.rutaDeFoto,
               hobbies : datosDeCredencial.hobbies
               }
               console.log("valor del objeto desde Frase => ",objetoAux)
           //    dispatch(establecerDatosDeCredencialDesdeIniciarSesion(arregloAux));
              storeData(objetoAux)
              ToastAndroid.show('Cambiado exitosamente' , ToastAndroid.SHORT);
						 })
						 .catch((error)=>{
						 console.error(error);
             ToastAndroid.show('Hubo un error lo sentimos.' , ToastAndroid.SHORT);
						 });

			}
	}

    const {AccionCerrar} = props;

		return (
         <View style={{backgroundColor:"#ecf0f1",borderWidth:1,borderColor:"black",borderRadius:20,width:AnchoPantalla * (0.9),height:AltoPantalla * (0.8),justifyContent:"center",alignItems:"center",alignSelf:"center",flexDirection:"column"}}>
         	<View  style={{backgroundColor:"#ecf0f1",width:(AnchoPantalla * (0.9)) * (0.5),marginTop: 10,height:30,justifyContent:"space-around",alignItems:"center",alignSelf:"center",flexDirection:"row"}}>
         		<Icon name='cloud' type="font-awesome" color='#3498db'/>
            <Text  style={{textAlign:"center",padding:8,fontSize: 14,fontFamily: "Viga-Regular"}}>Cambiar Frase</Text>
			    </View>
          <View style={{backgroundColor:null,width:AnchoPantalla * (0.9),justifyContent:'flex-start',height: "90%",alignItems:"center",alignSelf:"center",flexDirection:"column"}}>

            <Text style={{textAlign:"center",padding:8,marginTop:25,fontSize: 14,fontFamily: "Viga-Regular"}}>Dime, ¿Cuál es tu frase?{"\n"}Frase:{"\n"}{Frase}</Text>
            <TextInput
            textAlign={"center"}
            value={Frase}
             //style={{borderWidth:1,borderColor:"#777",padding:8,margin:10,width:250,color:"#3498db",borderRadius:20}}
             style={{borderWidth:1,borderColor:"#777",padding:8,margin:10,width: (AnchoPantalla * (0.9)) * (0.7),color:"#3498db",borderRadius:20}}
             //placeholder={"Cuentame..."}
             onChangeText={(Val)=>setFrase(Val)}
             maxLength={150}
             //multiline={true}
             //numberOfLines={3}
             />
             <View style={{width:AnchoPantalla * (0.9),marginTop:50,flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
              <TouchableOpacity onPress={AccionCerrar} style={{backgroundColor:"#f53b57",width: (AnchoPantalla * (0.9)) * (0.40),padding:15,paddingLeft:10,paddingRight:10,borderRadius:12}}>
                <Text  style={{textAlign:"center",fontSize:13,color:"white",fontFamily: "Viga-Regular"}}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>{
                MetodoCambiarFrase(props.Frase,Frase,Matricula)
                AccionCerrar()
              }} style={{backgroundColor:"#3498db",width: (AnchoPantalla * (0.9)) * (0.40),padding:15,paddingLeft:10,paddingRight:10,borderRadius:12}}>
                <Text  style={{textAlign:"center",fontSize:13,color:"white",fontFamily: "Viga-Regular"}}>Guardar</Text>
              </TouchableOpacity>

             </View>
          </View>
         </View>
		)
}

const BotonCambiarHobbies = (props) => {
	const dispatch = useDispatch();
  const datosDeCredencial = useSelector(store => store.datosDeCredencial);
	const [Matricula, setMatricula] = useState(props.Matricula)
  const [Hobbies, setHobbies] = useState(props.Hobbies)


	function MetodoCambiarHobbies(Variable_Remplazar,Variable_Nueva,Matricula)
	{
			//alert("Valor a remplazar: " + Variable_Remplazar +"\n Valor Nuevo: "+ Variable_Nueva+"\nAla matricula: " +Matricula);

			if( Variable_Remplazar != Variable_Nueva ){
					  fetch('http://backpack.sytes.net/servidorApp/php/datosDeCredencial/cambiarHobbies.php',{
						  method:'post',
						  header:{
							'Accept': 'application/json',
							'Content-type': 'application/json'
						  },
						  body:JSON.stringify({
							matricula:Matricula,
							hobbies:Variable_Nueva
						  })

						})
						.then((response) => response.text())
						 .then((message)=>{
						   console.log(message);
						   dispatch(cambiarHobbies(Variable_Nueva));
               let objetoAux = {

               matricula : datosDeCredencial.matricula,
               nombres : datosDeCredencial.nombreCompleto.nombres,
               apellidoPaterno : datosDeCredencial.nombreCompleto.apellidoPaterno,
               apellidoMaterno : datosDeCredencial.nombreCompleto.apellidoMaterno,
               usuario : datosDeCredencial.usuario,
               contrasenia : datosDeCredencial.contrasenia,
               especialidad : datosDeCredencial.especialidad,
               fechaDeNacimiento : datosDeCredencial.fechaDeNacimiento,
               genero : datosDeCredencial.genero,
               frase : datosDeCredencial.frase,
               rutaDeFoto : datosDeCredencial.rutaDeFoto,
               hobbies : Variable_Nueva
               }
               console.log("valor del objeto desde Hobbies => ",objetoAux)
           //    dispatch(establecerDatosDeCredencialDesdeIniciarSesion(arregloAux));
              storeData(objetoAux)
              ToastAndroid.show('Cambiado exitosamente' , ToastAndroid.SHORT);
						 })
						 .catch((error)=>{
						 console.error(error);
             ToastAndroid.show('Hubo un error lo sentimos.' , ToastAndroid.SHORT);
						 });

			}
	}

    const {AccionCerrar} = props;

    return (
         <View style={{backgroundColor:"#ecf0f1",borderWidth:1,borderColor:"black",borderRadius:20,width:AnchoPantalla * (0.9),height:AltoPantalla * (0.8),justifyContent:"center",alignItems:"center",alignSelf:"center",flexDirection:"column"}}>
          <View style={{backgroundColor:null,width:(AnchoPantalla * (0.9)) * (0.5),height: (AltoPantalla * (0.8))*(0.07),justifyContent:"space-around",alignItems:"center",alignSelf:"center",flexDirection:"row"}}>
            <Icon name='favorite' type='material' color='#e74c3c' size={28}/>
            <Text style={{textAlign:"center",padding:8,fontSize: 14,fontFamily: "Viga-Regular"}}>Hobbies</Text>
          </View>
          <View style={{backgroundColor:null,width:AnchoPantalla * (0.9),marginTop:(AltoPantalla * (0.8))*(0.03),justifyContent:'flex-start',height: (AltoPantalla * (0.8))*(0.9),alignItems:"center",alignSelf:"center",flexDirection:"column"}}>

            <Text style={{textAlign:"center",padding:8,fontSize: 14,fontFamily: "Viga-Regular"}}>Cuentame, ¿Cuales son tus hobbies?{"\n"}{Hobbies}</Text>
            <TextInput
            textAlign={"center"}
            value={Hobbies}
             style={{borderWidth:1,borderColor:"#777",padding:8,margin:10,width: (AnchoPantalla * (0.9)) * (0.7),color:"#3498db",borderRadius:20}}
             placeholder={"Cuentame..."}
             onChangeText={(Val)=>setHobbies(Val)}
             maxLength={178}
             />
             <View style={{width:AnchoPantalla * (0.9),marginTop:50,flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
              <TouchableOpacity onPress={AccionCerrar} style={{backgroundColor:"#f53b57",width: (AnchoPantalla * (0.9)) * (0.40),padding:15,paddingLeft:10,paddingRight:10,borderRadius:12}}>
                <Text  style={{textAlign:"center",fontSize:13,color:"white",fontFamily: "Viga-Regular"}}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>{
                MetodoCambiarHobbies(props.Hobbies,Hobbies,Matricula)
                AccionCerrar()
              }} style={{backgroundColor:"#3498db",width: (AnchoPantalla * (0.9)) * (0.40),padding:15,paddingLeft:10,paddingRight:10,borderRadius:12}}>
                <Text  style={{textAlign:"center",fontSize:13,color:"white",fontFamily: "Viga-Regular"}}>Guardar</Text>
              </TouchableOpacity>

             </View>
          </View>
         </View>
    )
}


const QuienesSomos = (props) => {
	//const [Matricula, setMatricula] = useState(props.Matricula)
  const {AccionCerrar} = props;
  return(

         <View style={{backgroundColor:"#ecf0f1",borderWidth:1,borderColor:"black",borderRadius:20,width:AnchoPantalla * (0.95),height:AltoPantalla * (0.80),justifyContent:"center",alignItems:"center",alignSelf:"center",flexDirection:"column"}}>
          <View style={{flexDirection:"column",justifyContent:"center",alignItems:"center",width:(AnchoPantalla * (0.95)) * (0.98),height:(AltoPantalla * (0.80)) * (0.95),padding:40,alignSelf:"center",borderRadius:40,backgroundColor:"#CFD8DC"}}>
           <View style={{width:AnchoPantalla * (0.95),height: (AltoPantalla * (0.8)) * (0.2),flexDirection:"row",justifyContent:'space-around',padding:20,alignItems:"center",backgroundColor:null}}>
            <Text style={{color:"#03A9F4",fontSize:17,fontWeight:"200",textAlign:"center"}}>¿Quiénes Somos?</Text>
            <Icon type="font-awesome" name="close" size={35} color="#52575D" onPress={AccionCerrar}/>
           </View>
           <View>
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
                                                       <Text style={{fontFamily: "Viga-Regular",fontSize: 15,margin:4,textAlign:"center", color: "#111"}}>-- De antemano nos disculpamos por los errores que pudieran surgir.</Text>
                                                       <Text style={{fontFamily: "Viga-Regular",fontSize: 15,margin:4,textAlign:"center", color: "#111"}}>-- BackPack está en fase de desarrollo así que los errores que se presenten serán resueltos en futuras versiones.</Text>
                                                       <Text style={{fontFamily: "Viga-Regular",fontSize: 15,margin:4,textAlign:"center", color: "#111"}}>-- Te sugerimos no poner datos relevantes como por ejemplo contraseñas u usuarios que uses en otro tipo de cuentas, asegúrate que sea al azar</Text>
                                                       <Text style={{fontFamily: "Viga-Regular",fontSize: 15,margin:4,textAlign:"center", color: "#111"}}>-- Si se hace uso indebido de la app se borrara la cuenta y contenido.</Text>
                                                       <Text style={{fontFamily: "Viga-Regular",fontSize: 15,margin:4,textAlign:"center", color: "#111"}}>No olvides: "aprende a ayudar y ayuda a aprender"</Text>
                                                       <Text style={{fontFamily: "Viga-Regular",fontSize: 15,margin:4,textAlign:"center", color: "#111"}}>Gracias y Bienvenidos sean todos a BackPack.</Text>
                                                  
                                                                                            
                                          
                                          
                                      </ScrollView>
           </View>
         </View>
         </View>
    );
}

export default BotonCambiarPerfil;
