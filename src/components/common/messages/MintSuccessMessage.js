import React, { useRef, useEffect,useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { NearContext } from '~/contexts';
import { mintToNode } from '~/apis';
import Message from './Message';

const StyledContainer = styled.div`
  .message {
    margin: 0;
  }

  .link {
    color: var(--lavendar);
    font-size: 16px;

    :hover {
      color: var(--periwinkle);
    }
  }
`;

const MintSuccessMessage = () => {
  const toastId = useRef(null);
  const dismiss = () => toast.dismiss(toastId.current);
  const { user } = useContext(NearContext);

  useEffect(async () => {
    await mintToNode(user.accountId)
  },[])

  return (
    <StyledContainer>
      <Message>
        <p className="message">Your NEARNauts have been minted successfully.</p>
      </Message>
    </StyledContainer>
  );
};

export default MintSuccessMessage;
