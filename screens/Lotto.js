import React, { Component } from "react";
import { View, Text, Button } from "react-native";
import { item } from "../api";
import moment from "moment";
import styled from "styled-components";

const NowLottoNumberContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const LottoCircleBox = styled.View`
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
`;

const nowDate = new Date();
const momentNowDate = moment(nowDate).format("YYYY. MM .DD");

export default class Lotto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drwNumberData: null
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

  render() {
    const { drwNumberData } = this.state;

    return (
      <View>
        <View>
          <Text>현재 날짜 {momentNowDate}</Text>
          <View>
            <Text>{drwNumberData && drwNumberData.drwNo} 회차</Text>
            <Text>{drwNumberData && drwNumberData.drwNo} 회차</Text>
          </View>
          <NowLottoNumberContainer>
            <LottoCircleBox>
              <Text>{drwNumberData && drwNumberData.drwtNo1}</Text>
            </LottoCircleBox>
            <Text>{drwNumberData && drwNumberData.drwtNo2}</Text>
            <Text>{drwNumberData && drwNumberData.drwtNo3}</Text>
            <Text>{drwNumberData && drwNumberData.drwtNo4}</Text>
            <Text>{drwNumberData && drwNumberData.drwtNo5}</Text>
            <Text>{drwNumberData && drwNumberData.drwtNo6}</Text>
            <Text>{drwNumberData && drwNumberData.drwtNo7}</Text>
          </NowLottoNumberContainer>
        </View>
      </View>
    );
  }
}
