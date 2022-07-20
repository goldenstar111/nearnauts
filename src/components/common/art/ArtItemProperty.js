import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '~/components/common/buttons';
import { Media, MediaFromIpfs } from '~/components/common/media';

import { FullscreenIcon , PlayIcon } from '~/components/common/icons';

import { convertKBtoMB, isFileTypeAnimatedImage, isFileTypeVideo } from '~/utils/files';
import {Trait} from '~/components/Trait.js';

import { APP } from '~/constants';

import { square } from '~/styles/mixins';

const Container = styled('div')`
  position: relative;
  
  max-width: 100%;
  margin: 15px 5px;
  border-radius: var(--radius-default);
  transition: 250ms;
  display: flex;
  flex-direction: row;

  :hover {
    transform: scale(1.01);
  }

  .left-align{
    text-align: left;
    left: 20px;
  }

  .fullscreen-icon {
    position: absolute;
    bottom: 0;
    right: 0;
    cursor: pointer;
    background-color: rgba(var(--plum-base), 0.2);
    border: 1px solid #ffffff;
    border-radius: 0 0 var(--radius-default) 0;
  }

  .play-icon {
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    padding: 7px 5px 7px 7px;
    border: 1px solid #ffffff;
    border-radius: var(--radius-default) 0 0 0;
    background-color: rgba(var(--plum-base), 0.2);
    cursor: pointer;
  }

  .attributes{
    background-color: #15b2e50f;
    border-radius: 6px;
    border: 1px solid #315560;
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: center;
    width: 150px;
    
  }

  .attributes-atr{
    color: #bdd2e5;
    font-size: 15px;
    line-height: 16px;
    min-height: 16px;
  }

  .attributes-value{
    color: #f9f9f9;
    font-size: 16px;
    font-weight: 500;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .attributes-tytle{
    color: #b1f785;
    font-size: 15px;
    font-weight: 500;
    text-transform: uppercase;
  }

  .wrapped-attributes{
    padding: 10px;
  }

  .all-attributes{
    display: flex;
    padding-left: 20px;
    align-items: center;
    justify-content: center;
  }

  button {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }

  @media (max-width: 727px) {
    width: 320px;
    display: block;
    .all-attributes{
      padding-left: 0px;
    }
    
  }

  @media (max-width: 388px) {
    .attributes{
      max-width: 100px;
    }
  }

`;

const ImageContainer = styled(Link)`
  ${square};

  display: flex;
  justify-content: center;
  align-items: center;

  .hidden {
    display: none;
  }

  width: 400px;
  max-width: 100%;
  border-radius: var(--radius-default);

  @media (max-width: 500px) {
    width: 320px;
  }

  .rarity-rank {
    position: absolute;
    top: 15px;
    right: 20px;
    font-size: 20px;

    border-radius: 6px;
    border-bottom: 1px solid;
  }
`;

