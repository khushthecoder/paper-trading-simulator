const getLastPrice = async (symbol) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const demoPrices = {
        'RELIANCE': 2500.00,
        'TCS': 3500.00,
        'INFY': 1500.00,
        'AAPL': 150.00,
        'GOOGL': 2800.00,
        'TSLA': 900.00,
    };

    if (demoPrices[symbol.toUpperCase()]) {
        const base = demoPrices[symbol.toUpperCase()];
        const fluctuation = base * 0.01 * (Math.random() - 0.5);
        return parseFloat((base + fluctuation).toFixed(2));
    }

    return parseFloat((Math.random() * 1000 + 50).toFixed(2));
};

module.exports = {
    getLastPrice,
};
