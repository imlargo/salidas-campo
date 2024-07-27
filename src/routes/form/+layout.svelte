<script lang="ts">
	import { page } from '$app/stores';

	import '$styles/form.scss';
	import Submit from '$src/lib/components/form/Submit.svelte';
	import Banner from '$components/form/Banner.svelte';
	import Footer from '$components/layout/Footer.svelte';
</script>

<div class="max-w-7xl mx-auto container py-5">
	<Banner variante={$page.url.pathname === '/form/registro' ? 'proyeccion' : 'solicitud'} />

	<p class="text-lg my-8 text-zinc-600">
		Estimado docente, la fase de proyección consiste en la planificación y organización de las
		salidas de campo que se realizarán en el próximo semestre. Su participación es fundamental para
		estimar los costos de su salida de campo y solicitar los recursos financieros necesarios para su
		ejecución.
	</p>

	<form class="flex flex-col gap-7 mb-12" name="form-vicedecanatura" id="formulario">
		<slot />

		<div>
			<p class="text-justify">
				La Universidad Nacional de Colombia, como responsable del tratamiento de información de
				datos personales, informa que los datos suministrados serán tratados de acuerdo con la ley
				1581 de 2012, y a nuestra Política de Datos Personales, bajo las finalidades
				correspondientes al uso de sus datos personales y podrá ejercer sus derechos como titular
				mediante el canal protecdatos_na@unal.edu.co
			</p>

			<div class="flex gap-3 my-3">
				<input class="form-check-input" type="checkbox" value="" id="autorizacion" required />
				<label class=" font-bold text-jusitify" for="autorizacion">
					DE ACUERDO A LA LEY 1581 DE 2012 DE PROTECCIÓN DE DATOS PERSONALES, HE LEÍDO, ENTENDIDO Y
					ACEPTO, LOS TÉRMINOS DESCRITOS EN LA POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES.
				</label>
			</div>
		</div>

		<Submit />
	</form>

	<Footer />
</div>

<style lang="scss">
</style>
