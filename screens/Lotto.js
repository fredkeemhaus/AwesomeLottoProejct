import React, { Component } from "react";
import { View, Text, TouchableOpacity, AsyncStorage } from "react-native";
import { item } from "../api";
import moment from "moment";
import styled from "styled-components";
import _ from 'lodash';
import { v1 as uuidv1 } from 'uuid';
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
  justify-content: center;s
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

  componentDidMount = async () => {
    let startDate = new Date("2002-12-07");
    let nowDate = new Date();
    let diffDate = nowDate - startDate;

    await Tasks.all(saveNumber => this.setState({ saveNumber: saveNumber || [] }));
    console.log(this.state,'asd')

    const nowDrwDate = parseInt(diffDate / (24 * 60 * 60 * 1000) / 7) + 1;
    console.log(nowDrwDate, "-");

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
  };

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

    console.log(lottoNumber, '-')
    return (
      <View style={{height: '100%'}}>
        <View style={{paddingHorizontal: 30}}>
          <View style={{marginTop: 20}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text>현재 날짜</Text>
              <Text>{momentNowDate}</Text>
            </View>
            <View style={{backgroundColor: 'white', padding: 20, borderRadius: 14, marginVertical: 10}}>
              <View style={{width: '100%', flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10}}>
                <Text>{drwNumberData && drwNumberData.drwNo} 회차</Text>
              </View>
              <NowLottoNumberContainer>
                <LottoNumberCircleBox>
                    <Text>
                      {drwNumberData && drwNumberData.drwtNo1}
                    </Text>
                </LottoNumberCircleBox>
                <LottoNumberCircleBox>
                    <Text>
                      {drwNumberData && drwNumberData.drwtNo2}
                    </Text>
                </LottoNumberCircleBox>
                <LottoNumberCircleBox>
                    <Text>
                      {drwNumberData && drwNumberData.drwtNo3}
                    </Text>
                </LottoNumberCircleBox>
                <LottoNumberCircleBox>
                    <Text>
                      {drwNumberData && drwNumberData.drwtNo4}
                    </Text>
                </LottoNumberCircleBox>
                <LottoNumberCircleBox>
                    <Text>
                      {drwNumberData && drwNumberData.drwtNo5}
                    </Text>
                </LottoNumberCircleBox>
                <LottoNumberCircleBox>
                    <Text>
                      {drwNumberData && drwNumberData.drwtNo6}
                    </Text>
                </LottoNumberCircleBox>
                <LottoNumberCircleBox>
                    <Text>
                      {drwNumberData && drwNumberData.bnusNo}
                    </Text>
                </LottoNumberCircleBox>
              </NowLottoNumberContainer>
            </View>
          </View>
          {lottoNumber ? (
            <>
              <View style={{backgroundColor: 'white', padding: 20, borderRadius: 14, marginVertical: 10}}>
                <NowLottoNumberContainer>
                  <LottoNumberCircleBox>
                    <Text>{lottoNumber[0]}</Text>
                  </LottoNumberCircleBox>
                  <LottoNumberCircleBox>
                    <Text>{lottoNumber[1]}</Text>
                  </LottoNumberCircleBox>
                  <LottoNumberCircleBox>
                    <Text>{lottoNumber[2]}</Text>
                  </LottoNumberCircleBox>
                  <LottoNumberCircleBox>
                    <Text>{lottoNumber[3]}</Text>
                  </LottoNumberCircleBox>
                  <LottoNumberCircleBox>
                    <Text>{lottoNumber[4]}</Text>
                  </LottoNumberCircleBox>
                  <LottoNumberCircleBox>
                    <Text>{lottoNumber[5]}</Text>
                  </LottoNumberCircleBox>
                  <LottoNumberCircleBox>
                    <Text>{lottoNumber[6]}</Text>
                  </LottoNumberCircleBox>
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
                alignItems: "center"
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
