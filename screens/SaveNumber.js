import React, {Component, useEffect} from "react";
import styled from "styled-components";
import { View, Text, AsyncStorage, TouchableOpacity, AppState, ScrollView } from "react-native";
import { AntDesign, FontAwesome } from '@expo/vector-icons'; 
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
  setTestDeviceIDAsync,
} from 'expo-ads-admob';
import LottoNumbers from "../components/LottoNumbers";
import _ from 'lodash'

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
      saveNumber: [],
      saveNumbers: {}
    };
  }


  async componentDidMount() {
    try {
      const r = await this._loadToDos();
      console.log(r,'----')
    } catch(e) {
      console.log(e)
    }
  };
  
  
  async componentWillReceiveProps(nextProps) {
    if (this.isOnEnter(nextProps)) {
      try {
        await this.loadSaveData();
      } catch(e) {
        console.log(e)
      }
    }
  }

  _loadToDos = async () => {
    try {
      const toDos = await AsyncStorage.getItem("toDos");
      console.log(toDos,'-')
      const parsedToDos = JSON.parse(toDos)
      console.log(toDos,'asdssss');
      this.setState({ loadedTodos: true, saveNumbers: parsedToDos || {}})
    } catch(e) {
      console.log(e)
    }
  }

  _refreshButton = async () => {
    try {
      await this._loadToDos();
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

  render() {
    const {saveNumber, saveNumbers} = this.state;
    console.log(saveNumbers, 'asd')
    // console.log(saveNumber, 'sad')
    
    return (
      <View style={{height: '100%', backgroundColor: '#21243d'}}>
        {!_.isEmpty(saveNumbers) ? (
          <ScrollView style={{width: '100%', paddingHorizontal: 30}}>
            {Object.values(saveNumbers).map( number => (
              <LottoNumbers key={number.id} {...number} deleteNumber={this._deleteNumber} />
            ))}
          </ScrollView>
        ) : (
          <View style={{width: '100%', flex: 1, justifyContent: "center", alignItems: 'center'}}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>저장된 번호가 없습니다!</Text>
          </View>
        )}
        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 30, marginBottom: 10}}>
          <TouchableOpacity style={{width: 40, height: 40, paddingLeft: 1, backgroundColor: 'white', borderRadius: 40, justifyContent: 'center', alignItems: "center"}} onPress={this._refreshButton}>
            <FontAwesome name="refresh" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={{width: '100%', position: 'relative', bottom: 0}}>
          <AdMobBanner
            bannerSize="fullBanner"
            adUnitID="ca-app-pub-9486850272416310/1415959885" // Test ID, Replace with your-admob-unit-id
            servePersonalizedAds // true or false
            onDidFailToReceiveAdWithError={this.bannerError} />
        </View>
      </View>
    )
  }
}
