import React, {useState,useEffect,useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  FlatList,
  Modal,
  Image,
  Switch,
  TextInput,
  ActivityIndicator,
  Alert,
  Dimensions
} from 'react-native';
import { Icon,CheckBox } from 'react-native-elements';
import { ListItem } from 'react-native-elements';

import { Button,SearchBar,ButtonGroup } from 'react-native-elements';

import {ItemUsuario,ItemHoja,ItemLibro,ItemLibreta} from "./formatos.js";

import {ValidaLetras, PreparaBusqueda, PreparaBusquedaComponente} from './../../global/codigosJS/Metodos.js';
import {establecerMatriculaDelPropietarioDeLaMochila, establecerDatosDeCredencialEspectado, establecerIndiceParaApartadosDeMochila} from '../../../store/actions.js';

import { useSelector, useDispatch } from 'react-redux';

const AltoPantalla = Dimensions.get("window").height;
const AnchoPantalla = Dimensions.get("window").width;

export const Busqueda = (props) => {



	const datosDeCredencial = useSelector(store => store.datosDeCredencial);

    const [Busqueda, setBusqueda] = useState(null)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const {Evento} = props;
	const DatosUsuario = datosDeCredencial;

	const [mostrarModalBuscando, modificarMuestroDelModalBuscando] = useState(false);
	const ModalBuscando = () => {
		return (
			<Modal visible={true} transparent={true}>
				<View style={{width : '100%' , height : '100%', justifyContent : 'center', alignItems : 'center', backgroundColor : 'rgba(0,0,0,.5)'}}>
					<View style={{width : '80%' , height : '30%' , flexDirection : 'column' , alignItems : 'center', justifyContent : 'space-around', backgroundColor : 'lavender', borderRadius : 10}}>
						<ActivityIndicator size={'large'} color={'black'}/>
						<Text>{'Buscando coincidencias. Por favor, espera...'}</Text>
					</View>
				</View>
			</Modal>
		);
	}

	const eventos = {
		botonBusqueda : async () => {
			//1.- COMPROBAR QUE EL MENSAJE (Busqueda) CUMPLA CON LAS REGLAS DE TODA TextInput
			let arreglo = PreparaBusqueda(Busqueda);
			//console.log('Arreglo = ', arreglo);
      //console.log("arreglo: ",arreglo)
			if(arreglo){
        console.log("arreglo =: ",arreglo)
				if(arreglo.length > 0){
					//EL ARREGLO ESTA CORRECTO
					let objetoConInfo = {
						arregloConPalabrasABuscar: arreglo,
						matricula: DatosUsuario.matricula
					}
          console.log("arreglo =:= ",arreglo)

					let json = JSON.stringify(objetoConInfo);
					let datos = new FormData();
					datos.append('indice', json);

					let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/busqueda/busquedaGeneral/busquedaGeneral.php',{
						method: 'POST',
						body: datos,
					})
					.then((mensaje) => mensaje.text())
					.then((respuesta) => {
            console.log("respuesta => ",respuesta);
						let objeto = JSON.parse(respuesta);


						/*
							$Objeto->AlumnosCoincidentes = $StringJSONDeAlumnos;
							$Objeto->LibretasCoincidentes = $StringJSONDeLibretas;
						*/

						setResultados({...Resultados, ResultadosUsurios: objeto.AlumnosCoincidentes, ResultadosLibretas: objeto.LibretasCoincidentes, ResultadosHojas: objeto.HojasDeLibretaCoincidentes, ResultadosLibros: objeto.LibrosCoincidentes});
						modificarMuestroDelModalBuscando(false);
					})
					.catch((error) => {
            console.log("catch =: ", error)
						setResultados({...Resultados, ResultadosUsurios: [], ResultadosLibretas: [], ResultadosHojas: [], ResultadosLibros: []});
						modificarMuestroDelModalBuscando(false);
					});
				}
				else{
					setResultados({...Resultados, ResultadosUsurios: [], ResultadosLibretas: [], ResultadosHojas: [], ResultadosLibros: []});
					modificarMuestroDelModalBuscando(false);
				}
			}
			else{
				setResultados({...Resultados, ResultadosUsurios: [], ResultadosLibretas: [], ResultadosHojas: [], ResultadosLibros: []});
				modificarMuestroDelModalBuscando(false);
			}



		},
	}

    const [Resultados, setResultados] = useState({
     /* ResultadosUsurios:[{
        Id:"1234",
        Avatar:"https://images.unsplash.com/photo-1542044896530-05d85be9b11a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        Nombre:{
          Nombres:"Angel Gabriel",
          ApellidoPaterno:"Hernandez",
          ApellidoMaterno:"Hernandez"
        },
        Especialidad:"Programador"
      }],*/
	ResultadosUsurios : [],
	//ResultadosHojas DE ABAJO, OBTIENE LOS DATOS SOLAMENTE DE AQUELLAS HOJAS QUE SON PARTE DE UNA Libretas
	//ResultadosHojasDeLibreta
     /* ResultadosHojas:[{
        Id:"12345",
        Avatar:"https://images.unsplash.com/photo-1542044896530-05d85be9b11a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        Nombre:{
          Nombres:"Gabriel",
          ApellidoPaterno:"Mendez",
          ApellidoMaterno:"Hernandez"
        },
        Especialidad:"Chef",
        Subido:"22/08/12",
        NombreHoja:"Discada",
        DescripcionHoja:"Aprende a hacer discada"
      }],
*/
      ResultadosHojas: [],
      /*ResultadosLibros:[{
        Id:"12345673",
        Avatar:"https://images.unsplash.com/photo-1542044896530-05d85be9b11a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        Nombre:{
          Nombres:"Alonso",
          ApellidoPaterno:"Medrano",
          ApellidoMaterno:"Hernandez"
        },
        Especialidad:"Gamer",
        Subido:"2/08/12",
        NombreLibro:"Xbox",
        DescripcionLibro:"Todo sobre el Xbox"
      }],*/
      ResultadosLibros: [],
	  /*
      ResultadosLibretas:[{
        Id:"1234567372",
        Avatar:"https://images.unsplash.com/photo-1542044896530-05d85be9b11a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        Nombre:{
          Nombres:"Mateo",
          ApellidoPaterno:"Medrano",
          ApellidoMaterno:"Perez"
        },
        Especialidad:"Obrero",
        Subido:"2/08/12",
        NombreLibreta:"Albañileria",
        DescripcionLibreta:"Aprende a hacer Mezcla"
      }]
	  */
	  ResultadosLibretas: [],
    })
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Apartados de busqueda

        //const component1 = () =>   <Icon name='account-key' type="material-community" color='#E91E63' size={30}/>
        const component1 = () =>   <Icon name='account-search' type="material-community" color='#ff9f43' size={30}/>
        const component2 = () =>   <Icon name='book-outline' type="material-community" color='#E91E63' size={30}/>
        const component3 = () =>   <Icon name='book-open-variant' type="material-community" color='#00BCD4' size={30}/>
        const component4 = () =>   <Icon name='notebook-multiple' type="material-community" color="#6c5ce7" size={30}/>

        const buttons = [{ element: component1 }, { element: component2 }, { element: component3 },{ element: component4 }]

