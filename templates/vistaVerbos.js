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

        
        
	    <FlatList
		data={verbos}
	    	keyExtractor={item => item}
            refreshControl={<RefreshControl colors={["#feca57","#ff6b6b","#48dbfb","#1dd1a1"]} refreshing={refresh} onRefresh={update} />}
	        ListHeaderComponent={()=><ComponenteModal titulo={"Verbos"} subtitulo={"Los verbos son aquellas acciones ejecutadas por un sustantivo, por ejemplo: \"una persona escribe\", \"escribe\" es el verbo, ya que es la acción realizada por el sujeto."}/>}
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



const ComponenteModal = (props) => {
	const {titulo,subtitulo} = props;
	const [visible,setVisible] = useState(false)
	return(
        <>
        <Text onPress={()=>setVisible(true)} style={{margin:4, textAlign:"center",fontSize:15,fontWeight:"bold", color:"#0984e3" }}>{titulo}</Text>
        <Text onPress={()=>setVisible(true)} style={{margin:1, textAlign:"center",fontSize:13,fontWeight:"bold", color:"rgba(1,1,1,0.3)" }}>pulsa para detalles</Text>
        <Text style={{marginBottom:3, textAlign:"center",fontSize:13,fontWeight:"bold", color:"rgba(1,1,1,0.3)" }}>Jala hacia abajo la lista para recargar</Text>
		<Modal visible={visible} onRequestClose={()=>setVisible(false)} transparent={true}>
	         <View style={{width:WIDTH,height: HEIGHT,backgroundColor:"rgba(1,1,1,0.3)",justifyContent:"center",alignItems:"center"}}>

			<View style={{width:WIDTH * 0.95,padding:20,alignSelf:"center", backgroundColor:"white",alignItems:"center",justifyContent:"space-around",borderRadius:5}}>
			<Text style={{margin:4, textAlign:"center",fontSize:15,fontWeight:"bold", color:"#0984e3" }}>{titulo}</Text>
    		<Text style={{margin:4, textAlign:"center",fontSize:15,fontWeight:"bold", color:"#353b48" }}>{subtitulo}</Text>
				
				<TouchableOpacity style={{margin:4, alignSelf:"center",padding:6,backgroundColor:"#ff6b6b", width: WIDTH * 0.9 * 0.25, justifyContent:"center", borderRadius:5, marginTop:5}} onPress={()=>setVisible(false)}>
					<Text style={{textAlign:"center",fontWeight:"bold",color:"white"}}>Volver</Text>
				</TouchableOpacity>
			</View>
		</View>
		</Modal>
        </>
	)
}


export default Main;
