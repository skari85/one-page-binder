use std::fs;
use std::path::Path;

// Custom commands for file operations
#[tauri::command]
fn read_file_content(path: &str) -> Result<String, String> {
    fs::read_to_string(path).map_err(|e| e.to_string())
}

#[tauri::command]
fn write_file_content(path: &str, content: &str) -> Result<(), String> {
    // Create parent directories if they don't exist
    if let Some(parent) = Path::new(path).parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    
    fs::write(path, content).map_err(|e| e.to_string())
}

#[tauri::command]
fn file_exists(path: &str) -> bool {
    Path::new(path).exists()
}

#[tauri::command]
fn get_file_metadata(path: &str) -> Result<serde_json::Value, String> {
    let metadata = fs::metadata(path).map_err(|e| e.to_string())?;
    
    let modified = metadata.modified().ok().and_then(|time| {
        time.duration_since(std::time::UNIX_EPOCH).ok().map(|d| d.as_secs())
    });
    
    let created = metadata.created().ok().and_then(|time| {
        time.duration_since(std::time::UNIX_EPOCH).ok().map(|d| d.as_secs())
    });
    
    let result = serde_json::json!({
        "size": metadata.len(),
        "is_dir": metadata.is_dir(),
        "is_file": metadata.is_file(),
        "modified": modified,
        "created": created,
    });
    
    Ok(result)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // Add the custom commands
        .invoke_handler(tauri::generate_handler![
            read_file_content,
            write_file_content,
            file_exists,
            get_file_metadata
        ])
        .setup(|app| {
            // Register plugins
            app.handle().plugin(tauri_plugin_shell::init())?;
            app.handle().plugin(tauri_plugin_dialog::init())?;
            app.handle().plugin(tauri_plugin_clipboard::init())?;
            app.handle().plugin(tauri_plugin_fs::init())?;
            
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
