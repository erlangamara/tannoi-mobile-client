import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { bold, normal, medium } from '../../assets/FontSize';

//Components
import BackButton from '../../components/publicComponents/BackButton';
import DiscussionScreenCard from '../../components/topicComponents/discussionScreenComponents/DiscussionScreenCard';

const DiscussionScreen = ({ navigation }) => {
  return (
    <View style={styles.discussionScreenContainerStyle}>
      <View style={styles.discussionUpperBarStyle}>
        <BackButton
          navigation={navigation}
          styleOption={{
            marginTop: 0,
            marginBottom: 0
          }}
        />
        <TouchableOpacity
          style={styles.addResponseButtonStyle}
        >
          <Text style={styles.addResponseButtonTextStyle}>Add response</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  discussionScreenContainerStyle: {
    flex: 1
  },

  discussionUpperBarStyle: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    paddingLeft: 22,
    paddingRight: 16,
    paddingTop: 30,
    paddingBottom: 10,
    justifyContent: "space-between",
    alignItems: "center"
  },

  addResponseButtonStyle: {
    color: "#0E4EF4",
    fontSize: 16
  },

  addResponseButtonTextStyle: {
    color: "#0E4EF4",
    fontSize: 16,
    fontFamily: medium
  }
});

export default DiscussionScreen;