//#522752
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
      <View style={{flex:1,backgroundColor: "#fff",width: AnchoPantalla,height: AltoPantalla}}>
        <View style={{backgroundColor:"#fff",width:AnchoPantalla,flexDirection:"row",alignItems:"center",justifyContent:"space-around",borderBottomWidth:3,borderColor:"rgba(0,0,0,0.1)"}}>
          <StatusBar backgroundColor={"#111"}></StatusBar>
          <Icon onPress={Evento} type="font-awesome-5" name="arrow-left" size={25} color={"#0a3d62"} containerStyle={{backgroundColor: null,width: AnchoPantalla * (0.2)}}/>

          <TextInput
              textAlign={"center"}
              value={Busqueda}
               style={{borderWidth:1,borderColor:"#fff",padding:2,paddingTop: 4,paddingBottom: 4,margin:2,color:"#fff",borderRadius:10,backgroundColor: "#111",width: AnchoPantalla * (0.6)}}
          //     placeholder={"Cuentame..."}
               onChangeText={(Val)=>setBusqueda(Val)}
               maxLength={60}
               autoFocus={true}
               selectionColor={"#3498db"}
          />

          <Icon onPress={(Val)=>setBusqueda(null)} type="font-awesome-5" name="trash-alt" size={30} color={"#eb3b5a"} containerStyle={{backgroundColor: null,width: AnchoPantalla * (0.2)}} />
<>{
  /*
			<TouchableNativeFeedback onPress={() => {

				eventos.botonBusqueda();
        modificarMuestroDelModalBuscando(true);
			}}>
				<Icon type="material" name="location-searching" size={30} color={"#3498db"} />
			</TouchableNativeFeedback>
      */
    }
</>
			{(mostrarModalBuscando) ?
				<ModalBuscando />
			:
				null
			}
        </View>



          <ButtonGroup
            onPress={

                (selected) => {
                  setSelectedIndex(selected)
                }
            }
            selectedIndex={selectedIndex}
            buttons={buttons}
            selectedButtonStyle={{backgroundColor:null,borderBottomWidth:3,borderBottomColor:"#00E676"}}
            containerStyle={{borderRadius:15}}
            innerBorderStyle={{width:0}}
            containerStyle={{backgroundColor: "#fff",width: AnchoPantalla,alignSelf: 'center'}}
             />





            <DevuelveApartado busquedaTexto={Busqueda} cerrarModalPrincipal={Evento} cerrarModal={props.cerrarBusqueda} index={selectedIndex} Resultados={Resultados} data={DatosUsuario} navigation={props.navigation}/>
      </View>
    );
}

export default Busqueda;




const ListaLibros = (props) => {
  const [listaLibros,setListaLibros] = useState([]);
  const datosDeCredencial = useSelector(store => store.datosDeCredencial);
  const dispatch = useDispatch();

  const refenciaVerMasOMenosLibros = useRef(0);

  const [variablesLibros, setVariablesLibros] = useState({
    verMas: null,
    verMenos: null
  });

  useEffect(() => {
    eventos.Busqueda();
  }, [props]);

  const eventos = {
    Busqueda : async () => {
      //1.- COMPROBAR QUE EL MENSAJE (Busqueda) CUMPLA CON LAS REGLAS DE TODA TextInput
      let arreglo = PreparaBusqueda(props.busquedaDeTextoABuscar);
      //console.log('Arreglo = ', arreglo);
      //console.log("arreglo: ",arreglo)
      if(arreglo){
        console.log("arreglo =: ",arreglo)
        if(arreglo.length > 0){
          //EL ARREGLO ESTA CORRECTO
          let objetoConInfo = {
            arregloConPalabrasABuscar: arreglo,
            variableVerMasOMenos: refenciaVerMasOMenosLibros.current
          }
          console.log("arreglo =:= ",arreglo)

          let json = JSON.stringify(objetoConInfo);
          let datos = new FormData();
          datos.append('indice', json);

          let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/busqueda/busquedaDeItem/busquedaDeLibroPorNombreYDescripcion.php',{
            method: 'POST',
            body: datos,
          })
          .then((mensaje) => mensaje.text())
          .then((respuesta) => {
            console.log("respuesta => ",respuesta);
            let objeto = JSON.parse(respuesta);


            /*
              $Objeto->AlumnosCoincidentes = $StringJSONDeAlumnos;
              $Objeto->LibretasCoincidentes = $StringJSONDeLibretas;
            */

            setListaLibros(objeto.coincidencias);
            setVariablesLibros({...variablesLibros,verMas:objeto.variableVerMas,verMenos:objeto.variableVerMenos})
            //modificarMuestroDelModalBuscando(false);
          })
          .catch((error) => {
            console.log("catch =: ", error)
            setListaLibros([]);
          //	modificarMuestroDelModalBuscando(false);
          });
        }
        else{
          setListaLibros([]);
        //	modificarMuestroDelModalBuscando(false);
        }
      }
      else{
        setListaLibros([]);
        //modificarMuestroDelModalBuscando(false);
      }



    },
  }

  return(
    <>

            <FlatList
              data={listaLibros}
              keyExtractor={(item)=>item.Id}
              ListEmptyComponent={
                ()=>(
                  
                  <View style={{width:AnchoPantalla * (0.8),padding:10,justifyContent:"center",alignSelf:"center",alignItems:"center",backgroundColor:"#111",borderRadius:10}}>
                      <Text style={{textAlign:"center",color:"#fff",fontSize:17,fontFamily: "Viga-Regular"}}>Sin resultados</Text>
                  </View>
                  )
              }
              ListHeaderComponent={()=>{
                return(
                (variablesLibros.verMenos !== null && variablesLibros.verMenos !== false) ?
              <TouchableOpacity onPress = {()=>{
                refenciaVerMasOMenosLibros.current=refenciaVerMasOMenosLibros.current-1;
                eventos.Busqueda()
              }} style={{width:AnchoPantalla * (0.8),padding: 7,backgroundColor: "#26de81",justifyContent: 'center',alignItems: 'center',alignSelf: 'center',borderRadius: 5,margin: 8}}>
                <Text style={{textAlign:"center",fontFamily: "AkayaKanadaka-Regular"}}>Ver menos</Text>
              </TouchableOpacity>
              :null
              )
              }
              }
              ItemSeparatorComponent={()=>(<View style={{width:"100%",height:15}}/>)}
              ListFooterComponent={()=>{
                return(
                (variablesLibros.verMas !== null && variablesLibros.verMas !== false) ?
                <TouchableOpacity onPress = {()=>{
                  refenciaVerMasOMenosLibros.current=refenciaVerMasOMenosLibros.current+1;
                  eventos.Busqueda()
                }} style={{width:AnchoPantalla * (0.8),padding: 7,backgroundColor: "#26de81",justifyContent: 'center',alignItems: 'center',alignSelf: 'center',borderRadius: 5,margin: 8}}>
                  <Text style={{textAlign:"center",fontFamily: "AkayaKanadaka-Regular"}}>Ver más</Text>
                </TouchableOpacity>
                :null
              )

              }
              }
              renderItem={
                ({item})=>{
                  return(
                    <ItemLibro
                    Id={item.Id}
                    Avatar={item.Avatar}
                    Nombre={item.Nombre}
                    Especialidad={item.Especialidad}
                    Subido={item.Subido}
                    NombreLibro={item.NombreLibro}
                    cerrarModalPrincipal={props.cerrarModalPrincipal}
                    DescripcionLibro={item.DescripcionLibro}
            Contenido={item.Contenido}
            navigation={props.navigation}
            />
              )
            }
          }
    />
    </>
  );
}


