import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link, useRouteMatch } from 'react-router-dom';

import { NearContext } from '~/contexts';

import { APP } from '~/constants';
import  textlogo  from '~/assets/images/nautslogo.png';

const StyledContainer = styled('div')`
  height: 52px;
  line-height: 52px;
  font-size: 20px;
  font-weight: 300;
  cursor: default;
  user-select: none;

  a {
    color: var(--lavendar);
  }
  .textlogo {
    width: 150px;
    margin-top: -50px;
    margin-left: -20px;
  }
  @media (min-width: 767px) {
    font-size: 30px;
  }

  .logo {
    position: relative;
    width: 128px;
    display: inline-block;
    margin-left: auto;
  }
  @media (max-width: 500px) {
    display: none;
    .logo {
      position: relative;
      width: 128px;
      margin-left: auto;
    }
  }
`;

const Left = () => {
  const isHomePage = useRouteMatch('/')?.isExact;
  const isProfilePage = useRouteMatch('/profile')?.isExact;
  const isGemPage = useRouteMatch('/gem');
  const isGemOriginalPage = useRouteMatch('/gem-original');
  const isNotEnoughBalancePage = useRouteMatch('/not-enough-balance');

  const { user } = useContext(NearContext);

  if (isGemPage || isGemOriginalPage || isNotEnoughBalancePage) {
    return null;
  }

  let toRender;

  if (isHomePage) {
    toRender = <Link to="/" className="logo"><img className="textlogo" src={textlogo} /></Link>;
  } else if (isProfilePage && user?.accountId) {
    toRender = user.accountId;
  } else {
    toRender = <Link to="/" className="logo"><img className="textlogo" src={textlogo} /></Link>;
  }

  return <StyledContainer>{toRender}</StyledContainer>;
};

export default Left;
