import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { NearContext } from '~/contexts';

import Dropdown from '~/components/common/Dropdown';
import { Balance } from '~/components/common/utils';

const StyledSpan = styled('span')`
  color: var(--bubble-gum);
  height: 52px;
  line-height: 52px;

  .account-display-id {
    text-decoration: underline;
  }
`;

const AccountDisplay = ({ text, handleOnClick, className }) => (
  <StyledSpan className={`account-display ${className}`} onClick={handleOnClick}>
    <span className="account-display-id">{text}</span>
  </StyledSpan>
);

AccountDisplay.propTypes = {
  text: PropTypes.string,
  handleOnClick: PropTypes.func,
  className: PropTypes.string,
};

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

  @media (max-width: 767px) {
    .link-header {
      display: none;
    }
    .ls {
      display: block;
    }
  }
`;

const UserMenu = () => {
  const { user, signOut } = useContext(NearContext);
  const history = useHistory();

  const signOutAction = () => {
    signOut();
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
        <Link className="nav__link nav__link--dropdown" to="/mint">
           Mint
        </Link>
        <Link className="nav__link nav__link--dropdown" to="/profile">
           My Nauts
        </Link>
      </div>
      <Dropdown dropdownBase={AccountDisplay} title={`${user.accountId}`} stretchable>
        <Link className="nav__link nav__link--dropdown ls" to="/rankcheck">
          Rank Check
        </Link>
        <Link className="nav__link nav__link--dropdown ls" to="/mint">
          Mint a Naut
        </Link>
        <Link className="nav__link nav__link--dropdown ls" to="/profile">
          My Nauts
        </Link>
        <div className="nav__link nav__link--dropdown">
          Balance: <Balance />
        </div>
        <Link className="nav__link nav__link--dropdown" to="#" onClick={() => signOutAction()}>
          Log out
        </Link>
      </Dropdown>
    </StyledContainer>
  );
};

export default UserMenu;
