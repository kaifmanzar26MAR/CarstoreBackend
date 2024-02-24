// Admin schema
function Admin(adminData) {
  this.admin_id = adminData.admin_id;
  this.password = adminData.password;
}

// Car Buyer (User) schema
function User(userData) {
  this.user_email = userData.user_email;
  this.user_id = userData.user_id || Math.random().toString(36).substring(2);
  this.user_location = userData.user_location;
  this.user_info = userData.user_info || {};
  this.password = userData.password;
  this.vehicle_info = userData.vehicle_info || [];
}

// Car Seller (Dealership) schema
function Dealership(dealershipData) {
  this.dealership_email = dealershipData.dealership_email;
  this.dealership_id = dealershipData.dealership_id || Math.random().toString(36).substring(2);
  this.dealership_name = dealershipData.dealership_name;
  this.dealership_location = dealershipData.dealership_location;
  this.password = dealershipData.password;
  this.dealership_info = dealershipData.dealership_info || {};
  this.cars = dealershipData.cars || [];
  this.deals = dealershipData.deals || [];
  this.sold_vehicles = dealershipData.sold_vehicles || [];
}

// Available Car Deals (Deal) schema
function Deal(dealData) {
  this.deal_id = dealData.deal_id || Math.random().toString(36).substring(2);
  this.car_id = dealData.car_id;
  this.deal_info = dealData.deal_info || {};
}

// Info on Cars (Cars) schema
function Car(carData) {
  this.car_id = carData.car_id || Math.random().toString(36).substring(2);
  this.type = carData.type;
  this.name = carData.name;
  this.model = carData.model;
  this.car_info = carData.car_info || {};
}

// Cars Sold (SoldVehicles) schema
function SoldVehicle(soldVehicleData) {
  this.vehicle_id = soldVehicleData.vehicle_id || Math.random().toString(36).substring(2);
  this.car_id = soldVehicleData.car_id;
  this.vehicle_info = soldVehicleData.vehicle_info || {};
}

// Example usage:
export{ Admin, User, Dealership, Deal, Car, SoldVehicle }
