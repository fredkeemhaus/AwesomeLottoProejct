import React, { Component } from "react";
import { View, Text, AppState, TouchableOpacity, AsyncStorage, RefreshControl, SafeAreaView } from "react-native";
import { item } from "../api";
import moment from "moment";
import styled from "styled-components";
import _ from 'lodash';
import { v1 as uuidv1 } from 'uuid';
import NumberTicker from 'react-native-number-ticker';


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
    return tasks.map(task => task.lottoNumber).join("||");
    // return tasks.map(task => task.lottoNumber).join("||");
    // return tasks
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

const LottoCircleBox = styled.View`
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
`;

const LottoNumberCircleBox = styled.View`
  width: 30px;
  height: 30px;
  background-color: white;
  justify-content: center;
  align-items: center;
  /* padding-right: 8px; */
  padding-bottom: 2px;
  border-radius: 30px;
  box-shadow: 0px 1px 2px rgba(0,0,0,0.5);
`

// background-color: ${props => (props.backgroundCondition ? 'white' : 'transparent')};

const nowDate = new Date();
const momentNowDate = moment(nowDate).format("YYYY. MM .DD");

export default class Lotto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drwNumberData: null,
      lottoNumber: null,
      saveNumber: [],
      saveLottoNumber: ''
    };
  }

  state: State = {
    appState: AppState.currentState,
  };

  async componentWillMount() {
    AppState.addEventListener('change', async nextAppState => {
      if (
        this.state.appState.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        await this.loadHomeData();
        this.setState({appState: nextAppState});
      }
    });
  }
  
  async componentWillReceiveProps(nextProps) {
    if (this.isOnEnter(nextProps)) {
      await this.loadHomeData();
    }
  }

  async componentDidMount() {
    try {
      await this.loadHomeData();
    } catch (e) {
      console.log(e);
    }
  };

  loadHomeData = async () => {
    let startDate = new Date("2002-12-07");
    let nowDate = new Date();
    let diffDate = nowDate - startDate;

    await Tasks.all(saveNumber => this.setState({ saveNumber: saveNumber || [] }));

    const nowDrwDate = parseInt(diffDate / (24 * 60 * 60 * 1000) / 7) + 1;
    let drwNumberData;

    try {
      ({ data: drwNumberData } = await item.getDrw(nowDrwDate));

      console.log(drwNumberData, "-");
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({
        drwNumberData
      });
    }
  }

  _numberReturn = () => {
    let lottoNumber = _.sampleSize(_.range(1, 45), 7)
    this.setState({
      lottoNumber
    })
  }

  _addLottoNumber = (lottoNumber) => {
    // console.log(lottoNumber, 'add')
      this.setState(
          prevState => {
            let { saveNumber, saveLottoNumber } = prevState;
            return {
              saveNumber: saveNumber.concat({ key: saveNumber.length, lottoNumber: lottoNumber }),
              lottoNumber: null
            };
          },
          () => Tasks.save(this.state.saveNumber)
      );

      alert('저장되었습니다.')

    console.log(this.state, '------------');
  }

  render() {
    const { drwNumberData, lottoNumber } = this.state;
    const sortArray = lottoNumber && lottoNumber.sort(function(a, b) {
      return a - b
    });

    return (
      <View style={{height: '100%', backgroundColor: '#4d4c7d'}}>
        <View style={{paddingHorizontal: 30}}>
          <View style={{marginTop: 20}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{fontWeight: 'bold', color: 'white'}}>현재 날짜</Text>
              <Text style={{color: 'white'}}>{momentNowDate}</Text>
            </View>
            <View style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 14,
              marginVertical: 10,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.5
              }}>
              <View style={{width: '100%', flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10}}>
                <Text>{drwNumberData && drwNumberData.drwNo} 회차</Text>
              </View>
              
              <NowLottoNumberContainer>
                <LottoNumberCircleBox>
                  <Text>{drwNumberData && drwNumberData.drwtNo1}</Text>
                  {/* <NumberTicker
                    number={drwNumberData && drwNumberData.drwtNo1}
                    textSize={14}
                    duration={500}
                    textStyle={{fontWeight: 'bold'}}
                    style={{padding: 0, margin: 0}}
                  /> */}
                </LottoNumberCircleBox>
                <LottoNumberCircleBox>
                  <Text>{drwNumberData && drwNumberData.drwtNo2}</Text>
                  {/* <NumberTicker
                    number={drwNumberData && drwNumberData.drwtNo2}
                    textSize={14}
                    duration={1000}
                    textStyle={{fontWeight: 'bold'}}
                  /> */}
                </LottoNumberCircleBox>
                <LottoNumberCircleBox>
                  <Text>{drwNumberData && drwNumberData.drwtNo3}</Text>
                  {/* <NumberTicker
                      number={drwNumberData && drwNumberData.drwtNo3}
                      textSize={14}
                      duration={1500}
                      textStyle={{fontWeight: 'bold'}}
                    /> */}
                </LottoNumberCircleBox>
                <LottoNumberCircleBox>
                  <Text>{drwNumberData && drwNumberData.drwtNo4}</Text>
                  {/* <NumberTicker
                    number={drwNumberData && drwNumberData.drwtNo4}
                    textSize={14}
                    duration={2000}
                    textStyle={{fontWeight: 'bold'}}
                  /> */}
                </LottoNumberCircleBox>
                <LottoNumberCircleBox>
                  <Text>{drwNumberData && drwNumberData.drwtNo5}</Text>
                  {/* <NumberTicker
                    number={drwNumberData && drwNumberData.drwtNo5}
                    textSize={14}
                    duration={2500}
                    textStyle={{fontWeight: 'bold'}}
                  /> */}
                </LottoNumberCircleBox>
                <LottoNumberCircleBox>
                  <Text>{drwNumberData && drwNumberData.drwtNo6}</Text>
                  {/* <NumberTicker
                    number={drwNumberData && drwNumberData.drwtNo6}
                    textSize={14}
                    duration={3000}
                    textStyle={{fontWeight: 'bold'}}
                  /> */}
                </LottoNumberCircleBox>
                <LottoNumberCircleBox>
                  <Text>{drwNumberData && drwNumberData.bnusNo}</Text>
                    {/* <NumberTicker
                      number={drwNumberData && drwNumberData.bnusNo}
                      textSize={14}
                      duration={3500}
                      textStyle={{fontWeight: 'bold'}}
                    /> */}
                </LottoNumberCircleBox>
              </NowLottoNumberContainer>
            </View>
          </View>
          {lottoNumber ? (
            <>
              <View style={{backgroundColor: 'white', padding: 20, borderRadius: 14, marginVertical: 10}}>
                <NowLottoNumberContainer>
                  {sortArray.map((v, i) => {
                    return (
                      <LottoNumberCircleBox>
                        <NumberTicker
                          number={lottoNumber[i]}
                          textSize={14}
                          duration={i * 1000}
                          textStyle={{fontWeight: 'bold'}}
                        />
                      </LottoNumberCircleBox>
                    )
                  })}
                </NowLottoNumberContainer>
              </View>
              <View>
                <TouchableOpacity
                  style={{flexDirection: 'row', justifyContent: 'flex-end', width: '100%'}}
                  onPress={() => this._addLottoNumber(lottoNumber)}
                >
                  <Text>저장하기</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <TouchableOpacity
              style={{
                width: '100%',
                marginTop: 10,
                height: 45,
                backgroundColor: 'white',
                borderRadius: 14,
                justifyContent: 'center',
                alignItems: "center",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.5
              }}
              onPress={this._numberReturn}
            >
              <Text>
                번호 뽑기
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={{width: '100%', position: 'absolute', bottom: 0}}>
          <AdMobBanner
            bannerSize="fullBanner"
            adUnitID="ca-app-pub-3940256099942544/6300978111" // Test ID, Replace with your-admob-unit-id
            servePersonalizedAds // true or false
            onDidFailToReceiveAdWithError={this.bannerError} />
        </View>
      </View>
    );
  }
}
