'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import PageLayout from '../../components/PageLayout';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('');
  const [cuisineTypes, setCuisineTypes] = useState([]);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const querySnapshot = await getDocs(collection(db, 'restaurants'));
        const restaurantList = [];
        const cuisines = new Set();
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.isActive) {
            restaurantList.push({
              id: doc.id,
              ...data,
            });
            
            if (data.cuisineType) {
              cuisines.add(data.cuisineType);
            }
          }
        });
        
        setRestaurants(restaurantList);
        setFilteredRestaurants(restaurantList);
        setCuisineTypes(Array.from(cuisines).sort());
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurants();
  }, []);

  useEffect(() => {
    const results = restaurants.filter((restaurant) => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           restaurant.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCuisine = cuisineFilter === '' || restaurant.cuisineType === cuisineFilter;
      
      return matchesSearch && matchesCuisine;
    });
    
    setFilteredRestaurants(results);
  }, [searchTerm, cuisineFilter, restaurants]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCuisineChange = (e) => {
    setCuisineFilter(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCuisineFilter('');
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Discover Local Restaurants
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Browse and order from the best local restaurants in your area
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 bg-white p-4 shadow rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="flex-1 mb-4 md:mb-0">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="input-field pl-10"
                  placeholder="Search restaurants..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <FunnelIcon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                <select
                  value={cuisineFilter}
                  onChange={handleCuisineChange}
                  className="input-field"
                >
                  <option value="">All Cuisines</option>
                  {cuisineTypes.map((cuisine) => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Restaurant List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="spinner animate-spin h-12 w-12 border-t-4 border-primary-500 border-solid rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading restaurants...</p>
          </div>
        ) : (
          <>
            {filteredRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredRestaurants.map((restaurant) => (
                  <div key={restaurant.id} className="card h-full flex flex-col">
                    <div className="h-48 bg-gray-200 relative">
                      {restaurant.imageUrl ? (
                        <img
                          src={restaurant.imageUrl}
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400">No image available</span>
                        </div>
                      )}
                      {restaurant.cuisineType && (
                        <span className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-medium text-gray-600">
                          {restaurant.cuisineType}
                        </span>
                      )}
                    </div>
                    <div className="p-4 flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-gray-900">{restaurant.name}</h3>
                        {restaurant.rating && (
                          <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm text-gray-600 ml-1">{restaurant.rating}</span>
                          </div>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {restaurant.description || "No description available."}
                      </p>
                      <div className="mt-4">
                        <Link
                          href={`/restaurants/${restaurant.id}`}
                          className="btn-primary text-sm"
                        >
                          View Menu
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500 mb-4">No restaurants found matching your search criteria.</p>
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
} 