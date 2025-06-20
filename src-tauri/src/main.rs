// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use rusqlite::{params, Connection, Result};
use serde::{Deserialize, Serialize};
use std::{
    fs::File,
    io::{BufRead, BufReader, ErrorKind},
    sync::Mutex,
};
use tauri::{command, generate_handler, Manager, State};

#[derive(Serialize, Deserialize, Debug)]
struct Product {
    id: Option<i32>,
    name: String,
    description: String,
    price: f32,
    tax: Option<f64>,
    quantity: i32,
    image: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
struct NewProduct {
    name: String,
    description: String,
    price: f32,
    tax: Option<f64>,
    quantity: i32,
    image: Option<String>,
}

struct AppState {
    db: Mutex<Connection>,
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            app.manage(AppState {
                db: db_start().into(),
            });
            Ok(())
        })
        .invoke_handler(generate_handler![
            main_initialize,
            checkout,
            edit_product,
            welcome_screen,
            insert_new_product,
            remove_product,
            pagination,
            total_products
        ])
        .run(tauri::generate_context!())
        .expect("Error while running tauri application");
}

//TODO:
// Product tax for each product
// Product Categories
// Search Functionality
// Final: Able to drag and drop a file inside and
// Add or replace products and their attributes from the file

fn db_start() -> Connection {
    println!("\nDatabase connection opening");
    let db = Connection::open("products_database.sqlite").unwrap_or_else(|error| {
        panic!("\nProblem initializing database: {error:?}");
    });
    println!("\nDatabase connection successfull");
    db
}

#[command]
fn welcome_screen(state: State<'_, AppState>) -> i32 {
    println!("\nChecking if value 1 exists in user table");
    let db_guard = state.db.lock().unwrap();
    let db = &*db_guard;

    match db.query_row(
        "SELECT value FROM user_preferences WHERE key = ?;",
        ["welcome_screen_shown"],
        |row| row.get::<_, i32>(0),
    ) {
        Ok(welcome_screen_shown_value) => {
            println!("\nWelcome_screen_shown_value: {welcome_screen_shown_value}");
            match welcome_screen_shown_value {
                0 => {
                    println!("\nPreparing to update user table: {welcome_screen_shown_value}");
                    let mut stmt = db
                        .prepare("UPDATE user SET value = ? WHERE key = 'welcome_screen_shown';")
                        .expect(
                            "Failed to prepare statement for welcome_screen_shown_value update",
                        );
                    let rows_affected = stmt
                        .execute(params![1])
                        .expect("Rows affected statement failed to execute for database");
                    if rows_affected == 0 {
                        panic!("No rows were updated. The 'key' might not exist.");
                    }
                    return 0;
                }
                1 => {
                    println!("\nValue from user table is: {welcome_screen_shown_value}");
                    return 1;
                }
                _ => {
                    return 0;
                }
            }
        }
        Err(rusqlite::Error::QueryReturnedNoRows) => {
            println!(
                "\nQueryReturnedNoRows:SELECT value FROM user_preferences WHERE key = ?1{:?}",
                rusqlite::Error::QueryReturnedNoRows
            );
            return 0;
        }
        Err(err) => {
            println!("\nUnknown error in user table: {:?}", err);
            return 0;
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
fn total_products(state: State<'_, AppState>) -> i64 {
    let db_guard = state.db.lock().unwrap();
    let db = &*db_guard;
    let table_name = "products";

    let query = format!("SELECT COUNT(*) FROM {}", table_name);
    let count = db
        .query_row(&query, [], |row| row.get(0))
        .expect("\nFailed to read total number of rows for product table");
    count
}

#[command]
fn remove_product(state: State<'_, AppState>, product_id: i32) {
    println!("\nRemoving product\n");
    let mut db_guard = state.db.lock().unwrap();
    let db = &mut *db_guard;

    let update_query = format!("DELETE FROM products WHERE product_id = ?",);
    let transaction = db
        .transaction()
        .expect("Failed to establish sql transaction in remove_product");

    {
        let mut prepare = transaction
            .prepare(&update_query)
            .expect("Failed to prepare query for rows in remove_product");

        prepare
            .execute(params![product_id])
            .expect("Failed to execute transaction");
    }

    transaction
        .commit()
        .expect("Failed to commit transaction in remove_product");

    println!("\nProduct:{:?} was deleted\n", product_id);
}

#[command]
fn edit_product(state: State<'_, AppState>, product: Product) {
    println!("\nEditing product {:?}\n", product);
    let mut db_guard = state.db.lock().unwrap();
    let db = &mut *db_guard;

    let update_query =
        format!("UPDATE products SET name = ?, description = ?, price = ?, tax = ?, quantity = ? WHERE product_id = ?",);
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
                product.price as f32,
                product.tax as Option<f64>,
                product.quantity as i32,
                product.id
            ])
            .expect("Failed to execute transaction");

        println!("\nProduct_editted: {:?} ", product);
        println!("\nEdit product successfull");
    }

    transaction
        .commit()
        .expect("Failed to commit transaction in edit_product");
}

