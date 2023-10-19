## CREATE REACT APP USING VITE IN client FOLDER
## INSTALL TAILWIND CSS FOR REACT
## CREATING PAGES AND ROUTES
- src/ -> create dir /pages/ ...
## INSTALL react-router-dom PACKAGE
## SETUP ROUTES
- Inside app.jsx ,wrap app with BrowserRouter and Routes > creates Routes
    for each page
## CREATE HEADER component 
- Link used from react-router-dom
## CREATING SERVER
- install express, nodemon, set server, create express app and mount to server, create router mount
    to app
## CONNECTIG TO DATABASE
- install mongoose, create project in mongodb(paraschand5815 LjsQrlx5ScTiqYt7), connect project to mongodb (at express app at top), create .env.local(install dotenv) 

## CREATE MODELS FOR DATABSE
- creating obj of mongoose.Schema({})
## CREATE ROUTE HANDLERS(API'S)
## HANDELING SIGN IN 
- get data from route, add to database in controller using usermodel(decrypt psw using bcryptjs)

## PASS DATA TO SIGN-IN ROUTE FROM SIGN UP PAGE
- simply using form handling in react 
    - add proxy 
- navigate to sign-in on successful adding user

## CREATE SIGN IN API
- get {email,password} , search for email in validUser =  User.getOne
- using bcrypt.compareSync(password,validUser.password) 
- If any not found create error for them and pass to error handler else 
    -> add cookie to browser by hashing/create token(use jwt)  > npm i jsonwebtoken
    -> token = jwt.sign({id:validUser._id},process.env.JWT_SECRET)
    
## CREATE SIGN IN PAGE 
- similar to sign up one few changes

## ADDING REDUX TOOLKIT TO OUR APP
- so that we can store and update state from redux-store in our entire application
- goto redux toolkit site in quick start section to setup (install and more)
    - install @redux/toolkit and react-redux 
    - create redux/store.js
    - create a redux reducers/slice(eg userSlice)
    - add slice to redux store
    - provide redux-store to react(wrap app with store using Provider)
    - NOW in the any page import useDispatch and useSelector, 
        > create dispatch = useDispatch() -> to store state
        > useSelector((state)=>{})     -> to get state from store
    - also import all functions from slice and use them using dispatch
- add chrome extension redux to see working


## ADDING REDUX PERSIST 
- Our login info was being erased while refresing page, we need to store it in localstorage 
- We dont do it manually instead use redux-persist
 1) npm i redux-persist
 2) create rootReducer using combineReducers({}) ->import from @redux/toolkit
 3) create persistedReducer using persistReducer(persistConfig, rootReducer) -> import from 'redux-persist'
    - create persistConfig ={
        key:'root',
        storage,
        version:1
        }
    - import storage from 'redux-persist/lib/storage'
 4) add persistedReducer to reducer : in store
 5) export const persistor = persistStore(store) ->import persistStore from 'redux-persist'
 6) in main.jsx
    - import {persistor} from store , PersistGate from 'redux-persist/integration/react'
    - Wrap app with <PersistGate loading={null} persistor={persistor}>


## ADD GOOGLE OAUTH FUNCTIONALITY
- create OAuth component and add after button in sign-in/up page
- create button > onClick={handleGoogleClick}, async func 
- goto firebase google, create account, create new project(remove google analytics for now),
   choose</>, install firebase
- use mdk in seperate file src/firebase.js -> export it and also add apiKey to .env  
- continue to console > build > authentication >getstarted > fillform done
- CREATE provider = new GoogleAuthProvider(),auth = getAuth(app) and result = await signInWithPopup(auth,provider) inside try of func -> import 'firebase/auth' & app from '../firebase'
- In result we get a lot -> look .user (displayName,photoURL,email,...)
- now use the info to store into dbase using endpoint/route eg api/auth/google


## UPDATE THE HEADER AND MAKE THE PROFILE PAGE PRIVATE
- get currentUser form state.user in redux store(if exist display pp currentUser.avatar else sign in link)
- NOW FOR PRIVATE ROUTE - create PrivateRoute comp, and wrap Profile with that route element
- In PrivateRoute, use useSelector,Outlet and Navigate
     to get currentUser and either show child or Navigate to Profile

## COMPLETE IMAGE UPLOAD FUNCTIONALITY OF PROFILE PAGE
- make fileupload input and using useRef connect to image(and hide that input tag)
        <input type='file' ref={fileRef} hidden accept='image/*' onChange={(e)=>setFile(e.target.files[0])} />
<!-- - add uploader middleware under middleware/ folder that exports 'uploader' using 'multer' package -->
- we aren't going to use multer here instead we'll use firebase
    -> build/storage/getstarted/done 
    | rules -> allow read;
     allow write: if request.resource.size < 2*1024*1024 && request.resource.contentType.matches('image/.*')

- make a 'file' state useState var to add details into it when we upload to use later inserting dbase
- now we'll use useEffect hook, if any changes in file we'll upload file (using firebase functions in custom function handleFileUploader)
- make <p>under img to show upload perc & succ msg or err msg </p>

## UPDATE USER - API ROUTE
- user/user.router.js > router.post('update/:id',verifyToken,updateUser); 
- user.controller.js -> userUpdate(){} |  utils/verifyToken()

- npm i cookie-parser > express.config.js-> import cookieParasr & after req parsing / app.use(cookieParser())

## COMPLETE USER UPDATE FUNCTIONALITY
- add onChange in username and email, add onSubmit on form 
- we'll add 3 more reducers for userUpdate page also
- Then we use these reducers to dispatch updated 

## DELETE USER FUNCTIONALITY
- add delete route to user.router.js and make deleteUser func in controller
- add onClick handleDeleteUser in delete button also add 3 reducers for deleteUser


## SIGN OUT USER FUNCTIONALITY
- create route'/signout' in auth.router.js
- in signOut middleware just clear the cookie 

- frontend/pages/Profile.jsx > in signout bth add onClick={handleSignOut}
- add 3 reducers here too for signout and dispatch in Profile.jsx


## LISTING...
## ADD '/create' LISTING API ROUTE 
- Create listing component with 'listing' route
- now make 'create' route 
- make listing model for database store
    - creating obj of mongoose.Schema({}) class and mongoose.model(name,schema) method
    - fields name,description,address,regularPrice,discountPrice,bathrooms,bedrooms,furnished,
        parking,type,offer,imageUrls,userRef
- use the model in createListing controller midd. to create and add listing data to db
