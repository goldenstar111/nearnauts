import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { SmallText } from '~/components/common/typography';

const StyledContainer = styled('div')`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
  opacity: ${({ isDisabled }) => (isDisabled ? '50%' : '100%')};

  label {
    line-height: 24px;
    margin-bottom: 10px;
  }

  select {
    padding: 16px 14px;
    border: none;
    border-bottom: var(--lavendar) 1px solid;
    background-color: rgba(var(--periwinkle-base), 0.2);
    outline: none;
    font-family: Comfortaa, 'sans-serif';
    font-size: 16px;
    line-height: 24px;
    color: white;
    overflow: hidden;
  }
  
  option {
	  background-color: #000c10ba;
  }

  .small-text {
    position: absolute;
    bottom: -25px;
    margin: 0;
  }
`;

const Select = ({  labelText, items, setFilterStr }) => {


  return (
    <StyledContainer className="form-group">
      {labelText && <label>{labelText}</label>}
      
      <select name="cars" id="cars" onChange={(e)=>{setFilterStr(e.target.value)}}>
        <option value={""} key={"0"}>{""}</option>
        {items.map(item => (
          <option value={item.value} key={item.value}>{item.title}</option>
        ))}
  		</select>
    </StyledContainer>
  );
};

export default Select;