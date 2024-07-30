<script lang="ts">
	type Props = {
		titulo: string;
		icon?: string;
	};
	const { titulo, icon }: Props = $props();
</script>

<fieldset class="flex flex-col gap-5 border p-7 rounded">
	<legend class="text-2xl font-bold float-none w-auto px-3">
		{titulo}
		{#if icon}
			<i class={icon}></i>
		{/if}
	</legend>

	<slot />
</fieldset>

<style lang="scss">
</style>
