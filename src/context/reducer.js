export const actionType = {
    SET_USER: 'SET_USER',
    STORE_EMPLOYEES: 'STORE_EMPLOYEES',
    STORE_CLIENTS: 'STORE_CLIENTS',
    STORE_TASKS: 'STORE_TASKS',
    STORE_JOBS: 'STORE_JOBS',
    STORE_BLOGS: 'STORE_BLOGS',
    UPDATE_JOBS: 'UPDATE_JOBS',
    STORE_EMPLOYEE_JOBS: 'STORE_EMPLOYEE_JOBS',
    UPDATE_ASSIGNEDJOBS: 'UPDATE_ASSIGNEDJOBS',
    STORE_CHECKIN: 'STORE_CHECKIN',
    STORE_USERS: 'STORE_USERS',
    ADD_BLOG: 'ADD_BLOG',
    STORE_LEAVES: 'STORE_LEAVES',
    UPDATE_LEAVES: 'UPDATE_LEAVES',
    STORE_PROJECTS: 'STORE_PROJECTS',
    STORE_PROJECTEMPLOYEES: 'STORE_PROJECTEMPLOYEES',
    UPDATEUSER: 'UPDATEUSER',
    STORE_SELECTED_TILE: "STORE_SELECTED_TILE",
    STORE_PROJECTSUPERVISORS : "STORE_PROJECTSUPERVISORS",
    STORE_ALLCLIENTS: "STORE_ALLCLIENTS",
    UPDATEEMPLOYEEDATA: "UPDATEEMPLOYEEDATA"
}


const reducer = (state, action) => {
   
    switch (action.type){
        
        case actionType.UPDATEEMPLOYEEDATA:
            return {
                ...state,
                employees: action.payload
            };


        case actionType.STORE_ALLCLIENTS:
            return {
                ...state,
                allclients: action.payload
            };


        case actionType.STORE_PROJECTSUPERVISORS:
            return {
                ...state,
                projectsupervisors: action.payload
            };

     

            


        case actionType.STORE_SELECTED_TILE:
            return {
                ...state,
                selectedtile: action.payload,
            };

        case actionType.ADD_BLOG:
            return {
                ...state,
                blogs:[ ...action.payload, ...state.blogs],
            };
        
            

            case actionType.UPDATE_LEAVES:
                return {
                    ...state,
                    leaves: action.payload
                };

                case actionType.UPDATEUSER:
                return {
                    ...state,
                    user: action.payload
                };

                

                case actionType.STORE_PROJECTS:
                    return {
                        ...state,
                        projects: action.payload
                    };



                case actionType.STORE_PROJECTEMPLOYEES:
                    return {
                        ...state,
                        projectemployees: action.payload
                    };

              
                    

                    
        case actionType.STORE_USERS:
            return {
                ...state,
                users: action.payload
            };
        case actionType.STORE_BLOGS:
      
            return {
                ...state,
                blogs: action.payload
            };

            case actionType.STORE_LEAVES:
                return {
                    ...state,
                    leaves: action.payload
                };
            
        case actionType.SET_USER:
            return {
                ...state,
                user: action.payload
            };
            case actionType.STORE_EMPLOYEES:
                return {
                    ...state,
                    employees: action.payload
                };

                case actionType.STORE_CLIENTS:
                    return {
                        ...state,
                        clients: action.payload
                    };

               
    
                    

                
                    case actionType.STORE_TASKS:
                        return {
                            ...state,
                            tasks: action.payload
                        };
                    
                        case actionType.STORE_JOBS:
                            return {
                                ...state,
                                jobs: action.payload
                            };
                            case actionType.UPDATE_JOBS:
                                return {
                                    ...state,
                                    jobs: action.payload
                                };


                                case actionType.STORE_EMPLOYEE_JOBS:
                                    return {
                                        ...state,
                                        assignedjobs: action.payload
                                    };
                        
                                    case actionType.UPDATE_ASSIGNEDJOBS:
                                        return {
                                            ...state,
                                            assignedjobs: action.payload
                                        };
                            
                                        case actionType.STORE_CHECKIN:
                                            return {
                                                ...state,
                                                checkinstatus: action.payload
                                            };
                                        
                                    
         
            default:
                return state;
    }
  

};

export default reducer;