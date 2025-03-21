-- Create the Database
CREATE DATABASE ecommerce_db;

-- Use the newly created database
USE ecommerce_db;

-- Create Products Table
CREATE TABLE Products (
    product_name VARCHAR(255) NOT NULL,
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL,
    image1_url VARCHAR(255),
    image2_url VARCHAR(255),
    image3_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Orders Table
CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    state VARCHAR(100),
    district VARCHAR(100),
    quantity INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method ENUM('Cash on Delivery', 'Credit Card') NOT NULL,
    status ENUM(
        'Pending',
        'Calling for Confirmation',
        'Confirmed',
        'Packing',
        'Out for Delivery',
        'Delivered (Waiting for DC to Call You)'
    ) DEFAULT 'Pending',
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
);

-- Insert example data into Products table
1
-- Insert example data into Orders table
INSERT INTO Orders (product_id, customer_name, customer_email, quantity, total_price, payment_method, status)
VALUES
(1, 'John Doe', 'john@example.com', 2, 39.98, 'Credit Card', 'Pending'),
(2, 'Jane Smith', 'jane@example.com', 1, 29.99, 'Cash on Delivery', 'Confirmed'),
(3, 'Mike Brown', 'mike@example.com', 3, 149.97, 'Credit Card', 'Out for Delivery');
