import React, {useState, useEffect, useRef} from 'react';
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
  TextInput,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Icon,CheckBox } from 'react-native-elements';
import { ListItem, Avatar as IconoDeAvatar } from 'react-native-elements';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Button,SearchBar,ButtonGroup } from 'react-native-elements';

import {establecerVariablesDentroDeMochilaDesdeItemLibreta,establecerVariablesDentroDeMochilaDesdeItemLibro, establecerVariablesDentroDeMochilaDesdeItemHoja, establecerDatosDeCredencialEspectado, vaciarVariablesDentroDeMochila, establecerIndiceParaApartadosDeMochila} from '../../../store/actions.js';


import {useSelector, useDispatch} from 'react-redux';

//fontFamily: "AkayaKanadaka-Regular",


export const ComponenteDeImagen = (props)=> {
const [ModalVisible, setModalVisible] = useState(false);

const estilos = StyleSheet.create({
  contenedorPrincipal : {
    width: '100%',
    height: 250,
    flexDirection: 'row',

  },
  contenedorSecundario : {
      width: '100%',
      height: '100%',
      flexDirection: 'row',
      backgroundColor: 'black'
    }
});

return(
<>
  <View style={estilos.contenedorPrincipal}>

    <View style={estilos.contenedorSecundario}>
      <TouchableWithoutFeedback onPress={()=>setModalVisible(true)} style={{flex:1}}>
        <Image source={{uri:props.urlDeImagen}} style={{flex:1,alignSelf:"stretch"}} resizeMode="contain"/>
      </TouchableWithoutFeedback>
    </View>

    <Modal style={{flex:1}} visible={ModalVisible} onRequestClose={()=>setModalVisible(false)} transparent={false} animationType={"fade"}>
      <View  style={{flex:1, justifyContent:"center",flexDirection:"column"}}>

        <ImageViewer imageUrls={[{url: props.urlDeImagen}]}
          renderIndicator={()=>null}
          renderHeader={()=>(
            <View style={{width:"90%",height:50,justifyContent:"flex-start",flexDirection:"row",alignItems:"center",alignSelf:"center"}}>
              <Icon type="material" name="arrow-back" size={24} color="#52575D" onPress={()=>setModalVisible(false)}/>
            </View>
          )}
        />
      </View>
    </Modal>
  </View>
</>
  );
}

const AnchoPantalla = Dimensions.get("window").width;
const AltoPantalla = Dimensions.get("window").height;

const ModalCargando = () => {
	return (
		<Modal visible={true} transparent={true}>
			<View style={{width : '100%' , height : '100%', justifyContent : 'center', alignItems : 'center', backgroundColor : 'rgba(0,0,0,.5)'}}>
				<View style={{width : '80%' , height : '30%' , flexDirection : 'column' , alignItems : 'center', justifyContent : 'space-around', backgroundColor : 'lavender', borderRadius : 10}}>
					<ActivityIndicator size={'large'} color={'black'}/>
					<Text>{'Cargando...'}</Text>
				</View>
			</View>
		</Modal>
	);
}

