use rust_socketio::{ClientBuilder, Payload, RawClient, TransportType};
use tauri::Manager;

use crate::APP_HANDLE;

static SE_URL: &str = "wss://realtime.streamelements.com";
static SE_SOCKET_EVENT: &str = "SESocketEvent";

enum SESocketEvent {
    Connected,
    Disconnected,
    Authorized,
    Unauthorized,
    Event,
}

impl SESocketEvent {
    pub fn str(&self) -> &str {
        match self {
            SESocketEvent::Connected => "socket_connected",
            SESocketEvent::Disconnected => "socket_disconnected",
            SESocketEvent::Authorized => "socket_authorized",
            SESocketEvent::Unauthorized => "socket_unauthorized",
            SESocketEvent::Event => "event_message",
        }
    }
}

pub struct SESocketService {
    socket: Option<rust_socketio::client::Client>,
}

/* ============================================================================================== */

fn parse_payload(payload: Payload) -> serde_json::Value {
    let string_payload: String = match payload {
        Payload::String(str) => str,
        Payload::Binary(_bin) => String::new()
    };

    if string_payload.is_empty() {
        serde_json::from_str("{}").expect("An error occurred on parse message payload!")
    } else {
        serde_json::from_str(&string_payload.as_str()).expect("An error occurred on parse message payload!")
    }
    
}

fn mount_payload(event_type: &SESocketEvent, data: serde_json::Value) -> serde_json::Value {
    serde_json::json!({ "type": SESocketEvent::str(event_type), "data": data })
}

impl SESocketService {
    pub fn new() -> Self {
        Self {
            socket: None
        }
    }

    pub fn connect(&mut self, jwt_token: String) {
        let on_connect = move |raw_payload: Payload, socket: RawClient| {
            let payload = parse_payload(raw_payload);
            let event = mount_payload(&SESocketEvent::Connected, payload);
            APP_HANDLE.get().unwrap().emit_all(SE_SOCKET_EVENT, event).unwrap();

            let auth_payload = serde_json::json!({ "method": "jwt", "token": jwt_token });
            socket.emit("authenticate", auth_payload).expect("Server unreachable");
        };

        let on_disconnect = |raw_payload: Payload, _socket: RawClient| {
            let payload = parse_payload(raw_payload);
            let event = mount_payload(&SESocketEvent::Disconnected, payload);
            APP_HANDLE.get().unwrap().emit_all(SE_SOCKET_EVENT, event).unwrap();
        };
        
        let on_authenticated = |raw_payload: Payload, _socket: RawClient| {
            let payload = parse_payload(raw_payload);
            let event = mount_payload(&SESocketEvent::Authorized, payload);
            APP_HANDLE.get().unwrap().emit_all(SE_SOCKET_EVENT, event).unwrap();
        };
        
        let on_unauthorized = |raw_payload: Payload, _socket: RawClient| {
            let payload = parse_payload(raw_payload);
            let event = mount_payload(&SESocketEvent::Unauthorized, payload);
            APP_HANDLE.get().unwrap().emit_all(SE_SOCKET_EVENT, event).unwrap();
        };
        
        let on_event = |raw_payload: Payload, _socket: RawClient| {
            let payload = parse_payload(raw_payload);
            let event = mount_payload(&SESocketEvent::Event, payload);
            APP_HANDLE.get().unwrap().emit_all(SE_SOCKET_EVENT, event).unwrap();
        };

        let socket = ClientBuilder::new(SE_URL).transport_type(TransportType::Websocket)
            .on("open", on_connect)
            .on("close", on_disconnect)
            .on("authenticated", on_authenticated)
            .on("unauthorized", on_unauthorized)
            .on("event", on_event)
            .on("error", |err, _| eprintln!("Error: {:?}", err));

        self.socket = Some(socket.connect().expect("Connection with StreamElements WebSocket API failed!"));
    }

    pub fn disconnect(&mut self) {
        if let Some(socket) = &self.socket {
            let _ = socket.disconnect();
        }
    }
}
