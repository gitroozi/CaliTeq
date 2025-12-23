import { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import ExerciseCard from '../components/ExerciseCard';
import ExerciseDetailModal from '../components/ExerciseDetailModal';
import ExerciseFilters from '../components/ExerciseFilters';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import type { Exercise, ExerciseFilters as Filters } from '../types';
import { exerciseApi } from '../services/api';

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 12;

  useEffect(() => {
    loadExercises();
  }, [currentPage, filters]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      } else {
        loadExercises();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadExercises = async () => {
    setIsLoading(true);
    setError('');

    try {
      const params: Filters = {
        ...filters,
        page: currentPage,
        limit: pageSize,
      };

      const response = await exerciseApi.getExercises(params);
      setExercises(response.data);
      setTotalCount(response.total);
      setCurrentPage(response.page || 1);
      setTotalPages(Math.ceil(response.total / response.limit));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load exercises');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadExercises();
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const params: Filters = {
        ...filters,
        page: currentPage,
        limit: pageSize,
      };

      const response = await exerciseApi.searchExercises(searchQuery, params);
      setExercises(response.data);
      setTotalCount(response.total);
      setCurrentPage(response.page || 1);
      setTotalPages(Math.ceil(response.total / response.limit));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to search exercises');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (exercise: Exercise) => {
    setSelectedExerciseId(exercise.id);
    setIsDetailModalOpen(true);
  };

  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = Boolean(
    filters.pattern ||
    filters.difficulty ||
    filters.minDifficulty ||
    filters.maxDifficulty ||
    filters.equipment?.length ||
    filters.noEquipment
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Exercise Library</h1>
            <p className="mt-2 text-sm text-slate-600">
              Browse {totalCount} exercises by movement pattern and difficulty
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <input
                type="search"
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>

            <Button
              variant="outline"
              onClick={() => setIsFiltersModalOpen(true)}
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
                />
              </svg>
              Filters
              {hasActiveFilters && (
                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-primary-600 rounded-full">
                  !
                </span>
              )}
            </Button>

            {(hasActiveFilters || searchQuery) && (
              <Button variant="ghost" onClick={handleClearFilters}>
                Clear all
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-600">Active filters:</span>
            {filters.pattern && (
              <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800">
                Pattern: {filters.pattern}
                <button
                  onClick={() => handleApplyFilters({ ...filters, pattern: undefined })}
                  className="ml-2 hover:text-primary-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.minDifficulty && (
              <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800">
                Min Level: {filters.minDifficulty}
                <button
                  onClick={() => handleApplyFilters({ ...filters, minDifficulty: undefined })}
                  className="ml-2 hover:text-primary-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.maxDifficulty && (
              <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800">
                Max Level: {filters.maxDifficulty}
                <button
                  onClick={() => handleApplyFilters({ ...filters, maxDifficulty: undefined })}
                  className="ml-2 hover:text-primary-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.noEquipment && (
              <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800">
                No equipment
                <button
                  onClick={() => handleApplyFilters({ ...filters, noEquipment: undefined })}
                  className="ml-2 hover:text-primary-900"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Exercise Grid */}
        {!isLoading && exercises.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {exercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNum: number;

                    if (totalPages <= 7) {
                      pageNum = i + 1;
                    } else if (currentPage <= 4) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 3) {
                      pageNum = totalPages - 6 + i;
                    } else {
                      pageNum = currentPage - 3 + i;
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? 'bg-primary-600 text-white font-medium'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && exercises.length === 0 && (
          <div className="text-center py-20">
            <svg
              className="mx-auto h-16 w-16 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No exercises found</h3>
            <p className="mt-2 text-sm text-slate-600">
              {searchQuery || hasActiveFilters
                ? 'Try adjusting your search or filters'
                : 'Start by browsing exercises or use the search'}
            </p>
            {(searchQuery || hasActiveFilters) && (
              <Button onClick={handleClearFilters} className="mt-4">
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <ExerciseFilters
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
      />

      {selectedExerciseId && (
        <ExerciseDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedExerciseId(null);
          }}
          exerciseId={selectedExerciseId}
        />
      )}
    </AppShell>
  );
}
