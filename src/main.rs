// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod streamelements;
mod utils;

use once_cell::sync::OnceCell;
use streamelements::INSTANCE;
use tauri::{CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu};

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

fn on_system_tray_event(app: &tauri::AppHandle, event: tauri::SystemTrayEvent) {
    let window = app.get_window("main").unwrap();

    match event {
        SystemTrayEvent::MenuItemClick { id, .. } => {
            match id.as_str() {
                "show" => {
                    window.show().unwrap();
                }
                "quit" => {
                    window.close().unwrap();
                }
                _ => {}
            }
        }
        _ => {}
      }
}

fn on_window_event(event: tauri::GlobalWindowEvent) {
    match event.event() {
        tauri::WindowEvent::CloseRequested { api, .. } => {
            event.window().hide().unwrap();
            api.prevent_close();
        }
        _ => {}
    }
}

fn main() {
    let stronghold = tauri_plugin_stronghold::Builder::new(setup_stronghold).build();

    let tray_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("quit", "Quit"))
        .add_item(CustomMenuItem::new("show", "Show"));
    
    tauri::Builder::default().system_tray(SystemTray::new().with_menu(tray_menu)).plugin(stronghold).setup(setup)
        .on_system_tray_event(on_system_tray_event)
        .on_window_event(on_window_event)
        .invoke_handler(tauri::generate_handler![connect, disconnect])
        .run(tauri::generate_context!())
        .expect("An error occurred on Open Streamer Companion");
}
