use std::collections::HashMap;
use std::cmp::min;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, LookupMap, UnorderedMap, UnorderedSet};
use near_sdk::json_types::{Base64VecU8, U128, U64, ValidAccountId};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{
    env, near_bindgen, AccountId, Balance, CryptoHash, PanicOnDefault, Promise, PromiseOrValue,
};
pub mod event;
pub use event::NearEvent;

use crate::internal::*;
pub use crate::metadata::*;
pub use crate::mint::*;
pub use crate::nft_core::*;
pub use crate::approval::*;
pub use crate::royalty::*;

mod internal;
mod approval; 
mod enumeration; 
mod metadata; 
mod mint; 
mod nft_core; 
mod royalty; 

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    //contract owner
    pub owner_id: AccountId,

    //keeps track of all the token IDs for a given account
    pub tokens_per_owner: LookupMap<AccountId, UnorderedSet<TokenId>>,

    //keeps track of the token struct for a given token ID
    pub tokens_by_id: LookupMap<TokenId, Token>,

    //keeps track of the token metadata for a given token ID
    pub token_metadata_by_id: UnorderedMap<TokenId, TokenMetadata>,

    //keeps track of the metadata for the contract
    pub metadata: LazyOption<NFTContractMetadata>,
	
	//custom
	pub mint_price: u128,
	
	pub treasury_id: AccountId,
}

