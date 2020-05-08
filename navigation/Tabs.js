import React, { useEffect, useLayoutEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Lotto from "../screens/Lotto";
import SlotLotto from "../screens/SlotLotto";
import SaveNumber from "../screens/SaveNumber";
import MyPage from "../screens/MyPage";

const Tabs = createBottomTabNavigator();

const getHeadeName = route =>
  route?.state?.routeNames[route.state.index] || "Lotto";

export default ({ navigation, route }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: getHeadeName(route)
    });
  }, [route]);
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="번호 뽑기" component={Lotto} />
      <Tabs.Screen name="슬롯 번호 뽑기" component={SlotLotto} />
      <Tabs.Screen name="저장 번호" component={SaveNumber} />
      <Tabs.Screen name="당첨 확인" component={MyPage} />
    </Tabs.Navigator>
  );
};
