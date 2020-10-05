import React, {Component} from 'react';
import firebase from './Firebase';

import MealsList from './MealsList'
import { MdAddCircleOutline } from "react-icons/md";
import { FaCalendarAlt, FaRegClock, FaUtensils } from "react-icons/fa";


class Meals extends Component {
  state={
    mealInfo:{
      startDate:'',
      endDate:'',
      startTime:'',
      endTime:'',      
      mealName: '',
      mealCal:'',
      mealDate: '',
      mealTime: '',
    }
  }
  //
  componentDidMount(){
    this.props.generateMeals(this.props.userID, '','','','')
    const {startDate, endDate, startTime, endTime} = this.state
    if(startDate!=='' || endDate!=='' || startTime!=='' || endTime!==''){
      this.setState({
        startDate:'',
        endDate:'',
        startTime:'',
        endTime:'',
      })
    }
  }

  handleChange= (e) =>{
    const itemName = e.target.name;
    const itemValue = e.target.value;
    this.setState(prevState=>({
      mealInfo:{
          ...prevState.mealInfo,
          [itemName]: itemValue
      }
    }))
  }

  handleFilterChange = (e) =>{
    const itemName = e.target.name;
    const itemValue = e.target.value;
    this.setState({[itemName]: itemValue})
  }

  handleSubmit=(e)=>{
    e.preventDefault();
    const ref = firebase
      .database()
      .ref(`users/${this.props.userID}/meals`);
      ref.push({mealInfo: this.state.mealInfo})

    this.setState({mealInfo:{
      mealName: '',
      mealCal:'',
      mealDate: '',
      mealTime: '',
    }}); //empty the input box
  }

  submitFilters=(e)=>{
    e.preventDefault();
    const {startDate, endDate, startTime, endTime} = this.state
    this.props.generateMeals(this.props.userID, startDate, endDate, startTime, endTime)
  }

  render(){
    const mealsOwner=this.props.users.filter(i=>i.userID===this.props.userID)
    return(
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <h2 className="font-weight-light"> Comidas de  {this.props.users.length>0 ? (mealsOwner[0] && mealsOwner[0].userName): (
              this.props.currentUser && this.props.currentUser.displayName
            )}</h2>
            {(this.props.meals && this.props.meals.length===0) && (<p className="text-info"><small>Usted no tiene comidas registradas aún</small></p>)}

            <button className="btn btn-primary mb-3" type="button" data-toggle="collapse" data-target="#collapseAddMeal" aria-expanded="false" aria-controls="collapseAddMeal">
              <span><MdAddCircleOutline/></span> Añadir comida
            </button>
            <div className="collapse" id="collapseAddMeal">
              <div className="card bg-light mb-3">
                <div className="card-body text-center p-3">
                  <form
                    onSubmit={this.handleSubmit}
                  >
                    <div className="form-row">
                      <div className="col-sm-8 input-group">
                        <input 
                          className="form-control" 
                          type="text" 
                          placeholder="Nombre de la comida" 
                          name="mealName"
                          value={this.state.mealInfo.mealName}
                          onChange={this.handleChange}
                          required/>
                        <div className="input-group-append">
                          <span className="input-group-text bg-light">
                            <FaUtensils />
                          </span>
                        </div>                        
                      </div>
                      <div className="col-sm-4 input-group mt-3 mt-sm-auto">
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          name="mealCal"
                          placeholder="100"
                          value={this.state.mealInfo.mealCal}
                          onChange={this.handleChange}
                          required
                        />
                        <div className="input-group-append">
                          <span className="input-group-text bg-light">Calorias</span>
                        </div>
                      </div>
                    </div>
                    <div className="form-row mt-3">
                      <div className="col-6 input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text bg-light">
                            <FaCalendarAlt />
                          </span>
                        </div>                           
                          <input 
                            className="form-control" 
                            type="date" 
                            placeholder="" 
                            name="mealDate"
                            value={this.state.mealInfo.mealDate}
                            onChange={this.handleChange}
                            required/>                         
                      </div>          
                      <div className="col-6 input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text bg-light">
                              <FaRegClock />
                            </span>
                        </div>                         
                        <input 
                            className="form-control" 
                            type="time" 
                            placeholder="" 
                            name="mealTime"
                            value={this.state.mealInfo.mealTime}
                            onChange={this.handleChange}
                            required/>                         
                      </div>                                    
                    </div>
                    <div className="form-row justify-content-end">
                      <button
                        type="submit"
                        className="btn btn-info mt-3 align-content-end"
                      >
                        Añadir comida
                      </button>                     
                    </div>                   
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="col col-md-8 text-center">
            <div className="card rounded-0">
              {this.props.meals && this.props.meals.length? (
                <div>
                  <div className="card-body row">
                    <form className="col-md-6" onSubmit={this.submitFilters}>
                      <div className="form-row mb-3">
                        <div className="form-group col-sm-6 text-left">
                          <label className="font-weight-bolder" htmlFor="startDate">Hora de Inicio</label>
                          <input 
                            type="date" 
                            id="startDate" 
                            required 
                            className="form-control"
                            name="startDate"
                            onChange={this.handleFilterChange}
                          />      
                        </div>
                        <div className="form-group col-sm-6 text-left">
                          <label className="font-weight-bolder" htmlFor="endDate">Hora final</label>
                          <input 
                            type="date" 
                            required 
                            id="endDate" 
                            className="form-control"
                            name="endDate"
                            onChange={this.handleFilterChange}
                          />
                        </div>
                        <button className="btn btn-secondary">Filtrar por fecha</button>
                      </div>
                    </form>
                    <form className="col-md-6" onSubmit={this.submitFilters}>
                      <div className="form-row">
                        <div className="form-group col-sm-6 text-left">
                          <label className="font-weight-bolder" htmlFor="startTime">Feha de inicio</label>
                          <input 
                            type="time" 
                            id="startTime" 
                            required 
                            className="form-control"
                            name="startTime"
                            onChange={this.handleFilterChange}
                          />      
                        </div>
                        <div className="form-group col-sm-6 text-left">
                          <label className="font-weight-bolder" htmlFor="endtime">Fecha de fin</label>
                          <input 
                            type="time" 
                            required 
                            id="endtime" 
                            className="form-control"
                            name="endTime"
                            onChange={this.handleFilterChange}
                          />
                        </div>
                        <button className="btn btn-secondary">Filtrar por horas</button>
                      </div>
                    </form>
                  </div>                  
                  <table className="table table-sm card-body mb-0">
                    <thead>
                      <tr>
                        <th scope="col">Comidas</th>
                        <th scope="col">Calorias</th>
                        <th scope="col">Fecha</th>
                        <th scope="col">Hora</th>
                        <th scope="col">Editar</th>
                      </tr>
                    </thead>
                      <MealsList 
                        meals={this.props.meals} 
                        userID={this.props.userID}
                        greenDays={this.props.greenDays}
                        userBudget={this.props.userBudget}
                      />                      
                  </table>
                </div>
              ) : null }
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default Meals;