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
  computed: {
    ...mapState(['tokenBalances', 'tokenInfo', 'tokensPublicInfo']),
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
      return Object.entries(this.tokenInfo).map(token => ({
        name: token[1].name,
        symbol: token[1].symbol,
        contract: token[0],
        decimals: token[1].decimals,
        convertedBalance: token[1].convertedBalance,
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
