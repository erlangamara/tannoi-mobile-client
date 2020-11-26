const defaultState = {
  userProfile: ''
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'GET_ONE_PROFILE':
      let setUerProfile = action.payload.userProfile

      return {...state, userProfile: setUerProfile};
    default:
      return state;
  }
};

export default reducer;