const ListaLibretas = (props) => {
  const [listaLibretas,setListaLibretas] = useState([]);
  const datosDeCredencial = useSelector(store => store.datosDeCredencial);
  const dispatch = useDispatch();

  const refenciaVerMasOMenosLibretas = useRef(0);

  const [variablesLibretas, setVariablesLibretas] = useState({
    verMas: null,
    verMenos: null
  });

  useEffect(() => {
    eventos.Busqueda();
  }, [props]);

  const eventos = {
    Busqueda : async () => {
      //1.- COMPROBAR QUE EL MENSAJE (Busqueda) CUMPLA CON LAS REGLAS DE TODA TextInput
      let arreglo = PreparaBusqueda(props.busquedaDeTextoABuscar);
      //console.log('Arreglo = ', arreglo);
      //console.log("arreglo: ",arreglo)
      if(arreglo){
        console.log("arreglo =: ",arreglo)
        if(arreglo.length > 0){
          //EL ARREGLO ESTA CORRECTO
          let objetoConInfo = {
            arregloConPalabrasABuscar: arreglo,
            variableVerMasOMenos: refenciaVerMasOMenosLibretas.current
          }
          console.log("arreglo =:= ",arreglo)

          let json = JSON.stringify(objetoConInfo);
          let datos = new FormData();
          datos.append('indice', json);

          let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/busqueda/busquedaDeItem/busquedaDeLibretaPorNombreYDescripcion.php',{
            method: 'POST',
            body: datos,
          })
          .then((mensaje) => mensaje.text())
          .then((respuesta) => {
            console.log("respuesta => ",respuesta);
            let objeto = JSON.parse(respuesta);


            /*
              $Objeto->AlumnosCoincidentes = $StringJSONDeAlumnos;
              $Objeto->LibretasCoincidentes = $StringJSONDeLibretas;
            */

            setListaLibretas(objeto.coincidencias);
            setVariablesLibretas({...variablesLibretas,verMas:objeto.variableVerMas,verMenos:objeto.variableVerMenos})
            //modificarMuestroDelModalBuscando(false);
          })
          .catch((error) => {
            console.log("catch =: ", error)
            setListaLibretas([]);
          //	modificarMuestroDelModalBuscando(false);
          });
        }
        else{
          setListaLibretas([]);
        //	modificarMuestroDelModalBuscando(false);
        }
      }
      else{
        setListaLibretas([]);
        //modificarMuestroDelModalBuscando(false);
      }



    },
  }

  return(
    <>



            <FlatList
              data={listaLibretas}
              keyExtractor={(item)=>item.Id}
              ListEmptyComponent={
                ()=>(
                  
                  <View style={{width:AnchoPantalla * (0.8),padding:10,justifyContent:"center",alignSelf:"center",alignItems:"center",backgroundColor:"#111",borderRadius:10}}>
                      <Text style={{textAlign:"center",color:"#fff",fontSize:17,fontFamily: "Viga-Regular"}}>Sin resultados</Text>
                  </View>
                  )
              }
              ListHeaderComponent={()=>{
                return(
                (variablesLibretas.verMenos !== null && variablesLibretas.verMenos !== false) ?
              <TouchableOpacity onPress = {()=>{
                refenciaVerMasOMenosLibretas.current=refenciaVerMasOMenosLibretas.current-1;
                eventos.Busqueda()
              }} style={{width:AnchoPantalla * (0.8),padding: 7,backgroundColor: "#26de81",justifyContent: 'center',alignItems: 'center',alignSelf: 'center',borderRadius: 5,margin: 8}}>
                <Text style={{textAlign:"center",fontFamily: "AkayaKanadaka-Regular"}}>Ver menos</Text>
              </TouchableOpacity>
              :null
              )
              }
              }
              ItemSeparatorComponent={()=>(<View style={{width:"100%",height:15}}/>)}
              ListFooterComponent={()=>{
                return(
                (variablesLibretas.verMas !== null && variablesLibretas.verMas !== false) ?
                <TouchableOpacity onPress = {()=>{
                  refenciaVerMasOMenosLibretas.current=refenciaVerMasOMenosLibretas.current+1;
                  eventos.Busqueda()
                }} style={{width:AnchoPantalla * (0.8),padding: 7,backgroundColor: "#26de81",justifyContent: 'center',alignItems: 'center',alignSelf: 'center',borderRadius: 5,margin: 8}}>
                  <Text style={{textAlign:"center",fontFamily: "AkayaKanadaka-Regular"}}>Ver más</Text>
                </TouchableOpacity>
                :null
              )

              }
              }
              renderItem={
                ({item})=>{
                  return(

                    <ItemLibreta
                      Id={item.Id}
                      Avatar={item.Avatar}
                      Nombre={item.Nombre}
                      Especialidad={item.Especialidad}
                      Subido={item.Subido}
                      cerrarModalPrincipal={props.cerrarModalPrincipal}
                      NombreLibreta={item.NombreLibreta}
                      DescripcionLibreta={item.DescripcionLibreta}
          navigation={props.navigation}
        />
              )
            }
          }
    />
    </>
  );
}


