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
    const [totalContestadas,setTotalContestadas] = useState(0);
    const [preguntas,setPreguntas] = useState([]);
    useEffect(()=>{
	console.log("useEffect acabo xd")
	let verbos = verbosInfinitivo;
        let preguntasAElegir = retornaVector();
	setPreguntas(preguntasAElegir)

    },[]);
    return(
        <>

            <Text style={{width:WIDTH,textAlign:"center",fontSize:17,fontWeight:"bold", color:"#0984e3" }}>Bienvenido al Quiz</Text>
  <Text style={{width:WIDTH,textAlign:"center",fontSize:16, color: "#ff6b6b", fontWeight:"bold" }}>Puntaje: <Text style={{fontWeight:"bold",color:"#222f3e"}}> {rating} </Text> </Text>
	    <FlatList
		data={preguntas}
	    	keyExtractor={item => item}
	    	 ListHeaderComponent={()=><View style={{width: WIDTH, paddingTop:20}}/>}
                ListFooterComponent={()=><View style={{width: WIDTH, paddingTop:20}}/>}
                ItemSeparatorComponent={()=><View style={{width: WIDTH, paddingTop:10}}/>}
		ListEmptyComponent={()=>(
			<View style={{width:WIDTH * 0.8 , padding: 15, backgroundColor: "#ffa502",alignSelf:"center", borderRadius:10,marginTop:10}}>
				<Text style={{textAlign:"center"}}>Espere un momento...</Text>
			</View>
		)}
	    	renderItem={({item})=>{
		  
		  return(
		    <ComponentePregunta posicionRandom={Math.ceil(Math.random() * 2)} key={item} objeto={verbosInfinitivo[item]} metodoIncrementar={()=>{
			    setRating(rating + 100)
			    setTotalContestadas(totalContestadas + 1)
		    }} metodoReducir={()=>{
			    setRating(rating - 100)
			    setTotalContestadas(totalContestadas + 1)
		    }} />
		  )
		}}
	    />
	    {
		totalContestadas == 20 ? <ComponenteModal puntaje={rating}/> : null
	    }
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
        <View style={{width: WIDTH * 0.9, padding: 10, marginTop: 5, backgroundColor: "#ecf0f1", alignSelf:"center", alignItems:"center", justifyContent:"space-between", flexDirection:"column", borderRadius:5,borderWidth:1,borderColor:"#b2bec3" }}>

            <Text style={{marginBottom:5,textAlign:"center",fontWeight:"bold", color:"#30336b"}}>¿Qué es <Text style={{fontWeight:"bold",color:"#1abc9c"}}>"{objeto.verb}"</Text>?</Text>
	{
		pulsado === 0 ?
		(
            <View style={{width: WIDTH * 0.9, backgroundColor: "#fff", padding:12 , alignItems:"center", justifyContent: "space-around", flexDirection:"row", borderLeftWidth:1,borderRightWidth:1,borderColor:"#b2bec3" }}>
		{
		(acomodoRandom == 1) ?
		(
		<>
                <TouchableOpacity onPress={()=>{
			metodoIncrementar()
			setPulsado(1)
			setResultado(true)
		}} style={{padding:6,backgroundColor:"#fed330", padding: 15, justifyContent:"center", borderRadius:5 }}>
                    <Text style={{textAlign:"center"}}>{objeto.meaning}</Text>
                </TouchableOpacity>

		<TouchableOpacity onPress={()=>{
			metodoReducir()
			setPulsado(1)
			setResultado(false)
		}} style={{padding:6,backgroundColor:"#fed330",padding: 15, justifyContent:"center", borderRadius:5 }}>
                    <Text style={{textAlign:"center"}}>{distractor}</Text>
                </TouchableOpacity>
		</>
		) : (
		<>
		<TouchableOpacity onPress={()=>{
			metodoReducir()
			setPulsado(1)
			setResultado(false)
		}} style={{padding:6,backgroundColor:"#fed330",padding: 15, justifyContent:"center", borderRadius:5 }}>
                    <Text style={{textAlign:"center"}}>{distractor}</Text>
                </TouchableOpacity>
		
		<TouchableOpacity onPress={()=>{
			metodoIncrementar()
			setPulsado(1)
			setResultado(true)
		}} style={{padding:6,backgroundColor:"#fed330", padding: 15, justifyContent:"center", borderRadius:5 }}>
                    <Text style={{textAlign:"center"}}>{objeto.meaning}</Text>
                </TouchableOpacity>
		</>	
		)
		}
            </View>
	):(

		<View>
			{
			resultado ? 
			( <Text style={{width:WIDTH * 0.8,textAlign:"center",padding:5,backgroundColor:"#55efc4",borderRadius:4,color:"#111",fontWeight:"bold"}}>Resultado Correcto</Text> )
			:
			( <Text style={{width:WIDTH * 0.8,textAlign:"center",padding:5,backgroundColor:"#ff7675",borderRadius:4,color:"#111",fontWeight:"bold"}}>Resultado Incorrecto "{objeto.verb}" es "{objeto.meaning}"</Text> )
			}
		</View>

	)}

        </View>
    )
}


