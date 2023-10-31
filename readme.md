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


## COMPLETE LISTING PAGE UI
- make '/create-listing' <Link> in profile page
- make CreateListing.jsx page and add private route to this page from App.jsx
- make create listing UI

## COMPLETE UPLOAD LISTING IMAGES FUNCTIONALITY
- add onChange on choosefiles , we'll put files in a state
- add onClick on upload , we'll store images in firebase which will returl downloadURL/s
- Then we'll add loading effect and error/if any below 'UPLOAD' button
    - We'll show uploaded images if uploaded in place of error
    - We'll add delete functionality if clicked after uploading
    - For loading effect we'll add another state


## COMPLETE CREATE-LISTING PAGE FUNCTIONALITY
- add other inputs to formData 
- add onChange eventListoner to each input, also set their values & checked status
- create handleChange function for different kind of input 
- Now add 'onSubmit' event listioner to form
    - now send also add useRef to req.body to know which person is creating


- Different conditions on page
    - listing shouldn't be created without uploading any image,
    - discount price < regular price,
    - !! If we have offer we should see discount price input,
    - disable create listing button while creating list or uploading image
    - IF it's sell checked we should not see $/month in price
    - after creating listing redirect to listing/[_id] dynamic page



## Create get user listings API route
- src/app/listing/listing.router.js _ create route '/:id'
- in controller function check if user is getting own listing
    - if soo get the listings 

## Complete show listings functionality in Profile page
- create Show listings button
- add onClick _ function will fetch data from api we created before and save data in userListings state
- use the state to display data below that button in profile page

## Complete delete user listing functionality
- create /listing/delete/:id API route
    - get :id search for listing in Listings ,if authenicated and if exist delete it
- add onClick on delete button on Client side, call route above with id of listing
    - if any error occurs console.log for now 
    - for success response update 'userListings' state we've created before

## Create update listing API route
- create /listing/update/:id route
    - handle error like invalidID, listing not found, can update own listings only
    - update listing using findByIdAndUpdate()


## Complete Update listing functionality
- create NEW page components/pages/UpdateListing.jsx   _ UI is same as create listing page
- add page to private route
- wrap EDIT button on profile page with <Link to={`update-listing/${listing._id}`}\>
- fetch the listing data based on the parameter in URL
    - we'll use useEffect hook for that _ make async fetchListing func. inside and call
    - to get URL use hook 'useParams' from 'react-router-dom'
    - NOW create API route to get Information using that listingId
    - fetch listing using listingId from that API
    - set 'formData' state to the data we get
- NOW instead of Creating on submit , modify to call update listing API on click to Update Listing button



## Creating the listing page UI
- create Listing.jsx component 
- add dynamic route to App.jsx, isn't a private one
- in Listing.jsx _ get listing using ID and useEffect()
- set state to store listing, loading, error and display accordingly 

    -  Display images in slider 
        - install 'swiper' in frontend 
        - use it to create slider 
    
    - completing listing page UI
        - look for the data available in listing and create UI using those

# Adding contact landlord part functionality to listing page
- make the button seen to only other than owner
- copy address of page, signout and login different user goto that address / button seen
- add[contact,setContact] such that when 'contact' btn is clicked state becomes true and 
    - button disappear 
    - another form with send message appear
        - make it <Contact listing={listing}/> component
        - Get landlord info sending listing.userRef to getUser route, route is verified one
        - use that info to create contact component
        - make <Link to={`mailto:${landlord?.email}?subject=Regarding ${listing?.name}&body=${message}`}>Send message</Link>
            - will activate mailsystem in windows



# Search functionality 

* Create search API route
- listings/listing.router.js/  _ .get('/get',getListings)
- in getListings we receive different queries as req.query._ 
    - receive all queries 
    - Then find listings using $regx with searchTerm in name and other fields  as given
    - we can also sort ,limit and skip few index of them using buildin functions and given values
    - return this listing to user
- API is ready to be used we need to pass necessary query conditions in URL now 


* Complete Header form search functionality
- when we write on search box and enter OR click search icon, URL should change with searchTerm 
- components/Header.jsx
    - track changes on input with a searchTerm state
    - add handleSubmit where we'll modify/update URL TO form onSubmit and button onClick

    - Also change in searchTerm in URL we'll reflect to input using useEffect()