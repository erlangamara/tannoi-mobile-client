import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList
} from 'react-native';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import { getHome, clearHome } from '../../../store/actions/HomeAction';

//Components
import SearchBar from '../../../components/homeComponents/SearchBar';
import ProfileBar from '../../../components/homeComponents/homeScreenComponents/ProfileBar';
import DiscussionOfTheWeek from '../../../components/homeComponents/homeScreenComponents/HomeList';
import TopUsers from '../../../components/homeComponents/homeScreenComponents/TopUsers';
import Trending from '../../../components/homeComponents/homeScreenComponents/HomeList';
import RecommendedTopics from '../../../components/homeComponents/homeScreenComponents/RecommendedTopics';
import NoticeModal from '../../../components/publicComponents/NoticeModal';

const HomeScreen = ({ navigation }) => {
  const user = useSelector(state => state.HomeReducer.user);
  const discussionOfTheWeek = useSelector(state => state.HomeReducer.discussionOfTheWeek);
  const topUser = useSelector(state => state.HomeReducer.topUser);
  const trending = useSelector(state => state.HomeReducer.trending);
  const recommendedTopic = useSelector(state => state.HomeReducer.recommendedTopic);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    // const unsubscribe = navigation.addListener('focus', () => {
      dispatch(clearHome());
      dispatch(getHome());
      SplashScreen.hide();
    // });

    // return unsubscribe;
  }, [navigation]);

  return (
    <View>
      <ProfileBar 
        user={user}
        navigation={navigation}
      />
      <FlatList
        ListHeaderComponent={
          <View style={styles.homeScreenContainerStyle}>
            <SearchBar
              searchBarIsOpen={false}
              navigation={navigation}
            />
            <DiscussionOfTheWeek
              listTitle="Discussion of the week"
              listData={discussionOfTheWeek}
              navigation={navigation}
              openModal={openModal}
            />
            <TopUsers
              topUserData={topUser}
              navigation={navigation}
            />
            <Trending 
              listTitle="Trending"
              listData={trending}
              navigation={navigation}
              openModal={openModal}
            />
            <RecommendedTopics
              topicData={recommendedTopic}
            />
          </View>
        }
      />
      <NoticeModal 
        openModal={modalIsOpen}
        closeModal={closeModal}
        message="You don't have access to this discussion"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  homeScreenContainerStyle: {
    flex: 1
  }
});

export default HomeScreen;