import React,  {useRef,useState, useEffect} from 'react';
import {RefreshControl,ActivityIndicator,TouchableOpacity,Text, View, StyleSheet, Alert, SafeAreaView, ScrollView, StatusBar, Dimensions, FlatList, Modal } from 'react-native';
import { Icon } from 'react-native-elements';
import Tts from 'react-native-tts';
import {Nouns} from "./nouns";
import { LinearProgress, Tooltip } from 'react-native-elements';

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
    const [refresh,setRefresh] = useState(false)
    useEffect(()=>{
	console.log("useEffect acabo xd Nouns")
	let auxNouns = retornaVector()
        
	setNouns(auxNouns)

    },[]);

    const update = () => {
        setRefresh(true)
        let newNouns = retornaVector()
        
	    setNouns(newNouns)
        setRefresh(false)
    }

    return(
        <>

        
        
	    <FlatList
		data={nouns}
	    	keyExtractor={item => item}
            refreshControl={<RefreshControl colors={["#feca57","#ff6b6b","#48dbfb","#1dd1a1"]} refreshing={refresh} onRefresh={update} />}
	        ListHeaderComponent={()=><ComponenteModal titulo={"Sustantivos"} subtitulo={"Los Sustantivos o nouns en ingles son objetos que podemos encontrar en la vida diaria, por ejemplo: una computadora, un libro, una idea, una estación de gas o hasta un perrito, como puedes entender un noun puede ser cualquier cosa que te imagines, es vital que sepas los nouns básicos y así ampliar tu vocabulario en el idioma ingles."}/>}
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
    
    return(
        <View style={{width: WIDTH * 0.9, flexDirection:"row",alignItems:"center",justifyContent:"space-around", padding: 12, backgroundColor:"#fff", alignSelf:"center",borderRadius:5,borderWidth:1,borderColor:"rgba(1,1,1,0.3)"}}>
	    
            
            <View style={{flexDirection:"row",width: WIDTH * 0.9 * 0.8,flexWrap:"wrap",borderRadius:5,alignSelf:"center",padding:6,justifyContent:"space-around",alignItems:"center"}}>
                <Text style={{color:"#1e90ff",fontWeight:"bold",textAlign:"center"}}>{objeto.noun}</Text>
                <Text style={{fontWeight:"bold",textAlign:"center",color:"#ff6b81"}}>{objeto.meaning}</Text>
            </View>
            <Icon onPress={()=>speak(objeto.noun)} name='play-outline' type="material-community" color='#2f3542' size={28} 
            //containerStyle={{padding:10,marginLeft:10,marginRight:10}}
            />
        </View>
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
