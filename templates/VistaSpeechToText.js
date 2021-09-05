import React, { useEffect, useState } from 'react';
import {Modal, View, Image, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ActivityIndicator ,Dimensions} from 'react-native';
import Voice from '@react-native-community/voice';
import Tts from 'react-native-tts';
import NetInfo from '@react-native-community/netinfo'
import {Icon} from "react-native-elements";
//we have to add the net config

const  WIDTH = Dimensions.get("screen").width;
const  HEIGHT = Dimensions.get("screen").height;


const App = () => {

	
	var NetInfoSubscribtion = null;
	const [state,setState] = useState({
		connection_status:false,
		connection_type:null,
		connection_net_reachable: true
	})

	useEffect(()=>{
		NetInfoSubscribtion = NetInfo.addEventListener(_handleConnectivityChange);
		return () => {
			NetInfoSubscribtion && NetInfoSubscribtion()
		}

		
	},[]);
	const _handleConnectivityChange = (state) => {
		setState({
			connection_status: state.isConnected,
			connection_type: state.type,
			connection_net_reachable: state.isInternetReachable
		})
	}


	return(
		(state.connection_net_reachable != null && state.connection_net_reachable != false) ?
		
		<Speech/>
		:
		<>

		<View style={{flex:1, backgroundColor: "white",alignItems: 'center',justifyContent: 'flex-start'}}>
		<Text style={{margin:4, textAlign:"center",fontSize:19,fontWeight:"bold", color:"#0984e3",margin:4,marginBottom:20}}>Sin señal</Text>						
			<Icon name={"network-check"} type={"material-icons"} size={150} color={"#ff4757"} containerStyle={{marginBottom:20,marginTop:20}}/>
			<Text style={{marginTop: 20,margin:4,alignSelf:"center",textAlign: 'center',fontWeight: "bold",fontSize: 16,color:"#111"}}>
			Hola aquí podrás practicar tu speaking(como suenas en ingles), por favor conéctate a una red para acceder.
			</Text>
		</View>
			
			<>
				{
					console.log("este es el status de netInfo: ",state.connection_status,"--------este es state conexion type : ", state.connection_type,"-------esto es reachable: ", state.connection_net_reachable)
				}
			</>
		</>

		
	
	);
}



