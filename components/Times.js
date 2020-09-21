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
class Time extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
            times: [],
            modalTimeVisible: false,
            time:new Date(),
            method: 'POST',
            id: 0,
        };
      }
      onChange = (time) => {
          this.setState({time: time});
          var hours=time.getHours();
          var minutes=time.getMinutes();
          var body={
            schedule: this.props.route.params.scheduleid,
            time: hours+':'+minutes,
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
            url: 'https://healthbestbackend.herokuapp.com/app/times/'+id,
            method: this.state.method,
          }).then((res)=>{
            var times=this.state.times;
            if(this.state.method=="PUT")
            {
              for(var i=0;i<times.length;i++)
              {
                if(times[i].id==res.data.id)
                {
                  times[i].time=res.data.time;
                  break;
                }
              }
            }
            else
            {
              times.push(res.data);

            }
            this.setState({times: times});
            this.setState({modalTimeVisible: false});
          });
         }
         else
         {
          Alert.alert('', 'Please connect to the internet');
         }
       })
      };
      componentDidMount()
      {
        NetInfo.fetch().then((state)=>{
            if(state.isConnected)
            {
                axios({
                headers:{
                  'Content-Type':'application/json',
                  'Authorization': 'Token '+this.props.route.params.token,
                },
                url: 'https://healthbestbackend.herokuapp.com/app/times/',
                method: 'GET',
              }).then((res)=>{
                  var times=new Array();
                  for(var i=0;i<res.data.length;i++)
                  {
                      if(res.data[i].schedule==this.props.route.params.scheduleid)
                      {
                          times.push(res.data[i]);
                      }
                  }
                  this.setState({times: times});
                
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
            <View style={styles.body}>
                <DateTimePickerModal
        isVisible={this.state.modalTimeVisible}
        mode="time"
        onConfirm={(time)=>{
            this.onChange(time);
        }}
        onCancel={()=>{
            this.setState({modalTimeVisible: false});
        }}
      />
           <View style={styles.time}>
               <Text style={{fontSize: 20}}>Add a new Time Slot</Text>
               <TouchableOpacity onPress={()=>{
                   this.setState({id: 0});
                   this.setState({method: 'POST'});
                   this.setState({modalTimeVisible: true});
               }}>
               <FontAwesomeIcon icon={faPlus} size="25" />
               </TouchableOpacity>
               
           </View>
       <FlatList data={this.state.times} renderItem={(time)=>{
           return(
             <View style={styles.list}>
             <Text style={{fontSize: 15,marginLeft: 10}}>{time.item.time[0]+time.item.time[1]+':'+time.item.time[3]+time.item.time[4]}</Text>
             <View style={{flexDirection: 'row'}}>
             <TouchableOpacity  style={{marginRight:15}} onPress={()=>{
                   this.setState({method: 'PUT'});
                   this.setState({id: time.item.id});
                   this.setState({modalTimeVisible: true});

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
                     url: 'https://healthbestbackend.herokuapp.com/app/times/'+time.item.id+'/',
                     method: 'DELETE',
                   }).then(()=>{
                     var times=this.state.times;
                     for(var i=0;i<times.length;i++)
                   {
                     if(times[i].id==time.item.id)
                     {
                       times.splice(i,1);
                       break;
                     }
                   }
                   this.setState({times: times});

                     
                   
                 });
                 }
                 else{
                   Alert.alert('', 'Please connect to the internet');
                 }
               })    
               }}>
               <FontAwesomeIcon icon={faTrash} size="20" />
               </TouchableOpacity>
               <TouchableOpacity onPress={()=>{
                   this.props.navigation.navigate("Medicine",{token: this.props.route.params.token,timeid:time.item.id});

               }}>
               <FontAwesomeIcon icon={faArrowRight} size="20" />
               </TouchableOpacity>
               </View>
     </View>
           );
       }}/>
       </View>
          );
      }

}
export default Time;
const styles=StyleSheet.create({
    body:{
        flex: 1,
    },
    time:{
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
        margin: 10,
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
    height: 0.25*height,
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