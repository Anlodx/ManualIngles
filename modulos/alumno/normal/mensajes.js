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
import { Icon,CheckBox } from 'react-native-elements';
import { ListItem } from 'react-native-elements';

import BotonOpcionesChat from "./botonOpcionesChat"

import { Button,SearchBar,ButtonGroup } from 'react-native-elements';

import {ItemUsuario,ItemHoja,ItemLibro,ItemLibreta,ItemChat} from "./formatos";


class Mensajes extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      ModalNuevoChat:false,
      Chats:[{
        Id:"1741907092",
        NombreCompleto:{
          Nombres:"Angel Gabriel",
          ApellidoPaterno:"Hernandez",
          ApellidoMaterno:"Hernandez"
        },
        Avatar:"https://images.unsplash.com/photo-1542044896530-05d85be9b11a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60 ",
        UltVez:"12/09/02"        
      },
      {
        Id:"1741907091",
        NombreCompleto:{
          Nombres:"Alonso",
          ApellidoPaterno:"Hernandez",
          ApellidoMaterno:"Hernandez"
        },
        Avatar:"https://images.unsplash.com/photo-1542044896530-05d85be9b11a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60 ",
        UltVez:"12/09/02"        
      },
      {
        Id:"1741907093",
        NombreCompleto:{
          Nombres:"Angel",
          ApellidoPaterno:"Gonzales",
          ApellidoMaterno:"Hernandez"
        },
        Avatar:"https://images.unsplash.com/photo-1542044896530-05d85be9b11a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60 ",
        UltVez:"12/09/02"        
      },
      {
        Id:"1741907090",
        NombreCompleto:{
          Nombres:"Manuel",
          ApellidoPaterno:"Gonzales",
          ApellidoMaterno:"Hernan"
        },
        Avatar:"https://images.unsplash.com/photo-1542044896530-05d85be9b11a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60 ",
        UltVez:"12/09/02"        
      },
      {
        Id:"17419070",
        NombreCompleto:{
          Nombres:"Arriaga",
          ApellidoPaterno:"Juanes",
          ApellidoMaterno:"Perez"
        },
        Avatar:"https://images.unsplash.com/photo-1542044896530-05d85be9b11a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60 ",
        UltVez:"12/09/02"        
      },
      {
        Id:"17419073",
        NombreCompleto:{
          Nombres:"Angel",
          ApellidoPaterno:"Lopez",
          ApellidoMaterno:"Lopez"
        },
        Avatar:"https://images.unsplash.com/photo-1542044896530-05d85be9b11a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60 ",
        UltVez:"12/09/02"        
      }]
    };
  }

  render() {
	  
    const CreaChat = ()=>{
		this.setState({...this.state,ModalNuevoChat:true})
		//alert("jkjgk")
	}

    return (
      <View style={{flex:1,backgroundColor:"#c8d6e5"}}>
        
		

       <FlatList
       data={this.state.Chats}
       keyExtractor={(item) => item.Id}
       ListHeaderComponent={()=>(<View style={{width:"100%",height:20}}/>)}
       ItemSeparatorComponent={()=>(<View style={{width:"100%",height:10}}/>)}
       ListFooterComponent={()=>(<View style={{width:"100%",height:20}}/>)}
       renderItem={
        ({item})=>(
          <ItemChat 
            Id={item.Id} 
            Nombre={item.NombreCompleto} 
            Avatar={item.Avatar} 
            UltVez={item.UltVez}/>
            )
     }
            />
			
     <BotonOpcionesChat style={{bottom:140,right:60}} creaUnChat={CreaChat} />


      <Modal visible={this.state.ModalNuevoChat} transparent={true}>
          <View style={{backgroundColor:"rgba(1,1,1,.5)",flex:1,justifyContent:"center",alignItems:"center",borderRadius:20}}>{/* acomoda el modal al centro */}

            <View style={{width:"95%",height:500,justifyContent:"center",alignItems:"center",flexDirection:"column",backgroundColor:"#c8d6e5",borderRadius:20}}>{/* contenido del modal*/}

              <View style={{width:"100%",alignItems:"center",justifyContent:"space-around",flexDirection:"row",padding:20,borderBottomWidth:2,borderBottomColor:"rgba(1,1,1,.5)",backgroundColor:"#222f3e",borderTopLeftRadius:20,borderTopRightRadius:20}}>
                <Text style={{fontSize:18,color:"#2e86de"}}>Contactos: </Text>
                <Icon type="font-awesome" name="close" size={24} color={"#fff"} onPress={()=>this.setState({...this.state,ModalNuevoChat:false})}/>
               </View>

               <FlatList
               data={this.state.Chats}
               keyExtractor={(item) => item.Id}
               initialNumToRender={5}
              ListHeaderComponent={()=>(<View style={{width:"100%",height:25}}/>)}
              ItemSeparatorComponent={()=>(<View style={{width:"100%",height:15}}/>)}
              ListFooterComponent={()=>(<View style={{width:"100%",height:25}}/>)}
               renderItem={
                ({item})=>(
                  <ItemChat 
                    Id={item.Id} 
                    Nombre={item.NombreCompleto} 
                    Avatar={item.Avatar} 
                    UltVez={item.UltVez}/>
                    )
             }
                    />

            </View>

          </View>
        </Modal>

      </View>
    );
  }
}


export default Mensajes;