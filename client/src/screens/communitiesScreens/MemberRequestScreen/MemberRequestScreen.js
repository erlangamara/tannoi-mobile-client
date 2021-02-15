import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { CalculateHeight, CalculateWidth } from '../../../helper/CalculateSize';
import { bold, normal } from '../../../assets/FontSize';
import { GlobalPadding } from '../../../constants/Size';
import AsyncStorage from '@react-native-community/async-storage';
import axios from '../../../constants/ApiServices';
import BaseUrl from '../../../constants/BaseUrl';

//Component
import Header from '../../../components/publicComponents/Header';
import Card from '../../../components/publicComponents/Card';
import BackButton from '../../../components/publicComponents/BackButton';
import Button from '../../../components/publicComponents/Button';
import ListCardPlayer from '../../../components/publicComponents/ListCardPlayer';
import LoadingSpinner from '../../../components/publicComponents/LoadingSpinner';

const MemberRequestScreen = ({ navigation, route }) => {
  const [requestList, setRequestList] = useState('');

  const { communityId } = route.params;

  useEffect(() => {
    memberRequestList();
  }, []);

  const memberRequestList = async () => {
    try {
      let access_token = await AsyncStorage.getItem('access_token');

      let MemberRequestListRequest = await axios({
        method: 'get',
        url: `${BaseUrl}/communities/all-request/${communityId}`,
        headers: {
          token: access_token,
        },
      });

      if (MemberRequestListRequest.data) {
        setRequestList(MemberRequestListRequest.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const actionButton = async (userId, isDecline) => {
    try {
      let access_token = await AsyncStorage.getItem('access_token');

      let approveMemberRequest = await axios({
        method: 'post',
        url: `${BaseUrl}/communities/edit-request`,
        headers: {
          token: access_token,
        },
        data: {
          user_id: userId,
          community_id: communityId,
          type: isDecline ? 'Decline' : 'Approve',
        },
      });

      if (approveMemberRequest.data) {
        memberRequestList();
      }
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };

  const HeaderContent = () => (
    <>
      <BackButton
        styleOption={{
          marginTop: 0,
          marginBottom: 0,
        }}
        navigation={navigation}
      />
      <Text style={styles.headerTextStyle}>Join Requests</Text>
    </>
  );

  const CardContent = (itemData) => (
    <>
      <View style={styles.profileContainerStyle}>
        <Image
          source={{ uri: itemData.item.profile_photo_path }}
          style={styles.profileImageStyle}
        />
        <Text style={styles.profileNameStyle}>{itemData.item.name}</Text>
      </View>
      <ListCardPlayer
        fromBio={true}
        recordingFile={itemData.item.community_join_requests[0].voice_note_path}
        isSlider={true}
      />
      <View style={styles.cardButtonContainerStyle}>
        <Button
          buttonStyle={{
            color: '#FFFFFF',
            backgroundColor: '#5152D0',
            borderWidth: 0,
            height: '60%',
            marginBottom: 0,
            paddingVertical: '5%',
            paddingHorizontal: '5%',
            marginRight: '3%',
          }}
          buttonTitle="Confirm"
          buttonFunction={() => actionButton(itemData.item.id, false)}
        />
        <Button
          buttonStyle={{
            color: '#5152D0',
            borderColor: '#5152D0',
            height: '60%',
            marginBottom: 0,
            paddingVertical: '5%',
            paddingHorizontal: '5%',
          }}
          buttonTitle="Decline"
          buttonFunction={() => actionButton(itemData.item.id, true)}
        />
      </View>
    </>
  );

  const RenderCard = (itemData) => (
    <Card child={() => CardContent(itemData)} customStyle={styles.cardStyle} />
  );

  return (
    <View style={{ flex: 1 }}>
      <Header child={HeaderContent} customStyle={styles.headerStyle} />
      <View style={styles.memberRequestContainerStyle}>
        {requestList !== '' ? (
          <FlatList
            data={requestList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={RenderCard}
          />
        ) : (
          <LoadingSpinner loadingSpinnerForComponent={true} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    paddingHorizontal: '3%',
    paddingVertical: '3%',
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerTextStyle: {
    marginLeft: '3%',
    fontFamily: bold,
    fontSize: CalculateHeight(2.5),
    color: '#464D60',
  },

  memberRequestContainerStyle: {
    paddingVertical: '2%',
    paddingHorizontal: GlobalPadding,
  },

  cardStyle: {
    padding: '5%',
    borderRadius: 8,
  },

  profileContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '5%',
  },

  profileImageStyle: {
    height: CalculateWidth(8),
    width: CalculateWidth(8),
    borderRadius: 50,
  },

  profileNameStyle: {
    marginLeft: '3%',
  },

  cardButtonContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default MemberRequestScreen;
