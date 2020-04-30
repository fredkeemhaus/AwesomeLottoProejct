import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { item } from "../api";
import moment from "moment";
import styled from "styled-components";
import _ from 'lodash';

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
      lottoNumber: null
    };
  }

  componentDidMount = async () => {
    let startDate = new Date("2002-12-07");
    let nowDate = new Date();
    let diffDate = nowDate - startDate;

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

  render() {
    const { drwNumberData, lottoNumber } = this.state;
    console.log(lottoNumber, '-')
    return (
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
          </>
        ) : (
          <TouchableOpacity
            onPress={this._numberReturn}
          >
            <Text>
              번호 뽑기
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
