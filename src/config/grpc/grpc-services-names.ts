
const envServicesNames = process.env.NEXT_PUBLIC_CADENCE_GRPC_SERVICES_NAMES;
const GRPC_SERVICES_NAMES = envServicesNames ?  envServicesNames.split(',').filter((s) => Boolean(s.trim())).map((s) => s.trim()) : ['cadence-frontend'];


export default GRPC_SERVICES_NAMES;