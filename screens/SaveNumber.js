import React, {Component} from "react";
import styled from "styled-components";
import { View, Text, AsyncStorage, TouchableOpacity } from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
  setTestDeviceIDAsync,
} from 'expo-ads-admob';


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


const NowLottoNumberContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const LottoNumberCircleBox = styled.View`
  width: 30px;
  height: 30px;
  background-color: red;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
`

export default class SaveNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saveNumber: []
    };
  }

  componentDidMount = async () => {
    await Tasks.all(saveNumber => this.setState({ saveNumber: saveNumber || [] }));
    
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
    // console.log(saveNumber, 'sad')
    return (
      <View style={{height: '100%'}}>
        {saveNumber ? (
          <View style={{paddingHorizontal: 30, marginTop: 10}}>
            {saveNumber && saveNumber.map((v, i) => (
              <View style={{backgroundColor: 'white', padding: 20, borderRadius: 14, marginVertical: 10}}>
                <NowLottoNumberContainer>
                  <LottoNumberCircleBox>
                    <Text>{v.lottoNumber[0]}</Text>
                  </LottoNumberCircleBox>
                  <LottoNumberCircleBox>
                    <Text>{v.lottoNumber[1]}</Text>
                  </LottoNumberCircleBox>
                  <LottoNumberCircleBox>
                    <Text>{v.lottoNumber[2]}</Text>
                  </LottoNumberCircleBox>
                  <LottoNumberCircleBox>
                    <Text>{v.lottoNumber[3]}</Text>
                  </LottoNumberCircleBox>
                  <LottoNumberCircleBox>
                    <Text>{v.lottoNumber[4]}</Text>
                  </LottoNumberCircleBox>
                  <LottoNumberCircleBox>
                    <Text>{v.lottoNumber[5]}</Text>
                  </LottoNumberCircleBox>
                  <LottoNumberCircleBox>
                    <Text>{v.lottoNumber[6]}</Text>
                  </LottoNumberCircleBox>
                  <TouchableOpacity onPress={() => this.deleteTask(i)}>
                    <Text>delete</Text>
                  </TouchableOpacity>
                </NowLottoNumberContainer>
              </View>
            ))}
          </View>
        ) : (
          <View>
            <Text>저장된 번호가 없습니다.</Text>
          </View>
        )}
        <View style={{width: '100%', position: 'absolute', bottom: 0}}>
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
