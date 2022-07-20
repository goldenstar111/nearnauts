import { formatNearAmount } from 'near-api-js/lib/utils/format';
import React, { useContext, useState, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useQueryClient } from 'react-query';
import { Link, Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { MarketContractContext, NearContext, NftContractContext } from '~/contexts';

import { HeadingText } from '~/components/common/typography';
import { ArtItemPriced, ArtItem } from '~/components/common/art';
import { StickedToBottom } from '~/components/common/layout';
import { Button } from '~/components/common/buttons';
import { DotsLoading } from '~/components/common/utils';

import { uploadFile, getGeneratedImageFromNode } from '~/apis';

import { APP, QUERY_KEYS } from '~/constants';

import { NftTypeRequired } from '~/types/NftTypes';

import { convertYoctoNearsToNears } from '~/utils/nears';

import  disNN  from '~/assets/images/NN.gif';

const Container = styled('div')`
  max-width: 600px;
  margin: 0 auto;
  width: 100%;

  h2 {
    margin-bottom: 0;
  }

  .clarification {
    margin-bottom: 40px;
    line-height: 24px;
  }

  .text {
    margin-bottom: 25px;
    line-height: 24px;
    word-break: break-word;
  }

  .sub-header {
    color: var(--periwinkle);
  }

  .fee-description {
    margin-top: 50px;
    
    line-height: 18px;
  }

  a {
    width: 100%;
  }

  canvas {
      border-radius: var(--radius-default);
      display: none;
    }

  .canvas-thumbnail {
      display: none;
  }
`;

const StyledButton = styled(Button)`
  width: 50%;

  :first-of-type {
    margin-right: 10px;
  }
`;

const MintReview = ({onUpload, backLink, nft }) => {
  const [isMinting, setIsMinting] = useState(false);
  const { user } = useContext(NearContext);
  const { mintAndListGem } = useContext(MarketContractContext);
  const { nft_supply_for_owner, getGemsSupply } = useContext(NftContractContext);
  const queryClient = useQueryClient();
  const canvasThumbnailRef = useRef();
  const [nearMintPrice, setNearMintPrice]=useState(APP.MIN_NEARS_TO_MINT)

  const uploadToIPFS = async ({ file, thumbnailFile }) => Promise.all([uploadFile(file), uploadFile(thumbnailFile)]);
  const hasEnoughNears = (amount) => Number(convertYoctoNearsToNears(user.balance)) > (APP.MIN_NEARS_TO_MINT * amount)

  // useEffect(async () => {
  //   let itemsforCreator = await getSupplyForCreator(user.accountId);
  //   let deposit_amount = APP.DEPOSIT_DEFAULT;
  //   if(itemsforCreator>=1) {
  //      deposit_amount = '3000000000000000000000000';
  //      setNearMintPrice(3)
  //   }
  // },[])
  
  const processMintClick = async () => {
    toast.error('Sorry 😢 Mint is stopped.');
    return;
    setIsMinting(true);

    await Promise.all([
      queryClient.invalidateQueries(QUERY_KEYS.GEMS_FOR_OWNER, user.accountId),
      queryClient.invalidateQueries(QUERY_KEYS.GEMS_FOR_CREATOR, user.accountId),
      queryClient.invalidateQueries(QUERY_KEYS.SALES_POPULATED),
    ]);

    let fileIpfsHash;
    let thumbnailIpfsHash;
    let uploadError;
    if(parseInt(nft.amount,10)==0) {
      setIsMinting(false);
      toast.error('Sorry 😢 Please select the amount of nauts exactly.');
      return;
    }
    
    let itemsTotal = await getGemsSupply();

    if(itemsTotal>6000) {
      setIsMinting(false);
      toast.error('Sorry 😢 Limited by 6000.');
      return
    }
    // if(!hasEnoughNears(parseInt(nft.amount,10))){
    //   setIsMinting(false);
    //   toast.error('Sorry 😢 You need to fund min '+APP.MIN_NEARS_TO_MINT +' * ' + nft.amount +'Ⓝ to mint ');
    //   return;
    // }

    let availableCnt = 50 ;
    // if(user.accountId =="nearnauts.near") availableCnt = 20 ;

    let itemsforCreator = 0;

    let deposit_amount = APP.DEPOSIT_DEFAULT;
        

    if(parseInt(itemsforCreator,10) + parseInt(nft.amount,10) > availableCnt ){
      setIsMinting(false);
      toast.error('Sorry 😢 You can only mint max 50 nauts.( Your left nauts: '+(availableCnt - itemsforCreator)+' )');
      return;
    }

    try {

      const nftfiles =[];
      let result = await getGeneratedImageFromNode(user.accountId,parseInt(nft.amount,10));
      if(!result) {
        setIsMinting(false);
        return;
      }

      for(let i = 0; i< result.length; i++){
          
          nftfiles.push({media: result[i].media, media_lowres: result[i].media, attributes: result[i].attributes, title: result[i].title });
      }
      if(nftfiles.length==0){
        setIsMinting(false);
        toast.error('Sorry 😢 Please click the mint button again.');
        return;
      }
      
      await mintAndListGem({ ...nft, files:nftfiles, deosit_amount: deposit_amount});
        
        
    } catch (e) {
      console.error(e);
      uploadError = e;
    }

    

    setIsMinting(false);
  };

  const wasDescribed = !!nft.creator;

  if (!wasDescribed) {
    return <Redirect to="/" />;
  }

  return (
    <Container>
      <HeadingText>Final!</HeadingText>
      <p className="clarification">
        This is how your NFT will appear on the marketplace. You cannot remove an NFT once it is minted.
      </p>
      <p className="sub-header">Total Naut Amount</p>
      <p className="text">{nft.amount}</p>
      <canvas className="canvas-thumbnail" ref={canvasThumbnailRef} />
      <ArtItem
        nft={{
          ...nft,
          metadata: {
            media:
              disNN,
          },
        }}
        bidAvailable={false}
      />
      {
        <p className="fee-description">
          {/*We will ask to attach {nearMintPrice} NEAR to generate and mint your each Nauts.
                    All unused funds will be returned to your account in the same transaction.*/}
        </p>
      }
      <StickedToBottom isSecondary>
        <StyledButton isSecondary isDisabled={isMinting}>
          <Link to={backLink}>Back</Link>
        </StyledButton>
        <StyledButton onClick={processMintClick} isPrimary isDisabled={isMinting}>
          {isMinting ? 'Generating a fantastic Naut' : 'Mint NFT'}
          {isMinting && <DotsLoading />}
        </StyledButton>
      </StickedToBottom>
    </Container>
  );
};

MintReview.propTypes = {
  onUpload: PropTypes.func,
  backLink: PropTypes.string.isRequired,
  nft: NftTypeRequired,
};

export default MintReview;
