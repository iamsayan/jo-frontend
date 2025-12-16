"use client";

import {
	KBarProvider,
	KBarPortal,
	KBarPositioner,
	KBarAnimator,
	KBarSearch,
	KBarResults,
	useRegisterActions,
	useKBar,
	useMatches,
	Action,
} from "kbar";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "@bprogress/next/app";
import { useDebouncedCallback } from "use-debounce";
import { extendPuja, sanitizeSearchQuery } from "@/utils/functions";
import { LuSearch, LuList, LuImage, LuZap, LuShoppingCart, LuTrophy, LuInfo, LuMapPin } from "react-icons/lu";
import { MdOutline360 } from "react-icons/md";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { searchModels } from "@/app/actions/search";
import type { Puja, PujaExtended } from "@/types";

interface CommandBarProps {
	children: React.ReactNode;
}

interface DynamicActionsLoaderProps {
	onInput?: (searchQuery: string, currentRootActionId: any) => void;
	onSearch?: (isSearching: boolean) => void;
}

interface RenderResultsProps {
	onRender?: (results: object, rootActionId: any) => void;
}

function Search() {
	const { query } = useKBar();
	const searchParams = useSearchParams();

	useEffect(() => {
		const searchQuery = searchParams.get("q");
		if (searchQuery) {
			query.toggle();
			query.setSearch(sanitizeSearchQuery(searchQuery));
		}
	}, [searchParams, query]);

	return null;
}

function DynamicActionsLoader({ onInput, onSearch }: DynamicActionsLoaderProps) {
	const { searchQuery, currentRootActionId } = useKBar((state) => state);
	const router = useRouter();
	const actions = useMemo(
		() => [
			{
				id: "pujas",
				name: "Search a Puja...",
				section: "Find Pujas",
				shortcut: ["j", "f"],
				keywords: "find-puja",
				icon: <LuSearch />,
				subtitle: "Find a Puja Committee by Name, ESTD etc.",
			},
			{
				id: "puja-committee-list",
				section: "Go To",
				name: "Puja Committee List",
				shortcut: ["j", "l"],
				keywords: "puja-list",
				icon: <LuList />,
				perform: () => router.push("/puja-committee-list"),
			},
			{
				id: "photo-gallery",
				section: "Go To",
				name: "Photo Gallery",
				shortcut: ["j", "g"],
				keywords: "photo-gallery",
				icon: <LuImage />,
				perform: () => router.push("/gallery"),
			},
			{
				id: "jagadhatri-puja",
				section: "Go To",
				name: `Jagadhatri Puja ${new Date().getFullYear()}`,
				shortcut: ["j", "p"],
				keywords: "jagadhatri-puja",
				icon: <LuZap />,
				perform: () => router.push(`/jagadhatri-puja/${new Date().getFullYear()}`),
			},
			{
				id: "store",
				name: "Visit Store",
				shortcut: ["j", "s"],
				section: "Go To",
				keywords: "visit-store",
				icon: <LuShoppingCart />,
				perform: () => window.open("https://store.jagadhatrionline.co.in", "_blank"),
			},
			{
				id: "hoimontika-somman",
				section: "Go To",
				name: "Hoimantika Somman",
				shortcut: ["j", "h"],
				keywords: "hoimontika-somman",
				icon: <LuTrophy />,
				perform: () => router.push("/hoimontika-somman"),
			},
			{
				id: "virtual-tours",
				name: "360° Virtual Tours",
				shortcut: ["j", "v"],
				section: "Go To",
				keywords: "virtual-tours",
				icon: <MdOutline360 />,
				perform: () => window.open("https://vr.jagadhatrionline.co.in", "_blank"),
			},
			{
				id: "about-us",
				section: "Go To",
				name: "About Us",
				shortcut: ["j", "a"],
				keywords: "about-us",
				icon: <LuInfo />,
				perform: () => router.push("/about-us"),
			},
			{
				id: "contact-us",
				name: "Contact Us",
				shortcut: ["j", "c"],
				section: "Go To",
				keywords: "contact-us",
				icon: <LuMapPin />,
				perform: () => router.push("/contact-us"),
			},
		],
		[],
	);
	const [results, setResults] = useState<Action[]>(actions);

	const debouncedQuery = useDebouncedCallback(
		async (search: string) => {
			if (!search || search.length < 2) {
				onSearch?.(false);
				return;
			}

			onSearch?.(true);
			try {
				const searchResults = await searchModels<Puja>(currentRootActionId as string, search);
				const dynamicActions = Array.isArray(searchResults)
					? searchResults.map((pujaItem: Puja) => {
							const item: PujaExtended = extendPuja(pujaItem);
							return {
								id: `puja-${item.ccjpcId}`,
								name: `${item.name}${item.year ? ` - ${item.year} Years` : ""}`,
								section: "Search Results",
								keywords: item.slug,
								parent: "pujas",
								icon: <LuZap />,
								subtitle: item.address,
								perform: () => router.push(`/puja/${item.slug}/${item.referenceId}`),
							};
						})
					: [];

				setResults([...actions, ...dynamicActions]);
			} catch (error) {
				console.error("Search error:", error);
				setResults(actions);
			} finally {
				onSearch?.(false);
			}
		},
		500,
		{ maxWait: 2000 },
	);

	useEffect(() => {
		onInput?.(searchQuery, currentRootActionId);
		if (typeof currentRootActionId === "string" && currentRootActionId) {
			debouncedQuery(sanitizeSearchQuery(searchQuery));
		}
	}, [searchQuery, currentRootActionId]);

	useRegisterActions(results, [results]);

	return null;
}

