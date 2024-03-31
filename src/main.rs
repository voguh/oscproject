// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod streamelements;
mod utils;

use once_cell::sync::OnceCell;
use streamelements::INSTANCE;
use tauri::Manager;

use crate::utils::secrets::STRONGHOLD_SECRET;

static APP_HANDLE: OnceCell<tauri::AppHandle> = OnceCell::new();

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn connect(token: String) {
    INSTANCE.lock().unwrap().connect(token);
}

#[tauri::command]
fn disconnect() {
    INSTANCE.lock().unwrap().disconnect()
}

fn setup_stronghold(password: &str) -> Vec<u8> {
    let config = argon2::Config {
        lanes: 4,
        mem_cost: 10_000,
        time_cost: 10,
        variant: argon2::Variant::Argon2id,
        version: argon2::Version::Version13,
        ..Default::default()
    };

    let salt = STRONGHOLD_SECRET.as_bytes();
    argon2::hash_raw(password.as_ref(), salt, &config).expect("Failed to hash password")
}

fn setup(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    Ok(APP_HANDLE.set(app.app_handle()).unwrap())
}

fn main() {
    let stronghold = tauri_plugin_stronghold::Builder::new(setup_stronghold).build();
    
    tauri::Builder::default().plugin(stronghold).setup(setup)
        .invoke_handler(tauri::generate_handler![connect, disconnect])
        .run(tauri::generate_context!())
        .expect("An error occurred on Open Streamer Companion");
}
