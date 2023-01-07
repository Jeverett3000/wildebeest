import { component$, useStylesScoped$, Slot, useContextProvider } from '@builder.io/qwik'
import { DocumentHead, useLocation, loader$ } from '@builder.io/qwik-city'
import * as instance from 'wildebeest/functions/api/v1/instance'
import type { InstanceConfig } from 'wildebeest/backend/src/types/configs'
import LeftColumn from '../components/layout/LeftColumn/LeftColumn'
import RightColumn from '../components/layout/RightColumn/RightColumn'
import styles from './layout.scss?inline'
import { InstanceConfigContext } from '~/utils/instanceConfig'
import { WildebeestLogo } from '~/components/MastodonLogo'

const pathsWithoutColumns = ['/first-login', '/start-instance']

export const useShowColumns = () => {
	const location = useLocation()
	const pathname = new URL(location.href).pathname
	return !pathsWithoutColumns.includes(pathname)
}

export const instanceLoader = loader$<{ DATABASE: D1Database; domain: string }, Promise<InstanceConfig>>(
	async ({ platform }) => {
		const response = await instance.handleRequest('', platform.DATABASE)
		const results = await response.text()
		const json = JSON.parse(results) as InstanceConfig
		return json
	}
)

export default component$(() => {
	useStylesScoped$(styles)

	const showColumns = useShowColumns()

	useContextProvider(InstanceConfigContext, instanceLoader.use().value)

	return (
		<>
			<header class="bg-slate-800 p-3 w-full border-b border-slate-700 xl:hidden">
				<a class="no-underline flex items-center" href="https://mastodon.social">
					<WildebeestLogo size="small" />
					{/* TODO: We need to move the text inside the logo component for better reusability
						(because we are adding the text both here and also in the RightColumn component) */}
					<span class="text-white font-bold text-xl ml-[-27px] mt-[-27px]">ildebeest</span>
				</a>
			</header>
			<main class="main-wrapper">
				{showColumns && (
					<div class="side-column hidden xl:block">
						<div class="sticky">
							<LeftColumn />
						</div>
					</div>
				)}
				<div class={`w-full ${showColumns ? 'xl:max-w-lg' : ''}`}>
					<div class={`bg-slate-800 ${showColumns ? 'rounded ' : 'min-h-screen'}`}>
						<Slot />
					</div>
				</div>
				{showColumns && (
					<div class="side-column">
						<div class="sticky">
							<RightColumn />
						</div>
					</div>
				)}
			</main>
		</>
	)
})

export const head: DocumentHead = (props) => {
	const config = props.getData(instanceLoader)
	return {
		title: config.short_description,
		meta: [
			{
				name: 'description',
				content: config.description,
			},
		],
	}
}
