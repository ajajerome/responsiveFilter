import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AuthIndex from '@/app/(auth)/index';
import HomeIndex from '@/app/(home)/index';
import NewPlayer from '@/app/player/new';
import Dashboard from '@/app/player/dashboard';
import InteractionScreen from '@/app/player/interaction';
import QuizScreen from '@/app/player/quiz';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Auth">
          <Stack.Screen name="Auth" component={AuthIndex} />
          <Stack.Screen name="Home" component={HomeIndex} />
          <Stack.Screen name="PlayerNew" component={NewPlayer} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Interaction" component={InteractionScreen} />
          <Stack.Screen name="Quiz" component={QuizScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
