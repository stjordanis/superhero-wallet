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
export const TIPPING_CONTRACT = `@compiler >= 4

include "List.aes"
include "Func.aes"
include "Option.aes"

contract OracleService =
  record success_claim = { success : bool, caller : address, percentage : int }

  stateful entrypoint check_persist_claim : (string, address, bool) => success_claim
  payable stateful entrypoint query_oracle : (string, address) => unit

contract Tipping =
  type tip_id = int
  type url_id = int
  type retip_id = int
  type url = string
  type claim_gen = int

  record tip = { sender : address, title : string, claim_gen : claim_gen, timestamp : int, url_id : url_id, amount : int }
  record retip = { sender : address, amount : int, claim_gen : claim_gen, tip_id : tip_id }
  record state = { urls : map(url, url_id), claims : map(url_id, claim_gen * int), url_index : map(url_id, url), tips : map(tip_id, tip), retips : map(retip_id, retip), owner : address, oracle_service : OracleService }

  payable stateful entrypoint tip : (string, string) => unit
  payable stateful entrypoint retip : (tip_id) => unit
  payable stateful entrypoint pre_claim : (string, address) => unit
  stateful entrypoint claim : (string, address, bool) => unit
  entrypoint get_state : () => state
  entrypoint unclaimed_for_url : (string) => int`;

