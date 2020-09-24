import { TxBuilder } from '@aeternity/aepp-sdk/es';
import { ABI_VERSIONS, TX_TYPE, VM_VERSIONS } from '@aeternity/aepp-sdk/es/tx/builder/schema';
import BigNumber from 'bignumber.js';

export const MAGNITUDE = 18;
export const TX_TYPES = {
  txSign: TX_TYPE.spend,
  contractCall: TX_TYPE.contractCall,
  contractCreate: TX_TYPE.contractCreate,
  namePreClaim: TX_TYPE.namePreClaim,
  nameClaim: TX_TYPE.nameClaim,
  nameBid: TX_TYPE.nameClaim,
  nameUpdate: TX_TYPE.nameUpdate,
};

export const HDWALLET_METHODS = [
  'unlockWallet',
  'generateWallet',
  'getKeypair',
  'getAccount',
  'isLoggedIn',
];

export const AEX2_METHODS = {
  CHANGE_ACCOUNT: 'CHANGE_ACCOUNT',
  ADD_ACCOUNT: 'ADD_ACCOUNT',
  SWITCH_NETWORK: 'SWITCH_NETWORK',
  LOGOUT: 'LOGOUT',
  INIT_RPC_WALLET: 'INIT_RPC_WALLET',
};

export const CONNECTION_TYPES = {
  EXTENSION: 'EXTENSION',
  POPUP: 'POPUP',
  OTHER: 'OTHER',
};

const STUB_ADDRESS = 'ak_enAPooFqpTQKkhJmU47J16QZu9HbPQQPwWBVeGnzDbDnv9dxp';
const STUB_CALLDATA =
  'cb_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACDJfUrsdAtW6IZtMvhp0+eVDUiQivrquyBwXrl/ujPLcgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJQQwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACUEMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJvjRF';
export const MAX_UINT256 = BigNumber(2)
  .exponentiatedBy(256)
  .minus(1);

export const calculateFee = (type, params) => {
  const MIN_FEE = TxBuilder.calculateMinFee(type, {
    params: {
      senderId: STUB_ADDRESS,
      recipientId: STUB_ADDRESS,
      amount: MAX_UINT256,
      ttl: MAX_UINT256,
      nonce: MAX_UINT256,
      ctVersion: { abiVersion: ABI_VERSIONS.SOPHIA, vmVersion: VM_VERSIONS.SOPHIA },
      abiVersion: ABI_VERSIONS.SOPHIA,
      callData: STUB_CALLDATA,
      ...params,
    },
  });
  const min = BigNumber(MIN_FEE).shiftedBy(-MAGNITUDE);
  const max = min.multipliedBy(10);
  return {
    min,
    max,
  };
};

export const defaultNetworks = [
  {
    url: 'https://testnet.aeternity.io',
    internalUrl: 'https://testnet.aeternity.io',
    networkId: 'ae_uat',
    middlewareUrl: 'https://testnet.aeternity.io',
    explorerUrl: 'https://testnet.aeternal.io',
    compilerUrl: 'https://latest.compiler.aepps.com',
    tokenRegistry: 'ct_UAzV9RcXEMsFcUCmrPN4iphbZroM7EHk3wvdidDYgZGGBo3hV',
    tokenRegistryLima: 'ct_Dnwribmd21YrxSQnqXCB5vTFPrgYJx2eg2TrbLvbdyEbTMejw',
    tipContract: 'ct_2Cvbf3NYZ5DLoaNYAU71t67DdXLHeSXhodkSNifhgd7Xsw28Xd',
    tipContractV2: 'ct_2ZEoCKcqXkbz2uahRrsWeaPooZs9SdCv6pmC4kc55rD4MhqYSu',
    name: 'Testnet',
  },
  {
    url: 'https://mainnet.aeternity.io',
    internalUrl: 'https://mainnet.aeternity.io',
    networkId: 'ae_mainnet',
    middlewareUrl: 'https://mainnet.aeternity.io',
    explorerUrl: 'https://mainnet.aeternal.io',
    compilerUrl: 'https://compiler.aepps.com',
    tokenRegistry: 'ct_UAzV9RcXEMsFcUCmrPN4iphbZroM7EHk3wvdidDYgZGGBo3hV',
    tokenRegistryLima: 'ct_UAzV9RcXEMsFcUCmrPN4iphbZroM7EHk3wvdidDYgZGGBo3hV',
    tipContract: 'superhero.chain',
    name: 'Mainnet',
  },
];

export const defaultNetwork =
  process.env.NETWORK === 'Testnet' ? defaultNetworks[0] : defaultNetworks[1];

export const AGGREGATOR_URL = 'https://superhero.com/';
export const BACKEND_URL = 'https://test-tipping.aeternity.art';
export const TIP_SERVICE = `${BACKEND_URL}/claim/submit`;
export const NO_POPUP_AEPPS = [
  'youdonotneedacapetobeahero.com',
  'superhero.com',
  'alpha.superhero.com',
  'beta.superhero.com',
  ...(process.env.NODE_ENV === 'development' ? ['localhost'] : []),
];

export const TXS_PER_PAGE = 30;
export const MAX_AMOUNT_WITHOUT_CONFIRM = 10;
export const AENS_DOMAIN = '.chain';
export const MAX_AUCTION_NAME_LENGTH = 12 + AENS_DOMAIN.length;
export const MIN_NAME_LENGTH = 14;
export const AUTO_EXTEND_NAME_BLOCKS_INTERVAL = 100;

export const IDENTICON_CONFIG = {
  lightness: {
    color: [0.4, 1.0],
    grayscale: [0.5, 1.0],
  },
  saturation: {
    color: 1.0,
    grayscale: 1.0,
  },
  backColor: '#12121bff',
};

export const AVATAR_CONFIG = {
  mode: 'exclude',
  accessoriesChance: 28,
  facialHairChance: 27,
  eyes: ['cry', 'close'],
  eyebrow: ['angry', 'sad', 'unibrow'],
  mouth: ['concerned', 'vomit', 'disbelief', 'grimace', 'sad', 'scream'],
  base64: true,
};

export const IDENTICON_SIZES = {
  'x-small': 20,
  small: 30,
  mid: 36,
  normal: 38,
  'x-lg': 56,
  lg: 64,
};

export const BUG_REPORT_URL = 'https://thesuperherowallet.typeform.com/to/vh8Ffu';

export const CHANGE_CRYPTO_AE_URL = 'https://app.jelly.market';
