export const initialState = {
    user: null, 
    courses: [],
    files: [],
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
                courses: [...action.payload]
            };
        case 'RESET_COURSES':
            return {
                ...state,
                courses: []
            };
        case 'SET_FILES':
            return {
                ...state,
                files: [...action.payload]
            };
        case 'RESET_FILES':
            return {
                ...state,
                files: []
            };
        case 'LOGOUT':
            return { ...state, user: null };
        default:
            return state;
    }
}
  