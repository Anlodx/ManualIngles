import React,  {useRef,useState, useEffect} from 'react';
import {RefreshControl, ActivityIndicator,TouchableOpacity,Text, View, StyleSheet, Alert, SafeAreaView, ScrollView, StatusBar, Dimensions, FlatList, Modal } from 'react-native';

import {slangsSimples} from "./slangs";
import { LinearProgress  } from 'react-native-elements';
const  WIDTH = Dimensions.get("screen").width;
const  HEIGHT = Dimensions.get("screen").height;
import Tts from 'react-native-tts';


function retornaVector(){
   let cantidadNumeros = 145;
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

    const [slangs,setSlangs] = useState([]);
    const [refresh,setRefresh] = useState(false)
    useEffect(()=>{
        console.log("useEffect acabo xd slangs")
	let slangsAElegir = retornaVector();


        setSlangs(slangsAElegir)

    },[]);

    
    const update = () => {
        setRefresh(true)
        let slangsNuevos = retornaVector();


        setSlangs(slangsNuevos)
        setRefresh(false)
    }

    return(
        <>

        

            <FlatList
                data={slangs}
                refreshControl={<RefreshControl colors={["#feca57","#ff6b6b","#48dbfb","#1dd1a1"]} refreshing={refresh} onRefresh={update} />}
                keyExtractor={item => item.verb}
                ListHeaderComponent={()=><ComponenteModal titulo={"Slangs"} subtitulo={"Los Slangs son frases coloquiales o modismos, en español los podriamos definir como los \"dichos\"."}/>}
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
                    <TouchableOpacity  onPress={()=>speak(slangsSimples[item].slang)} key={item} style={{width: WIDTH * 0.8, padding:10, backgroundColor: "#fff", alignSelf:"center",borderRadius:5,borderWidth: 1,borderColor:"rgba(1,1,1,0.3)",elevation:3}}>
			<Text style={{textAlign:"center",color:"#111", fontWeight:"bold",fontSize:14}}>{slangsSimples[item].slang} </Text>
			<Text style={{textAlign:"center",color:"#ffa502",fontWeight:"bold",fontSize:12}}>{slangsSimples[item].meaning} </Text>
		    </TouchableOpacity>
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

