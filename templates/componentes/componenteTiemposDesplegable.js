import React,  {useRef,useState, useEffect} from 'react';
import {ActivityIndicator,TouchableOpacity,Text, View, StyleSheet, Alert, SafeAreaView, ScrollView, StatusBar, Dimensions, FlatList, Modal } from 'react-native';

import { Icon } from 'react-native-elements';

import { Button,SearchBar,ButtonGroup } from 'react-native-elements';

const  WIDTH = Dimensions.get("screen").width;
const  HEIGHT = Dimensions.get("screen").height;
const Main = () => {
    const [hide,setHide] = useState(true)
    const toggleButton = () =>{
        setHide(!hide);
    }
    return(
        <TouchableOpacity onPress={toggleButton} style={{width: WIDTH * 0.9, padding: 5, backgroundColor:"red", alignSelf:"center",borderRadius:5}}>
            <Text>Present simple</Text>
            <View style={{display: hide ? "none" : "flex", backgroundColor:"yellow",alignSelf:"center",width:WIDTH * 0.9,justifyContent:"center",alignItems:"center"}}>
                <Text>subject + verb + complement</Text>
            </View>
        </TouchableOpacity>
    )
}
export default Main;

