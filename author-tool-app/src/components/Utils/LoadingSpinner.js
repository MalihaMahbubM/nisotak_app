import {Spinner} from "react-bootstrap";
import React, { Component } from "react";

export default class LoadingSpinner extends Component {
    // constructor(props) {
    //     super(props);
    // }

    render(){
        return(
            <div style={{position:'absolute',top:this.props.top,left:this.props.left}}>
                <Spinner animation={"border"} variant={"primary"}/>
            </div>
        )
    }
}