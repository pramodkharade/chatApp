const users = [];
// addUser, removeUser , getuser , getUsersInRoom

const addUser = ({ id, username, room }) => {
    //clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //validation
    if (!username || !room) {
        return { 'error': 'Username and room are required' }
    }

    // check for existing user
    const existingUser = users.find((user) => {
        return user.room == room && user.username == username;
    });

    //validate username
    if (existingUser) {
        return {
            "error": "username is in use!"
        }
    }

    //store user
    const user = { id, username, room };
    users.push(user);
    return { user };
}
//  Remove the user by ID
const removeUser = (id)=>{
    const index = users.findIndex((user)=>{
        return user.id== id;
    });
    if(index !==-1){
        users.splice(index,1)[0];
    }
}