const ListaHojas = (props) => {
  const [listaHojas,setListaHojas] = useState([]);
  const datosDeCredencial = useSelector(store => store.datosDeCredencial);
  const dispatch = useDispatch();

  const refenciaVerMasOMenosHojas = useRef(0);

  const [variablesHojas, setVariablesHojas] = useState({
    verMas: null,
    verMenos: null
  });

  useEffect(() => {
    eventos.Busqueda();
  }, [props]);

  const eventos = {
    Busqueda : async () => {
      //1.- COMPROBAR QUE EL MENSAJE (Busqueda) CUMPLA CON LAS REGLAS DE TODA TextInput
      let arreglo = PreparaBusqueda(props.busquedaDeTextoABuscar);
      //console.log('Arreglo = ', arreglo);
      //console.log("arreglo: ",arreglo)
      if(arreglo){
        console.log("arreglo =: ",arreglo)
        if(arreglo.length > 0){
          //EL ARREGLO ESTA CORRECTO
          let objetoConInfo = {
            arregloConPalabrasABuscar: arreglo,
            variableVerMasOMenos: refenciaVerMasOMenosHojas.current
          }
          console.log("arreglo =:= ",arreglo)

          let json = JSON.stringify(objetoConInfo);
          let datos = new FormData();
          datos.append('indice', json);

          let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/busqueda/busquedaDeItem/busquedaDeHojaDeLibretaPorNombreYDescripcion.php',{
            method: 'POST',
            body: datos,
          })
          .then((mensaje) => mensaje.text())
          .then((respuesta) => {
            console.log("respuesta => ",respuesta);
            let objeto = JSON.parse(respuesta);


            /*
              $Objeto->AlumnosCoincidentes = $StringJSONDeAlumnos;
              $Objeto->LibretasCoincidentes = $StringJSONDeLibretas;
            */

            setListaHojas(objeto.coincidencias);
            setVariablesHojas({...variablesHojas,verMas:objeto.variableVerMas,verMenos:objeto.variableVerMenos})
            //modificarMuestroDelModalBuscando(false);
          })
          .catch((error) => {
            console.log("catch =: ", error)
            setListaHojas([]);
          //	modificarMuestroDelModalBuscando(false);
          });
        }
        else{
          setListaHojas([]);
        //	modificarMuestroDelModalBuscando(false);
        }
      }
      else{
        setListaHojas([]);
        //modificarMuestroDelModalBuscando(false);
      }



    },
  }

  return(
    <>
      <FlatList
        data={listaHojas}
        keyExtractor={(item)=>item.Id}
        ListEmptyComponent={
            ()=>(
              
              <View style={{width:AnchoPantalla * (0.8),padding:10,justifyContent:"center",alignSelf:"center",alignItems:"center",backgroundColor:"#111",borderRadius:10}}>
                  <Text style={{textAlign:"center",color:"#fff",fontSize:17,fontFamily: "Viga-Regular"}}>Sin resultados</Text>
               </View>
              )
          }
        ListHeaderComponent={()=>{
          return(
          (variablesHojas.verMenos !== null && variablesHojas.verMenos !== false) ?
        <TouchableOpacity onPress = {()=>{
          refenciaVerMasOMenosHojas.current=refenciaVerMasOMenosHojas.current-1;
          eventos.Busqueda()
        }} style={{width:AnchoPantalla * (0.8),padding: 7,backgroundColor: "#26de81",justifyContent: 'center',alignItems: 'center',alignSelf: 'center',borderRadius: 5,margin: 8}}>
          <Text style={{textAlign:"center",fontFamily: "AkayaKanadaka-Regular"}}>Ver menos</Text>
        </TouchableOpacity>
        :null
      )
      }
      }
        ItemSeparatorComponent={()=>(<View style={{width:"100%",height:15}}/>)}
        ListFooterComponent={()=>{
          return(
          (variablesHojas.verMas !== null && variablesHojas.verMas !== false) ?
          <TouchableOpacity onPress = {()=>{
            refenciaVerMasOMenosHojas.current=refenciaVerMasOMenosHojas.current+1;
            eventos.Busqueda()
          }}  style={{width:AnchoPantalla * (0.8),padding: 7,backgroundColor: "#26de81",justifyContent: 'center',alignItems: 'center',alignSelf: 'center',borderRadius: 5,margin: 8}}>
            <Text style={{textAlign:"center",fontFamily: "AkayaKanadaka-Regular"}}>Ver más</Text>
          </TouchableOpacity>
          :null
  )

        }
        }

        renderItem={
          ({item})=>{
            return(
              <ItemHoja
              Id={item.Id}
              Avatar={item.Avatar}
              Nombre={item.Nombre}
              Especialidad={item.Especialidad}
              Subido={item.Subido}
              cerrarModalPrincipal={props.cerrarModalPrincipal}
              NombreHoja={item.NombreHoja}
              DescripcionHoja={item.DescripcionHoja}
              navigation={props.navigation}  />
            )
          }
        }
      />
    </>
  );
}


