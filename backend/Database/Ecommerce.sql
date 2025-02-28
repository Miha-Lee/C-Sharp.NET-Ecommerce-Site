CREATE DATABASE EcommerceSystem
GO

USE EcommerceSystem
GO

CREATE SCHEMA EcommerceSystemApp
GO

CREATE TABLE EcommerceSystemApp.Users(
    User_id INT NOT NULL IDENTITY(1,1),
    Email NVARCHAR(255) NOT NULL,
    First_Name NVARCHAR(255) NOT NULL,
    Last_Name NVARCHAR(255) NOT NULL,
    Phone_Number NVARCHAR(255) NOT NULL,
    Date_of_birth DATE NOT NULL,
    Country NVARCHAR(255) NOT NULL,
    Password_Hash VARBINARY(MAX) NOT NULL,
    Password_Salt VARBINARY(MAX) NOT NULL,
    Created_at DATETIME2 NOT NULL,
    Updated_at DATETIME2 NOT NULL
)
GO

CREATE TABLE EcommerceSystemApp.Addresses(
    Address_id INT NOT NULL IDENTITY(1,1),
    First_Name NVARCHAR(255) NOT NULL,
    Last_Name NVARCHAR(255) NOT NULL,
    Phone_Number NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) NOT NULL,
    Shipping_Type NVARCHAR(255) NOT NULL,
    Street NVARCHAR(255) DEFAULT NULL,
    House NVARCHAR(255) DEFAULT NULL,
    Building NVARCHAR(255) DEFAULT NULL,
    Entrance NVARCHAR(255) DEFAULT NULL,
    Floor NVARCHAR(255) DEFAULT NULL,
    Apartment NVARCHAR(255) DEFAULT NULL,
    Country NVARCHAR(255) DEFAULT NULL,
    City NVARCHAR(255) DEFAULT NULL,
    Post_Code NVARCHAR(255) DEFAULT NULL,
    Comment NVARCHAR(MAX) DEFAULT NULL,
    Created_at DATETIME2 NOT NULL,
    Updated_at DATETIME2 NOT NULL
)
GO

CREATE TABLE EcommerceSystemApp.Orders(
    Order_id INT NOT NULL IDENTITY(1,1),
    User_id INT NOT NULL,
    Total DECIMAL(18,10) NOT NULL,
    Address_id INT NOT NULL,
    Num_Of_Items INT NOT NULL,
    Product NVARCHAR(MAX) NOT NULL,
    Payment_Status BIT NOT NULL, 
    Session_id NVARCHAR(255) DEFAULT NULL,
    Created_at DATETIME2 NOT NULL,
    Updated_at DATETIME2 NOT NULL
)
GO