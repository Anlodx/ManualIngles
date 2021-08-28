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
  FlatList,
  Modal,
  Image,
  Switch,
  TextInput,
  Dimensions,
  TouchableNativeFeedback,
  Alert
} from 'react-native';
import { Icon } from 'react-native-elements';

import { Button,SearchBar,ButtonGroup } from 'react-native-elements';
import Icon2 from 'react-native-vector-icons/MaterialIcons';

import CredencialVistaGlobalUsuarioPropietarioAjustes from "./credencialVistaGlobalUsuarioPropietarioAjustes";

import ApartadosDeMochila from "./apartadosDeMochila.js";

import Logros from "./logros.js";

import {useSelector, useDispatch} from 'react-redux';

import {Fecha} from './../../global/codigosJS/Metodos.js';
import {traerDatosDeLibretasAVariablesDentroDeMochilaEnApartadoElegido} from './../../../store/actions.js';
import {establecerMatriculaDelPropietarioDeLaMochila} from '../../../store/actions.js';





const DevuelveApartado = (props) => {//Aqui me quede 14/11/2020 11:19 a.m.
	
	
  const {index} = props;
  const [ModalLogro, setModalLogro] = useState(false);
  if(index===0){
    return(<ApartadosDeMochila />);
  }
  else if(index===1){
    return(

      <CredencialVistaGlobalUsuarioPropietarioAjustes data={props.data}/>


      );
  }
  else{
	//ESTO TIENE QUE VER CON LOGROS 
	  
    return(
      <View style={{flex:1}}>
        <View style={{width:"100%",justifyContent:"center",alignItems:"center",backgroundColor:"#fff"}}>
          <Text style={{textAlign:"center",padding:4,color:"#485460"}}>"Una foto dice más que mil palabras"</Text>
        </View>
        <Logros data={props.data}/>
    
      </View>
      );
  }
}










const MochilaPropietario = () => {
	
	const dispatch = useDispatch();
	const [selectedIndex, setSelectedIndex] = useState(0);
	
	
	const datosDeCredencial = useSelector(store => store.datosDeCredencial);
	
	const updateIndex = (index) => {
		setSelectedIndex(index);
	};
	const component1 = () => <Icon name='webpack' type="fontisto" color='#E91E63' size={30}/>
	const component2 = () =>   <Icon name='id-card' type="font-awesome" color='#00BCD4' size={30}/>
	const component3 = () =>   <Icon name='trophy' type="entypo" color='#FFC107' size={30}/>
	const buttons = [{ element: component1 }, { element: component2 }, { element: component3 }];
	
  useEffect(()=>{
    console.log("Renderize mochila debido al problema")
    dispatch(establecerMatriculaDelPropietarioDeLaMochila(datosDeCredencial.matricula));
  },[]);
	
	return(
		<View style={{width:"100%",height:"100%"}}>
			<ButtonGroup
				onPress={updateIndex}
				selectedIndex={selectedIndex}
				buttons={buttons}
				selectedButtonStyle={{backgroundColor:"none",borderBottomWidth:3,borderBottomColor:"#00E676"}}
				containerStyle={{borderRadius:15}}
				innerBorderStyle={{width:0}}
			/>
	
			<DevuelveApartado index={selectedIndex} data={datosDeCredencial} />
			
		</View> 
	);
}





export default MochilaPropietario;


  const NuevoLogro = (props) =>{

    const [Logro, setLogro] = useState({
      Descripcion:null,
      src:null
    })
    const [Ubiacacion, setUbicacion] = useState("Descripcion")

    switch(Ubiacacion){
      case "Descripcion": 
      return(
       <View style={{backgroundColor:"#ecf0f1",borderWidth:1,borderColor:"black",borderRadius:60/2,width:360,height:450,justifyContent:"center",alignItems:"center",alignSelf:"center",flexDirection:"column"}}>
          <View style={{backgroundColor:"#ecf0f1",width:"70%",height:30,justifyContent:"space-around",alignItems:"center",alignSelf:"center",flexDirection:"row"}}>
            <Icon type="material-community" name="trophy-award" size={37} color={"#ffa801"}/>
            <Text>Descripcion de tu logro: </Text>
          </View>
          <View style={{backgroundColor:"#ecf0f1",width:"100%",height:"70%",justifyContent:"space-around",alignItems:"center",alignSelf:"center",flexDirection:"column"}}>

            <Text style={{textAlign:"center",padding:8}}>Esto aparecera en la Descripcion:{"\n"}{Logro.Descripcion}</Text>
            <TextInput
            textAlign={"center"}
            value={Logro.Descripcion}
             style={{borderWidth:1,borderColor:"#777",padding:8,margin:10,width:250,color:"#3498db",borderRadius:20}}
             placeholder={"Cuentame..."}
             onChangeText={(Val)=>setLogro({...Logro,Descripcion:Val})}
             maxLength={60}
             />
             <View style={{width:"100%",flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
              <TouchableOpacity onPress={props.CerrarModal} style={{backgroundColor:"#f53b57",padding:18,paddingLeft:25,paddingRight:25,borderRadius:16}}>
                <Text style={{textAlign:"center",fontSize:15,color:"white"}}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>setUbicacion("Foto")} style={{backgroundColor:"#3c40c6",padding:18,paddingLeft:25,paddingRight:25,borderRadius:16}}>
                <Text style={{textAlign:"center",fontSize:15,color:"white"}}>Guardar</Text>
              </TouchableOpacity>
              
             </View>
          </View>
         </View>            
    );break;

      case "Foto": 
      return(

           <View style={{backgroundColor:"#ecf0f1",borderWidth:1,borderColor:"black",borderRadius:60/2,width:360,height:450,justifyContent:"space-around",alignItems:"center",alignSelf:"center",flexDirection:"column"}}>
            
            <View style={{backgroundColor:"#ecf0f1",width:"40%",height:30,justifyContent:"space-around",alignItems:"center",alignSelf:"center",flexDirection:"row"}}>
              <Icon name='photo' type="font-awesome" color='#5f27cd' size={30}/>
              <Text>Foto de Perfil</Text>
            </View>
          
            <View style={{width: 250,height: 250,borderRadius: 100,overflow: "hidden"}}>
              <Image source={require("../../../assets/media2.jpg")} style={{flex: 1,height: undefined,width: undefined}} resizeMode="center"></Image>
            </View>

            <View style={{width:"100%",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
              <TouchableOpacity onPress={null} style={{backgroundColor:"#feca57",padding:18,paddingLeft:30,paddingRight:30,borderRadius:16,flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
                <Icon name='plus' type="font-awesome" color='#5f27cd' size={30}/>
                <Text style={{textAlign:"center",fontSize:15,color:"white",marginLeft:15}}>Nueva</Text>
              </TouchableOpacity>              
            </View>
            
            <View style={{width:"100%",flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
              <TouchableOpacity onPress={()=>setUbicacion("Descripcion")} style={{backgroundColor:"#f53b57",padding:18,paddingLeft:25,paddingRight:25,borderRadius:16}}>
              <Text style={{textAlign:"center",fontSize:15,color:"white"}}>Cancelar</Text>
             </TouchableOpacity>

            <TouchableOpacity onPress={()=>alert(Logro.Descripcion+" "+Logro.src)} style={{backgroundColor:"#3c40c6",padding:18,paddingLeft:25,paddingRight:25,borderRadius:16}}>
              <Text style={{textAlign:"center",fontSize:15,color:"white"}}>Guardar</Text>
              </TouchableOpacity>
             </View>

          </View>            
    );break;
    }
  }
