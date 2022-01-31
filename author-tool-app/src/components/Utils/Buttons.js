import React from "react";

export const TransparentButton = (props) => {
  return (
    <div className="form-group col-sl-2">
      <button className="btn btn-outline-dark"
              disabled={props.disabled}
              onClick={props.onClick}>
        {props.children}
      </button>
    </div>
  );
};

export const TabbleButton = (props) => {
  return (
    <button
      className="btn btn-outline-dark mr-2"
      id={props.id}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