const ComponenteModal = (props) => {
	const {puntaje} = props;
	const [visible,setVisible] = useState(true)
	return(
		<Modal visible={visible} onRequestClose={()=>setVisible(false)} transparent={true}>
	         <View style={{width:WIDTH,height: HEIGHT,backgroundColor:"rgba(1,1,1,0.3)",justifyContent:"center",alignItems:"center"}}>

			<View style={{width:WIDTH * 0.8,padding:20,alignSelf:"center", backgroundColor:"white",alignItems:"center",justifyContent:"space-around",borderRadius:5}}>
			<Text style={{textAlign:"center",fontSize:15,fontWeight:"bold", color:"#0984e3" }}>Hola!,Felicitaciones por llegar hasta el final</Text>
		<Text style={{textAlign:"center",fontSize:15,fontWeight:"bold", color:"#353b48" }}> tu puntaje fue de: {puntaje}</Text>
				<MensajeText puntaje={puntaje}/>
				<TouchableOpacity style={{alignSelf:"center",padding:6,backgroundColor:"#0984e3", width: WIDTH * 0.9 * 0.25, justifyContent:"center", borderRadius:5, marginTop:5}} onPress={()=>setVisible(false)}>
					<Text style={{textAlign:"center",fontWeight:"bold"}}>Volver</Text>
				</TouchableOpacity>
			</View>
		</View>
		</Modal>
	)
}

const MensajeText = (props)=>{
    const {puntaje} = props;
    if(puntaje == 2000){
        return <Text style={{padding:4,borderRadius:5,backgroundColor:"#7bed9f", textAlign:"center",fontWeight:"bold"}}>Sabia que lo lograrias</Text>;
    }
    else if(puntaje ==  0){
	return <Text style={{padding:4,borderRadius:5,backgroundColor:"#ff7f50", textAlign:"center",fontWeight:"bold"}}>No te preocupes, solo necesitas practicar</Text>;
    }
    else if(puntaje < 0){
	return <Text style={{padding:4,borderRadius:5,backgroundColor:"#ff4757", textAlign:"center",fontWeight:"bold"}}>No te rindas yo se que puedes</Text>;
    }
    else if(puntaje > 0 && puntaje >=1000 && puntaje < 2000){
	return <Text style={{padding:4,borderRadius:5,backgroundColor:"#ffa502", textAlign:"center",fontWeight:"bold"}}>Te acercaste y eso es bueno, sigue mejorando</Text>;
    }else if(puntaje>0 && puntaje<1000){
	return <Text style={{padding:4,borderRadius:5,backgroundColor:"#feca57", textAlign:"center",fontWeight:"bold"}}>Bien amigo</Text>;
    }

}


export default Main;


