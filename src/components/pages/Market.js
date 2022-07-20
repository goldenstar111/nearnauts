import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { NearContext, MarketContractContext, NftContractContext } from '~/contexts';
import { useInfiniteQuery, useQuery, useQueryClient } from 'react-query';

import { DisplayText } from '~/components/common/typography';
import { Contribute, MintPlus } from '~/components/common/popups';
import { ArtItemMarket } from '~/components/common/art';
import { Button } from '~/components/common/buttons';
import { Select } from '~/components/common/forms';
import { DiamondIcon } from '~/components/common/icons';

import { QUERY_KEYS, APP } from '~/constants';
import { Loading } from '~/components/common/utils';
import { convertYoctoNearsToNears, convertYoctoNearsToNearsVolumn } from '~/utils/nears';
import  disNN  from '~/assets/images/NN.gif';
import  disBG  from '~/assets/images/BG.png';
import  nautslogo  from '~/assets/images/nautslogo.png';
import { useDispatch, useSelector, connect } from 'react-redux';
import { rankActions } from '~/store/store.js';
import { getMintNauts, getItemlists } from '~/apis';

const Container = styled('div')`
  padding: 15px;
  max-width: 1200px;
  margin: 100px auto 0;

  .description-container {
    margin-left: 30px;
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

const items = [
{
  title: "Sort by Rank ASC",
  value: "sortByRank"
},
{
  title: "Sort by Rank DESC",
  value: "sortByRank1"
},
{
  title: "Sort by Name ASC",
  value: "sortByName"
},
{
  title: "Sort by Name DESC",
  value: "sortByName1"
}
]



const handleScroll = async (e) => {console.log('e',e)}

const Market = () => {
  const { user } = useContext(NearContext);
  const { nftContract, getGemsSupply } = useContext(NftContractContext);
  const { getSalesPopulated, marketContract, getSalesMarket, getTotalVolume, getSupplySales } = useContext(MarketContractContext);

  const [mintedNFTs, setMintedNFTs] = useState (0);
  const [ownerscnt, setOwnersCnt] = useState (0);
  const [floorprice, setFloorPrice] = useState (0);
  const [totalvolume, setTotalVolume] = useState (0);

  const [filterStr, setFilterStr] = useState ('');

  const [onlyOne, setOnlyOne] = useState (true);
  
  const dispatch = useDispatch();
  const rankData = useSelector((state) => state.rank);
  
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetching, refetch } = useInfiniteQuery(
    [QUERY_KEYS.SALES_POPULATED,filterStr],
    ({ pageParam = 0 }) => getItemlists(String(pageParam), String(APP.MAX_ITEMS_PER_PAGE_HOME), filterStr),
    {
      getNextPageParam(lastPage, pages) {
        if (lastPage.length === APP.MAX_ITEMS_PER_PAGE_HOME) {
          return pages.length * APP.MAX_ITEMS_PER_PAGE_HOME;
        }

        return undefined;
      },
      onError() {
        toast.error('Sorry 😢 There was an error getting nauts.');
      },
      enabled: true,
      select: (dataRaw) => {
        if (dataRaw?.pages?.length) {
          return dataRaw.pages.flat();
        }

        return [];
      },
    }
  );


  useEffect(async () => {
    document.addEventListener('scroll', trackScrolling, false);
    return 
      document.removeEventListener('scroll', trackScrolling, false);
  }, []);

  const isBottom = (el) => {
    if(el.getBoundingClientRect())
      return el.getBoundingClientRect().bottom <= window.innerHeight;
    else null;
  }
  const trackScrolling = async () => {
    const wrappedElement = document.getElementById('nauts-item');
    if(wrappedElement){
      if (isBottom(wrappedElement)) {
        console.log('header bottom reached');
        
        await fetchNextPage();
        document.removeEventListener('scroll', trackScrolling);
        //
      }
    }
  };

  const handleFilter = () => {
    queryClient.resetQueries(QUERY_KEYS.SALES_POPULATED, { exact: true })
    //refetch()

  }


  return (
    <Container >
      <div className="description-container" >
        <div className="desc">Naut Lists</div>
        <div>
          <Select labelText={"Select a option"} items={items} setFilterStr={setFilterStr}/>
          {/*<Button isPrimary onClick={handleFilter} isDisabled={isFetching} className="load-more">
            Sort
          </Button>*/}
        </div>
      </div>
      <div className="items-container">
        <div className="desc">Live Nauts</div>
        <div className="items" id="nauts-item">
          {data?.length && data.map((sale) => <ArtItemMarket key={sale.num} nft={sale} isLink isFromIpfs />)}
          {!data?.length && !isFetching && (
            <div className="no-nfts">
              There is nothing here 😢 <br />
              
            </div>
          )}
        </div>
        {hasNextPage && !isFetching && (
          <Button isPrimary onClick={() => fetchNextPage()} isDisabled={isFetching} className="load-more" >
            Load more
          </Button>
        )}
        {isFetching && <Loading />}
      </div>
    </Container>
  );
}

export default Market;