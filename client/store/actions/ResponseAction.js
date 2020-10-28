import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

export const getResponse = (discussionId) => {
  return async (dispatch) => {
    try {
      let access_token = await AsyncStorage.getItem('access_token');

      let getResponseRequest = await axios({
        url: `https://dev.entervalhalla.tech/api/tannoi/v1/responses/discussion/${discussionId}?page=1`,
        method: 'get',
        headers: {
          'token': access_token
        }
      });

      if (getResponseRequest.data) {
        dispatch({
          type: 'GET_RESPONSE',
          payload: {
            response: getResponseRequest.data.data
          }
        });
      }
    } catch (error) {
      console.log(error.response.data.msg);
      if (error.response.data.msg === 'You have to login first') {
        dispatch({
          type: 'LOGOUT',
          payload: {
            loginStatus: false
          }
        })
      };
    };
  };
};

export const getSingleResponse = (responseId, responseOption) => {
  return async (dispatch) => {
    try {
      const access_token = await AsyncStorage.getItem('access_token');
  
      if (access_token) {
        let getResponseRequest = await axios({
          url: `https://dev.entervalhalla.tech/api/tannoi/v1/responses/single/${responseId}`,
          method: 'get',
          headers: {
            'token': access_token
          }
        });
  
        if (getResponseRequest.data) {
          if (responseOption === 'getDataForResponse') {
            dispatch({
              type: 'GET_DATA_FOR_RESPONSE',
              payload: {
                likeForResponse: getResponseRequest.data.likes,
                isLikeForResponse: getResponseRequest.data.isLike,
                isDislikeForResponse: getResponseRequest.data.isDislike,
                responseCountForResponse: getResponseRequest.data.response_count
              }
            })
          } else {
            dispatch({
              type: 'GET_SINGLE_RESPONSE',
              payload: {
                profilePicture: getResponseRequest.data.creator.profile_photo_path,
                profileName: getResponseRequest.data.creator.name,
                postTime: getResponseRequest.data.created_at,
                like: getResponseRequest.data.likes,
                recordingFile: getResponseRequest.data.voice_note_path,
                reply: getResponseRequest.data.chain_response,
                isLike: getResponseRequest.data.isLike,
                isDislike: getResponseRequest.data.isDislike,
                caption: getResponseRequest.data.caption
              }
            })
          }
        }
      }
    } catch (error) {
      console.log(error.response.data.msg);
      if (error.response.data.msg === 'You have to login first') {
        dispatch({
          type: 'LOGOUT',
          payload: {
            loginStatus: false
          }
        })
      };
    }
  };
};

export const clearResponse = (clearResponseData) => {
  return (dispatch) => {
    if (clearResponseData) {
      dispatch({
        type: 'CLEAR_RESPONSE_DATA'
      })
    } else {
      dispatch({
        type: 'CLEAR_RESPONSE'
      })
    }
  };
};