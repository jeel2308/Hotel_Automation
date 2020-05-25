module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 7545,
            network_id: "5777", // Match any network id
            gas: 50000000000
        }
    },
    compilers: {
        solc: {
            settings: {
                optimizer: {
                    enabled: true, // Default: false
                    runs: 200 // Default: 200
                }
            }
        }
    }
};
