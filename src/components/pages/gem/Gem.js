import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { formatNearAmount } from 'near-api-js/lib/utils/format';

import { getMintNauts, getFileData } from '~/apis';

import { BottomSell, BottomBid } from './components';
import { ArtItemProperty } from '~/components/common/art';
import { CloseButton } from '~/components/common/buttons';
import { TitleText } from '~/components/common/typography';
import { Tabs } from '~/components/common/tabs';
import { Portal } from '~/components/common/utils';

import { useDocumentTitle } from '~/hooks';
import {  useSelector } from 'react-redux';
import { NftContractContext, MarketContractContext, NearContext } from '~/contexts';

import { QUERY_KEYS, APP } from '~/constants';
import {Trait} from '~/components/Trait.js';


const Container = styled('div')`
  display: flex;
  flex-direction: column;
  min-height: ${({ isBottomSell }) => (isBottomSell ? 'calc(100% - 211px)' : 'calc(100% - 173px)')};
  max-width: 767px;
  padding: 192px 28px 60px;

  .gem-title {
    margin-bottom: 5px;
  }

  .users {
    color: rgba(var(--lavendar-base), 0.7);
    margin-bottom: 40px;

    p {
      margin: 0 0 5px;

      :last-of-type {
        margin-bottom: 0;
      }
    }
  }

  .tabs-titles {
    margin-bottom: 40px;
  }

  .art-item {
    margin: 0 auto;
  }

  .history-event {
    padding: 20px 0;
    font-size: 16px;
    line-height: 24px;

    :first-of-type {
      padding-top: 0;
    }

    :not(:last-of-type) {
      //border-bottom: 1px solid var(--bubble-gum);
      border-bottom: 1px solid rgba(var(--bubble-gum-base), 0.2);
    }
  }

  .royalty {
    text-align: right;
    margin-bottom: 25px;

    &-user {
      margin-right: 25px;
    }

    &-royalty {
      font-size: 34px;
      font-family: var(--font-secondary);
      color: rgba(var(--bubble-gum-base), 0.7);
    }
  }

  @media (min-width: 767px) {
    margin: 0 auto;
    align-items: center;
  }
`;

const GemHeader = styled('div')`
  position: absolute;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  z-index: 2;
  min-height: 92px;

  .gem-close {
    cursor: pointer;

    > svg {
      stroke: var(--lavendar);
      fill: var(--lavendar);
    }
  }
`;

