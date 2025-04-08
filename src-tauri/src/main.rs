// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use rusqlite::{params, Connection, Result};
use serde::{Deserialize, Serialize};
use std::{
    fs::File,
    io::{BufRead, BufReader, ErrorKind},
};
use tauri::{command, generate_handler};

#[derive(Serialize, Deserialize, Debug)]
struct Product {
    product_id: i32,
    name: String,
    description: String,
    price: i32,
    quantity: i32,
    image: Option<String>,
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(generate_handler![
            main_initialize,
            checkout,
            edit_product,
            welcome_screen,
            insert_new_product
        ])
        .run(tauri::generate_context!())
        .expect("Error while running tauri application");
}

//TODO:
// Take all of products attributes instead of one category at a time when editing --Done
// Also edit product quantity
// Insert a new product
// Remove a product entirely
// Final: Able to drag and drop a file inside and
// Add or replace products and their attributes from the file

fn db_start() -> Connection {
    println!("\nDatabase connection opening\n");
    let db = Connection::open("products_database.sqlite").unwrap_or_else(|error| {
        panic!("\nProblem initializing database: {error:?}");
    });
    println!("\nDatabase connection successfull\n");
    db
}

#[command]
fn welcome_screen() -> i32 {
    let db = db_start();
    let table_exists = number_of_tables("user_preferences".to_string(), &db);

    match table_exists {
        0 => {
            println!("\nInitializing table user");
            db.execute(
                "
         CREATE TABLE IF NOT EXISTS user_preferences(
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         key TEXT UNIQUE NOT NULL,   
         value INTEGER DEFAULT 0
             )
         ",
                (),
            )
            .expect("\nFailed to create user table");

            println!("\nCreated user table");

            let mut stmt = db
                .prepare(
                    "INSERT INTO user_preferences (key, value) VALUES ('welcome_screen_shown', ?);",
                )
                .expect("\nFailed to prepare statement for welcome_screen_shown_value update");
            let rows_affected = stmt
                .execute(params![1])
                .expect("\nRows affected statement failed to execute for database");
            if rows_affected == 0 {
                println!("\nNo rows were updated. The 'key' might not exist.");
            }

            return 0;
        }
        1 => {
            println!("\nTable user exists:{table_exists}");
            println!("\nChecking if value 1 exists in user table");

            match db.query_row(
                "SELECT value FROM user_preferences WHERE key = ?1",
                ["welcome_screen_shown"],
                |row| row.get::<_, i32>(0),
            ) {
                Ok(welcome_screen_shown_value) => {
                    println!("\nWelcome_screen_shown_value: {welcome_screen_shown_value}");
                    match welcome_screen_shown_value {
                        0 => {
                            println!(
                            "\nPreparing to update user table wsshval:{welcome_screen_shown_value}"
                        );
                            let mut stmt = db
                            .prepare(
                                "UPDATE user SET value = ? WHERE key = 'welcome_screen_shown';",
                            )
                            .expect(
                                "Failed to prepare statement for welcome_screen_shown_value update",
                            );
                            let rows_affected = stmt
                                .execute(params![1])
                                .expect("Rows affected statement failed to execute for database");
                            if rows_affected == 0 {
                                println!("No rows were updated. The 'key' might not exist.");
                            }
                            return 1;
                        }
                        1 => {
                            println!("\nValue from user table is one:{welcome_screen_shown_value}");
                            return 1;
                        }
                        _ => {
                            panic!("\nWelcome_screen_shown_value:{welcome_screen_shown_value}");
                        }
                    }
                }
                Err(rusqlite::Error::QueryReturnedNoRows) => {
                    panic!("\nQueryReturnedNoRows:SELECT value FROM user_preferences WHERE key = ?1{:?}", rusqlite::Error::QueryReturnedNoRows);
                }
                Err(err) => {
                    panic!("\nUnknown error in user table: {:?}", err);
                }
            }
        }
        _ => {
            panic!("\nProblem with list tables value\nUnknown value:{table_exists}")
        }
    }
}

