import React, { Component } from 'react';
import {Router, navigate} from '@reach/router'
import firebase from './Firebase';

import Home from './Home';
import Navigation from './Navigation';
import Login from './Login';
import Settings from './Settings';
import Meals from './Meals';
import Register from './Register';
import Manage from './Manage'

class App extends Component {
  state={
    user: null,
    displayName: null,
    userID: null,
    users: [],
    manager: false,
    startDate: '', 
    endDate: '', 
    startTime: '', 
    endTime: '',
  }
  
  componentDidMount(){
    //get the currently signed-in user
    firebase.auth().onAuthStateChanged(FBUser =>{
      if(FBUser){
        this.setState({
          user: FBUser,
          displayName: FBUser.displayName,
          userID: FBUser.uid,
          manager: (FBUser.email==='daseif7@gmail.com' || FBUser.email==='xrao@163.com')          
        })
        //generate a list of current user's meals, the filters are null at the beginning
        const {startDate, endDate, startTime, endTime} = this.state
        this.generateMeals(FBUser.uid, startDate, endDate, startTime, endTime)
        //listen for changes on adding/deleting user accounts, and create a list of all users
        const userRef = firebase.database().ref('users')
        userRef.on('value', snapshot => {
          let users = snapshot.val();
          let userList = []
          for(let user in users){
            userList.push({
              userName: users[user].userName,
              userEmail: users[user].userEmail,
              userID: user,
              userPassword: users[user].userPassword,
              manager: users[user].manager,
              userBudget: users[user].userBudget,
            })
          }
          //save the list of users and current user's calorie budget to the state
          this.setState({
            users: userList,
            userBudget: users[FBUser.uid]? users[FBUser.uid].userBudget: null,
          })
        })
        const budget = firebase.database().ref('users/'+FBUser.uid+'/userBudget')
        budget.on('value', snapshot =>{
          this.setState({
            userBudget: snapshot.val()
          })
        })
      } else {
        this.setState({user: null})
      }
    })
  }
  //update newly registered user's profile
  registerUser=(registrationInfo)=>{
    //get the newly registered user
    const FBUser = firebase.auth().currentUser;
    //update user's profile displayname
    FBUser.updateProfile({
      displayName: registrationInfo.displayName
    })
      .then(()=>{
        console.log('profile upgraded')
        //update new user's info to firebase's datebase
        const ref = firebase.database().ref(`users/${FBUser.uid}`)
        //set new user's default calorie budget to 1500, save other info like user name, email, password and manager status to the database
        ref.set({
          userBudget: 1500,
          userName: registrationInfo.displayName,
          userEmail: FBUser.email,
          userPassword: registrationInfo.password,
          manager: false,
        })
        //also save user's info to the state
        this.setState({
          user: FBUser,
          displayName: registrationInfo.displayName,
          userID: FBUser.uid,
          userBudget: 1500,
        })
        //manager and admin will be directed to the manage page, while regular user will be directed to their list of meals
        if(FBUser.email==='daseif7@gmail.com' || FBUser.email==='xrao@163.com'){
          navigate('/manage')
        }else{
          navigate('/meals/'+FBUser.uid)
        }
      })
      .catch(()=>{
        console.log('fail to upgrade')
      })
  } 
  //update the filters for dates and times, and generate a new list of meals 
  generateMeals=(whichUser, startDate, endDate, startTime, endTime)=>{
    //save the filter criteria to the state
    this.setState({startDate, endDate, startTime, endTime}, ()=>{
      const mealsRef = firebase
        .database()
        .ref('users/'+whichUser+'/meals').orderByChild('mealInfo/mealDate').limitToLast(10);
      //listen for changes on current user's meals
      mealsRef.on('value', snapshot => {
        let meals = snapshot.val();
        let mealsList = []
        for(let item in meals) {
          mealsList.push({
            mealID: item,
            mealInfo: meals[item].mealInfo,
          })
        }
        //sort the meals by date and time in descending order
        mealsList = mealsList.sort((b,a)=>{
          if(a.mealInfo.mealDate===b.mealInfo.mealDate){
            return +a.mealInfo.mealTime.split(':').join('') - +b.mealInfo.mealTime.split(':').join('')
          } else {
            return +a.mealInfo.mealDate.split('-').join('') - +b.mealInfo.mealDate.split('-').join('')
          }
        })
        //calculate each date's total calories 
        const greenDays = {}
        mealsList.forEach(i=>{
          const mealDate=i.mealInfo.mealDate
          if(greenDays[mealDate]){
            greenDays[mealDate]+= +i.mealInfo.mealCal
          }else{
            greenDays[mealDate] = +i.mealInfo.mealCal
          }
        })
        //get the start & end dates/times from the state to filter the meals
        let {startDate, endDate, startTime, endTime} = this.state
        startDate= +startDate.split('-').join('')
        endDate= +endDate.split('-').join('')
        startTime = +startTime.split(':').join('')
        endTime = +endTime.split(':').join('')  
        //arr will be the new list of meals after filtering  
        let arr=mealsList.slice()
        if(startDate){
          arr = arr.filter(i=>{
            const date = +i.mealInfo.mealDate.split('-').join('')
            return date<=endDate && date>=startDate
          })
        }
        if(startTime){
          arr = arr.filter(i=>{
            const time = +i.mealInfo.mealTime.split(':').join('')
            return time<=endTime && time>=startTime
          })      
        }
        this.setState({
          meals: mealsList,
          greenDays: greenDays,
          filteredMeals: arr,     
        })
      })      
    })
  }
  //log out user and clear the state
  logOutUser=(e)=>{
    e.preventDefault();
    this.setState({
      user: null,
      displayName: null,
      userID:  null,
      users: [],
      meals: [],
      manager:false,
      filteredMeals:null,
      greenDays: {},
      userBudget: 0,
    })
    firebase.auth().signOut().then(()=>{
      navigate('/')
      console.log('log out properly')
    }).catch(()=>{
      console.log('fail to log out')
    })
  }   

  render() {
    return (
      <div>
        <Navigation 
          user={this.state.user}
          logOutUser={this.logOutUser}
          manager={this.state.manager}
        />              
        <Router>
          <Home path="/" 
            user={this.state.user}
            manager={this.state.manager}
          />
          <Login path="/login" />
          <Manage path="/manage/:userID" 
            users={this.state.users}
            currentUser={this.state.user}
            generateMeals={this.generateMeals}
            />
          <Settings path="/settings/:userID"
          />
          <Meals path="/meals/:userID" 
            meals={this.state.filteredMeals}
            users={this.state.users}
            generateMeals={this.generateMeals}
            greenDays={this.state.greenDays}
            userBudget={this.state.userBudget}
            currentUser={this.state.user}
          />
          <Register path="/register" registerUser={this.registerUser}/>
        </Router>                 
      </div>
    );
  }
}

export default App;
