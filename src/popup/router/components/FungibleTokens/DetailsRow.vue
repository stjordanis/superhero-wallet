<template>
  <div class="details-row">
    <div class="title text-ellipsis">{{ label }}</div>
    <div class="text">{{ text }}</div>
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String },
    text: { type: [String, Number], default: 'N/A' },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../../common/variables';

.details-row {
  font-size: 15px;
  padding: 9px 15px;
  background-color: $bg-color;
  display: flex;
}

.title {
  color: $gray-2;
  font-weight: 500;
  width: 100%;
}

.text {
  color: $white-1;

  .primary {
    color: $accent-color;
  }
}

.contract .text,
.community .text {
  color: $accent-color;
}

.contract .text {
  font-size: 9px;
  display: flex;
  align-items: center;
}

.community .text {
  font-size: 13px;
}
</style>