fn number_of_tables(table_name: String, database: &Connection) -> usize {
    assert!(
        table_name == "user_preferences" || table_name == "products",
        "The only allowed tables are user_preferences and products"
    );
    match database.query_row(
        "SELECT name FROM sqlite_master WHERE type='table' AND name=?1",
        [&table_name],
        |row| row.get::<_, String>(0),
    ) {
        Ok(number_of_rows) => {
            println!("\nTable {table_name} exists:{number_of_rows}");
            1
        }
        Err(rusqlite::Error::QueryReturnedNoRows) => {
            println!("\nTable {table_name} does not exist");
            0
        }
        Err(err) => {
            panic!("\nDatabase error: {:?}", err);
        }
    }
}

#[command]
fn edit_product(product: Product) {
    println!("\nEditing product");

    let mut db = db_start();

    let update_query =
        format!("UPDATE products SET name = ?, description = ?, price = ? WHERE product_id = ?",);
    let transaction = db
        .transaction()
        .expect("Failed to establish sql transaction in checkout");

    {
        let mut prepare = transaction
            .prepare(&update_query)
            .expect("Failed to prepare query for rows in checkout");

        prepare
            .execute(params![
                product.name,
                product.description,
                product.price as i32,
                product.product_id as i32
            ])
            .expect("Failed to execute transaction");
    }

    transaction
        .commit()
        .expect("Failed to commit transaction in edit_product");
}

#[command]
fn insert_new_product(product: Product) {
    println!("\nInsert new product");
    let db = db_start();

    let query =
        "INSERT INTO products (name, description, price, quantity, image) VALUES (?, ?, ?, ?, ?)";
    match db.execute(
        query,
        params![
            &product.name,
            &product.description,
            product.price as i32,
            product.quantity as i32,
            &product.image
        ],
    ) {
        Ok(_) => println!("\nInserted new product"),
        Err(err) => panic!("\nFailed to insert new product:{:?}", err),
    }
}

fn insert_product(product: &Product) -> String {
    println!("\nInsert new product");
    let db = db_start();

    let query =
        "INSERT INTO products (name, description, price, quantity, image) VALUES (?, ?, ?, ?, ?)";
    match db.execute(
        query,
        params![
            &product.name,
            &product.description,
            product.price as i32,
            product.quantity as i32,
            &product.image
        ],
    ) {
        Ok(_) => "Yeah man".to_string(),
        Err(_err) => "No man".to_string(),
    }
}

#[command]
fn checkout(product_id: i32, quantity: i32) -> Vec<Product> {
    println!("\nThe user asked to checkout, proceeding");
    assert!(quantity > 0, "Quantity needs to be a positive number");

    let mut db = db_start();

    let transaction = db
        .transaction()
        .expect("Failed to establish sql transaction in checkout");
    {
        let mut prepare = transaction
            .prepare("SELECT quantity FROM products WHERE product_id = ?")
            .expect("Failed to prepare query for rows in checkout");

        let mut rows = prepare
            .query(params![product_id])
            .expect("Failed to prepare query for rows in checkout with params");

        let row = rows
            .next()
            .transpose()
            .expect("Transpose failed")
            .expect("Product not found in the database");

        let current_quantity: i32 = row.get(0).expect("Failed to extract quantity from row");

        if current_quantity < quantity {
            panic!("\nNot enough stock for product {}", product_id);
        }

        let new_quantity = current_quantity - quantity;

        transaction
            .execute(
                "UPDATE products SET quantity = ? WHERE product_id = ?",
                params![new_quantity, product_id],
            )
            .expect("Failed to execute transaction");
    }

    transaction.commit().expect("Failed to commit transaction");
    list_products(&db)
}

#[command]
fn main_initialize() -> Vec<Product> {
    let db = db_start();
    let number_of_tables: usize = number_of_tables("products".to_string(), &db);

    //println!("\nNumbertables:{number_of_tables}");

    if number_of_tables == 0 {
        println!("\nTable product does not exist, initializing it now.");

        db.execute(
            "
         CREATE TABLE products(
             product_id INTEGER PRIMARY KEY AUTOINCREMENT,
             name  TEXT NOT NULL,
             description TEXT NOT NULL,
             price INTEGER,
             quantity INTEGER,
             image TEXT)
         ",
            (),
        )
        .expect("Failed to create table");

        let products: Vec<Product> = products_from_text_file("products.txt".to_string());
        let iterator = products.iter();

        for product in iterator {
            println!("\nProduct: {:?}", product);
            insert_product(product);
        }
        println!("\n--Created table\n--Populated table with products.txt file\n");
    } else if number_of_tables == 1 {
        println!("\nTable exists moving on:{number_of_tables}");
    }
    println!("\nListing products");
    list_products(&db)
}

