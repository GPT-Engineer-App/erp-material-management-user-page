# erp-material-management-user-page

User Management page for an ERP system's Material Management module. This includes the front-end design in HTML, CSS, and JavaScript     aur yeh mera databse hai - 
### Components of ERP Material Management Module

1. **User Management**
    - Users Table

2. **Material Management**
    - Material Master Table
    - Inventory Table

3. **Vendor Management**
    - Vendor Master Table

4. **Procurement Management**
    - Purchase Requisition Table
    - Purchase Requisition Item Table
    - Purchase Order Table
    - Purchase Order Item Table

5. **Receiving and Inspection**
    - Goods Receipt Table
    - Goods Receipt Item Table

6. **Invoice Verification**
    - Invoice Table

### Page Structure for ERP Material Management Module

1. **Dashboard**
    - Overview of material status, procurement status, and inventory levels.
    - Quick access to recent activities and alerts.

2. **User Management**
    - **User List**: Display all users with options to add, edit, and delete users.
    - **User Registration**: Form for registering new users.
    - **User Authentication**: Login page for user authentication.

3. **Material Management**
    - **Material Master List**: List of all materials with search and filter options.
    - **Add/Edit Material**: Form to add or edit material details.
    - **Inventory Management**: View and update stock levels.

4. **Vendor Management**
    - **Vendor List**: List of all vendors with options to add, edit, and delete vendors.
    - **Add/Edit Vendor**: Form to add or edit vendor details.

5. **Procurement Management**
    - **Purchase Requisition List**: List of all purchase requisitions with options to create, approve, or reject.
    - **Create Purchase Requisition**: Form to create new purchase requisitions.
    - **Purchase Order List**: List of all purchase orders with status updates.
    - **Create Purchase Order**: Form to create new purchase orders.

6. **Receiving and Inspection**
    - **Goods Receipt List**: List of all goods receipts with details of received items.
    - **Create Goods Receipt**: Form to log received goods against purchase orders.

7. **Invoice Verification**
    - **Invoice List**: List of all invoices with status and matching details.
    - **Create Invoice**: Form to create new invoices and match with purchase orders and goods receipts.

### SQL Database Structure

Here's the provided SQL structure with some minor refinements for clarity:

```sql
CREATE DATABASE IF NOT EXISTS material_management;
USE material_management;

-- Users Table
CREATE TABLE IF NOT EXISTS USERS (
    User_ID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password_Hash VARCHAR(255) NOT NULL,
    Role VARCHAR(50),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Material Master Table
CREATE TABLE IF NOT EXISTS MAT_MASTER (
    Material_Number VARCHAR(20) PRIMARY KEY,
    Description VARCHAR(255),
    Unit_Of_Measure VARCHAR(10),
    Material_Group VARCHAR(50),
    Material_Type VARCHAR(20),
    Plant VARCHAR(10),
    Storage_Location VARCHAR(10),
    Valuation_Class VARCHAR(20),
    Standard_Price DECIMAL(18,2),
    Moving_Average_Price DECIMAL(18,2),
    Weight DECIMAL(18,2),
    Volume DECIMAL(18,2),
    Hazardous_Indicator BOOLEAN
);

-- Inventory Table
CREATE TABLE IF NOT EXISTS INVENTORY (
    Material_Number VARCHAR(20),
    Plant VARCHAR(10),
    Storage_Location VARCHAR(10),
    Stock_Quantity DECIMAL(18,2),
    PRIMARY KEY (Material_Number, Plant, Storage_Location),
    FOREIGN KEY (Material_Number) REFERENCES MAT_MASTER(Material_Number)
);

-- Vendor Master Table
CREATE TABLE IF NOT EXISTS VENDOR_MASTER (
    Vendor_Number VARCHAR(20) PRIMARY KEY,
    Vendor_Name VARCHAR(255),
    Address VARCHAR(255),
    City VARCHAR(50),
    State VARCHAR(50),
    Country VARCHAR(50),
    Postal_Code VARCHAR(10),
    Contact_Name VARCHAR(100),
    Contact_Email VARCHAR(100),
    Contact_Phone VARCHAR(20),
    Payment_Terms VARCHAR(50),
    Currency VARCHAR(10),
    Tax_Number VARCHAR(50),
    Bank_Country VARCHAR(50)
);

-- Purchase Requisition Table
CREATE TABLE IF NOT EXISTS PURCHASE_REQUISITION (
    PR_Number VARCHAR(20) PRIMARY KEY,
    Requested_By VARCHAR(100),
    Request_Date DATE,
    Status VARCHAR(20),
    Department VARCHAR(50)
);

-- Purchase Requisition Item Table
CREATE TABLE IF NOT EXISTS PR_ITEM (
    PR_Item_ID INT PRIMARY KEY AUTO_INCREMENT,
    PR_Number VARCHAR(20),
    Material_Number VARCHAR(20),
    Quantity DECIMAL(18,2),
    Delivery_Date DATE,
    FOREIGN KEY (PR_Number) REFERENCES PURCHASE_REQUISITION(PR_Number),
    FOREIGN KEY (Material_Number) REFERENCES MAT_MASTER(Material_Number)
);

-- Purchase Order Table
CREATE TABLE IF NOT EXISTS PURCHASE_ORDER (
    PO_Number VARCHAR(20) PRIMARY KEY,
    PR_Number VARCHAR(20),
    Vendor_Number VARCHAR(20),
    PO_Date DATE,
    Delivery_Date DATE,
    Status VARCHAR(20),
    Payment_Terms VARCHAR(50),
    Currency VARCHAR(10),
    FOREIGN KEY (PR_Number) REFERENCES PURCHASE_REQUISITION(PR_Number),
    FOREIGN KEY (Vendor_Number) REFERENCES VENDOR_MASTER(Vendor_Number)
);

-- Purchase Order Item Table
CREATE TABLE IF NOT EXISTS PO_ITEM (
    PO_Item_ID INT PRIMARY KEY AUTO_INCREMENT,
    PO_Number VARCHAR(20),
    Material_Number VARCHAR(20),
    Quantity DECIMAL(18,2),
    Unit_Price DECIMAL(18,2),
    Net_Value DECIMAL(18,2),
    Delivery_Date DATE,
    FOREIGN KEY (PO_Number) REFERENCES PURCHASE_ORDER(PO_Number),
    FOREIGN KEY (Material_Number) REFERENCES MAT_MASTER(Material_Number)
);

-- Goods Receipt Table
CREATE TABLE IF NOT EXISTS GOODS_RECEIPT (
    GR_Number VARCHAR(20) PRIMARY KEY,
    PO_Number VARCHAR(20),
    GR_Date DATE,
    Vendor_Number VARCHAR(20),
    FOREIGN KEY (PO_Number) REFERENCES PURCHASE_ORDER(PO_Number),
    FOREIGN KEY (Vendor_Number) REFERENCES VENDOR_MASTER(Vendor_Number)
);

-- Goods Receipt Item Table
CREATE TABLE IF NOT EXISTS GR_ITEM (
    GR_Item_ID INT PRIMARY KEY AUTO_INCREMENT,
    GR_Number VARCHAR(20),
    Material_Number VARCHAR(20),
    Quantity_Received DECIMAL(18,2),
    Inspection_Status VARCHAR(20),
    FOREIGN KEY (GR_Number) REFERENCES GOODS_RECEIPT(GR_Number),
    FOREIGN KEY (Material_Number) REFERENCES MAT_MASTER(Material_Number)
);

-- Invoice Table
CREATE TABLE IF NOT EXISTS INVOICE (
    Invoice_Number VARCHAR(20) PRIMARY KEY,
    PO_Number VARCHAR(20),
    Invoice_Date DATE,
    Vendor_Number VARCHAR(20),
    Total_Amount DECIMAL(18,2),
    Payment_Terms VARCHAR(50),
    Status VARCHAR(20),
    FOREIGN KEY (PO_Number) REFERENCES PURCHASE_ORDER(PO_Number),
    FOREIGN KEY (Vendor_Number) REFERENCES VENDOR_MASTER(Vendor_Number)
);
```

### Stored Procedures

Stored procedures encapsulate business logic in the database for user registration, material management, vendor management, procurement, and inventory updates.

