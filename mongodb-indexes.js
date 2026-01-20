/**
 * MongoDB Indexes Configuration
 * 
 * Rulează acest script în MongoDB shell sau MongoDB Compass
 * pentru a crea index-urile necesare pentru performanță și funcționalitate
 */

// Switch to database
db.auth("admin", "admin");
db = db.getSiblingDB("florarie");

// ============================================
// ORDERS COLLECTION INDEXES
// ============================================

// Index pentru căutare rapidă după ID custom
db.orders.createIndex({ "id": 1 }, { unique: true });

// Index pentru căutare după email client
db.orders.createIndex({ "clientEmail": 1 });

// Index pentru filtrare după status
db.orders.createIndex({ "status": 1 });

// Index pentru căutare după număr comandă
db.orders.createIndex({ "orderNumber": 1 }, { unique: true });

// Index pentru sortare după data comenzii
db.orders.createIndex({ "orderDate": -1 });

// Index pentru userId (pentru "your orders")
db.orders.createIndex({ "userId": 1 });

// Compound index pentru queries comune
db.orders.createIndex({ "userId": 1, "status": 1, "orderDate": -1 });

// Index pentru plăți cu cardul
db.orders.createIndex({ "paymentMethod": 1, "paymentStatus": 1 });

// Index pentru status plată (pentru filtrare comenzi pending payment)
db.orders.createIndex({ "paymentStatus": 1 });

// ============================================
// PENDING-ORDERS COLLECTION INDEXES
// ============================================

// Index pentru căutare rapidă după ID custom
db["pending-orders"].createIndex({ "id": 1 }, { unique: true });

// Index pentru auto-ștergere comenzilor expirate (TTL index)
db["pending-orders"].createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 });

// Index pentru căutare după email client
db["pending-orders"].createIndex({ "clientEmail": 1 });

// ============================================
// PRODUCTS COLLECTION INDEXES
// ============================================

// Index pentru căutare după ID
db.products.createIndex({ "id": 1 }, { unique: true });

// Index pentru filtrare după categorie
db.products.createIndex({ "category": 1 });

// Index pentru căutare text în nume
db.products.createIndex({ "name": "text", "description": "text" });

// Index pentru filtrare după stoc
db.products.createIndex({ "quantity": 1 });

// Compound index pentru queries de filtrare
db.products.createIndex({ "category": 1, "quantity": 1 });

// ============================================
// PRODUCTS-COMPOSED COLLECTION INDEXES
// ============================================

// Index pentru căutare după ID
db["products-composed"].createIndex({ "id": 1 }, { unique: true });

// Index pentru filtrare după categorie
db["products-composed"].createIndex({ "category": 1 });

// Index pentru produse populare
db["products-composed"].createIndex({ "isPopular": 1 });

// Index pentru produse noi
db["products-composed"].createIndex({ "newest": 1 });

// Index pentru promoții
db["products-composed"].createIndex({ "promotion": 1 });

// Index pentru stoc
db["products-composed"].createIndex({ "inStock": 1 });

// Index pentru căutare text
db["products-composed"].createIndex({ "title": "text", "description": "text" });

// Compound index pentru filtrare
db["products-composed"].createIndex({ "category": 1, "inStock": 1, "isPopular": -1 });

// ============================================
// USERS COLLECTION INDEXES
// ============================================

// Index pentru căutare după ID
db.users.createIndex({ "id": 1 }, { unique: true });

// Index pentru login (email trebuie să fie unic)
db.users.createIndex({ "email": 1 }, { unique: true });

// Index pentru căutare după telefon
db.users.createIndex({ "phone": 1 });

// Index pentru sortare după data creării
db.users.createIndex({ "createdAt": -1 });

// ============================================
// POSTS COLLECTION (MEDIA/GALLERY) INDEXES
// ============================================

// Index pentru căutare după publicId
db.posts.createIndex({ "publicId": 1 }, { unique: true });

// Index pentru featured posts
db.posts.createIndex({ "isFeatured": 1 });

// Index pentru sortare după data creării
db.posts.createIndex({ "createdAt": -1 });

// ============================================
// VERIFICARE INDEXES
// ============================================

print("\n=== Orders Indexes ===");
printjson(db.orders.getIndexes());

print("\n=== Pending-Orders Indexes ===");
printjson(db["pending-orders"].getIndexes());

print("\n=== Products Indexes ===");
printjson(db.products.getIndexes());

print("\n=== Products-Composed Indexes ===");
printjson(db["products-composed"].getIndexes());

print("\n=== Users Indexes ===");
printjson(db.users.getIndexes());

print("\n=== Posts Indexes ===");
printjson(db.posts.getIndexes());

print("\n✅ Indexes created successfully!");
print("\n📝 Pending-orders will be automatically deleted after 20 minutes (TTL index).");
print("   Orders are created in 'orders' collection ONLY after successful card payment.");
print("   Webhook will create final order + send email after payment confirmation.");
