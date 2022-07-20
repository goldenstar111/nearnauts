import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { parseNearAmount } from 'near-api-js/lib/utils/format';

import { NearContext, NftContractContext } from '~/contexts';

import { convertYoctoNearsToNears } from '~/utils/nears';

import { HeadingText, SmallText } from '~/components/common/typography';
import { Input,InputAmount, InputNear, InputRoyalty, InputSign, Textarea } from '~/components/common/forms';
import { ButtonBottom, Button } from '~/components/common/buttons';

import { RemoveIcon } from '~/components/common/icons';
import Progress from '~/components/common/Progress';

import { APP, QUERY_KEYS } from '~/constants';

import { useDebounce } from '~/hooks';

import { doesAccountExist, setMintNauts, setMintLists } from '~/apis';

import { NftTypeRequired } from '~/types/NftTypes';



const Container = styled('div')`
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    margin-bottom: 0;
  }

  .title {
    min-height: 70px;
    font-size: 40px;
    text-align: center;
  }

  .freebies {
    min-height: 70px;
  }

  .user-royalty-input {
    .form-group {
      margin-bottom: 0;
    }
  }

  textarea {
    max-width: 100%;
    min-width: 100%;
  }

  .collaborator-add {
    margin-bottom: 30px;
  }

  .fee-description {
    font-size: 13px;
    line-height: 18px;
  }

  .error-messages {
    margin: 35px 0 40px;
  }

  .error-message {
    margin-bottom: 25px;
    padding: 20px 25px;
    border: 1px solid var(--error);
    border-radius: var(--radius-default);
    background-color: var(--error-bg);
  }

  .mint-image {
    max-width:100%;
    width:500px;
  }

  .mint-status {
    display: flex;
    justify-content: center;
  }

  .mint-info-display {
    text-align: center;
    font-size: 30px;
  }

  .generate-group {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    @media (max-width: 767px) {
       flex-direction: column;
       align-items: center;
    }
  }
`;


const RankCheck = ({ onCompleteLink, nft, setNft, setNftField }) => {
  const { user, nearContent } = useContext(NearContext);
  //const { getGemsSupply, nftMint, getGems } = useContext(NftContractContext);

  const [rate, setRate] = useState(0);
  
  const [nearMintPrice, setNearMintPrice]=useState(APP.MIN_NEARS_TO_MINT)
  const hasEnoughNears = (amount=1) => Number(convertYoctoNearsToNears(user.balance)) > (nearMintPrice * amount);
  const isMintForbidden = (amount) => !hasEnoughNears(amount);
  const isDisabled = isMintForbidden(nft.amount);
  

  useEffect(async () => {
    setNearMintPrice(7.5)

    setNftField('creator', user.accountId)
    setNftField('amount',1);
    //let itemsTotal = await getGemsSupply();
    if(itemsTotal>10000) itemsTotal = 10000;
    if(itemsTotal) setRate(itemsTotal);



},[]);


  return (
    <Container>
      <div className="title">Mint nauts</div>
      <div className="mint-info-display">
        <div style={{'padding':'20px 0px','color':'#ff21ed'}}>Whitelist Minting is now LIVE!</div>
        <div style={{'padding':'20px 0px','color':'#2edf23'}}>Public Sale Minting is now LIVE!</div>
      </div>
      <div className="mint-status">
        <Progress done={(rate/ 100).toFixed(2)} items = {rate}/>
      </div>
      <div className="freebies">
        Here you can mint your NEARNauts!<br />
        Select the amount you'd like to mint (between 1-5) and click 'Generate a Naut'!<br />
        You can create max 5 nauts at a time and You can create max 50 nauts.<br />
        Each mint price: {nearMintPrice}Ⓝ, You need to fund min {nearMintPrice} * {nft.amount}Ⓝ to mint.
      </div>
      <div className="generate-group" >
      <InputAmount
        name="naut_amount"
        type="number"
        labelText="Amount ( Max: 5)"
        max = "5"
        min = "1"
        isRequired
        value={nft.amount}
        onChange={(e) => {
            if(e.target.value<=5){
              let curValue = parseInt(e.target.value,10).toFixed()                
              if(e.target.value=='') setNftField('amount', 0)
              else setNftField('amount', curValue)            
            }
            else {
              setNftField('amount', 5) 
            }
          }
        }
      /> 
      
        <ButtonBottom
          link={onCompleteLink}
          text="Generate a Naut"
          isDisabled={isDisabled}
        />
      
      </div>
    </Container>
  );
};

RankCheck.propTypes = {
  onCompleteLink: PropTypes.string.isRequired,
  nft: NftTypeRequired,
  setNft: PropTypes.func.isRequired,
  setNftField: PropTypes.func.isRequired,
};

export default RankCheck;
