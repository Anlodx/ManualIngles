import React,  {useRef,useState, useEffect} from 'react';
import {ActivityIndicator,TouchableOpacity,Text, View, StyleSheet, Alert, SafeAreaView, ScrollView, StatusBar, Dimensions, FlatList, Modal } from 'react-native';

import {verbosInfinitivo} from "./verbosInfinitivo";
import { LinearProgress  } from 'react-native-elements';
import ComponenteVerbo from "./componentes/componenteTiemposDesplegable"
const  WIDTH = Dimensions.get("screen").width;
const  HEIGHT = Dimensions.get("screen").height;



const Main = () => {
    
    const [verbos,setVerbos] = useState([]);
    useEffect(()=>{
	console.log("useEffect acabo xd")
	
        
	setVerbos(verbosInfinitivo)

    },[]);
    return(
        <>

        <Text style={{width:WIDTH,textAlign:"center",fontSize:17,fontWeight:"bold", color:"#0984e3" }}>Verbos en infinitivo</Text>
        
	    <FlatList
		    data={verbos}
	    	keyExtractor={item => item.verbo}
	    	ItemSeparatorComponent={()=><View style={{width: WIDTH, paddingTop:10}}/>}
            ListEmptyComponent={()=>(
                <View style={{width:WIDTH * 0.8 , padding: 15, backgroundColor: "#fa8231",alignSelf:"center", borderRadius:10,marginTop:10}}>
                    <Text style={{textAlign:"center"}}>Espere un momento...</Text>
                    <LinearProgress color="primary" />
                </View>
            )}
	    	renderItem={({item})=>{
            
                return(
                    <ComponenteVerbo objeto={item}/>
                )
            }}
	    />
	    
        </>
    )
}


export default Main;