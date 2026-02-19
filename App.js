import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import BmiScreen from './src/screens/BmiScreen';
import SurveyScreen from './src/screens/SurveyScreen';
import InfoScreen from './src/screens/InfoScreen';
import FoodScreen from './src/screens/FoodScreen';
import FaqScreen from './src/screens/FaqScreen';
import ContactScreen from './src/screens/ContactScreen';
import AboutScreen from './src/screens/AboutScreen';
import StepCounterScreen from './src/screens/StepCounterScreen';
import AiAssistantScreen from './src/screens/AiAssistantScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Bmi" component={BmiScreen} />
        <Stack.Screen name="Survey" component={SurveyScreen} />
        <Stack.Screen name="Info" component={InfoScreen} />
        <Stack.Screen name="Food" component={FoodScreen} />
        <Stack.Screen name="Faq" component={FaqScreen} />
        <Stack.Screen name="Contact" component={ContactScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="StepCounter" component={StepCounterScreen} />
        <Stack.Screen name="AiAssistant" component={AiAssistantScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
