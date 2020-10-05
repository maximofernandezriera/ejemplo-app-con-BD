import React, {Component} from 'react';
import firebase from './Firebase'

import FormError from './FormError'
import { FaEdit } from "react-icons/fa";

class Settings extends Component {
  state={
    userBudget:'',
    userName:'',
    userEmail:'',
    userPassword:'',
    updateDisplay: false,
    errorMessage: null,
  }

  componentDidMount(){
    const {userID} = this.props
    const ref=firebase.database().ref(`users/${userID}`)
    ref.on('value', snap=>{
      this.setState({
        userBudget: snap.val().userBudget,
        userName: snap.val().userName,
        userEmail: snap.val().userEmail,
        userPassword: snap.val().userPassword,
      })
    })
  }

  handleChange= (e) =>{
    const itemName = e.target.name;
    const itemValue = e.target.value;
    this.setState({[itemName]: itemValue})
  }  

  handleSubmit=(e)=>{
    e.preventDefault()
    const userID=this.props.userID
    const ref = firebase
    .database()
    .ref( `users/${userID}`)
    ref.update({
      userBudget: this.state.userBudget,
      userName: this.state.userName,
      userEmail: this.state.userEmail,
      userPassword: this.state.userPassword,      
    })     
    
    const user = firebase.auth().currentUser;
    user.updatePassword(this.state.userPassword)
    .then(()=>{
        console.log('change password succesfully!')
        user.updateEmail(this.state.userEmail)
            .then(()=>{
                console.log('change email succesfully!')
                user.updateProfile({
                    displayName: this.state.userName,
                    email: this.state.userEmail,
                })
                .then(()=>{
                    console.log('updated!')
                })
                .catch((error)=>{
                  if(error.message !== null){
                    this.setState({errorMessage: error.message})
                  }
                })
            })
            .catch((error)=>{
              if(error.message !== null){
                this.setState({errorMessage: error.message})
              }
            })
    }).catch((error)=>{
      if(error.message !== null){
        this.setState({errorMessage: error.message})
      }
    })    

    this.setState({
      updateDisplay: true
    })
  }

  render(){
    
    return(
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="text-center mt-4">
              <h2 className="text-primary">Opciones de usuario</h2>
              {this.state.updateDisplay? (
                <div className="col-12 alert alert-success px-3">
                  Updated!
                </div>
              ):null}
              <div className="card">
                <div className="card-body">
                { this.state.errorMessage !==null? (
                      <FormError theMessage={this.state.errorMessage} />): null}    
                  <form className="text-left" onSubmit={this.handleSubmit}>
                    <div className="form-row justify-content-center">
                      <div className="form-group col-sm-8">
                        <label htmlFor="userBudget">Meta Calórica</label>
                        <input 
                          className="form-control" 
                          type="number" 
                          name="userBudget"
                          id="userBudget"
                          value={this.state.userBudget}
                          onChange={this.handleChange}/>      
                      </div>
                    </div>

                    <div className="form-row justify-content-center mt-3">
                      <div className="form-group col-sm-8">
                        <label htmlFor="userBudget">Nombre de usuario</label>
                        
                          <input 
                            className="form-control" 
                            type="text" 
                            name="userName"
                            value={this.state.userName}
                            onChange={this.handleChange}/>                          
                      </div>
                    </div>

                    <div className="form-row justify-content-center mt-3">
                      <div className="form-group col-sm-8">
                        <label htmlFor="userBudget">Correo de usuario</label>
                          <input 
                            className="form-control" 
                            type="email" 
                            name="userEmail"
                            value={this.state.userEmail}
                            onChange={this.handleChange}/> 
                      </div>
                    </div>

                    <div className="form-row justify-content-center mt-3">
                      <div className="form-group col-sm-8">
                        <label htmlFor="userBudget">Password</label>
                        <input 
                          className="form-control" 
                          type="password" 
                          name="userPassword"
                          value={this.state.userPassword}
                          onChange={this.handleChange}/>                   
                      </div>
                    </div>
                    <div className="form-row justify-content-center mt-3">
                      <button className="btn btn-info" type="submit">Salvar</button>
                    </div> 
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}

export default Settings;