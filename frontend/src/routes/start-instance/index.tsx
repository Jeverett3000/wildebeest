import { $, component$, useStore, useClientEffect$, useSignal } from '@builder.io/qwik'
import { MastodonLogo } from '~/components/MastodonLogo'
import { useDomain } from '~/utils/useDomain'
import Step1 from './step-1'
import { type InstanceConfig, testInstance } from './utils'

export default component$(() => {
	const domain = useDomain()

	const loading = useSignal(true)
	const instanceConfigured = useSignal(false)

	const instanceConfig = useStore<InstanceConfig>({
		title: `${domain} Wildebeest`,
		email: `admin@${domain}`,
		description: 'My personal Wildebeest instance (powered by Cloudflare)',
	})

	useClientEffect$(async () => {
		if (await testInstance()) {
			instanceConfigured.value = true
		}
		loading.value = false
	})

	const getStepToShow = () => {
		if (loading.value) return 'loading'
		if (!instanceConfigured.value) return 'step-1'
		return 'all-good'
	}

	const stepToShow = getStepToShow()

	const setLoading = $((value: boolean) => {
		loading.value = value
	})

	const setInstanceConfigured = $((value: boolean) => {
		instanceConfigured.value = value
	})

	return (
		<div class="flex flex-col p-5 items-center max-w-lg mx-auto">
			<h1 class="text-center mt-7 mb-9">
				<MastodonLogo size="medium" />
			</h1>
			{stepToShow.startsWith('step-') && <p>Welcome to Wildebeest... Your instance hasn't been configured yet.</p>}
			{stepToShow === 'loading' && <p>Loading...</p>}
			{stepToShow === 'step-1' && (
				<Step1 instanceConfig={instanceConfig} setLoading={setLoading} setInstanceConfigured={setInstanceConfigured} />
			)}
			{stepToShow === 'all-good' && <p>All good, your instance is ready.</p>}
		</div>
	)
})
