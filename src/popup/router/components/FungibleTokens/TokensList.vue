<template>
  <div>
    <div v-if="filteredResults.length > 0">
      <TokenDisplay
        v-for="value in filteredResults"
        :key="value.contract || value.id"
        :tokenData="value"
      />
    </div>
    <div v-else class="tokens-msg">{{ $t('pages.fungible-tokens.no-results') }}</div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState, mapGetters } from 'vuex';
import TokenDisplay from './TokenDisplay';
import { removeDuplicates } from '../../../utils/helper';

export default {
  components: {
    TokenDisplay,
  },
  props: {
    showMyTokens: { type: Boolean },
    searchTerm: { type: String, default: '' },
  },
  data: () => ({
    tokensPublicInfo: {},
  }),
  async created() {
    try {
      const tokens = (
        await axios.get(
          `https://api.coingecko.com/api/v3/coins/markets?ids=aeternity&vs_currency=${this.current.currency}`,
        )
      ).data;
      this.tokensPublicInfo = tokens && tokens.length > 0 ? tokens : {};
    } catch (e) {
      console.error(`Cannot fetch tokens: ${e}`);
    }
  },
  computed: {
    ...mapState(['tokenBalances', 'tokenInfo', 'current']),
    ...mapGetters(['tokenBalance', 'balanceCurrency']),
    /**
     * Returns the default aeternity meta information
     */
    aeternityToken() {
      return {
        ...this.tokensPublicInfo[0],
        convertedBalance: this.tokenBalance,
        symbol: 'AE',
        balanceCurrency: this.balanceCurrency,
        contract: '',
      };
    },
    /**
     * Converts the token information object into a searchable list
     */
    convertedTokenInfo() {
      return Object.entries(this.tokenInfo).map(([contract, tokenData]) => ({
        name: tokenData.name,
        symbol: tokenData.symbol,
        contract: contract,
        decimals: tokenData.decimals,
        convertedBalance: tokenData.convertedBalance,
      }));
    },
    tokensInfo() {
      return [{ ...this.aeternityToken }, ...this.convertedTokenInfo];
    },
    filteredResults() {
      let tokensList = null;

      tokensList = this.tokensInfo;

      if (this.showMyTokens) {
        tokensList = [{ ...this.aeternityToken }, ...this.tokenBalances];
      }

      if (this.searchTerm.trim().length === 0) {
        return removeDuplicates(tokensList);
      }

      const term = this.searchTerm.trim().toLowerCase();

      const searchResults = tokensList.filter(
        token =>
          token.symbol.toLowerCase().includes(term) ||
          token.name.toLowerCase().includes(term) ||
          token.contract.toLowerCase().includes(term),
      );
      return removeDuplicates([...searchResults]);
    },
  },
};
</script>

<style lang="scss" scoped>
.tokens-msg {
  text-align: center;
  margin-top: 15px;
}
</style>
