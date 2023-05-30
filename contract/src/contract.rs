use gstd::{exec, msg, prelude::*, BTreeMap};
use web3streaming_io::{Action, ActionResult, Stream};

static mut STREAMS: BTreeMap<String, Stream> = BTreeMap::new();

#[no_mangle]
extern "C" fn handle() {
    let input: Action = msg::load().expect("Unable to load message");
    unsafe {
        match input {
            Action::NewStream {
                timestamp,
                title,
                description,
            } => {
                let stream_id = String::from(exec::block_timestamp().to_string()) + &title;
                STREAMS.insert(
                    stream_id.clone(),
                    Stream {
                        broadcaster: msg::source(),
                        timestamp,
                        title,
                        description,
                        watchers: Vec::new(),
                    },
                );
                msg::reply(ActionResult::StreamIsScheduled { id: stream_id }, 0)
                    .expect("Unable to send reply");
            }
            Action::SubscribeToStream { id } => {
                let stream = STREAMS.get_mut(&id);
                if stream.is_none() {
                    msg::reply(ActionResult::Error(String::from("Stream not found")), 0)
                        .expect("Unable to send reply");
                } else {
                    let s = stream.unwrap();
                    s.watchers.push(msg::source());
                    msg::reply(ActionResult::Subscribed { id }, 0).expect("Unable to send reply");
                }
            }
            Action::FinishStream { id } => {
                let stream = STREAMS.remove(&id);
                if stream.is_some() {
                    msg::reply(ActionResult::StreamIsFinished { id }, 0)
                        .expect("Unable to send reply");
                } else {
                    msg::reply(ActionResult::Error(String::from("Stream not found")), 0)
                        .expect("Unable to send reply");
                }
            }
        }
    };
}

#[no_mangle]
extern "C" fn state() {
    msg::reply(unsafe { STREAMS.clone() }, 0).expect("Error in state");
}
