'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '../../../lib/firebase';
import { doc, getDoc, collection, query, getDocs } from 'firebase/firestore';
import PageLayout from '../../../components/PageLayout';
import { MapPinIcon, PhoneIcon, ClockIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

// This is needed for static export with dynamic routes
// In a real app, you'd fetch this data from your API/database 
// For static export, we'll use dummy IDs for demonstration
export async function generateStaticParams() {
  // Provide some dummy restaurant IDs for static generation
  // This allows Next.js to pre-render these pages at build time
  return [
    { id: 'restaurant1' },
    { id: 'restaurant2' },
    { id: 'restaurant3' },
    { id: 'sample-restaurant' },
    { id: 'demo-restaurant' },
  ];
}

export default function RestaurantDetails() {
  const { id } = useParams();
  const router = useRouter();
  
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    async function fetchRestaurantAndMenu() {
      try {
        // Fetch restaurant details
        const restaurantDoc = await getDoc(doc(db, 'restaurants', id));
        
        if (!restaurantDoc.exists()) {
          setError('Restaurant not found');
          setLoading(false);
          return;
        }
        
        const restaurantData = { id: restaurantDoc.id, ...restaurantDoc.data() };
        setRestaurant(restaurantData);
        
        // Fetch menu items
        const menuItemsRef = collection(db, `restaurants/${id}/menuItems`);
        const menuSnapshot = await getDocs(menuItemsRef);
        
        const items = [];
        const categories = new Set();
        
        menuSnapshot.forEach(doc => {
          const item = { id: doc.id, ...doc.data() };
          items.push(item);
          
          if (item.category) {
            categories.add(item.category);
          }
        });
        
        setMenuItems(items);
        setMenuCategories(['all', ...Array.from(categories).sort()]);
        
      } catch (err) {
        console.error('Error fetching restaurant details:', err);
        setError('Failed to load restaurant details');
      } finally {
        setLoading(false);
      }
    }
    
    if (id && isClient) {
      fetchRestaurantAndMenu();
    }
  }, [id, isClient]);

  const handleAddToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // Increase quantity if item already in cart
        return prevCart.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        // Add new item to cart
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const filteredMenuItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  // Format opening hours for display
  const formatOpeningHours = (hours) => {
    if (!hours) return 'Hours not available';
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return days.map(day => {
      if (hours[day]) {
        return `${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours[day].open} - ${hours[day].close}`;
      }
      return `${day.charAt(0).toUpperCase() + day.slice(1)}: Closed`;
    });
  };

  // Don't render on server - only client
  if (!isClient) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
          <div className="spinner animate-spin h-12 w-12 border-t-4 border-primary-500 border-solid rounded-full"></div>
        </div>
      </PageLayout>
    );
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
          <div className="spinner animate-spin h-12 w-12 border-t-4 border-primary-500 border-solid rounded-full"></div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => router.push('/restaurants')}
              className="btn-primary"
            >
              Back to Restaurants
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!restaurant) {
    return null;
  }

  return (
    <PageLayout>
      {/* Restaurant Header */}
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 truncate">{restaurant.name}</h1>
              <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                {restaurant.cuisineType && (
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span>{restaurant.cuisineType}</span>
                  </div>
                )}
                {restaurant.address && (
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                    <span>{restaurant.address}</span>
                  </div>
                )}
                {restaurant.phone && (
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <PhoneIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                    <span>{restaurant.phone}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={() => router.push(`/checkout/${restaurant.id}`)}
                  className="btn-primary flex items-center"
                >
                  <ShoppingCartIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  <span>Checkout ({cart.reduce((total, item) => total + item.quantity, 0)} items)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left Sidebar - Restaurant Info */}
          <div className="lg:col-span-4">
            <div className="bg-white shadow overflow-hidden rounded-lg mb-8">
              {restaurant.imageUrl && (
                <div className="h-64">
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">Restaurant Information</h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  {restaurant.description && (
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Description</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{restaurant.description}</dd>
                    </div>
                  )}
                  {restaurant.openingHours && (
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                        <span>Opening Hours</span>
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <ul className="divide-y divide-gray-200">
                          {formatOpeningHours(restaurant.openingHours).map((dayHours, index) => (
                            <li key={index} className="py-1">{dayHours}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>

          {/* Right Content - Menu */}
          <div className="lg:col-span-8">
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Menu</h3>
                
                {/* Category Filter */}
                <div>
                  <div className="flex flex-wrap gap-2">
                    {menuCategories.map(category => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-3 py-1 text-sm rounded-full ${
                          activeCategory === category
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {filteredMenuItems.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {filteredMenuItems.map(item => (
                    <li key={item.id} className="px-4 py-4 flex items-start">
                      <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <span className="text-gray-400 text-xs">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h4 className="text-md font-medium">{item.name}</h4>
                          <p className="text-md font-medium text-gray-900">${item.price.toFixed(2)}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                        <div className="mt-2">
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="btn-outline text-sm py-1"
                          >
                            Add to Order
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-5 text-center text-gray-500">
                  No menu items available for this category.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 