const Speech = () => {

	  const [result, setResult] = useState('')
	  const [isLoading, setLoading] = useState(false)

	  useEffect(() => {
		      Voice.onSpeechStart = onSpeechStartHandler;
		      Voice.onSpeechEnd = onSpeechEndHandler;
		      Voice.onSpeechResults = onSpeechResultsHandler;

		      return () => {
			            Voice.destroy().then(Voice.removeAllListeners);
			          }
		    }, [])

	  const onSpeechStartHandler = (e) => {
		      console.log("start handler==>>>", e)
		    }
	  const onSpeechEndHandler = (e) => {
		      setLoading(false)
		      console.log("stop handler", e)
	         	  setLoading(false)
		    }

	  const onSpeechResultsHandler = (e) => {
		      let text = e.value[0]
		      setResult((prev)=>{
					let result = prev + " " + text;
					return(result)
			  })
		      console.log("speech result handler", e)
		    }

	  const startRecording = async () => {
		      setLoading(true)
		      try {
			            await Voice.start('en-Us')
			          } catch (error) {
					        console.log("error raised", error)
					      }
		    }

	  const stopRecording = async () => {
		setLoading(false)
		      try {
			            await Voice.stop()
			          } catch (error) {
					        console.log("error raised", error)
					      }
		    }


	  return (
		      <View style={{flex: 1,padding: 24}}>
		        <SafeAreaView  style={{flex: 1}}>
		          
				  <ComponenteModal titulo={"Practica tu Speaking"} subtitulo={"La práctica hace al maestro,\npor lo cual es importante que practiques hablando en ingles \n para así perder el miedo, además conforme mejores en como hablas \n también mejoraras en como escuchas(listening),\n no te rindas y que no te dé pena hablar."}/>
					<View style={{   height: 150, marginTop: 15, alignItems: 'center', backgroundColor: 'white',  borderRadius: 20,  paddingHorizontal: 16, shadowOffset: { width: 0, height: 1 },  shadowRadius: 2,elevation: 2,  shadowOpacity: 0.4}}>
						<TextInput
						value={result}
						placeholder="Aquí aparecerá lo que dirás."
						style={{ flex: 1,  height: "100%",width:"100%",textAlign:"center",fontWeight:"bold"}}
						onChangeText={text => setResult(text)}
						multiline={true}
						numberOfLines={6}
						/>
					</View>

					<View style={{width:"100%",padding:5,justifyContent:"space-around",alignItems:"center",flexDirection:"row"}}>
					<Icon onPress={()=>setResult("")}
							 name='trash-can-outline' type="material-community" color='#ff7979' size={45} containerStyle={{alignSelf:"center",justifyContent:"center",alignItems:"center"}}/>
					<Icon onPress={()=>speak(result)}
					name='speaker-wireless' type="material-community" color='#ff9f43' size={45} containerStyle={{alignSelf:"center",justifyContent:"center",alignItems:"center"}}/>
					</View>
				  {isLoading ? 
								
					   <TouchableOpacity
							style={{marginBottom: 15,justifyContent:"center", flexDirection:"column", alignItems:"center", alignSelf: 'center',width:100,height:100, marginTop: 24,backgroundColor: 'white', padding: 5,borderRadius:50,elevation:4}}
							onPress={stopRecording}
						>
							<Icon //onPress={stopRecording}
							 name='close-circle-outline' type="material-community" color='#ff6b6b' size={45} containerStyle={{alignSelf:"center",justifyContent:"center",alignItems:"center"}}/>
							
						</TouchableOpacity>
						:
						//sticker-remove-outline
						<TouchableOpacity
							style={{marginBottom: 15,justifyContent:"center", flexDirection:"column", alignItems:"center", alignSelf: 'center',width:100,height:100, marginTop: 24,backgroundColor: 'white', padding: 8, borderRadius: 50,elevation:4}}
							onPress={startRecording}
						>
							<Icon //onPress={startRecording}
							 name='play-box' type="material-community" color='#74b9ff' size={45} containerStyle={{alignSelf:"center",justifyContent:"center",alignItems:"center"}}/>
						
							
						</TouchableOpacity>
					}



		          
		            
		          
		        </SafeAreaView>
		      </View>
		    );
};

const  speak = (texto) => {
    Tts.setDefaultRate(0.4);
    Tts.setDefaultLanguage('en-US');
    //Tts.setDefaultVoice('com.apple.ttsbundle.Samantha-compact');
    Tts.getInitStatus().then(() => {
        Tts.speak(texto);
    });
    Tts.stop();

}
const ComponenteModal = (props) => {
	const {titulo,subtitulo} = props;
	const [visible,setVisible] = useState(false)
	return(
        <>
        <Text onPress={()=>setVisible(true)} style={{alignSelf: 'center',  marginVertical: 10,  fontWeight: 'bold',  fontSize: 23}}>{titulo}</Text>
        <Text onPress={()=>setVisible(true)} style={{margin:1, textAlign:"center",fontSize:13,fontWeight:"bold", color:"rgba(1,1,1,0.3)" }}>pulsa para detalles</Text>
        
		<Modal visible={visible} onRequestClose={()=>setVisible(false)} transparent={true}>
	         <View style={{width:WIDTH,height: HEIGHT,backgroundColor:"rgba(1,1,1,0.3)",justifyContent:"center",alignItems:"center"}}>

			<View style={{width:WIDTH * 0.95,padding:20,alignSelf:"center", backgroundColor:"white",alignItems:"center",justifyContent:"space-around",borderRadius:5}}>
			<Text style={{margin:4, textAlign:"center",fontSize:15,fontWeight:"bold", color:"#0984e3" }}>{titulo}</Text>
    		<Text style={{margin:4, textAlign:"center",fontSize:14,fontWeight:"bold", color:"#353b48" }}>{subtitulo}</Text>
				
				<TouchableOpacity style={{margin:4, alignSelf:"center",padding:6,backgroundColor:"#ff6b6b", width: WIDTH * 0.9 * 0.25, justifyContent:"center", borderRadius:5, marginTop:5}} onPress={()=>setVisible(false)}>
					<Text style={{textAlign:"center",fontWeight:"bold",color:"white"}}>Volver</Text>
				</TouchableOpacity>
			</View>
		</View>
		</Modal>
        </>
	)
}
//ya casi acabamos

export default App;
