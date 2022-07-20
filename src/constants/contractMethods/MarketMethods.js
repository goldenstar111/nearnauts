const MarketMethods = {
  viewMethods: [
    'get_sales_by_nft_contract_id',
    'get_sales_by_nft_contract_id_from_end',
    'get_sale',
    'get_supply_sales',
    'storage_paid',
    'storage_amount',
    'get_supply_by_owner_id',
    'get_traded_volume'
  ],
  changeMethods: ['offer', 'remove_sale', 'storage_deposit'],
};

export default MarketMethods;