const ModalError = (props) => {
	return (
		<Modal visible={true} transparent={true}>
			<View style={{width : '100%' , height : '100%', justifyContent : 'center', alignItems : 'center', backgroundColor : 'rgba(0,0,0,.5)'}}>
				<View style={{width : '80%' , height : '30%' , flexDirection : 'column' , alignItems : 'center', justifyContent : 'space-around', backgroundColor : 'lavender', borderRadius : 10}}>
					<Text>{'Error'}</Text>
					<Text></Text>
					<TouchableOpacity onPress={props.cerrarModal} style={{width: 100, height: 50, backgroundColor: 'lightgreen', justifyContent: "center", alignItems: "center"}}>
						<Text>{'Ok'}</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
}

export const ItemNotificacion = (props)=>{
  const {Id,Avatar,Asunto,Nombre,Fecha} = props;
  return(


            <TouchableOpacity  onPress={null} style={{width:"98%",alignSelf:"center",justifyContent:"center",alignItems:"center",flexDirection:"row", backgroundColor: "#fff",flexWrap: 'nowrap',padding: 10}}>
                <View style={{width: "25%",flexWrap: 'nowrap',alignItems: 'center',justifyContent: 'center'}}>
                  <IconoDeAvatar rounded title={"AG"} source={{uri: Avatar}} size={"medium"}/>
                </View>
                  <View style={{width: "75%",flexDirection: 'column',flexWrap: 'wrap',justifyContent: 'center',alignItems: 'center',alignSelf: 'center'}}>
                    <Text style={{color:"#222f3e",textAlign: 'center'}}>Asunto: <Text style={{color:"#2980b9"}}>{Asunto}</Text></Text>
                    <Text style={{color:"#222f3e",textAlign: 'center'}}>Nombre: <Text style={{color:"#fa8231"}}>{Nombre.Nombres + " " +Nombre.ApellidoPaterno + " " + Nombre.ApellidoMaterno}</Text></Text>
                    <Text style={{color:"#222f3e",textAlign: 'center'}}>Fecha: <Text style={{color:"#5f27cd"}}>{Fecha}</Text></Text>
                  </View>
            </TouchableOpacity>



    )
}
export const ItemUsuario = (props)=>{
  const {Id,Avatar,Nombre,Especialidad,action} =  props;
//hola
  return(

        <TouchableOpacity  onPress={action} style={{width: (AnchoPantalla) * (0.9), padding:8, alignSelf: "center", flexDirection: "row", backgroundColor: "#fff", borderRadius: 10, borderBottomWidth: 4, borderWidth: 1, borderColor: "rgba(0,0,0,0.2)", borderBottomColor: "rgba(0,0,0,0.2)"}}>
            <View style={{width: ((AnchoPantalla) * (0.9)) * (0.25), alignItems: "center", justifyContent: 'center'}}>
              <IconoDeAvatar rounded title={"AG"} source={{uri: Avatar}} size={"medium"}/>
            </View>
              <View style={{width: ((AnchoPantalla) * (0.9)) * (0.70)}}>
                <Text style={{color:"#222f3e",fontSize:14,fontFamily: "Viga-Regular"}}>{Nombre.Nombres + " " +Nombre.ApellidoPaterno + " " + Nombre.ApellidoMaterno}</Text>
                <Text style={{color:"#0abde3",fontSize:13,fontFamily: "Viga-Regular"}}>Especialidad: <Text style={{color:"#ff6b6b",fontSize:13,fontFamily: "Viga-Regular"}}>{Especialidad}</Text></Text>
              </View>
        </TouchableOpacity>


    )

}
export const ItemHoja = (props)=> {
	const datosDeCredencial = useSelector(store => store.datosDeCredencial);

	const dispatch = useDispatch();

	const {Id,Avatar,Nombre,Especialidad,Subido,NombreHoja,DescripcionHoja} =  props;

	const [datosDelComponenteS, modificarDatosDelComponenteS] = useState({
		estado: null
		/*
			estado = "Cargando"
			estado = "Error"
			estado = null
		*/
	});

	const eventos = {
		ayudaParaIrAMochilaVisitante: async (matricula) => {
			let datos = new FormData();
			datos.append('indice', matricula);

			let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/busqueda/busquedaDeAlumno/busquedaDeAlumnoPorMatricula.php', {
				method: 'POST',
				body: datos
			})
			.then(msj => msj.text())
			.then(respuesta => {
				let datosDeCredencialEspectado = JSON.parse(respuesta);

        console.log("datosDeCredencialEspectado  desde hoja==>> ", datosDeCredencialEspectado);
        dispatch(establecerDatosDeCredencialEspectado({
          matricula: datosDeCredencialEspectado.Id,
      		nombreCompleto: {
      			nombres: datosDeCredencialEspectado.Nombre.Nombres,
      			apellidoPaterno: datosDeCredencialEspectado.Nombre.ApellidoPaterno,
      			apellidoMaterno: datosDeCredencialEspectado.Nombre.ApellidoMaterno
      		},
      		especialidad: datosDeCredencialEspectado.Especialidad,
      		fechaDeNacimiento: null,
      		genero: null,
      		frase: datosDeCredencialEspectado.Frase,
      		rutaDeFoto: datosDeCredencialEspectado.Avatar,
      		hobbies: datosDeCredencialEspectado.Hobbies
        }));
        dispatch(establecerIndiceParaApartadosDeMochila("Visualizar Hoja Del Apartado Publico"));
				props.navigation.navigate("MochilaVisitante", {
                    datosDeCredencialEspectador: datosDeCredencial,
                    datosDeCredencialEspectado: datosDeCredencialEspectado,
                    //indiceParaApartadosDeMochila: "Visualizar Hoja Del Apartado Publico"
                });

                modificarDatosDelComponenteS({
                    ...datosDelComponenteS,
                    estado: null
                });
			})
			.catch(error => {
                console.log("aqui toy => ",error);
                dispatch(establecerVariablesDentroDeMochilaDesdeItemLibreta({
					matriculaDelPropietario: null,

					eleccionDeApartado: '',//apartado publico
					cantidadDeLibretas: 0,
					cantidadDeExamenes: 0,
					cantidadDeHojasSueltas: 0,


					//OCUPAMOS ESTAS VARIABLES PROVENIENTES DE apartadoElegido.js
					arreglosDeLibretas: {
						nombres: [],
						numerosDeHojas: [],
						idsDeElemento : [],
						descripciones: [],
						fechasDeSubida: []
					},
					arreglosDeExamenes : {},
					arreglosDeHojasSueltas : {},

					//OCUPAMOS ESTAS VARIABLES PROVENIENTES DE mostrarLibretas.js
					eleccionIdDeLibreta : '',
					eleccionNombreDeLibreta : '',
					arreglosDeHojas : {
						nombres : [],
						numerosDeComponentes : [],
						idsDeElemento : [],
						descripciones: [],
						fechasDeSubida: []
					},

					//OCUPAMOS ESTAS VARIABLES PROVENIENTES DE mostrarHojasDeLibreta.js
					eleccionIdDeHoja : '',
					eleccionNombreDeHoja : '',
					eleccionNumeroDeComponentesDeHoja : null
                }));
				modificarDatosDelComponenteS({
					...datosDelComponenteS,
					estado: 'Error'
				});
			});
		},
		establecerVariablesDentroDeMochilaDesdeItemHoja: async () => {
			let objetoConInformacion = {
                matriculaDelPropietario: (Id.split('_'))[2],
                eleccionDeApartado: 'apartado publico',
				eleccionIdDeLibreta: (Id.split('_'))[0],
				eleccionIdDeHoja: (Id.split('_'))[1],
			}
			let json = JSON.stringify(objetoConInformacion);
			let datos = new FormData();
			datos.append("indice", json);

			let promesa = await fetch("http://backpack.sytes.net/servidorApp/php/busqueda/busquedaDeItem/ayudaParaEstablecerVariablesDentroDeMochilaDesdeItemHoja.php", {
				method: "POST",
				body: datos
			})
			.then(msj => msj.text())
			.then(respuesta => {
				let objetoConAyuda = JSON.parse(respuesta);

				const objetoParaRedux = {
                    matriculaDelPropietario: (Id.split('_'))[2],

                    eleccionDeApartado: 'apartado publico',
                    cantidadDeLibretas: objetoConAyuda.ObjetoConCantidades.cantidadDeLibretas,
                    cantidadDeExamenes: objetoConAyuda.ObjetoConCantidades.cantidadDeExamenes,
                    cantidadDeHojasSueltas: objetoConAyuda.ObjetoConCantidades.cantidadDeHojasSueltas,


                    //OCUPAMOS ESTAS VARIABLES PROVENIENTES DE apartadoElegido.js
                    arreglosDeLibretas: objetoConAyuda.ArreglosDeLibretas,
                    arreglosDeExamenes: objetoConAyuda.ArreglosDeExamenes,
                    arreglosDeHojasSueltas: objetoConAyuda.ArreglosDeHojasSueltas,

                    //OCUPAMOS ESTAS VARIABLES PROVENIENTES DE mostrarLibretas.js
                    eleccionIdDeLibreta: (Id.split('_'))[0],
                    eleccionNombreDeLibreta: objetoConAyuda.EleccionNombreDeLibreta,
					arreglosDeHojas: objetoConAyuda.ArreglosDeHojas,

					eleccionIdDeHoja: (Id.split('_'))[1],
					eleccionNombreDeHoja: NombreHoja,
					eleccionNumeroDeComponentesDeHoja: objetoConAyuda.EleccionNumeroDeComponentesDeHoja
				}

				dispatch(establecerVariablesDentroDeMochilaDesdeItemHoja(objetoParaRedux));
				eventos.ayudaParaIrAMochilaVisitante((Id.split('_'))[2]);
			})
			.catch(error => {
				modificarDatosDelComponenteS({
					...datosDelComponenteS,
					estado: "Error"
				});
			});
		}
	}

  return(
         <TouchableOpacity onPress={()=>{
           if(props.cerrarModalPrincipal){
               props.cerrarModalPrincipal();
           }
			modificarDatosDelComponenteS({
				...datosDelComponenteS,
				estado: 'Cargando'
			});
			eventos.establecerVariablesDentroDeMochilaDesdeItemHoja();
    }} style={{width:AnchoPantalla * (0.9),alignSelf:"center",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>

              <View style={{width:AnchoPantalla * (0.9),alignSelf:"center",justifyContent:"center",alignItems:"center",flexDirection:"row", backgroundColor: "#ff7675",flexWrap: 'nowrap',padding: 10}}>
                  <View style={{width: (AnchoPantalla * (0.9))*(0.25),flexWrap: 'nowrap',alignItems: 'center',justifyContent: 'center'}}>
                    <IconoDeAvatar rounded title={"AG"} source={{uri: Avatar}} size={"medium"}/>
                  </View>
                    <View style={{width: (AnchoPantalla * (0.9))*(0.75),flexDirection: 'column',flexWrap: 'wrap',justifyContent: 'center',alignItems: 'center',alignSelf: 'center'}}>
                      <Text style={{fontFamily: "Viga-Regular",color:"#fff"}}>De: <Text style={{color:"#81ecec"}}>{Nombre.Nombres + " " +Nombre.ApellidoPaterno + " " + Nombre.ApellidoMaterno}</Text></Text>
                      <Text style={{fontFamily: "Viga-Regular",color:"#fff"}}>Especialidad: <Text style={{color:"#ffeaa7"}}>{Especialidad}</Text></Text>
                      <Text style={{fontFamily: "Viga-Regular",color:"#fff"}}>Subido: <Text style={{color:"#30336b"}}>{Subido}</Text></Text>
                    </View>
              </View>
            <View style={{backgroundColor:"#fff",width:AnchoPantalla * (0.9),flexDirection:"row",justifyContent:"flex-start",alignItems:"center",padding:20,borderBottomLeftRadius:10,borderRightWidth: 2,borderLeftWidth: 2,borderColor: "#ff7675",borderBottomRightRadius:10,borderBottomWidth:4,borderBottomColor:"#ff7675"}}>
              <Icon name='book-outline' type="material-community" color='#E91E63' size={30}/>
              <Text style={{padding:8,marginLeft:20,textAlign:"left",color:"#0984e3", textTransform: 'capitalize',}}>
              <Text style={{color:"#ff7675"}}>Nombre:</Text>
              {"\n"}{NombreHoja}{"\n"}{"\n"}
              <Text style={{color:"#ff7675"}}>Descripción:{"\n"}</Text>
              <Text style={{padding:8,marginLeft:20,textAlign:"left",color:"#6c5ce7",textTransform: 'none'}}>{DescripcionHoja}</Text>
              </Text>
            </View>

			<>
				{(datosDelComponenteS.estado === 'Cargando') ?
					<ModalCargando />
				: (datosDelComponenteS.estado === 'Error') ?
					<ModalError cerrarModal={() => {
						modificarDatosDelComponenteS({
							...datosDelComponenteS,
							estado: null
						});
					}}/>
				:
					null
				}
			</>
        </TouchableOpacity>

    )
}
export const ItemLibro = (props)=>{
	const datosDeCredencial = useSelector(store => store.datosDeCredencial);

	const {Id,Avatar,Nombre,Especialidad,Subido,NombreLibro,DescripcionLibro,Contenido} =  props;

	const dispatch = useDispatch();

	const [datosDelComponenteS, modificarDatosDelComponenteS] = useState({
		estado: null
		/*
			estado = "Cargando"
			estado = "Error"
			estado = null
		*/
	});


	//Id = "libro1_1741..."
	const eventos = {
		ayudaParaIrAMochilaVisitante: async (matricula) => {
      console.log("matricula desde libro ====>> ", matricula);
			let datos = new FormData();
			datos.append('indice', matricula);

			let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/busqueda/busquedaDeAlumno/busquedaDeAlumnoPorMatricula.php', {
				method: 'POST',
				body: datos
			})
			.then(msj => msj.text())
			.then(respuesta => {
				let datosDeCredencialEspectado = JSON.parse(respuesta);


                console.log("datosDeCredencialEspectado desde libro ==>>>> ", datosDeCredencialEspectado);
                dispatch(establecerDatosDeCredencialEspectado({
					matricula: datosDeCredencialEspectado.Id,
              		nombreCompleto: {
              			nombres: datosDeCredencialEspectado.Nombre.Nombres,
              			apellidoPaterno: datosDeCredencialEspectado.Nombre.ApellidoPaterno,
              			apellidoMaterno: datosDeCredencialEspectado.Nombre.ApellidoMaterno
              		},
              		especialidad: datosDeCredencialEspectado.Especialidad,
              		fechaDeNacimiento: null,
              		genero: null,
              		frase: datosDeCredencialEspectado.Frase,
              		rutaDeFoto: datosDeCredencialEspectado.Avatar,
              		hobbies: datosDeCredencialEspectado.Hobbies
                }));
                console.log("datosDeCredencialEspectado =>",datosDeCredencialEspectado)
                dispatch(establecerIndiceParaApartadosDeMochila("Visualizar Libro Del Apartado Publico"));
				props.navigation.navigate("MochilaVisitante", {
                    datosDeCredencialEspectador: datosDeCredencial,
                    datosDeCredencialEspectado: datosDeCredencialEspectado,
                //    indiceParaApartadosDeMochila: "Visualizar Libro Del Apartado Publico" //AQUI MODIFIQUE
                });
                modificarDatosDelComponenteS({
                    ...datosDelComponenteS,
                    estado: null
                });
			})
			.catch(error => {
                console.log("aqui toy => ",error);
                dispatch(vaciarVariablesDentroDeMochila());
				modificarDatosDelComponenteS({
					...datosDelComponenteS,
					estado: 'Error'
				});
			});
		},
		establecerVariablesDentroDeMochilaDesdeItemLibro: async () => {
            let objetoConInformacion = {
                matriculaDelPropietario: (Id.split('_'))[1],
                eleccionDeApartado: 'apartado publico',
                eleccionIdDeLibro: (Id.split('_'))[0]
            }

            console.log("objetoConInformacion desde libro =>",objetoConInformacion)

            let json = JSON.stringify(objetoConInformacion);
            console.log("objeto json de libros => ",json)
            let datos = new FormData();
            datos.append('indice', json);

			let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/busqueda/busquedaDeItem/ayudaParaEstablecerVariablesDentroDeMochilaDesdeItemLibro.php', {
                method: 'POST',
                body: datos
            })
            .then(msj => msj.text())
            .then(respuesta => {
                const objetoConAyuda = JSON.parse(respuesta);
                console.log("objetoConAyuda => ",objetoConAyuda)

                const objetoParaRedux = {
                    matriculaDelPropietario: (Id.split('_'))[1],

                    eleccionDeApartado: 'apartado publico',
                    cantidadDeLibretas: objetoConAyuda.ObjetoConCantidades.cantidadDeLibretas,
                    cantidadDeExamenes: objetoConAyuda.ObjetoConCantidades.cantidadDeExamenes,
					cantidadDeLibros: objetoConAyuda.ObjetoConCantidades.cantidadDeLibros,
                    //cantidadDeHojasSueltas: objetoConAyuda.ObjetoConCantidades.cantidadDeHojasSueltas,


                    //OCUPAMOS ESTAS VARIABLES PROVENIENTES DE apartadoElegido.js
                    //arreglosDeLibretas: objetoConAyuda.ArreglosDeLibretas,
                    //arreglosDeExamenes : objetoConAyuda.ArreglosDeExamenes,
                    //arreglosDeHojasSueltas : objetoConAyuda.ArreglosDeHojasSueltas,

                    //OCUPAMOS ESTAS VARIABLES PROVENIENTES DE mostrarLibretas.js
                    eleccionIdDeLibro : (Id.split('_'))[0],
                    eleccionNombreDeLibro : NombreLibro,
					eleccionDescripcionDeLibro: DescripcionLibro,
					eleccionContenidoDeLibro: Contenido,



                    arregloDeLibros : objetoConAyuda.ArregloDeLibros
                }
                console.log("OBJETO PARA REDUX LIBRP : ",objetoParaRedux)

                dispatch(establecerVariablesDentroDeMochilaDesdeItemLibro(objetoParaRedux));
                eventos.ayudaParaIrAMochilaVisitante((Id.split('_'))[1]);
            })
            .catch(error => {
                modificarDatosDelComponenteS({
					...datosDelComponenteS,
					estado: "Error"
				});
            });


		}
	}



  return(

        <TouchableOpacity onPress={()=>{
			if(props.cerrarModalPrincipal){
				props.cerrarModalPrincipal();
			}

			modificarDatosDelComponenteS({
				...datosDelComponenteS,
				estado: 'Cargando'
			});
			eventos.establecerVariablesDentroDeMochilaDesdeItemLibro();
		}} style={{width:AnchoPantalla * (0.9) ,alignSelf:"center",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>

              <View style={{width:AnchoPantalla * (0.9),alignSelf:"center",justifyContent:"center",alignItems:"center",flexDirection:"row", backgroundColor: "#00a8ff",flexWrap: 'nowrap',padding: 10}}>
                  <View style={{width: (AnchoPantalla * (0.9))*(0.25),flexWrap: 'nowrap',alignItems: 'center',justifyContent: 'center'}}>
                    <IconoDeAvatar rounded title={"AG"} source={{uri: Avatar}} size={"medium"}/>
                  </View>
                    <View style={{width: (AnchoPantalla * (0.9))*(0.75),flexDirection: 'column',flexWrap: 'wrap',justifyContent: 'center',alignItems: 'center',alignSelf: 'center'}}>
                      <Text style={{fontFamily: "Viga-Regular",color:"#fff"}}>De: <Text style={{color:"#81ecec"}}>{Nombre.Nombres + " " +Nombre.ApellidoPaterno + " " + Nombre.ApellidoMaterno}</Text></Text>
                      <Text style={{fontFamily: "Viga-Regular",color:"#fff"}}>Especialidad: <Text style={{color:"#ffeaa7"}}>{Especialidad}</Text></Text>
                      <Text style={{fontFamily: "Viga-Regular",color:"#fff"}}>Subido: <Text style={{color:"#30336b"}}>{Subido}</Text></Text>
                    </View>
              </View>


            <View style={{backgroundColor:"#fff",width:AnchoPantalla * (0.9),flexDirection:"row",justifyContent:"flex-start",alignItems:"center",padding:20,borderRightWidth: 2,borderLeftWidth: 2,borderColor: "#74b9ff",borderBottomLeftRadius:10,borderBottomRightRadius:10,borderBottomWidth:4,borderBottomColor:"#74b9ff"}}>
              <Icon name='book-open-variant' type="material-community" color='#00BCD4' size={30}/>
              <Text style={{padding:8,marginLeft:20,textAlign:"left",color:"#ff7675", textTransform: 'capitalize',}}>
              <Text style={{color:"#74b9ff"}}>Nombre:</Text>
              {"\n"}{NombreLibro}{"\n"}{"\n"}
              <Text style={{color:"#74b9ff"}}>Descripción:{"\n"}</Text>

              <Text style={{padding:8,marginLeft:20,textAlign:"left",color:"#6c5ce7",textTransform: 'none'}}>{DescripcionLibro}</Text>
              </Text>
            </View>

			<>
				{(datosDelComponenteS.estado === 'Cargando') ?
					<ModalCargando />
				: (datosDelComponenteS.estado === 'Error') ?
					<ModalError cerrarModal={() => {
						modificarDatosDelComponenteS({
							...datosDelComponenteS,
							estado: null
						});
					}}/>
				:
					null
				}
			</>
        </TouchableOpacity>
    )
}
export const ItemLibreta = (props)=>{
	const datosDeCredencial = useSelector(store => store.datosDeCredencial);

	const dispatch = useDispatch();

	const {Id,Avatar,Nombre,Especialidad,Subido,NombreLibreta,DescripcionLibreta} =  props;

	const [datosDelComponenteS, modificarDatosDelComponenteS] = useState({
		estado: null
		/*
			estado = "Cargando"
			estado = "Error"
			estado = null
		*/
	});

	const eventos = {
		ayudaParaIrAMochilaVisitante: async (matricula) => {
			let datos = new FormData();
			datos.append('indice', matricula);

			let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/busqueda/busquedaDeAlumno/busquedaDeAlumnoPorMatricula.php', {
				method: 'POST',
				body: datos
			})
			.then(msj => msj.text())
			.then(respuesta => {
				let datosDeCredencialEspectado = JSON.parse(respuesta);


                console.log("datosDeCredencialEspectado desde libreta ==>> ", datosDeCredencialEspectado);
                dispatch(establecerDatosDeCredencialEspectado({
                  matricula: datosDeCredencialEspectado.Id,
              		nombreCompleto: {
              			nombres: datosDeCredencialEspectado.Nombre.Nombres,
              			apellidoPaterno: datosDeCredencialEspectado.Nombre.ApellidoPaterno,
              			apellidoMaterno: datosDeCredencialEspectado.Nombre.ApellidoMaterno
              		},
              		especialidad: datosDeCredencialEspectado.Especialidad,
              		fechaDeNacimiento: null,
              		genero: null,
              		frase: datosDeCredencialEspectado.Frase,
              		rutaDeFoto: datosDeCredencialEspectado.Avatar,
              		hobbies: datosDeCredencialEspectado.Hobbies
                }));
                dispatch(establecerIndiceParaApartadosDeMochila("Mostrar Hojas De Libreta Del Apartado Publico"));

				props.navigation.navigate("MochilaVisitante", {
                    datosDeCredencialEspectador: datosDeCredencial,
                    datosDeCredencialEspectado: datosDeCredencialEspectado,
                //    indiceParaApartadosDeMochila: "Mostrar Hojas De Libreta Del Apartado Publico"
                });
                modificarDatosDelComponenteS({
                    ...datosDelComponenteS,
                    estado: null
                });
			})
			.catch(error => {
                console.log("aqui toy => ",error);
                dispatch(establecerVariablesDentroDeMochilaDesdeItemLibreta({
                    matriculaDelPropietario: null,

                    eleccionDeApartado: '',
                    cantidadDeLibretas: 0,
                    cantidadDeExamenes: 0,
                    cantidadDeHojasSueltas: 0,


                    //OCUPAMOS ESTAS VARIABLES PROVENIENTES DE apartadoElegido.js
                    arreglosDeLibretas: {
                        nombres: [],
                        numerosDeHojas: [],
                        idsDeElemento : [],
                        descripciones: [],
                        fechasDeSubida: []
                    },
                    arreglosDeExamenes : {},
                    arreglosDeHojasSueltas : {},

                    //OCUPAMOS ESTAS VARIABLES PROVENIENTES DE mostrarLibretas.js
                    eleccionIdDeLibreta : '',
                    eleccionNombreDeLibreta : '',
                    arreglosDeHojas : {
                        nombres : [],
                        numerosDeComponentes : [],
                        idsDeElemento : [],
                        descripciones: [],
                        fechasDeSubida: []
                    }
                }));
				modificarDatosDelComponenteS({
					...datosDelComponenteS,
					estado: 'Error'
				});
			});
		},
		establecerVariablesDentroDeMochilaDesdeItemLibreta: async () => {
            let objetoConInformacion = {
                matriculaDelPropietario: (Id.split('_'))[1],
                eleccionDeApartado: 'apartado publico',
                eleccionIdDeLibreta: (Id.split('_'))[0]
            }
            let json = JSON.stringify(objetoConInformacion);
            let datos = new FormData();
            datos.append('indice', json);

			let promesa = await fetch('http://backpack.sytes.net/servidorApp/php/busqueda/busquedaDeItem/ayudaParaEstablecerVariablesDentroDeMochilaDesdeItemLibreta.php', {
                method: 'POST',
                body: datos
            })
            .then(msj => msj.text())
            .then(respuesta => {
                const objetoConAyuda = JSON.parse(respuesta);

                const objetoParaRedux = {
                    matriculaDelPropietario: (Id.split('_'))[1],

                    eleccionDeApartado: 'apartado publico',
                    cantidadDeLibretas: objetoConAyuda.ObjetoConCantidades.cantidadDeLibretas,
                    cantidadDeExamenes: objetoConAyuda.ObjetoConCantidades.cantidadDeExamenes,
                    cantidadDeHojasSueltas: objetoConAyuda.ObjetoConCantidades.cantidadDeHojasSueltas,


                    //OCUPAMOS ESTAS VARIABLES PROVENIENTES DE apartadoElegido.js
                    arreglosDeLibretas: objetoConAyuda.ArreglosDeLibretas,
                    arreglosDeExamenes : objetoConAyuda.ArreglosDeExamenes,
                    arreglosDeHojasSueltas : objetoConAyuda.ArreglosDeHojasSueltas,

                    //OCUPAMOS ESTAS VARIABLES PROVENIENTES DE mostrarLibretas.js
                    eleccionIdDeLibreta : (Id.split('_'))[0],
                    eleccionNombreDeLibreta : NombreLibreta,
                    arreglosDeHojas : objetoConAyuda.ArreglosDeHojas
                }

                dispatch(establecerVariablesDentroDeMochilaDesdeItemLibreta(objetoParaRedux));
                eventos.ayudaParaIrAMochilaVisitante((Id.split('_'))[1]);
            })
            .catch(error => {
                modificarDatosDelComponenteS({
					...datosDelComponenteS,
					estado: "Error"
				});
            });


		}
	}

  return(
    <TouchableOpacity onPress={() => {
		if(props.cerrarModalPrincipal){
			props.cerrarModalPrincipal();
		}

		modificarDatosDelComponenteS({
			...datosDelComponenteS,
			estado: 'Cargando'
		});
		eventos.establecerVariablesDentroDeMochilaDesdeItemLibreta();
	}} style={{width:AnchoPantalla * (0.9),alignSelf:"center",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>

		<View style={{width:AnchoPantalla * (0.9),alignSelf:"center",justifyContent:"center",alignItems:"center",flexDirection:"row",backgroundColor: "#6c5ce7",flexWrap: 'nowrap',padding: 10}}>
		 <View style={{width: (AnchoPantalla * (0.9))*(0.25),flexWrap: 'nowrap',alignItems: 'center',justifyContent: 'center'}}>
		   <IconoDeAvatar rounded title={"AG"} source={{uri: Avatar}} size={"medium"}/>
		 </View>
		   <View style={{width: (AnchoPantalla * (0.9))*(0.75),flexDirection: 'column',flexWrap: 'wrap',justifyContent: 'center',alignItems: 'center',alignSelf: 'center'}}>
			 <Text style={{fontFamily: "Viga-Regular",color:"#fff"}}>De: <Text style={{color:"#81ecec"}}>{Nombre.Nombres + " " +Nombre.ApellidoPaterno + " " + Nombre.ApellidoMaterno}</Text></Text>
			 <Text style={{fontFamily: "Viga-Regular",color:"#fff"}}>Especialidad: <Text style={{color:"#ffeaa7"}}>{Especialidad}</Text></Text>
			 <Text style={{fontFamily: "Viga-Regular",color:"#fff"}}>Subido: <Text style={{color:"#30336b"}}>{Subido}</Text></Text>
		   </View>
		</View>
		<View style={{backgroundColor:"#fff",width:AnchoPantalla * (0.9),flexDirection:"row",justifyContent:"flex-start",alignItems:"center",padding:20,borderRightWidth: 2,borderLeftWidth: 2,borderColor: "#6c5ce7",borderBottomLeftRadius:10,borderBottomRightRadius:10,borderBottomWidth:4,borderBottomColor:"#6c5ce7"}}>
			<Icon name='notebook-multiple' type="material-community" color='#6c5ce7' size={30}/>
			<Text style={{padding:8,marginLeft:20,textAlign:"left",color:"#0984e3", textTransform: 'capitalize',}}>
			<Text style={{color:"#ff7675"}}>Nombre:</Text>
			{"\n"}{NombreLibreta}{"\n"}{"\n"}
			<Text style={{color:"#ff7675"}}>Descripción:{"\n"}</Text>
			<Text style={{padding:8,marginLeft:20,textAlign:"left",color:"#6c5ce7",textTransform: 'none'}}>{DescripcionLibreta}</Text>
			</Text>
		</View>

		<>
			{(datosDelComponenteS.estado === 'Cargando') ?
				<ModalCargando />
			: (datosDelComponenteS.estado === 'Error') ?
				<ModalError cerrarModal={() => {
					modificarDatosDelComponenteS({
						...datosDelComponenteS,
						estado: null
					});
				}}/>
			:
				null
			}
		</>
   </TouchableOpacity>

  )
}

//aqui ItemChat no funciona en otros componentes
export const ItemChat = (props) => {
  const {Id,Nombre,Avatar,UltVez} =  props;
  return(

        <TouchableOpacity onPress={()=>console.log(Id)} style={{width:"90%",alignSelf:"center",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
              <ListItem
                leftAvatar={{
                  title:"US",
                  source: {
                    uri: Avatar //"https://images.unsplash.com/photo-1542044896530-05d85be9b11a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60 "
                  },
                  showEditButton: false,
                  size:"large"

                }}
                title={  <Text style={{color:"#222f3e"}}>Nombre: <Text style={{color:"#2980b9"}}>{Nombre.Nombres + " " +Nombre.ApellidoPaterno + " " + Nombre.ApellidoMaterno}</Text></Text>}

                subtitle={
                  <View>
                    <Text style={{color:"#222f3e"}}>Fecha:<Text style={{color:"#fa8231"}}>{UltVez}</Text></Text>
                  </View>
                   }
                containerStyle={{backgroundColor:"#fff",justifyContent:"space-around",width:"100%",borderRadius:10,borderBottomWidth:4,borderWidth:1,borderColor:"rgba(0,0,0,0.2)",borderBottomColor:"rgba(0,0,0,0.2)"}}
                titleStyle={{color:"#fff"}}
                />
        </TouchableOpacity>

    )
}
