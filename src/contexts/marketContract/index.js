import React, { useCallback, useContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import { transactions } from 'near-api-js';

import { initialMarketContractState, marketContractReducer } from './reducer';
import { GOT_MIN_STORAGE } from './types';

import { ReactChildrenTypeRequired } from '~types/ReactChildrenTypes';

import { NearContext } from '../near';
import { NftContractContext } from '~/contexts';

import { getMarketContractName } from '~/utils';

import { PAYABLE_METHODS, APP, STORAGE } from '~/constants';

export const MarketContractContext = React.createContext(initialMarketContractState);

export const MarketContractContextProvider = ({ marketContract, children }) => {
  const [marketContractState, dispatchMarketContract] = useReducer(marketContractReducer, initialMarketContractState);
  const { user } = useContext(NearContext);
  const { nftContract, getGemsBatch, getGem } = useContext(NftContractContext);

  const getSale = useCallback(
    async (gemId) => {
      return marketContract.get_sale({
        nft_contract_token: `${nftContract.contractId}||${gemId}`,
      });
    },
    [marketContract]
  );

  const getSales = useCallback(
    async (fromIndex, limit) =>
      marketContract.get_sales_by_nft_contract_id_from_end({
        nft_contract_id: nftContract.contractId,
        from_index: fromIndex,
        limit,
      }),
    [marketContract]
  );

  const getSupplySales = useCallback(
    async (fromIndex, limit) =>
      marketContract.get_supply_sales(),[marketContract]
  );

  const getSalesMarket = useCallback(
    async ( ) =>
      marketContract.get_sales_by_nft_contract_id({
        nft_contract_id: nftContract.contractId,
        from_index: '0',
        limit:'110',
      }),
    [marketContract]
  );

  const getSalesPopulated = useCallback(
    async (fromIndex, limit) => {
      const sales = await getSales(fromIndex, limit);

      const salesPopulated = [];

      const gems = await getGemsBatch(
        sales
          .filter(({ nft_contract_id }) => nft_contract_id === nftContract.contractId)
          .map(({ token_id }) => token_id)
      );

      for (let i = 0; i < sales.length; i += 1) {
        const sale = sales[i];
        const { token_id } = sale;

        let token = gems.find(({ token_id: t }) => t === token_id);

        if (!token) {
          // eslint-disable-next-line no-await-in-loop
          token = await getGem(token_id);
        }

        salesPopulated.push({ ...sale, ...token });
      }

      return salesPopulated;
    },
    [marketContract, nftContract]
  );

  const mintAndListGem = useCallback(
    async (nft) => {
      const transactionlists = [];
      const itemargs = [];
      const depositAmount = nft.deosit_amount;
      for(let i = 0; i< nft.files.length; i++){
        let nfts = nft.files[i];
        itemargs.push(nfts.title);
        const metadata = {
          media: nfts.media,
          reference: APP.HASH_SOURCE,
          title: ("Nearnauts #" + nfts.title),
          description: "",
          issued_at: Date.now(),
          extra: JSON.stringify({
            media_lowres: nfts.media_lowres,
            creator_id: nftContract.account.accountId,
            attributes_background: nfts.attributes.background,
            attributes_chains: nfts.attributes.chains,
            attributes_eyes: nfts.attributes.eyes,
            attributes_fur: nfts.attributes.fur,
            attributes_helmets: nfts.attributes.helmets,
            attributes_mouths: nfts.attributes.mouths,
            attributes_spacesuits: nfts.attributes.spacesuits,
            attributes_visors: nfts.attributes.visors,
          }),
        };

        const tokenType = APP.TOKEN_TYPE;
        const tokenId = `token-${tokenType}-${Date.now()}${i}`;

        
        
        transactionlists.push(transactions.functionCall(
          'nft_mint',
         {
              token_id: tokenId,
              metadata,
              receiver_id: user.accountId,
            },
          APP.PREPAID_GAS_LIMIT / nft.files.length,
          depositAmount
        ));
      }


      localStorage.setItem(STORAGE.PAYABLE_METHOD_ITEM_NAME, PAYABLE_METHODS.MINT_AND_LIST_NFT);
      localStorage.setItem(STORAGE.MINT_ITEM_ARGS, itemargs);

      await nftContract.account.signAndSendTransaction(nftContract.contractId, transactionlists);

    },
    [nftContract, marketContract, marketContractState]
  );

  const offer = useCallback(
    async (gemId, offerPrice) => {
      // localStorage.setItem(STORAGE.PAYABLE_METHOD_ITEM_NAME, PAYABLE_METHODS.OFFER);

      // await marketContract.offer(
      //   {
      //     nft_contract_id: nftContract.contractId,
      //     token_id: gemId,
      //   },
      //   APP.PREPAID_GAS_LIMIT,
      //   parseNearAmount(offerPrice)
      // );
    },
    [marketContract]
  );

  const removeSale = useCallback(
    async (gemId) => {
      localStorage.setItem(STORAGE.PAYABLE_METHOD_ITEM_NAME, PAYABLE_METHODS.UNLIST);

      await marketContract.remove_sale(
        {
          nft_contract_id: nftContract.contractId,
          token_id: gemId,
          approval_id: getMarketContractName(nftContract.contractId)
        },
        APP.PREPAID_GAS_LIMIT / 2,
        APP.DEPOSIT_UNLIST / 100
      );
      
    },
    [marketContract, nftContract]
  );

  const getTotalVolume = useCallback(async () => marketContract.get_traded_volume(), [marketContract]);

  const payStorage = useCallback(async () => {
    localStorage.setItem(STORAGE.PAYABLE_METHOD_ITEM_NAME, PAYABLE_METHODS.PAY_STORAGE);

    await marketContract.storage_deposit({}, APP.PREPAID_GAS_LIMIT, marketContractState.minStorage);
  }, [marketContract, marketContractState]);

  const getMinStorage = useCallback(async () => marketContract.storage_amount(), [marketContract]);

  const getStoragePaid = useCallback(async (accountId) => marketContract.storage_paid({ account_id: accountId }), [
    marketContract,
  ]);

  const getSalesSupplyForOwner = useCallback(
    async (accountId) => marketContract.get_supply_by_owner_id({ account_id: accountId }),
    [marketContract]
  );

  useEffect(() => {
    (async () => {
      if (marketContract?.storage_amount) {
        const minStorage = await getMinStorage();

        dispatchMarketContract({ type: GOT_MIN_STORAGE, payload: { minStorage } });
      }
    })();
  }, [marketContract]);

  const value = {
    minStorage: marketContractState.minStorage,
    marketContract,
    getSale,
    getSales,
    getSupplySales,
    getSalesMarket,
    getSalesPopulated,
    mintAndListGem,
    offer,
    removeSale,
    payStorage,
    getStoragePaid,
    getSalesSupplyForOwner,
    getTotalVolume
  };

  return <MarketContractContext.Provider value={value}>{children}</MarketContractContext.Provider>;
};

MarketContractContextProvider.propTypes = {
  marketContract: PropTypes.shape({
    get_sales_by_nft_contract_id: PropTypes.func.isRequired,
    get_sale: PropTypes.func.isRequired,
    get_supply_sales: PropTypes.func.isRequired,
    offer: PropTypes.func.isRequired,
    remove_sale: PropTypes.func.isRequired,
    storage_deposit: PropTypes.func.isRequired,
    storage_paid: PropTypes.func.isRequired,
    storage_amount: PropTypes.func.isRequired,
    get_supply_by_owner_id: PropTypes.func.isRequired,
    get_traded_volume: PropTypes.func.isRequired,
  }).isRequired,
  children: ReactChildrenTypeRequired,
};
