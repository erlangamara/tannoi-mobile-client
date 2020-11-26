const defaultState = {
  profileId: '',
  profilePicture: '',
  profileName: '',
  postTime: '',
  like: '',
  topic: '',
  discussionTitle: '',
  hashtags: '',
  replies: '',
  plays: '',
  recordingFile: '',
  isLike: '',
  isDislike: '',
  responseCount: '',
  type: ''
}

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'GET_DISCUSSION':
      let setProfileId = action.payload.profileId;
      let setProfilePicture = action.payload.profilePicture;
      let setProfileName = action.payload.profileName;
      let setPostTime = action.payload.postTime;
      let setLike = action.payload.like;
      let setTopic = action.payload.topic;
      let setDiscussionTitle = action.payload.discussionTitle;
      let setHashtags = action.payload.hashtags;
      let setReplies = action.payload.replies;
      let setPlays = action.payload.plays;
      let setRecordingFile = action.payload.recordingFile;
      let setIsLike = action.payload.isLike;
      let setIsDislike = action.payload.isDislike;
      let setType = action.payload.type;

      return {
        ...state,
        profileId: setProfileId,
        profilePicture: setProfilePicture,
        profileName: setProfileName,
        postTime: setPostTime,
        like: setLike,
        topic: setTopic,
        discussionTitle: setDiscussionTitle,
        hashtags: setHashtags,
        replies: setReplies,
        plays: setPlays,
        recordingFile: setRecordingFile,
        isLike: setIsLike,
        isDislike: setIsDislike,
        type: setType
      }
    case 'CLEAR_DISCUSSION':
      return {
        ...state,
        profilePicture: '',
        profileName: '',
        postTime: '',
        like: '',
        topic: '',
        discussionTitle: '',
        hashtags: '',
        replies: '',
        plays: '',
        recordingFile: '',
        isLike: '',
        isDislike: ''
      }
    default:
      return state;
  }
};

export default reducer;