import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions, ScrollView
} from 'react-native';

var dimensions=Dimensions.get('window');
var width=dimensions.width;
var height=dimensions.height;
width=parseInt(width);
height=parseInt(height);
import { TabView, SceneMap } from 'react-native-tab-view';
 var description="";
 var symptoms=[];
const FirstRoute = () => (
  <View style={[styles.scene, { backgroundColor: 'lightblue' }]}>
    <ScrollView>
    <Text style={styles.text}>{description}</Text>
    </ScrollView>
  </View> 
);
 
var ItemSeparatorComponent = () => {
  return (
    <View style={{height: 1, width: '100%', backgroundColor: '#ffff'}} />
  );
};
const SecondRoute = () => (
  <View style={[styles.scene, { backgroundColor: 'lightblue' }]} >
    <FlatList data={symptoms}
    style={styles.list}
        renderItem={(symptom)=>{
          return (
              <Text style={styles.text}>{symptom.item}</Text>
          );
        }}
        ItemSeparatorComponent={ItemSeparatorComponent}/>
  </View>
);
 
const initialLayout = { width: Dimensions.get('window').width };
 
export default function DiseasePage(props) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Description' },
    { key: 'second', title: 'Symptoms' },
  ]);
  description=props.route.params.description;
  symptoms=props.route.params.symptoms;
 
  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });
 
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
    />
  );
}
 
const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  list: {
    color: '#fff',
    padding: 3,
    fontFamily: 'arial',
    fontSize: 13,
    width: '98%',
    alignSelf: 'center',
     shadowOpacity: 0.3,
    borderRadius: 10,
  },
  text:{
    fontSize:30,
    margin: 5,
    fontSize: 25,
    fontFamily: 'arial',
    fontStyle: 'italic',
    fontWeight: 'bold'
  },
});