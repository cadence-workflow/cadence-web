const envPeers = process.env.CADENCE_GRPC_PEERS;

const GRPC_PEERS: Array<string> = envPeers ? envPeers.split(',').filter((p) => Boolean(p.trim())).map((p) => p.trim()) : ['127.0.0.1:7933'];


export default GRPC_PEERS;
