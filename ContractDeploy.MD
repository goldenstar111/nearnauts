near dev-deploy --wasmFile out/main.wasm
// deploy nft contract
yarn dev 
near deploy --accountId=nearnautnft.near --wasmFile out/main.wasm
// get nearnautsnft.near - your NFT contract

// create market contract 
near create-account market.nearnautnft.near --masterAccount=nearnautnft.near --initial-balance 10

// deploy nft market contract
near deploy --accountId=market.nearnautnft.near --wasmFile out/market_main.wasm

// init nft contract
near call nearnautsnft.near new {"owner_id":"nearnautsnft.near","metadata":{"spec":"nft-1","name":"Nearnauts","symbol":"NAUT"},"supply_cap_by_type":{"naut": "100000"}, "unlocked": true, "free_mints":0,  "use_storage_fees": false} --accountId=nearnautsnft.near

//json
near call nearnautsnft.near new "{\"owner_id\":\"nearnautsnft.near\",\"metadata\":{\"spec\":\"nft-1\",\"name\":\"Nearnauts\",\"symbol\":\"NAUT\"},\"supply_cap_by_type\":{\"naut\": \"100000\"}, \"unlocked\": true, \"free_mints\":0, \"use_storage_fees\": false}" --accountId=nearnautsnft.near

// init market 
near call market.nearnautsnft.near new '{"owner_id": "nearnautsnft.near", "ft_token_ids": [], "use_storage_fees": false}' --accountId=nearnautsnft.near

//json

near call market.nearnautnft.near new "{\"owner_id\": \"nearnautnft.near\", \"ft_token_ids\": [], \"use_storage_fees\": false}" --accountId=nearnautnft.near



///////new///////

near call nearnautnft.near new_default_meta  "{\"owner_id\":\"nearnautnft.near\"}" --accountId=nearnautnft.near

near call market.nearnautnft.near new "{\"owner_id\": \"nearnautnft.near\", \"ft_token_ids\": [], \"use_storage_fees\": false}" --accountId=nearnautnft.near

near call nearnautnft.near set_mint_price "{\"mint_price\": \"10000000000000000000000000\"}" --accountId=nearnautnft.near

near call nearnautnft.near nft_mints "{\"receiver_id\": \"nearnauts.near\"}" --accountId=nearnautnft.near
near call nearnautnft.near nft_mints "{\"receiver_id\": \"nearnautnft.near\"}" --accountId=nearnautnft.near

near call nearnautnft.near set_owner "{\"owner_id\": \"stakein.near\"}" --accountId=nearnautnft.near

near call nearnautsnft.near nft_tokens "{\"from_index\": \"0\",\"limit\": \"5\"}" --accountId=nearnautsnft.near

near call nearnautnft.near nft_burn "{\"token_id\": \"token-naut-16398239238081\",\"owner_id\": \"3fdaa7b828b82024d3a8210b61092a44b67893c0246ff7997a37cc8de6a584f9\"}" --accountId=nearnautnft.near