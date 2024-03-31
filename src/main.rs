// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod streamelements;

use once_cell::sync::OnceCell;
use streamelements::INSTANCE;
use tauri::Manager;

static APP_HANDLE:OnceCell<tauri::AppHandle> = OnceCell::new();

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn connect(_window: tauri::Window) {
    INSTANCE.lock().unwrap().connect();
}

#[tauri::command]
fn disconnect(_window: tauri::Window) {
    INSTANCE.lock().unwrap().disconnect()
}

fn setup(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    Ok(APP_HANDLE.set(app.app_handle()).unwrap())
}

fn main() {
    tauri::Builder::default()
        .setup(setup)
        .invoke_handler(tauri::generate_handler![connect, disconnect])
        .run(tauri::generate_context!())
        .expect("An error occurred on Open Streamer Companion");
}
