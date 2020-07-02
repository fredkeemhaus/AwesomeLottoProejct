import React from "react";
import { create, createStackNavigator } from "@react-navigation/stack";
import Detail from "../screens/Detail";
import Tabs from "./Tabs";

const Stack = createStackNavigator();

export default () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: "#21243d",
        borderBottomColor: "#21243d",
        shadowColor: "black"
      },
      headerTintColor: "white",
      headerBackTitleVisible: false
    }}
  >
    <Stack.Screen name="Tabs" component={Tabs}/>
    <Stack.Screen name="Detail" component={Detail} />
  </Stack.Navigator>
);
