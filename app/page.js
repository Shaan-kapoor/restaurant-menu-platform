'use client';

import Link from 'next/link';
import PageLayout from '../components/PageLayout';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, limit, where } from 'firebase/firestore';

export default function Home() {
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedRestaurants() {
      try {
        const q = query(
          collection(db, 'restaurants'),
          where('isActive', '==', true),
          limit(4)
        );
        
        const querySnapshot = await getDocs(q);
        const restaurants = [];
        
        querySnapshot.forEach((doc) => {
          restaurants.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        
        setFeaturedRestaurants(restaurants);
      } catch (error) {
        console.error("Error fetching featured restaurants:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedRestaurants();
  }, []);

  const benefits = [
    {
      title: 'Discover Local Restaurants',
      description: 'Explore a variety of restaurants in your area, from cozy cafes to fine dining.',
      icon: (
        <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      title: 'Easy Ordering',
      description: 'Order your favorite dishes with just a few clicks for delivery or pickup.',
      icon: (
        <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: 'Earn Rewards',
      description: 'Get points with every order and unlock exclusive discounts and free items.',
      icon: (
        <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Discover and Order from Local Restaurants
            </h1>
            <p className="mt-6 text-xl max-w-3xl mx-auto">
              Browse menus, place orders, and earn rewards from your favorite local restaurants.
            </p>
            <div className="mt-10 flex justify-center">
              <Link href="/restaurants" className="btn-primary text-lg px-8 py-3">
                Find Restaurants
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Restaurants */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Featured Restaurants</h2>
          <p className="mt-4 text-lg text-gray-500">Discover some of our most popular dining options</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="spinner animate-spin h-12 w-12 border-t-4 border-primary-500 border-solid rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading restaurants...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredRestaurants.length > 0 ? (
              featuredRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="card overflow-hidden">
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
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">{restaurant.name}</h3>
                    <p className="text-sm text-gray-500">{restaurant.cuisineType}</p>
                    <div className="mt-4">
                      <Link
                        href={`/restaurants/${restaurant.id}`}
                        className="btn-outline text-sm"
                      >
                        View Menu
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No featured restaurants available yet.</p>
                <Link href="/restaurants" className="mt-4 btn-primary inline-block">
                  Browse All Restaurants
                </Link>
              </div>
            )}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link href="/restaurants" className="btn-primary">
            View All Restaurants
          </Link>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Us</h2>
            <p className="mt-4 text-lg text-gray-500">Enjoy these benefits when using our platform</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-50">
                  {benefit.icon}
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900">{benefit.title}</h3>
                <p className="mt-2 text-base text-gray-500">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            <span className="block">Ready to start ordering?</span>
            <span className="block text-primary-200">Create an account today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/signup" className="bg-white text-primary-600 hover:bg-gray-50 px-6 py-3 rounded-md font-medium">
                Sign Up
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link href="/restaurant-signup" className="bg-primary-500 text-white hover:bg-primary-700 px-6 py-3 rounded-md font-medium">
                Add Your Restaurant
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 