const ListaUsuarios = (props) => {
  const [listaUsuarios,setListaUsuarios] = useState([])
  const datosDeCredencial = useSelector(store => store.datosDeCredencial);
  const dispatch = useDispatch();

  const [perfil, setPerfil] = useState({
      matricula:"por favor espere...",
      ruta_de_foto:"por favor espere...",//"https://images.unsplash.com/photo-1542044896530-05d85be9b11a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60 ",
      nombres:"por favor espere...",
      apellido_paterno:"por favor espere...",
      apellido_materno:"por favor espere...",
      especialidad:"por favor espere...",
      frase:"por favor espere...",
      hobbies:"por favor espere...",
      seguido:"por favor espere..."
    })

   useEffect(()=>{
     eventos.Busqueda()
   },[props])
   const [modalVisibleUsuario, setModalVisibleUsuario] = useState(false)

  const [variablesUsuario,setVariablesUsuario]=useState({
      verMas:null,
      verMenos:null
  })
  const refenciaVerMasOMenosUsuarios = useRef(0)

  function VisitarMochila(){
    //alert("metodo visitar");
	//const dispatch = useDispatch();
  /*
  matricula: null,
  nombreCompleto: {
    nombres: null,
    apellidoPaterno: null,
    apellidoMaterno: null
  },
  especialidad: null,
  fechaDeNacimiento: null,
  genero: null,
  frase: null,
  rutaDeFoto: null,
  hobbies: null,
  */

	dispatch(establecerMatriculaDelPropietarioDeLaMochila(perfil.matricula));
  dispatch(establecerIndiceParaApartadosDeMochila("Apartados De Mochila"));
  dispatch(establecerDatosDeCredencialEspectado({
    matricula: perfil.matricula,
		nombreCompleto: {
			nombres: perfil.nombres,
			apellidoPaterno: perfil.apellido_paterno,
			apellidoMaterno: perfil.apellido_materno
		},
		especialidad: perfil.especialidad,
		//fechaDeNacimiento: perfil.,
		//genero: perfil.,
		frase: perfil.frase,
		rutaDeFoto: perfil.ruta_de_foto,
		hobbies: perfil.hobbies
  }));

	console.log(props);

	props.navigation.navigate("MochilaVisitante", {
		datosDeCredencialEspectador: datosDeCredencial,
		datosDeCredencialEspectado: {
      Id:perfil.matricula,
      Avatar:perfil.ruta_de_foto,
      Nombre:{
        Nombres:perfil.nombres,
        ApellidoPaterno:perfil.apellido_paterno,
        ApellidoMaterno:perfil.apellido_materno
      },
      Especialidad:perfil.especialidad,
      Frase:perfil.frase,
      Hobbies:perfil.hobbies
    },
		//indiceParaApartadosDeMochila: "Apartados De Mochila"
	});
	props.cerrarModal();
  }

  	const eventos = {
  		Busqueda : async () => {
  			//1.- COMPROBAR QUE EL MENSAJE (Busqueda) CUMPLA CON LAS REGLAS DE TODA TextInput
  			let arreglo = PreparaBusqueda(props.busquedaDeTextoABuscar);
  			console.log('Arreglo = ', arreglo);
        //console.log("arreglo: ",arreglo)
  			if(arreglo){
          console.log("arreglo =: ",arreglo)
  				if(arreglo.length > 0){
  					//EL ARREGLO ESTA CORRECTO
  					let objetoConInfo = {
  						arregloConPalabrasABuscar: arreglo,
  						matricula: datosDeCredencial.matricula,
              variableVerMasOMenos:refenciaVerMasOMenosUsuarios.current
  					}
            console.log("arreglo =:= ",arreglo)

  					let json = JSON.stringify(objetoConInfo);
  					let datos = new FormData();
  					datos.append('indice', json);

  					let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/busqueda/busquedaDeAlumno/busquedaDeAlumnoPorNombre.php',{
  						method: 'POST',
  						body: datos,
  					})
  					.then((mensaje) => mensaje.text())
  					.then((respuesta) => {
              //console.log("respuesta => ",respuesta);
  						let objeto = JSON.parse(respuesta);


  						/*
  							$Objeto->AlumnosCoincidentes = $StringJSONDeAlumnos;
  							$Objeto->LibretasCoincidentes = $StringJSONDeLibretas;
  						*/

  						setListaUsuarios(objeto.arregloConDatosDeLosAlumnosCoincidentes);
              setVariablesUsuario({...variablesUsuario,verMas:objeto.variableVerMas,verMenos:objeto.variableVerMenos})
  						//modificarMuestroDelModalBuscando(false);
  					})
  					.catch((error) => {
              console.log("catch =: ", error)
  						setListaUsuarios([]);
              setVariablesUsuario({...variablesUsuario,verMas:null,verMenos:null})
              refenciaVerMasOMenosUsuarios.current=0;
  					//	modificarMuestroDelModalBuscando(false);
  					});
  				}
  				else{
  					setListaUsuarios([]);
            setVariablesUsuario({...variablesUsuario,verMas:null,verMenos:null})
            refenciaVerMasOMenosUsuarios.current=0;
            console.log("aqui estoy en el else de arreglo mayor a cero")
  				//	modificarMuestroDelModalBuscando(false);
  				}
  			}
  			else{
  				setListaUsuarios([]);
          setVariablesUsuario({...variablesUsuario,verMas:null,verMenos:null})
          refenciaVerMasOMenosUsuarios.current=0;
          console.log("aqui estoy en el else de arreglo null")

  				//modificarMuestroDelModalBuscando(false);
  			}



  		},
  	}
  return(
<>
    <Modal onShow={()=>console.log(perfil)} visible={modalVisibleUsuario} transparent={true} onRequestClose={()=>setModalVisibleUsuario(false)}>
      <View style={{flex:1,backgroundColor:"rgba(1, 1, 1, 0.5)",justifyContent: 'center',alignItems: 'center',alignSelf: 'center',width: AnchoPantalla,height: AltoPantalla}}>
        <Credencial matricula={props.matricula} propietario={props.propietario} data={perfil} Evento={()=>{VisitarMochila()}} Cierra={()=>setModalVisibleUsuario(false)}/>
      </View>
    </Modal>
    <FlatList
      data={listaUsuarios}
      keyExtractor={(item)=>item.Id}
      ListHeaderComponent={()=>{
        return(
          <>
          {
        (variablesUsuario.verMenos !== null && variablesUsuario.verMenos !== false) ?
      <TouchableOpacity onPress = {()=>{
        refenciaVerMasOMenosUsuarios.current=refenciaVerMasOMenosUsuarios.current-1;
        eventos.Busqueda()
      }} style={{width:AnchoPantalla * (0.8),padding: 7,backgroundColor: "#26de81",justifyContent: 'center',alignItems: 'center',alignSelf: 'center',borderRadius: 5,margin: 8}}>
        <Text style={{textAlign:"center",fontFamily: "AkayaKanadaka-Regular"}}>Ver menos</Text>
      </TouchableOpacity>
      :
      null
    }
      </>
    )
    }
    }
      ItemSeparatorComponent={()=>(<View style={{width:"100%",height:15}}/>)}
      ListFooterComponent={()=>{
        return(
        <>
        {
        (variablesUsuario.verMas !== null && variablesUsuario.verMas !== false) ?
        <TouchableOpacity onPress = {()=>{
          refenciaVerMasOMenosUsuarios.current=refenciaVerMasOMenosUsuarios.current+1;
          eventos.Busqueda()
        }}  style={{width:AnchoPantalla * (0.8),padding: 7,backgroundColor: "#26de81",justifyContent: 'center',alignItems: 'center',alignSelf: 'center',borderRadius: 5,margin: 8}}>
          <Text style={{textAlign:"center",fontFamily: "AkayaKanadaka-Regular"}}>Ver más</Text>
        </TouchableOpacity>
        :
        null
      }
        </>
)

      }
      }
      ListEmptyComponent={
            ()=>(
              
              <View style={{width:AnchoPantalla * (0.8),padding:10,justifyContent:"center",alignSelf:"center",alignItems:"center",backgroundColor:"#111",borderRadius:10}}>
                  <Text style={{textAlign:"center",color:"#fff",fontSize:17,fontFamily: "Viga-Regular"}}>Sin resultados</Text>
               </View>
              )
          }

      renderItem={
        ({item})=>{
          return(
        <ItemUsuario
          Id={item.Id}
          Avatar={item.Avatar}
          Nombre={item.Nombre}
          Especialidad={item.Especialidad}
          action={()=>{
            setPerfil({
              matricula:item.Id,
              ruta_de_foto:item.Avatar,//"https://images.unsplash.com/photo-1542044896530-05d85be9b11a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60 ",
              nombres:item.Nombre.Nombres,
              apellido_paterno:item.Nombre.ApellidoPaterno,
              apellido_materno:item.Nombre.ApellidoMaterno,
              especialidad:item.Especialidad,
              frase:item.Frase,
              hobbies:item.Hobbies,
              seguido:item.Seguido
            })

            setModalVisibleUsuario(true)
          }}
        />
      )
    }
  }
/>
</>
  )
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////

