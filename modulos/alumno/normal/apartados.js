import React,{Component,useState} from 'react';
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
  TextInput
} from 'react-native';
import { Icon } from 'react-native-elements';

import { Button,SearchBar,Header,ButtonGroup } from 'react-native-elements';

import ApartadosDeMochila from './apartadosDeMochila.js';

const Apartados = () =>
{
	const evento1 = () => {
		console.log('A CONTINUACION, RETORNARE EL ApartadosDeMochila');
		return (<ApartadosDeMochila />);
	}
	
	
          const [modalVisible, setModalVisible] = useState(false);
		  /*
    return(
      <View style={{flexDirection:"column",justifyContent:"space-around",alignItems:"center"}}>
      
      <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center",alignSelf:"flex-end",width:"25%",height:50}}>
         <Icon type="font-awesome-5" name="question-circle" size={30} color="#52575D" onPress={()=>setModalVisible(true)}/>   
       </View>
       
       <TouchableOpacity style={{width:"70%",height:70,flexDirection:"row",justifyContent:"space-around",alignItems:"center",backgroundColor:"#FF5722",padding:20,margin:20,borderRadius:20}}>
          <Icon type="material" name="public" size={35} color="#FFC107" />   
          <Text style={{color:"white",fontSize:17,fontWeight:"200",textAlign:"center"}}>Apartado Publico</Text>
        </TouchableOpacity>
        
       <TouchableOpacity onPress={evento1} style={{width:"70%",height:70,flexDirection:"row",justifyContent:"space-around",alignItems:"center",backgroundColor:"#FFC107",padding:20,margin:20,borderRadius:20}}>
          <Icon type="material" name="phonelink-lock" size={35} color="#FF5722" />   
          <Text style={{color:"white",fontSize:17,fontWeight:"200",textAlign:"center"}}>Apartado Privado</Text>
        </TouchableOpacity>

        

       
       <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={{flex:1,justifyContent:"center",alignItems:"center",alignSelf:"center",backgroundColor:"rgba(0,0,0,0.7)",width:"100%"}}>
         <View style={{flexDirection:"column",justifyContent:"center",alignItems:"center",width:"80%",padding:40,alignSelf:"center",borderRadius:40,backgroundColor:"#CFD8DC"}}>
           <View style={{width:"100%",flexDirection:"row",justifyContent:"space-around",height:40,alignItems:"center",backgroundColor:"none"}}>
            <Text style={{color:"#03A9F4",fontSize:17,fontWeight:"200",textAlign:"center"}}>¿Como Usar?</Text>
            <Icon type="font-awesome" name="close" size={35} color="#52575D" onPress={()=>setModalVisible(false)} containerStyle={{marginBottom:35,marginLeft:30}}/>
           </View>
           <View>
              <Text style={{color:"#263238",fontSize:19,fontWeight:"200",textAlign:"center"}}>Bienvenido a la seccion de apartados,te cuento,en el 
              <Text style={{color:"#FFC107"}}> apartado privado</Text> puedes agregar contenido es decir <Text style={{color:"#E91E63"}}>Libretas</Text> y <Text style={{color:"#3F51B5"}}>libros</Text> que solo tu puedes ver.</Text>
               <Text style={{color:"#263238",fontSize:19,fontWeight:"200",textAlign:"center"}}>
                  Si deseas compartir una libreta o libro puedes importar una libreta o libro al <Text style={{color:"#FF5722"}}>apartado publico</Text> para que los demas se enteren de lo que sabes.
               </Text>
           </View>
         </View>     
         </View>
       </Modal>
       
      </View>
      );
	  */
	  return (<ApartadosDeMochila />);
}






export default Apartados;
/*
dentro del modal de apartados

         <View style={{flexDirection:"column",justifyContent:"center",alignItems:"center",width:"90%",padding:40,alignSelf:"center",borderRadius:40,backgroundColor:"#CFD8DC"}}>
           <View style={{width:"100%",flexDirection:"row",justifyContent:"space-around",height:40,alignItems:"center",backgroundColor:"none"}}>
            <Text style={{color:"#03A9F4",fontSize:17,fontWeight:"200",textAlign:"center"}}>¿Como Usar?</Text>
            <Icon type="font-awesome" name="close" size={35} color="#52575D" onPress={()=>setModalVisible(false)} containerStyle={{marginBottom:35,marginLeft:30}}/>
           </View>
           <View>
              <Text style={{color:"#263238",fontSize:19,fontWeight:"200",textAlign:"center"}}>Bienvenido a la seccion de apartados,te cuento,en el 
              <Text style={{color:"#FFC107"}}> apartado privado</Text> puedes agregar contenido es decir <Text style={{color:"#E91E63"}}>Libretas</Text> y <Text style={{color:"#3F51B5"}}>libros</Text> que solo tu puedes ver.</Text>
               <Text style={{color:"#263238",fontSize:19,fontWeight:"200",textAlign:"center"}}>
                  Si deseas compartir una libreta o libro puedes importar una libreta o libro al <Text style={{color:"#FF5722"}}>apartado publico</Text> para que los demas se enteren de lo que sabes.
               </Text>
           </View>
         </View>     


*/





