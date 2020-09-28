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
  Text,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import Authentication from './components/Authentication.js';
import Diseases from './components/Diseases.js';
import DiseasePage from './components/DiseasePage.js';
import Schedule from './components/Schedule.js';
import Time from './components/Times.js';
import Medicine from './components/Medicines.js';
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
          options={(options)=>{

            return{
            title: 'Diseases',
            headerStyle: {backgroundColor: '#F0f0f7'},
            headerRight: ()=>{
              return(
                <TouchableOpacity style={styles.button} onPress={()=>{
                  options.navigation.navigate("Schedule",{user:options.route.params.user,token:options.route.params.token});
                }}>
                  <Text>Schedules</Text>
                </TouchableOpacity>
              );
            }
          }}}/>
          <Stack.Screen name="DiseasePage"
          component={DiseasePage}
          options={{
            title: 'Symptoms',
            headerStyle: {backgroundColor: '#F0f0f7'},
          }}/>
          <Stack.Screen name="Schedule"
          component={Schedule}
          options={{
            title: 'Schedules',
            headerStyle: {backgroundColor: '#F0f0f7'},
          }}/>
          <Stack.Screen name="Time"
          component={Time}
          options={{
            title: 'Times',
            headerStyle: {backgroundColor: '#F0f0f7'},
          }}/>
          <Stack.Screen name="Medicine"
          component={Medicine}
          options={{
            title: 'Medicines',
            headerStyle: {backgroundColor: '#F0f0f7'},
          }}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles=StyleSheet.create({
  button: {
    borderRadius: 5,
    color: '#fff',
    backgroundColor: 'lightblue',
    padding: 10,
    fontFamily: 'sans-serif',
    fontSize: 10,
    alignItems: 'center',
    alignSelf: 'center',
    margin:10,
  },
});
export default App;
