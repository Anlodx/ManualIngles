export function RetornarNombreCompleto(ApellidoPaterno, ApellidoMaterno, Nombres){

	if(ApellidoPaterno != "" && ApellidoMaterno != "" && Nombres != ""){
	let ArregloAP, ArregloAM, ArregloNS;
	//CONVERTIR TODO A MAYUSCULAS
	ArregloAP = Array.from(ApellidoPaterno.toUpperCase());
	ArregloAM = Array.from(ApellidoMaterno.toUpperCase());
	ArregloNS = Array.from(Nombres.toUpperCase());

	//PASAR POR TODOS LOS ARREGLOS Y QUITAR LOS ACENTOS
	let Contador = 0;
	//ARREGLO DE APELLIDO PATERNO
	while(Contador < ArregloAP.length){
		switch(ArregloAP[Contador]){
			case 'Á':
			ArregloAP[Contador] = 'A';
			break;
			case 'É':
			ArregloAP[Contador] = 'E';
			break;
			case 'Í':
			ArregloAP[Contador] = 'I';
			break;
			case 'Ó':
			ArregloAP[Contador] = 'O';
			break;
			case 'Ú':
			ArregloAP[Contador] = 'U';
			break;
		}
		Contador = Contador + 1;
	}


	Contador = 0;
	//ARREGLO DE APELLIDO MATERNO
	while(Contador < ArregloAM.length){
		switch(ArregloAM[Contador]){
			case 'Á':
			ArregloAM[Contador] = 'A';
			break;
			case 'É':
			ArregloAM[Contador] = 'E';
			break;
			case 'Í':
			ArregloAM[Contador] = 'I';
			break;
			case 'Ó':
			ArregloAM[Contador] = 'O';
			break;
			case 'Ú':
			ArregloAM[Contador] = 'U';
			break;
		}
		Contador = Contador + 1;
	}

	Contador = 0;
	//ARREGLO DE NOMBRES
	while(Contador < ArregloNS.length){
		switch(ArregloNS[Contador]){
			case 'Á':
			ArregloNS[Contador] = 'A';
			break;
			case 'É':
			ArregloNS[Contador] = 'E';
			break;
			case 'Í':
			ArregloNS[Contador] = 'I';
			break;
			case 'Ó':
			ArregloNS[Contador] = 'O';
			break;
			case 'Ú':
			ArregloNS[Contador] = 'U';
			break;
		}
		Contador = Contador + 1;
	}

    let Retorno = (ArregloAP.join('')) + " " + (ArregloAM.join('')) + " " + (ArregloNS.join(''));
	return Retorno;
	}

};

export function QuitarSlashInvertidoDelURL(URL){
	//RETORNARE UN STRING, CON EL URL SIN EL MOLESTO SLASH INVERTIDO
	//URL = http:\/\/backpack.sytes.net\/servidorApp\/ALMACENAMIENTO\/MOCHILAS\/MOCHILA_17419070110031\/APARTADOPRIVADO\/libreta1\/hoja1\/IMAGENES\/áéíóú.jpeg
}

