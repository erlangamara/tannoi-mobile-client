import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Switch
} from 'react-native';
import { bold, normal } from '../../../assets/FontSize';
import { Picker } from '@react-native-community/picker';
import AsyncStorage from '@react-native-community/async-storage';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import { getTopic } from '../../../store/actions/TopicAction';
import { getHome, clearHome } from '../../../store/actions/HomeAction';
import { userLogout } from '../../../store/actions/LoginAction';
import axios from 'axios';
import BaseUrl from '../../../constants/BaseUrl';

//Components
import BackButton from '../../../components/publicComponents/BackButton';
import FormInput from '../../../components/publicComponents/FormInput';
import LoadingSpinner from '../../../components/publicComponents/LoadingSpinner';
import Recorder from '../../../components/topicComponents/Recorder';
import ErrorMessage from '../../../components/publicComponents/ErrorMessage';
import PrivateDiscussionModal from '../../../components/topicComponents/PrivateDiscussionModal';

const NewDiscussionScreen = ({ navigation }) => {
  const [discussionTitle, setDiscussionTitle] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('Select topic');
  const [hashtags, setHashtags] = useState([]);
  const [recordingFile, setRecordingFile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [createNewDiscussionValidation, setCreateNewDiscussionValidation] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedFollowers, setSelectedFollowers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [modalOption, setModalOption] = useState(false);

  const topics = useSelector(state => state.TopicReducer.topics);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTopic());
  }, [])

  const discussionTitleInput = input => {
    setDiscussionTitle(input);
  };

  const addSelectedFollowers = (followers, isSelectAll) => {
    setOpenModal(false);
    setSelectedFollowers(followers);
    if (followers.length === 0 && !isSelectAll) {
      setSwitchValue(false);
      setSelectAll(false);
    } else if (isSelectAll) {
      setSelectAll(true);
    };
  };

  const hashtagsInput = input => {
    let hashtagArray = [];
    let hashtag = '';

    for (let hashtagInputIndex = 0; hashtagInputIndex < input.length; hashtagInputIndex++) {
      if (input[hashtagInputIndex] === ' ') {
        if (hashtag[0] === '#') {
          hashtagArray.push(hashtag);
        } else {
          hashtagArray.push(`#${hashtag}`);
        }
        hashtag = '';
      } else {
        hashtag += input[hashtagInputIndex];
      };
    };
    
    if (hashtag[0] === '#') {
      hashtagArray.push(hashtag);
    } else {
      hashtagArray.push(`#${hashtag}`);
    }
    hashtag = '';

    setHashtags(hashtagArray.filter(item => item.length > 1));
  };

  const createNewDiscussion =  async () => {
    try {
      setIsLoading(true);
      setCreateNewDiscussionValidation(false);

      let access_token = await AsyncStorage.getItem('access_token');
      
      const uri = `file://${recordingFile}`;
    
      let formData = new FormData();

      let audioParts = uri.split('.');
      let fileType = audioParts[audioParts.length - 1];
      
      formData.append('title', discussionTitle);

      formData.append('topic_id', selectedTopic);

      formData.append('status', '1');

      formData.append('type', selectAll || selectedFollowers.length > 0 ? '2' : '1');

      selectedFollowers.length > 0 && formData.append('userArr', selectedFollowers);

      selectAll && formData.append('all_follower', true);

      formData.append('hashtag', JSON.stringify(hashtags));

      formData.append('voice_note_path', {
        uri,
        name: `recording.${fileType}`,
        type: `audio/${fileType}`
      });

      let createNewDiscussionRequest = await axios({
        method: 'post',
        url: `${BaseUrl}/discussions`,
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': access_token
        },
        data: formData
      });

      if (createNewDiscussionRequest.data) {
        setIsLoading(false);
        dispatch(clearHome());
        dispatch(getHome());
        navigation.navigate('DiscussionScreen', {
          discussionId: createNewDiscussionRequest.data.id,
          fromNewDiscussion: true
        });
      }
    } catch (error) {
      setIsLoading(false);
      setCreateNewDiscussionValidation(true);
      if (error.response.data.msg === 'You have to login first') {
        dispatch(userLogout());
      };
      console.log(error.response.data.msg);
    }
  };

  const addRecordingFile = recordingFileInput => {
    setRecordingFile(recordingFileInput);
  };

  const changeSwitchValue = () => {
    setSwitchValue(previousState => !previousState);
    if (switchValue !== true) {
      setOpenModal(true);
    } else if (switchValue === true) {
      setModalOption(true);
      setOpenModal(true);
    };
  };

  const closeModal = (isFinish) => {
    setOpenModal(false);
    if (!isFinish) {
      setSwitchValue(false);
      setSelectAll(false);
      setSelectedFollowers([]);
    } else {
      setSwitchValue(true);
    }
  };

  const changeModalOption = (input, changeSwitch) => {
    setModalOption(input);

    if (changeSwitch) {
      setSwitchValue(changeSwitch)
    };
  };

  const PrivateDiscussionSwitch = () => {
    return (
      <View style={styles.privateDiscussionSwitchContainerStyle}>
        <Text style={styles.privateDiscussionText}>Private discussion:  </Text>
        <Switch
          value={switchValue}
          onValueChange={changeSwitchValue}
          trackColor={{true: "#6505E1", false: ""}}
          thumbColor={"#6505E1"}
        />
        <PrivateDiscussionModal 
          openModal={openModal}
          closeModal={closeModal}
          addSelectedFollowers={addSelectedFollowers}
          openModalOption={modalOption}
          changeModalOption={changeModalOption}
          isFilled={selectAll || selectedFollowers.length > 0 ? true : false}
          selectedFollowers={selectedFollowers}
        />
      </View>
    );
  };

  const NewDiscussionHeader = () => {
    return (
      <View style={styles.newDiscussionUpperBarStyle}>
        <View style={styles.backButtonAndTitleContainerStyle}>
          <BackButton
            navigation={navigation}
            styleOption={{
              marginTop: 0,
              marginBottom: 0
            }}
          />
          <Text style={styles.newDiscussionTitleStyle}>New discussion</Text>
        </View>
        <TouchableOpacity
          onPress={() => createNewDiscussion()}
        >
          <Text style={styles.publishButtonTextStyle}>Publish</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const NewDiscussionForm = () => {
    return (
      <>
        <FormInput
          formInputTitle="Discussion title"
          dataInput={discussionTitleInput}
          capitalize={true}
        />
        <Text style={styles.formInputTitleStyle}>Topic</Text>
        <Picker
          selectedValue={selectedTopic}
          style={styles.topicPickerStyle}
          selectedValue={selectedTopic}
          onValueChange={(itemValue, itemIndex) => setSelectedTopic(itemValue)}
        >
          <Picker.Item label="Select topic" value="Select topic" />
          { 
            topics.map((topic, index) => (
              <Picker.Item key={index} label={topic.name} value={topic.id} />
            ))
          }
        </Picker>
        <FormInput
          formInputTitle="Add hashtags"
          dataInput={hashtagsInput}
        />
        {
          createNewDiscussionValidation && (
            <ErrorMessage
              message="All fields must be filled in, including a voice note!"
            />
          )
        }
      </>
    );
  };

  return (
    <ScrollView>
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
      >
        <View style={styles.newDiscussionContainerStyle}>
          <NewDiscussionHeader />
          <View style={styles.newDiscussionFormContainerStyle}>
            <View style={styles.contentContainerStyle}>
              <PrivateDiscussionSwitch />
              <View style={styles.recorderContainerStyle}>
                <Recorder
                  addRecordingFile={addRecordingFile}
                />
              </View>
              {NewDiscussionForm()}
            </View>
            {
              isLoading && (
                <LoadingSpinner />
              )
            }
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  newDiscussionContainerStyle: {
    flex: 1
  },

  newDiscussionUpperBarStyle: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    paddingLeft: 22,
    paddingRight: 16,
    paddingVertical: "3%",
    justifyContent: "space-between",
    alignItems: "center"
  },

  privateDiscussionSwitchContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: "3%"
  },

  privateDiscussionText: {
    fontFamily: bold,
    color: "#73798C"
  },

  backButtonAndTitleContainerStyle: {
    flexDirection: "row",
    alignItems: "center"
  },

  newDiscussionTitleStyle: {
    fontFamily: bold,
    fontSize: 16,
    color: "#464D60",
    marginLeft: 14
  },

  publishButtonTextStyle: {
    color: "#0E4EF4",
    fontSize: 16,
    fontFamily: bold
  },

  newDiscussionFormContainerStyle: {
    backgroundColor: "#FFFFFF",
    margin: 8,
    borderRadius: 8
  },

  contentContainerStyle: {
    paddingHorizontal: 16,
    paddingTop: "5%",
    paddingBottom: "5%"
  },

  formInputTitleStyle: {
    color: "#73798C",
    fontFamily: normal,
    fontSize: 14,
    marginBottom: 12
  },

  topicPickerStyle: {
    height: 47,
    borderBottomColor: "#E3E6EB",
    fontSize: 16,
    marginBottom: 24,
    fontFamily: normal,
    color: "#73798C"
  },

  recorderContainerStyle: {
    marginBottom: "20%"
  }
});

export default NewDiscussionScreen;