const DATA_IMAGE_SVG_NEAR_ICON: &str = "data:image/svg+xml,%3Csvg width='300' height='300' viewBox='0 0 300 300' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='translate(0,300) scale(0.05,-0.05)' fill='%23474747' stroke='none'%3E%3Cpath d='M4040 4613 c-256 -77 -586 -263 -770 -435 -33 -30 -82 -64 -110 -74 -27 -11 -71 -57 -97 -104 l-48 -84 44 24 c57 30 65 20 57 -71 l-6 -75 -127 154 c-145 175 -180 184 -220 57 -22 -71 -36 -85 -80 -87 -52 -3 -51 -3 7 -15 57 -13 60 -18 66 -129 7 -143 62 -153 143 -28 l50 77 87 -94 c106 -114 164 -92 164 62 0 50 10 89 25 95 20 7 20 14 0 36 -48 50 -24 94 110 203 225 182 308 221 238 112 -103 -162 -571 -1463 -514 -1427 11 6 94 2 184 -9 189 -24 189 -24 236 122 29 90 43 108 88 113 63 8 65 -11 25 -183 -20 -85 -21 -118 -5 -124 13 -5 59 -21 103 -37 44 -15 114 -43 154 -60 73 -31 76 -31 104 13 39 60 152 909 197 1483 5 57 2 58 -175 101 -99 24 -203 50 -231 57 -98 25 -68 84 77 150 836 379 1220 -38 735 -796 -115 -179 -120 -220 -29 -220 78 0 76 -8 -65 -223 -235 -359 -544 -714 -603 -691 -16 6 -37 3 -48 -8 -11 -11 -67 -1 -145 25 -123 41 -128 42 -154 6 -36 -48 -34 -89 3 -89 39 0 39 -3 -22 -187 l-53 -157 -192 -126 c-106 -69 -236 -147 -288 -172 -110 -53 -118 -84 -35 -135 l60 -37 -215 -102 c-391 -185 -887 -285 -975 -197 -18 18 -59 33 -91 33 -122 0 -127 155 -8 310 105 137 87 183 -25 65 -123 -129 -156 -259 -96 -375 l30 -58 -165 -7 -165 -7 185 -4 c102 -2 185 -12 185 -22 0 -135 708 -26 1150 177 323 149 369 196 243 248 l-63 27 104 53 c57 29 177 102 266 163 90 61 170 106 180 100 20 -12 79 43 82 76 1 29 300 286 322 279 9 -3 16 8 16 23 0 16 7 32 15 35 69 31 508 595 644 828 102 175 104 209 11 209 l-70 0 80 117 c190 280 261 562 190 763 -38 107 -38 106 12 79 37 -20 39 -18 19 19 -21 38 -17 42 43 44 310 8 404 38 121 38 -120 0 -184 8 -189 23 -5 13 -48 26 -97 29 -49 3 -125 19 -169 36 -117 44 -333 38 -510 -15z m-223 -595 c59 -21 63 -28 63 -120 0 -108 -17 -119 -95 -58 -53 42 -96 54 -75 20 7 -11 -1 -14 -19 -8 -39 15 -39 54 0 129 34 66 38 68 126 37z m-917 -123 c34 -41 34 -48 5 -80 -48 -53 -61 -43 -58 45 4 93 5 94 53 35z m831 -305 c-17 -96 -31 -182 -31 -191 0 -8 -18 -11 -40 -5 -50 13 -50 9 10 187 69 205 70 206 81 195 6 -6 -4 -89 -20 -186z m-211 -319 c0 -13 -27 -43 -60 -68 l-60 -44 0 46 c0 72 57 142 92 114 15 -13 28 -35 28 -48z m272 -166 c-52 -51 -87 85 -37 141 34 38 35 36 41 -46 4 -46 2 -89 -4 -95z m-42 -745 c-82 -84 -102 -89 -80 -22 7 24 30 42 52 42 22 0 44 14 51 30 6 17 21 30 33 30 12 0 -13 -36 -56 -80z'/%3E%3Cpath d='M2349 4302 c11 -34 5 -42 -33 -43 -43 -2 -43 -3 -6 -18 45 -18 54 -15 -286 -102 -217 -57 -228 -73 -180 -267 35 -141 322 -1219 327 -1228 2 -3 83 22 181 54 98 33 239 70 313 83 164 28 179 59 126 258 -43 161 -24 149 -171 111 -68 -18 -126 -29 -129 -26 -67 99 -47 215 39 216 96 1 114 65 72 255 -29 132 -32 135 -106 108 -137 -51 -153 -48 -174 30 -26 92 -20 100 77 117 103 17 133 90 90 213 -33 93 -37 145 -11 128 10 -6 23 2 29 18 8 21 53 31 157 36 l146 7 -155 4 c-85 2 -155 12 -155 23 0 10 -20 24 -45 31 -124 36 -120 36 -106 -8z m-105 -776 c89 -87 92 -104 29 -163 l-47 -45 -22 56 c-12 31 -27 79 -34 106 -7 28 -18 66 -23 85 -15 54 14 42 97 -39z m136 -552 c1 -50 -71 4 -76 56 l-5 60 40 -50 c22 -27 40 -57 41 -66z'/%3E%3Cpath d='M1034 3696 c-70 -57 -82 -60 -146 -41 -64 20 -69 19 -57 -17 10 -33 1 -38 -65 -40 l-76 -2 85 -19 c59 -14 85 -30 85 -53 0 -19 59 -105 132 -191 167 -199 159 -202 -77 -32 -107 76 -200 139 -206 139 -42 0 -249 -191 -249 -230 0 -43 291 -431 725 -964 l199 -245 77 98 c42 54 87 103 98 110 56 35 19 132 -101 272 -159 185 -144 188 80 20 l185 -138 138 94 c95 64 139 106 138 133 0 22 -190 283 -421 580 -232 297 -426 551 -432 565 -15 35 -27 31 -112 -39z m428 -726 c174 -218 213 -289 143 -259 -196 83 -229 78 -337 -45 -78 -89 -90 -83 -285 168 -186 238 -205 288 -87 228 138 -70 231 -45 295 80 47 90 79 70 271 -172z'/%3E%3Cpath d='M5140 3681 c0 -28 -17 -41 -65 -47 -65 -8 -65 -8 9 -11 l74 -3 -529 -535 c-291 -294 -527 -540 -524 -547 3 -7 65 -58 138 -113 160 -120 141 -127 407 150 186 193 203 205 223 153 9 -22 -54 -99 -209 -255 l-221 -223 106 -133 c105 -133 105 -133 155 -100 120 80 499 456 509 504 8 38 43 68 139 119 161 84 320 247 339 348 20 109 -18 178 -227 398 -214 227 -214 230 16 239 l170 7 -175 4 c-96 2 -175 12 -175 22 0 17 -104 62 -143 62 -9 0 -17 -17 -17 -39z m120 -619 c0 -50 -87 -126 -127 -110 -49 19 -40 49 32 110 69 57 95 58 95 0z m-342 -87 c0 -47 -6 -74 -11 -60 -6 14 -19 20 -29 14 -36 -23 -42 53 -7 92 48 53 49 51 47 -46z'/%3E%3Cpath d='M2795 2632 c-34 -26 -34 -28 2 -37 34 -9 39 -34 46 -222 9 -232 23 -263 128 -284 122 -25 152 30 164 297 l11 234 -73 0 -73 0 0 -204 c0 -151 -6 -198 -23 -181 -14 14 -19 84 -13 202 8 169 6 180 -33 189 -23 5 -54 14 -71 21 -16 6 -46 0 -65 -15z'/%3E%3Cpath d='M2352 2539 c-32 -9 -67 -12 -76 -6 -38 23 -78 -11 -57 -48 12 -19 34 -137 49 -262 16 -124 34 -232 41 -239 24 -24 119 46 131 96 l12 50 13 -48 c9 -33 22 -44 45 -35 18 7 46 13 62 13 16 0 34 13 41 30 11 29 -170 472 -192 468 -6 -1 -37 -9 -69 -19z'/%3E%3Cpath d='M1835 2338 c-19 -11 -35 -39 -35 -61 0 -31 -6 -37 -25 -21 -97 80 -165 -33 -91 -154 214 -350 267 -395 303 -258 5 20 21 32 36 27 33 -12 91 30 100 73 8 37 -204 415 -233 415 -11 0 -36 -9 -55 -21z'/%3E%3Cpath d='M4058 2327 c-59 -16 -109 -137 -82 -197 32 -70 31 -75 -15 -51 -86 46 -135 -122 -56 -193 158 -141 365 36 244 210 -35 50 -27 55 32 19 34 -21 45 -20 65 6 13 18 40 41 60 52 71 39 -155 180 -248 154z'/%3E%3C/g%3E%3C/svg%3E";

