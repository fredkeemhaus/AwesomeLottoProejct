import React, { useEffect, useLayoutEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Lotto from "../screens/Lotto";
import SlotLotto from "../screens/SlotLotto";
import SaveNumber from "../screens/SaveNumber";
import MyPage from "../screens/MyPage";
import { Ionicons } from "@expo/vector-icons";
import { SimpleLineIcons } from '@expo/vector-icons';
import {View, Text} from 'react-native';


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
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName = "";
          let textName = null;
          if (route.name === "번호 뽑기") {
            iconName += "info";
            textName === route.name;
          } else if (route.name === "저장 번호") {
            iconName += "drawer";
            textName === route.name;
          } else if (route.name === "당첨 확인") {
            iconName += "present";
            textName === route.name;
          } 
          return (
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingVertical: 5}}>
              <SimpleLineIcons
                name={iconName}
                color={focused ? "white" : "grey"}
                size={26}
              />
              <Text style={{color: focused ? "white" : "grey", fontSize: 10, paddingTop: 5}}>{route.name}</Text>
            </View>
          );
        }
      })}
      tabBarOptions={{
        showLabel: false,
        style: {
          backgroundColor: "#21243d",
          borderTopColor: "#21243d",
          paddingVertical: 20
        }
      }}
    >
      <Tabs.Screen name="번호 뽑기" component={Lotto} />
      {/* <Tabs.Screen name="슬롯 번호 뽑기" component={SlotLotto} /> */}
      <Tabs.Screen name="저장 번호" component={SaveNumber} />
      <Tabs.Screen name="당첨 확인" component={MyPage} />
    </Tabs.Navigator>
  );
};
