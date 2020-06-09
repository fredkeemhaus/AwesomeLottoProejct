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
      await AdMobRewarded.setAdUnitID('ca-app-pub-3940256099942544/5224354917'); // Test ID, Replace with your-admob-unit-id
      await AdMobRewarded.requestAdAsync();
      await AdMobRewarded.showAdAsync();
    } catch(e){
      console.log(e)
    }
  }

  render() {
    let startDate = new Date("2002-12-07");
    let nowDate = new Date();
    let diffDate = nowDate - startDate;
    
    const nowDrwDate = parseInt(diffDate / (24 * 60 * 60 * 1000) / 7) + 1;
    return (
      <WebView
        source={{ uri: `https://m.dhlottery.co.kr/gameResult.do?method=byWin&drwNo=${nowDrwDate}`}}
      />
    )
  }
}
// export default () => (
  
// );
