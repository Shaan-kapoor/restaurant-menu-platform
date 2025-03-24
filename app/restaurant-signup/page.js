'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import PageLayout from '../../components/PageLayout.jsx';

export default function RestaurantSignup() {
  const router = useRouter();
  const { signup, currentUser } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // User account info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Restaurant info
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantDescription, setRestaurantDescription] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const validateImageUrl = (url) => {
    if (!url) return true; // Empty URL is valid (not required)
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const validateStep1 = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    if (!restaurantName || !cuisineType || !address || !phone) {
      setError('Please fill in all required fields');
      return false;
    }
    
    if (imageUrl && !validateImageUrl(imageUrl)) {
      setError('Please enter a valid image URL');
      return false;
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setError('');
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setError('');
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Create user account
      const userCredential = await signup(email, password, name, 'restaurant_owner');
      const userId = userCredential.uid;
      
      // Create restaurant document
      const restaurantRef = doc(db, 'restaurants', userId);
      await setDoc(restaurantRef, {
        ownerId: userId,
        name: restaurantName,
        description: restaurantDescription,
        cuisineType: cuisineType,
        address: address,
        phone: phone,
        website: website || '',
        imageUrl: imageUrl || '',
        rating: 0,
        totalRatings: 0,
        isActive: true,
        created: serverTimestamp(),
        modified: serverTimestamp(),
        openingHours: {
          monday: { open: '09:00', close: '22:00' },
          tuesday: { open: '09:00', close: '22:00' },
          wednesday: { open: '09:00', close: '22:00' },
          thursday: { open: '09:00', close: '22:00' },
          friday: { open: '09:00', close: '23:00' },
          saturday: { open: '10:00', close: '23:00' },
          sunday: { open: '10:00', close: '22:00' },
        }
      });
      
      // Navigate to dashboard
      router.push('/dashboard');
      
    } catch (err) {
      console.error('Error signing up restaurant:', err);
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden md:max-w-2xl">
          <div className="md:flex">
            <div className="md:shrink-0">
              <img
                className="h-48 w-full object-cover md:h-full md:w-48"
                src="/images/restaurant-signup.jpg"
                alt="Restaurant signup"
              />
            </div>
            <div className="p-8 w-full">
              <div className="uppercase tracking-wide text-sm text-primary-500 font-semibold">
                {step === 1 ? 'Step 1 of 2: Account Details' : 'Step 2 of 2: Restaurant Details'}
              </div>
              <h2 className="mt-2 text-xl font-bold text-gray-900">
                Add Your Restaurant
              </h2>
              
              {error && (
                <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              
              {step === 1 && (
                <div className="mt-6 space-y-6">
                  <div>
                    <label htmlFor="name" className="label">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="input-field"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="label">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="input-field"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="label">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      className="input-field"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirm-password" className="label">
                      Confirm Password
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      className="input-field"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="mt-6 space-y-6">
                  <div>
                    <label htmlFor="restaurant-name" className="label">
                      Restaurant Name *
                    </label>
                    <input
                      id="restaurant-name"
                      type="text"
                      className="input-field"
                      value={restaurantName}
                      onChange={(e) => setRestaurantName(e.target.value)}
                      placeholder="Your restaurant name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cuisine-type" className="label">
                      Cuisine Type *
                    </label>
                    <select
                      id="cuisine-type"
                      className="input-field"
                      value={cuisineType}
                      onChange={(e) => setCuisineType(e.target.value)}
                      required
                    >
                      <option value="">Select cuisine type</option>
                      <option value="Italian">Italian</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Mexican">Mexican</option>
                      <option value="Japanese">Japanese</option>
                      <option value="Indian">Indian</option>
                      <option value="American">American</option>
                      <option value="Thai">Thai</option>
                      <option value="Mediterranean">Mediterranean</option>
                      <option value="French">French</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="label">
                      Description
                    </label>
                    <textarea
                      id="description"
                      className="input-field h-24"
                      value={restaurantDescription}
                      onChange={(e) => setRestaurantDescription(e.target.value)}
                      placeholder="Brief description of your restaurant"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="label">
                      Address *
                    </label>
                    <input
                      id="address"
                      type="text"
                      className="input-field"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Full street address"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="label">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className="input-field"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Restaurant phone number"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="website" className="label">
                      Website (optional)
                    </label>
                    <input
                      id="website"
                      type="url"
                      className="input-field"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://yourrestaurant.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="image-url" className="label">
                      Restaurant Image URL (optional)
                    </label>
                    <input
                      id="image-url"
                      type="url"
                      className="input-field"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/your-restaurant-image.jpg"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Use an image hosting service like Imgur or ImgBB and paste the direct image URL here
                    </p>
                    
                    {imageUrl && validateImageUrl(imageUrl) && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Image preview:</p>
                        <img
                          src={imageUrl}
                          alt="Restaurant preview"
                          className="h-32 w-32 object-cover rounded-md"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/image-placeholder.svg';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex justify-between">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-outline"
                    disabled={loading}
                  >
                    Back
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="btn-primary ml-auto"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : step === 1 ? 'Next' : 'Create Restaurant'}
                </button>
              </div>
              
              <p className="mt-6 text-center text-xs text-gray-500">
                By signing up, you agree to our{' '}
                <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 