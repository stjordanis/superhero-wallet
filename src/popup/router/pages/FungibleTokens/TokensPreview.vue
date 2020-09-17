<template>
  <div class="tokens">
    <div class="tokens-menu">
      <a class="tokens-menu-item" :class="{ active: activeItem === 'tokens' }">
        <TokenPiles />
        {{ $t('pages.fungible-tokens.tokens') }}
      </a>
    </div>
    <div class="search">
      <input
        v-model="searchTerm"
        :placeholder="$t('pages.fungible-tokens.searchPlaceholder')"
        type="text"
      />
      <Eraser v-if="searchTerm.length > 0" class="eracer-icon" @click="searchTerm = ''" />
      <Search v-else class="search-icon" />
    </div>
    <TabsMenu :method="selectTab" :tabOptions="tabs" :activeTab="tabs[0].value" />
    <TokensList :show-my-tokens="activeTab === tabs[1].value" :searchTerm="searchTerm" />
  </div>
</template>

<script>
import TabsMenu from '../../components/TabsMenu';
import TokensList from '../../components/FungibleTokens/TokensList';
import TokenPiles from '../../../../icons/token-piles.svg?vue-component';
import Search from '../../../../icons/search.svg?vue-component';
import Eraser from '../../../../icons/eraser.svg?vue-component';

export default {
  name: 'fungible-tokens',
  components: {
    TokenPiles,
    Search,
    Eraser,
    TabsMenu,
    TokensList,
  },
  data() {
    return {
      activeItem: 'tokens',
      searchTerm: '',
      activeTab: 'all',
      tabs: [
        {
          value: 'all',
          text: this.$t('pages.fungible-tokens.all'),
        },
        {
          value: 'my-tokens',
          text: this.$t('pages.fungible-tokens.myTokens'),
        },
      ],
    };
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

.tokens {
  max-width: 357px;
}

.tokens-menu {
  margin-top: 3px;
  padding: 7px;
  background-color: $black-2;
}

.tokens-menu-item {
  color: $gray-2;
  padding: 10px 18px;
  font-size: 15px;
  font-weight: 500;
  display: inline-block;
  border-radius: 20px;
  text-decoration: none;

  svg {
    margin-right: 5px;
    vertical-align: sub;
  }

  &.active {
    color: $accent-color;
    background-color: $black-3;
  }
}

.search {
  position: relative;

  input {
    font-size: 14px;
    color: $white-1;
    width: 100%;
    height: 40px;
    padding: 0 45px 0 15px;

    &::placeholder {
      color: $gray-2;
    }

    &:focus {
      border: 1px solid $button-color;
      outline: none;

      ~ .search-icon {
        display: none;
      }
    }
  }

  .search-icon {
    color: $accent-color;
  }

  .eracer-icon :hover {
    cursor: pointer;
  }

  svg {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
