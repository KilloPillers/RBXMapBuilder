// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_model_path(app_handle: tauri::AppHandle) -> String {
    app_handle.path_resolver().resolve_resource("../model/rbxdefaultmodel.obj").unwrap().to_string_lossy().into_owned()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_model_path])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

