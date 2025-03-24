# Data Schema for Restaurant Website

This document outlines how data will be organized in the Firebase database. While technical in nature, it helps understand how information is structured.

## Collections and Documents

### Users Collection
Stores information about all users of the platform:

```
users/{userId}
{
  userId: string,
  email: string,
  name: string,
  phone: string (optional),
  address: string (optional),
  created: timestamp,
  lastLogin: timestamp,
  role: string ("customer" or "restaurant_owner" or "admin"),
  pointsEarned: number,
  ordersCompleted: number,
  currentTier: string ("bronze", "silver", "gold")
}
```

### Restaurants Collection
Stores information about each restaurant:

```
restaurants/{restaurantId}
{
  restaurantId: string,
  ownerId: string,  // References a user with role "restaurant_owner"
  name: string,
  description: string,
  address: string,
  phone: string,
  email: string,
  website: string (optional),
  cuisineType: string,
  openingHours: {
    monday: { open: string, close: string },
    tuesday: { open: string, close: string },
    // and so on for each day
  },
  imageUrl: string,  // Main restaurant image
  bannerUrl: string (optional),  // Banner image for the restaurant page
  rating: number,  // Average of all ratings
  totalRatings: number,
  created: timestamp,
  modified: timestamp,
  isActive: boolean
}
```

### Menu Items Collection
Stores all menu items for each restaurant:

```
restaurants/{restaurantId}/menuItems/{menuItemId}
{
  menuItemId: string,
  restaurantId: string,
  name: string,
  description: string,
  price: number,
  category: string,  // Appetizer, Main Course, Dessert, etc.
  imageUrl: string,
  isAvailable: boolean,
  isPopular: boolean,
  isVegetarian: boolean (optional),
  isVegan: boolean (optional),
  allergens: array (optional),
  created: timestamp,
  modified: timestamp
}
```

### Orders Collection
Stores all orders placed by users:

```
orders/{orderId}
{
  orderId: string,
  userId: string,
  restaurantId: string,
  items: [
    {
      menuItemId: string,
      name: string,
      price: number,
      quantity: number,
      specialInstructions: string (optional)
    }
  ],
  subtotal: number,
  discount: number,
  deliveryFee: number (optional),
  tax: number,
  tip: number (optional),
  total: number,
  status: string,  // "pending", "preparing", "ready", "delivered", "completed", "cancelled"
  paymentMethod: string,
  paymentStatus: string,  // "pending", "completed", "failed", "refunded"
  deliveryAddress: string (optional),
  isDelivery: boolean,  // true for delivery, false for pickup
  createdAt: timestamp,
  estimatedReadyTime: timestamp,
  completedAt: timestamp (optional),
  specialInstructions: string (optional)
}
```

### Reviews Collection
Stores customer reviews for restaurants:

```
restaurants/{restaurantId}/reviews/{reviewId}
{
  reviewId: string,
  userId: string,
  restaurantId: string,
  orderId: string (optional),
  rating: number,  // 1-5
  text: string,
  created: timestamp,
  modified: timestamp (optional),
  isVisible: boolean
}
```

### Rewards Configuration Collection
Stores the configuration for the rewards program:

```
rewardsConfig/{configId}
{
  configId: string,  // Usually just one document "default"
  tiers: [
    {
      name: string,  // "bronze", "silver", "gold"
      minOrders: number,
      maxOrders: number (optional),
      discountPercentage: number,
      benefits: array of strings
    }
  ],
  pointsPerOrder: number,
  created: timestamp,
  modified: timestamp,
  isActive: boolean
}
```

## Relationships

- A User can own one or more Restaurants (if they have the "restaurant_owner" role)
- A Restaurant belongs to one User (ownerId)
- A Restaurant has many Menu Items
- A User can place many Orders
- A Restaurant can receive many Orders
- A User can leave many Reviews
- A Restaurant can have many Reviews
- An Order can have many Menu Items

## Data Security Rules

Firebase security rules will be set up to ensure:

1. Restaurant owners can only edit their own restaurant data
2. Users can only view their own profile data
3. Orders are readable by the restaurant owner and the user who placed them
4. Public data (restaurant listings, menus) is readable by everyone
5. Admin users have full access to monitor and maintain the platform 