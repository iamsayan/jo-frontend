"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LuArrowRight,
  LuCalendar,
  LuCrown,
  LuHistory,
  LuMedal,
  LuStar,
  LuSearch,
  LuX,
  LuFilter,
  LuAArrowUp,
  LuAArrowDown,
  LuHeart,
  LuShare2,
  LuEye,
  LuMapPin,
} from "react-icons/lu";
import SmartImage from "@/components/smart-image";
import { useDebounce } from "use-debounce";
import type { PujaExtended } from "@/types";

import placeholder from "@/public/circle-logo.png";
import imageUrl from "@/utils/transform";

type Filter =
  | "all"
  | "popular"
  | "jubilee"
  | "preJubilee"
  | "adi"
  | "favorites";
type SortOption = "name" | "year" | "estd" | "popular";
type SortDirection = "asc" | "desc";

export default function PujaList({ data }: { data: PujaExtended[] }) {
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [value] = useDebounce(search, 400);
  const [filteredData, setFilteredData] = useState<PujaExtended[]>(data);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [previewItem, setPreviewItem] = useState<PujaExtended | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      let filtered = data;

      // Apply search filter
      if (value) {
        filtered = filtered.filter((item: PujaExtended) =>
          [item.name, item.year, item.theme, item.address].some((val: any) =>
            String(val).toLowerCase().includes(value.toLowerCase()),
          ),
        );
      }

      // Apply category filter
      if (filter === "favorites") {
        filtered = filtered.filter((item: PujaExtended) =>
          favorites.has(item.referenceId),
        );
      } else if (filter !== "all") {
        filtered = filtered.filter((item: PujaExtended) => item[filter]);
      }

      // Apply sorting
      filtered.sort((a, b) => {
        let aVal, bVal;
        switch (sortBy) {
          case "name":
            aVal = a.name.toLowerCase();
            bVal = b.name.toLowerCase();
            break;
          case "year":
            aVal = a.year || 0;
            bVal = b.year || 0;
            break;
          case "estd":
            aVal = a.estd || 0;
            bVal = b.estd || 0;
            break;
          case "popular":
            aVal = a.popular ? 1 : 0;
            bVal = b.popular ? 1 : 0;
            break;
          default:
            return 0;
        }

        if (sortDirection === "asc") {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });

      setFilteredData(filtered);
      setIsSearching(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [value, filter, sortBy, sortDirection, data]);

  useEffect(() => {
    setHydrated(true);
  }, []);

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
    setSearch("");
  };

  const filterOptions = [
    { value: "all", label: "All", count: data.length },
    { value: "favorites", label: "Favorites", count: favorites.size },
    {
      value: "popular",
      label: "Popular",
      count: data.filter((item) => item.popular).length,
    },
    {
      value: "jubilee",
      label: "Jubilees",
      count: data.filter((item) => item.jubilee).length,
    },
    {
      value: "preJubilee",
      label: "Pre Jubilees",
      count: data.filter((item) => item.preJubilee).length,
    },
    {
      value: "adi",
      label: "Adi Puja",
      count: data.filter((item) => item.adi).length,
    },
  ];

  if (!hydrated) {
    return (
      <div className="space-y-8">
        {/* Search and Filter Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="skeleton h-12 w-full sm:w-96 rounded-xl"></div>
          <div className="flex gap-2">
            <div className="skeleton h-12 w-32 rounded-xl"></div>
            <div className="skeleton h-12 w-24 rounded-xl"></div>
          </div>
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="skeleton rounded-b-none aspect-[3/2] w-full"></div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-6 w-3/4"></div>
                    <div className="skeleton h-4 w-1/2"></div>
                  </div>
                  <div className="skeleton h-6 w-16 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="skeleton h-4 w-full"></div>
                  <div className="skeleton h-4 w-2/3"></div>
                </div>
                <div className="skeleton h-4 w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Search and Filter Section */}
      <section
        className="bg-white/90 backdrop-blur-md rounded-2xl fl-p-4/6 border border-white/20 ring-1 ring-blue-100/50"
        aria-label="Search and filter pujas"
      >
        {/* Search Bar */}
        <div className="relative fl-mb-4/6">
          <div className="relative">
            <LuSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, year, theme, address..."
              value={search}
              className="w-full px-5 fl-py-3/4 rounded-xl border border-gray-200/60 focus:border-blue-400 focus-visible:border-blue-400 transition-all duration-200 text-gray-700 placeholder-gray-400 bg-white/95 backdrop-blur-sm text-base touch-manipulation"
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
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Clear search"
              >
                <LuX className="w-5 h-5" />
              </button>
            )}
            {isSearching && (
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent"></div>
              </div>
            )}
          </div>
        </div>

        {/* Filter Chips and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Filter Chips */}
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter pujas by category"
          >
            <span className="text-sm font-medium text-gray-600 flex items-center gap-2 mr-2">
              <LuFilter className="w-4 h-4" />
              Filters:
            </span>
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value as Filter)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 touch-manipulation flex items-center gap-2 cursor-pointer ${
                  filter === option.value
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                    : "bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 border border-gray-200/50"
                }`}
                aria-pressed={filter === option.value}
                aria-label={`Filter by ${option.label}${filter === option.value ? " (currently active)" : ""}`}
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
              className="px-3 py-2 rounded-lg border border-gray-200/60 text-sm bg-white/95 backdrop-blur-sm touch-manipulation"
              aria-label="Sort pujas by"
            >
              <option value="name">Name</option>
              <option value="year">Age</option>
              <option value="estd">Established</option>
              <option value="popular">Popularity</option>
            </select>
            <button
              onClick={() =>
                setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              className="p-2 rounded-lg border border-gray-200/60 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 transition-all duration-200 touch-manipulation flex items-center justify-center bg-white/95 backdrop-blur-sm"
              aria-label={`Sort ${sortDirection === "asc" ? "descending" : "ascending"}`}
              title={`Currently sorting ${sortDirection === "asc" ? "ascending" : "descending"}. Click to change.`}
            >
              {sortDirection === "asc" ? (
                <LuAArrowUp className="w-4 h-4" />
              ) : (
                <LuAArrowDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div
            className="text-sm text-gray-600"
            aria-live="polite"
            aria-atomic="true"
          >
            {isSearching ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-400 border-t-transparent"></div>
                Searching...
              </span>
            ) : (
              <>
                Showing{" "}
                <span className="font-semibold text-blue-600">
                  {filteredData.length}
                </span>{" "}
                of <span className="font-semibold">{data.length}</span> pujas
                {search && (
                  <span className="ml-2 text-gray-500">for "{search}"</span>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Empty State */}
      {filteredData.length === 0 && !isSearching && (
        <div
          className="text-center py-16 bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 ring-1 ring-gray-100/50"
          role="status"
          aria-live="polite"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <LuSearch className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No pujas found
          </h3>
          <p className="text-gray-500 mb-6">
            {search ? (
              <>
                No results found for "<strong>{search}</strong>". Try different
                keywords or clear your search.
              </>
            ) : filter && filter !== "all" ? (
              <>
                No pujas match the selected filter "
                <strong>
                  {filterOptions.find((opt) => opt.value === filter)?.label}
                </strong>
                ". Try a different category.
              </>
            ) : (
              "No pujas are currently available."
            )}
          </p>
          {(search || (filter && filter !== "all")) && (
            <button
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              aria-label="Clear all search filters and show all pujas"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 fl-gap-4/6">
        {filteredData.map((item: PujaExtended, index: number) => {
          const image = item.images?.[0];
          return (
            <div key={item.referenceId} className="group relative">
              {/* Action Buttons */}
              <div className="absolute top-3 right-3 z-5 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openPreview(item);
                  }}
                  className="cursor-pointer p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={`Quick preview of ${item.name}`}
                  title="Quick Preview"
                >
                  <LuEye className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(item.referenceId);
                  }}
                  className={`cursor-pointer p-2 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    favorites.has(item.referenceId)
                      ? "bg-red-500 text-white"
                      : "bg-white/90 hover:bg-white text-gray-700"
                  }`}
                  aria-label={`${favorites.has(item.referenceId) ? "Remove from" : "Add to"} favorites`}
                  title={
                    favorites.has(item.referenceId)
                      ? "Remove from Favorites"
                      : "Add to Favorites"
                  }
                >
                  <LuHeart
                    className={`w-4 h-4 ${favorites.has(item.referenceId) ? "fill-current" : ""}`}
                  />
                </button>
              </div>
              <Link
                href={`/puja/${item.slug}/${item.referenceId}`}
                className="block bg-white/95 backdrop-blur-sm rounded-2xl transition-all duration-300 border border-gray-200/60 hover:border-blue-200 overflow-hidden group-hover:-translate-y-2 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 touch-manipulation"
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
                    <div className="relative w-full h-full">
                      <SmartImage
                        src={imageUrl(
                          `${image.year}/${item.referenceId}/${image.name}`,
                        )}
                        fill={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        alt={item.name}
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ) : (
                    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                      <div className="w-16 h-16 mb-3 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <Image
                          src={placeholder}
                          alt={`${item.name} placeholder`}
                          className="w-10 h-10 opacity-60"
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
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0 text-left">
                        <h3 className="truncate text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                          {item.name}
                        </h3>
                        <div className="text-sm text-gray-600 mt-2 line-clamp-1 font-medium">
                          <LuMapPin className="w-4 h-4 inline-block mr-1 text-red-600" />{" "}
                          {item.address}
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="flex flex-col gap-1 ml-3 items-end">
                        {item.popular && (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 rounded-full font-medium">
                            <LuStar className="w-3 h-3" />
                            Popular
                          </span>
                        )}
                        {item.adi && (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 rounded-full font-medium">
                            <LuCrown className="w-3 h-3" />
                            Adi
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <LuHistory className="text-blue-600 w-4 h-4" />
                      </div>
                      <span className="text-gray-700 font-medium">
                        {item.year ? `${item.year} years` : "Not Known"}
                        {item.jubilee && (
                          <span className="ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-red-500 to-orange-500 text-white">
                            <LuMedal className="w-3 h-3" />
                            {item.celebrating}
                          </span>
                        )}
                        {item.preJubilee && (
                          <span className="ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            <LuMedal className="w-3 h-3" />
                            {item.celebrating}
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <LuCalendar className="text-green-600 w-4 h-4" />
                      </div>
                      <span className="text-gray-700 font-medium">
                        Established {item.estd}
                      </span>
                    </div>
                  </div>

                  {/* Action Section */}
                  <div className="pt-4 border-t border-gray-100">
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
                                    text: `Check out ${item.name} Jagadhatri Puja${item.theme ? ` - ${item.theme}` : ""}`,
                                    url: `${window.location.origin}/puja/${item.slug}/${item.referenceId}`,
                                  })
                                  .catch((error) =>
                                    console.log("Error sharing:", error),
                                  );
                              } else {
                                // Fallback to copying URL to clipboard
                                const url = `${window.location.origin}/puja/${item.slug}/${item.referenceId}`;
                                navigator.clipboard
                                  .writeText(url)
                                  .then(() => {
                                    alert("Link copied to clipboard!");
                                  })
                                  .catch((error) => {
                                    console.error("Failed to copy:", error);
                                  });
                              }
                            }}
                            className="cursor-pointer p-2 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition-colors touch-manipulation min-w-[40px] min-h-[40px] flex items-center justify-center"
                            aria-label="Share puja"
                            title="Share this puja"
                            data-prevent-progress={true}
                          >
                            <LuShare2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <LuArrowRight className="text-blue-600 group-hover:translate-x-2 transition-transform duration-200 w-5 h-5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={closePreview}
                className="cursor-pointer absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close preview"
              >
                <LuX className="w-5 h-5 text-gray-700" />
              </button>

              {/* Preview Image */}
              {previewItem.images?.[0] && (
                <div className="relative aspect-[2/1] bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="relative w-full h-full">
                    <SmartImage
                      src={imageUrl(
                        `${previewItem.images[0].year}/${previewItem.referenceId}/${previewItem.images[0].name}`,
                      )}
                      fill={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      quality={80}
                      alt={`${previewItem.images[0].name} image`}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              )}

              {/* Preview Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 text-left">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {previewItem.name}
                    </h2>
                    <div className="flex flex-col items-left gap-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <LuMapPin className="w-4 h-4 text-blue-600" />
                        {previewItem.address}
                      </span>
                      <span className="flex items-center gap-1">
                        <LuCalendar className="w-4 h-4 text-green-600" />
                        {previewItem.year
                          ? `${previewItem.year} years`
                          : "Not Known"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(previewItem.referenceId)}
                    className={`cursor-pointer p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      favorites.has(previewItem.referenceId)
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                    aria-label={`${favorites.has(previewItem.referenceId) ? "Remove from" : "Add to"} favorites`}
                  >
                    <LuHeart
                      className={`w-5 h-5 ${favorites.has(previewItem.referenceId) ? "fill-current" : ""}`}
                    />
                  </button>
                </div>

                <div className="text-justify gap-2 text-sm text-gray-600">
                  {previewItem.info}
                </div>

                {previewItem.theme && (
                  <div className="mb-4">
                    <div className="text-indigo-600 font-semibold bg-indigo-50 px-3 py-2 rounded-lg inline-block">
                      🎭 {previewItem.theme}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <Link
                    href={`/puja/${previewItem.slug}/${previewItem.referenceId}`}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold text-center hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={closePreview}
                  >
                    View Full Details
                  </Link>
                  <button
                    onClick={closePreview}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
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
