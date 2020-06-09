import React, { Component } from "react";
import { View, Text } from "react-native";
import {WebView} from 'react-native-webview'
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
  setTestDeviceIDAsync,
} from 'expo-ads-admob';




export default class MyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = async () => {
    try {
      await AdMobRewarded.setAdUnitID('ca-app-pub-9486850272416310/1415959885'); // Test ID, Replace with your-admob-unit-id
      await AdMobRewarded.requestAdAsync();
      await AdMobRewarded.showAdAsync();
    } catch(e){
      console.log(e)
    }
  }

  render() {
    return (
      <WebView
        source={{ uri: 'https://m.dhlottery.co.kr/gameResult.do?method=byWin&drwNo=908&wiselog=M_A_1_1'}}
      />
    )
  }
}
// export default () => (
  
// );
