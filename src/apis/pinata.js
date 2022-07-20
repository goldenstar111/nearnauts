import axios from 'axios';

import { APP } from '~/constants';

let pinataApiKey;
let pinataApiSecret;
let pinataHref;
let nodeHref;

  pinataApiKey = APP.PINATA_API_KEY;
  pinataApiSecret = APP.PINATA_API_SECRET;
  pinataHref = 'https://nearnaut.mypinata.cloud/ipfs';
  // nodeHref = 'https://nearnaut.herokuapp.com';
  nodeHref = 'https://api.nearnauts.io';

const pinataApiUrl = 'https://api.pinata.cloud';

const readBlobAsDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const readBlobAsText = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsText(blob);
  });

export const getFileData = async (hash) => {
  let response;

  try {
    response = await fetch(`${pinataHref}/${hash}`);
  } catch (e) {
    console.error(e);

    return null;
  }

  try {
    const blob = await response.blob();

    if (blob.type === 'application/json') {
      const text = await readBlobAsText(blob);

      return JSON.parse(text)?.file || null;
    }

    return await readBlobAsDataUrl(blob);
  } catch (e) {
    console.error(e);
  }

  return null;
};

function b64toBlob(dataURI) {
    
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
}

export const getFileDataFromNode = async (hash) => {
  let response;

  try {
    const seeder = { seed: '123' };
    response = await axios.post(`${nodeHref}`,seeder);
  } catch (e) {
    console.error(e);

    return null;
  }

  try {
    const blob = b64toBlob(response.data.data);
    return  {blob:blob,title:response.data.number};
  } catch (e) {
    console.error(e);
  }

  return null;
};

export const getGeneratedImageFromNode = async (account, amount) => {
  let response;
  let paras = {
    account: account,
    amount: amount
  }
  try {
    response = await axios.post(`${nodeHref}/generate`,paras);
  } catch (e) {
    console.error(e);

    return null;
  }

    const result = response.data;
    if(result.status=='success'){
      return  result.data;
    } else {
      return null;
    }


  return null;
};

export const mintToNode = async (account, hash) => {
  let response;
  let paras = {
    account: account,
    hash: hash
  }
  try {
    response = await axios.post(`${nodeHref}/minted`,paras);
    return response.data
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getMintNauts = async (account,hash) => {
  let response;
  let paras = {
    account: account,
    hash: hash
  }
  try {
    response = await axios.post(`${nodeHref}/get_mintnauts`,paras);

    if(response.data.status=='success'){
      return  response.data;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getItemlists = async (page_num,count_num,filter_str) => {
  let response;
  let paras = {
    page: page_num,
    count: count_num,
    filter: filter_str
  }
  try {
    response = await axios.post(`${nodeHref}/get_Itemlist`,paras);

    if(response.data.status=='success'){
      return  response.data.lists;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const setMintNauts = async (account) => {
  let response;
  let paras = {
    account: account
  }
  try {
    response = await axios.post(`${nodeHref}/set_mintnauts`,paras);

    if(response.data.status=='success'){
      return  response.data.data;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const setMintLists = async (lists) => {
  let response;
  let paras = {
    list: lists
  }
  try {
    response = await axios.post(`${nodeHref}/set_mintlist`,paras);

    if(response.data.status=='success'){
      return  response.data.data;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const uploadFileData = async (fileData) => {
  const data = {
    file: fileData,
  };

  const url = `${pinataApiUrl}/pinning/pinJSONToIPFS`;

  const response = await axios.post(url, data, {
    headers: {
      pinata_api_key: pinataApiKey,
      pinata_secret_api_key: pinataApiSecret,
    },
  });

  return response.data.IpfsHash;
};

export const uploadFile = async (file) => {
  const url = `${pinataApiUrl}/pinning/pinFileToIPFS`;

  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(url, formData, {
    maxBodyLength: 'Infinity', // this is needed to prevent axios from erroring out with large files
    headers: {
      // eslint-disable-next-line no-underscore-dangle
      'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      pinata_api_key: pinataApiKey,
      pinata_secret_api_key: pinataApiSecret,
    },
  });

  return response.data.IpfsHash;
};
