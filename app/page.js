'use client';

import Link from 'next/link';
import PageLayout from '../components/PageLayout.jsx';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, limit, where } from 'firebase/firestore';

export default function Home() {
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    async function fetchFeaturedRestaurants() {
      try {
        const q = query(collection(db, 'restaurants'), limit(3));
        const querySnapshot = await getDocs(q);
        
        const restaurants = [];
        querySnapshot.forEach((doc) => {
          restaurants.push({ id: doc.id, ...doc.data() });
        });
        
        setFeaturedRestaurants(restaurants);
      } catch (error) {
        console.error('Error fetching featured restaurants:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (isClient) {
      fetchFeaturedRestaurants();
    }
  }, [isClient]);

  // Dummy data for benefits section
  const benefits = [
    {
      id: 1,
      title: 'Discover Local Flavors',
      description: 'Find the best restaurants in your area, with detailed menus and photos to help you choose your next meal.',
      icon: '🍽️',
    },
    {
      id: 2,
      title: 'Earn Rewards',
      description: 'Collect points with every order and unlock special discounts and exclusive offers.',
      icon: '🏆',
    },
    {
      id: 3,
      title: 'Support Local Businesses',
      description: 'Help local restaurants thrive by ordering directly and avoiding high commission fees.',
      icon: '🏙️',
    },
  ];

  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="bg-primary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Discover and Order from the Best Local Restaurants
              </h1>
              <p className="text-lg md:text-xl mb-8">
                Browse menus, see reviews, and enjoy amazing food from your favorite local spots.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/restaurants" className="btn-white">
                  Browse Restaurants
                </Link>
                <Link href="/signup" className="btn-outline-white">
                  Create Account
                </Link>
              </div>
            </div>
            <div className="hidden md:block md:w-1/2">
              {/* Hero Image or Illustration would go here */}
              <div className="h-80 bg-white/10 rounded-lg mt-8 md:mt-0"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Restaurants Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Restaurants</h2>
            <p className="mt-4 text-lg text-gray-600">
              Discover some of our most popular restaurants
            </p>
          </div>

          {!isClient || loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="spinner animate-spin h-12 w-12 border-t-4 border-primary-500 border-solid rounded-full"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredRestaurants.length > 0 ? (
                featuredRestaurants.map((restaurant) => (
                  <div key={restaurant.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="h-48 bg-gray-200">
                      {restaurant.imageUrl ? (
                        <img
                          src={restaurant.imageUrl}
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                          No image available
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{restaurant.name}</h3>
                      <p className="text-gray-600 mb-4">{restaurant.cuisineType}</p>
                      <Link
                        href={`/restaurants/${restaurant.id}`}
                        className="btn-primary w-full text-center"
                      >
                        View Menu
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500">No featured restaurants available.</p>
                  <Link href="/restaurants" className="btn-primary mt-4 inline-block">
                    Browse All Restaurants
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Us?</h2>
            <p className="mt-4 text-lg text-gray-600">
              Enjoy a better dining experience with our platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-primary-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Join our platform today and discover the best local restaurants. Create an account to start earning rewards with every order.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup" className="btn-white">
              Sign Up Now
            </Link>
            <Link href="/restaurants" className="btn-outline-white">
              Browse Restaurants
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 