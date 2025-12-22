'use client';

import SmartImage from '@/components/smart-image';
import type { PujaExtended } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  LuAArrowDown,
  LuAArrowUp,
  LuArrowRight,
  LuCalendar,
  LuCrown,
  LuEye,
  LuFilter,
  LuHeart,
  LuHistory,
  LuMapPin,
  LuMedal,
  LuSearch,
  LuShare2,
  LuStar,
  LuX,
} from 'react-icons/lu';
import { useDebounce } from 'use-debounce';

import placeholder from '@/public/circle-logo.png';
import imageUrl from '@/utils/transform';

type Filter =
  | 'all'
  | 'popular'
  | 'jubilee'
  | 'preJubilee'
  | 'adi'
  | 'favorites';
type SortOption = 'name' | 'year' | 'estd' | 'popular';
type SortDirection = 'asc' | 'desc';

export default function PujaList({ data }: { data: PujaExtended[] }) {
  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<Filter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [value] = useDebounce(search, 300);
  const [filteredData, setFilteredData] = useState<PujaExtended[]>(data);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [previewItem, setPreviewItem] = useState<PujaExtended | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      let filtered = data;

      // Apply search filter
      if (value) {
        filtered = filtered.filter((item: PujaExtended) =>
          [item.name, item.year, item.theme, item.address].some((val) =>
            String(val).toLowerCase().includes(value.toLowerCase())
          )
        );
      }

      // Apply category filter
      if (filter === 'favorites') {
        filtered = filtered.filter((item: PujaExtended) =>
          favorites.has(item.referenceId)
        );
      } else if (filter !== 'all') {
        filtered = filtered.filter((item: PujaExtended) => item[filter]);
      }

      // Apply sorting
      filtered.sort((a, b) => {
        let aVal, bVal;
        switch (sortBy) {
          case 'name':
            aVal = a.name.toLowerCase();
            bVal = b.name.toLowerCase();
            break;
          case 'year':
            aVal = a.year || 0;
            bVal = b.year || 0;
            break;
          case 'estd':
            aVal = a.estd || 0;
            bVal = b.estd || 0;
            break;
          case 'popular':
            aVal = a.popular ? 1 : 0;
            bVal = b.popular ? 1 : 0;
            break;
          default:
            return 0;
        }

        if (sortDirection === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });

      setFilteredData(filtered);
    }, 100);

    return () => clearTimeout(timer);
  }, [value, filter, sortBy, sortDirection, data, favorites]);

  const toggleFavorite = (referenceId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(referenceId)) {
        newFavorites.delete(referenceId);
      } else {
        newFavorites.add(referenceId);
      }
      return newFavorites;
    });
  };

  const openPreview = (item: PujaExtended) => {
    setPreviewItem(item);
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewItem(null);
  };

  const clearSearch = () => {
    setSearch('');
  };

  const filterOptions = [
    { value: 'all', label: 'All', count: data.length },
    { value: 'favorites', label: 'Favorites', count: favorites.size },
    {
      value: 'popular',
      label: 'Popular',
      count: data.filter((item) => item.popular).length,
    },
    {
      value: 'jubilee',
      label: 'Jubilees',
      count: data.filter((item) => item.jubilee).length,
    },
    {
      value: 'preJubilee',
      label: 'Pre Jubilees',
      count: data.filter((item) => item.preJubilee).length,
    },
    {
      value: 'adi',
      label: 'Adi Puja',
      count: data.filter((item) => item.adi).length,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Enhanced Search and Filter Section */}
      <section
        className="fl-p-4/6 rounded-2xl border border-white/20 bg-white/90 ring-1 ring-blue-100/50 backdrop-blur-md"
        aria-label="Search and filter pujas"
      >
        {/* Search Bar */}
        <div className="fl-mb-4/6 relative">
          <div className="relative">
            <LuSearch className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, year, theme, address..."
              value={search}
              className="fl-py-3/4 w-full touch-manipulation rounded-xl border border-gray-200/60 bg-white/95 px-5 text-base text-gray-700 placeholder-gray-400 backdrop-blur-sm transition-all duration-200 focus:border-blue-400 focus-visible:border-blue-400"
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search pujas by name, year, theme, or address"
              aria-describedby="search-help"
              role="searchbox"
            />
            <div id="search-help" className="sr-only">
              Use this search box to find pujas by typing keywords related to
              name, year, theme, or address
            </div>
            {search && (
              <button
                onClick={clearSearch}
                className="absolute top-1/2 right-4 flex min-h-[44px] min-w-[44px] -translate-y-1/2 transform touch-manipulation items-center justify-center p-1 text-gray-400 transition-colors hover:text-gray-600"
                aria-label="Clear search"
              >
                <LuX className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Chips and Controls */}
        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
          {/* Filter Chips */}
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter pujas by category"
          >
            <span className="mr-2 flex items-center gap-2 text-sm font-medium text-gray-600">
              <LuFilter className="h-4 w-4" />
              Filters:
            </span>
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value as Filter)}
                className={`flex cursor-pointer touch-manipulation items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                  filter === option.value
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                    : 'border border-gray-200/50 bg-white/80 text-gray-600 backdrop-blur-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700'
                }`}
                aria-pressed={filter === option.value}
                aria-label={`Filter by ${option.label}${filter === option.value ? ' (currently active)' : ''}`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>

          {/* Sort Controls */}
          <div
            className="flex items-center gap-3"
            role="group"
            aria-label="Sort pujas"
          >
            <span className="text-sm font-medium text-gray-600">Sort:</span>
            <label htmlFor="sort-select" className="sr-only">
              Sort pujas by
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="touch-manipulation rounded-lg border border-gray-200/60 bg-white/95 px-3 py-2 text-sm backdrop-blur-sm"
              aria-label="Sort pujas by"
            >
              <option value="name">Name</option>
              <option value="year">Age</option>
              <option value="estd">Established</option>
              <option value="popular">Popularity</option>
            </select>
            <button
              onClick={() =>
                setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
              }
              className="flex touch-manipulation items-center justify-center rounded-lg border border-gray-200/60 bg-white/95 p-2 backdrop-blur-sm transition-all duration-200 hover:border-blue-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50"
              aria-label={`Sort ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
              title={`Currently sorting ${sortDirection === 'asc' ? 'ascending' : 'descending'}. Click to change.`}
            >
              {sortDirection === 'asc' ? (
                <LuAArrowUp className="h-4 w-4" />
              ) : (
                <LuAArrowDown className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mt-4 border-t border-gray-100 pt-4">
          <div
            className="text-sm text-gray-600"
            aria-live="polite"
            aria-atomic="true"
          >
            Showing{' '}
            <span className="font-semibold text-blue-600">
              {filteredData.length}
            </span>{' '}
            of <span className="font-semibold">{data.length}</span> pujas
            {search && (
              <span className="ml-2 text-gray-500">for "{search}"</span>
            )}
          </div>
        </div>
      </section>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div
          className="rounded-2xl border border-white/20 bg-white/80 py-16 text-center ring-1 ring-gray-100/50 backdrop-blur-md"
          role="status"
          aria-live="polite"
        >
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <LuSearch className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-700">
            No pujas found
          </h3>
          <p className="mb-6 text-gray-500">
            {search ? (
              <>
                No results found for "<strong>{search}</strong>
                ". Try different keywords or clear your search.
              </>
            ) : filter && filter !== 'all' ? (
              <>
                No pujas match the selected filter "
                <strong>
                  {filterOptions.find((opt) => opt.value === filter)?.label}
                </strong>
                ". Try a different category.
              </>
            ) : (
              'No pujas are currently available.'
            )}
          </p>
          {(search || (filter && filter !== 'all')) && (
            <button
              onClick={() => {
                setSearch('');
                setFilter('all');
              }}
              className="transform rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              aria-label="Clear all search filters and show all pujas"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
      {/* Cards Grid */}
      <div className="fl-gap-4/6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredData.map((item: PujaExtended) => {
          const image = item.images?.[0];
          return (
            <div key={item.referenceId} className="group relative">
              {/* Action Buttons */}
              <div className="absolute top-3 right-3 z-5 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openPreview(item);
                  }}
                  className="cursor-pointer rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  aria-label={`Quick preview of ${item.name}`}
                  title="Quick Preview"
                >
                  <LuEye className="h-4 w-4 text-gray-700" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(item.referenceId);
                  }}
                  className={`cursor-pointer rounded-full p-2 shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-xl focus:ring-2 focus:ring-red-500 focus:outline-none ${favorites.has(item.referenceId) ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'}`}
                  aria-label={`${favorites.has(item.referenceId) ? 'Remove from' : 'Add to'} favorites`}
                  title={
                    favorites.has(item.referenceId)
                      ? 'Remove from Favorites'
                      : 'Add to Favorites'
                  }
                >
                  <LuHeart
                    className={`h-4 w-4 ${favorites.has(item.referenceId) ? 'fill-current' : ''}`}
                  />
                </button>
              </div>
              <Link
                href={`/puja/${item.slug}/${item.referenceId}`}
                className="block transform touch-manipulation overflow-hidden rounded-2xl border border-gray-200/60 bg-white/95 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-2 hover:border-blue-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                aria-label={`View details for ${item.name} puja`}
              >
                <div className="relative aspect-[3/2] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  {/* Status Badges */}
                  {/* <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                                        {item.jubilee && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg">
                                                <LuMedal className="w-3 h-3" />
                                                {item.celebrating}
                                            </span>
                                        )}
                                        {item.preJubilee && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
                                                <LuMedal className="w-3 h-3" />
                                                {item.celebrating}
                                            </span>
                                        )}
                                    </div> */}

                  {image ? (
                    <div className="relative h-full w-full">
                      <SmartImage
                        src={imageUrl(
                          `${image.year}/${item.referenceId}/${image.name}`
                        )}
                        fill={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        alt={item.name}
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    </div>
                  ) : (
                    <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
                        <Image
                          src={placeholder}
                          alt={`${item.name} placeholder`}
                          className="h-10 w-10 opacity-60"
                          priority={false}
                        />
                      </div>
                      {/* <div className="text-center px-4">
                                                <p className="text-gray-500 text-sm font-medium">No Image Available</p>
                                                <p className="text-gray-400 text-xs mt-1">Coming Soon</p>
                                            </div> */}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  {/* Header Section */}
                  <div className="mb-4">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="min-w-0 flex-1 text-left">
                        <h3 className="mb-3 truncate text-xl leading-tight font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                          {item.name}
                        </h3>
                        <div className="mt-2 line-clamp-1 text-sm font-medium text-gray-600">
                          <LuMapPin className="mr-1 inline-block h-4 w-4 text-red-600" />{' '}
                          {item.address}
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="ml-3 flex flex-col items-end gap-1">
                        {item.popular && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 px-2 py-1 text-xs font-medium text-amber-700">
                            <LuStar className="h-3 w-3" />
                            Popular
                          </span>
                        )}
                        {item.adi && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 px-2 py-1 text-xs font-medium text-purple-700">
                            <LuCrown className="h-3 w-3" />
                            Adi
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="mb-4 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                        <LuHistory className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-700">
                        {item.year ? `${item.year} years` : 'Not Known'}
                        {item.jubilee && (
                          <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-2 py-1 text-xs font-medium text-white">
                            <LuMedal className="h-3 w-3" />
                            {item.celebrating}
                          </span>
                        )}
                        {item.preJubilee && (
                          <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-2 py-1 text-xs font-medium text-white">
                            <LuMedal className="h-3 w-3" />
                            {item.celebrating}
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                        <LuCalendar className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-medium text-gray-700">
                        Established {item.estd}
                      </span>
                    </div>
                  </div>

                  {/* Action Section */}
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">
                          View Details
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // Use Web Share API if available
                              if (navigator.share) {
                                navigator
                                  .share({
                                    title: item.name,
                                    text: `Check out ${item.name} Jagadhatri Puja${item.theme ? ` - ${item.theme}` : ''}`,
                                    url: `${window.location.origin}/puja/${item.slug}/${item.referenceId}`,
                                  })
                                  .catch((error) =>
                                    console.log('Error sharing:', error)
                                  );
                              } else {
                                // Fallback to copying URL to clipboard
                                const url = `${window.location.origin}/puja/${item.slug}/${item.referenceId}`;
                                navigator.clipboard
                                  .writeText(url)
                                  .then(() => {
                                    alert('Link copied to clipboard!');
                                  })
                                  .catch((error) => {
                                    console.error('Failed to copy:', error);
                                  });
                              }
                            }}
                            className="flex min-h-[40px] min-w-[40px] cursor-pointer touch-manipulation items-center justify-center rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-blue-100 hover:text-blue-600"
                            aria-label="Share puja"
                            title="Share this puja"
                            data-prevent-progress={true}
                          >
                            <LuShare2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <LuArrowRight className="h-5 w-5 text-blue-600 transition-transform duration-200 group-hover:translate-x-2" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Quick Preview Modal */}
      {showPreview && previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={closePreview}
                className="absolute top-4 right-4 z-10 cursor-pointer rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                aria-label="Close preview"
              >
                <LuX className="h-5 w-5 text-gray-700" />
              </button>

              {/* Preview Image */}
              {previewItem.images?.[0] && (
                <div className="relative aspect-[2/1] bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="relative h-full w-full">
                    <SmartImage
                      src={imageUrl(
                        `${previewItem.images[0].year}/${previewItem.referenceId}/${previewItem.images[0].name}`
                      )}
                      fill={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      quality={80}
                      alt={`${previewItem.images[0].name} image`}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </div>
                </div>
              )}

              {/* Preview Content */}
              <div className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1 text-left">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900">
                      {previewItem.name}
                    </h2>
                    <div className="items-left flex flex-col gap-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <LuMapPin className="h-4 w-4 text-blue-600" />
                        {previewItem.address}
                      </span>
                      <span className="flex items-center gap-1">
                        <LuCalendar className="h-4 w-4 text-green-600" />
                        {previewItem.year
                          ? `${previewItem.year} years`
                          : 'Not Known'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(previewItem.referenceId)}
                    className={`cursor-pointer rounded-full p-2 transition-all duration-200 focus:ring-2 focus:ring-red-500 focus:outline-none ${
                      favorites.has(previewItem.referenceId)
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    aria-label={`${favorites.has(previewItem.referenceId) ? 'Remove from' : 'Add to'} favorites`}
                  >
                    <LuHeart
                      className={`h-5 w-5 ${favorites.has(previewItem.referenceId) ? 'fill-current' : ''}`}
                    />
                  </button>
                </div>

                <div className="gap-2 text-justify text-sm text-gray-600">
                  {previewItem.info}
                </div>

                {previewItem.theme && (
                  <div className="mb-4">
                    <div className="inline-block rounded-lg bg-indigo-50 px-3 py-2 font-semibold text-indigo-600">
                      🎭 {previewItem.theme}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 border-t border-gray-100 pt-4">
                  <Link
                    href={`/puja/${previewItem.slug}/${previewItem.referenceId}`}
                    className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 text-center font-semibold text-white transition-all duration-200 hover:from-blue-600 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                    onClick={closePreview}
                  >
                    View Full Details
                  </Link>
                  <button
                    onClick={closePreview}
                    className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
