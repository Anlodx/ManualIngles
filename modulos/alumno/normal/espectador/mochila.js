//SE SUPONE QUE ESTE ES EL mochila.js PERO PARA VISITANTE

import React,{Component,useState, componentDidMount,useEffect} from 'react';
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
  TextInput
} from 'react-native';
import { Icon } from 'react-native-elements';

import { Button,SearchBar,ButtonGroup } from 'react-native-elements';

import CredencialVistaGlobalUsuarioVisitante from "./CredencialVistaGlobalUsuarioVisitante.js"

import ApartadosDeMochila from "./apartadosDeMochila.js";

import Logros from "./logros.js";

import {useSelector, useDispatch} from 'react-redux';


const DevuelveApartado = (props) =>{
  const {index} = props;
  const [ModalLogro, setModalLogro] = useState(false)

  const [update, setUpdate] = useState(true);

  useEffect(()=>{
   // console.log("renderizando devuelve apartado desde mochila visitante");
    setUpdate(!update);
  },[props]);
return(
<>
{
  (index === 0) ?
        <>
            <ApartadosDeMochila />


        </>
    : (index === 1) ?

        <>
            <CredencialVistaGlobalUsuarioVisitante data={props.data}/>
            <>{console.log("Estas son las props => ", props)}</>
        </>
      : (index === 2) ?
      <>
      <View style={{flex:1}}>
        <View style={{width:"100%",justifyContent:"center",alignItems:"center",backgroundColor:"#fff"}}>
          <Text style={{textAlign:"center",padding:4,color:"#485460"}}>"Una foto dice más que mil palabras"</Text>
        </View>

        <Logros data={props.data}/>

        <View style={{width:"100%",height:10}}/>

        <>{console.log("Estas son las props => ", props)}</>

      </View>
      </>
      : null
    }
    </>
  )

}








const  MochilaVisitante = (props) => {
  const variablesDentroDeMochila = useSelector(store => store.variablesDentroDeMochila);
  useEffect(()=>{
      console.log("renderizamos mochila visitante con variables : ",variablesDentroDeMochila)
  },[variablesDentroDeMochila.matriculaDelPropietario,props])

  const [state,setState] = useState({
    selectedIndex: 0
  })

function updateIndex (selectedIndex) {
  setState({...state,selectedIndex:selectedIndex})
}


const component1 = () =>   <Icon name='webpack' type="fontisto" color='#E91E63' size={30}/>
const component2 = () =>   <Icon name='id-card' type="font-awesome" color='#00BCD4' size={30}/>
const component3 = () =>   <Icon name='trophy' type="entypo" color='#FFC107' size={30}/>

  const buttons = [{ element: component1 }, { element: component2 }, { element: component3 }]
  const { selectedIndex } = state
  return (
    <View style={{width:"100%",height:"100%"}}>
      <View style={{width:"100%",justifyContent:"center",alignItems:"center",backgroundColor:"#222f3e",padding:10}}>
        <Text style={{textAlign:"center",padding:4,color:"#fff",fontFamily: "Viga-Regular"}}>Bienvenido A Mochila visitante</Text>
      </View>

      <ButtonGroup
        onPress={updateIndex}
        selectedIndex={selectedIndex}
        buttons={buttons}
        selectedButtonStyle={{backgroundColor:"none",borderBottomWidth:3,borderBottomColor:"#00E676"}}
        containerStyle={{borderRadius:15}}
        innerBorderStyle={{width:0}}
         />

         <DevuelveApartado index={selectedIndex} data={props.route.params}/>

         <>{console.log("Matricula Del Propietario: ", variablesDentroDeMochila.matriculaDelPropietario)}</>


      </View>
  )

}


export default MochilaVisitante;
