<script lang="ts">
export default defineComponent({
  setup(props, { slots }) {
    return () => slots.default?.();
  },
});
</script>