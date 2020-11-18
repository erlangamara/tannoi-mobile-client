import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import BaseUrl from '../../constants/BaseUrl';

export const getHome = () => {
  return async (dispatch) => {
    try {
      let access_token = await AsyncStorage.getItem('access_token');

      let getHomeRequest = await axios({
        url: `${BaseUrl}/pages/home?sort=newest&page=1`,
        method: 'get',
        headers: {
          'token': access_token
        }
      });

      if (getHomeRequest.data) {
        console.log(getHomeRequest.data.recommended_topic)
        dispatch({
          type: 'GET_HOME',
          payload: {
            user: getHomeRequest.data.user,
            discussionOfTheWeek: getHomeRequest.data.discussion_of_the_week,
            topUser: getHomeRequest.data.top_user,
            trending: getHomeRequest.data.discussion.data,
            recommendedTopic: getHomeRequest.data.recommended_topic
          }
        })
      };
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

export const clearHome = () => {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_HOME'
    });
  };
};