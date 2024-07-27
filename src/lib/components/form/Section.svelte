<script lang="ts">
	type Props = {
		titulo?: string;
	};
	const { titulo }: Props = $props();
</script>

<fieldset class="flex flex-col gap-5 border p-7 rounded">
	<legend class="text-2xl font-bold float-none w-auto px-3">{titulo}</legend>

	<slot />
</fieldset>

<style lang="scss">
</style>
