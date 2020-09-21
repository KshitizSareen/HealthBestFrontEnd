import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  Dimensions,
  TextInput,
  Image, ScrollView,Modal, KeyboardAvoidingView
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlus,faArrowDown, faTrash, faEdit, faArrowUp, faLink, faList, faArrowRight} from '@fortawesome/free-solid-svg-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import DateTimePickerModal from "react-native-modal-datetime-picker";
var dimensions=Dimensions.get('window');
var width=dimensions.width;
var height=dimensions.height;
width=parseInt(width);
height=parseInt(height);
class Medicine extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
            medicines: [],
            modalMedicineVisible: false,
            quantity: 0,
            description: "",
            method: 'POST',
            id: 0,
        };
      }
      componentDidMount(){
        NetInfo.fetch().then((state)=>{
            if(state.isConnected)
            {
                axios({
                headers:{
                  'Content-Type':'application/json',
                  'Authorization': 'Token '+this.props.route.params.token,
                },
                url: 'https://healthbestbackend.herokuapp.com/app/medicines/',
                method: 'GET',
              }).then((res)=>{
                  var medicines=new Array();
                  for(var i=0;i<res.data.length;i++)
                  {
                      if(res.data[i].time==this.props.route.params.timeid)
                      {
                          medicines.push(res.data[i]);
                      }
                  }
                  this.setState({medicines: medicines});
                
              });
            }
            else
            {
                Alert.alert('', 'Please connect to the internet');
            }
        });
      }
      render()
      {
          return(
              <View style={StyleSheet.body}>
                   <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalMedicineVisible}
        >
            
            <View style={styles.modal}>
                <TextInput placeholder="   Enter your quantity" style={styles.textinput} onChangeText={(value) => {
                this.setState({quantity: value});
              }}/>
              <TextInput placeholder="   Enter your decription" style={styles.textinput} onChangeText={(value) => {
                this.setState({description: value});
              }}/>
                <TouchableOpacity style={styles.button} onPress={()=>{
                    var body={
                        time: this.props.route.params.timeid,
                        quantity: parseFloat(this.state.quantity),
                        description: this.state.description,
                    };
                    var id="";
                    if(this.state.id==0)
                    {
                      id="";
                    }
                    else{
                      id=this.state.id.toString()+'/';
                    }
                   NetInfo.fetch().then((state)=>{
                     if(state.isConnected)
                     {
                      axios({
                        headers:{
                            'Authorization': 'Token '+this.props.route.params.token,
                          'Content-Type':'application/json',
                          
                        },
                        data: body,
                        url: 'https://healthbestbackend.herokuapp.com/app/medicines/'+id,
                        method: this.state.method,
                      }).then((res)=>{
                        var medicines=this.state.medicines;
                        if(this.state.method=="PUT")
                        {
                          for(var i=0;i<medicines.length;i++)
                          {
                            if(medicines[i].id==res.data.id)
                            {
                              medicines[i].quantity=res.data.quantity;
                              medicines[i].description=res.data.description;
                              break;
                            }
                          }
                        }
                        else
                        {
                          medicines.push(res.data);

                        }
                        this.setState({medicines: medicines});
                        this.setState({modalMedicineVisible: false});
                      });
                     }
                     else
                     {
                      Alert.alert('', 'Please connect to the internet');
                     }
                   })
                }}>
                    
                    <Text>{this.state.method=="POST" ? 'Create': 'Update'} Item</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={()=>{
                    this.setState({modalMedicineVisible: false});
                }}>
                        <Text>Close</Text>
                    </TouchableOpacity>
            </View>
        </Modal>
        <View style={styles.medicine}>
                      <Text style={{fontSize: 20}}>Add a new Item</Text>
                      <TouchableOpacity onPress={()=>{
                          this.setState({id: 0});
                          this.setState({method: 'POST'});
                          this.setState({modalMedicineVisible: true});
                      }}>
                      <FontAwesomeIcon icon={faPlus} size="25" />
                      </TouchableOpacity>
                      
                  </View>
                  <FlatList data={this.state.medicines} renderItem={(medicine)=>{
                  return(
                    <View style={styles.list}>
                        <View style={{flexDirection: 'row',justifyContent: 'space-between'}}>
                    <Text style={{fontSize: 15,marginRight: 10,marginLeft: 10}}>{medicine.item.quantity}</Text>
                  <Text style={{fontSize: 15}}>{medicine.item.description}</Text>
                  </View>
                    <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity  style={{marginRight:15}} onPress={()=>{
                          this.setState({method: 'PUT'});
                          this.setState({id: medicine.item.id});
                          this.setState({modalMedicineVisible: true});

                      }}>
                    <FontAwesomeIcon icon={faEdit} size="20" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginRight:15}} onPress={()=>{
                      NetInfo.fetch().then((state)=>{
                        if(state.isConnected)
                        {
                          axios({
                            headers:{
                                'Authorization': 'Token '+this.props.route.params.token,
                              'Content-Type':'application/json',
                              
                            },
                            url: 'https://healthbestbackend.herokuapp.com/app/medicines/'+medicine.item.id+'/',
                            method: 'DELETE',
                          }).then(()=>{
                            var medicines=this.state.medicines;
                            for(var i=0;i<medicines.length;i++)
                          {
                            if(medicines[i].id==medicine.item.id)
                            {
                              medicines.splice(i,1);
                              break;
                            }
                          }
                          this.setState({medicines: medicines});

                            
                          
                        });
                        }
                        else{
                          Alert.alert('', 'Please connect to the internet');
                        }
                      })    
                      }}>
                      <FontAwesomeIcon icon={faTrash} size="20" />
                      </TouchableOpacity>
                      </View>
            </View>
                  );
              }}/>
              </View>
          );
      }

}
const styles=StyleSheet.create({
    body:{
        flex: 1,
    },
    medicine:{
        flexDirection: 'row',
        margin: 10,
        fontSize: 50,
        backgroundColor: 'lightblue',
        padding: 10,
        elevation: 5,
        width: '95%',
        borderRadius: 20,
        justifyContent: 'space-between',
        
    },
    textinput: {
        width: '76%',
        color: 'rgb(38,50,56)',
        fontWeight: '700',
        fontSize: 14,
        backgroundColor: 'rgba(136, 126, 126, 0.04)',
        padding: 10,
        borderRadius: 20,
        marginBottom: 0.01 * height,
        alignSelf: 'center',
        fontFamily: 'sans-serif',
      },
      button: {
        borderRadius: 5,
        color: '#fff',
        backgroundColor: 'lightblue',
        paddingLeft: 40,
        paddingRight: 40,
        paddingBottom: 10,
        paddingTop: 10,
        fontFamily: 'sans-serif',
        fontSize: 13,
        shadowRadius: 20,
        alignItems: 'center',
        width: '76%',
        alignSelf: 'center',
        margin: 5,
      },
      modal:
      {
        flex: 0.5,
        justifyContent: "center",
        alignItems: "center",
        margin: 50,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'absolute',
    width: '75%',
    height: 0.35*height,
    top: 0.25*height,
    
      },
      list:{
        color: '#fff',
        fontFamily: 'arial',
        width: '90%',
        alignSelf: 'center',
         shadowOpacity: 0.3,
        borderRadius: 10,
        flexDirection: 'row',
        margin: 5,
        backgroundColor: 'lightblue',
        padding: 5,
        elevation: 5,
        width: '90%',
        borderRadius: 20,
        justifyContent: 'space-between',
      }
});
export default Medicine;