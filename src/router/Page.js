import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Route, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useDocumentTitle, useNativeSearchParams } from '~/hooks';
import { mintToNode } from '~/apis';
import { NearContext } from '~/contexts';
import { ERROR_REDIRECTS, PAYABLE_METHODS_DESCRIPTIONS, PAYABLE_METHODS_SUCCESS_MESSAGES, STORAGE, PAYABLE_METHODS } from '~/constants';

const Page = ({ component: Component, title, ...rest }) => {
  const query = useNativeSearchParams();
  const history = useHistory();

  useDocumentTitle(title);
  const { user } = useContext(NearContext);

  const payableMethod = localStorage.getItem(STORAGE.PAYABLE_METHOD_ITEM_NAME);

  useEffect(() => {
    if (payableMethod) {
      const errorCode = query.get('errorCode') && decodeURIComponent(query.get('errorCode'));
      const transactionHashes = query.get('transactionHashes') && decodeURIComponent(query.get('transactionHashes'));

      let newUrl = window.location.origin + window.location.hash;

      if (errorCode) {
        const errorMessage = query.get('errorMessage') && decodeURIComponent(query.get('errorMessage'));

        toast.error(
          `Sorry 😢 There was an error during ${PAYABLE_METHODS_DESCRIPTIONS[payableMethod]}. Message: '${errorMessage}'.`
        );

        if (errorCode in ERROR_REDIRECTS) {
          localStorage.removeItem(STORAGE.PAYABLE_METHOD_ITEM_NAME);
          newUrl = `${window.location.origin}/#${ERROR_REDIRECTS[errorCode]}`;

          history.push(ERROR_REDIRECTS[errorCode], { reason: ERROR_REDIRECTS[errorCode] });
        }
      }
      if (transactionHashes) {
        switch(payableMethod){
          case PAYABLE_METHODS.MINT_AND_LIST_NFT:
                const mintargs = localStorage.getItem(STORAGE.MINT_ITEM_ARGS);
                let paras = mintargs.split(',');
                // console.log('mint',paras)
                //localStorage.removeItem(STORAGE.MINT_ITEM_ARGS);
                //await mintToNode(user.accountId,paras);
                break;
          default: break;
        }
        toast.success(PAYABLE_METHODS_SUCCESS_MESSAGES[payableMethod]);
      }

      localStorage.removeItem(STORAGE.MINT_ITEM_ARGS);
      localStorage.removeItem(STORAGE.PAYABLE_METHOD_ITEM_NAME);
      window.history.pushState(null, null, newUrl);
    }
  }, []);

  return <Route {...rest} render={(props) => <Component {...rest} {...props} />} />;
};

Page.propTypes = {
  component: PropTypes.func,
  title: PropTypes.string,
};

export default Page;
