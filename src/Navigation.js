import React, {Component} from 'react';
import {Link} from '@reach/router'
import {FaCalculator} from 'react-icons/fa';

class Navigation extends Component {

    render(){
        const {user, logOutUser} = this.props;

        return(
            <nav className="site-nav family-sans navbar navbar-expand-sm bg-dark navbar-dark higher">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">
                    <FaCalculator className="mr-1" /> Contador de Calorías
                </Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <div className="navbar-nav ml-auto">
                        {user && 
                        (
                            <li className="nav-item nav-link disabled text-success font-weight-bold">{user.displayName}</li>
                        )}
                        {(user && this.props.manager) &&
                        (
                            <Link className="nav-item nav-link" to={`manage/${user.uid}`}>
                            Manejar
                            </Link>
                        )}
                        {(user && user.email!=='daseif7@gmail.com' && user.email!=='xrao@163.com') && (
                            <Link className="nav-item nav-link" to={`meals/${user.uid}`}>
                            Comidas
                            </Link>
                        )}
                        {(user && user.email!=='daseif7@gmail.com' && user.email!=='xrao@163.com') && (
                            <Link className="nav-item nav-link" to={`settings/${user.uid}`}>
                            Opciones
                            </Link>
                        )}
                        {!user && (
                            <Link className="nav-item nav-link" to="/login">
                            Log In
                            </Link>
                        )}
                        {!user && (
                            <Link className="nav-item nav-link" to="/register">
                            Registrarse
                            </Link>
                        )}
                        {user && (
                            <Link className="nav-item nav-link" to="" onClick={e=>logOutUser(e)}>
                            Log Out
                            </Link>
                        )}
                    </div>
                </div>

            </div>
            </nav>
        )
    }
}

export default Navigation;