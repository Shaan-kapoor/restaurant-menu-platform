'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/firebase';
import { doc, getDoc, collection, query, getDocs, where, orderBy } from 'firebase/firestore';
import PageLayout from '../../components/PageLayout';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const { currentUser, userRole } = useAuth();
  
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function fetchRestaurantData() {
      if (!currentUser || userRole !== 'restaurant_owner') {
        router.push('/login');
        return;
      }

      try {
        // Fetch restaurant data
        const restaurantDoc = await getDoc(doc(db, 'restaurants', currentUser.uid));
        
        if (!restaurantDoc.exists()) {
          // Restaurant document doesn't exist, redirect to create restaurant
          router.push('/restaurant-signup');
          return;
        }

        const restaurantData = { id: restaurantDoc.id, ...restaurantDoc.data() };
        setRestaurant(restaurantData);

        // Fetch menu items
        const menuItemsRef = collection(db, `restaurants/${currentUser.uid}/menuItems`);
        const menuSnapshot = await getDocs(menuItemsRef);
        
        const items = [];
        menuSnapshot.forEach(doc => {
          items.push({ id: doc.id, ...doc.data() });
        });
        
        setMenuItems(items);

        // Fetch recent orders
        if (restaurantData.id) {
          const ordersRef = collection(db, 'orders');
          const ordersQuery = query(
            ordersRef,
            where('restaurantId', '==', restaurantData.id),
            orderBy('createdAt', 'desc'),
            // limit(10) // Uncomment this when you have many orders
          );

          const ordersSnapshot = await getDocs(ordersQuery);
          const ordersList = [];
          
          ordersSnapshot.forEach(doc => {
            ordersList.push({ id: doc.id, ...doc.data() });
          });
          
          setRecentOrders(ordersList);
        }
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurantData();
  }, [currentUser, userRole, router]);

  if (loading) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center">
            <div className="spinner animate-spin h-12 w-12 border-t-4 border-primary-500 border-solid rounded-full"></div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!restaurant) {
    return null;
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <PageLayout>
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Dashboard: {restaurant.name}
              </h1>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Link
                href="/dashboard/menu/add"
                className="btn-primary"
              >
                Add Menu Item
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6">
            <div className="sm:hidden">
              <select
                id="tabs"
                name="tabs"
                className="input-field"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
              >
                <option value="overview">Overview</option>
                <option value="menu">Menu</option>
                <option value="orders">Orders</option>
                <option value="settings">Settings</option>
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`${
                      activeTab === 'overview'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('menu')}
                    className={`${
                      activeTab === 'menu'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Menu Management
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`${
                      activeTab === 'orders'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Orders
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`${
                      activeTab === 'settings'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Settings
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Stats Cards */}
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Menu Items
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        {menuItems.length}
                      </dd>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Orders
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        {recentOrders.length}
                      </dd>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Rating
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        {restaurant.rating > 0 ? restaurant.rating.toFixed(1) : 'No ratings'}
                      </dd>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
                  {recentOrders.length > 0 ? (
                    <div className="mt-4 flex flex-col">
                      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Order ID
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Date
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Status
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Total
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {recentOrders.map((order) => (
                                  <tr key={order.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {order.id.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {formatDate(order.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                        'bg-yellow-100 text-yellow-800'
                                      }`}>
                                        {order.status}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      ${order.total ? order.total.toFixed(2) : '0.00'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-4 text-gray-500">No orders yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* Menu Management Tab */}
            {activeTab === 'menu' && (
              <div>
                <div className="flex justify-between mb-6">
                  <h2 className="text-lg font-medium text-gray-900">Menu Items</h2>
                  <Link
                    href="/dashboard/menu/add"
                    className="btn-primary"
                  >
                    Add Menu Item
                  </Link>
                </div>

                {menuItems.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {menuItems.map((item) => (
                      <div key={item.id} className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="h-40 bg-gray-200 relative">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <span className="text-gray-400">No image</span>
                            </div>
                          )}
                          {item.category && (
                            <span className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-medium text-gray-600">
                              {item.category}
                            </span>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                            <p className="text-lg font-medium text-gray-900">${item.price.toFixed(2)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                            {item.description || "No description available."}
                          </p>
                          <div className="mt-4 flex space-x-2">
                            <Link
                              href={`/dashboard/menu/edit/${item.id}`}
                              className="btn-outline text-sm py-1 px-3"
                            >
                              Edit
                            </Link>
                            <button
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500 mb-4">No menu items yet. Add your first menu item to get started.</p>
                    <Link
                      href="/dashboard/menu/add"
                      className="btn-primary"
                    >
                      Add Menu Item
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6">Order Management</h2>
                
                {recentOrders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Order ID
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Customer
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Total
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentOrders.map((order) => (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.id.substring(0, 8)}...
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(order.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.userId || 'Anonymous'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${order.total ? order.total.toFixed(2) : '0.00'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Link
                                href={`/dashboard/orders/${order.id}`}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500">No orders yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6">Restaurant Settings</h2>
                
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="restaurant-name" className="label">
                          Restaurant Name
                        </label>
                        <input
                          type="text"
                          name="restaurant-name"
                          id="restaurant-name"
                          className="input-field"
                          defaultValue={restaurant.name}
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="cuisine-type" className="label">
                          Cuisine Type
                        </label>
                        <input
                          type="text"
                          name="cuisine-type"
                          id="cuisine-type"
                          className="input-field"
                          defaultValue={restaurant.cuisineType}
                        />
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="description" className="label">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          className="input-field"
                          defaultValue={restaurant.description}
                        />
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="address" className="label">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          id="address"
                          className="input-field"
                          defaultValue={restaurant.address}
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="phone" className="label">
                          Phone
                        </label>
                        <input
                          type="text"
                          name="phone"
                          id="phone"
                          className="input-field"
                          defaultValue={restaurant.phone}
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="website" className="label">
                          Website
                        </label>
                        <input
                          type="text"
                          name="website"
                          id="website"
                          className="input-field"
                          defaultValue={restaurant.website}
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        type="button"
                        className="btn-primary"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 