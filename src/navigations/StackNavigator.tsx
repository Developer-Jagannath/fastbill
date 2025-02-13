import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import CalculatorScreen from '../screens/CalculatorScreen';
import SettingScreen from   "../screens/SettingScreen";
import PrintScreen from '../screens/PrintScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../assets/Styles/Colors';
import CalculatorUpdateScreen from '../screens/CalculatorUpdateScreen';
// Define types for navigation
export type RootTabStackParamList = {
  Home: undefined;
  Setting: undefined;
};
const {tabBarActiveTint}=colors;
export type MainStackParamList = {
  Main: undefined;
  calculator: undefined;
  calculatorUpdate: undefined;
  Print: { bill: number[] };
};

const Stack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<RootTabStackParamList>();

function BottomTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
       
        options={{
            tabBarActiveTintColor: tabBarActiveTint,
            tabBarIcon: ({focused}) =>
              focused ? (
                <Ionicons name="home-outline" size={24} color={tabBarActiveTint} />
              ) : (
                <Ionicons name="home-outline" size={24} color="#989898" />
              ),
          }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
            tabBarActiveTintColor: tabBarActiveTint,
            tabBarIcon: ({focused}) =>
              focused ? (
                <Ionicons name="settings-outline" size={24} color={tabBarActiveTint} />
              ) : (
                <Ionicons name="settings-outline" size={24} color="#989898" />
              ),
          }}
      />
    </Tab.Navigator>
  );
}

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Print"
          component={PrintScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="calculator"
          component={CalculatorScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="calculatorUpdate"
          component={CalculatorUpdateScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator