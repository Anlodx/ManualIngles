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
import AQuienesSigoView from "./aQuienesSiguesView";
import QuienesMeSiguenView from './quienesMeSiguenView';

import {useSelector} from 'react-redux';


import {traerDatosDeLibretasAVariablesDentroDeMochilaEnApartadoElegido} from './../../../store/actions.js';




const Seguidores = () => {


	const [selectedIndex, setSelectedIndex] = useState(0);
  const [datosEspecificosS, modificarDatosEspecificosS] = useState({
    modalAQuienesSigo : false,
    modalQuienesMeSiguen : false
  });



	const datosDeCredencial = useSelector(store => store.datosDeCredencial);

	const updateIndex = (index) => {
		setSelectedIndex(index);
	};

const component1 = () =><Icon name='wifi' type="material-community" color='#FFC107' size={30} containerStyle={{transform: [{ rotate: "180deg" }]}}/>
const component2 = () =><Icon name='wifi' type="material-community" color='#00BCD4' size={30} />

const buttons = [{ element: component1 }, { element: component2 }]

	return(
		<View style={{width:"100%",height:"100%"}}>

    <ButtonGroup
      onPress={updateIndex}
      selectedIndex={selectedIndex}
      buttons={buttons}
       />

      <>
      {
      //<CredencialVistaGlobalUsuarioPropietarioAjustes data={datosDeCredencial}/>
      }
      </>
      <DevuelveApartado index={selectedIndex} data={datosDeCredencial} />
		</View>
	);
}
export default Seguidores;


const DevuelveApartado = (props) => {//Aqui me quede 14/11/2020 11:19 a.m.
  const {index} = props;


  if(index===0){
    return(


      <>

       <ScrollView style={{backgroundColor:"rgba(218, 218, 218, 0.91)"}}>
          <QuienesMeSiguenView matricula={props.data.matricula} cerrarModal={null}/>
        </ScrollView>
      </>


      );
  }
  else if(index === 1){
	//ESTO TIENE QUE VER CON LOGROS

    return(

      <>
      <ScrollView style={{backgroundColor:"rgba(218, 218, 218, 0.91)"}}>
        <AQuienesSigoView matricula={props.data.matricula} cerrarModal={null}/>
        </ScrollView>
      </>
      );
  }
  else{
    return(null);
  }
}