export function RetornarSegundosEnFormatoHHMMSS(segundos){
	var segundosRestantes = 0;

	if(segundos >= 0){
		//SI segundos ES POSITIVO

		//PROBLEMA: PUEDE SER 0.1111111
		//Math.floor(0.1111) = 0
		segundosRestantes = Math.floor(segundos);
	}
	else{
		//SI segundos ES NEGATIVO
		//SI segundos ES null
		segundosRestantes = 0;
	}

	var cantidadDeHoras = 0;
	var cantidadDeMinutos = 0;
	var cantidadDeSegundos = 0;

	if(segundosRestantes >= 3600){
		//CABEN HORAS EN TUS SEGUNDOS?
		//HORAS
		cantidadDeHoras = Math.floor(segundosRestantes / 3600);
		segundosRestantes = segundosRestantes - (3600 * cantidadDeHoras);
	}
	if(segundosRestantes >= 60){
		//CABEN MINUTOS EN TUS SEGUNDOS?
		//MINUTOS
		cantidadDeMinutos = Math.floor(segundosRestantes / 60);
		segundosRestantes = segundosRestantes - (60 * cantidadDeMinutos);
	}
	//LOS SEGUNDOS QUE TE HAYAN QUEDADO, LOS VAMOS A ALMACENAR EN cantidadDeSegundos
	cantidadDeSegundos = segundosRestantes;

	//AHORA, SOLO ME FALTA MOSTRAR EL FORMATO HH:MM:SS
	var textoDeHoras = '';
	var textoDeMinutos = '';
	var textoDeSegundos = '';

	//PRIMERO VAMOS CON textoDeHoras
	if(cantidadDeHoras >= 10){
		//HORAS YA ESTA EN DOS DIGITOS
		textoDeHoras = '' + cantidadDeHoras;
	}
	else{
		//HORAS SOLO TIENE UN DIGITO
		textoDeHoras = '0' + cantidadDeHoras;
	}

	//SIGUE textoDeMinutos
	if(cantidadDeMinutos >= 10){
		//MINUTOS YA ESTA EN DOS DIGITOS
		textoDeMinutos = '' + cantidadDeMinutos;
	}
	else{
		//MINUTOS TIENE SOLO UN DIGITO
		textoDeMinutos = '0' + cantidadDeMinutos;
	}

	//SIGUE textoDeSegundos
	if(cantidadDeSegundos >= 10){
		//SEGUNDOS YA ESTA EN DOS DIGITOS
		textoDeSegundos = '' + cantidadDeSegundos;
	}
	else{
		//SEGUNDOS TIENE SOLO UN DIGITO
		textoDeSegundos = '0' + cantidadDeSegundos;
	}

	return (textoDeHoras + ':' + textoDeMinutos + ':' + textoDeSegundos);
}



export function ValidaLetras(palabra){

      let abc = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,ñ,o,p,q,r,s,t,u,v,w,x,y,z';
      let Minuscula = abc.split(',');
      let Mayuscula = []
      for(let i=0;i<Minuscula.length;i++){
        Mayuscula.push(Minuscula[i].toUpperCase());
      }
      let CaracteresRaros = ['á','é','í','ó','ú','Á','É','Í','Ó','Ú'];
      let CaracteresPermitidos=Minuscula;
      CaracteresPermitidos=CaracteresPermitidos.concat(Mayuscula);
      CaracteresPermitidos=CaracteresPermitidos.concat(CaracteresRaros);
      let pa=0;


      for(let i=0;i<palabra.length;i++){
        for(let j=0;j<CaracteresPermitidos.length;j++){
          if(palabra[i]==CaracteresPermitidos[j]){
            pa++;
            break;
          }
        }
      }

      if(pa===palabra.length){
        return true;
      }else{
        return false;
      }

    }

export function PreparaBusqueda(cadenaADividir) {
      if(cadenaADividir!==null && cadenaADividir!=="")
        {

         let H = cadenaADividir;
         let arrayDeCadenas = [];
         let i=0,j=0;
         let p="";
         let palabra="";



         while(i<H.length){
             if(H[i]!==' '){
              j=i;
              while(j<H.length && H[j]!==' '){
                palabra+=(H[j]);
                j++;
              }

              if(palabra.length>=2){
                if(ValidaLetras(palabra)){
                arrayDeCadenas.push(palabra);
                }
              }
              palabra="";




              i=j;
             }else{
              palabra="";
              i++;
             }
         }



         for(i=0;i<arrayDeCadenas.length;i++){
            p+=(arrayDeCadenas[i]);
            p+="/";
         }

          //alert('La cadena original es: "' + cadenaADividir + '" \n' +"El array tiene " + arrayDeCadenas.length + " elementos: " + "\n" + p)
          return(arrayDeCadenas);

      }else{
               return ([]);
      }
    }

