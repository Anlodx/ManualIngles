import React,  {useRef,useState, useEffect} from 'react';
import {ActivityIndicator,RefreshControl,TouchableOpacity,TextInput, Image,Text, View, StyleSheet, Alert, SafeAreaView, ScrollView, Picker, StatusBar, Button, Dimensions, FlatList,Modal } from 'react-native';

/*
$Objeto->ArregloConLibretasPublicas = $ArregloConLibretasPublicas;
$Objeto->ArregloConHojasPublicas = $ArregloConHojasPublicas;
$Objeto->ArregloConLibrosPublicos = $ArregloConLibrosPublicos;
*/

import {ItemUsuario,ItemHoja,ItemLibro,ItemLibreta,ItemChat} from "./formatos.js";


const AnchoPantalla = Dimensions.get("window").width;
const AltoPantalla = Dimensions.get("window").height;

const muro = ({navigation, route}) => {

	const [data,setData]=useState([]);
	const [hojas,setHojas]=useState([])
	const [libretas,setLibretas]=useState([])
	const [libros,setLibros]=useState([])




	useEffect(()=>{
		eventosEspecificos.traerLinks();
	},[]);

	const eventosEspecificos = {
		traerLinks: async () => {
			fetch('http://backpack.sytes.net/servidorApp/php/muro/traerLinks/traerLinks.php',{
			  method:'post',
			  header:{
				'Accept': 'application/json',
				'Content-type': 'application/json'
			  },
			  body:null

			})
			.then((response) => response.text())
			 .then((respuesta)=>{
			  // this.setState({...this.state,arreglo:responseJson});
			   //setData(respuesta);
				 let objeto = JSON.parse(respuesta)
				 setHojas(objeto.ArregloConHojasPublicas)
				 setLibretas(objeto.ArregloConLibretasPublicas)
				 setLibros(objeto.ArregloConLibrosPublicos)
				 setRefresh(false);


			   console.log('Contenido de data = ' , data);
			 })
			 .catch((error)=>{
			 console.error(error);
			 });
		}
	}
	const accionDeBoton = () => {}
	const [refresh,setRefresh] = useState(true)

	if(refresh){
		return(

				<View style={{width : '100%' , height : '100%', justifyContent : 'center', alignItems : 'center', backgroundColor : 'rgba(218, 218, 218, 0.61)'}}>
						<ActivityIndicator size={'large'} color={'black'}/>
						<Text style={{textAlign:"center",color:"#111",fontSize:16,fontFamily: "Viga-Regular"}}>cargando contenido</Text>
				</View>
		)
	}

	return (




			<ScrollView
			contentContainerStyle={{backgroundColor:"rgba(218, 218, 218, 0.61)"}}//rgba(218, 218, 218, 0.61)
			refreshControl={<RefreshControl
						 colors={["#9Bd35A", "#689F38"]}
						 refreshing={refresh}
						 onRefresh={()=>{
							 console.log("recargando");
							 setRefresh(true);
							 eventosEspecificos.traerLinks();

						 }
					 } />}>

				        <View style={{width:"100%",height:10}}/>
								<Text style={{alignSelf: 'center',fontFamily: "Viga-Regular",color:"#111",textAlign: 'left',backgroundColor: null,width: Dimensions.get("window").width * (0.7)}}>Libretas Publicas</Text>
				        <FlatList
				          data={libretas}
				          keyExtractor={(item)=>item.Contenido}
									horizontal={true}
									ListHeaderComponent={()=>(<View style={{width:10}}/>)}
									ItemSeparatorComponent={()=>(<View style={{width:10}}/>)}
									ListFooterComponent={()=>(<View style={{width:10}}/>)}
									ListEmptyComponent={
				            ()=>(
				              <View style={{width: Dimensions.get("window").width * (0.8),padding: 40,justifyContent:"center",alignSelf:"center",alignItems:"center",backgroundColor:"#6c5ce7",borderRadius:15}}>
							  <Text style={{textAlign:"center",color:"#fff",fontSize:16,fontFamily: "Viga-Regular"}}>No hay Libretas Aun...Espera =)</Text>
				              </View>
				              )
				          }
				          renderItem={
				          ({item})=>{
				                return(
				                <ItemLibreta
				                Id={item.Contenido}
				                Avatar={item.Propietario.RutaDeFoto}
				                Nombre={item.Propietario.Nombre}
				                Especialidad={item.Propietario.Especialidad}
				                Subido={item.FechaDeSubida}
				                NombreLibreta={item.Nombre}
				                DescripcionLibreta={item.Descripcion}
												navigation={navigation}/>

				                )

				    }
				}
				/>
								<View style={{width:"100%",height:10}}/>
								<Text style={{alignSelf: 'center',fontFamily: "Viga-Regular",color:"#111",textAlign: 'left',backgroundColor: null,width: Dimensions.get("window").width * (0.7)}}>Hojas De Libretas Publicas</Text>
								<FlatList
									data={hojas}
									keyExtractor={(item)=>item.Contenido}
									ListHeaderComponent={()=>(<View style={{width:10}}/>)}
									ItemSeparatorComponent={()=>(<View style={{width:10}}/>)}
									ListFooterComponent={()=>(<View style={{width:10}}/>)}
									horizontal={true}
									ListEmptyComponent={
										()=>(
											<View style={{width: Dimensions.get("window").width * (0.8),padding: 40,justifyContent:"center",alignSelf:"center",alignItems:"center",backgroundColor:"#ff7675",borderRadius:15}}>
											<Text style={{textAlign:"center",color:"#fff",fontSize:16,fontFamily: "Viga-Regular"}}>No hay Hojas Aun...Espera =)</Text>
											</View>
											)
									}
									renderItem={
									({item})=>{

												return(
												<ItemHoja
												Id={item.Contenido}
												Avatar={item.Propietario.RutaDeFoto}
												Nombre={item.Propietario.Nombre}
												Especialidad={item.Propietario.Especialidad}
												Subido={item.FechaDeSubida}
												NombreHoja={item.Nombre}
												DescripcionHoja={item.Descripcion}
												navigation={navigation}
												/>
												)
								}
								}
				/>
								<View style={{width:"100%",height:10}}/>
								<Text style={{alignSelf: 'center',fontFamily: "Viga-Regular",color:"#111",textAlign: 'left',backgroundColor: null,width: Dimensions.get("window").width * (0.7)}}>Libros Publicos</Text>
								<FlatList
									data={libros}
									keyExtractor={(item)=>item.Contenido}
									ListHeaderComponent={()=>(<View style={{width:10}}/>)}
									ItemSeparatorComponent={()=>(<View style={{width:10}}/>)}
									ListFooterComponent={()=>(<View style={{width:10}}/>)}
									horizontal={true}
									ListEmptyComponent={
										()=>(
											<View style={{width: Dimensions.get("window").width * (0.8),padding: 40,justifyContent:"center",alignSelf:"center",alignItems:"center",backgroundColor:"#00a8ff",borderRadius:15}}>
											<Text style={{textAlign:"center",color:"#fff",fontSize:16,fontFamily: "Viga-Regular"}}>No hay Libros Aun...Espera =)</Text>
											</View>
											)
									}
									renderItem={
									({item})=>{

												return(
												<ItemLibro
												Id={item.Id}
												Avatar={item.Avatar}
												Nombre={item.NombreCompleto}
												Especialidad={item.Especialidad}
												Subido={item.Subido}

												NombreLibro={item.NombreLibro}
												DescripcionLibro={item.DescripcionLibro}



				                //cerrarModalPrincipal={props.cerrarModalPrincipal}

								Contenido={item.Contenido}
				        navigation={navigation}/>
												)
								}
								}
				/>
								<View style={{width:"100%",height:10}}/>

			</ScrollView>







	);
}

export default muro;
