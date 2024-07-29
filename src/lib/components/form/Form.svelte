<script lang="ts">
	const {
		handleSubmit,
		isEdit
	}: {
		handleSubmit: (e: SubmitEvent) => void;
		isEdit: boolean;
	} = $props();
</script>

<form
	class="flex flex-col gap-7 mb-12"
	onsubmit={(e) => {
		e.preventDefault();
		handleSubmit(e);
	}}
>
	<slot />

	<div>
		<p class="text-justify">
			La Universidad Nacional de Colombia, como responsable del tratamiento de información de datos
			personales, informa que los datos suministrados serán tratados de acuerdo con la ley 1581 de
			2012, y a nuestra Política de Datos Personales, bajo las finalidades correspondientes al uso
			de sus datos personales y podrá ejercer sus derechos como titular mediante el canal
			protecdatos_na@unal.edu.co
		</p>

		<div class="flex gap-3 my-3">
			<input class="form-check-input" type="checkbox" value="" id="autorizacion" required />
			<label class=" font-bold text-jusitify" for="autorizacion">
				DE ACUERDO A LA LEY 1581 DE 2012 DE PROTECCIÓN DE DATOS PERSONALES, HE LEÍDO, ENTENDIDO Y
				ACEPTO, LOS TÉRMINOS DESCRITOS EN LA POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES.
			</label>
		</div>
	</div>

	<button type="submit" class="px-4 py-3 text-center w-full rounded-lg font-bold text-xl">
		{isEdit ? 'Guardar cambios' : 'Enviar'}
	</button>
</form>

<style>
	button {
		background-color: #ff9b21;
		border-color: #ff9b21;
		color: white;
		box-shadow:
			0 1px 0 rgba(0, 0, 0, 0.04),
			0 2px 2px rgba(0, 0, 0, 0.25);

		&:hover {
			background-color: #f9ae00;
			border-color: #f9ae00;
			color: white;
			font-weight: bold;
		}
	}
</style>
