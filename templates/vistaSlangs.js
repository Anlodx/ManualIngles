import React,  {useRef,useState, useEffect} from 'react';
import {ActivityIndicator,TouchableOpacity,Text, View, StyleSheet, Alert, SafeAreaView, ScrollView, StatusBar, Dimensions, FlatList, Modal } from 'react-native';

import {slangsSimples} from "./slangs";
import { LinearProgress  } from 'react-native-elements';
const  WIDTH = Dimensions.get("screen").width;
const  HEIGHT = Dimensions.get("screen").height;



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
    useEffect(()=>{
        console.log("useEffect acabo xd")
	let slangsAElegir = retornaVector();


        setSlangs(slangsAElegir)

    },[]);
    return(
        <>

        <Text style={{width:WIDTH,textAlign:"center",fontSize:17,fontWeight:"bold", color:"#0984e3" }}>Slangs</Text>

            <FlatList
                data={slangs}
                keyExtractor={item => item.verb}
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
                    <View key={item} style={{width: WIDTH * 0.8, padding:10, backgroundColor: "#fff", alignSelf:"center",borderRadius:5,borderWidth: 1,borderColor:"rgba(1,1,1,0.3)",elevation:3}}>
			<Text style={{textAlign:"center",color:"#111", fontWeight:"bold",fontSize:14}}>{slangsSimples[item].slang} </Text>
			<Text style={{textAlign:"center",color:"#ffa502",fontWeight:"bold",fontSize:12}}>{slangsSimples[item].meaning} </Text>
		    </View>
                )
            }}
            />

        </>
    )
}


export default Main;

