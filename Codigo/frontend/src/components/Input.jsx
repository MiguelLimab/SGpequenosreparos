import React from 'react';

const Input = ({ label, name, value, onChange, type = "text", required = false }) => {
  return (
    <>
    <div className="inputDiv">
      <label>{label}:</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="form-input"
      />
    </div>
    </>
  );
};

export default Input;
