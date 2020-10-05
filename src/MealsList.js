import React, {Component} from 'react';
import firebase from './Firebase'
import $ from 'jquery';

import {GoTrashcan} from 'react-icons/go'
import { FaEdit } from "react-icons/fa";

//create a list of meals for current user
class MealsList extends Component {
    state={
        mealInfo:{
            mealName: '',
            mealCal:'',
            mealDate: '',
            mealTime: '',
        }
    }
    //when toggle open the modal, save input date to the state
    toggleModal=(e, name, cal, date, time)=>{
        e.preventDefault();
        this.setState({
            mealInfo:{
                mealName: name,
                mealCal: cal,
                mealDate: date,
                mealTime: time,
            }
        })
    }
    //update changes in the input box to the state
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
    //update meal's info to firebase's database
    handleSubmit=(e, whichMeal)=>{
        e.preventDefault();
        const ref = firebase
            .database()
            .ref( `users/${this.props.userID}/meals/${whichMeal}/mealInfo`)
        ref.set(this.state.mealInfo)

        $('#'+'Modal'+whichMeal).modal('toggle');
    }
    //delete a meal from the firebase database
    deleteMeal = (e, whichMeal)=>{
        e.preventDefault()
        const ref = firebase
                        .database()
                        .ref( `users/${this.props.userID}/meals/${whichMeal}`)
        ref.remove()
    } 

    render(){
        const {meals, greenDays, userBudget} = this.props;
        const myMeals = meals.map(item=>{
            return(
                <tr key={item.mealID} className={`text-white mb-2 ${greenDays[item.mealInfo.mealDate]<=userBudget? 'bg-success':'bg-danger'}`}>
                    <td className="py-2">{item.mealInfo.mealName}</td>
                    <td className="py-2">{item.mealInfo.mealCal}</td>
                    <td className="py-2">{item.mealInfo.mealDate}</td>
                    <td className="py-2">{item.mealInfo.mealTime}</td>
                    <td className="py-2">
                        <div className="btn-group">
                        <button 
                            className="btn btn-sm btn-outline-secondary btn-light pt-0"
                            data-toggle="modal"
                            data-target={'#'+'Modal'+item.mealID}
                            title="Edit Meal"
                            onClick={e=>this.toggleModal(e, item.mealInfo.mealName,item.mealInfo.mealCal,item.mealInfo.mealDate,item.mealInfo.mealTime)}
                        >
                            <FaEdit />
                        </button>

                        {/*Bootstrap Modal*/}
                        <div className="modal fade" id={'Modal'+item.mealID} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLongTitle">Edita tus comidas</h5>
                                    </div>
                                    <div className="modal-body text-left">
                                        <form id={item.mealID+'form'} onSubmit={e=>this.handleSubmit(e, item.mealID)}>
                                            <div className="form-group">
                                                <label htmlFor={item.mealID+'mealName'}>Nombre</label>
                                                <input 
                                                    className="form-control" 
                                                    type="text" 
                                                    value={this.state.mealInfo.mealName} 
                                                    name="mealName"
                                                    id={item.mealID+'mealName'} 
                                                    onChange={this.handleChange}
                                                    />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor={item.mealID+'mealCal'}>Calorias</label>
                                                <input 
                                                    className="form-control" 
                                                    type="number" 
                                                    min="0"
                                                    value={this.state.mealInfo.mealCal} 
                                                    id={item.mealID+'mealCal'} 
                                                    name="mealCal"
                                                    onChange={this.handleChange}/>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor={item.mealID+'mealDate'}>Fecha</label>
                                                <input 
                                                    className="form-control" 
                                                    type="date" 
                                                    value={this.state.mealInfo.mealDate} 
                                                    id={item.mealID+'mealDate'}
                                                    name="mealDate"
                                                    onChange={this.handleChange}/>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor={item.mealID+'mealTime'}>Hora</label>
                                                <input 
                                                    className="form-control" 
                                                    type="time" 
                                                    value={this.state.mealInfo.mealTime} 
                                                    id={item.mealID+'mealTime'}
                                                    name="mealTime"
                                                    onChange={this.handleChange}/>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                                                <button 
                                                    type="submit" 
                                                    className="btn btn-primary"
                                                >Guardar cambios
                                                </button>
                                            </div>                                            
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>  

                        <button 
                            className="btn btn-sm btn-outline-secondary btn-light pt-0"
                            title="Delete Meal"
                            onClick={e=>this.deleteMeal(e, item.mealID)}
                        >
                            <GoTrashcan />
                        </button>            
                        </div>
                                    
                    </td>                    
                </tr>
            )
        })

        return(
          <tbody>{myMeals}</tbody>
        )
    }
}

export default MealsList;

    