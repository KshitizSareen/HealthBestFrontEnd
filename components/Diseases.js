import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  Dimensions,
  TextInput
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import axios from 'axios';
var dimensions=Dimensions.get('window');
var width=dimensions.width;
var height=dimensions.height;
width=parseInt(width);
height=parseInt(height);
class Diseases extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
            Diseases: [],
            DiseasesinList: [],
            selectedItems :[],
            filters: [],
        };
      }
      componentDidMount(){
        NetInfo.fetch().then((state)=>{
          state.isConnected ? 
          axios({
            headers:{
            'Authorization': 'Token 12e8892c90d633670f2bf1d6a87d1efd938d83ce',
          'Content-Type':'application/json',
          },
          url: 'https://healthbestbackend.herokuapp.com/app/items/',
            method: 'GET',
          }).then(res=>alert(res.data[0].Type)) : Alert.alert('', 'Please connect to the internet');
        })
      }
      
      fetchItems=()=>{

      };
      render()
      {
        const { selectedItems } = this.state;
        return(
          <View style={styles.container}>
            <View style={styles.sections}>
              <TextInput style={styles.textinput}/>
              <TouchableOpacity style={styles.button}> 
              <FontAwesomeIcon icon={faSearch} size="20" />
              </TouchableOpacity>
            </View>
            <SectionedMultiSelect
          items={this.state.filters}
          uniqueKey="id"
          subKey="children"
          selectText="Choose some things..."
          showDropDowns={true}
          readOnlyHeadings={true}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={this.state.selectedItems}
        />

          </View>
        )
      }

      
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
    alignContent:'center'
  },
  textinput: {
    width: '76%',
    color: 'rgb(38,50,56)',
    fontWeight: '700',
    fontSize: 14,
    backgroundColor: 'rgba(136, 126, 126, 0.04)',
    padding: 10,
    borderRadius: 20,
    marginTop: 0.06 * height,
    marginBottom: 0.03 * height,
    alignSelf: 'center',
    fontFamily: 'sans-serif',
    height: 30
  },
  sections: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex:0.10,
  },
  button: {
    borderRadius: 5,
    color: '#fff',
    backgroundColor: 'lightblue',
    paddingLeft: 3,
    paddingRight: 3,
    paddingBottom: 3,
    paddingTop: 3,
    fontFamily: 'sans-serif',
    fontSize: 13,
    shadowRadius: 20,
    alignItems: 'center',
    width: '7%',
    alignSelf: 'center',
    marginTop: 0.05 * width,
  },
});
export default Diseases;