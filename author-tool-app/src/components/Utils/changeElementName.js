import React from "react";

export default (elementTypeName, name, onChangeFunction) => {
  return (
    <div className="form-group">
      <label className="font-weight-bold">{elementTypeName} name:</label>
      <input
        type="text"
        required
        className="form-control"
        placeholder={name}
        value={name}
        onChange={onChangeFunction}
      />
    </div>
  );
};
