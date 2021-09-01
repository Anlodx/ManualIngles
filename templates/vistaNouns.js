import React,  {useRef,useState, useEffect} from 'react';
import {ActivityIndicator,TouchableOpacity,Text, View, StyleSheet, Alert, SafeAreaView, ScrollView, StatusBar, Dimensions, FlatList, Modal } from 'react-native';

import {Nouns} from "./nouns";
import { LinearProgress  } from 'react-native-elements';

const  WIDTH = Dimensions.get("screen").width;
const  HEIGHT = Dimensions.get("screen").height;


function retornaVector(){
    let cantidadNumeros = 199;
    let array = [];
    while(array.length<40){
         let numeroAleatorio = Math.ceil(Math.random() * cantidadNumeros);
         let existe = false;
         for(let i = 0; i < array.length; i++){
             if(array[i] == numeroAleatorio){
                 existe = true;
                 break;
             }
         }
         if(existe == false){
            array[array.length] = numeroAleatorio;
         }
    }
    return array;
 }
 
 

const Main = () => {
    
    const [nouns,setNouns] = useState([]);
    useEffect(()=>{
	console.log("useEffect acabo xd")
	let auxNouns = retornaVector()
        
	setNouns(auxNouns)

    },[]);
    return(
        <>

        <Text style={{width:WIDTH,textAlign:"center",fontSize:17,fontWeight:"bold", color:"#0984e3" }}>Sustantivos</Text>
        
	    <FlatList
		data={nouns}
	    	keyExtractor={item => item}
	        ListHeaderComponent={()=><View style={{width: WIDTH, paddingTop:20}}/>}
	        ListFooterComponent={()=><View style={{width: WIDTH, paddingTop:20}}/>}
	    	ItemSeparatorComponent={()=><View style={{width: WIDTH, paddingTop:15}}/>}
	        ListEmptyComponent={()=>(
                <View style={{width:WIDTH * 0.8 , padding: 15, backgroundColor: "#feca57",alignSelf:"center", borderRadius:10,marginTop:10}}>
                    <Text style={{textAlign:"center"}}>Espere un momento...</Text>
                    <LinearProgress color="black" />
                </View>
            )}
	    	renderItem={({item})=>{
            
                return(
                    <ComponenteNoun objeto={Nouns[item]}/>
                )
            }}
	    />
	    
        </>
    )
}
const ComponenteNoun = (props) => {
    const {objeto} = props;
    const [hide,setHide] = useState(true)
    const toggleButton = () =>{
        setHide(!hide);
    }
    return(
        <TouchableOpacity onPress={toggleButton} style={{width: WIDTH * 0.6, padding: 12, backgroundColor:"#55efc4", alignSelf:"center",borderRadius:5}}>
	    
            <Text style={{fontWeight:"bold",textAlign:"center"}}>{objeto.noun}</Text>
            <View style={{display: hide ? "none" : "flex", borderRadius:5, backgroundColor:"#ff6b6b",alignSelf:"center",padding:6,justifyContent:"center",alignItems:"center"}}>
                <Text style={{fontWeight:"bold",textAlign:"center",color:"white"}}>{objeto.meaning}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default Main;
