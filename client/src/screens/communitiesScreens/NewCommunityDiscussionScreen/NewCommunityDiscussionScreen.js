import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Platform,
} from 'react-native';
import axios from '../../../constants/ApiServices';
import BaseUrl from '../../../constants/BaseUrl';
import AsyncStorage from '@react-native-community/async-storage';
import { GlobalPadding } from '../../../constants/Size';
import { CalculateHeight, CalculateWidth } from '../../../helper/CalculateSize';
import { bold, normal } from '../../../assets/FontSize';
import { Picker } from 'native-base';
import { useDispatch } from 'react-redux';
import { getOneCommunity } from '../../../store/actions/CommuitiesAction';
import { getAllDiscussion } from '../../../store/actions/DiscussionAction';

//Components
import ScreenContainer from '../../../components/publicComponents/ScreenContainer';
import Header from '../../../components/publicComponents/Header';
import BackButton from '../../../components/publicComponents/BackButton';
import Card from '../../../components/publicComponents/Card';
import FormInput from '../../../components/publicComponents/FormInput';
import LoadingSpinner from '../../../components/publicComponents/LoadingSpinner';
import Recorder from '../../../components/publicComponents/Recorder';
import ErrorMessage from '../../../components/publicComponents/ErrorMessage';
import IosPicker from '../../../components/publicComponents/IosPicker';

const NewCommunityDiscussionScreen = (props) => {
  const { navigation, route } = props;

  const { communityId, communityTopics } = route.params;

  const [recordingFile, setRecordingFile] = useState('');
  const [discussionTitle, setDiscussionTitle] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('Select topic');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const addRecordingFile = (recordingFileInput) => {
    setRecordingFile(recordingFileInput);
  };

  const removeRecordingFile = () => {
    setRecordingFile('');
  };

  const discussionTitleInput = (value) => {
    setDiscussionTitle(value);
  };

  const createCommunityDiscussion = async () => {
    try {
      setIsLoading(true);
      let access_token = await AsyncStorage.getItem('access_token');

      const uri = `file://${recordingFile}`;

      let formData = new FormData();

      let audioParts = uri.split('.');
      let fileType = audioParts[audioParts.length - 1];

      formData.append('title', discussionTitle.trim());

      formData.append('community_topic_id', selectedTopic);

      formData.append('status', '1');

      formData.append('type', '1');

      formData.append('community_id', communityId);

      formData.append('voice_note_path', {
        uri,
        name: `recording.${fileType}`,
        type: `audio/${fileType}`,
      });

      let createCommunityDiscussionRequest = await axios({
        method: 'post',
        url: `${BaseUrl}/discussions`,
        headers: {
          'Content-Type': 'multipart/form-data',
          token: access_token,
        },
        data: formData,
      });

      if (createCommunityDiscussionRequest.data) {
        setIsLoading(false);
        dispatch(getOneCommunity(communityId));
        dispatch(getAllDiscussion('community_id=', communityId));
        navigation.navigate('DiscussionScreen', {
          discussionId: createCommunityDiscussionRequest.data.id,
          isCommunityDiscussion: true,
          communityId: communityId,
          fromNewCommunityDiscussion: true,
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const HeaderContent = () => {
    return (
      <>
        <View style={styles.backButtonAndTitleContainerStyle}>
          <BackButton
            navigation={navigation}
            styleOption={{
              marginTop: 0,
              marginBottom: 0,
              marginRight: '5%',
            }}
          />
          <Text style={styles.headerTextStyle}>New community discussion</Text>
        </View>
        <TouchableOpacity
          onPress={createCommunityDiscussion}
          disabled={recordingFile !== '' ? false : true}>
          <Text
            style={
              recordingFile !== ''
                ? styles.publishButtonTextStyle
                : { ...styles.publishButtonTextStyle, color: '#cccccc' }
            }>
            Publish
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  const NewCommunityDiscussionForm = () => {
    return (
      <>
        <Recorder
          addRecordingFile={addRecordingFile}
          removeRecordingFile={removeRecordingFile}
        />
        <View style={styles.inputContainerStyle}>
          <FormInput
            formInputTitle="Discussion title"
            dataInput={discussionTitleInput}
            capitalize={true}
          />
          {Platform.OS === 'android' ? (
            <Picker
              mode="dropdown"
              selectedValue={selectedTopic}
              style={styles.topicPickerStyle}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedTopic(itemValue)
              }>
              <Picker.Item label="Select topic" value="Select topic" />
              {communityTopics.map((topic, index) => (
                <Picker.Item key={index} label={topic.name} value={topic.id} />
              ))}
            </Picker>
          ) : (
            <IosPicker data={communityTopics} onChangeValue={(value) => setSelectedTopic(value)} placeholder="Select Topic" />
          )}
        </View>
      </>
    );
  };

  return (
    <ScreenContainer>
      <Header child={HeaderContent} customStyle={styles.headerStyle} />
      <View
        style={
          isLoading
            ? {
                ...styles.newCommunityDiscussionContainerStyle,
                paddingHorizontal: 0,
              }
            : styles.newCommunityDiscussionContainerStyle
        }>
        <Card
          child={NewCommunityDiscussionForm}
          customStyle={styles.newCommunityDiscussionFormStyle}
        />
        {isLoading && <LoadingSpinner />}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '3%',
  },

  backButtonAndTitleContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerTextStyle: {
    fontFamily: bold,
    fontSize: CalculateHeight(2.25),
    color: '#464D60',
  },

  publishButtonTextStyle: {
    color: '#0E4EF4',
    fontSize: CalculateHeight(2),
    fontFamily: bold,
  },

  newCommunityDiscussionContainerStyle: {
    paddingHorizontal: GlobalPadding,
    paddingVertical: GlobalPadding,
    flex: 1,
  },

  newCommunityDiscussionFormStyle: {
    borderRadius: 8,
    padding: '5%',
  },

  inputContainerStyle: {
    marginTop: '10%',
  },

  topicPickerStyle: {
    width: CalculateWidth(90),
    height: 50,
    borderBottomColor: '#E3E6EB',
    fontSize: CalculateHeight(1.5),
    marginBottom: '5%',
    marginTop: '5%',
    marginLeft: -CalculateWidth(1.5),
    fontFamily: normal,
    color: '#73798C',
  },
});

export default NewCommunityDiscussionScreen;
