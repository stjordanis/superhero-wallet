<template>
  <div class="popup">
    <div class="tip-note-preview mt-15">
      {{ text }}
    </div>

    <Button @click="sendComment" :disabled="!allowTipping">
      {{ $t('pages.tipPage.confirm') }}
    </Button>
    <Button @click="openCallbackOrGoHome(false)">
      {{ $t('pages.tipPage.cancel') }}
    </Button>

    <Loader v-if="loading" />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import Backend from '../../../lib/backend';
import deeplinkApi from '../../../mixins/deeplinkApi';

export default {
  mixins: [deeplinkApi],
  data: () => ({ id: 0, parentId: undefined, text: '', loading: false }),
  computed: {
    ...mapState(['sdk']),
    ...mapGetters(['allowTipping']),
  },
  async created() {
    this.loading = true;
    this.id = +this.$route.query.id;
    if (this.$route.query.parentId) this.parentId = +this.$route.query.parentId;
    this.text = this.$route.query.text;
    if (!this.id || !this.text) {
      this.$router.push('/account');
      throw new Error('CommentNew: Invalid arguments');
    }
    await this.$watchUntilTruly(() => this.sdk);
    this.loading = false;
  },
  methods: {
    async sendComment() {
      this.loading = true;
      try {
        await Backend.sendTipComment(
          this.id,
          this.text,
          await this.sdk.address(),
          async data => Buffer.from(await this.sdk.signMessage(data)).toString('hex'),
          this.parentId,
        );
        this.openCallbackOrGoHome(true);
      } catch (e) {
        this.$store.dispatch('modals/open', { name: 'default', type: 'transaction-failed' });
        e.payload = { id: this.id, text: this.text };
        throw e;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
