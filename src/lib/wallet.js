import { Node, MemoryAccount, RpcWallet } from '@aeternity/aepp-sdk/es';
import Swagger from '@aeternity/aepp-sdk/es/utils/swagger';
import { BrowserWindowMessageConnection } from '@aeternity/aepp-sdk/es/utils/aepp-wallet-communication/connection/browser-window-message';
import { isEmpty, times } from 'lodash-es';
import BigNumber from 'bignumber.js';
import FUNGIBLE_TOKEN_CONTRACT from 'aeternity-fungible-token/FungibleTokenFullInterface.aes';
import store from '../store';
import { postMessage } from '../popup/utils/connection';
import {
  parseFromStorage,
  fetchJson,
  IN_FRAME,
  toURL,
  getAeppAccountPermission,
  convertToken,
} from '../popup/utils/helper';
import { TIPPING_CONTRACT, TIPPING_CONTRACT_V2, NO_POPUP_AEPPS } from '../popup/utils/constants';
import Logger from './logger';
import Backend from './backend';

async function initMiddleware() {
  const { middlewareUrl } = store.getters.activeNetwork;
  const swag = await fetchJson(`${middlewareUrl}/middleware/api`);
  swag.paths['/names/auctions/{name}/info'] = {
    get: {
      operationId: 'getAuctionInfoByName',
      parameters: [
        {
          in: 'path',
          name: 'name',
          required: true,
          type: 'string',
        },
      ],
    },
  };
  const { api: middleware } = await Swagger.compose({
    methods: {
      urlFor: path => middlewareUrl + path,
      axiosError: () => '',
    },
  })({ swag });
  store.commit('setMiddleware', middleware);
  store.dispatch('names/fetchOwned');
  store.dispatch('names/extendNames');
}

async function logout() {
  store.commit('setActiveAccount', { publicKey: '', index: 0 });
  store.commit('updateAccount', {});
  store.commit('switchLoggedIn', false);
}

async function getKeyPair() {
  const { activeAccount } = store.state;
  const { account } = store.getters;
  const res = await postMessage({ type: 'getKeypair', payload: { activeAccount, account } });
  return res.error ? { error: true } : parseFromStorage(res);
}

async function initContractInstances() {
  if (!store.getters.mainnet && !process.env.RUNNING_IN_TESTS && process.env.NETWORK !== 'Testnet')
    return;
  const contractAddress = await store.dispatch('getTipContractAddress');
  const contractAddressV2 = await store.dispatch('getTipContractAddressV2');
  const contractInstance = await store.state.sdk.getContractInstance(TIPPING_CONTRACT, {
    contractAddress,
    forceCodeCheck: true,
  });
  const contractInstanceV2 = await store.state.sdk.getContractInstance(TIPPING_CONTRACT_V2, {
    contractAddress: contractAddressV2,
    forceCodeCheck: true,
  });
  store.commit('setTipping', contractInstance);
  store.commit('setTippingV2', contractInstanceV2);
}

async function tokenBalance(token, address) {
  const tokenContract = await store.state.sdk.getContractInstance(FUNGIBLE_TOKEN_CONTRACT, {
    contractAddress: token,
  });

  const { decodedResult } = await tokenContract.methods.balance(address);
  return new BigNumber(decodedResult || 0).toFixed();
}

async function loadTokenBalances(address) {
  const tokens = await Backend.getTokenBalances(address);
  await Promise.all(
    Object.entries(tokens).map(async token => {
      const balance = await tokenBalance(token[0], address);
      const convertedBalance = convertToken(balance, -token[1].decimals).toFixed(2);
      const objectStructure = {
        value: token[0],
        text: `${convertedBalance} ${token[1].symbol}`,
        symbol: token[1].symbol,
        name: token[1].name,
        decimals: token[1].decimals,
        contract: token[0],
        balance,
        convertedBalance,
      };
      if (Object.keys(store.state.tokenInfo[token[0]].length > 0)) {
        const tokenInfo = { ...store.state.tokenInfo };
        tokenInfo[token[0]] = { ...objectStructure };
        store.commit('setTokenInfo', tokenInfo);
      }

      return store.commit('addTokenBalance', objectStructure);
    }),
  );
}

