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
  Image
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faSearch,faCheck,faWindowClose} from '@fortawesome/free-solid-svg-icons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import axios from 'axios';
import firebase from 'react-native-firebase';
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
            DiseasesinitialList: [],
            selectedItems :[],
            filters: [],
            symptoms: [],
        };
        this.getToken = this.getToken.bind(this);
        this.requestPermission = this.requestPermission.bind(this);
        this.checkNotificationPermission = this.checkNotificationPermission.bind(this);
      }
      icon = ({ name, size = 18, style }) => {
        // flatten the styles
        const flat = StyleSheet.flatten(style)
        // remove out the keys that aren't accepted on View
        const { color, fontSize, ...styles } = flat
    
        let iconComponent
        // the colour in the url on this site has to be a hex w/o hash
        const iconColor = color && color.substr(0, 1) === '#' ? `${color.substr(1)}/` : ''
    
        const Search = (
          <FontAwesomeIcon icon={faSearch} size="15" />
        )
        const Close = (
          <FontAwesomeIcon icon={faWindowClose} size="15" />
        )
    
        const Check = (
          <FontAwesomeIcon icon={faCheck} size="15" />
        )
        const Cancel = (
          <FontAwesomeIcon icon={faWindowClose} size="10" />
        )
        const Down = (
          <Image
          />
        )
        const Up = (
          <Image
          />
        )
    
        switch (name) {
          case 'search':
            iconComponent = Search
            break
          case 'keyboard-arrow-up':
            iconComponent = Up
            break
          case 'keyboard-arrow-down':
            iconComponent = Down
            break
          case 'close':
            iconComponent = Close
            break
          case 'check':
            iconComponent = Check
            break
          case 'cancel':
            iconComponent = Cancel
            break
          default:
            iconComponent = null
            break
        }
        return <View style={styles}>{iconComponent}</View>
      }
      componentDidMount(){
        this.checkNotificationPermission();
        var checkedsymptoms=[];
        NetInfo.fetch().then((state)=>{
          if(state.isConnected)
          {
          axios({
            headers:{
            'Authorization': 'Token '+this.props.route.params.token,
          'Content-Type':'application/json',
          },
          url: 'https://healthbestbackend.herokuapp.com/app/diseases/',
            method: 'GET',
          }).then(res=>{
            var symptoms=new Object();
            symptoms.name='Symptoms';
            symptoms.id=0;
            var filters=new Array();
            var count=1;
            var Diseases=new Array();
            for(var i=0;i<res.data.length;i++)
            {
              var results=res.data[i].symptoms.split(",");
              for(var j=0;j<results.length;j++)
              {
                if(!checkedsymptoms.includes(results[j]))
                {
                  var object=new Object();
                  object.name=results[j];
                  object.id=results[j];
                filters.push(object);
                count+=1;
                checkedsymptoms.push(results[j]);
                }
              }
              var object1=new Object();
              object1.title=res.data[i].title;
              object1.symptoms=results;
              object1.description=res.data[i].description;
              Diseases.push(object1);
              this.setState({Diseases: Diseases});
              this.setState({DiseasesinitialList:Diseases});
            }
            symptoms.children=filters;
            var array=new Array();
            array.push(symptoms);
            this.setState({symptoms:array});
          }); }
          else
          { Alert.alert('', 'Please connect to the internet');}
        })
      }
      async getToken(){
        firebase.messaging().getToken().then((fcmToken) => {
        var body={
          devicetoken: fcmToken,
          user: this.props.route.params.user,
      };
        NetInfo.fetch().then((state)=>{
          if(state.isConnected)
          {
           axios({
             headers:{
                 'Authorization': 'Token '+this.props.route.params.token,
               'Content-Type':'application/json',
               
             },
             data: body,
             url: 'https://healthbestbackend.herokuapp.com/app/devices/',
             method: 'POST',
           })
          }
        });});
    }
    
    // request permission if permission diabled or not given
    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
        } catch (error) {}
    }
    
    // if permission enabled get firebase token else request permission
    async checkNotificationPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken() // call function to get firebase token for personalized notifications.
        } else {
            this.requestPermission();
        }
    }
      onSelectedItemsChange = (selectedItems) => {
        this.setState({ selectedItems: selectedItems });
        var filterarray=new Array();
        if(selectedItems.length>0)
        {
          this.state.DiseasesinitialList.forEach(element => {
            var val=0;
            for(var i=0;i<selectedItems.length;i++)
            {
              if(element.symptoms.includes(selectedItems[i]))
              {
                val=1;
              }
              else
              {
                val=0;
                break;
            }};
            if(val==1)
            {
              filterarray.push(element);
            }
            
          });
        }
        if(selectedItems.length==0)
        {
          filterarray=this.state.DiseasesinitialList;
        }
        this.setState({Diseases: filterarray});
      };
      ItemSeparatorComponent = () => {
        return (
          <View style={{height: 1, width: '100%', backgroundColor: '#ffff'}} />
        );
      };
      FilterThroughSearch=(substr)=>{
        var newarr=new Array();
        if(substr!="")
        {
        this.state.Diseases.forEach(element => {
          if(element.title.toLowerCase().includes(substr.toLowerCase()))
          {
            newarr.push(element);
          }
          
        });
        this.setState({Diseases: newarr});
      }
      else
      {
        this.setState({Diseases:this.state.DiseasesinitialList});
      }

      }
      render()
      {
        const { selectedItems } = this.state;
        return(
          <View style={styles.container}>
            <View style={styles.sections}>
              <TextInput style={styles.textinput} onChangeText={(substr)=>{
                this.FilterThroughSearch(substr);
              }}/>

            </View>
            <View style={styles.sectionBottom}>
            <SectionedMultiSelect
          items={this.state.symptoms}
          uniqueKey="id"
          subKey="children"
          selectText="Check Your Symptoms"
          showDropDowns={false}
          readOnlyHeadings={false}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={this.state.selectedItems}
          iconRenderer={this.icon}
        />
        <FlatList data={this.state.Diseases}
        renderItem={(Disease)=>{
          return (
            <TouchableOpacity style={styles.list} onPress={
              ()=>{
                this.props.navigation.navigate("DiseasePage",{description: Disease.item.description,symptoms:Disease.item.symptoms});
              }
            }>
              <Text style={styles.text}>{Disease.item.title}</Text>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={this.ItemSeparatorComponent}/>

          </View>
          </View>
          
        )
      }

      
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightblue',
    flex: 1,
    alignContent:'center'
  },
  textinput: {
    width: '76%',
    color: 'rgb(38,50,56)',
    fontWeight: '700',
    fontSize: 14,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    marginTop: 0.06 * height,
    marginBottom: 0.03 * height,
    alignSelf: 'center',
    fontFamily: 'sans-serif',
    height: 40
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
  sectionBottom:{
    flex: 0.90,
  }
});
export default Diseases;