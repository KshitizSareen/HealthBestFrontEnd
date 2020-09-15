/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{Component} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Modal,
  TouchableHighlight,
  Alert,
} from 'react-native';
import Authentication from './components/Authentication.js';
import Diseases from './components/Diseases.js';
var dimensions=Dimensions.get('window');
var width=dimensions.width;
var height=dimensions.height;
width=parseInt(width);
height=parseInt(height);
const Stack=createStackNavigator();
class App extends Component{
  constructor(props) {
    super(props);
  }
  render(){
    return(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Auth"
          component={Authentication}
          options={{
            title: 'Welcome',
            headerStyle: {backgroundColor: '#F0f0f7'}
          }}/>
          <Stack.Screen name="Diseases"
          component={Diseases}
          options={{
            title: 'Diseases',
            headerStyle: {backgroundColor: '#F0f0f7'}
          }}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}


export default App;
