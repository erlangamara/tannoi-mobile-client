import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { userLogin, userLogout } from '../store/actions/LoginAction';
import SplashScreen from 'react-native-splash-screen';

//Navigations
import AccountNavigation from './AccountNavigation';
import MainAppNavigation from './MainAppNavigation';
import VerificationNavigation from '../navigations/VerificationNavigation';

//Screens
import NewDiscussionScreen from '../screens/topicScreens/NewDiscussionScreen';
import DiscussionScreen from '../screens/topicScreens/DiscussionScreen';
import ResponseScreen from '../screens/topicScreens/ResponseScreen';
import UserProfile from '../screens/meScreens/UserProfile';

const Stack = createStackNavigator();

const NavigationIndex = () => {
  const isLoggedIn = useSelector(state => state.LoginReducer.isLoggedIn);
  const dispatch = useDispatch();

  const checkToken = async () => {
    let getToken = await AsyncStorage.getItem('access_token');
    if (getToken) {
      dispatch(userLogin());
    } else if (!getToken) {
      dispatch(userLogout());
      SplashScreen.hide();
    }; 
  };

  useEffect(() => {
    // Uncomment to clear AsyncStorage
    // AsyncStorage.clear();
    checkToken();
  }, [])

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      {
        isLoggedIn ? (
          <>
            <Stack.Screen name="MainAppNavigation" component={MainAppNavigation} />
            <Stack.Screen name="NewDiscussionScreen" component={NewDiscussionScreen} />
            <Stack.Screen name="DiscussionScreen" component={DiscussionScreen} />
            <Stack.Screen name="ResponseScreen" component={ResponseScreen} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name="VerificationNavigation" component={VerificationNavigation} />
          </>
        ) : (
          <Stack.Screen name="AccountNavigation" component={AccountNavigation} />
        )
      }
    </Stack.Navigator>
  );
};

export default NavigationIndex;