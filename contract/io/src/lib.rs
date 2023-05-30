#![no_std]

use codec::{Decode, Encode};
use gmeta::{InOut, Metadata};
use gstd::{prelude::*, ActorId, BTreeMap};
use scale_info::TypeInfo;

#[derive(Encode, Decode, TypeInfo, Clone)]
pub struct Stream {
    pub broadcaster: ActorId,
    pub timestamp: u64,
    pub title: String,
    pub description: Option<String>,
    pub watchers: Vec<ActorId>,
}

#[derive(Encode, Decode, TypeInfo)]
pub enum Action {
    NewStream {
        timestamp: u64,
        title: String,
        description: Option<String>,
    },
    SubscribeToStream {
        id: String,
    },
    FinishStream {
        id: String,
    },
}

#[derive(Encode, Decode, TypeInfo)]
pub enum ActionResult {
    StreamIsScheduled { id: String },
    Subscribed { id: String },
    StreamIsFinished { id: String },
    Error(String),
}

pub struct ProgramMetadata;

impl Metadata for ProgramMetadata {
    type Init = InOut<(), ()>;
    type Handle = InOut<Action, ActionResult>;
    type Reply = InOut<(), ()>;
    type Others = InOut<(), ()>;
    type Signal = ();
    type State = BTreeMap<String, Stream>;
}
