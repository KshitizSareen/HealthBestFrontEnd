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
  Modal
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlus, faTrash, faEdit, faArrowRight} from '@fortawesome/free-solid-svg-icons';
import BackgroundFetch from "react-native-background-fetch";
import NotificationService from './Notification Service';
import axios from 'axios';
var dimensions=Dimensions.get('window');
var width=dimensions.width;
var height=dimensions.height;
width=parseInt(width);
height=parseInt(height);
class Schedule extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
            schedules: [],
            modalScheduleVisible: false,
            scheduleName: "",
            method: 'POST',
            id: 0,
        };
      }
      componentDidMount()
      {
        BackgroundFetch.configure(
          {
            minimumFetchInterval: 15, // <-- minutes (15 is minimum allowed)
            // Android options
            forceAlarmManager: false, // <-- Set true to bypass JobScheduler.
            stopOnTerminate: false,
            startOnBoot: true,
            requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY, // Network connection needed
          },
          async taskId => {
            // Do stuff with notifications, for example:
            NetInfo.fetch().then((state)=>{
              if(state.isConnected)
              {
                const notificationService = new NotificationService();
                var times=new Array();
                var schedules=new Array();
                const date = new Date(Date.now()); // adjust according to your use case
                        const datemin=new Date(Date.now()-(15*60*1000));
                  axios({
                  headers:{
                    'Content-Type':'application/json',
                    'Authorization': 'Token '+this.props.route.params.token,
                  },
                  url: 'https://healthbestbackend.herokuapp.com/app/schedules/',
                  method: 'GET',
                }).then((res)=>{
                    for(var i=0;i<res.data.length;i++)
                    {
                        if(res.data[i].user==this.props.route.params.user)
                        {
                            schedules.push(res.data[i].id);
                        }
                    }
                      axios({
                        headers:{
                          'Content-Type':'application/json',
                          'Authorization': 'Token '+this.props.route.params.token,
                        },
                        url: 'https://healthbestbackend.herokuapp.com/app/times/',
                        method: 'GET',
                      }).then((res1)=>{
                        var check=0;
                        for(var i=0;i<schedules.length;i++)
                    {
                          for(var j=0;j<res1.data.length;j++)
                          {
                              if(res1.data[j].schedule==schedules[i])
                              {
                                  var time=res1.data[j].time;
                                  if(Date.parse('01/01/2011 '+time) >= Date.parse('01/01/2011 '+datemin.toLocaleTimeString()) && Date.parse('01/01/2011 '+time) <= Date.parse('01/01/2011 '+date.toLocaleTimeString()))
                              {
                                notificationService.scheduleNotif(new Date(Date.now()),"Alert", "Its time to take your medicine");
                                check=1;
                                break;
                              }
                                  
                              }
                          }
                          if(check==1)
                          {
                            break;
                          }
                        }
                        
                      });
                    
                  
                });
          
              }});
              
          BackgroundFetch.finish(taskId);
          },
          error => {
            console.log('[js] RNBackgroundFetch failed to start');
          },
        );
            NetInfo.fetch().then((state)=>{
                if(state.isConnected)
                {
                    axios({
                    headers:{
                      'Content-Type':'application/json',
                      'Authorization': 'Token '+this.props.route.params.token,
                    },
                    url: 'https://healthbestbackend.herokuapp.com/app/schedules/',
                    method: 'GET',
                  }).then((res)=>{
                      var schedules=new Array();
                      for(var i=0;i<res.data.length;i++)
                      {
                          if(res.data[i].user==this.props.route.params.user)
                          {
                              schedules.push(res.data[i]);
                          }
                      }
                      this.setState({schedules: schedules});
                    
                  });
                }
                else
                {
                    Alert.alert('', 'Please connect to the internet');
                }
                
            })
      }
      render()
      {
          return(
              <View style={styles.body}>
                   <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalScheduleVisible}
        >
            
            <View style={styles.modal}>
                <TextInput placeholder="   Enter your schedule name" style={styles.textinput} onChangeText={(value) => {
                this.setState({scheduleName: value});
              }}/>
                <TouchableOpacity style={styles.button} onPress={()=>{
                  if(this.state.scheduleName=="")
                  {
                    Alert.alert("","Please enter a name for your schedule");
                    return;
                  }
                    var body={
                        name: this.state.scheduleName,
                        user: this.props.route.params.user,
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
                        url: 'https://healthbestbackend.herokuapp.com/app/schedules/'+id,
                        method: this.state.method,
                      }).then((res)=>{
                        var schedules=this.state.schedules;
                        if(this.state.method=="PUT")
                        {
                          for(var i=0;i<schedules.length;i++)
                          {
                            if(schedules[i].id==res.data.id)
                            {
                              schedules[i].name=res.data.name;
                              break;
                            }
                          }
                        }
                        else
                        {
                          schedules.push(res.data);

                        }
                        this.setState({schedules: schedules});
                        this.setState({modalScheduleVisible: false});
                      });
                     }
                     else
                     {
                      Alert.alert('', 'Please connect to the internet');
                     }
                   })
                }}>
                    
                    <Text>{this.state.method=="POST" ? 'Create': 'Update'} Schedule</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={()=>{
                    this.setState({modalScheduleVisible: false});
                }}>
                        <Text>Close</Text>
                    </TouchableOpacity>
            </View>
        </Modal>
                  <View style={styles.schedule}>
                      <Text style={{fontSize: 20}}>Add a new Schedule</Text>
                      <TouchableOpacity onPress={()=>{
                          this.setState({id: 0});
                          this.setState({method: 'POST'});
                          this.setState({modalScheduleVisible: true});
                      }}>
                      <FontAwesomeIcon icon={faPlus} size="25" />
                      </TouchableOpacity>
                      
                  </View>
              <FlatList data={this.state.schedules} renderItem={(schedule)=>{
                  return(
                    <View style={styles.list}>
                    <Text style={{fontSize: 15}}>{schedule.item.name}</Text>
                    <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity  style={{marginRight:15}} onPress={()=>{
                          this.setState({method: 'PUT'});
                          this.setState({id: schedule.item.id});
                          this.setState({modalScheduleVisible: true});

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
                            url: 'https://healthbestbackend.herokuapp.com/app/schedules/'+schedule.item.id+'/',
                            method: 'DELETE',
                          }).then(()=>{
                            var schedules=this.state.schedules;
                            for(var i=0;i<schedules.length;i++)
                          {
                            if(schedules[i].id==schedule.item.id)
                            {
                              schedules.splice(i,1);
                              break;
                            }
                          }
                          this.setState({schedules: schedules});

                            
                          
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
                        this.props.navigation.navigate("Time",{token: this.props.route.params.token,scheduleid: schedule.item.id});
                      }}>
                      <FontAwesomeIcon icon={faArrowRight} size="20" />
                      </TouchableOpacity>
                      </View>
            </View>
                  );
              }}/>
              </View>
              
          )
      }

}
const styles=StyleSheet.create({
    body:{
        flex: 1,
    },
    schedule:{
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
})
export default Schedule;