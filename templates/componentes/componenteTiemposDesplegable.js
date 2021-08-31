import React,  {useRef,useState, useEffect} from 'react';
import {ActivityIndicator,TouchableOpacity,Text, View, StyleSheet, Alert, SafeAreaView, ScrollView, StatusBar, Dimensions, FlatList, Modal } from 'react-native';

import { Icon } from 'react-native-elements';

import { Button,SearchBar,ButtonGroup } from 'react-native-elements';

const  WIDTH = Dimensions.get("screen").width;
const  HEIGHT = Dimensions.get("screen").height;
const Main = (props) => {
    const {objeto} = props;
    const [hide,setHide] = useState(true)
    const toggleButton = () =>{
        setHide(!hide);
    }
    return(
        <TouchableOpacity onPress={toggleButton} style={{ padding: 10, backgroundColor:"#feca57", alignSelf:"center",borderRadius:5}}>
            <Text style={{fontWeight:"bold",textAlign:"center"}}>{objeto.verb}</Text>
            <View style={{display: hide ? "none" : "flex", borderRadius:5, backgroundColor:"#ff9f43",alignSelf:"center",padding:6,justifyContent:"center",alignItems:"center"}}>
                <Text style={{fontWeight:"bold",textAlign:"center"}}>{objeto.meaning}</Text>
            </View>
        </TouchableOpacity>
    )
}
export default Main;