function Gem({ location: { prevPathname } }) {
  const { user } = useContext(NearContext);
  const { getGem } = useContext(NftContractContext);
  const { getSale, marketContract } = useContext(MarketContractContext);
  const { gemId } = useParams();
  const history = useHistory();
  
  const TraitData = Trait;
  const queryClient = useQueryClient();

  const [rank, setRank] = useState ('?');
  const rankData = useSelector((state) => state.rank);

  const getCachedNft = (queryKeys) => {
    let cachedNft;
    // eslint-disable-next-line no-restricted-syntax
    for (const queryKey of queryKeys) {
      const cachedNfts = queryClient.getQueryData(queryKey);
      cachedNft = cachedNfts?.pages?.length
        ? cachedNfts.pages.flat().find(({ token_id }) => token_id === gemId)
        : undefined;

      if (cachedNft) {
        break;
      }
    }

    return cachedNft;
  };

  const cachedNft = getCachedNft([QUERY_KEYS.SALES_POPULATED, QUERY_KEYS.GEMS_FOR_OWNER, QUERY_KEYS.GEMS_FOR_CREATOR]);

  const { data: gem } = useQuery([QUERY_KEYS.GEM, gemId], () => getGem(gemId), {
    onError() {
      toast.error('Sorry 😢 There was an error getting the naut. Please, try again later.');
      history.push('/');
    },
    initialData: cachedNft,
  });

  const cachedSaleNft = getCachedNft([QUERY_KEYS.SALES_POPULATED]);

  const { data: gemOnSale } = useQuery(
    [QUERY_KEYS.GEM_ON_SALE, gemId],
    async () => {
      if (Object.keys(gem.approved_account_ids).includes(marketContract.contractId)) {
        return getSale(gemId);
      }

      return null;
    },
    {
      enabled: !!gem,
      onError() {
        toast.error('Sorry 😢 There was an error getting the naut. Please, try again later.');
        history.push('/');
      },
      initialData: cachedSaleNft,
    }
  );

  useDocumentTitle(gem?.metadata?.title || 'Untitled Naut');

  const getIpfsHashMedia = () => {
    let mediaLowRes;

    if (gem?.metadata?.extra) {
      mediaLowRes = JSON.parse(gem.metadata.extra).media_lowres;
    }

    return mediaLowRes || gem?.metadata?.media;
  };

  const { data: imageData } = useQuery(
    [QUERY_KEYS.GET_IMAGE_DATA, getIpfsHashMedia()],
    () => getFileData(getIpfsHashMedia()),
    {
      retry: 1,
      enabled: !!gem && !!getIpfsHashMedia(),
    }
  );

  const hasBids = () => !!gemOnSale?.bids?.near?.owner_id;

  const isListed = () => !!gemOnSale;

  const isOwnedByUser = () => gem?.owner_id && gem.owner_id === user?.accountId;

  const goBack = () => {
    if (prevPathname) {
      history.push(prevPathname);
    } else {
      history.push('/');
    }
  };

  const getCreator = () => {
    if (!gem?.metadata?.extra) {
      return undefined;
    }

    return JSON.parse(gem?.metadata?.extra).creator_id;
  };

  if (gem === null) {
    return <Redirect to="/404" />;
  }

  let BottomComponent = () => null;
  if (isListed()) {
    BottomComponent = BottomBid;
  } else if (!isListed() && isOwnedByUser()) {
    BottomComponent = BottomSell;
  }

    useEffect(async () => {
    let token_naut = await getGem(gemId);
    let cur_naut_name = token_naut.metadata.title;
    let cur_real_name = cur_naut_name.split("#");
    let current_rank=parseInt(cur_real_name[1],10);
    if(rankData.data.filter(x=>x.num==current_rank).length!=0){
      current_rank = rankData.data.filter(x=>x.num==parseInt(cur_real_name[1],10))[0].rank
    }
    else {
      current_rank = await getMintNauts(APP.TOKEN_TYPE,[parseInt(cur_real_name[1],10)]);
      current_rank = current_rank[0].rank;
    }
    //let current_rank = await getMintNauts(APP.TOKEN_TYPE,[parseInt(cur_real_name[1],10)]);
    // let extra;
    // let rank_data = [];
    // let property_back, property_chain, property_eye, property_fur, property_hat, property_suit, property_mouth, property_visor;

    // itemsJSON?.length&& itemsJSON.map((nft)=>{
    //   extra = nft;
    //   property_back = parseInt(TraitData["Backgrounds"][extra.attributes.background],10) ;
    //   property_chain =parseInt(TraitData["Chains"][extra.attributes.chains],10);
    //   property_eye =parseInt(TraitData["Eyes"][extra.attributes.eyes],10);
    //   property_fur =parseInt(TraitData["Fur"][extra.attributes.fur],10);
    //   property_hat =parseInt(TraitData["Helmets"][extra.attributes.helmets],10);
    //   property_visor =parseInt(TraitData["Visors"][extra.attributes.visors],10);
    //   property_suit =parseInt(TraitData["Spacesuits"][extra.attributes.spacesuits],10);
    //   property_mouth =parseInt(TraitData["Mouths"][extra.attributes.mouths],10);

    //   let result = property_back*17 + property_chain*22 + property_eye*17 + property_fur*23 + property_hat*23 + property_visor*17 + property_suit*15 + property_mouth*15 ;

    //   rank_data.push({token:nft.num, rarity: result});

    // })

    // let token_naut = await getGem(gemId);
    // let cur_naut_name = token_naut.metadata.title;
    // let cur_real_name = cur_naut_name.split("#");
    
    

    // const current_rarity = rank_data.filter(nft => nft.token == parseInt(cur_real_name[1],10))[0].rarity;
    
    
    // const current_rank = rank_data.filter(nft => nft.rarity < current_rarity).length;

    setRank(current_rank||'?')

  }, [NftContractContext]);

  return (
    <Container isBottomSell={BottomComponent === BottomSell}>
      <Portal>
        <GemHeader>
          <div>{imageData && <img src={imageData} alt={gem?.metadata?.title} width={40} height={40} />}</div>
          <CloseButton className="gem-close" processCLick={goBack} />
        </GemHeader>
      </Portal>
      <TitleText className="gem-title">{gem?.metadata?.title || 'No title provided'}</TitleText>
      <div className="users">
        <p>by {getCreator() || '?'}</p>
        <p>owned by {gem?.owner_id || '?'}</p>
      </div>
      <Tabs
        tabsArray={[
          {
            title: 'Preview',
            content: <ArtItemProperty nft={gem} isFullScreenEnabled isFromIpfs rankText={rank} />,
          },
        ]}
      />
      <BottomComponent gem={gem} gemOnSale={gemOnSale} />
    </Container>
  );
}

Gem.propTypes = {
  location: PropTypes.shape({
    prevPathname: PropTypes.string,
  }),
  dataUrl: PropTypes.string,
  buttonText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isButtonDisabled: PropTypes.bool,
};

export default Gem;
