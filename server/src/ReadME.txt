Authantication:
-> Controllers: Regestration | Login | Change Password | Update Profile | Get User | Logout |Delete User
-> Middleware: Auth | Validate Middleware
-> User Model has: Name, Email, Password, Avatar, isOnline, Lastseen
-> Validators: user Validator

flow:
Validators/user.Validatator.ts has code to check the user provided details, like Password, username must these number of characters
Middleware/auth used to check the logged in user or not
Middleware/Validate is used to run the Validatator function from the Validatator.ts
then Controllers

API example: router.post("/register",#Middleware which is Validator(FunctionFromValidator.ts), RegisterController);


Room Design: Used to create an chat room between the two people or a group

model has: type-what kind of chat either direct(between 2) or a group(N number of users)
            Members -> to add Members
            Name -> Optional field to give name if its a group

Controllers: Create Room
create room: take the details form the user, which are type: the type of the chat either direct, or group, then Members: which are userIds, and then name: Optional, it it's an group room then it's needed
2) find the user does is he precent in the db or not, if not raise error to login
3) find the room with userid and Members match
4) if exists return other wide create new with details