#[command]
fn insert_new_product(state: State<'_, AppState>, product: Product) {
    println!("\nInsert new product");
    let db_guard = state.db.lock().unwrap();
    let db = &*db_guard;

    let query =
        "INSERT INTO products (name, description, price, tax, quantity, image) VALUES (?, ?, ?, ?, ?, ?)";
    match db.execute(
        query,
        params![
            &product.name,
            &product.description,
            product.price as i32,
            product.tax as Option<f64>,
            product.quantity as i32,
            &product.image
        ],
    ) {
        Ok(_) => println!("\nInserted new product"),
        Err(err) => panic!("\nFailed to insert new product:{:?}", err),
    }
}

fn insert_product(db: &Connection, product: &NewProduct) -> String {
    println!("\nInsert product");

    let query =
        "INSERT INTO products (name, description, price, tax,  quantity, image) VALUES (?, ?, ?, ?, ?,?)";
    match db.execute(
        query,
        params![
            &product.name,
            &product.description,
            product.price as i32,
            product.tax as Option<f64>,
            product.quantity as i32,
            &product.image
        ],
    ) {
        Ok(_) => "Yeah man".to_string(),
        Err(_err) => "No man".to_string(),
    }
}

#[command]
fn checkout(state: State<'_, AppState>, product_id: i32, quantity: i32) -> () {
    println!("\nThe user asked to checkout, proceeding");
    let mut db_guard = state.db.lock().unwrap();
    let db = &mut *db_guard;

    assert!(quantity > 0, "Quantity needs to be a positive number");

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
}

#[command]
fn main_initialize(state: State<'_, AppState>) -> () {
    let db_guard = state.db.lock().unwrap();
    let db = &*db_guard;

    let number_of_tables: usize = number_of_tables("products".to_string(), &db);

    if number_of_tables == 0 {
        println!("\nInitializing Products table");

        db.execute(
            "
         CREATE TABLE products(
             product_id INTEGER PRIMARY KEY AUTOINCREMENT,
             name  TEXT NOT NULL,
             description TEXT NOT NULL,
             price FLOAT,
             tax FLOAT,
             quantity INTEGER,
             image TEXT)
         ",
            (),
        )
        .expect("\nFailed to create table products");

        let products: Vec<NewProduct> = products_from_text_file("products.txt".to_string());
        let iterator = products.iter();

        for product in iterator {
            println!("\nProduct: {:?}", product);
            insert_product(&db, product);
        }

        println!("\n--Created Products table\n--Populated table with products.txt file");

        println!("\nInitializing user table");
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
        let mut stmt = db
            .prepare("INSERT INTO user_preferences(key, value) VALUES ('welcome_screen_shown', ?);")
            .expect("\nFailed to prepare statement for welcome_screen_shown_value update");
        let rows_affected = stmt
            .execute(params![1])
            .expect("\nRows affected statement failed to execute for database");
        if rows_affected == 0 {
            println!("\nNo rows were updated. The 'key' might not exist.");
        }
        println!("\nCreated user table");
    }
}

