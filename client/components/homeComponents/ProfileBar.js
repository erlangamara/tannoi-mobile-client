import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image
} from 'react-native';

//Profile picture examples
import ProfilePictureExample from '../../assets/homeAssets/profilePictureExample.svg';
import ProfilePictureExample2 from '../../assets/homeAssets/profilePictureExample2.png';

const ProfileBar = props => {
  return (
    <View style={styles.profileBarContainerStyle}>
      {/* Use SVG only for example */}
      {/* <ProfilePictureExample /> */}
      <Image source={ProfilePictureExample2} style={styles.profilePictureStyle}  />
      <Text style={styles.profileBarTextStyle}>Richard Hendricks</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  profileBarContainerStyle: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20
  },

  profilePictureStyle: {
    borderRadius: 50,
    width: 24,
    height: 24
  },

  profileBarTextStyle: {
    fontSize: 16,
    color: "#464D60",
    marginLeft: 12,
    fontWeight: "bold"
  }
});

export default ProfileBar;