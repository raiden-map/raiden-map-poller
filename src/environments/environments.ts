export const environments = {
    ethMainnetNode: 'https://mainnet.infura.io/v3/d564e4fd474d476584fd255e81adc7b2',
    raidenContractUrl: 'https://raw.githubusercontent.com/raiden-network/raiden-contracts/master/raiden_contracts/data/deployment_mainnet.json',
    etherScanAPIKey: 'B4AMBFXJIUDH2IPEZNQQZJRD8KP3Z4YIMU',
    getABIUrl: (contractAddress: string, APIKey: string) => `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${APIKey}`,
    getTokenInfo: (contractAddress: string) => `https://api.coingecko.com/api/v3/coins/ethereum/contract/${contractAddress}`,
}