import React, { useContext, useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import defaultProfilePicture from '~/assets/images/default-profile-picture.png';

import { Balance, Loading } from '~/components/common/utils';
import { Button } from '~/components/common/buttons';
import { ArtItem, ArtItemPriced, ArtItemSellable } from '~/components/common/art';
import { Tabs } from '~/components/common/tabs';

import { useInfiniteQueryGemsWithBlackList, useSearchParams } from '~/hooks';

import { NearContext, NftContractContext, MarketContractContext } from '~/contexts';

import { getFileData } from '~/apis';

import { APP, QUERY_KEYS } from '~/constants';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 767px;
  padding: 100px 28px 120px;

  > * {
    margin: 0 0 25px;
  }

  .summary {
    display: flex;
    flex-direction: row;
    align-items: center;

    > * {
      margin-right: 40px;
    }

    .picture {
      width: 62px;
      height: 62px;
      border-radius: 100%;
    }

    .summary-block {
      display: flex;
      flex-direction: column;
      min-width: 40px;
      white-space: nowrap;

      .summary-block-top {
        font-size: 20px;
        line-height: 25px;
        color: var(--periwinkle);

        .usds {
          font-size: 12px;
        }
      }

      .summary-block-bottom {
        font-size: 11px;
        line-height: 18px;
        color: var(--lavendar);
      }
    }
  }

  .tabs-tab.tabs-tab--active {
    display: flex;
    flex-direction: column;
    align-items: center;

    .items {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
    }

    .no-nfts {
      margin-top: 50px;
      text-align: center;

      .button {
        margin-top: 25px;
      }
    }

    .load-more {
      margin-top: 25px;
    }
  }

  @media (min-width: 767px) {
    margin: 0 auto;
    align-items: center;

    > * {
      margin: 0 0 50px;
    }

    > .button {
      width: 350px;
    }

    .tabs-tab.tabs-tab--active {
      justify-content: space-evenly;
    }
  }
`;

export default function Profile() {
  const { user } = useContext(NearContext);
  const { getGemsForOwner, nft_supply_for_owner } = useContext(NftContractContext);
  const { marketContract } = useContext(MarketContractContext);

  const ownedGemRef = useRef();

  const query = useSearchParams();
  const ownedGemId = query.get('gem-id');

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQueryGemsWithBlackList(
    [QUERY_KEYS.GEMS_FOR_OWNER, user.accountId],
    ({ pageParam = 0 }) => getGemsForOwner(user.accountId, String(pageParam), String(APP.MAX_ITEMS_PER_PAGE_PROFILE)),
    {
      getNextPageParam(lastPage, pages) {
        if (lastPage.length === APP.MAX_ITEMS_PER_PAGE_PROFILE) {
          return pages.length * APP.MAX_ITEMS_PER_PAGE_PROFILE;
        }

        return undefined;
      },
      onError() {
        toast.error('Sorry 😢 There was an error getting nauts you own.');
      },
    }
  );


  const { data: supplyForOwner } = useQuery(
    [QUERY_KEYS.GET_SUPPLY_FOR_CREATOR, user.accountId],
    () => nft_supply_for_owner(user.accountId),
    {
      enabled: !!user?.accountId,
      placeholderData: '0',
      onError() {
        toast.error("Sorry 😢 Can't get the number of naut created by you.");
      },
    }
  );

  useEffect(() => {
    if (ownedGemRef?.current && data.length) {
      ownedGemRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data]);


  return (
    <Container>
      <div className="summary">
        <div className="summary-block">
          <span className="summary-block-top">{supplyForOwner || '0'}</span>
          <span className="summary-block-bottom">Nauts Owned</span>
        </div>
        <div className="summary-block">
          <Balance className="summary-block-top" precision={2} />
          <span className="summary-block-bottom">Your Funds</span>
        </div>
      </div>
      <Tabs
        tabsArray={[
          {
            title: 'Nauts I own',
            content: (
              <>
                <div className="items">
                  {data?.length ? (
                    data.map((nft) => {
                      console.log('nft',nft)
                      const ArtItemComponent =
                        marketContract.contractId in nft.approved_account_ids ? ArtItemPriced : ArtItemSellable;
                      
                      return (
                        <ArtItemComponent
                          key={nft.token_id}
                          forwardedRef={ownedGemId === nft.token_id ? ownedGemRef : null}
                          nft={nft}
                          isLink
                          isFromIpfs
                        />
                      );
                    })
                  ) : (
                    <div className="no-nfts">
                      You don&apos;t own any nauts yet. <br />
                      <Button isPrimary isSmall>
                        <Link to="/mint">Mint a Naut</Link>
                      </Button>
                    </div>
                  )}
                </div>
                {hasNextPage && !isFetching && (
                  <Button isPrimary onClick={() => fetchNextPage()} isDisabled={isFetching} className="load-more">
                    Load more
                  </Button>
                )}
                {isFetching && <Loading />}
              </>
            ),
          }
        ]}
      />
    </Container>
  );
}
