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


let Tasks = {
  convertToArrayOfObject(tasks, callback) {
    return callback(
      tasks ? tasks.split("||").map((task, i) => ({ key: i, lottoNumber: task.split(",") })) : []
    );
  },
  convertToStringWithSeparators(tasks) {
    return tasks.map(task => task.text).join("||");
  },
  all(callback) {
    return AsyncStorage.getItem("TASKS", (err, tasks) =>
      this.convertToArrayOfObject(tasks, callback)
    );
  },
  save(tasks) {
    AsyncStorage.setItem("TASKS", this.convertToStringWithSeparators(tasks));
  }
};

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
      saveNumber: []
    };
  }


  async componentDidMount() {
    await this.loadSaveData();
  };
  
  async componentWillReceiveProps(nextProps) {
    if (this.isOnEnter(nextProps)) {
      await this.loadSaveData();
    }
  }

  loadSaveData = async () => {
    try {
      await Tasks.all(saveNumber => this.setState({ saveNumber: saveNumber || [] }));
    } catch(e) {
      console.log(e)
    }
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
    const {saveNumber} = this.state;
    console.log(saveNumber, 'asd')
    // console.log(saveNumber, 'sad')
    
    return (
      <View style={{height: '100%', backgroundColor: '#4d4c7d'}}>
        {saveNumber ? (
          <ScrollView style={{paddingHorizontal: 30, marginTop: 10}}>
            {saveNumber && saveNumber.map((v, i) => {
              console.log(v, '0')
              return (
                <LottoNumberContainerWrap
                  style={{
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.5
                  }}
                >
                  <NowLottoNumberContainer>
                    {v.lottoNumber && v.lottoNumber.map((item, i) => {
                      console.log(item, i, 'asdsd')
                      return (
                        <LottoNumberCircleBox>
                          <Text>{item}</Text>
                        </LottoNumberCircleBox>
                      )
                    })}
                    
                    <TouchableOpacity style={{width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 30, borderWidth: 2, borderColor: 'black' }} onPress={() => this.deleteTask(i)}>
                      <AntDesign name="delete" size={18} color="black" />
                    </TouchableOpacity>
                  </NowLottoNumberContainer>
                </LottoNumberContainerWrap>
              )
            })}
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
