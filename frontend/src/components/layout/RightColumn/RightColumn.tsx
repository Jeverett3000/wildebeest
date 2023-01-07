import { component$, useStylesScoped$ } from '@builder.io/qwik'
import { Link, useLocation } from '@builder.io/qwik-city'
import { WildebeestLogo } from '~/components/MastodonLogo'
import styles from './RightColumn.scss?inline'

type LinkConfig = {
	iconName: string
	linkText: string
	linkTarget: string
	linkActiveRegex: RegExp
}

export default component$(() => {
	useStylesScoped$(styles)
	const location = useLocation()

	const renderNavLink = ({ iconName, linkText, linkTarget, linkActiveRegex }: LinkConfig) => {
		let classList = 'mx-4 my-5 block no-underline text-semi max-w-max ' + location.pathname

		if (linkActiveRegex.test(location.pathname)) {
			classList += ' text-indigo-400'
		} else {
			classList += ' hover:text-white focus:text-white'
		}

		return (
			<Link href={linkTarget} class={classList}>
				<i class={`fa ${iconName} fa-fw md:mr-3`} />
				<span class="hidden md:inline">{linkText}</span>
			</Link>
		)
	}

	const links = [
		{ iconName: 'fa-hashtag', linkText: 'Explore', linkTarget: '/explore', linkActiveRegex: /^\/explore/ },
		{ iconName: 'fa-users', linkText: 'Local', linkTarget: '/public/local', linkActiveRegex: /^\/public\/local/ },
		{ iconName: 'fa-globe', linkText: 'Federated', linkTarget: '/public', linkActiveRegex: /^\/public\/?$/ },
	]

	const aboutLink = { iconName: 'fa-ellipsis', linkText: 'About', linkTarget: '/about', linkActiveRegex: /^\/about/ }

	return (
		<div class="bg-slate-800 xl:bg-transparent flex flex-col justify-between right-column-wrapper text-slate-400">
			<div>
				<div class="xl:p-4">
					<a class="no-underline hidden xl:flex items-center" href="https://mastodon.social">
						<WildebeestLogo size="small" />
						{/* TODO: We need to move the text inside the logo component for better reusability
						(because we are adding the text both here and also in the main layout header) */}
						<span class="text-white font-bold xl:text-xl xl:ml-[-27px] xl:mt-[-27px]">ildebeest</span>
					</a>
				</div>
				<hr class="hidden xl:block border-t border-slate-700 my-3" />
				{links.map((link) => renderNavLink(link))}
				<div class="xl:hidden">
					<hr class="border-t border-slate-700 my-3" />
					{renderNavLink(aboutLink)}
				</div>
			</div>
		</div>
	)
})