const DevuelveApartado = (props) => {
	const datosDeCredencial = useSelector(store => store.datosDeCredencial);
  const dispatch = useDispatch();

  const {Resultados} = props;
  const {index} = props;


  function VisitarMochila(){
    //alert("metodo visitar");
	//const dispatch = useDispatch();
  /*
  matricula: null,
  nombreCompleto: {
    nombres: null,
    apellidoPaterno: null,
    apellidoMaterno: null
  },
  especialidad: null,
  fechaDeNacimiento: null,
  genero: null,
  frase: null,
  rutaDeFoto: null,
  hobbies: null,
  */
	dispatch(establecerMatriculaDelPropietarioDeLaMochila(perfil.matricula));
  dispatch(establecerDatosDeCredencialEspectado({
    matricula: perfil.matricula,
		nombreCompleto: {
			nombres: perfil.nombres,
			apellidoPaterno: perfil.apellido_paterno,
			apellidoMaterno: perfil.apellido_materno
		},
		especialidad: perfil.especialidad,
		//fechaDeNacimiento: perfil.,
		//genero: perfil.,
		frase: perfil.frase,
		rutaDeFoto: perfil.ruta_de_foto,
		hobbies: perfil.hobbies
  }));

	console.log(props);

	props.navigation.navigate("MochilaVisitante", {
		datosDeCredencialEspectador: datosDeCredencial,
		datosDeCredencialEspectado: {
      Id:perfil.matricula,
      Avatar:perfil.ruta_de_foto,
      Nombre:{
        Nombres:perfil.nombres,
        ApellidoPaterno:perfil.apellido_paterno,
        ApellidoMaterno:perfil.apellido_materno
      },
      Especialidad:perfil.especialidad,
      Frase:perfil.frase,
      Hobbies:perfil.hobbies
    },
		indiceParaApartadosDeMochila: "Apartados De Mochila"
	});
	props.cerrarModal();
  }

  if(index===0){//este item va aparecer en la barra de busqueda como item de usuarios disponibles

      return(

        <View style={{flex:1,backgroundColor:"rgba(218, 218, 218, 0.61)",width: AnchoPantalla}}>


          <View style={{width:AnchoPantalla * (0.9),alignSelf:"center",justifyContent:"center",alignItems:"center",margin:8}}>
            <Text style={{color:"#00b894",textAlign:"center",fontSize:16,fontFamily: "Viga-Regular"}}>Busqueda de Usuarios por Nombre.</Text>
          </View>

          <ListaUsuarios navigation={props.navigation} cerrarModal={()=>props.cerrarModal()} busquedaDeTextoABuscar={props.busquedaTexto} matricula={props.data.matricula} propietario={props.data}/>


        </View>
        );
    }

  else if(index===1){//este item va aparecer en la barra de busqueda como item  y item en muro como hoja

    return(
      <View style={{flex:1,backgroundColor:"rgba(218, 218, 218, 0.61)",width: AnchoPantalla}}>

        <View style={{width:AnchoPantalla * (0.9),alignSelf:"center",justifyContent:"center",alignItems:"center",margin:8}}>
          <Text style={{color:"#00b894",textAlign:"center",fontSize:16,fontFamily: "Viga-Regular"}}>Busqueda de Hojas.</Text>
        </View>


        <ListaHojas cerrarModalPrincipal={props.cerrarModalPrincipal} navigation={props.navigation} cerrarModal={()=>props.cerrarModal()} busquedaDeTextoABuscar={props.busquedaTexto} matricula={props.data.matricula} propietario={props.data}/>
      </View>
      );

  }
  else if(index===2){//este item va aparecer en la barra de busqueda como item  y item en muro como libro

    return(
      <View style={{flex:1,backgroundColor:"rgba(218, 218, 218, 0.61)",width: AnchoPantalla}}>

        <View style={{width:AnchoPantalla * (0.9),alignSelf:"center",justifyContent:"center",alignItems:"center",margin:8}}>
          <Text style={{color:"#00b894",textAlign:"center",fontSize:16,fontFamily: "Viga-Regular"}}>Busqueda de Libros.</Text>
        </View>


        <ListaLibros cerrarModalPrincipal={props.cerrarModalPrincipal} navigation={props.navigation} cerrarModal={()=>props.cerrarModal()} busquedaDeTextoABuscar={props.busquedaTexto} matricula={props.data.matricula} propietario={props.data}/>

      </View>
      );

  }
  else if(index===3){//este item va aparecer en la barra de busqueda como item  y item en muro como libreta

    return(
      <View style={{flex:1,backgroundColor:"rgba(218, 218, 218, 0.61)",width: AnchoPantalla}}>

        <View style={{width:AnchoPantalla * (0.9),alignSelf:"center",justifyContent:"center",alignItems:"center",margin:8}}>
          <Text style={{color:"#00b894",textAlign:"center",fontSize:16,fontFamily: "Viga-Regular"}}>Busqueda de Libretas.</Text>
        </View>


      <ListaLibretas cerrarModalPrincipal={props.cerrarModalPrincipal} navigation={props.navigation} cerrarModal={()=>props.cerrarModal()} busquedaDeTextoABuscar={props.busquedaTexto} matricula={props.data.matricula} propietario={props.data}/>


      </View>
      );

  }

}







