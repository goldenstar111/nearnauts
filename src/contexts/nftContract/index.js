import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { transactions } from 'near-api-js';

import { initialNftContractState } from './reducer';

import { getMarketContractName } from '../../utils';

import { ReactChildrenTypeRequired } from '../../types/ReactChildrenTypes';
import { APP, PAYABLE_METHODS, STORAGE } from '../../constants';

export const NftContractContext = React.createContext(initialNftContractState);

export const NftContractContextProvider = ({ nftContract, children }) => {
  const getGem = useCallback(async (id) => nftContract.nft_token({ token_id: id }), [nftContract]);

  const getGems = useCallback(
    async (fromIndex, limit) =>
      nftContract.nft_tokens_for_type({
        from_index: fromIndex,
        limit,
      }),
    [nftContract]
  );

  const getGemsSupply = useCallback(
    async (tokenType) => {
      return nftContract.nft_total_supply();
    },
    [nftContract]
  );

  const getGemsForOwner = useCallback(
    async (accountId, fromIndex, limit) => {
      return nftContract.nft_tokens_for_owner({
        account_id: accountId,
        from_index: fromIndex,
        limit: Number(limit),
      });
    },
    [nftContract]
  );


  const getIsFreeMintAvailable = useCallback(
    async (accountId) => {
      return nftContract.is_free_mint_available({
        account_id: accountId,
      });
    },
    [nftContract]
  );

  const getGemsBatch = useCallback(
    async (tokenIds) =>
      nftContract.nft_tokens_batch({
        token_ids: tokenIds,
      }),
    [nftContract]
  );

  const nftTransfer = useCallback(
    async (nftId, receiverId) => {
      localStorage.setItem(STORAGE.PAYABLE_METHOD_ITEM_NAME, PAYABLE_METHODS.NFT_TRANSFER);

      await nftContract.nft_transfer(
        {
          token_id: nftId,
          receiver_id: receiverId,
          approval_id:0
        },
        APP.PREPAID_GAS_LIMIT,
        APP.DEPOSIT_TRANSFER
      );
    },
    [nftContract]
  );

  // const nftMint = useCallback(
  //   async (tokenId, receiverId, metadata) => {

  //     await nftContract.nft_mint(
  //       {
  //         token_id: tokenId,
  //         receiver_id: receiverId,
  //         metadata:metadata
  //       },
  //       APP.PREPAID_GAS_LIMIT/5,
  //       '15000000000000000000000'
  //     );
  //   },
  //   [nftContract]
  // );

  const nftMint = useCallback(
    async (nfts) => {
      const transactionlists = [];
      for (let i=0; i<nfts.length;i++){
        transactionlists.push(transactions.functionCall(
          'nft_mint',
         {
              token_id: nfts[i].token_id,
              metadata: nfts[i].metadata,
              receiver_id: nfts[i].receiver_id,
            },
          APP.PREPAID_GAS_LIMIT / 5,
          '14000000000000000000000'
        ));
      }

      await nftContract.account.signAndSendTransaction(nftContract.contractId, transactionlists);
    },
    [nftContract]
  );

  const listForSale = useCallback(
    async (nftId, price) => {
      //localStorage.setItem(STORAGE.PAYABLE_METHOD_ITEM_NAME, PAYABLE_METHODS.LIST);

      // await nftContract.nft_approve(
      //   {
      //     token_id: nftId,
      //     account_id: getMarketContractName(nftContract.contractId),
      //     msg: JSON.stringify({
      //       sale_conditions: [
      //         {
      //           price,
      //           ft_token_id: 'near',
      //         },
      //       ],
      //     }),
      //   },
      //   APP.PREPAID_GAS_LIMIT,
      //   APP.DEPOSIT_LIST
      // );
    },
    [nftContract]
  );


  const nft_supply_for_owner = useCallback(
    async (account_id) =>
      nftContract.nft_supply_for_owner({
        account_id,
      }),
    [nftContract]
  );

  const nft_burn = useCallback(
    async (token_id, owner_id) =>
      nftContract.nft_burn({
        token_id,
        owner_id
      }),
    [nftContract]
  );

  const value = {
    nftContract,
    getGem,
    getGems,
    getGemsSupply,
    getGemsForOwner,
    getGemsBatch,
    nftTransfer,
    nftMint,
    nft_burn,
    listForSale,
    nft_supply_for_owner,
  };

  return <NftContractContext.Provider value={value}>{children}</NftContractContext.Provider>;
};

NftContractContextProvider.propTypes = {
  nftContract: PropTypes.shape({
    account: PropTypes.shape({
      signAndSendTransaction: PropTypes.func,
    }),
    contractId: PropTypes.string.isRequired,
    nft_token: PropTypes.func.isRequired,
    nft_burn: PropTypes.func.isRequired,
    nft_tokens: PropTypes.func.isRequired,
    nft_total_supply: PropTypes.func.isRequired,
    nft_tokens_for_owner: PropTypes.func.isRequired,
    nft_tokens_for_type: PropTypes.func.isRequired,
    nft_tokens_batch: PropTypes.func.isRequired,
    nft_mint: PropTypes.func.isRequired,
    nft_approve: PropTypes.func.isRequired,
    nft_approve_owner: PropTypes.func.isRequired,
    nft_supply_for_owner: PropTypes.func.isRequired,
    nft_transfer: PropTypes.func.isRequired,
  }).isRequired,
  children: ReactChildrenTypeRequired,
};
