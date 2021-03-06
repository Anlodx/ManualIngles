import React,{Component,useState,useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TouchableNativeFeedback,

  TouchableWithoutFeedback,
  FlatList,
  Modal,
  Image,
  Switch,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Alert,
  ToastAndroid
} from 'react-native';
import { Icon } from 'react-native-elements';
import Pdf from 'react-native-pdf';

import {Fecha,SonSoloEspecios} from "../../global/codigosJS/Metodos.js"
//import {Fecha} from "./../../../global/codigosJS/Metodos.js";
import {establecerVariablesDentroDeMochilaDesdeItemLibreta, establecerVariablesDentroDeMochilaDesdeItemHoja, establecerDatosDeCredencialEspectado,traerDatosDeLibrosAVariablesDentroDeMochilaEnApartadoElegido} from '../../../store/actions.js';


import {useSelector, useDispatch} from 'react-redux';






export const VisualizarLibroDesdeRedux = (props) =>{
  const datosDeLibro = useSelector(store => store.variablesDentroDeMochila);
  const dispatch = useDispatch();
  const [modalLibroRedux,setModalLibroRedux] = useState(true)
  //Id = ((Destinatario.Id).split('_'))[1],
  const source = {uri:datosDeLibro.eleccionContenidoDeLibro,cache:false,expiration:1};
        //const source = require('./test.pdf');  // ios only
        //const source = {uri:'bundle-assets://test.pdf'};

        //const source = {uri:'file:///sdcard/test.pdf'};
        //const source = {uri:"data:application/pdf;base64,JVBERi0xLjcKJc..."};
   const [DatosLibro, setDatosLibro] = useState({
     NumPaginas: 0,
     PaginaAtual:0,
     cargando:true
   })
   var myRef = React.createRef();

   function sube(param){
    let paginaAtual = DatosLibro.PaginaAtual;
    paginaAtual-=param;
    if(paginaAtual>=1){
      myRef.setPage(paginaAtual);
    }

   }
        return (
          <Modal visible={modalLibroRedux}
          onRequestClose={()=>{
            props.modificarIndice("Mostrar Libros Del Apartado Publico")
            setModalLibroRedux(false)
          }}>
            <View style={styles.container}>
              
                <Pdf
                    //enablePaging={true}
                    ref={(pdf) => { myRef = pdf; }}
                    source={source}
                    activityIndicatorProps={{color:'red', progressTintColor:'blue'}}
                    onLoadComplete={(numberOfPages,filePath)=>{
                        setDatosLibro({...DatosLibro,NumPaginas:numberOfPages,cargando:false});
                        console.log(filePath)
                        //alert(`number of pages: ${numberOfPages} Nombre:  ${filePath}`);
                    }}
                    onPageChanged={(page,numberOfPages)=>{
                        //alert(`current page: ${page} / ${numberOfPages}`);
                        setDatosLibro({...DatosLibro,PaginaAtual:page});
                    }}
                    onError={(error)=>{
                        //alert(error);
                    }}
                    onPressLink={(uri)=>{
                        //alert(`Link presse: ${uri}`)
                    }}
                    style={styles.pdf}/>

                    {DatosLibro.cargando ?
                    (null)
                     :null
                    /*(
                    <TouchableOpacity onLongPress={()=>sube(4)} onPress={()=>sube(1)} style={{position:"absolute",bottom:80,right:40,backgroundColor:"rgba(0,0,0,.2)",padding:25,borderRadius:15}}>
                      <Icon type="font-awesome-5" name="angle-double-up" size={28} color="#52575D"/>
                    </TouchableOpacity>
                  )*/

                    }

            </View>
            </Modal>
        )
}







