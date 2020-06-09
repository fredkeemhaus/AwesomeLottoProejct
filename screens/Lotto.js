import React, { Component } from "react";
import { View, Text, AppState, TouchableOpacity, AsyncStorage, RefreshControl, SafeAreaView } from "react-native";
import { item } from "../api";
import moment from "moment";
import styled from "styled-components";
import _ from 'lodash';
import { v1 as uuidv1 } from 'uuid';
import numeral from 'numeral';
import NumberTicker from 'react-native-number-ticker';
import uuid from 'uuid'


import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
  setTestDeviceIDAsync,
} from 'expo-ads-admob';
import { ScrollView } from "react-native-gesture-handler";
import LottoNumbers from "../components/LottoNumbers";

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
      saveLottoNumber: '',
      saveNumbers: {}
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
      const r = await this._loadToDos();
      console.log(r,'---------------')

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
      this.setState(prevState => {
        if (lottoNumber.length !== 0) {
          const ID = uuidv1();
          const saveLottoNumberObject = {
            [ID]: {
              id: ID,
              isCompleted: false,
              number: lottoNumber,
              createdAt: Date.now()
            }
          };
          const newState = {
            ...prevState,
            lottoNumber: [],
            saveNumbers: {
              ...prevState.saveNumbers,
              ...saveLottoNumberObject
            }
          }
          this._saveNumbers(newState.saveNumbers)
          return {...newState}
        }
      })

      alert('저장되었습니다.')

    console.log(this.state, '------------');
  }

  _completeToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: { ...prevState.toDos[id], isCompleted: true }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };

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


  _loadToDos = async () => {
    try {
      const toDos = await AsyncStorage.getItem("toDos");
      const parsedToDos = JSON.parse(toDos)
      console.log(toDos,'asdssss');
      this.setState({ loadedTodos: true, saveNumbers: parsedToDos})
    } catch(e) {
      console.log(e)
    }
  }

  render() {
    const { drwNumberData, lottoNumber, saveNumbers } = this.state;
    const sortArray = lottoNumber && lottoNumber.sort(function(a, b) {
      return a - b
    });

    console.log(saveNumbers,'------------------------asdasd')

    return (
      <View style={{height: '100%', backgroundColor: '#21243d'}}>
        <View style={{paddingHorizontal: 30}}>
          <View style={{marginTop: 20}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{fontWeight: 'bold', color: 'white'}}>오늘 날짜</Text>
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
              shadowOpacity: 0.5,
              }}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={{fontWeight: 'normal', fontSize: 14}}>총 당첨인원</Text>
                <Text style={{fontWeight: 'bold', fontSize: 18}}>{numeral(drwNumberData && drwNumberData.firstPrzwnerCo).format('0,0')} 명</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={{fontWeight: 'normal', fontSize: 14}}>총 판매금액</Text>
                <Text style={{fontWeight: 'bold', fontSize: 18}}>{numeral(drwNumberData && drwNumberData.totSellamnt).format('0,0')} 원</Text>
              </View>
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

              <View style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F4F4F4', marginBottom: 20}}>
                <Text style={{fontWeight: 'bold', fontSize: 28}}>{numeral(drwNumberData && drwNumberData.firstWinamnt).format('0,0')} 원</Text>
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
          {lottoNumber && lottoNumber.length !== 0 ? (
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
          <ScrollView>
            {Object.values(saveNumbers).map( number => (
              <LottoNumbers key={number.id} {...number} deleteNumber={this._deleteNumber} />
            ))}
          </ScrollView>
        </View>
        <View style={{width: '100%', position: 'absolute', bottom: 0}}>
          <AdMobBanner
            bannerSize="fullBanner"
            adUnitID="ca-app-pub-9486850272416310/1415959885" // Test ID, Replace with your-admob-unit-id
            servePersonalizedAds // true or false
            onDidFailToReceiveAdWithError={this.bannerError} />
        </View>
      </View>
    );
  }
}
