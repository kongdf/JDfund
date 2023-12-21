#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod menu;
 

fn main() {
    let context = tauri::generate_context!();
    tauri::Builder::default()
        .menu(menu::init(&context)) // ✅ 将菜单添加到所有窗口
        .run(context)
        .expect("error while running OhMyBox application");
}