const Libro = (props) =>{
  const source = {uri:props.data.Url,cache:false,expiration:1};
        //const source = require('./test.pdf');  // ios only
        //const source = {uri:'bundle-assets://test.pdf'};

        //const source = {uri:'file:///sdcard/test.pdf'};
        //const source = {uri:"data:application/pdf;base64,JVBERi0xLjcKJc..."};
   const [DatosLibro, setDatosLibro] = useState({
     NumPaginas: 0,
     PaginaAtual:0,
     cargando:true
   })
   var myRef = React.createRef();

   function sube(param){
    let paginaAtual = DatosLibro.PaginaAtual;
    paginaAtual-=param;
    if(paginaAtual>=1){
      myRef.setPage(paginaAtual);
    }

   }
        return (
            <View style={styles.container}>
              
                <Pdf
                    //enablePaging={true}
                    ref={(pdf) => { myRef = pdf; }}
                    source={source}
                    activityIndicatorProps={{color:'red', progressTintColor:'blue'}}
                    onLoadComplete={(numberOfPages,filePath)=>{
                        setDatosLibro({...DatosLibro,NumPaginas:numberOfPages,cargando:false});
                        console.log("url: ",filePath)
                        //alert(`number of pages: ${numberOfPages} Nombre:  ${filePath}`);
                    }}
                    onPageChanged={(page,numberOfPages)=>{
                        //alert(`current page: ${page} / ${numberOfPages}`);
                        setDatosLibro({...DatosLibro,PaginaAtual:page});
                    }}
                    onError={(error)=>{
                        //alert(error);
                    }}
                    onPressLink={(uri)=>{
                        //alert(`Link presse: ${uri}`)
                    }}
                    style={styles.pdf}/>

                    {DatosLibro.cargando ?
                    (null)
                     :null
                    /*(
                    <TouchableOpacity onLongPress={()=>sube(4)} onPress={()=>sube(1)} style={{position:"absolute",bottom:80,right:40,backgroundColor:"rgba(0,0,0,.2)",padding:25,borderRadius:15}}>
                      <Icon type="font-awesome-5" name="angle-double-up" size={28} color="#52575D"/>
                    </TouchableOpacity>
                  )*/

                    }

            </View>
        )
}


