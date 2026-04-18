create database project;
-- User table
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    loyalty_points INT,
    subscription_status VARCHAR(20),
    user_address_id INT,
    FOREIGN KEY (user_address_id) REFERENCES User_Address (address_id)
);

-- Category table
CREATE TABLE Category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100),
    category_desc TEXT
);

-- Payment table
CREATE TABLE Payment (
    payment_id SERIAL PRIMARY KEY,
    order_id INT,
    payment_method VARCHAR(50),
    FOREIGN KEY (order_id) REFERENCES Orders (order_id)
);

-- Review table
CREATE TABLE Review (
    review_id SERIAL PRIMARY KEY,
    user_id INT,
    product_id INT,
    rating INT,
    review_desc TEXT,
    FOREIGN KEY (user_id) REFERENCES Users (user_id),
    FOREIGN KEY (product_id) REFERENCES Product (product_id)
);

-- CartItem table
CREATE TABLE CartItem (
    cartitem_id SERIAL PRIMARY KEY,
    user_id INT,
    product_id INT,
    quantity INT,
    FOREIGN KEY (product_id) REFERENCES Product (product_id)
);

--OrderItem table
CREATE TABLE OrderItem (
    orderitem_id SERIAL PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    FOREIGN KEY (order_id) REFERENCES Orders (order_id),
    FOREIGN KEY (product_id) REFERENCES Product (product_id)
);

-- WishListItem table
CREATE TABLE WishListItem (
    user_id INT,
    product_id INT,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES Users (user_id),
    FOREIGN KEY (product_id) REFERENCES Product (product_id)
);

-- Order table
CREATE TABLE Orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT,
    order_status VARCHAR(50),
    order_amount NUMERIC(10, 2),
    order_date DATE,
    shipping_address_id INT,
    FOREIGN KEY (user_id) REFERENCES Users (user_id),
    FOREIGN KEY (shipping_address_id) REFERENCES Shipping_Address (address_id)
);

-- Product table
CREATE TABLE Product (
    product_id SERIAL PRIMARY KEY,
    category_id INT,
    product_name VARCHAR(100),
    product_price NUMERIC(10, 2),
    stock_quantity INT,
    product_desc TEXT,
    FOREIGN KEY (category_id) REFERENCES Category (category_id)
);

-- Product_Image table
CREATE TABLE Product_Image (
    image_id SERIAL PRIMARY KEY,
    product_id INT,
    image_url TEXT,
    FOREIGN KEY (product_id) REFERENCES Product (product_id)
);

-- User_Address table
CREATE TABLE User_Address (
    address_id SERIAL PRIMARY KEY,
    street VARCHAR(100),
    city VARCHAR(50),
    zip VARCHAR(10)
);

-- Shipping_Address table
CREATE TABLE Shipping_Address (
    address_id SERIAL PRIMARY KEY,
    street VARCHAR(100),
    city VARCHAR(50),
    zip VARCHAR(10)
);


-- Trigger function to decrease stock levels
CREATE OR REPLACE FUNCTION adjust_stock_on_order()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE Product
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE product_id = NEW.product_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function when a new OrderItem is added
CREATE TRIGGER order_stock_update
AFTER INSERT ON OrderItem
FOR EACH ROW
EXECUTE FUNCTION adjust_stock_on_order();



CREATE OR REPLACE FUNCTION restore_stock_on_cancel()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_status = 'Cancelled' THEN
        UPDATE Product
        SET stock_quantity = stock_quantity + (
            SELECT SUM(quantity)
            FROM OrderItem
            WHERE order_id = NEW.order_id
        )
        WHERE product_id IN (
            SELECT product_id
            FROM OrderItem
            WHERE order_id = NEW.order_id
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cancel_order_trigger
AFTER UPDATE OF order_status ON Orders
FOR EACH ROW
WHEN (NEW.order_status = 'Cancelled')
EXECUTE FUNCTION restore_stock_on_cancel();

-- Loyalty Points
CREATE OR REPLACE FUNCTION update_loyalty_points()
RETURNS TRIGGER AS $$
DECLARE
    total_order_amount NUMERIC;
    loyalty_points INT;
BEGIN
    -- Check if the order status is updated to 'Delivered'
    IF NEW.order_status = 'Delivered' THEN
        -- Calculate the total order amount
        SELECT SUM(oi.quantity * p.product_price)
        INTO total_order_amount
        FROM OrderItem oi
        JOIN Product p ON oi.product_id = p.product_id
        WHERE oi.order_id = NEW.order_id;

        -- Calculate loyalty points (10% of total order amount)
        loyalty_points := FLOOR(total_order_amount * 0.1);

        -- Update the customer's loyalty points
        UPDATE Users
        SET loyalty_points = loyalty_points + loyalty_points
        WHERE user_id = NEW.user_id;
    
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_order_trigger
AFTER UPDATE OF order_status ON Orders
FOR EACH ROW
WHEN (NEW.order_status = 'Delivered')
EXECUTE FUNCTION update_loyalty_points();


-- Alter Table
ALTER TABLE CartItem
ADD CONSTRAINT unique_user_product UNIQUE (user_id, product_id);

-- Alter Table
ALTER TABLE Review
ADD COLUMN review_date DATE;

-- One User One Review per product
ALTER TABLE Review
ADD CONSTRAINT unique_user_product_review
UNIQUE (user_id, product_id);

Drop table Payment;

CREATE TABLE Payment (
    payment_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'COD',
    payment_time TIMESTAMP,
    payment_status VARCHAR(50) DEFAULT 'Pending',
    amount DECIMAL(10, 2) NOT NULL,
    payment_note TEXT,
    FOREIGN KEY (order_id) REFERENCES Orders (order_id)
);

--To increase size of Product name
ALTER TABLE Product 
ALTER COLUMN product_name TYPE TEXT;

-- Blacklisted token for logout purpose
CREATE TABLE BlacklistedTokens (
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    PRIMARY KEY (token)
);