const Credencial=(props)=>{
  const {Evento,Cierra} = props;
  const [data, setData] = useState(props.data)
  const [DatosCredencialVisitante,setDatosCredencialVisitante] = useState({
      Id: data.matricula,
      Avatar: data.ruta_de_foto,//"https://images.unsplash.com/photo-1542044896530-05d85be9b11a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60 ",
      Nombre:{
        Nombres: data.nombres,
        ApellidoPaterno: data.apellido_paterno,
        ApellidoMaterno: data.apellido_materno
      },
      Especialidad: data.especialidad,
      Frase: data.frase,
      Hobbies: data.hobbies,
      Seguido:data.seguido
    });
	const [seguido,setSeguido]=useState(data.seguido);

	useEffect(()=>{
		comprobarAQuienesSigues();
	},[]);

	function comprobarAQuienesSigues(){

      fetch('http://backpack.sytes.net/servidorApp/php/Seguidores/ComprobarEnBaseDeDatos.php',{
          method:'post',
          header:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body:JSON.stringify({
            matriculaDuenio:props.matricula ,//sera la que me traiga del arreglo
            matriculaSeguidor:data.matricula//sera la matricula del usuario quien hizo la busqueda,
          })

        })
        .then((response) => response.text())
         .then((response)=>{
           console.log(response);
		   if(response=="ALTERADO"){
				setSeguido("SEGUIDO");
		   }else{
			   console.log(response);
		   }

           //traerSeguidores();
         })
         .catch((error)=>{
         console.error(error);
         });

  }

  function crearRegistroAQuienesSiguesAlert(){
        Alert.alert(
          'Pregunta:',
          "¿Quieres seguir a "+ data.nombres +"?",
          [
            {
              text: 'No',
              onPress: () => null,
            },
            {
              text: 'Claro !!!',
               onPress: () => crearRegistroAQuienesSigues(),
            }
          ],
          { cancelable: false }
        )
      }
  function crearRegistroAQuienesSigues(){

      fetch('http://backpack.sytes.net/servidorApp/php/Seguidores/CrearRegistroAQuienesSigo.php',{
          method:'post',
          header:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body:JSON.stringify({
            matriculaDuenio:props.matricula ,//sera la que me traiga del arreglo
            matriculaSeguidor:data.matricula,//sera la matricula del usuario quien hizo la busqueda
			fechaDeSeguimiento: null
          })

        })
        .then((response) => response.text())
         .then((response)=>{
           console.log(response);

		   if(response=="ALTERADO"){
         insertarNotificacionDeSeguidorNuevo();
				setSeguido("SEGUIDO");
		   }else{
			   console.log(response);
		   }

           //traerSeguidores();
         })
         .catch((error)=>{
         console.error(error);
         });

  }

  function insertarNotificacionDeSeguidorNuevo(){

      fetch('http://backpack.sytes.net/servidorApp/php/Seguidores/insertarNotificacionDeSeguidorNuevo.php',{
          method:'post',
          header:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body:JSON.stringify({

            matriculaDuenio:props.matricula ,//sera la que me traiga del arreglo
            matriculaSeguidor:data.matricula//sera la matricula del usuario quien hizo la busqueda
          })

        })
        .then((response) => response.text())
         .then((response)=>{
           console.log("respuesta desde notifcaciones quienes me siguen desde busqueda => ",response);
         })
         .catch((error)=>{
         console.error(error);
         });

  }

  /*
  function crearRegistroSeguidores(){

      fetch('http://backpack.sytes.net/servidorApp/php/Seguidores/CrearRegistroSeguidores.php',{
          method:'post',
          header:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
          body:JSON.stringify({
            matriculaDuenio: data.matricula,//sera la que me traiga del arreglo
            matriculaSeguidor:props.matricula//sera la matricula del usuario quien hizo la busqueda
          })

        })
        .then((response) => response.text())
         .then((response)=>{
           console.log(response);
           //traerSeguidores();
         })
         .catch((error)=>{
         console.error(error);
         });

  }
*/

  return(
        <SafeAreaView style={styles.container}>

            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={styles.titleBar}>
                    <Icon type="material" name="arrow-back" size={27} color="#52575D" onPress={Cierra}/>
                </View>

                <View style={{ alignSelf: "center"}}>
                    <View style={styles.profileImage}>
                        <Image source={{uri:DatosCredencialVisitante.Avatar}} style={styles.image} resizeMode="center"></Image>
                    </View>
                </View>

{
  //Datos del usuario
}

                <View style={{width: AnchoPantalla * (0.9),flexDirection:"column",justifyContent:"center",alignItems:"center",marginTop:15,marginBottom:15}}>


                      <View style={{width:(AnchoPantalla * (0.9))*(0.8),justifyContent:"center",alignItems:"center",alignContent:"center"}}>
                           <Text style={{fontFamily: "AkayaKanadaka-Regular",color: "#111",fontWeight: "200", fontSize: 21,textAlign:"center"}}>{DatosCredencialVisitante.Nombre.Nombres + " " +DatosCredencialVisitante.Nombre.ApellidoPaterno + " " + DatosCredencialVisitante.Nombre.ApellidoMaterno}</Text>
                      </View>


                      <View style={{width:(AnchoPantalla * (0.9))*(0.8),justifyContent:"center",alignItems:"center",alignContent:"center"}}>
                           <Text style={{fontFamily: "AkayaKanadaka-Regular",fontWeight: "200",color: "#0652DD", fontSize: 18 ,textAlign:"center"}}>{DatosCredencialVisitante.Especialidad}</Text>
                      </View>


                </View>


{//Detalles de usuario
}


                  <View style={{ alignItems: "center",width: AnchoPantalla * (0.9),backgroundColor: null,paddingTop: 10,paddingBottom: 30}}>
                    <Text style={{color:"#8c7ae6",fontSize:14,paddingTop:10,paddingBottom:10,fontFamily: "Viga-Regular"}}>Sobre mí:</Text>

                      <View style={{width: AnchoPantalla * (0.9),justifyContent: 'center',alignItems: 'center'}}>
                        <View style={{width: (AnchoPantalla * (0.9)) * (0.5),backgroundColor: null,flexDirection: 'row',alignSelf: 'center',justifyContent: 'center',alignItems: 'center'}}>
                          <Icon name='cloud' type="font-awesome" color='#3498db'/>
                          <Text style={{marginLeft: 10,backgroundColor: null,textAlign: 'center',fontFamily: "Viga-Regular"}}>Frase:</Text>
                        </View>
                          <View style={{width: (AnchoPantalla * (0.9)) * (0.8),backgroundColor: null}}>
                              <Text style={{ fontSize: 16,color: "#0652DD",textAlign:"center",fontFamily: "AkayaKanadaka-Regular"}}>
                                  {DatosCredencialVisitante.Frase}
                              </Text>
                          </View>
                      </View>

                      <View style={{width: AnchoPantalla * (0.9),justifyContent: 'center',alignItems: 'center'}}>
                        <View  style={{width: (AnchoPantalla * (0.9)) * (0.5),backgroundColor: null,flexDirection: 'row',alignSelf: 'center',justifyContent: 'center',alignItems: 'center'}}>
                          <Icon name='favorite' type='material' color='#e74c3c'/>
                          <Text  style={{marginLeft: 10,backgroundColor: null,textAlign: 'center',fontFamily: "Viga-Regular"}}>Hobbies:</Text>
                        </View>
                          <View style={{width: (AnchoPantalla * (0.9)) * (0.8),backgroundColor: null}}>
                              <Text style={{ fontSize: 16,color: "#e74c3c",textAlign:"center",fontFamily: "AkayaKanadaka-Regular"}}>
                                {DatosCredencialVisitante.Hobbies}
                              </Text>
                          </View>
                      </View>


                    </View>



                <TouchableOpacity onPress={Evento} style={{alignSelf:"center",width:(AnchoPantalla * (0.9)) * (0.4),padding:10,borderRadius:10,backgroundColor:"rgb(66,66,132)",marginTop:10,justifyContent:"center",marginBottom: 10,alignSelf: 'center'}}>
                  <Text  style={{textAlign:"center",color:"white",fontFamily: "Viga-Regular",fontSize: 13}}>Ir a Mochila de {DatosCredencialVisitante.Nombre.Nombres}</Text>
                </TouchableOpacity>
                {
                (seguido=="NOSEGUIDO" && DatosCredencialVisitante.Id != props.matricula) ?
                (<TouchableOpacity onPress={()=>crearRegistroAQuienesSiguesAlert()} style={{alignSelf:"center",width:(AnchoPantalla * (0.9)) * (0.4),padding:10,borderRadius:10,backgroundColor:"#fa8231",marginTop:10,justifyContent:"center",marginBottom: 10,alignSelf: 'center'}}>
                  <Text  style={{textAlign:"center",color:"white",fontFamily: "Viga-Regular",fontSize: 13}}>Seguir a {DatosCredencialVisitante.Nombre.Nombres}</Text>
                </TouchableOpacity>)
                :
                (null)
                }


            </ScrollView>
        </SafeAreaView>
    )



}

