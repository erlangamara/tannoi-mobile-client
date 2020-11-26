import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
import { bold, normal } from '../../assets/FontSize';
import NoProfilePicture from '../../assets/publicAssets/noProfilePicture.png';
import { useSelector, useDispatch } from 'react-redux';
import { getOneProfile } from '../../store/actions/ProfileAction';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import BaseUrl from '../../constants/BaseUrl';

//Components
import BackButton from '../../components/publicComponents/BackButton';

const UserProfile = ({route, navigation}) => {
  const { userId } = route.params;

  const dispatch = useDispatch();

  const profile = useSelector(state => state.ProfileReducer.userProfile);

  const numberConverter = number => {
    if (number.length > 3 && number.length <= 6) {
      return `${number.substring(0, number.length - 3)}k`;
    } else if (number.length > 6 && number.length <= 9) {
      return `${number.substring(0, number.length - 6)}m`;
    } else if (number.length > 9) {
      return `${number.substring(0, number.length - 9)}b`;
    } else {
      return number
    };
  };

  const followAccount = async () => {
    try {
      let access_token = await AsyncStorage.getItem('access_token');

      let followAccountRequest = await axios({
        method: 'get',
        url: `${BaseUrl}/users/${profile.isFollowing ? 'unfollow' : 'follow'}/${userId}`,
        headers: {
          'token': access_token
        }
      });

      if (followAccountRequest) {
        console.log(followAccountRequest.data);
        dispatch(getOneProfile(userId));
      }
    } catch (error) {
      if (error.response.data.msg === 'You have to login first') {
        dispatch(userLogout());
      };
    }
  };

  useEffect(() => {
    dispatch(getOneProfile(userId));
  }, [])

  return (
    <View style={styles.userProfileScreenContainerStyle}>
      <View style={styles.userProfileStyle}>
        <View style={styles.headerStyle}>
          <BackButton
            navigation={navigation}
            styleOption={{
              marginTop: 0,
              marginBottom: 0
            }}
            navigation={navigation}
          />
          {
            profile.isFollowing !== undefined && (
              <TouchableOpacity onPress={() => followAccount()}>
                <Text style={styles.followButtonTextStyle}>{profile.isFollowing ? 'Unfollow' : 'Follow'}</Text>
              </TouchableOpacity>
            )
          }
        </View>
        <View style={styles.profileInfoContainerStyle}>
          <View>
            <Text style={styles.profileNameStyle}>{profile.name}</Text>
            <Text style={styles.locationStyle}>{profile.location}</Text>
            <View style={styles.profileInfoStyle}>
              <View style={styles.profileDataContainerStyle}>
                <Text style={styles.profileDataStyle}>Discussions</Text>
                <Text style={styles.profileDataNumberStyle}>{profile.discussions && numberConverter(profile.discussions.length)}</Text>
              </View>
              <View style={styles.profileDataContainerStyle}>
                <Text style={styles.profileDataStyle}>Responses</Text>
                <Text style={styles.profileDataNumberStyle}>{profile.creator && numberConverter(profile.creator.length)}</Text>
              </View>
              <View style={styles.profileDataContainerStyle}>
                <Text style={styles.profileDataStyle}>Followers</Text>
                <Text style={styles.profileDataNumberStyle}>{profile.followers && numberConverter(profile.followers.length)}</Text>
              </View>
            </View>
          </View>
          <View style={styles.profileImageContainerStyle}>
            <Image source={profile.profile_photo_path ? { uri: profile.profile_photo_path } : NoProfilePicture} style={styles.profileImageStyle} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userProfileScreenContainerStyle: {
    flex: 1
  },

  userProfileStyle: {
    backgroundColor: "#FFFFFF",
    height: "35%",
    paddingLeft: "3.5%",
    paddingRight: "5%"
  },

  headerStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: "3%"
  },

  followButtonTextStyle: {
    color: "#0E4EF4",
    fontSize: 16,
    fontFamily: bold
  },

  profileInfoContainerStyle: {
    flexDirection: "row"
  },

  profileNameStyle: {
    fontSize: 20,
    fontFamily: bold
  },

  locationStyle: {
    fontFamily: normal,
    fontSize: 16
  },

  profileInfoStyle: {
    flexDirection: "row",
    marginTop: "15%"
  },

  profileDataContainerStyle: {
    marginRight: "5%"
  },

 profileDataStyle: {
    color: "#73798C",
    fontSize: 12,
    fontFamily: normal,
    marginBottom: -10
  },

  profileDataNumberStyle: {
    color: "#464D60",
    fontFamily: bold,
    fontSize: 16
  },

  profileImageContainerStyle: {
    alignItems: "flex-end",
    flex: 1,
    paddingTop: "2%"
  },

  profileImageStyle: {
    borderRadius: 50,
    height: 80,
    width: 80
  }
});

export default UserProfile;