import React, {Component} from 'react';
import firebase from './Firebase';

import FormError from './FormError'

//Register new user
class Register extends Component {
  state={
    displayName:'',
    email:'',
    passOne:'',
    passTwo:'',
    errorMessage: null
  }
  //updates changes in the input boxes to the state 
  handleChange= (e) =>{
    const itemName = e.target.name;
    const itemValue = e.target.value;
    this.setState({[itemName]: itemValue})
  }
  //submit new user info to firebase auth
  handleSubmit=(e)=>{
    e.preventDefault();
    if(this.state.passOne===this.state.passTwo){
      const registrationInfo = {
        displayName: this.state.displayName,
        email: this.state.email,
        password: this.state.passOne
      }
      firebase.auth().createUserWithEmailAndPassword(
        registrationInfo.email,
        registrationInfo.password
      )
      .then(()=>{
        this.props.registerUser(registrationInfo)
      })
      .catch(error=>{
        if(error.message !== null){
          this.setState({errorMessage: error.message})
        }else{
          this.setState({errorMessage: null})
        }
      })
    } else {
      this.setState({errorMessage: 'Passwords not match'})
    }
  }
  render(){
      return(
        <form className="mt-3" onSubmit={this.handleSubmit}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card bg-light">
                <div className="card-body">
                  <h3 className="font-weight-light mb-3">Registrarse</h3>
                  <div className="form-row">
                  {/*if there is an error during register, show this customized warning message */}
                    { this.state.errorMessage !==null? (
                      <FormError theMessage={this.state.errorMessage} />
                    ): null}
                    <section className="col-sm-12 form-group">
                      <label
                        className="form-control-label sr-only"
                        htmlFor="displayName"
                      >
                           Nombre de usuario
                          </label>
                      <input
                        className="form-control"
                        type="text"
                        id="displayName"
                        placeholder="Nombre de Usuario"
                        name="displayName"
                        required
                        value={this.state.displayName}
                        onChange={this.handleChange}
                      />
                    </section>
                  </div>
                  <section className="form-group">
                    <label
                      className="form-control-label sr-only"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      className="form-control"
                      type="email"
                      id="email"
                      placeholder="Email"
                      required
                      name="email"
                      value={this.state.email}
                      onChange={this.handleChange}
                    />
                  </section>
                  <div className="form-row">
                    <section className="col-sm-6 form-group">
                      <input
                        className="form-control"
                        type="password"
                        name="passOne"
                        placeholder="Contraseña"
                        value={this.state.passOne}
                        onChange={this.handleChange}
                      />
                    </section>
                    <section className="col-sm-6 form-group">
                      <input
                        className="form-control"
                        type="password"
                        required
                        name="passTwo"
                        placeholder="Repetir Contraseña"
                        value={this.state.passTwo}
                        onChange={this.handleChange}
                      />
                    </section>
                  </div>
                  <div className="form-group text-right mb-0">
                    <button className="btn btn-primary" type="submit">
                      Registrar
                
    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      )
  }
}

export default Register;