```sql
DELIMITER //

-- Procedure to register a new user
CREATE PROCEDURE RegisterUser(
    IN p_Username VARCHAR(50),
    IN p_Password_Hash VARCHAR(255),
    IN p_Role VARCHAR(50)
)
BEGIN
    INSERT INTO USERS (Username, Password_Hash, Role) VALUES (p_Username, p_Password_Hash, p_Role);
END//

-- Procedure to authenticate a user
CREATE PROCEDURE AuthenticateUser(
    IN p_Username VARCHAR(50),
    IN p_Password_Hash VARCHAR(255),
    OUT p_Authenticated BOOLEAN
)
BEGIN
    DECLARE count INT;
    SELECT COUNT(*) INTO count FROM USERS WHERE Username = p_Username AND Password_Hash = p_Password_Hash;
    SET p_Authenticated = (count > 0);
END//

-- Procedure to insert new material
CREATE PROCEDURE InsertMaterial(
    IN p_Material_Number VARCHAR(20),
    IN p_Description VARCHAR(255),
    IN p_Unit_Of_Measure VARCHAR(10),
    IN p_Material_Group VARCHAR(50),
    IN p_Material_Type VARCHAR(20),
    IN p_Plant VARCHAR(10),
    IN p_Storage_Location VARCHAR(10),
    IN p_Valuation_Class VARCHAR(20),
    IN p_Standard_Price DECIMAL(18,2),
    IN p_Moving_Average_Price DECIMAL(18,2),
    IN p_Weight DECIMAL(18,2),
    IN p_Volume DECIMAL(18,2),
    IN p_Hazardous_Indicator BOOLEAN
)
BEGIN
    INSERT INTO MAT_MASTER (
        Material_Number, Description, Unit_Of_Measure, Material_Group,
        Material_Type, Plant, Storage_Location, Valuation_Class,
        Standard_Price, Moving_Average_Price, Weight, Volume, Hazardous_Indicator
    ) VALUES (
        p_Material_Number, p_Description, p_Unit_Of_Measure, p_Material_Group,
        p_Material_Type, p_Plant, p_Storage_Location, p_Valuation_Class,
        p_Standard_Price, p_Moving_Average_Price, p_Weight, p_Volume, p_Hazardous_Indicator
    );
END//

-- Procedure to update material information
CREATE PROCEDURE UpdateMaterial(
    IN p_Material_Number VARCHAR(20),
    IN p_Description VARCHAR(255),
    IN p_Unit_

Of_Measure VARCHAR(10),
    IN p_Material_Group VARCHAR(50),
    IN p_Material_Type VARCHAR(20),
    IN p_Plant VARCHAR(10),
    IN p_Storage_Location VARCHAR(10),
    IN p_Valuation_Class VARCHAR(20),
    IN p_Standard_Price DECIMAL(18,2),
    IN p_Moving_Average_Price DECIMAL(18,2),
    IN p_Weight DECIMAL(18,2),
    IN p_Volume DECIMAL(18,2),
    IN p_Hazardous_Indicator BOOLEAN
)
BEGIN
    UPDATE MAT_MASTER
    SET
        Description = p_Description,
        Unit_Of_Measure = p_Unit_Of_Measure,
        Material_Group = p_Material_Group,
        Material_Type = p_Material_Type,
        Plant = p_Plant,
        Storage_Location = p_Storage_Location,
        Valuation_Class = p_Valuation_Class,
        Standard_Price = p_Standard_Price,
        Moving_Average_Price = p_Moving_Average_Price,
        Weight = p_Weight,
        Volume = p_Volume,
        Hazardous_Indicator = p_Hazardous_Indicator
    WHERE
        Material_Number = p_Material_Number;
END//

-- Procedure to insert new vendor
CREATE PROCEDURE InsertVendor(
    IN p_Vendor_Number VARCHAR(20),
    IN p_Vendor_Name VARCHAR(255),
    IN p_Address VARCHAR(255),
    IN p_City VARCHAR(50),
    IN p_State VARCHAR(50),
    IN p_Country VARCHAR(50),
    IN p_Postal_Code VARCHAR(10),
    IN p_Contact_Name VARCHAR(100),
    IN p_Contact_Email VARCHAR(100),
    IN p_Contact_Phone VARCHAR(20),
    IN p_Payment_Terms VARCHAR(50),
    IN p_Currency VARCHAR(10),
    IN p_Tax_Number VARCHAR(50),
    IN p_Bank_Country VARCHAR(50)
)
BEGIN
    INSERT INTO VENDOR_MASTER (
        Vendor_Number, Vendor_Name, Address, City, State,
        Country, Postal_Code, Contact_Name, Contact_Email,
        Contact_Phone, Payment_Terms, Currency, Tax_Number, Bank_Country
    ) VALUES (
        p_Vendor_Number, p_Vendor_Name, p_Address, p_City, p_State,
        p_Country, p_Postal_Code, p_Contact_Name, p_Contact_Email,
        p_Contact_Phone, p_Payment_Terms, p_Currency, p_Tax_Number, p_Bank_Country
    );
END//

-- Procedure to update vendor information
CREATE PROCEDURE UpdateVendor(
    IN p_Vendor_Number VARCHAR(20),
    IN p_Vendor_Name VARCHAR(255),
    IN p_Address VARCHAR(255),
    IN p_City VARCHAR(50),
    IN p_State VARCHAR(50),
    IN p_Country VARCHAR(50),
    IN p_Postal_Code VARCHAR(10),
    IN p_Contact_Name VARCHAR(100),
    IN p_Contact_Email VARCHAR(100),
    IN p_Contact_Phone VARCHAR(20),
    IN p_Payment_Terms VARCHAR(50),
    IN p_Currency VARCHAR(10),
    IN p_Tax_Number VARCHAR(50),
    IN p_Bank_Country VARCHAR(50)
)
BEGIN
    UPDATE VENDOR_MASTER
    SET
        Vendor_Name = p_Vendor_Name,
        Address = p_Address,
        City = p_City,
        State = p_State,
        Country = p_Country,
        Postal_Code = p_Postal_Code,
        Contact_Name = p_Contact_Name,
        Contact_Email = p_Contact_Email,
        Contact_Phone = p_Contact_Phone,
        Payment_Terms = p_Payment_Terms,
        Currency = p_Currency,
        Tax_Number = p_Tax_Number,
        Bank_Country = p_Bank_Country
    WHERE
        Vendor_Number = p_Vendor_Number;
END//

-- Procedure to create a purchase requisition
CREATE PROCEDURE CreatePurchaseRequisition(
    IN p_PR_Number VARCHAR(20),
    IN p_Requested_By VARCHAR(100),
    IN p_Request_Date DATE,
    IN p_Status VARCHAR(20),
    IN p_Department VARCHAR(50)
)
BEGIN
    INSERT INTO PURCHASE_REQUISITION (
        PR_Number, Requested_By, Request_Date, Status, Department
    ) VALUES (
        p_PR_Number, p_Requested_By, p_Request_Date, p_Status, p_Department
    );
END//

-- Procedure to create a purchase order from a purchase requisition
CREATE PROCEDURE CreatePurchaseOrderFromPR(
    IN p_PO_Number VARCHAR(20),
    IN p_PR_Number VARCHAR(20),
    IN p_Vendor_Number VARCHAR(20),
    IN p_PO_Date DATE,
    IN p_Delivery_Date DATE,
    IN p_Status VARCHAR(20),
    IN p_Payment_Terms VARCHAR(50),
    IN p_Currency VARCHAR(10)
)
BEGIN
    INSERT INTO PURCHASE_ORDER (
        PO_Number, PR_Number, Vendor_Number, PO_Date, Delivery_Date,
        Status, Payment_Terms, Currency
    ) VALUES (
        p_PO_Number, p_PR_Number, p_Vendor_Number, p_PO_Date, p_Delivery_Date,
        p_Status, p_Payment_Terms, p_Currency
    );
END//

-- Procedure to update inventory after goods receipt
CREATE PROCEDURE UpdateInventoryAfterGR(
    IN p_Material_Number VARCHAR(20),
    IN p_Plant VARCHAR(10),
    IN p_Storage_Location VARCHAR(10),
    IN p_Quantity_Received DECIMAL(18,2)
)
BEGIN
    UPDATE INVENTORY
    SET Stock_Quantity = Stock_Quantity + p_Quantity_Received
    WHERE Material_Number = p_Material_Number AND Plant = p_Plant AND Storage_Location = p_Storage_Location;
END//

-- Procedure to match invoice with purchase order and goods receipt
CREATE PROCEDURE MatchInvoice(
    IN p_Invoice_Number VARCHAR(20),
    IN p_PO_Number VARCHAR(20),
    IN p_Invoice_Date DATE,
    IN p_Vendor_Number VARCHAR(20),
    IN p_Total_Amount DECIMAL(18,2),
    IN p_Payment_Terms VARCHAR(50),
    IN p_Status VARCHAR(20)
)
BEGIN
    INSERT INTO INVOICE (
        Invoice_Number, PO_Number, Invoice_Date, Vendor_Number,
        Total_Amount, Payment_Terms, Status
    ) VALUES (
        p_Invoice_Number, p_PO_Number, p_Invoice_Date, p_Vendor_Number,
        p_Total_Amount, p_Payment_Terms, p_Status
    );
END//

DELIMITER ;
```

