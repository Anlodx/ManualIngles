import React,{Component,useState,useEffect,useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Modal,
  Image,
  Switch,
  ActivityIndicator,
  TextInput,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Icon,CheckBox } from 'react-native-elements';
import { Button,SearchBar,ButtonGroup } from 'react-native-elements';
import { ListItem, Avatar as IconoDeAvatar } from 'react-native-elements';
import {useFocusEffect } from "@react-navigation/native";
import {useSelector} from 'react-redux';
import {ComponenteDeImagen} from './formatos.js';
//import {ItemUsuario,ItemHoja,ItemLibro,ItemLibreta,ItemChat,ItemNotificacion} from "./formatos.js";
/*
import Libro from "./libro.js";

const Notificaciones = () =>
{
    return(

          <View style={{flex:1}}>
            <Libro
            url={'http://samples.leanpub.com/thereactnativebook-sample.pdf'}
            titulo={"Un libro increible de conocimiento para sobresalir"}
            descripcion={"Este libro es de react native"}
            // onPress={()=>setVisible(false)} data={Libros[0]}
            />
            <Libro
            url={'http://bibing.us.es/proyectos/abreproy/11833/fichero/2.Capitulo2.pdf'}
            titulo={"otro libro para comprobar"}
            descripcion={"el final de pruebas"}
            // onPress={()=>setVisible(false)} data={Libros[0]}
            />

            <Libro
            url={'https://www.ujaen.es/servicios/negapoyo/sites/servicio_negapoyo/files/uploads/Modelo%20Archivo%20en%20Formato%20Digital.pdf'}
            titulo={"otro libro para comprobar numero 3"}
            descripcion={"el final de pruebas tal vez"}
            // onPress={()=>setVisible(false)} data={Libros[0]}
            />

            <Libro
            url={'https://www.ujaen.es/servicios/negapoyo/sites/servicio_negapoyo/files/uploads/Modelo%20Archivo%20en%20Formato%20Digital.pdf'}
            titulo={"otro libro para comprobar numero 3"}
            descripcion={"el final de pruebas tal vez"}
            // onPress={()=>setVisible(false)} data={Libros[0]}
            />

          </View>

      );


}
export default Notificaciones;
*/

const AnchoPantalla = Dimensions.get("window").width;
const AltoPantalla = Dimensions.get("window").height;

const ItemNotificacion = (props)=>{
  const {Id,Avatar,Titulo,Nombre,Fecha,Mensaje} = props;
  return(


            <TouchableOpacity  onPress={null} style={{width:AnchoPantalla * (0.95),alignSelf:"center",justifyContent:"center",alignItems:"center",flexDirection:"row", backgroundColor: "#fff",flexWrap: 'nowrap',padding: 10}}>
                <View style={{width: "25%",flexWrap: 'nowrap',alignItems: 'center',justifyContent: 'center'}}>
                  <IconoDeAvatar rounded title={"AG"} source={{uri: Avatar}} size={"large"}/>
                </View>
                  <View style={{width: "75%",flexDirection: 'column',flexWrap: 'wrap',justifyContent: 'center',alignItems: 'center',alignSelf: 'center'}}>
                    <Text style={{fontFamily: "Viga-Regular",color:"#222f3e",textAlign: 'center'}}>Titulo: <Text style={{fontSize: 13,color:"#2980b9"}}>{Titulo}</Text></Text>
                    <Text style={{fontFamily: "Viga-Regular",color:"#222f3e",textAlign: 'center'}}>Mensaje: <Text style={{fontSize: 13,color:"#fa8231"}}>{Mensaje}</Text></Text>
                    <Text style={{fontFamily: "Viga-Regular",color:"#222f3e",textAlign: 'center'}}>Fecha: <Text style={{fontSize: 13,color:"#5f27cd"}}>{Fecha}</Text></Text>
                  </View>
            </TouchableOpacity>



    )
}


const Notificaciones = (props) => {
    const datosDeCredencial = useSelector(store => store.datosDeCredencial);//usuario visitante
    const [state,setState] = useState([]);

    const [refresh,setRefresh] = useState(true)

      useEffect(()=>{
        console.log("notifica")
        traerNotificaciones()
      },[]);

      const traerNotificaciones = () => {
        fetch('http://backpack.sytes.net/servidorApp/php/notificaciones/traerDatosDeNotificaciones.php',{
            method:'post',
            header:{
              'Accept': 'application/json',
              'Content-type': 'application/json'
            },
            body:JSON.stringify({
              matricula:datosDeCredencial.matricula,
            })

          })
          .then((response) => response.json())
           .then((responseJson)=>{
             setState(responseJson);
             console.log("respuesta => ",responseJson)
             setRefresh(false)
           })
           .catch((error)=>{
            setRefresh(false)
           console.error(error);
           });
      }



//brainly xd backgroundColor:"#c8d6e5"
    return (

      <View style={{flex:1,backgroundColor:"rgba(218, 218, 218, 0.61)"}}>

        <FlatList
          data={state}
          keyExtractor={(item)=> item.Orden }
          ListHeaderComponent={()=>(<View style={{width:"100%",height:25}}/>)}
          ItemSeparatorComponent={()=>(<View style={{width:"100%",height:15}}/>)}
          ListFooterComponent={()=>(<View style={{width:"100%",height:25}}/>)}
          refreshControl={<RefreshControl
						 colors={["#9Bd35A", "#689F38"]}
						 refreshing={refresh}
						 onRefresh={()=>{
							 console.log("recargando");
							 setRefresh(true);
							 traerNotificaciones()

						 }
					 } />
          }
          ListEmptyComponent={
            ()=>
            (
              <>
              { (!refresh) ?
                
                  <View style={{width:AnchoPantalla * (0.8),padding:10,justifyContent:"center",alignSelf:"center",alignItems:"center",backgroundColor:"#111",borderRadius:10}}>
                      <Text style={{textAlign:"center",color:"#fff",fontSize:17,fontFamily: "Viga-Regular"}}>No tienes Ninguna Notificación Aun...=)</Text>
                  </View>
                
                :
                null
              }
            </>
          )
          }
          renderItem={
              ({item})=>{
                return(
                <ItemNotificacion
                Id={item.Id}
                Titulo={item.Titulo}
                Avatar={item.Avatar}
                Fecha={item.Subido}
                Mensaje={item.Mensaje}
                />
                )
              }
          }
          />

      </View>

    );

}


export default Notificaciones;
