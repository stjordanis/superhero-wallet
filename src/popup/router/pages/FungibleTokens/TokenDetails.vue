<template>
  <div class="token-details">
    <div class="token-header">
      <div class="token-profile">
        <TokensAvatar :address="data.contract" :src="data.image || null" size="x-lg" />
        <div class="amount">
          <span class="text-ellipsis max-space" :title="data.convertedBalance || '0.00'">{{
            data.convertedBalance || '0.00'
          }}</span>
          <span class="symbol text-ellipsis max-space" :title="data.symbol">{{ data.symbol }}</span>
          <FormatFiatCurrency class="text-ellipsis max-space" :balance="data.balanceCurrency" />
        </div>
      </div>
      <div class="token-actions">
        <Button bold>
          <RouterLink :to="{ name: 'send' }">{{ $t('pages.token-details.send') }}</RouterLink>
        </Button>
        <Button bold>
          <RouterLink to="/receive">{{ $t('pages.token-details.receive') }}</RouterLink>
        </Button>
        <Button bold :disabled="!allowTipping">
          <RouterLink :to="{ name: 'tip' }">{{ $t('pages.token-details.tip') }}</RouterLink>
        </Button>
      </div>
    </div>
    <TabsMenu :method="selectTab" :tabOptions="tabs" :activeTab="tabs[0].value" />
    <div class="token-info">
      <div class="section-title">
        {{ $t('pages.token-details.token-details') }}
      </div>
      <DetailsRow :label="$t('pages.token-details.symbol')" :text="data.symbol"></DetailsRow>
      <DetailsRow
        :class="data.community ? 'community' : ''"
        :label="$t('pages.token-details.community')"
      ></DetailsRow>
      <DetailsRow :label="$t('pages.token-details.decimals')" :text="data.decimals"></DetailsRow>
      <DetailsRow
        v-if="data.contract"
        :class="data.contract ? 'contract' : ''"
        :label="$t('pages.token-details.contract')"
        :text="data.contract"
      ></DetailsRow>
      <DetailsRow
        :label="$t('pages.token-details.available-supply')"
        :text="data.circulating_supply"
      ></DetailsRow>
      <DetailsRow
        :label="$t('pages.token-details.total-supply')"
        :text="data.total_supply"
      ></DetailsRow>
      <DetailsRow
        :label="$t('pages.token-details.max-supply')"
        :text="data.max_supply"
      ></DetailsRow>
      <DetailsRow :label="$t('pages.token-details.price-ae')"></DetailsRow>
      <DetailsRow
        :label="$t('pages.token-details.price')"
        :text="data.current_price ? formatCurrency(data.current_price) : ''"
      ></DetailsRow>
      <DetailsRow :label="$t('pages.token-details.volume')" :text="data.total_volume"></DetailsRow>
      <DetailsRow
        :label="$t('pages.token-details.market-cap')"
        :text="data.market_cap"
      ></DetailsRow>
      <DetailsRow :label="$t('pages.token-details.ath-change')" :text="data.ath"></DetailsRow>
      <DetailsRow :label="$t('pages.token-details.atl-change')" :text="data.atl"></DetailsRow>
      <DetailsRow :label="$t('pages.token-details.chart')"></DetailsRow>
      <div class="section-title">
        {{ $t('pages.token-details.token-description') }}
      </div>
      <div class="section-description"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TabsMenu from '../../components/TabsMenu';
import TokensAvatar from '../../components/FungibleTokens/TokensAvatar';
import FormatFiatCurrency from '../../components/FungibleTokens/FormatFiatCurrency';
import DetailsRow from '../../components/FungibleTokens/DetailsRow';
import Button from '../../components/Button';

export default {
  components: {
    TokensAvatar,
    TabsMenu,
    FormatFiatCurrency,
    Button,
    DetailsRow,
  },
  data() {
    return {
      data: this.$route.params.data,
      activeTab: 'details',
      tabs: [
        {
          value: 'details',
          text: this.$t('pages.token-details.details'),
        },
      ],
    };
  },
  computed: {
    ...mapGetters(['allowTipping', 'formatCurrency']),
  },
  methods: {
    selectTab(event, tabValue) {
      this.activeTab = tabValue;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../../common/variables';

.token-details {
  max-width: 357px;
}

.token-header {
  background-color: $black-1;
  padding: 20px 30px;
}

.token-profile {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.amount {
  font-size: 18px;
  color: $white-1;
  margin-left: 10px;

  .symbol {
    color: $secondary-color;
  }

  .max-space {
    display: inline-block;
    max-width: 100px;
  }

  .fiat {
    font-size: 16px;
    display: block;
  }
}

.token-actions {
  display: flex;
  align-items: center;

  button {
    width: auto;
    padding: 0 25px;
    display: inline-block;

    a {
      color: unset;
      text-decoration: unset;
    }
  }
}

.section-title {
  color: $gray-1;
  font-weight: 500;
  font-size: 15px;
  padding: 12px 15px;
  background-color: $black-2;
}

.section-description {
  color: $gray-1;
  font-size: 14px;
  padding: 16px 15px;
}

.token-info > div:nth-child(odd) {
  background-color: $black-2;
}
</style>
