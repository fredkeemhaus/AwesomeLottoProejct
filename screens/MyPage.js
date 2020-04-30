import React from "react";
import { View, Text } from "react-native";
import {WebView} from 'react-native-webview'

export default () => (
  <WebView
        source={{ uri: 'https://m.dhlottery.co.kr/gameResult.do?method=byWin&drwNo=908&wiselog=M_A_1_1'}}
      />
);
