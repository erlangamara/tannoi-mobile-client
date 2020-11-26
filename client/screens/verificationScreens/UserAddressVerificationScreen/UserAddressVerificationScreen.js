import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import { bold, normal } from '../../../assets/FontSize';
import { useSelector, useDispatch } from 'react-redux';
import { inputUserAddress, addStepCount } from '../../../store/actions/VerificationAction';
import ErrorMessage from '../../../components/publicComponents/ErrorMessage';
import axios from 'axios';

//Image
import VerificationScreenImage from '../../../assets/verificationAssets/verificationScreenImage.svg';

//Components
import BigButton from '../../../components/publicComponents/BigButton';
import FormInput from '../../../components/publicComponents/FormInput';
import StepCount from '../../../components/verificationComponent/StepCount';

const UserAddressVerificationScreen = ({ navigation }) => {
  const streetFromStore = useSelector(state => state.VerificationReducer.street);
  const cityFromStore = useSelector(state => state.VerificationReducer.city);
  const countryFromStore = useSelector(state => state.VerificationReducer.country);
  const postalCodeFromStore = useSelector(state => state.VerificationReducer.postalCode);

  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(countryFromStore);
  const [street, setStreet] = useState(streetFromStore);
  const [city, setCity] = useState(cityFromStore);
  const [postCode, setPostCode] = useState(postalCodeFromStore);
  const [streetValidation, setStreetValidation] = useState(false);
  const [cityValidation, setCityValidation] = useState(false);
  const [countryValidation, setCountryValidation] = useState(false);
  const [postalCodeValidation, setPostalCodeValidation] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    getCountry();
  }, []);

  const validationCheck = () => {
    street === '' ? setStreetValidation(true) : setStreetValidation(false);
    city === '' ? setCityValidation(true) : setCityValidation(false);
    selectedCountry === '' || selectedCountry === 'Country' ? setCountryValidation(true) : setCountryValidation(false);
    postCode === '' ? setPostalCodeValidation(true) : setPostalCodeValidation(false);
  };

  const submitUserAddress = () => {
    if (selectedCountry !== '' && street !== '' && city !== '' && postCode !== '') {
      const submitData = {
        street: street,
        city: city,
        country: selectedCountry,
        postalCode: postCode
      };

      dispatch(addStepCount(2));
      dispatch(inputUserAddress(submitData));
      validationCheck();
      navigation.navigate('VoiceVerificationScreen');
    } else {
      validationCheck();
    };
  };

  const streetInput = input => {
    setStreet(input);
  };

  const cityInput = input => {
    setCity(input);
  };

  const postCodeInput = input => {
    setPostCode(input);
  };
 
  const nextScreen = () => {
    submitUserAddress()
  };

  const getCountry = async () => {
    try {
      let getCountryRequest = await axios({
        method: 'get',
        url: 'https://restcountries.eu/rest/v2/all'
      });

      setCountryList(getCountryRequest.data);
    } catch (error) {
      console.log(error);
    }
  };

  const InputForm = () => {
    return (
      <View style={styles.formContainerStyle}>
        <View>
          <FormInput dataInput={streetInput} formInputCustomStyle={styles.formInputCustomStyle} formInputValue={street} capitalize={true} />
          <Text style={styles.inputNameStyle}>Street {streetValidation && <ErrorMessage message="Please input your street address" />}</Text>
        </View>
        <View>
          <FormInput dataInput={cityInput} formInputCustomStyle={styles.formInputCustomStyle} formInputValue={city} capitalize={true} />
          <Text style={styles.inputNameStyle}>City {cityValidation && <ErrorMessage message="Please input your city" />}</Text>
        </View>
        <View>
          <Picker
            selectedValue={selectedCountry}
            style={styles.pickerStyle}
            selectedValue={selectedCountry}
            onValueChange={(itemValue, itemIndex) => setSelectedCountry(itemValue)}
          >
            <Picker.Item label="Country" value="" />
            { 
              countryList.map((countryList, index) => (
                <Picker.Item key={index} label={countryList.name} value={countryList.name} />
              ))
            }
          </Picker>
          {countryValidation && <ErrorMessage message="Please input your country" />}
        </View>
        <View>
          <FormInput dataInput={postCodeInput} formInputCustomStyle={styles.formInputCustomStyle} formInputValue={postCode} />
          <Text style={styles.inputNameStyle}>Postal code {postalCodeValidation && <ErrorMessage message="Please input your postal code" />}</Text>
        </View>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView>
        <View style={styles.userAddressVerificationScreenContainerStyle}>
            <View>
              <View>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={styles.backButtonTextStyle}>Back</Text>
                </TouchableOpacity>
              </View>
              <StepCount />
              <View style={styles.imageContainerStyle}>
                <VerificationScreenImage />
              </View>
              <View>
                <Text style={styles.boldTextStyle}>We ask for your address to know that you are serious</Text>
                <Text style={styles.normalTextStyle}>
                Your personal details will NEVER be shared with any 3rd parties
                </Text>
              </View>
              {InputForm()}
            </View>
            <BigButton
              buttonTitle="Next"
              buttonStyle={selectedCountry === '' || street === '' || city === '' || postCode === '' ? {
                color: "#FFFFFF",
                backgroundColor: "#a1a5ab",
                borderWidth: 0
              } : {
                color: "#FFFFFF",
                backgroundColor: "#6505E1",
                borderWidth: 0
              }}
              disableButton={selectedCountry === '' || street === '' || city === '' || postCode === '' && true}
              buttonFunction={nextScreen}
            />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  userAddressVerificationScreenContainerStyle: {
    padding: "5%",
    flex: 1,
    justifyContent: "space-between",
    marginBottom: "15%"
  },

  backButtonTextStyle: {
    color: "#6505E1",
    fontFamily: bold,
    fontSize: 16
  },

  imageContainerStyle: {
    alignItems: "center"
  },

  boldTextStyle: {
    textAlign: "center",
    fontFamily: bold,
    fontSize: 20
  },

  normalTextStyle: {
    textAlign: "center",
    fontFamily: normal,
    marginTop: -10
  },

  formContainerStyle: {
    justifyContent: "space-between",
    height: "39.5%",
    marginTop: "5%",
    marginBottom: "3.5%"
  },

  formInputCustomStyle: {
    marginBottom: ".5%",
    height: 30,
    fontSize: 16,
    paddingVertical: 0
  },

  pickerStyle: {
    borderBottomColor: "#E3E6EB",
    fontSize: 16,
    marginLeft: -8,
    marginBottom: -10,
    fontFamily: normal,
    color: "#73798C"
  },

  inputNameStyle: {
    fontSize: 14,
    fontFamily: normal
  }
});

export default UserAddressVerificationScreen;