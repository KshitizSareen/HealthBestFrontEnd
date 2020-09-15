import React,{Component} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    Alert,
    AsyncStorage,
    TextInput,
    CheckBox,}
    from 'react-native';
    var Tabs = require('react-native-tabs');
var dimensions=Dimensions.get('window');
var width=dimensions.width;
var height=dimensions.height;
width=parseInt(width);
height=parseInt(height);
class Authentication extends Component{
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      rememberme: 'false',
      currentpage: "login",

    };
  }
  fillItems = async () => {
    var username = await AsyncStorage.getItem('username');
    if (username != null) {
      this.setState({username, username});
    }
    var password = await AsyncStorage.getItem('password');
    if (password != null) {
      this.setState({password, password});
    }
    var rememberme = await AsyncStorage.getItem('rememberme');
    if (rememberme != null) {
      this.setState({rememberme, rememberme});
    }
  };
  fetchItems = async () => {
    if ('true' == this.state.rememberme) {
      AsyncStorage.setItem('username', this.state.username);
      AsyncStorage.setItem('password', this.state.password);
      AsyncStorage.setItem('rememberme', 'true');
    } else {
      AsyncStorage.setItem('username', '');
      AsyncStorage.setItem('password', '');
      AsyncStorage.setItem('rememberme', 'false');
    }
  };

  componentDidMount() {
    this.fillItems();
  }
    render(){
      var InsertPicker=(value)=>{
        if(value=="login")
        {
        return(<View style={styles.boxContainer}>
          <CheckBox
            value={'false' != this.state.rememberme}
            onValueChange={(value) => {
              this.setState({
                rememberme: false == value ? 'false' : 'true',
              });
            }}
          />
          <Text style={{fontSize: 16, alignSelf: 'center'}}>Remember Me</Text>
        </View>);
        }
      };
        return(
            <View style={styles.container}>
        <Tabs selected={this.state.currentpage} style={{backgroundColor:'lightblue'}}
              onSelect={(el)=>{this.setState({ currentpage:el.props.name});
                
            }}>
            <Text name="login"  style={styles.tabNames} selectedIconStyle={styles.selectedStyle}>Login</Text>
            <Text name="signup"  style={styles.tabNames} selectedIconStyle={styles.selectedStyle}>Signup</Text>
        </Tabs>
            <TextInput
              placeholder="    username"
              style={styles.textinput}
              onChangeText={(value) => {
                this.setState({username: value});
              }}
              value={this.state.username}
            />
            <TextInput
              placeholder="    password"
              style={styles.textinput}
              secureTextEntry={true}
              onChangeText={(value) => {
                this.setState({password: value});
              }}
              value={this.state.password}
            
            />
            {InsertPicker(this.state.currentpage)}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if(this.state.currentpage=="login")
              {
              NetInfo.fetch().then((state) => {
                state.isConnected
                  ? fetch(
                      'https://healthbest-api.herokuapp.com/api-auth/',
                      {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          username: this.state.username.toLowerCase(),
                          password: this.state.password,
                        }),
                      },
                    ).then((res) => {
                      if (!res.ok) {
                        Alert.alert('', 'Invalid Credentials');
                      } else {
                        this.fetchItems();
                        this.props.navigation.navigate('Diseases',{
                          username: this.state.username.toLowerCase(),
                          token: res.token,
                        });
                      }
                    })
                  : Alert.alert('', 'Please connect to the internet');
              });
            }
            else
            {
              NetInfo.fetch().then((state) => {
                state.isConnected
                  ? fetch(
                      'https://healthbest-api.herokuapp.com/api/users/',
                      {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          username: this.state.username.toLowerCase(),
                          password: this.state.password,
                        }),
                      },
                    ).then((res) => {
                      if (!res.ok) {
                        Alert.alert('', 'Username already exists');
                      } else {
                        Alert.alert('', 'Signup Succesful');
                      }
                    })
                  : Alert.alert('', 'Please connect to the internet');
              });
            }
            }}>
            <Text style={{fontSize: 22, color: '#f2f2f2'}}>{this.state.currentpage=="login" ? "Login" : "Signup"}</Text>
          </TouchableOpacity>
        </View>
        );
    }
    

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingBottom:0.15*height
  },
  textstyleUsername: {fontSize: 24, fontWeight: '100'},
  textstylePassword: {marginTop: 20, fontSize: 24, fontWeight: '100'},
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
  },
  boxContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  buttonContainer: {alignSelf: 'center'},
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
    marginTop: 0.12 * width,
  },
  selectedStyle:{
    borderTopWidth: 3,
    borderTopColor: 'lightyellow'
  },
  tabNames:{
    fontSize: 22,
    color: 'white'
  }
});
  export default Authentication;