function RenderResults({ onRender }: RenderResultsProps) {
	const { results, rootActionId } = useMatches();

	useEffect(() => {
		onRender?.(results, rootActionId);
	}, [results, rootActionId]);

	return (
		<KBarResults
			items={results}
			onRender={({ item, active }) =>
				typeof item === "string" ? (
					<div className="px-4 py-2 text-xs font-medium uppercase text-zinc-500 tracking-wide bg-zinc-100 dark:bg-zinc-800">{item}</div>
				) : (
					<div
						className={`px-4 py-3 flex items-center justify-between text-sm cursor-pointer transition-colors ${active ? "bg-zinc-200 dark:bg-zinc-700" : "bg-transparent"}`}
					>
						<div className="flex items-center gap-4">
							{item.icon}
							<div className="flex flex-col gap-1">
								<div>{item.name}</div>
								{item?.subtitle && <div className="text-zinc-500 dark:text-zinc-400 text-xs">{item.subtitle}</div>}
							</div>
						</div>
						{item?.shortcut && item?.shortcut?.length > 0 && (
							<div className="space-x-1 text-xs text-zinc-400 dark:text-zinc-300">
								{item?.shortcut.map((sc, i) => (
									<kbd
										key={i}
										className="uppercase px-1.5 py-0.5 border border-zinc-300 dark:border-zinc-600 rounded-md bg-zinc-100 dark:bg-zinc-800 font-mono"
									>
										{sc}
									</kbd>
								))}
							</div>
						)}
					</div>
				)
			}
		/>
	);
}

const CommandBar = ({ children }: CommandBarProps) => {
	const [showLoader, setShowLoader] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<any>("");
	const [searchResults, setSearchResults] = useState<any>([]);
	const [parentId, setParentId] = useState<any>("");

	return (
		<KBarProvider actions={[]}>
			<DynamicActionsLoader
				onSearch={(state) => setShowLoader(state)}
				onInput={(query, parent) => {
					setSearchQuery(query);
					setParentId(parent);
				}}
			/>
			<Suspense>
				<Search />
			</Suspense>
			<KBarPortal>
				<KBarPositioner className="z-50 bg-black/60 backdrop-blur-sm">
					<KBarAnimator className="w-full max-w-2xl bg-white dark:bg-zinc-900 text-black dark:text-white rounded-md shadow-2xl overflow-hidden flex flex-col">
						{parentId && (
							<div className="px-4 pt-3 flex items-center justify-between text-zinc-500 dark:text-zinc-400 dark:border-zinc-700 uppercase">
								<span className="text-[10px] bg-gray-800 py-1 px-2 rounded-sm">{parentId}</span>
							</div>
						)}
						<div className="flex border-b border-zinc-200 dark:border-zinc-700">
							<KBarSearch className="w-full px-4 py-3 text-lg outline-none bg-transparent placeholder:text-zinc-400" />
							{searchQuery && searchResults.length === 0 && (
								<div
									className="flex justify-center items-center p-4 cursor-pointer"
									title="Search on Google"
									onClick={() =>
										window.open(
											`https://www.google.com/search?q=site:${process.env.NEXT_PUBLIC_SITE_URL}"${searchQuery}"`,
											"_blank",
										)
									}
								>
									<LuSearch />
								</div>
							)}
						</div>
						{showLoader && (
							<div className="px-3 py-2 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 dark:border-zinc-700">
								<svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Searching...
							</div>
						)}
						<RenderResults onRender={(results) => setSearchResults(results)} />
					</KBarAnimator>
				</KBarPositioner>
			</KBarPortal>
			{children}
		</KBarProvider>
	);
};

export default CommandBar;
