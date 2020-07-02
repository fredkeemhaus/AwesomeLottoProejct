import React, {Component} from "react";
import styled from "styled-components";
import { View, Text, AsyncStorage, TouchableOpacity, AppState } from "react-native";
import { AntDesign } from '@expo/vector-icons'; 
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
  setTestDeviceIDAsync,
} from 'expo-ads-admob';
import { ScrollView } from "react-native-gesture-handler";
import LottoNumbers from '../components/LottoNumbers'


const LottoNumberContainerWrap = styled.View`
  background-color: white;
  padding: 20px;
  border-radius: 14px;
  margin: 10px 0;
`

const NowLottoNumberContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const LottoNumberCircleBox = styled.View`
  width: 30px;
  height: 30px;
  background-color: white;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  box-shadow: 0px 1px 2px rgba(0,0,0,0.5);
`

export default class SaveNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drwNumberData: null,
      lottoNumber: [],
      saveNumber: [],
      saveLottoNumber: '',
      saveNumbers: {}
    };
  }


  async componentDidMount() {
    try {
      const r = await this._loadToDos();
      console.log(r ,'--')
    } catch(e) {
      console.log(e)
    }
    
  };
  
  async componentWillReceiveProps(nextProps) {
    if (this.isOnEnter(nextProps)) {
      
    }
  }

  _loadToDos = async () => {
    try {
      const toDos = await AsyncStorage.getItem("toDos");
      const parsedToDos = JSON.parse(toDos)
      this.setState({ loadedTodos: true, saveNumbers: parsedToDos || {}})
    } catch(e) {
      console.log(e)
    }
  }

  _deleteNumber = (id) => {
    this.setState(prevState => {
      const saveNumbers = prevState.saveNumbers;
      delete saveNumbers[id];
      const newState = {
        ...prevState,
        ...saveNumbers
      }
      this._saveNumbers(newState.saveNumbers)
      return {...newState}
    })
  }

  _saveNumbers = (newTodos) => {
    const saveTodos = AsyncStorage.setItem("toDos", JSON.stringify(newTodos));
  }

  deleteTask = i => {
    this.setState(
      prevState => {
        let saveNumber = prevState.saveNumber.slice();

        saveNumber.splice(i, 1);

        return { saveNumber: saveNumber };
      },
      () => Tasks.save(this.state.saveNumber)
    );
    
    alert('삭제되었습니다.')
  };

  render() {
    const {saveNumber, saveNumbers} = this.state;
    console.log(saveNumber, saveNumbers, 'asd')
    // console.log(saveNumber, 'sad')
    
    return (
      <View style={{height: '100%', backgroundColor: '#21243d'}}>
        {saveNumbers ? (
          <ScrollView>
            {Object.values(saveNumbers).map( number => (
              <LottoNumbers 
                  key={number.id}
                  deleteNumber={this._deleteNumber}
                  {...number}
                />
            ))}
          </ScrollView>
        ) : (
          <View>
            <Text>저장된 번호가 없습니다!.</Text>
          </View>
        )}
        <View style={{width: '100%', position: 'relative', bottom: 0}}>
          <AdMobBanner
            bannerSize="fullBanner"
            adUnitID="ca-app-pub-3940256099942544/6300978111" // Test ID, Replace with your-admob-unit-id
            servePersonalizedAds // true or false
            onDidFailToReceiveAdWithError={this.bannerError} />
        </View>
      </View>
    )
  }
}
