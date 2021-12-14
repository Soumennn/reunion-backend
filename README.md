# BACKEND FOR REUNION-SOCIAL MEDIA API

Here, in this documentation, instructions will be provided for :
1) Getting a user token from email and password (Login).
2) Following and unfollowing any user.
3) Getting the profile of the authenticated user.
4) Adding a new post by the authenticated user.
5) Deleting a post created by the authenticated user.
6) Liking and unliking a post created by the authenticated user.
7) Commenting on a post.
8) Showing a particular post.
9) Showing all posts


## For user registration 

const userPassword = req.body.password;\
const hashedPassword = await bcrypt.hash(userPassword, 10);\

<!--  console.log(req.body);
 console.log( hashedPassword ); -->
            

const userdetails = {\
            fname: "Soumen",\
            lname: "Nath",\
            email: req.body.email.toLowerCase(),\
            password: hashedPassword\
        }

const createdUser = new User(userdetails);\

const tokenData = {\
            user_id: createdUser._id,\
            email: req.body.email.toLowerCase(),\
        }

const gen_token =  jwt.sign(tokenData,process.env.TOKEN_SECRET_KEY);\
<!-- console.log("jwt token: " + gen_token); -->

createdUser.token = gen_token;\
await createdUser.save();\
        

res.status(200).send({\
    "Response":"credentials received & user has been created",\
    "Usercreated":createdUser\
});

## Sample data inorder to test the APIs

### Dummy user credentials:
**User1**
Input parameters:
- email: linkinpark@gmail.com
- password: chester

**User2**
Input parameters:
- email: johnmayer@gmail.com
- password: john

**User3**
Input parameters:
- email: soumen@gmail.com
- password: soumen

### Posts with ids
- 61b7b2627c4744ffd6af75fa
- 61b7b49871e0f1d1b198bf93
- 61b830bb2012ae8d93e768b5


## API Endpoints

#### POST /api/authenticate

 Perform user authentication and return a JWT token.
- INPUT: Email, Password
- RETURN: JWT token
    
   
    
####  POST /api/follow/{id} 
Authenticated user would follow user with {id}

#### POST /api/unfollow/{id} 
Authenticated user would unfollow a user with {id}

####  GET /api/user 
 Authenticate the request and return the respective user profile returning 
- User Name, number of followers & followings.

####  POST api/posts/ 
Add a new post created by the authenticated user.
- Input: Title, Description
- RETURNING: Post-ID, Title, Description, Created Time(UTC).

####  DELETE api/posts/{id} 
Delete post with {id} created by the authenticated user.

####  POST /api/like/{id} 
Like the post with {id} by the authenticated user.

####  POST /api/unlike/{id} 
Unlike the post with {id} by the authenticated user.

####  POST /api/comment/{id} 
Add comment for post with {id} by the authenticated user.
- Input: Comment
- Return: Comment-ID

####  GET api/posts/{id} 
Return a single post with {id} populated with its number of likes and comments

####  GET /api/all_posts 
Return all posts created by authenticated user sorted by post time.
For each post return the following values
- id: ID of the post
- title: Title of the post
- desc: Description of the post
- created_at: Date and time when the post was created
- comments: Array of comments, for the particular post
- likes: Number of likes for the particular post


--------------------------------------------------------------------