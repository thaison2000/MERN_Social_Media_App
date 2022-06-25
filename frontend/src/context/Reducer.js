const Reducer = (state, action) => {
    switch (action.type) {
    case "LOG_IN":
        return {
          user: action.payload,
        };
    case "LOG_OUT":
      return {
         user: null,
        }
    case "FOLLOW":
        return {
          user: {
            ...state.user,
            followings: [...state.user.followings, action.payload],
          },
        };
    case "UNFOLLOW":
        return {
          user: {
            ...state.user,
            followings: state.user.followings.filter(
              (following) => following !== action.payload
            ),
          },
        };
    case "ADDFRIEND":
      return {
        user: {
          ...state.user,
          friends: [...state.user.friends, action.payload],
        },
      };   
    case "UNFRIEND":
      return {
        user: {
          ...state.user,
          friends: state.user.friends.filter(
            (friend) => friend !== action.payload
          ),
        },
      }; 
    case "UPDATE_PROFILE":
        return {
          user: {
            ...state.user,
            city: action.payload.city,
            from: action.payload.from,
            avatar: action.payload.avatar,
            background: action.payload.background
          },
        };
    default:
        return state;
    }
  };
  
  export default Reducer;