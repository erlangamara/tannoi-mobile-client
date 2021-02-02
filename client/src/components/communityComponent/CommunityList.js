import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import {CalculateHeight, CalculateWidth} from '../../helper/CalculateSize';
import {normal, bold} from '../../assets/FontSize';
import LoadingSpinner from '../../components/publicComponents/LoadingSpinner';

//Icon
import EarthIcon from '../../assets/communitiesAssets/ic-earth.svg';
import MultipleManIcon from '../../assets/communitiesAssets/ic-multiple-man.svg';
import DiscussionIcon from '../../assets/communitiesAssets/ic-discussion.svg';

//Component
import Card from '../../components/publicComponents/Card';

const CommunityList = (props) => {
  const {communities, navigation} = props;

  const showCommunityTopics = (data, index) => (
    <Text key={index} style={styles.topicNameStyle}>{data.community_topic.name}  </Text>
  );

  const RenderCommunity = (itemData) => {

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('CommunityProfileScreen', {
            communityId: itemData.item.id,
          })
        }
        style={
          itemData.index + 1 === communities.length
            ? {...styles.communityContainerStyle, borderBottomWidth: 0}
            : styles.communityContainerStyle
        }>
        <Image
          source={{uri: itemData.item.image_path}}
          style={styles.communityProfileImageStyle}
        />
        <View style={styles.communityDataContainerStyle}>
          <View style={styles.communityNameContainerStyle}>
            <Text style={styles.communityNameStyle}>{itemData.item.name}</Text>
            <EarthIcon />
          </View>
          <Text style={styles.communityDescriptionStyle}>
            {itemData.item.description}
          </Text>
          <View>
            <Text>
              {itemData.item.community_topic_conjunctions && itemData.item.community_topic_conjunctions.map(showCommunityTopics)}
            </Text>
          </View>
          <View style={styles.communityMemberAndDiscussionContainerStyle}>
            <View
              style={{
                ...styles.communityMemberAndDiscussionContainerStyle,
                marginRight: '5%',
              }}>
              <MultipleManIcon />
              <Text
                style={{
                  ...styles.communityMemberAndDiscussionStyle,
                  marginLeft: CalculateWidth(2),
                }}>
                {itemData.item.member_count} member
                {itemData.item.member_count > 1 ? 's' : null}
              </Text>
            </View>
            <View style={styles.communityMemberAndDiscussionContainerStyle}>
              <DiscussionIcon />
              <Text
                style={{
                  ...styles.communityMemberAndDiscussionStyle,
                  marginLeft: CalculateWidth(1),
                }}>
                {itemData.item.discussion_count} discussion
                {itemData.item.discussion_count > 1 ? 's' : null}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const CommunityList = () => {
    return (
      <>
        {communities !== '' ? (
          <FlatList
            data={communities}
            keyExtractor={(item, index) => index.toString()}
            renderItem={RenderCommunity}
          />
        ) : (
          <LoadingSpinner loadingSpinnerForComponent={true} />
        )}
      </>
    );
  };

  return (
    <Card child={CommunityList} customStyle={styles.communityListCustomStyle} />
  );
};

const styles = StyleSheet.create({
  communityListCustomStyle: {
    marginTop: '2%',
    borderRadius: 8,
  },

  communityContainerStyle: {
    padding: '5%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#E3E6EB',
  },

  communityProfileImageStyle: {
    width: CalculateWidth(15),
    height: CalculateWidth(15),
    borderRadius: 50,
  },

  communityDataContainerStyle: {
    marginLeft: '5%',
    width: '80%',
  },

  communityNameContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  communityNameStyle: {
    fontFamily: normal,
    fontSize: CalculateHeight(2),
    marginRight: CalculateWidth(1.5),
  },

  communityDescriptionStyle: {
    fontFamily: normal,
    color: '#73798C',
    fontSize: CalculateHeight(1.8),
  },

  communityMemberAndDiscussionContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  communityMemberAndDiscussionStyle: {
    fontFamily: normal,
    color: '#73798C',
  },

  topicNameStyle: {
    color: '#5152D0',
    fontFamily: normal,
    lineHeight: 20
  },
});

export default CommunityList;