const styles = StyleSheet.create({
    container: {
        width: AnchoPantalla * (0.9),
        height: AltoPantalla * (0.9),
        backgroundColor: "rgb(250, 250, 250)",
        borderRadius:20,
        borderWidth:1
    },
    text: {
        fontFamily: "HelveticaNeue",
        color: "#52575D"
    },
    image: {
        flex: 1,
        height: undefined,
        width: undefined
    },
    titleBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 24,
        marginHorizontal: 16
    },
    subText: {
        fontSize: 12,
        color: "#AEB5BC",
        textTransform: "uppercase",
		textAlign:"center",
        fontWeight: "500"
    },
    profileImage: {
      width: (AnchoPantalla * (0.9)) * (0.75),
      height: (AltoPantalla * (0.9)) * (0.26),
        borderRadius:100,
        overflow: "hidden"
    },
    statsContainer: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: 32
    },
    statsBox: {
        alignItems: "center",
        flex: 1
    },
    recentItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 16
    }
});
/*



                <View style={styles.statsContainer}>

                        <TouchableOpacity  style={[styles.statsBox, { borderColor: "#DFD8C8", borderRightWidth: 1 }]}>
                          <Text style={[styles.text, { fontSize: 24 }]}>45,844</Text>
                          <Text style={[styles.text, styles.subText]}>Me siguen</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.statsBox}>
                          <Text style={[styles.text, { fontSize: 24 }]}>302</Text>
                          <Text style={[styles.text, styles.subText]}>Estas Siguiendo</Text>
                        </TouchableOpacity>
                </View>

*/
