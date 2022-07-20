import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Hamburger from '~/components/common/Hamburger';
import { NearContext } from '~/contexts';

import Dropdown from '~/components/common/Dropdown';
import { Balance } from '~/components/common/utils';

const DropdownBase = ({ handleOnClick, className }) => <Hamburger className={className} onClick={handleOnClick} />; 


const StyledContainer = styled('div')`
  .dropdown-item {
    :first-child {
      margin-top: 17px;
    }

    :last-child {
      margin-bottom: 17px;
    }
  }

  .link-header {
    display: inline-flex;
  }

  .nav__link--dropdown {
    display: block;
    padding: 14px 20px;
    color: var(--lavendar);
    text-decoration: none;
    white-space: nowrap;
  }
  .nav__link--dropdown:hover {
    color: #8686df;
  }

  .ls {
    display: none;
  }
  .link-dropdown {
    display:none;
  }

  @media (max-width: 767px) {
    .link-header {
      display: none;
    }
    .link-dropdown {
      display:flex;
    }
    .ls {
      display: block;
    }
  }
`;

const StartMenu = () => {
  const { user, signIn, signOut, nearContent } = useContext(NearContext);
  const history = useHistory();

  const signOutAction = () => {
    signOut();
  };

  const signInAction = () => {
    signIn();
  };

  const handleMarket = () => {
    history.push('/nautview');
  };

  const handleRank = () => {
    history.push('/rankcheck');
  };

  return (
    <StyledContainer style={{display:'inline-flex'}}>
      <div className="link-header">
        <a href="https://paras.id/collection/nearnautnft.near"  className="nav__link nav__link--dropdown" target="_blank">
           Market
        </a>
        <Link className="nav__link nav__link--dropdown" onClick={() => handleMarket()}>
           Nauts List
        </Link>
        <Link className="nav__link nav__link--dropdown" onClick={()=>handleRank()}>
           Rank Check
        </Link>
        {nearContent?.config?.walletUrl ? (
            <a href={`${nearContent.config.walletUrl}/create`} className="nav__link nav__link--dropdown">Create a NEAR Wallet</a>
          ) : (
            <Link to={'#'}>Create a NEAR Wallet</Link>
          )}
        <Link className="nav__link nav__link--dropdown"  onClick={() => signInAction()}>
           Log in with NEAR
        </Link>
      </div>
      <div className="link-dropdown">
      <Dropdown dropdownBase={DropdownBase} stretchable>
        <a href="https://paras.id/collection/nearnautnft.near"  className="nav__link nav__link--dropdown" target="_blank">
           Market
        </a>
        <Link className="nav__link nav__link--dropdown" onClick={() => handleMarket()}>
           Nauts List
        </Link>
        <Link className="nav__link nav__link--dropdown ls" onClick={()=>handleRank()}>
          Rank Check
        </Link>
        {nearContent?.config?.walletUrl ? (
            <a href={`${nearContent.config.walletUrl}/create`} className="nav__link nav__link--dropdown">Create a NEAR Wallet</a>
          ) : (
            <Link to={'#'}>Create a NEAR Wallet</Link>
          )}
        <Link className="nav__link nav__link--dropdown"  onClick={() => signInAction()}>
           Log in with NEAR
        </Link>
      </Dropdown>
      </div>
    </StyledContainer>
  );
};

export default StartMenu;
