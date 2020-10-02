import { defaultNetwork } from '../popup/utils/constants';

export default {
  updateAccount(state, payload) {
    state.account = payload;
  },
  updateBalance(state, payload) {
    state.balance = payload;
  },
  switchNetwork(state, payload) {
    state.current.network = payload;
  },
  switchLoggedIn(state, payload) {
    state.isLoggedIn = payload;
  },
  updateLatestTransactions(state, payload) {
    state.transactions.latest = payload;
  },
  setPendingTxs(state, payload) {
    state.transactions.pending = payload;
  },
  setActiveAccount(state, payload) {
    state.account.publicKey = payload.publicKey;
    state.activeAccount = payload.index;
  },
  setNames(state, { names }) {
    state.names = names;
  },
  setUserNetwork(state, { index, ...network }) {
    if (index !== undefined) state.userNetworks[index] = network;
    else state.userNetworks.push({ ...defaultNetwork, ...network });
  },
  deleteUserNetwork(state, index) {
    state.userNetworks = state.userNetworks.filter((el, idx) => idx !== index);
  },
  initSdk(state, payload) {
    state.sdk = payload;
  },
  setMiddleware(state, payload) {
    state.middleware = payload;
  },
  setEncryptedWallet(state, payload) {
    state.encryptedWallet = payload;
  },
  setTipping(state, payload) {
    state.tipping = payload;
  },
  setTippingV2(state, payload) {
    state.tippingV2 = payload;
  },
  setMainLoading(state, payload) {
    state.mainLoading = payload;
  },
  setNodeStatus(state, payload) {
    state.nodeStatus = payload;
  },
  setCurrentCurrency(state, currency) {
    state.current.currency = currency;
  },
  setCurrencies(state, payload) {
    state.currencies = payload;
  },
  setNextCurrencyFetch(state, payload) {
    state.nextCurrenciesFetch = payload;
  },
  addNotification(state, payload) {
    state.notifications = [...state.notifications, { ...payload, visited: false }];
  },
  setNotificationsVisited(state) {
    state.notifications = state.notifications.map(n => ({ ...n, visited: true }));
  },
  setTipDetails(state, payload) {
    state.tip = payload;
  },
  setTxQueue(state, payload) {
    state.txQueue = [...state.txQueue, payload];
  },
  addConnectedAepp(state, { host, account }) {
    state.connectedAepps = { ...state.connectedAepps, [host]: [account] };
  },
  updateConnectedAepp(state, { host, account }) {
    state.connectedAepps = {
      ...state.connectedAepps,
      [host]: [...state.connectedAepps[host].accounts, account],
    };
  },
  setMnemonic(state, payload) {
    state.mnemonic = payload;
  },
  setBackedUpSeed(state, payload) {
    state.backedUpSeed = payload;
  },
  setTourRunning(state, payload) {
    state.tourRunning = payload;
  },
  setTourStatusBar(state, payload) {
    state.tourStartBar = payload;
  },
  setTippingAddress(state, payload) {
    state.tippingAddress = payload;
  },
  setTippingAddressV2(state, payload) {
    state.tippingAddressV2 = payload;
  },
  setSaveErrorLog(state) {
    state.saveErrorLog = !state.saveErrorLog;
  },
  setLoginTargetLocation(state, location) {
    state.loginTargetLocation = location;
  },
  setTokenInfo(state, payload) {
    state.tokenInfo = payload;
  },
  addTokenBalance(state, payload) {
    state.tokenBalances = [payload, ...state.tokenBalances]
      .filter((bal, idx, arr) => !arr.slice(0, idx).some(b => b.contract === bal.contract))
      .sort((a, b) => a.contract.localeCompare(b.contract));
  },
  setSelectedToken(state, payload) {
    state.selectedToken = payload;
  },
};
