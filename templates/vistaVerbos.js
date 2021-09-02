import React,  {useRef,useState, useEffect} from 'react';
import {RefreshControl,ActivityIndicator,TouchableOpacity,Text, View, StyleSheet, Alert, SafeAreaView, ScrollView, StatusBar, Dimensions, FlatList, Modal } from 'react-native';

import {verbosInfinitivo} from "./verbosInfinitivo";
import { LinearProgress  } from 'react-native-elements';
import ComponenteVerbo from "./componentes/componenteTiemposDesplegable"
import Tts from 'react-native-tts';
const  WIDTH = Dimensions.get("screen").width;
const  HEIGHT = Dimensions.get("screen").height;

function retornaVector(){
   let cantidadNumeros = 115;
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
    
    const [verbos,setVerbos] = useState([]);
    const [refresh,setRefresh] = useState(false)
    useEffect(()=>{
	console.log("useEffect acabo xd verbos")
	let verbosAux = retornaVector()	
        
	setVerbos(verbosAux)

    },[]);

    
    
    const update = () => {
        setRefresh(true)
        let verbosNuevos = retornaVector()	
        
    	setVerbos(verbosNuevos)

        setRefresh(false)
    }
    return(
        <>

        <Text style={{width:WIDTH,textAlign:"center",fontSize:17,fontWeight:"bold", color:"#0984e3" }}>Verbos en infinitivo</Text>
        
	    <FlatList
		data={verbos}
	    	keyExtractor={item => item}
            refreshControl={<RefreshControl colors={["#feca57","#ff6b6b","#48dbfb","#1dd1a1"]} refreshing={refresh} onRefresh={update} />}
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
                    <ComponenteVerbo objeto={verbosInfinitivo[item]}/>
                )
            }}
	    />
	    
        </>
    )
}


export default Main;
