import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { parseNearAmount } from 'near-api-js/lib/utils/format';

import { QUERY_KEYS } from '~/constants';

import { NftContractContext } from '~/contexts';

import { Button } from '~/components/common/buttons';
import { InputNear } from '~/components/common/forms';
import { StickedToBottom } from '~/components/common/layout';

const Container = styled('div')`
  width: 100%;
  padding: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  max-width: 767px;

  .input-sign-aside {
    width: 100%;
    max-width: 350px;

    input.input {
      max-width: 200px;
    }
  }

  .sell-button {
    width: 100%;
  }

  @media (max-width: 727px) {
    flex-direction: column;
    padding: 5px;

    .sell-button {
      margin-top: 16px;
    }
  }
`;

const BottomSell = ({ gem }) => {
  const [sellPrice, setSellPrice] = useState('');
  const { listForSale } = useContext(NftContractContext);
  const queryClient = useQueryClient();

  const isListAllowed = () => !!sellPrice && Number(sellPrice) > 0;

  const processList = async () => {
    if (!isListAllowed()) {
      return;
    }

    await queryClient.invalidateQueries(QUERY_KEYS.SALES_POPULATED);

    try {
      await listForSale(gem.token_id, parseNearAmount(sellPrice));
      toast.success('Success! Your naut is on the marketplace.');
    } catch (error) {
      console.error(error);
      toast.error('Sorry 😢 There was an error in listing your naut on the market. Please, try again later.');
    }
  };

  return (
    
      <Container>
        <InputNear
          name="price"
          labelText="Price"
          isRequired
          nearsInitial={sellPrice}
          onNearsChange={setSellPrice}
          autoFocus
        />
        <Button className="sell-button" isPrimary onClick={processList} isDisabled={!isListAllowed()}>
          List Naut for {sellPrice ? +sellPrice : '0'}Ⓝ
        </Button>
      </Container>
    
  );
};

BottomSell.propTypes = {
  gem: PropTypes.shape({
    token_id: PropTypes.string,
  }).isRequired,
};

export default BottomSell;
