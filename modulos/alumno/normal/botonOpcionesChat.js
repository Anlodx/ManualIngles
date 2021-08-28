import React, { Component } from 'react';

import {
  Text,
  StyleSheet,
  View,
  Animated,
  TouchableWithoutFeedback
} from 'react-native';

import { Icon } from 'react-native-elements';

class BotonOpciones extends Component {

	
	animation= new Animated.Value(0);

	toggleMenu = () => {
		const toValue = this.open ? 0 : 1;

		Animated.spring(this.animation,{
			toValue,
			friction:5
		}).start();

		this.open = !this.open;
	};

  render() { 
  	const heartStyle = {
  		transform:[
  			{scale:this.animation},
  			{
  				translateY: this.animation.interpolate({
  					inputRange:[0,1],
  					outputRange:[0,-200]
  				})
  			}
  		]
  	};

  	const thumbsStyle = {
  		transform:[
  			{scale:this.animation},
  			{
  				translateY: this.animation.interpolate({
  					inputRange:[0,1],
  					outputRange:[0,-140]
  				})
  			}
  		]
  	};


  	const pinStyle = {
  		transform:[
  			{scale:this.animation},
  			{
  				translateY: this.animation.interpolate({
  					inputRange:[0,1],
  					outputRange:[0,-80]
  				})
  			}
  		]
  	};

	const rotation = {
		transform:[
		{
			rotate:this.animation.interpolate({
				inputRange:[0,1],
				outputRange:["0deg","45deg"]
			})
		}
		]
	};  	
    return (
      <View style={[styles.container,this.props.style]}>
      	

      	<TouchableWithoutFeedback onPress={()=>alert("likes")}>
      		<Animated.View style={[styles.button,styles.secundary,thumbsStyle]}>
      			<Icon type="font-awesome-5" name="school" size={20} color={"#F02A48"} />
      		</Animated.View>
      	</TouchableWithoutFeedback>


      	<TouchableWithoutFeedback onPress={this.props.creaUnChat}>
      		<Animated.View style={[styles.button,styles.secundary,pinStyle]}>
				  <Icon type="font-awesome" name="wechat" size={20} color={"#F02A48"}/>
      		</Animated.View>
      	</TouchableWithoutFeedback>


      	<TouchableWithoutFeedback onPress={this.toggleMenu}>
      		<Animated.View style={[styles.button,styles.menu,rotation]}>
      			<Icon type="font-awesome" name="plus" size={24} color={"#fff"}/>
      		</Animated.View>
      	</TouchableWithoutFeedback>

      </View> 
    );
  }
}

const styles = StyleSheet.create({
	container:{
		alignItems:"center",
		position:"absolute"
	},
	button:{
		position:"absolute",
		width:60,
		height:60,
		borderRadius:60 / 2,
		alignItems:"center",
		justifyContent:"center",
		shadowOpacity:0.9,
		elevation:6
	},
	menu:{
		backgroundColor:"#F02A48"
	},

	secundary:{
		width:40,
		height:40,
		borderRadius:48/2,
		backgroundColor:"#fff"
	}
});


export default BotonOpciones;