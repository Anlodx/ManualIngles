import React,  {useRef,useState, useEffect} from 'react';
import {ActivityIndicator,TouchableOpacity,Text, View, StyleSheet, Alert, SafeAreaView, ScrollView, StatusBar, Dimensions, FlatList, Modal } from 'react-native';

import { Icon } from 'react-native-elements';

import { Button,SearchBar,ButtonGroup } from 'react-native-elements';
import Tts from 'react-native-tts';
const  WIDTH = Dimensions.get("screen").width;
const  HEIGHT = Dimensions.get("screen").height;
const Main = (props) => {
    const {objeto} = props;

    return(
        <View style={{width: WIDTH * 0.9, flexDirection:"row",alignItems:"center",justifyContent:"space-around", padding: 12, backgroundColor:"#fff", alignSelf:"center",borderRadius:5,borderWidth:1,borderColor:"rgba(1,1,1,0.3)"}}>
	    
            
            <View style={{flexDirection:"row",width: WIDTH * 0.9 * 0.8,flexWrap:"wrap",borderRadius:5,alignSelf:"center",padding:6,justifyContent:"space-around",alignItems:"center"}}>
                <Text style={{color:"#ff6b81",fontWeight:"bold",textAlign:"center"}}>{objeto.verb}</Text>
                <Text style={{fontWeight:"bold",textAlign:"center",color:"#686de0"}}>{objeto.meaning}</Text>
            </View>
            <Icon onPress={()=>speak(objeto.verb)} name='play-outline' type="material-community" color='#74b9ff' size={28} 
            //containerStyle={{padding:10,marginLeft:10,marginRight:10}}
            />
        </View>
    )
}


const  speak = (texto) => {
    Tts.setDefaultRate(0.3);
    Tts.setDefaultLanguage('en-US');
    //Tts.setDefaultVoice('com.apple.ttsbundle.Samantha-compact');
    Tts.getInitStatus().then(() => {
        Tts.speak(texto);
    });
    Tts.stop();

}
export default Main;