export function PreparaBusquedaComponente(cadenaADividir) {
      if(cadenaADividir!==null && cadenaADividir!=="")
        {

         let H = cadenaADividir;
         let arrayDeCadenas = [];
         let i=0,j=0;
         let p="";
         let palabra="";



         while(i<H.length){
             if(H[i]!==' '){
              j=i;
              while(j<H.length && H[j]!==' '){
                palabra+=(H[j]);
                j++;
              }

              if(palabra.length>=1){
                arrayDeCadenas.push(palabra);
              }
              palabra="";




              i=j;
             }else{
              palabra="";
              i++;
             }
         }



         for(i=0;i<arrayDeCadenas.length;i++){
            p+=(arrayDeCadenas[i]);
            if(i===arrayDeCadenas.length-1){
              p+="";
            }else{
              p+=" ";
            }
         }

          alert('La cadena original es: "' + cadenaADividir + '" \n' +"El array tiene " + arrayDeCadenas.length + " elementos: " + "\n" + p)
           return(p);

      }else{
               alert(null);
      }
    }



export function Fecha(){
	var Fecha = new Date();
	var pa="";

	switch(Fecha.getDay()){
		case 0: pa+="Dom. "; break;
		case 1: pa+="Lun. "; break;
		case 2: pa+="Mar. "; break;
		case 3: pa+="Mie. "; break;
		case 4: pa+="Jue. "; break;
		case 5: pa+="Vie. "; break;
		case 6: pa+="Sab. "; break;
	}

	pa+=""+Fecha.getDate()+"/";


	switch(Fecha.getMonth()){
		case 0: pa+="01"; break;
		case 1: pa+="02"; break;
		case 2: pa+="03"; break;
		case 3: pa+="04"; break;
		case 4: pa+="05"; break;
		case 5: pa+="06"; break;
		case 6: pa+="07"; break;
		case 7: pa+="08"; break;
		case 8: pa+="09"; break;
		case 9: pa+="10"; break;
		case 10: pa+="11"; break;
		case 11: pa+="12"; break;
	}
	pa+="/"+Fecha.getFullYear()+" ";
	var aux="";

	if(Fecha.getHours()>=0 && Fecha.getHours()<12){
		aux="am";
	}else{
		aux="pm";
	}

	if(Fecha.getHours()>12){
		switch(Fecha.getHours()-12){
			case 1: pa+="01"; break;
			case 2: pa+="02"; break;
			case 3: pa+="03"; break;
			case 4: pa+="04"; break;
			case 5: pa+="05"; break;
			case 6: pa+="06"; break;
			case 7: pa+="07"; break;
			case 8: pa+="08"; break;
			case 9: pa+="09"; break;
			default: pa+=Fecha.getHours()-12;
		}

	}
	else if(Fecha.getHours()===0){
		pa+="12";
	}
	else{

		switch(Fecha.getHours()){
			case 1: pa+="01"; break;
			case 2: pa+="02"; break;
			case 3: pa+="03"; break;
			case 4: pa+="04"; break;
			case 5: pa+="05"; break;
			case 6: pa+="06"; break;
			case 7: pa+="07"; break;
			case 8: pa+="08"; break;
			case 9: pa+="09"; break;
			default: pa+=Fecha.getHours();
		}
	}




	switch(Fecha.getMinutes()){
		case 0: pa+=":00"+" "+aux; break;
		case 1: pa+=":01"+" "+aux; break;
		case 2: pa+=":02"+" "+aux; break;
		case 3: pa+=":03"+" "+aux; break;
		case 4: pa+=":04"+" "+aux; break;
		case 5: pa+=":05"+" "+aux; break;
		case 6: pa+=":06"+" "+aux; break;
		case 7: pa+=":07"+" "+aux; break;
		case 8: pa+=":08"+" "+aux; break;
		case 9: pa+=":09"+" "+aux; break;
		default: pa+=":"+Fecha.getMinutes()+" "+aux;
	}


	return(pa);
}


export function SonSoloEspecios(cadenaADividir) {
      if(cadenaADividir!==null && cadenaADividir!=="")
        {

         let H = cadenaADividir;
         let i=0,j=0;



         while(i<H.length){
             if(H[i]!==' '){
              j++;
             }
             i++;
           }
           if(j>0){
             return(false)
           }
           else{
             return(true)
           }

      }else{
               return(true)
      }
    }