fn list_products(db: &Connection) -> Vec<Product> {
    let mut stmt = db
        .prepare("SELECT product_id, name, description, price, quantity, image FROM products")
        .expect("Failed to prepare statement");

    let product_iter = stmt
        .query_map([], |row| {
            Ok(Product {
                product_id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                price: row.get(3)?,
                quantity: row.get(4)?,
                image: row.get(5)?,
            })
        })
        .expect("Failed to map products");
    product_iter
        .collect::<Result<Vec<Product>, _>>()
        .expect("Failed to collect products")
}

fn products_from_text_file(mut file_path: String) -> Vec<Product> {
    if let Some('\n') = file_path.chars().next_back() {
        file_path.pop();
    }
    if let Some('\r') = file_path.chars().next_back() {
        file_path.pop();
    }
    println!("\nFile path: {}\n", file_path);
    let file_handle = File::open(&file_path).unwrap_or_else(|error| {
        if error.kind() == ErrorKind::NotFound {
            println!("\nFile not found creating a new one\n");
            File::create("products.txt").unwrap_or_else(|error| {
                panic!("Problem creating the file: {error:?}");
            })
        } else {
            panic!("Problem opening the file");
        }
    });

    let mut products_vector: Vec<Product> = Vec::new();
    let reader = BufReader::new(file_handle);

    let mut product: (String, String, i32, i32, String) =
        (String::from(""), String::from(""), 0, 0, String::from(""));

    for line in reader.lines() {
        let new_line = line.expect("Unable to read line:{line}");

        let words: Vec<&str> = new_line.split_whitespace().collect();

        let mut result = Vec::new();
        let mut current: Option<&str> = None;
        let id_counter: i32 = 0;

        if words.len() > 0 {
            words.into_iter().for_each(|word| {
                let clean_word = word.trim_matches(|c: char| !c.is_alphanumeric());
                let is_name = clean_word.ends_with("Name");

                match clean_word {
                    "Description" | "Price" | "Quantity" | "Image" => {
                        current = Some(clean_word);
                        result.push((clean_word, vec![]));
                    }
                    _ if is_name => {
                        current = Some("Name");
                        result.push(("Name", vec![]));
                    }
                    _ => {
                        if let Some((_key, ref mut vec)) = result.last_mut() {
                            vec.push(word);
                        }
                    }
                }
            });

            if result.len() != 0 {
                match result[0].0 {
                    "Name" => {
                        product.0 = result[0]
                            .1
                            .iter()
                            .map(|word| word.to_string() + " ")
                            .collect::<String>();
                    }
                    "Description" => {
                        product.1 = result[0]
                            .1
                            .iter()
                            .map(|word| word.to_string() + " ")
                            .collect::<String>();
                    }
                    "Price" => {
                        let words: &Vec<&str> = &result[0].1;
                        let number: String = words[0]
                            .chars()
                            .filter(|c| c.is_digit(10))
                            .take(2)
                            .collect();

                        product.2 = number.parse::<i32>().expect("Failed to parse price number");
                    }
                    "Quantity" => {
                        let words: &Vec<&str> = &result[0].1;
                        let number: String = words[0]
                            .chars()
                            .filter(|c| c.is_digit(10))
                            .take(2)
                            .collect();
                        product.3 = number
                            .parse::<i32>()
                            .expect("Failed to parse quantity number");
                    }
                    "Image" => {
                        product.4 = result[0].1[0].to_string();
                        products_vector.push(Product {
                            product_id: id_counter + 1,
                            name: product.0.to_string(),
                            description: product.1.to_string(),
                            price: product.2,
                            quantity: product.3,
                            image: Some(product.4),
                        });
                    }
                    _ => println!("\nSomething is wrong"),
                }
            } else {
                println!(
                    "\nCannot insert into product because result length is 0\nResult:{:?}",
                    result.len()
                );
            }
        } else {
            println!("\nLine is empty, moving on:{:?}", words);
        }
    }
    println!("\nVector: {:?}\n", products_vector);
    products_vector
}
