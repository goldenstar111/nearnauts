import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { NearContext, MarketContractContext, NftContractContext } from '~/contexts';
import { useInfiniteQuery, useQuery } from 'react-query';

import { DisplayText } from '~/components/common/typography';
import { Contribute, MintPlus } from '~/components/common/popups';
import { ArtItemPriced } from '~/components/common/art';
import { Button } from '~/components/common/buttons';
import { Input,InputAmount } from '~/components/common/forms';
import { ArtItemMarket } from '~/components/common/art';
import { DotsLoading } from '~/components/common/utils';

import { QUERY_KEYS, APP } from '~/constants';
import { Loading } from '~/components/common/utils';
import { convertYoctoNearsToNears, convertYoctoNearsToNearsVolumn } from '~/utils/nears';
import  disNN  from '~/assets/images/NN.gif';
import  disBG  from '~/assets/images/BG.png';
import  nautslogo  from '~/assets/images/nautslogo.png';
import { useDispatch, useSelector, connect } from 'react-redux';
import { rankActions } from '~/store/store.js';
import { getMintNauts } from '~/apis';

const Container = styled('div')`
  padding: 15px;
  max-width: 1200px;
  margin: 100px auto 0;

  .description-container {
    margin-left: 20px;
  }
  .nautslogo {
    margin-top: -100px;
    margin-bottom: -50px;
  }
  .nautsimage {
    max-width:100%;
    width: 600px
  }

  .items-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    .items {
      width: 100%;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: space-evenly;
    }

    .load-more {
      margin-top: 25px;
    }
  }

  .item {
    position: relative;
    transition: 250ms;
    margin: 15px 5px;
    
    :hover {
      transform: scale(1.01);
    }

    img {
      border-radius: 8px;
      max-width: 100%;

      @media (max-width: 1100px) {
        max-width: 320px;
      }
    }

    button {
      position: absolute;
      right: 20px;
      bottom: 20px;
    }
  }

  .desc {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 300;
    line-height: 36px;
  }

  .royalty {
    margin-bottom: 20px;
    font-size: 16px;
    font-weight: 200;
    line-height: 36px;
  }

  .no-nfts {
    margin-top: 50px;
    text-align: center;

    .button {
      margin-top: 25px;
    }
  }

  .all-attributes{
    display: flex;
    
    align-items: flex-end;
    justify-content: center;
    @media (max-width: 767px) {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .attributes{
    background-color: #15b2e50f;
    border-radius: 6px;
    border: 1px solid #315560;
    margin: 10px 10px;
    text-align: center;
    width: 200px; 
  }

  .attributes-value{
    color: #f9f9f9;
    font-size: 16px;
    font-weight: 500;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .attributes-tytle{
    color: #b1f785;
    font-size: 15px;
    font-weight: 500;
    text-transform: uppercase;
  }

  @media (min-width: 767px) {
    .description-container {
      margin-left: 0;
      margin-bottom: 60px;
      text-align: center;
    }
  }
  @media (max-width: 767px) {
    .nautslogo {
      margin-top: -50px;
      margin-bottom: -20px;
    }
  }
`;

const StyledButton = styled(Button)`
  
`;

const Marketplace = () => {
  // const { user } = useContext(NearContext);
  // const { nftContract, getGemsSupply } = useContext(NftContractContext);
  // const { getSalesPopulated, marketContract, getSalesMarket, getTotalVolume, getSupplySales } = useContext(MarketContractContext);

  const [curValue, setCurValue] = useState (0);
  const [rankValue, setRankValue] = useState (0);
  const [rankData, setRankData] = useState (null);
  const [isMinting, setIsMinting] = useState(false);




  const handleChange = (e) => {
    let targetValue = parseInt(e.target.value,10).toFixed() 
    setCurValue(targetValue) 
  }

  const processConfirm =async () => {
    setIsMinting(true)
    if(curValue<=10000 && curValue>0 ){
      let itemsJSON = await getMintNauts(APP.TOKEN_TYPE,[curValue]);
      const response = itemsJSON.data;
      const nftresponse = itemsJSON.lists;
      console.log('itemsJSON',itemsJSON)
      if(response.length){
        setRankValue(response[0]?.rank)
      }
      else setRankValue("Not exist")
      setRankData(nftresponse)
      setIsMinting(false)
    }
    
  }

  return (
    <Container >
      <div className="description-container" >
        <div className="desc">Near Naut Rarity Check</div>
          <div className="all-attributes">
            <div className = "attributes">
              <div className = "attributes-tytle">{'Near Naut ID number #'+ curValue}</div>
              <div className = "attributes-value">{'Rarity Rank:' + rankValue}</div>
            </div>
          </div>
          <div className="all-attributes">
            <InputAmount
              name="naut_amount"
              type="number"
              labelText="Please input your Near Naut ID number #  below."
              max = "7777"
              min = "1"
              isRequired
              value={curValue}
              onChange={handleChange}
            />
            <div style={{'paddingLeft':30, 'paddingTop': 20}}>
              <StyledButton onClick={processConfirm} isPrimary>
                {isMinting ? '' : 'Confirm'}
                {isMinting && <DotsLoading />}
              </StyledButton>
            </div>
          </div>
          <div className="items" id="nauts-item">
            {rankData?.length && rankData.map((sale) => <ArtItemMarket key={sale.num} nft={sale} isLink isFromIpfs />)}
          </div>
          <div style={{'paddingLeft':0, 'paddingTop': 50}}>
              
                <StyledButton isPrimary>
                <a href="https://paras.id/collection/nearnautnft.near" target="_blank">
                  Market
                  </a>
                </StyledButton>
              
            </div>
      </div>
      
    </Container>
  );
}

export default Marketplace;