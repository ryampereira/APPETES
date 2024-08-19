import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {NavigationContainer } from '@react-navigation/native';
import MunicipiosScreen from './src/screens/municipio';
import BaciasScreen from './src/screens/baciahidro';
import HomeScreen from './src/screens/home';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen
          name="HOME"
          component={HomeScreen}
          options={{headerShown: false}} 
          />
      <Stack.Screen
          name="BaciasScreen"
          component={BaciasScreen}
          options={{headerShown: false}} 
          />
      <Stack.Screen 
          name="MunicipiosScreen" 
          component={MunicipiosScreen}
          options={{headerShown: false}}  
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
