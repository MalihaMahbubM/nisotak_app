import React from "react";

const LanguageFormCol = (props) => {
    return (
        <div className="form-group col-md-6">
            <label className="font-weight-bold">{props.label}</label>
            <input
                type="text"
                required
                className="form-control"
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}/>
        </div>);
}

export {LanguageFormCol}