const ArtItemProperty = ({
  nft,
  buttonText,
  isLink,
  isButtonDisabled,
  isFromIpfs,
  isFullScreenEnabled,
  onButtonClick,
  onTransferButtonClick,
  transferButtonText,
  forwardedRef,
  rankText='?'
}) => {
  const location = useLocation();
  const [fileType, setFileType] = useState(null);
  const [attributesBackground, setAttributesBackground] = useState ('.');
  const [attributesChains, setAttributesChains] = useState ('.');
  const [attributesEyes, setAttributesEyes] = useState ('.');
  const [attributesFur, setAttributesFur] = useState ('.');
  const [attributesHelmets, setAttributesHelmets] = useState ('.');
  const [attributesVisors, setAttributesVisors] = useState ('.');
  const [attributesSpacesuits, setAttributesSpacesuits] = useState ('.');
  const [attributesMouths, setAttributesMouths] = useState ('.');

  const [rateBackground, setRateBackground] = useState ('1');
  const [rateChains, setRateChains] = useState ('1');
  const [rateEyes, setRateEyes] = useState ('1');
  const [rateFur, setRateFur] = useState ('1');
  const [rateHelmets, setRateHelmets] = useState ('1');
  const [rateVisors, setRateVisors] = useState ('1');
  const [rateSpacesuits, setRateSpacesuits] = useState ('1');
  const [rateMouths, setRateMouths] = useState ('1');
  const TraitData = Trait;
  
  useEffect(() => {

    if (nft?.metadata?.extra) {
      const extra = JSON.parse(nft.metadata.extra);


      setFileType(extra.media_type);
      setAttributesBackground(extra?.attributes_background);
      setAttributesChains(extra?.attributes_chains);
      setAttributesEyes(extra?.attributes_eyes);
      setAttributesFur(extra?.attributes_fur);
      setAttributesHelmets(extra?.attributes_helmets);
      setAttributesVisors(extra?.attributes_visors);
      setAttributesSpacesuits(extra?.attributes_spacesuits);
      setAttributesMouths(extra?.attributes_mouths);

      setRateBackground(TraitData["Backgrounds"][extra.attributes_background]);
      setRateChains(TraitData["Chains"][extra.attributes_chains]);
      setRateEyes(TraitData["Eyes"][extra.attributes_eyes]);
      setRateFur(TraitData["Fur"][extra.attributes_fur]);
      setRateHelmets(TraitData["Helmets"][extra.attributes_helmets]);
      setRateVisors(TraitData["Visors"][extra.attributes_visors]);
      setRateSpacesuits(TraitData["Spacesuits"][extra.attributes_spacesuits]);
      setRateMouths(TraitData["Mouths"][extra.attributes_mouths]);





    }
  }, [nft]);

  const imageContainerParams = {
    to: isLink
      ? {
          pathname: `/gem/${nft?.token_id}`,
          prevPathname: location.pathname,
        }
      : undefined,
    as: isLink ? Link : 'div',
  };

  const getIpfsHashMedia = () => {
    let extra;
    let mediaLowRes;
    let mediaType;
    let mediaSize;

    if (nft?.metadata?.extra) {
      extra = JSON.parse(nft.metadata.extra);
      mediaLowRes = extra.media_lowres;
      mediaType = extra.media_type;
      mediaSize = extra.media_size;
    }

    if (
      mediaType &&
      mediaSize &&
      (isFileTypeAnimatedImage(mediaType) || isFileTypeVideo(mediaType)) &&
      convertKBtoMB(mediaSize) < APP.AN_MEDIA_MAX_SIZE_BEFORE_THUMBNAIL_MB
    ) {
      return nft?.metadata?.media || mediaLowRes;
    }

    return mediaLowRes || nft?.metadata?.media;
  };

  return (
    <Container className="art-item">
      <ImageContainer className="image-container" {...imageContainerParams} title={nft?.metadata?.title}>
        {isFromIpfs ? (
          <>
          <MediaFromIpfs media={getIpfsHashMedia()} forwardedRef={forwardedRef} alt={nft?.metadata?.title} />
          <div className="rarity-rank">
            &nbsp;{`Rank #${rankText}`}&nbsp;
          </div>
          </>
        ) : (
          <Media ref={forwardedRef} src={nft?.metadata?.media} alt={nft?.metadata?.title} />
        )}
        {isFullScreenEnabled && nft?.token_id && (
          <Link
            to={{
              pathname: `/gem-original/${nft.token_id}`,
              prevPathname: location.pathname,
            }}
            title="Original"
          >
            <FullscreenIcon />
          </Link>
        )}
      </ImageContainer>
      
      <div className="all-attributes">
        <div className="wrapped-attributes">
          <div className = "attributes">
            <div className = "attributes-tytle">{'Background'}</div>
            <div className = "attributes-value">{attributesBackground}</div>
            <div className = "attributes-atr">{rateBackground +'% have this trait'}</div>
          </div>
          <div className = "attributes">
            <div className = "attributes-tytle">{'Chain'}</div>
            <div className = "attributes-value">{attributesChains}</div>
            <div className = "attributes-atr">{rateChains + '% have this trait'}</div>
          </div>
          <div className = "attributes">
            <div className = "attributes-tytle">{'Eye'}</div>
            <div className = "attributes-value">{attributesEyes}</div>
            <div className = "attributes-atr">{rateEyes + '% have this trait'}</div>
          </div>
          <div className = "attributes">
            <div className = "attributes-tytle">{'Fur'}</div>
            <div className = "attributes-value">{attributesFur}</div>
            <div className = "attributes-atr">{rateFur + '% have this trait'}</div>
          </div>
        </div>
        <div className="wrapped-attributes">
          <div className = "attributes">
            <div className = "attributes-tytle">{'Helmet'}</div>
            <div className = "attributes-value">{attributesHelmets}</div>
            <div className = "attributes-atr">{rateHelmets + '% have this trait'}</div>
          </div>
          <div className = "attributes">
            <div className = "attributes-tytle">{'Mouth'}</div>
            <div className = "attributes-value">{attributesMouths}</div>
            <div className = "attributes-atr">{rateMouths + '% have this trait'}</div>
          </div>
          <div className = "attributes">
            <div className = "attributes-tytle">{'Spacesuit'}</div>
            <div className = "attributes-value">{attributesSpacesuits}</div>
            <div className = "attributes-atr">{rateSpacesuits + '% have this trait'}</div>
          </div>
          <div className = "attributes">
            <div className = "attributes-tytle">{'Visor'}</div>
            <div className = "attributes-value">{attributesVisors}</div>
            <div className = "attributes-atr">{rateVisors + '% have this trait'}</div>
          </div>
      </div>
      </div>
      {transferButtonText && (
        <Button className="left-align" isSecondary isSmall isDisabled={isButtonDisabled} onClick={onTransferButtonClick}>
          {transferButtonText}
        </Button>
      )}
      
    </Container>
  );
};

ArtItemProperty.propTypes = {
  nft: PropTypes.shape({
    token_id: PropTypes.string,
    metadata: PropTypes.shape({
      title: PropTypes.string,
      media: PropTypes.string,
      extra: PropTypes.string,
    }),
  }),
  buttonText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isLink: PropTypes.bool,
  isButtonDisabled: PropTypes.bool,
  isFullScreenEnabled: PropTypes.bool,
  isFromIpfs: PropTypes.bool,
  onButtonClick: PropTypes.func,
  forwardedRef: PropTypes.object,
};

ArtItemProperty.defaultProps = {
  onButtonClick: () => {},
};

export default ArtItemProperty;
