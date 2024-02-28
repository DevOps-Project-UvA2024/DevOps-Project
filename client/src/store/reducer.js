export const initialState = {
    user: null, 
    courses: null,
    files: null,
  };
  
export function reducer(state, action) {
    switch (action.type) {
        case 'SET_USER_INFO':
            return { 
                ...state, 
                user: action.payload 
            };
        case 'SET_COURSES':
            return {
                ...state,
                courses: action.payload
            };
        case 'LOGOUT':
            return { ...state, user: null };
        default:
            return state;
    }
}
  