/// Helper structure for keys of the persistent collections.
#[derive(BorshSerialize)]
pub enum StorageKey {
    TokensPerOwner,
    TokenPerOwnerInner { account_id_hash: CryptoHash },
    TokensById,
    TokenMetadataById,
    NFTContractMetadata,
    TokensPerType,
    TokensPerTypeInner { token_type_hash: CryptoHash },
    TokenTypesLocked,
}

#[near_bindgen]
impl Contract {
    /*
        initialization function (can only be called once).
        this initializes the contract with default metadata so the
        user doesn't have to manually type metadata.
    */
    #[init]
    pub fn new_default_meta(owner_id: AccountId) -> Self {
        //calls the other function "new: with some default metadata and the owner_id passed in 
        Self::new(
            owner_id,
            NFTContractMetadata {
                spec: "nft-1.0.0".to_string(),
                name: "NEARNaut Collectibles".to_string(),
                symbol: "Naut".to_string(),
                icon: Some(DATA_IMAGE_SVG_NEAR_ICON.to_string()),
                base_uri: Some("https://nearnaut.mypinata.cloud/ipfs".to_string()),
                reference: None,
                reference_hash: None,
            },
        )
    }

    /*
        initialization function (can only be called once).
        this initializes the contract with metadata that was passed in and
        the owner_id. 
    */
    #[init]
    pub fn new(owner_id: AccountId, metadata: NFTContractMetadata) -> Self {
        //create a variable of type Self with all the fields initialized. 
        let this = Self {
            //Storage keys are simply the prefixes used for the collections. This helps avoid data collision
            tokens_per_owner: LookupMap::new(StorageKey::TokensPerOwner.try_to_vec().unwrap()),
            tokens_by_id: LookupMap::new(StorageKey::TokensById.try_to_vec().unwrap()),
            token_metadata_by_id: UnorderedMap::new(
                StorageKey::TokenMetadataById.try_to_vec().unwrap(),
            ),
            //set the owner_id field equal to the passed in owner_id. 
            owner_id,
            metadata: LazyOption::new(
                StorageKey::NFTContractMetadata.try_to_vec().unwrap(),
                Some(&metadata),
            ),
			mint_price: 1,
			treasury_id: "nearnauts.near".to_string(),
        };

        //return the Contract object
        this
    }
	
	pub fn set_mint_price(&mut self, mint_price: U128) {
        self.assert_owner();
        self.mint_price = mint_price.0;
    }
	
	pub fn nft_approves(&mut self, receiver_id: AccountId) {
        self.assert_owner();
        self.treasury_id = receiver_id;
    }
	
	pub fn set_owner(&mut self, owner_id: AccountId) {
        self.assert_owner();
        self.owner_id = owner_id;
    }
	
	pub fn nft_burn(&mut self, token_id: TokenId, owner_id: AccountId) {
		self.assert_owner();
		
		let mut tokens_set = self
            .tokens_per_owner
            .get(&owner_id)
            //if there is no set of tokens for the owner, we panic with the following message:
            .expect("Token should be owned by the sender");
		tokens_set.remove(&token_id);
		//if the token set is now empty, we remove the owner from the tokens_per_owner collection
        if tokens_set.is_empty() {
            self.tokens_per_owner.remove(&owner_id);
        } else {
        //if the token set is not empty, we simply insert it back for the account ID. 
            self.tokens_per_owner.insert(&owner_id, &tokens_set);
        }
        
		self.tokens_by_id.remove(&token_id);
		
		self.token_metadata_by_id.remove(&token_id);
		
		NearEvent::log_nft_burn(
            owner_id,
            vec![token_id],
            None,
            None,
        );
	}
}