import React,  {useRef,useState, useEffect} from 'react';
import {ActivityIndicator,TouchableOpacity,Text, View, StyleSheet, Alert, SafeAreaView, ScrollView, StatusBar, Dimensions, FlatList, Modal } from 'react-native';

import { Icon } from 'react-native-elements';
import { Button,SearchBar,ButtonGroup } from 'react-native-elements';
import ComponenteTiempo from "./componentes/componenteTiemposDesplegable"



const Main = () => {

    return(
        <Menu/>
    )
}
export default Main;

const Menu = () => {
    const [index, setSelected] = useState(0)
    const updateIndex = (index) => {
        setSelected(index)
    }
    
    const component1 = () => <Text>Past</Text>
    const component2 = () => <Text>Present</Text>
    const component3 = () => <Text>Future</Text>
    

    const buttons = [{ element: component1 }, { element: component2 },{element : component3}]

	return(
		<View style={{width:"100%",height:"100%"}}>
            <ButtonGroup
            onPress={updateIndex}
            selectedIndex={index}
            buttons={buttons}
            />
            <DevuelveApartado index={index}/>
		</View>
	);
}

const DevuelveApartado = (props) => {
    const {index} = props;
    if(index===0){
      return(
        <>
            <ScrollView style={{backgroundColor:"rgba(218, 218, 218, 0.91)"}}>
                <Text>Past</Text>
                <ComponenteTiempo/>
            </ScrollView>
        </>
  
        );
    }
    else if(index === 1){
      return(
        <>
            <ScrollView style={{backgroundColor:"rgba(218, 218, 218, 0.91)"}}>
                <Text>Present</Text>
            </ScrollView>
        </>
        );
    }
    else{
      return(
          <>
            <ScrollView style={{backgroundColor:"rgba(218, 218, 218, 0.91)"}}>
                    <Text>Future</Text>
            </ScrollView>
          </>
      );
    }
  }