### Triggers

```sql
DELIMITER //

-- Trigger to automatically update purchase requisition status after approval
CREATE TRIGGER After_PR_Approval
AFTER UPDATE ON PURCHASE_REQUISITION
FOR EACH ROW
BEGIN
    IF OLD.Status <> NEW.Status THEN
        IF NEW.Status = 'Approved' THEN
            -- Call stored procedure to create Purchase Order from Purchase Requisition
            CALL CreatePurchaseOrderFromPR(NEW.PR_Number, NEW.PR_Number, 'Vendor123', NOW(), NOW(), 'Open', 'Net 30 Days', 'USD');
        END IF;
    END IF;
END//

DELIMITER ;


## Collaborate with GPT Engineer

This is a [gptengineer.app](https://gptengineer.app)-synced repository 🌟🤖

Changes made via gptengineer.app will be committed to this repo.

If you clone this repo and push changes, you will have them reflected in the GPT Engineer UI.

## Tech stack

This project is built with React and Chakra UI.

- Vite
- React
- Chakra UI

## Setup

```sh
git clone https://github.com/GPT-Engineer-App/erp-material-management-user-page.git
cd erp-material-management-user-page
npm i
```

```sh
npm run dev
```

This will run a dev server with auto reloading and an instant preview.

## Requirements

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
