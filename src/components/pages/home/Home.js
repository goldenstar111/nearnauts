import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { NearContext, MarketContractContext, NftContractContext } from '~/contexts';

import { useInfiniteQueryGemsWithBlackList } from '~/hooks';

import { DisplayText } from '~/components/common/typography';
import { Contribute, MintPlus } from '~/components/common/popups';
import { ArtItemPriced } from '~/components/common/art';
import { Button } from '~/components/common/buttons';

import { DiamondIcon } from '~/components/common/icons';

import { QUERY_KEYS, APP } from '~/constants';
import { Loading } from '~/components/common/utils';
import  disNN  from '~/assets/images/NN.gif';
import  disBG  from '~/assets/images/BG.png';
import  nautslogo  from '~/assets/images/nautslogo.png';

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
    padding : 0px 150px;
    @media (max-width: 767px) {
       padding : 0px 20px;
    }
  }



  @media (min-width: 767px) {
    .description-container {
      margin-left: 0;
      margin-bottom: 60px;
      text-align: center;
    }
  }


  .title {
    color: #b2f35d;
  }
  .info {

  }
  .subpan{

  }
`;

export default function Home() {



  return (
    <Container >
      <div className="description-container" >
        <div className="nautslogo"><img className="nautsimage" src={nautslogo} /></div>
         
        <div className="desc"><h2>Mint, buy and sell NEARNauts - powered by the NEAR Network</h2></div>
      </div>
      <div className="items-container">
        <div className="subpan">
          <h2 className="title">About </h2>
          <div className="info">
            &nbsp;NEARNauts is a truly community driven, randomly generated NFT PFP project powered by the NEAR Network.<br/>
            &nbsp;NEARNauts aims to pioneer the NFT space on NEAR, by growing a completely organic, loyal community around the project. By entering the NEARNauts family, you are climbing aboard what aims to be the most sought after, rewarding club in the NEAR Ecosystem.

          </div>
        </div>
        <div className="subpan">
          <h2 className="title">Team </h2>
          <div className="info">
            <a href="https://twitter.com/tednaut" target="_blank"><h3>&nbsp;&nbsp;Founder</h3> </a>
            <div>
              &nbsp;Ted is the NEARNauts Founder, who created this passion project formed by his own interests. With a history in design and creation and a natural interest in NFT’s, NEARNauts was born.
            </div>
            <a href="https://twitter.com/goosebkk" target="_blank"><h3>&nbsp;&nbsp;Artist</h3> </a>
            <div>
              &nbsp;The resident artist Goose is an NFT artists who was found by Ted on twitter. They teamed up with the intention of bringing an NFT project with a never before seen style of artwork, with every aspect being absolutely original.
            </div>
            <a href="https://twitter.com/donnychakras" target="_blank"><h3>&nbsp;&nbsp;Head Marketer</h3> </a>
            <div>
              &nbsp;Head Marketer Donny has a history in cryptocurrency and marketing. Putting his passions together for NFTs and blockchain technology, he stepped up to the NEARNauts team to help bring eyes to the project.
            </div>
          </div>
        </div>
        <div className="subpan">
          <h2 className="title">Roadmap </h2>
          <div className="info">
            <h3>&nbsp;&nbsp;Phase 1 &nbsp;&nbsp;Q4 2021</h3>
            <div>
               ⁃ Create Artwork <br/>
               ⁃ Marketing Phase 1 <br/>
               ⁃ Community Engagement Focus <br/>
               ⁃ Networking <br/>
               ⁃ Vigorous Testnet Testing <br/>
               ⁃ Main net launch <br/>
               ⁃ Minting goes live (Dec 1st)
            </div>
            <h3>&nbsp;&nbsp;Phase 2 &nbsp;&nbsp;Q1 2022</h3>
            <div>
               ⁃ Community DAO goes live <br/>
               ⁃ Marketing Phase 2 <br/>
               ⁃ Continued Community Engagement <br/>
               ⁃ First Phase of Community Project Direction <br/>
               ⁃ Further Development
            </div>
          </div>
        </div>
        <div className="subpan">
          <h2 className="title">Verified Randomness </h2>
          <div className="info">
            &nbsp;NEARNauts uses a pool of traits of varying rarity percentages to generate the completed NFT’s, meaning these NFT’s will vary in rarity. To ensure fairness for all people who purchase NFT’s, we ensure verified randomness b VRF.<br />
            A Verifiable Random Function (VRF) is a tuple function that takes an input (x) to generate a pseudo-random output and proof that the output was generated randomly. The VRF includes three algorithms: generated, proof, and verification. First, the generated algorithm produces two pairs of keys: a secret key (SK) and a public key (pk). Next, the proof algorithm takes the secret key (SK) and the message (x) as an input to produce a pseudo-random output (y) along with a proof. Lastly, the verification algorithm takes the public key (pk), the message (x), as well as the output (y) and the proof to verify that the output (y) is true.<br />
              Verifiable Random Functions are vital to the development of smart contracts for various disciplines, including decentralized applications, security, layer two protocols, and blockchain networks. VRFs can be used to generate random properties of an NFT. Using the proof generated from the VRF, you can confirm the output was chosen randomly.
          </div>
        </div>
        <div className="subpan">
          <h2 className="title">Terms of Service</h2>
          <div className="info">
            <h3>&nbsp;&nbsp;1. Introduction to the Nearnauts!</h3>
            <div>
              &nbsp;NEARNauts is an NFT project by the NEARNauts team. All pre launch and post launch artwork is entirely owned by the NEARNauts Team and cannot be used without permission unless stated otherwise.
            </div>
            <h3>&nbsp;&nbsp;2. What We Own</h3>
            <div>
              &nbsp;NEARNauts which are minted by the community are owned by the minter and can be used in any capacity whether it be a pop, merchandise or sell it. 
            </div>
            <h3>&nbsp;&nbsp;3. Taxes</h3>
            <div>
              &nbsp;You are entirely responsible for any tax liability which may arise from minting or reselling your NEARNaut(s).
            </div>
          </div>
        </div>
        <div className="subpan">
          <h2 className="title">NEARNauts are not intended as Investments</h2>
          <div className="info">
            &nbsp;NEARNauts are meant to be a fun Non-Fungible Token for you to collect. They are not meant as investments. We make absolutely no promise or guarantee that these NFTs will be worth anything more than what you and the market deem the art to be worth. This could very well be zero. We give you our word that we will try to build a community and bring as much intangible
              value and worth to the project as we can! You understand that they have no inherent monetary value, and they should be treated as nothing more than a collectible with potential future value or lack thereof.
          </div>
        </div>
        <div className="subpan">
          <h2 className="title">Future Promises</h2>
          <div className="info">
            &nbsp;NEARNauts hopes to put out more content and create things in the future that you can
            all be proud of and have outlined many of our intentions as such. However, the landscape around DAOs and various other things we are hoping to do is shifting and legally grey in many ways. When you purchase your NEARNaut, you agree that your purchase from our initial launch of NFTs is all you are guaranteed to receive in exchange for your funds. Whether through primary or secondary channels, the art is what you receive. Any future benefits are ancillary to this purchase and not to be taken into consideration with your
            initial purchase. You agree that you are not relying on any future commitments by
            NEARNauts beyond the community treasury
            and participating in our NFT launch.
          </div>
        </div>
        <div className="subpan">
          <h2 className="title">Contract Address </h2>
          <div className="info">
          &nbsp;&nbsp;Nearnauts NFT contract address: nearnautnft.near<br />
          &nbsp;&nbsp;Nearnauts NFT marketplace address: market.nearnautnft.near<br />
          </div>
        </div>
      </div>
    </Container>
  );
}
