import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { bold, normal } from '../../assets/FontSize';
import axios from 'axios';

//Component
import BackButton from '../../components/publicComponents/BackButton';

const ResetPasswordWithEmailVerificationScreen = ({ route, navigation }) => {
  const [countNumber, setCountNumber] = useState(60);

  const sendEmailCounter = () => {
    let counter = 60;

    let startCounter = setInterval(() => {
      counter = counter - 1;
      setCountNumber(counter);
      console.log(counter);

      if (counter === 0) {
        clearInterval(startCounter);
        counter = 60;
      }
    }, 1000);
  };

  const resendEmail = async () => {
    try {
      sendEmailCounter();
      let resetPasswordRequest =  await axios.post('https://dev.entervalhalla.tech/api/tannoi/v1/users/password/send-reset-token', {
        link: url
      });
      if (resetPasswordRequest.data.msg === 'Success') {
        console.log(`resend email: ${resetPasswordRequest.data.msg}`);
      };
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.resetPasswordWithEmailVerificationScreenContainerStyle}>
      <BackButton navigation={navigation} />
      <Text style={styles.resetPasswordWithEmailVerificationTitleStyle}>Email has been sent</Text>
      <Text style={styles.resetPasswordWithEmailVerificationScreenInstructionStyle}>
        Please check your inbox and click in the received link to reset your password.
      </Text>
      <View style={styles.sendAgainEmailContainerStyle}>
        <Text style={styles.sendAgainEmailButtonTitleStyle}>Didn’t receive the link? </Text>
        <TouchableOpacity
          onPress={resendEmail}
          disabled={countNumber !== 60 && countNumber !== 0 ? true : false}
        >
          <Text style={countNumber !== 60 && countNumber !== 0 ? {...styles.sendAgainEmailButtonStyle, color: "#a1a5ab"} : styles.sendAgainEmailButtonStyle}>Send again</Text>
        </TouchableOpacity>
        <Text style={styles.counterTextStyle}>{countNumber !== 60 && countNumber !== 0 && ` (${countNumber})`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  resetPasswordWithEmailVerificationScreenContainerStyle: {
    flex: 1,
    paddingHorizontal: 24
  },

  resetPasswordWithEmailVerificationTitleStyle: {
    color: "#464D60",
    fontSize: 28,
    fontFamily: bold
  },

  resetPasswordWithEmailVerificationScreenInstructionStyle: {
    marginTop: "5%",
    fontSize: 16,
    fontFamily: normal,
    lineHeight: 24,
    color: "#73798C"
  },

  sendAgainEmailContainerStyle: {
    flexDirection: "row",
    marginTop: "8%"
  },

  sendAgainEmailButtonTitleStyle: {
    color:"#73798C",
    fontSize: 16,
    fontFamily: normal
  },

  sendAgainEmailButtonStyle: {
    color: "#2f3dfa",
    fontSize: 16,
    fontFamily: normal
  },

  counterTextStyle: {
    color: "#2f3dfa",
    fontSize: 16,
    fontFamily: bold
  }
});

export default ResetPasswordWithEmailVerificationScreen;