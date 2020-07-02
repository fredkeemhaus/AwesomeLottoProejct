import React, { Component } from "react";
import { View, Text, TouchableOpacity, AsyncStorage, RefreshControl, SafeAreaView, Platform, ScrollView } from "react-native";
import { item } from "../api";
import moment from "moment";
import styled from "styled-components";
import _ from 'lodash';
// import uuidv1 from "uuid";
// import uuid from 'uuid'
import { v1 as uuidv1 } from 'uuid';

// import {nanoid} from 'nanoid'
import numeral from 'numeral';
import NumberTicker from 'react-native-number-ticker';
// import * as Random from 'expo-random';
import uuid from 'react-native-uuid';
import LottoNumbers from '../components/LottoNumbers'
// 


import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
  setTestDeviceIDAsync,
} from 'expo-ads-admob';


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
      lottoNumber: [],
      saveNumber: [],
      saveLottoNumber: '',
      saveNumbers: {}
    };
  }


  async componentDidMount() {
    try {
      await this.loadHomeData();
      const r = await this._loadToDos();
      console.log(r,'rrrrrrrrrrrrr')
    } catch (e) {
      console.log(e);
    }
  };

  loadHomeData = async () => {
    let startDate = new Date("2002-12-07");
    let nowDate = new Date();
    let diffDate = nowDate - startDate;

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

  _numberReturnReset = () => {
    this.setState({
      lottoNumber: null
    })
  }

  

  _addLottoNumber =  async (lottoNumber) => {
    try {
      if (lottoNumber && lottoNumber.length !== 0) {
        this.setState(prevState => {
            const ID = uuid.v1();
            // const ID = await Random.getRandomBytesAsync(16);
            // console.log(ID)
    
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
          })
        }
    } catch {
      console.log(e)
    }

    alert('저장되었습니다.')

    console.log(this.state, '------------');
  }

  _loadToDos = async () => {
    try {
      const toDos = await AsyncStorage.getItem("toDos");
      const parsedToDos = JSON.parse(toDos)
      console.log(toDos,'asdssss');
      this.setState({ loadedTodos: true, saveNumbers: parsedToDos || {}})
    } catch(e) {
      console.log(e)
    }
  }

  _saveNumbers = (newTodos) => {
    const saveTodos = AsyncStorage.setItem("toDos", JSON.stringify(newTodos));
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


  render() {
    const { drwNumberData, lottoNumber, saveNumbers } = this.state;
    const sortArray = lottoNumber && lottoNumber.sort(function(a, b) {
      return a - b
    });

    return (
      <View style={{height: '100%', backgroundColor: '#21243d'}}>
        <ScrollView contentContainerStyle={{paddingHorizontal: 30}}>
          <View style={{marginTop: 20}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{fontWeight: 'bold', color: 'white'}}>오늘 날짜</Text>
              <Text style={{color: 'white'}}>{momentNowDate}</Text>
            </View>
            <View style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 8,
              marginVertical: 10,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.5,
              elevation: Platform.OS === 'ios' ? 0 : 3
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
                borderRadius: 8,
                marginVertical: 10,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.5,
                elevation: Platform.OS === 'ios' ? 0 : 3
              }}>
              <View style={{width: '100%', flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10}}>
                <Text>{drwNumberData && drwNumberData.drwNo} 회차</Text>
              </View>

              <View style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F4F4F4', marginBottom: 20}}>
                <Text style={{fontWeight: 'bold', fontSize: 28}}>{numeral(drwNumberData && drwNumberData.firstWinamnt).format('0,0')} 원</Text>
              </View>
              
              <NowLottoNumberContainer>
                <LottoNumberCircleBox
                  style={{elevation: Platform.OS === 'ios' ? 0 : 3}}
                >
                  <Text>{drwNumberData && drwNumberData.drwtNo1}</Text>
                </LottoNumberCircleBox>
                <LottoNumberCircleBox
                  style={{elevation: Platform.OS === 'ios' ? 0 : 3}}
                >
                  <Text>{drwNumberData && drwNumberData.drwtNo2}</Text>
                </LottoNumberCircleBox>
                <LottoNumberCircleBox
                  style={{elevation: Platform.OS === 'ios' ? 0 : 3}}
                >
                  <Text>{drwNumberData && drwNumberData.drwtNo3}</Text>
                </LottoNumberCircleBox>
                <LottoNumberCircleBox
                  style={{elevation: Platform.OS === 'ios' ? 0 : 3}}
                >
                  <Text>{drwNumberData && drwNumberData.drwtNo4}</Text>
                </LottoNumberCircleBox>
                <LottoNumberCircleBox
                  style={{elevation: Platform.OS === 'ios' ? 0 : 3}}
                >
                  <Text>{drwNumberData && drwNumberData.drwtNo5}</Text>
                </LottoNumberCircleBox>
                <LottoNumberCircleBox
                  style={{elevation: Platform.OS === 'ios' ? 0 : 3}}
                >
                  <Text>{drwNumberData && drwNumberData.drwtNo6}</Text>
                </LottoNumberCircleBox>
                <LottoNumberCircleBox
                  style={{elevation: Platform.OS === 'ios' ? 0 : 3}}
                >
                  <Text>{drwNumberData && drwNumberData.bnusNo}</Text>
                </LottoNumberCircleBox>
              </NowLottoNumberContainer>
            </View>
          </View>
          {lottoNumber && lottoNumber.length !== 0 ? (
            <>
              <View style={{backgroundColor: 'white', padding: 20, borderRadius: 8, marginVertical: 10}}>
                <NowLottoNumberContainer>
                  {sortArray.map((v, i) => {
                    return (
                      <LottoNumberCircleBox
                        style={{
                          elevation: Platform.OS === 'ios' ? 0 : 3
                        }}
                      >
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
              <View style={{flexDirection: 'row', justifyContent: 'flex-end', width: '100%'}}>
                <TouchableOpacity
                  style={{flexDirection: 'row',}}
                  onPress={() => this._numberReturnReset()}
                >
                  <Text style={{color: 'white', fontWeight: 'bold'}}>초기화</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{flexDirection: 'row', marginLeft: 10}}
                  onPress={() => this._addLottoNumber(lottoNumber)}
                >
                  <Text style={{color: 'white', fontWeight: 'bold'}}>저장하기</Text>
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
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: "center",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.5,
                marginBottom: 20,
                elevation: Platform.OS === 'ios' ? 0 : 3
              }}
              onPress={this._numberReturn}
            >
              <Text style={{fontWeight: 'bold', fontSize: 16}}>
                번호 뽑기
              </Text>
            </TouchableOpacity>
          )}
          <ScrollView style={{paddingBottom: 30}}>
            {Object.values(saveNumbers).map( number => (
              <LottoNumbers 
                  key={number.id}
                  deleteNumber={this._deleteNumber}
                  {...number}
                />
            ))}
          </ScrollView>
        </ScrollView>
        <View style={{width: '100%', position: 'relative', bottom: 0}}>
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
