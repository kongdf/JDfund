use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    webview::WebviewWindowBuilder,
    Manager,
};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let quit_i = MenuItem::with_id(app, "quit", "关闭", true, None::<&str>)?;
            let open_setting = MenuItem::with_id(app, "setting", "设置", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&open_setting, &quit_i])?;

            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .show_menu_on_left_click(true)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "quit" => {
                        println!("点击关闭");
                        app.exit(0);
                    }
                    "setting" => {
                        if let Some(w) = app.get_webview_window("setting") {
                            let _ = w.show();
                            let _ = w.set_focus();
                        } else {
                            let _ = WebviewWindowBuilder::new(
                                app,
                                "setting",
                                tauri::WebviewUrl::App("/setting".into()),
                            )
                            .title("设置")
                            .inner_size(500.0, 100.0)
                            .build();
                        }
                    }
                    _ => {
                        println!("menu item {:?} not handled", event.id);
                    }
                })
                .build(app)?;
            Ok(())
        })
        .plugin(tauri_plugin_websocket::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
