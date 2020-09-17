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
    aeternityTokenInfo() {
      return {
        ...this.tokensPublicInfo[0],
        convertedBalance: this.tokenBalance,
        symbol: 'AE',
        balanceCurrency: this.balanceCurrency,
        contract: '',
      };
    },
    filteredResults() {
      let tokensList = null;

      tokensList = this.tokenInfo;

      if (this.showMyTokens) {
        tokensList = [...this.tokenBalances];
      }

      const hasDefaultToken = tokensList.findIndex(({ name }) => name === 'Aeternity');

      if (hasDefaultToken === -1) {
        tokensList.unshift({ ...this.aeternityTokenInfo });
      }

      if (this.searchTerm.trim().length === 0) {
        return this.removeDuplicates(tokensList);
      }

      const term = this.searchTerm.trim().toLowerCase();

      const symbolResults = tokensList.filter(token => token.symbol.toLowerCase().includes(term));

      const nameResults = tokensList.filter(token => token.name.toLowerCase().includes(term));

      const contractResults = tokensList.filter(token =>
        token.contract.toLowerCase().includes(term),
      );
      return this.removeDuplicates([...symbolResults, ...nameResults, ...contractResults]);
    },
  },
  methods: {
    removeDuplicates(arr) {
      const convertResultToSet = new Set([...arr]);
      return [...convertResultToSet];
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
