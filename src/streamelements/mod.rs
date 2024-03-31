pub mod service;

use std::sync::Mutex;

use once_cell::sync::Lazy;

use self::service::SESocketService;

pub static INSTANCE: Lazy<Mutex<SESocketService>> = Lazy::new(|| Mutex::new(SESocketService::new()));
