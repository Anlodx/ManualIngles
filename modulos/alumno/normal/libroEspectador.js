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
  Alert
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
    return(

      <>

        <TouchableOpacity onPress={()=>setVisible(true)}
         style={stylesBtn.botonAbrir}>
          <Icon  type="font-awesome-5" name="book" size={30} color={"#0984e3"} />
          <View style={{width:"93%",backgroundColor: "#487eb0",marginLeft: 5,borderRadius: 4}}>
            <Text style={stylesBtn.titulo}> <Text style={{color:"#ffbe76"}}>Nombre:</Text> {Libros[0].Titulo}</Text>
            <Text style={stylesBtn.descripcion}><Text style={{color:"#f6e58d"}}>Descripción:</Text> {Libros[0].Descripcion}</Text>
          </View>
        </TouchableOpacity>
        

        <Modal visible={Visible} animation={"fade"} onRequestClose={()=>setVisible(false)}>
          <View style={{flex:1}}>
            <Libro onPress={()=>setVisible(false)} data={Libros[0]} />
          </View>
        </Modal>

      </>

      );


}

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
