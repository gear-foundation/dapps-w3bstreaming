#![no_std]

pub use web3streaming_io::*;

#[cfg(not(feature = "binary-vendor"))]
mod contract;

#[cfg(feature = "binary-vendor")]
include!(concat!(env!("OUT_DIR"), "/wasm_binary.rs"));
