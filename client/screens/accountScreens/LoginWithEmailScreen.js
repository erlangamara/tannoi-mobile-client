import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  useDispatch
} from 'react-redux';
import { userLogin } from '../../store/actions/LoginAction';
import { getHome, clearHome } from '../../store/actions/HomeAction';
import axios from 'axios';
import { bold, normal } from '../../assets/FontSize';
import BaseUrl from '../../constants/BaseUrl';

//Components
import BackButton from '../../components/publicComponents/BackButton';
import LoginButton from '../../components/publicComponents/BigButton';
import FormInput from '../../components/publicComponents/FormInput';
import NotActiveButton from '../../components/publicComponents/NotActiveButton';
import LoadingSpinner from '../../components/publicComponents/LoadingSpinner';
import ErrorMessage from '../../components/publicComponents/ErrorMessage';

const LoginWithEmailScreen = ({ navigation }) => {
  const [emailLogin, setEmailLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginValidation, setLoginValidation] = useState(false)
  
  const dispatch = useDispatch();

  const emailInput = emailData => {
    setEmailLogin(emailData);
  };

  const passwordInput = passwordData => {
    setPasswordLogin(passwordData);
  };

  const login = async () => {
    try {
      setIsLoading(!isLoading);
      let loginRequest = await axios.post(`${BaseUrl}/users/login`, {
        email: emailLogin,
        password: passwordLogin
      })

      if (loginRequest.data) {
        console.log(loginRequest.data);
        setIsLoading(false);
        await AsyncStorage.setItem('access_token', loginRequest.data.access_token);
        dispatch(clearHome());
        dispatch(getHome());
        dispatch(userLogin());
      }
    } catch (error) {
      console.log(error)
      if (error.response.data.msg) {
        setIsLoading(false);
        setLoginValidation(true);
      }
    }
  };

  const LoginWithEmailButton = () => {
    return (
      <View style={styles.loginWithEmailButtonContainerStyle}>
        {
          emailLogin && passwordLogin ? (
            <LoginButton
                buttonTitle="Log in"
                buttonStyle={
                  {
                    backgroundColor: "#5152D0",
                    borderColor: "#5152D0",
                    color: "#FFFFFF",
                    width: "100%",
                    height: "100%"
                  }
                }
                buttonType="funtionButton"
                buttonFunction={login}
            />
          ) : (
            <NotActiveButton 
              buttonTitle="Log in"
              buttonHeight="100%"
            />
          )
        }
      </View>
    );
  };

  const ForgotPasswordButton = () => {
    return (
      <View style={styles.forgotPasswordButtonContainer}>
        <Text style={styles.forgotPasswordButtonTextStyle}>
          Forgot password?
        </Text>
        <TouchableOpacity 
          style={{marginLeft: 5}}
          onPress={() => {
            navigation.navigate('ResetPasswordWithEmailScreen');
          }}
        >
          <Text style={{...styles.forgotPasswordButtonTextStyle, fontFamily: bold}}>Reset password</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}
    >
      <View style={{flex: 1}}>
        <View style={styles.loginWithEmailScreenContainerStyle}>
          <BackButton navigation={navigation} />
          <Text style={styles.loginTitleStyle}>Login to TannOi</Text>
          {
            loginValidation && (
              <ErrorMessage message="Wrong username/password" />
            )
          }
          <FormInput 
            formInputTitle="Email address"
            dataInput={emailInput}
          />
          <FormInput 
            formInputTitle="Password"
            dataInput={passwordInput}
          />
          <LoginWithEmailButton />
          <ForgotPasswordButton />
        </View>
        {
          isLoading && (
            <LoadingSpinner />
          )
        }
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  loginWithEmailScreenContainerStyle: {
    flex: 1,
    paddingLeft: 24,
    paddingRight: 24
  },

  loginTitleStyle: {
    color: "#464D60",
    fontSize: 28,
    marginBottom: "10%",
    fontFamily: bold
  },

  loginWithEmailButtonContainerStyle: {
    height: 55
  },

  forgotPasswordButtonContainer: {
    marginTop: "5%",
    flexDirection:"row",
    justifyContent: "center"
  },

  forgotPasswordButtonTextStyle: {
    color: "#73798C",
    fontFamily: normal
  }
});

export default LoginWithEmailScreen;