const LibroComponente = (props) =>
{

   const [Visible, setVisible] = useState(false)
   const [visibleModalAjustes, setVisibleModalAjustes] = useState(false)

   const [Libros, setLibros] = useState([
    {
      IdLibro:props.id,
      Url:props.url,
      Titulo:props.titulo,
      Descripcion:props.descripcion
    }
    ]
    )


    const ModalAjustesView = (props)=>{
      const datosDeCredencial = useSelector(store => store.datosDeCredencial);
      const variablesDentroDeMochila = useSelector(store => store.variablesDentroDeMochila);
      const [modalAjustes,setModalAjustes] = useState(true)
      const [textNombreNuevo,setTextNombreNuevo] = useState(null)
      const [textDescripcionNuevo,setTextDescripcionNuevo] = useState(null)

      const [apartado,setApartado] = useState("BOTONES")
      const dispatch = useDispatch();

      const eventos = {
          traerLibros:async () => {

    				let json = JSON.stringify({
    					matricula: variablesDentroDeMochila.matriculaDelPropietario,
    					eleccionDeApartado: variablesDentroDeMochila.eleccionDeApartado
    				});
    				let datos = new FormData();
    				datos.append('indice', json);

    				let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/accionesEnApartados/mostrar/traerDatosDeLibrosAApartadoElegido.php', {
    					method: 'POST',
    					body: datos
    				})
    				.then(msj => msj.text())
    				.then(respuesta => {
    					let arreglo = null;
    					if(respuesta === "Error"){
    						ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
                console.log("linea 262 libro: ",respuesta)
    						arreglo = [];
    					}
    					else{
    						arreglo = JSON.parse(respuesta);
    						console.log("libros traidos")
    					}

    					dispatch(traerDatosDeLibrosAVariablesDentroDeMochilaEnApartadoElegido(arreglo));

    				})
    				.catch(error => {
    					ToastAndroid.show('Rayos hubo un error' , ToastAndroid.SHORT);
              console.log("linea 275 libro: ",error)
    				});

    			},
        enviarLibroAApartadoPublico : async () => {
          console.log("evento de mover libro a apartado publico al id =>",Libros[0].IdLibro)
          let objetoConInformacion = {
            matricula: datosDeCredencial.matricula,
            idLibro:Libros[0].IdLibro
          }
          let json = JSON.stringify(objetoConInformacion);
          let datos = new FormData();
          datos.append("indice", json);

          let promesa = await fetch("http://backpack.sytes.net/servidorApp/php/accionesEnApartados/subirORemplazarEnApartadoPublico/subirORemplazarLibroEnApartadoPublico.php", {
            method: "POST",
            body: datos
          })
          .then(msj => msj.text())
          .then(respuesta => {
            //let objetoConAyuda = JSON.parse(respuesta);

            console.log("respuesta => ",respuesta)
            setModalAjustes(false);
            eventos.traerLibros();


          })
          .catch(error => {

          });
        },
        eventoBorrarLibro: async () => {
          console.log("evento de borrar libro al id => ",Libros[0].IdLibro)

      			let objetoConInformacion = {
              matricula: datosDeCredencial.matricula,
              idLibro:Libros[0].IdLibro,
              eleccionDeApartado: variablesDentroDeMochila.eleccionDeApartado
      			}
      			let json = JSON.stringify(objetoConInformacion);
      			let datos = new FormData();
      			datos.append("indice", json);

      			let promesa = await fetch("http://backpack.sytes.net/servidorApp/php/accionesEnApartados/eliminar/eliminarLibro.php", {
      				method: "POST",
      				body: datos
      			})
      			.then(msj => msj.text())
      			.then(respuesta => {
      				//let objetoConAyuda = JSON.parse(respuesta);
              console.log("respuesta => ",respuesta)
              setModalAjustes(false);
              eventos.traerLibros();
      			})
      			.catch(error => {

      			});

        },
        eventoRenombrarNombreLibro: async () => {
          if(!SonSoloEspecios(textNombreNuevo)){
              console.log("evento de renombrar libro al id => ",Libros[0].IdLibro," Con los datos: NombreNuevo => ",textNombreNuevo)

          			let objetoConInformacion = {
                  matricula: datosDeCredencial.matricula,
                  idLibro:Libros[0].IdLibro,
                  nombreNuevo:textNombreNuevo
          			}
          			let json = JSON.stringify(objetoConInformacion);
          			let datos = new FormData();
          			datos.append("indice", json);

          			let promesa = await fetch("http://backpack.sytes.net/servidorApp/php/accionesEnApartados/editar/editarNombreDeLibro.php", {
          				method: "POST",
          				body: datos
          			})
          			.then(msj => msj.text())
          			.then(respuesta => {
          				//let objetoConAyuda = JSON.parse(respuesta);
                  console.log("respuesta => ",respuesta)
                  setModalAjustes(false);
                  eventos.traerLibros();

          			})
          			.catch(error => {

          			});
          }

        },
        eventoRenombrarDescripcionLibro: async () => {
          if(!SonSoloEspecios(textDescripcionNuevo)){
              console.log("evento de renombrar libro al id => ",Libros[0].IdLibro," Con los datos: DescripcionNuevo => ",textDescripcionNuevo)
              let objetoConInformacion = {
                matricula: datosDeCredencial.matricula,
                idLibro:Libros[0].IdLibro,
                descripcionNueva:textDescripcionNuevo
              }
              let json = JSON.stringify(objetoConInformacion);
              let datos = new FormData();
              datos.append("indice", json);

              let promesa = await fetch("http://backpack.sytes.net/servidorApp/php/accionesEnApartados/editar/editarDescripcionDeLibro.php", {
                method: "POST",
                body: datos
              })
              .then(msj => msj.text())
              .then(respuesta => {
                //let objetoConAyuda = JSON.parse(respuesta);
                console.log("respuesta => ",respuesta)
                setModalAjustes(false);
                eventos.traerLibros();
              })
              .catch(error => {

              });
          }

        }
      }


      return(
        <Modal visible={modalAjustes}
         onRequestClose={()=>{
          setModalAjustes(false)
          setVisibleModalAjustes(false)
        }} transparent={true}>

        <>
        {
          (apartado === "EDITAR") ?
        <View style={{backgroundColor: "rgba(1,1,1,.5)", width: "100%", height: "100%", justifyContent: "center", alignItems: "center", }}>
          <View style={{width: "95%", height: "90%", alignItems: "center", backgroundColor:"#c8d6e5", borderRadius:20, overflow: "hidden"}}>
            <View style={{width: "100%", height: "10%", backgroundColor:"#222f3e", flexDirection: "row", justifyContent: "space-around", alignItems: "center"}}>
            <Text style={{fontFamily: "Viga-Regular",textAlign: 'center',color:"#fff"}}>Editar Libro</Text>
              <Icon type="font-awesome" name="close" size={24} color={"#fff"} onPress={()=>{
               setApartado("BOTONES")
             }} />
            </View>

            <ScrollView style={{width: "100%", contentContainerStyle: "center"}}>
            <Text style={{fontFamily: "Viga-Regular",textAlign: 'center'}}>Nuevo Nombre del Libro:</Text>
              <TextInput
                style={{alignSelf: "center",backgroundColor:null,paddingLeft:50,paddingRight:50,borderWidth:1,borderColor:"#111",borderRadius:5,margin:10}}
                placeholder={"Escribe algo"}
                value={textNombreNuevo}
                onChangeText={(text) => {
                  setTextNombreNuevo(text)
                }}
              />

              <View style={{alignSelf: "center", width: "50%", height: 40, backgroundColor: "#2e86de", overflow: "hidden", borderRadius: 10,margin:10}}>
                <TouchableNativeFeedback onPress={()=>{
                  eventos.eventoRenombrarNombreLibro()
                }}>
                  <View style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
                  <Text style={{fontFamily: "Viga-Regular",textAlign: 'center'}}>Cambiar Nombre</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
              <Text style={{fontFamily: "Viga-Regular",textAlign: 'center'}}>Nueva Descripci??n Del libro:</Text>
              <TextInput
                style={{alignSelf: "center",backgroundColor:null,paddingLeft:50,paddingRight:50,borderWidth:1,borderColor:"#111",borderRadius:5,margin:10}}
                placeholder={"Escribe algo"}
                value={textDescripcionNuevo}
                onChangeText={(text) => {
                  setTextDescripcionNuevo(text)
                }}
              />
              <View style={{alignSelf: "center", width: "50%", height: 40, backgroundColor: "#2e86de", overflow: "hidden", borderRadius: 10,margin:10}}>
                <TouchableNativeFeedback onPress={()=>{
                  eventos.eventoRenombrarDescripcionLibro()
                }}>
                  <View style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
                  <Text style={{fontFamily: "Viga-Regular",textAlign: 'center'}}>Cambiar descripci??n</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            </ScrollView>
          </View>
        </View>
        :
        (apartado === "BOTONES") ?
        <View style={{backgroundColor: "rgba(1,1,1,.5)", width: "100%", height: "100%", justifyContent: "center", alignItems: "center", }}>
          <View style={{width: "95%", height: "90%", alignItems: "center", backgroundColor:"#c8d6e5", borderRadius:20, overflow: "hidden"}}>
            <View style={{width: "100%", height: "10%", backgroundColor:"#222f3e", flexDirection: "row", justifyContent: "space-around", alignItems: "center"}}>
            <Text style={{fontFamily: "Viga-Regular",textAlign: 'center',color:"#fff"}}>Acciones en Libro</Text>
              <Icon type="font-awesome" name="close" size={24} color={"#fff"} onPress={()=>{
                setModalAjustes(false)
                setVisibleModalAjustes(false)
             }} />
            </View>
            <View style={{backgroundColor: null,justifyContent: 'space-around',alignItems: 'center',width: "100%"}}>
                <View style={{alignSelf: "center", width: "50%", height: 60, backgroundColor: "#2e86de", overflow: "hidden", borderRadius: 20,margin:20}}>
                  <TouchableNativeFeedback onPress={()=>{
                    setApartado("EDITAR")
                  }}>
                    <View style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontFamily: "Viga-Regular",textAlign: 'center',color:"#fff"}}>Editar Libro</Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>

                <View style={{alignSelf: "center", width: "50%", height: 60, backgroundColor: "#2e86de", overflow: "hidden", borderRadius: 20,margin:20}}>
                  <TouchableNativeFeedback onPress={()=>{
                    Alert.alert(
                      'Pregunta:',
                      "??Quieres que borre el Libro?",
                      [
                        {
                          text: 'No',
                          onPress: () => null,
                        },
                        {
                          text: 'Claro !!!',
                           onPress: () => eventos.eventoBorrarLibro()
                        }
                      ],
                      { cancelable: false }
                    );
                  }}>
                    <View style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontFamily: "Viga-Regular",textAlign: 'center',color:"#fff"}}>Borrar Libro</Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>

                <View style={{alignSelf: "center", width: "50%", height: 60, backgroundColor: "#2e86de", overflow: "hidden", borderRadius: 20,margin:20}}>
                  <TouchableNativeFeedback onPress={()=>{
                    Alert.alert(
                      'Pregunta:',
                      "??Mover Libro a Apartado publico?",
                      [
                        {
                          text: 'No',
                          onPress: () => null,
                        },
                        {
                          text: 'Claro !!!',
                           onPress: () => eventos.enviarLibroAApartadoPublico(),
                        }
                      ],
                      { cancelable: false }
                    );
                  }}>
                    <View style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontFamily: "Viga-Regular",textAlign: 'center',color:"#fff"}}>Copia en apartado p??blico</Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>
              </View>

          </View>
        </View>
        : null
        }
        </>
        </Modal>
      )
    }

    return(

      <>

        <TouchableOpacity onPress={()=>setVisible(true)}
        onLongPress={()=>{
          //alert("opciones => "+Libros[0].Titulo+" Su ID => "+Libros[0].IdLibro)
          //setModalAjustes(true)
          setVisibleModalAjustes(true)
        }}
         style={stylesBtn.botonAbrir}>
          <Icon  type="font-awesome-5" name="book" size={30} color={"#0984e3"} />
          <View style={{width:"93%",backgroundColor: "#487eb0",marginLeft: 5,borderRadius: 4}}>
            <Text style={stylesBtn.titulo}> <Text style={{color:"#ffbe76"}}>Nombre:</Text> {Libros[0].Titulo}</Text>
            <Text style={stylesBtn.descripcion}><Text style={{color:"#f6e58d"}}>Descripci??n:</Text> {Libros[0].Descripcion}</Text>
          </View>
        </TouchableOpacity>

        <Modal visible={Visible} animation={"fade"} onRequestClose={()=>setVisible(false)}>
          <View style={{flex:1}}>
            <Libro onPress={()=>setVisible(false)} data={Libros[0]} />
          </View>
        </Modal>
        {
          (visibleModalAjustes) ? <ModalAjustesView/> : null
        }
      </>

      );


}
//hola mundo juas
const stylesBtn = StyleSheet.create({
    titulo:{
      color:"#dff9fb",
      textAlign: 'center',
      fontSize: 16,
      fontFamily: "Viga-Regular"
    },
    descripcion:{
      color:"#dff9fb",
      textAlign: 'center',
      textTransform:'capitalize',
      fontSize: 12,
      fontFamily: "Viga-Regular"
    },
    botonAbrir: {
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          width:((Dimensions.get('window').width) * 0.95),
          padding: 15,//((Dimensions.get('window').width) * 0.05),
          alignSelf: 'center',
          borderWidth: 1,
          borderColor: "#fff",
          borderRadius: 10,
          backgroundColor: "#34495e",
          margin: 4
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    },
    esperando:{
        backgroundColor:"#130f40",
        justifyContent:"center",
        alignItems:"center",
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height
    }
});
export default LibroComponente;