/*

dentro del modal de contenido de mochila:

      
         <View style={{flexDirection:"column",justifyContent:"center",alignItems:"center",width:"90%",padding:40,alignSelf:"center",borderRadius:40,backgroundColor:"#CFD8DC"}}>
           <View style={{width:"100%",flexDirection:"row",justifyContent:"space-around",height:40,alignItems:"center",backgroundColor:"none"}}>
            <Text style={{color:"#03A9F4",fontSize:17,fontWeight:"200",textAlign:"center"}}>¿Como Usar?</Text>
            <Icon type="font-awesome" name="close" size={24} color="#52575D" onPress={()=>setModalVisible(false)}/>
           </View>
           <View>
              <Text style={{color:"#263238",fontSize:19,fontWeight:"200",textAlign:"center"}}>
                  Bienvenido, aqui puedes Ver y editar tus temas en un concepto que llamamos <Text style={{color:"#E91E63"}}>Hojas</Text> la cual puede contener: </Text>


              <View style={{width:"100%",flexDirection:"column",marginTop:2,marginBottom:2}}>
                <View style={{width:"100%",flexDirection:"row",justifyContent:"center",margin:3}}>
                  <Icon type="entypo" name="video" size={30} color="#E91E63" onPress={()=>setModalVisible(false)}/>
                  <Text style={{color:"#263238",fontSize:19,fontWeight:"200",textAlign:"center",marginLeft:34}}>Videos</Text>
                </View>
                <View style={{width:"100%",flexDirection:"row",justifyContent:"center",margin:3}}>
                  <Icon type="font-awesome-5" name="images" size={30} color="#673AB7" onPress={()=>setModalVisible(false)}/>
                  <Text style={{color:"#263238",fontSize:19,fontWeight:"200",textAlign:"center",marginLeft:34}}>Imagenes</Text>
                </View>
                <View style={{width:"100%",flexDirection:"row",justifyContent:"center",margin:3}}>
                  <Icon type="font-awesome-5" name="file-audio" size={30} color="#FF9800" onPress={()=>setModalVisible(false)}/>
                  <Text style={{color:"#263238",fontSize:19,fontWeight:"200",textAlign:"center",marginLeft:34}}>Audio</Text>
                </View>
                <View style={{width:"100%",flexDirection:"row",justifyContent:"center",margin:3}}>
                  <Icon type="font-awesome-5" name="text-height" size={30} color="#4CAF50" onPress={()=>setModalVisible(false)}/>
                  <Text style={{color:"#263238",fontSize:19,fontWeight:"200",textAlign:"center",marginLeft:34}}>Texto</Text>
                </View>
              </View>

              <Text  style={{color:"#263238",fontSize:19,fontWeight:"200",textAlign:"center"}}>
               lo necesario para explicar algun tema a tu manera</Text>

               <Text style={{color:"#263238",fontSize:19,fontWeight:"200",textAlign:"center"}}>
                  Y como bien sabes las hojas estan dentro de las libretas asi que aqui es lo mismo,puedes ver al concepto de <Text style={{color:"#D50000"}}>Libreta</Text> como una "carpeta" que contiene las hojas que tu deseas, 
                  {"\n"}{"\n"}
                  <Text style={{color:"#F44336"}}>Tambien puedes crear hojas sueltas (es decir que no pertenecen a ninguna libreta).</Text>
                  {"\n"}
                  puedes guardar un archivo <Text style={{color:"#E91E63"}}>PDF</Text> como  concepto <Text style={{color:"#E91E63"}}>Libro</Text>.{"\n"}
                  {"\n"}
                  <Text style={{color:"#9C27B0"}}>
                    Al momento que estas en el apartado privado puedes mover tus hojas,libretas ya hechas, o libros al apartado publico,
                    ahi cualquier persona podra ver su contenido, y es asi que puedes compartir tu conocimiento a 
                    los demas con un tema ya explicado a tu estilo.
                  </Text>
               </Text>
                             

           </View>
         </View>   




*/

/*

         <View style={{backgroundColor:"#ecf0f1",borderWidth:1,borderColor:"black",borderRadius:60/2,width:360,height:450,justifyContent:"center",alignItems:"center",alignSelf:"center",flexDirection:"column"}}>
          <View style={{flexDirection:"column",justifyContent:"center",alignItems:"center",width:"90%",padding:40,alignSelf:"center",borderRadius:40,backgroundColor:"#CFD8DC"}}>
           <View style={{width:"100%",flexDirection:"row",justifyContent:"space-around",height:40,alignItems:"center",backgroundColor:"none"}}>
            <Text style={{color:"#03A9F4",fontSize:17,fontWeight:"200",textAlign:"center"}}>¿Como Usar?</Text>
            <Icon type="font-awesome" name="close" size={35} color="#52575D" onPress={()=>setModalVisible(false)} containerStyle={{marginBottom:35,marginLeft:30}}/>
           </View>
           <View>
              <Text style={{color:"#263238",fontSize:19,fontWeight:"200",textAlign:"center"}}>Bienvenido a la seccion de apartados,te cuento,en el 
              <Text style={{color:"#FFC107"}}> apartado privado</Text> puedes agregar contenido es decir <Text style={{color:"#E91E63"}}>Libretas</Text> y <Text style={{color:"#3F51B5"}}>libros</Text> que solo tu puedes ver.</Text>
               <Text style={{color:"#263238",fontSize:19,fontWeight:"200",textAlign:"center"}}>
                  Si deseas compartir una libreta o libro puedes importar una libreta o libro al <Text style={{color:"#FF5722"}}>apartado publico</Text> para que los demas se enteren de lo que sabes.
               </Text>
           </View>
         </View>     
         </View>            
*/