export const TIPPING_CONTRACT_V2 = `// ISC License
//
// Copyright (c) 2020, aeternity developers
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
// AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
// LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
// OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
// PERFORMANCE OF THIS SOFTWARE.


// THIS IS NOT SECURITY AUDITED
// DO NEVER USE THIS WITHOUT SECURITY AUDIT FIRST

@compiler >= 4.2

contract TokenContract =
  stateful entrypoint transfer_allowance : (address, address, int) => unit
  stateful entrypoint transfer : (address, int) => unit

contract OracleService =
  record success_claim =
    { success : bool
    , account : address
    , percentage : int }

  stateful entrypoint check_persist_claim : (string, address, bool) => success_claim
  payable stateful entrypoint query_oracle : (string, address) => unit

contract FutureTippingContract =
  payable stateful entrypoint receive_migrate_balance: () => unit

contract Tipping =

  type tip_id       = int
  type url_id       = int
  type retip_id     = int
  type url          = string
  type claim_gen    = int
  type amount       = int
  type receiver     = address
  type receiver_str = string

  datatype tip
    = AeTip(tip_meta, url_id, amount, claim_gen)
    | TokenTip(tip_meta, url_id, tip_token_data, claim_gen)
    | DirectAeTip(tip_meta, receiver, amount)
    | DirectTokenTip(tip_meta, receiver, tip_token_data)

  record tip_token_data = { token : TokenContract
                          , amount : int }

  record tip_meta = { sender    : address
                    , title     : string
                    , timestamp : int }

  record retip = { sender       : address
                 , amount       : int
                 , token_amount : int
                 , claim_gen    : claim_gen
                 , token        : option(TokenContract)
                 , tip_id       : tip_id }

  record state = { urls           : map(url, url_id)
                 , claims         : map(url_id, claim_gen * int * map(TokenContract, int))
                 , url_index      : map(url_id, url)
                 , tips           : map(tip_id, tip)
                 , retips         : map(retip_id, retip)
                 , oracle_service : OracleService
                 , version        : string }

  datatype event
    = TipReceived(address, amount, url)
    | ReTipReceived(address, amount, url)
    | TipWithdrawn(address, amount, url)
    | TipTokenReceived(address, amount, url, TokenContract)
    | ReTipTokenReceived(address, amount, url, TokenContract)
    | TipDirectReceived(address, amount, receiver_str)
    | TipDirectTokenReceived(address, amount, receiver_str, TokenContract)

  entrypoint init(oracle_service : OracleService) : state =
    { urls = {},
      claims = {},
      url_index = {},
      tips = {},
      retips = {},
      oracle_service = oracle_service,
      version = "v2" }

  payable stateful entrypoint tip(url : string, title : string) : int =
    let url_id = get_url_id(url)
    let (last_claim_gen, amount, token_claims) = state.claims[url_id = (0, 0, {})]
    let tip_id = Map.size(state.tips)
    let tip_meta = { sender    = Call.caller
                   , title     = title
                   , timestamp = Chain.timestamp }
    put(state{ tips[tip_id] = AeTip(tip_meta, url_id, Call.value, last_claim_gen + 1),
               claims[url_id] = (last_claim_gen, amount + Call.value, token_claims) })
    Chain.event(TipReceived(Call.caller, Call.value, url))
    tip_id

  // if allowance is not created before or to little this will fail with NON_NEGATIVE_VALUE_REQUIRED
  stateful entrypoint tip_token(url : string, title : string, token : TokenContract, token_amount : int) : int =
    let url_id = get_url_id(url)
    let (last_claim_gen, amount, token_claims) = state.claims[url_id = (0, 0, {})]
    let tip_id = Map.size(state.tips)
    let tip_meta = { sender    = Call.caller
                   , title     = title
                   , timestamp = Chain.timestamp }
    let tip_token_data = { token  = token
                         , amount = token_amount }
    let updated_token_claims = token_claims{ [token = 0] @ previous_amount = previous_amount + token_amount }
    put(state{ tips[tip_id] = TokenTip(tip_meta, url_id, tip_token_data, last_claim_gen + 1),
               claims[url_id] = (last_claim_gen, amount, updated_token_claims) })
    token.transfer_allowance(Call.caller, Contract.address, token_amount)
    Chain.event(TipTokenReceived(Call.caller, token_amount, url, token))
    tip_id

  payable stateful entrypoint tip_direct(receiver: receiver, title : string) : int =
    let tip_id = Map.size(state.tips)
    let tip_meta = { sender    = Call.caller
                   , title     = title
                   , timestamp = Chain.timestamp }
    put(state{ tips[tip_id] = DirectAeTip(tip_meta, receiver, Call.value) })
    Chain.spend(receiver, Call.value)
    Chain.event(TipDirectReceived(Call.caller, Call.value, Address.to_str(receiver)))
    tip_id

  stateful entrypoint tip_token_direct(receiver: receiver, title : string, token : TokenContract, token_amount : int) : int =
    let tip_id = Map.size(state.tips)
    let tip_meta = { sender    = Call.caller
                   , title     = title
                   , timestamp = Chain.timestamp }
    let tip_token_data = { token  = token
                         , amount = token_amount }
    put(state{ tips[tip_id] = DirectTokenTip(tip_meta, receiver, tip_token_data) })
    token.transfer_allowance(Call.caller, Contract.address, token_amount)
    token.transfer(receiver, token_amount)
    Chain.event(TipDirectTokenReceived(Call.caller, token_amount, Address.to_str(receiver), token))
    tip_id

  payable stateful entrypoint retip(tip_id : tip_id) : int =
    require(Map.member(tip_id, state.tips), "TIP_NOT_EXISTING")
    let Some(url_id) = tip_url_id(state.tips[tip_id])
    let (last_claim_gen, amount, token_claims) = state.claims[url_id]
    let retip_id = Map.size(state.retips)
    let retip = { sender       = Call.caller
                , claim_gen    = last_claim_gen + 1
                , amount       = Call.value
                , token_amount = 0
                , token        = None
                , tip_id       = tip_id }
    put(state{ retips[retip_id] = retip,
               claims[url_id] = (last_claim_gen, amount + Call.value, token_claims) })
    Chain.event(ReTipReceived(Call.caller, Call.value, state.url_index[url_id]))
    retip_id

  // if allowance is not created before or to little this will fail with NON_NEGATIVE_VALUE_REQUIRED
  stateful entrypoint retip_token(tip_id : tip_id, token : TokenContract, token_amount : int) : int =
    require(Map.member(tip_id, state.tips), "TIP_NOT_EXISTING")
    let Some(url_id) = tip_url_id(state.tips[tip_id])
    let (last_claim_gen, amount, token_claims) = state.claims[url_id]
    let retip_id = Map.size(state.retips)
    let retip = { sender       = Call.caller
                , claim_gen    = last_claim_gen + 1
                , amount       = 0
                , token_amount = token_amount
                , token        = Some(token)
                , tip_id       = tip_id }
    let updated_token_claims = token_claims{ [token = 0] @ previous_amount = previous_amount + token_amount }
    put(state{ retips[retip_id] = retip,
               claims[url_id] = (last_claim_gen, amount, updated_token_claims) })
    token.transfer_allowance(Call.caller, Contract.address, token_amount)
    Chain.event(ReTipTokenReceived(Call.caller, token_amount, state.url_index[url_id], token))
    retip_id

  payable stateful entrypoint pre_claim(url : string, expected_account : address) =
    state.oracle_service.query_oracle(value = Call.value, url, expected_account)

  stateful entrypoint claim(url : string, account : address, recheck : bool) =
    require_allowed_oracle_service(url, account, recheck)
    require(Map.member(url, state.urls), "URL_NOT_EXISTING")
    let url_id = state.urls[url]
    let (last_claim_gen, amount, token_claims) = state.claims[url_id]
    Chain.spend(account, amount)
    Chain.event(TipWithdrawn(account, amount, url))
    [ token.transfer(account, token_amount) |  (token, token_amount) <- Map.to_list(token_claims) ]
    put(state{ claims[url_id] = (last_claim_gen + 1, 0, {}) })

  // GETTER FUNCTIONS

  entrypoint get_state() : state = state

  entrypoint tips_for_url(url : string) : list(tip) =
    require(Map.member(url, state.urls), "URL_NOT_EXISTING")
    let url_id = state.urls[url]
    [ t | (_, t) <- Map.to_list(state.tips), if (is_url_id(tip_url_id(t), url_id))]

  entrypoint retips_for_tip(tip_id : tip_id) : list(retip) =
    require(Map.member(tip_id, state.tips), "TIP_NOT_EXISTING")
    [ t | (_, t) <- Map.to_list(state.retips), if (t.tip_id == tip_id)]

  entrypoint unclaimed_for_url(url : string) : (int * map(TokenContract, int)) =
    require(Map.member(url, state.urls), "URL_NOT_EXISTING")
    let url_id = state.urls[url]
    let (_, amount, token_claims) = state.claims[url_id]
    (amount, token_claims)

  entrypoint check_claim(url : string, expected_account : address) =
    state.oracle_service.check_persist_claim(url, expected_account, false)

  // INTERNAL FUNCTIONS

  stateful function get_url_id(url) =
    switch(Map.lookup(url, state.urls))
      Some(url_id) => url_id
      None =>
        let url_id = Map.size(state.urls)
        put(state{ urls[url] = url_id, url_index[url_id] = url })
        url_id

  function require_allowed_oracle_service(url : string, account : address, recheck : bool) =
    let checked_claim = state.oracle_service.check_persist_claim(url, account, recheck)
    require(checked_claim.success, "ORACLE_SERVICE_CHECK_CLAIM_NOT_SUCCESSFULL")
    require(checked_claim.account == account, "ORACLE_SERVICE_CHECK_CLAIM_ADDRESS_NOT_MATCHING")

  function
    tip_url_id : tip => option(url_id)
    tip_url_id(AeTip(_, url_id, _, _)) = Some(url_id)
    tip_url_id(TokenTip(_, url_id, _, _)) = Some(url_id)
    tip_url_id(_) = None

  function
    is_url_id : (option(url_id), url_id) => bool
    is_url_id(Some(option_url_id), url_id) = option_url_id == url_id
    is_url_id(None, url_id) = false`;

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
  normal: 38,
  lg: 64,
};

export const BUG_REPORT_URL = 'https://thesuperherowallet.typeform.com/to/vh8Ffu';

export const CHANGE_CRYPTO_AE_URL = 'https://app.jelly.market';
