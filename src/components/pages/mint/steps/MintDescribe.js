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

import  mintPic  from '~/assets/images/Monkey.png';

const mintedTokenList = []

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


const MintDescribe = ({ onCompleteLink, nft, setNft, setNftField }) => {
  const { user, nearContent } = useContext(NearContext);
  const { getGems, getGemsSupply, nftMint, listForSale, nft_burn } = useContext(NftContractContext);

  const [rate, setRate] = useState(0);
  
  const [nearMintPrice, setNearMintPrice]=useState(APP.MIN_NEARS_TO_MINT)
  const hasEnoughNears = (amount=1) => Number(convertYoctoNearsToNears(user.balance)) > (nearMintPrice * amount);
  const isMintForbidden = (amount) => true;//!hasEnoughNears(amount);
  const isDisabled = isMintForbidden(nft.amount);
  

  useEffect(async () => {
    setNearMintPrice(7.5)

    setNftField('creator', user.accountId)
    setNftField('amount',1);
    let itemsTotal = await getGemsSupply();
    //if(itemsTotal>7777) itemsTotal = 7777;
    if(itemsTotal) setRate(itemsTotal);

    // let tokenslist = [];let creatorlist = [];let ownerlist = [];
    // let duplicates = [];
    // for (let i = 0 ; i< (itemsTotal/70); i++){
      
    //   let items = await getGems(String( i * 70 ), String(70));
    //   console.log('item',items)
      
    //   for(let j = 0; j < items.length; j++){
    //     let token_id = items[j].token_id;
    //     let cur_name = items[j].metadata.title;
    //     let cur_real_name = cur_name.split("#");
    //     let naut_id = parseInt(cur_real_name[1],10)
        
    //     const metadata={}
    //     metadata.token_id = token_id;
    //     let token_metadata = JSON.parse(items[j].metadata.extra);
    //     delete token_metadata["media_lowres"];
    //     delete token_metadata["creator_id"];
    //     metadata.metadata = token_metadata
    //     //if(tokenslist.includes(naut_id)){
    //       duplicates.push(metadata);
    //     //}
        
    //     tokenslist.push(naut_id);

    //     let creator = (JSON.parse(items[j].metadata.extra)).creator_id;
    //     creatorlist.push(items[j]);
    //     let owner = items[j].owner_id;
    //     ownerlist.push(owner);
    //   }
    // }
    // console.log('tokenslist',tokenslist)
    
    // console.log('duplicates',duplicates)

    // console.log('creators', creatorlist)

    // console.log('owners', ownerlist)

    // for(let j = 0; j< mintedTokenList.length; j++){
    //    console.log('p=>',j);
    //    await nft_burn(mintedTokenList[j].token_id,mintedTokenList[j].metadata);
    // }

    // try{
    //   let temp = [];
    //   console.log(mintedTokenList.length)
    //   for(let p = 0; p< mintedTokenList.length; p++){
    //     console.log('p=>',p);
        
    //     let house = {};
    //     const token = mintedTokenList[p];
    //     const token_id = token.token_id;
    //     //if(token_id != 'token-naut-16426914704730') continue;
    //     const receiver_id = token.owner_id;
    //     const metadata = {
    //       media: token.metadata.media,
    //       reference: token.metadata.reference,
    //       title: token.metadata.title,
    //       description: "",
    //       issued_at:parseInt(token.metadata.issued_at,10),
    //       extra: token.metadata.extra,
    //     };
    //     const metadata = token.metadata;
    //     console.log('token_id',token_id)
    //     console.log('receiver_id',receiver_id)
    //     console.log('metadata',metadata)
    //     house.token_id = token_id;
    //     house.receiver_id = receiver_id;
    //     house.metadata = metadata;

    //     temp.push(house);

    //     if(temp.length==5){
    //       await nftMint(temp)
    //       temp = [];
    //     }
    //     //await listForSale(token_id, token.conditions.near);
    //   }

      
    // } catch(e){
    //   console.log("Mint=>error",e)
    // }

},[]);


  return (
    <Container>
      <div className="title">Mint nauts</div>
      <div className="mint-info-display">
        <div style={{'padding':'20px 0px','color':'#ff21ed'}}>Minting is now CLOSED!</div>
      </div>
      <div className="mint-status">
        <Progress done={(rate/ 77.77).toFixed(2)} items = {rate}/>
      </div>
      <img src={mintPic} className="mint-image" />

    </Container>
  );
};

MintDescribe.propTypes = {
  onCompleteLink: PropTypes.string.isRequired,
  nft: NftTypeRequired,
  setNft: PropTypes.func.isRequired,
  setNftField: PropTypes.func.isRequired,
};

export default MintDescribe;
