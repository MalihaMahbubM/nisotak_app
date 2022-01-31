import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated:props.isAuthenticated?.length > 0 | false,
            role:props.role,
        }
    }

    onLogout() {
        localStorage.setItem("access_token","")
        localStorage.setItem("user_role","")
    }

    /**
     * This Navbar has Home, and Logout. It is for Basic Users
     * *NOTE* - There is no such thing as a "base user". Admin, Author, and Editor are the only roles that can
     * interact with the teacher app. Why the read-only user role is revealed here is a mystery to me - fbw.
     * @return {JSX.Element}
     */
    baseNavbar(){
        return (
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                <Link to="/" className="navbar-brand">
                    Nisotak Teacher Tool
                </Link>
                {this.state.role !== "" &&
                    <Link to="/login" className="text-white small mr-2" onClick={() => {
                        this.setState({isAuthenticated: false, role: ""});
                        this.onLogout();
                    }}>
                        Logout
                    </Link>
                }
            </nav>

        );
    }

    /**
     * This Navbar has Home, Language Management, User Management, Request Management, and Logout. It is for Admin Users
     * @return {JSX.Element}
     */
    adminNavbar(){
        return(
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                <Link to="/" className="navbar-brand">
                    Nisotak Teacher Tool
                </Link>
                <Link to="/usersManagement" className="text-white small mr-1">
                    Manage Users
                </Link>
                <Link to="/requestsManagement" className="text-white small mr-2">
                    Manage Requests
                </Link>
                <Link to="/languageManagement" className="text-white small mr-3">
                    Manage Languages
                </Link>
                <Link to="/login" className="text-white small mr-4" onClick={() => {
                    this.setState({isAuthenticated:false, role:""});
                    this.onLogout();
                }}>
                    Logout
                </Link>
            </nav>
        )
    }

    /**
     * This Navbar has Home, Language Management, and Logout. It is for Author and Editor Users
     * @return {JSX.Element}
     */
    privilegedNavbar(){
        return(
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                <Link to="/" className="navbar-brand">
                    Nisotak Teacher Tool
                </Link>
                <Link to="/languageManagement" className="text-white small mr-3">
                    Manage Languages
                </Link>
                <Link to="/login" className="text-white small mr-4" onClick={() => {
                    this.setState({isAuthenticated:false, role:""});
                    this.onLogout();
                }}>
                    Logout
                </Link>
            </nav>
        )
    }

    render() {
        let role =this.state.role;
    if (!this.state.isAuthenticated){
        return this.baseNavbar();
    } else if(role === 'admin'){
        return this.adminNavbar()
    } else if (role === 'author' || role === 'editor'){
      return this.privilegedNavbar();
    } else {
        return this.baseNavbar()
    }
  }
}
