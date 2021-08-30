import React,  {useRef,useState, useEffect} from 'react';
import {ActivityIndicator,TouchableOpacity,Text, View, StyleSheet, Alert, SafeAreaView, ScrollView, StatusBar, Dimensions, FlatList, Modal } from 'react-native';

import { Icon } from 'react-native-elements';
import {verbosInfinitivo} from "./verbosInfinitivo";
import {verbosDistractores} from "./palabrasDistractoras";
import { Button,SearchBar,ButtonGroup } from 'react-native-elements';
const  WIDTH = Dimensions.get("screen").width;
const  HEIGHT = Dimensions.get("screen").height;



function retornaVector(){
   let cantidadNumeros = 115;
   let array = [];
   while(array.length<20){
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

function retornaPalabraDistinta(palabra){
	let distractor = palabra;
	let indice = 0;
	while(palabra==distractor){
		indice = Math.ceil(Math.random() * 80);
		distractor = verbosDistractores[indice];
	}
	return(distractor);

}



const Main = () => {
    let verbosMapeados = null;
    const [rating , setRating ] = useState(0);
    const [preguntas,setPreguntas] = useState([]);
    useEffect(()=>{
	console.log("useEffect acabo xd")
	let verbos = verbosInfinitivo;
        let preguntasAElegir = retornaVector();
	setPreguntas(preguntasAElegir)

    },[]);
    return(
        <>

            <Text>Bienvenio al Quizt Empecemos</Text>
            <Text>Puntaje: {rating}</Text>
	    <FlatList
		data={preguntas}
	    	keyExtractor={item => item}
	    	ItemSeparatorComponent={()=><View style={{width: WIDTH, paddingTop:10}}/>}
		ListEmptyComponent={()=>(
			<View style={{width:WIDTH * 0.8 , padding: 15, backgroundColor: "#fa8231",alignSelf:"center", borderRadius:10,marginTop:10}}>
				<Text style={{textAlign:"center"}}>Espere un momento...</Text>
			</View>
		)}
	    	renderItem={({item})=>{
		  
		  return(
		    <ComponentePregunta posicionRandom={Math.ceil(Math.random() * 2)} key={item} objeto={verbosInfinitivo[item]} metodoIncrementar={()=>setRating(rating + 100)} metodoReducir={()=>setRating(rating - 100)} />
		  )
		}}
	    />
        </>
    )
}


const ComponentePregunta = (props) =>{
    const {objeto, metodoIncrementar,metodoReducir,posicionRandom} = props;
	const [distractor,setDistractor] = useState(null)
	const [acomodoRandom,setAcomodoRandom] = useState(posicionRandom)
	const [pulsado,setPulsado] = useState(0)
	const [resultado,setResultado] = useState(true)
	useEffect(()=>{
	let auxDistractor = retornaPalabraDistinta(objeto.meaning);
	setDistractor(auxDistractor)
	
	},[]);	
    return(
        <View style={{width: WIDTH * 0.9, padding: 5, marginTop: 5, backgroundColor: "#45aaf2", alignSelf:"center", alignItems:"center", justifyContent:"space-between", flexDirection:"column", borderRadius:5, borderColor:"#45aaf2",boderWidth:1 }}>

            <Text>¿Qué es "<Text>{objeto.verb}</Text>"?</Text>
	{
		pulsado === 0 ?
		(
            <View style={{width: WIDTH * 0.9, backgroundColor: "#fff", padding:12 , alignItems:"center", justifyContent: "space-around", flexDirection:"row", borderLeftWidth:1,borderRightWidth:1,borderColor:"#45aaf2" }}>
		{
		(acomodoRandom == 1) ?
		(
		<>
                <TouchableOpacity onPress={()=>{
			metodoIncrementar()
			setPulsado(1)
			setResultado(true)
		}} style={{padding:6,backgroundColor:"#fed330", width: WIDTH * 0.9 * 0.25, justifyContent:"center", borderRadius:5 }}>
                    <Text style={{textAlign:"center"}}>{objeto.meaning}</Text>
                </TouchableOpacity>

		<TouchableOpacity onPress={()=>{
			metodoReducir()
			setPulsado(1)
			setResultado(false)
		}} style={{padding:6,backgroundColor:"#fed330",width: WIDTH * 0.9 * 0.25, justifyContent:"center", borderRadius:5 }}>
                    <Text style={{textAlign:"center"}}>{distractor}</Text>
                </TouchableOpacity>
		</>
		) : (
		<>
		<TouchableOpacity onPress={()=>{
			metodoReducir()
			setPulsado(1)
			setResultado(false)
		}} style={{padding:6,backgroundColor:"#fed330",width: WIDTH * 0.9 * 0.25, justifyContent:"center", borderRadius:5 }}>
                    <Text style={{textAlign:"center"}}>{distractor}</Text>
                </TouchableOpacity>
		
		<TouchableOpacity onPress={()=>{
			metodoIncrementar()
			setPulsado(1)
			setResultado(true)
		}} style={{padding:6,backgroundColor:"#fed330", width: WIDTH * 0.9 * 0.25, justifyContent:"center", borderRadius:5 }}>
                    <Text style={{textAlign:"center"}}>{objeto.meaning}</Text>
                </TouchableOpacity>
		</>	
		)
		}
            </View>
	):(

		<View>
			{
	resultado ? ( <Text>Resultado Correcto</Text> ) : ( <Text>Resultado Incorrecto "{objeto.verb}" es "{objeto.meaning}"</Text> )
			}
		</View>

	)}

        </View>
    )
}


export default Main;