let initSdkRunning = false;

export default {
  async init() {
    const { account } = store.getters;
    if (isEmpty(account)) {
      store.commit('setMainLoading', false);
      return { loggedIn: false };
    }
    const address = await store.dispatch('generateWallet', { seed: account.privateKey });
    store.commit('updateAccount', account);
    store.commit('setActiveAccount', { publicKey: address, index: 0 });

    store.commit('switchLoggedIn', true);

    store.commit('setMainLoading', false);
    return { loggedIn: true };
  },
  async initSdk() {
    if (initSdkRunning) return;
    initSdkRunning = true;
    const keypair = await getKeyPair();
    if (keypair.error) {
      await logout();
      return;
    }

    const { activeNetwork } = store.getters;
    const { internalUrl, compilerUrl } = activeNetwork;
    const node = await Node({
      url: internalUrl,
      internalUrl,
    });
    const account = MemoryAccount({ keypair });
    try {
      const acceptCb = (_, { accept }) => accept();

      const tokenInfo = await Backend.getTokenInfo();
      if (Object.keys(tokenInfo).length > 0) {
        store.commit('setTokenInfo', tokenInfo);
      }
      const sdk = await RpcWallet.compose({
        methods: {
          address: async () => store.getters.account.publicKey,
          sign: data => store.dispatch('accounts/sign', data),
          signTransaction: (txBase64, opt) =>
            store.dispatch('accounts/signTransaction', { txBase64, opt }),
        },
      })({
        nodes: [{ name: activeNetwork.name, instance: node }],
        accounts: [account],
        nativeMode: true,
        compilerUrl,
        name: 'Superhero',
        async onConnection({ info: { icons, name } }, { accept, deny }, origin) {
          const originUrl = toURL(origin);
          if (
            NO_POPUP_AEPPS.includes(originUrl.hostname) ||
            (await getAeppAccountPermission(originUrl.hostname, store.state.account.publicKey))
          ) {
            accept();
            return;
          }
          try {
            await store.dispatch('modals/open', {
              name: 'confirm-connect',
              app: {
                name,
                icons,
                protocol: originUrl.protocol,
                host: originUrl.hostname,
              },
            });
            await store.dispatch('setPermissionForAccount', {
              host: originUrl.hostname,
              account: store.state.account.publicKey,
            });
            accept();
          } catch (error) {
            deny();
            if (error.message !== 'Rejected by user') throw error;
          }
        },
        onSubscription: acceptCb,
        onSign: acceptCb,
        onMessageSign: acceptCb,
        onAskAccounts: acceptCb,
        onDisconnect(msg, client) {
          client.disconnect();
        },
      });

      if (IN_FRAME) {
        const connectedFrames = new Set();
        const connectToFrame = target => {
          if (connectedFrames.has(target)) return;
          connectedFrames.add(target);
          const connection = BrowserWindowMessageConnection({ target });
          const originalConnect = connection.connect;
          connection.connect = function connect(onMessage) {
            originalConnect.call(this, (data, origin, source) => {
              if (source !== target) return;
              onMessage(data, origin, source);
            });
          };
          sdk.addRpcClient(connection);
          sdk.shareWalletInfo(connection.sendMessage.bind(connection));
          setTimeout(() => sdk.shareWalletInfo(connection.sendMessage.bind(connection)), 3000);
        };

        connectToFrame(window.parent);
        const connectToParentFrames = () =>
          times(window.parent.frames.length, i => window.parent.frames[i])
            .filter(frame => frame !== window)
            .forEach(connectToFrame);
        connectToParentFrames();
        setInterval(connectToParentFrames, 3000);
      }

      await store.commit('initSdk', sdk);
      await initContractInstances();
      await initMiddleware();
      store.commit('setNodeStatus', 'connected');
      loadTokenBalances(keypair.publicKey);
      setTimeout(() => store.commit('setNodeStatus', ''), 2000);
    } catch (e) {
      store.commit('setNodeStatus', 'error');
      Logger.write(e);
    } finally {
      initSdkRunning = false;
    }
  },
};