fn products_from_text_file(mut file_path: String) -> Vec<NewProduct> {
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

    let mut products_vector: Vec<NewProduct> = Vec::new();
    let reader = BufReader::new(file_handle);

    let mut product: (String, String, f32, f64, i32, String) = (
        String::from(""),
        String::from(""),
        0.0,
        0.0,
        0,
        String::from(""),
    );

    for line in reader.lines() {
        let new_line = line.expect("Unable to read line:{line}");

        let words: Vec<&str> = new_line.split_whitespace().collect();

        let mut result = Vec::new();
        let mut current: Option<&str> = None;

        if words.len() > 0 {
            words.into_iter().for_each(|word| {
                let clean_word = word.trim_matches(|c: char| !c.is_alphanumeric());
                let is_name = clean_word.ends_with("Name");

                match clean_word {
                    "Description" | "Price" | "Tax" | "Quantity" | "Image" => {
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

                        product.2 = number.parse::<f32>().expect("Failed to parse price number");
                    }
                    "Tax" => {
                        let words: &Vec<&str> = &result[0].1;
                        let number: String = words[0]
                            .chars()
                            .filter(|c| c.is_digit(10))
                            .take(3)
                            .collect();

                        product.3 = number.parse::<f64>().expect("Failed to parse tax number");
                    }
                    "Quantity" => {
                        let words: &Vec<&str> = &result[0].1;
                        let number: String = words[0]
                            .chars()
                            .filter(|c| c.is_digit(10))
                            .take(2)
                            .collect();
                        product.4 = number
                            .parse::<i32>()
                            .expect("Failed to parse quantity number");
                    }
                    "Image" => {
                        if let Some(tuple_element) = result.get(0) {
                            let inner_vec = &tuple_element.1;

                            product.5 = match inner_vec.get(0) {
                                Some(s) => {
                                    if s.trim().is_empty() {
                                        "no_image".to_string()
                                    } else {
                                        s.to_string()
                                    }
                                }
                                None => "no_image".to_string(),
                            };
                        } else {
                            product.5 = "no_image".to_string();
                        }

                        products_vector.push(NewProduct {
                            name: product.0.to_string(),
                            description: product.1.to_string(),
                            price: product.2,
                            tax: Some(product.3),
                            quantity: product.4,
                            image: Some(product.5),
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

#[command]
fn pagination(sorting: i32, state: tauri::State<'_, AppState>, page: i32) -> Vec<Product> {
    let db_guard = state.db.lock().unwrap();
    let db = &*db_guard;

    let pages_final_product_id: i32 = page - 1;

    let number_of_rows = 9;
    let number_to_skip = pages_final_product_id * 9;

    let query = match sorting {
        0 => "SELECT * FROM products ORDER BY name ASC LIMIT ? OFFSET ?",
        1 => "SELECT * FROM products ORDER BY price ASC LIMIT ? OFFSET ?",
        2 => "SELECT * FROM products ORDER BY quantity ASC LIMIT ? OFFSET ?",
        3 => "SELECT * FROM products ORDER BY name DESC LIMIT ? OFFSET ?",
        4 => "SELECT * FROM products ORDER BY price DESC LIMIT ? OFFSET ?",
        5 => "SELECT * FROM products ORDER BY quantity DESC LIMIT ? OFFSET ?",
        _ => panic!("\nNot a valid option for sorting:{sorting}"),
    };

    let mut stmt = db
        .prepare(query)
        .expect("\nFailed to prepare statement for pagination");

    let product_iter = stmt
        .query_map([number_of_rows, number_to_skip], |row| {
            Ok(Product {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                price: row.get(3)?,
                tax: row.get(4)?,
                quantity: row.get(5)?,
                image: row.get(6)?,
            })
        })
        .expect("Failed to map products");

    product_iter
        .collect::<Result<Vec<Product>, _>>()
        .expect("Failed to collect products")
}
