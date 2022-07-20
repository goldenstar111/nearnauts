import React from 'react';

import { MintSuccessMessage, BuySuccessMessage } from '~/components/common/messages';

export const PAYABLE_METHODS = {
  MINT_AND_LIST_NFT: 'MINT_AND_LIST_NFT',
  OFFER: 'OFFER',
  PAY_STORAGE: 'PAY_STORAGE',
  LIST: 'LIST',
  UNLIST: 'UNLIST',
  NFT_TRANSFER: 'NFT_TRANSFER'
};

export const PAYABLE_METHODS_DESCRIPTIONS = {
  [PAYABLE_METHODS.MINT_AND_LIST_NFT]: 'minting and listing a naut',
  // todo: change description once offers can be made below 'buy now' price
  [PAYABLE_METHODS.OFFER]: 'buying a naut',
  [PAYABLE_METHODS.PAY_STORAGE]: 'paying storage fee',
  [PAYABLE_METHODS.LIST]: 'listing a naut on the market',
  [PAYABLE_METHODS.UNLIST]: 'unlisting a naut on the market',
  [PAYABLE_METHODS.NFT_TRANSFER]: 'transfer a naut',
};

export const PAYABLE_METHODS_SUCCESS_MESSAGES = {
  [PAYABLE_METHODS.MINT_AND_LIST_NFT]: <MintSuccessMessage />,
  // todo: change message once offers can be made below 'buy now' price
  [PAYABLE_METHODS.OFFER]: <BuySuccessMessage />,
  [PAYABLE_METHODS.PAY_STORAGE]: 'Thank you! Storage fee has been paid!',
  [PAYABLE_METHODS.UNLIST]: 'Your naut has been unlisted!',
  [PAYABLE_METHODS.NFT_TRANSFER]: 'Your naut has been transfered!',
};
