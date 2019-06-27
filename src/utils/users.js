const users = [];
// addUser, removeUser , getuser , getUsersInRoom

    const addUser = ({id,username,room})=>{
        //clean the data
        username = username.trim().toLowercase();
        room = room.trim().toLowercase();

        //validation
        if(!username || !room){
            return {'error':'Username and room are required'}
        }

        // check for existing user
        const existingUser = users.find((user)=>{
            return user.room == room && user.username ==username;
        });
    }