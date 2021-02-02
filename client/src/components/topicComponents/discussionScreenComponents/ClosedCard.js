import React, {useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import {bold, normal} from '../../../assets/FontSize';
import {useSelector} from 'react-redux';

//Icon
import TickIcon from '../../../assets/publicAssets/tickIcon.png';

//Components
import LoadingSpinner from '../../publicComponents/LoadingSpinner';
import TopResponsePreview from './TopResponsePreview';

const ClosedCard = (props) => {
  const {
    profilePicture,
    profileName,
    postTime,
    caption,
    cardIndex,
    selectCard,
    discussionTitle,
    responseLike,
    responsePlay,
    responseReply,
    profileType,
    navigation,
    responseId,
    discussionId,
    topResponse,
    responseCount,
  } = props;

  const isLoading = useSelector((state) => state.DiscussionReducer.isLoading);

  useEffect(() => {

  }, [responseCount]);

  const numberConverter = (number) => {
    let numberToString = number.toString();

    if (numberToString.length > 3 && numberToString.length <= 6) {
      return `${numberToString.substring(0, numberToString.length - 3)}k`;
    } else if (numberToString.length > 6 && numberToString.length <= 9) {
      return `${numberToString.substring(0, numberToString.length - 6)}m`;
    } else if (numberToString.length > 9) {
      return `${numberToString.substring(0, numberToString.length - 9)}b`;
    } else {
      return numberToString;
    }
  };

  const ResponseData = () => {
    return (
      <View style={styles.responseDataContainerStyle}>
        <Text style={styles.responseDataTextStyle}>
          {numberConverter(responseLike)} Votes
        </Text>
        <Text style={styles.responseDataTextStyle}>
          {numberConverter(responseReply)} Replies
        </Text>
        <Text style={styles.responseDataTextStyle}>
          {numberConverter(responsePlay)} Plays
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={styles.closedCardContainerStyle}
      onPress={() => {
        selectCard(cardIndex);
      }}
      disabled={isLoading ? true : false}>
      {isLoading ? (
        <LoadingSpinner loadingSpinnerForComponent={true} />
      ) : (
        <>
          <View style={styles.profileAndPostTimeContainerStyle}>
            <View style={styles.profileInfoContainerStyle}>
              <Image
                source={{uri: profilePicture}}
                style={styles.profileImageStyle}
              />
              <Text style={styles.profileNameStyle}>{profileName}</Text>
              {profileType === 1 && (
                <Image source={TickIcon} style={styles.tickIconStyle} />
              )}
            </View>
            <Text style={styles.postTimeStyle}>{postTime ? postTime : ''}</Text>
          </View>
          {cardIndex === 'discussion' ? (
            discussionTitle.length > 45 ? (
              <Text style={styles.discussionTitleStyle}>
                {discussionTitle.substring(0, 42)}...
              </Text>
            ) : (
              <Text style={styles.discussionTitleStyle}>{discussionTitle}</Text>
            )
          ) : (
            <Text style={styles.captionTextStyle}>{caption}</Text>
          )}
          {responseLike !== undefined && <ResponseData />}
          {topResponse && topResponse.length !== 0 && (
            <TopResponsePreview
              navigation={navigation}
              topResponseData={topResponse}
              discussionId={discussionId}
              customStyle={{
                marginTop: '6%',
              }}
              responseCount={responseCount}
              responseId={responseId}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  closedCardContainerStyle: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 8,
    marginBottom: 8,
    borderRadius: 8,
    padding: 16,
  },

  profileAndPostTimeContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  profileInfoContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileImageStyle: {
    borderRadius: 50,
    height: 24,
    width: 24,
    marginRight: 12,
  },

  profileNameStyle: {
    fontSize: 14,
    color: '#464D60',
    fontFamily: bold,
  },

  tickIconStyle: {
    height: 15,
    width: 15,
    marginLeft: '2%',
  },

  postTimeStyle: {
    color: '#73798C',
    fontSize: 12,
    fontFamily: normal,
  },

  discussionTitleStyle: {
    marginVertical: '2%',
    fontSize: 16,
    fontFamily: bold,
  },

  captionTextStyle: {
    fontSize: 16,
    color: '#464D60',
    fontFamily: normal,
    marginTop: '2%',
  },

  responseDataContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    marginTop: '2%',
  },

  responseDataTextStyle: {
    fontSize: 12,
    color: '#73798C',
    fontFamily: normal,
  },
});

export default ClosedCard;