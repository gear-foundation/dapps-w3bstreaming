use codec::{Decode, Encode};
use gmeta::metawasm;
use gstd::{prelude::*, ActorId, BTreeMap};
use scale_info::TypeInfo;
use web3streaming_io::Stream;

#[derive(TypeInfo, Encode, Decode)]
pub struct StreamAndWatcherIds {
    stream_id: String,
    watcher_id: ActorId,
}

#[metawasm]
pub mod metafns {
    pub type State = BTreeMap<String, Stream>;

    pub fn all_streams(state: State) -> State {
        state
    }

    pub fn streams_by_actor(state: State, actor_id: ActorId) -> State {
        state
            .into_iter()
            .filter(|(id, stream)| stream.broadcaster.eq(&actor_id))
            .collect()
    }

    pub fn stream_by_id(state: State, id: String) -> Option<Stream> {
        state.get(&id).cloned()
    }

    pub fn is_actor_subscribed(state: State, ids: StreamAndWatcherIds) -> bool {
        let stream = state.get(&ids.stream_id);
        if stream.is_none() {
            false
        } else {
            stream.unwrap().watchers.contains(&ids.watcher_id)
        }
    }
}
