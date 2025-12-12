const axios = require('axios');
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 60 });

const priceCache = {};
const CACHE_DURATION = 10000;
const BASE_URL = 'https://finnhub.io/api/v1';
const API_KEY = process.env.FINNHUB_API_KEY;

class MarketDataService {

    static async getRealTimePrice(symbol) {
        if (!symbol) throw new Error("Symbol is required");
        const upperSymbol = symbol.toUpperCase();

        if (priceCache[upperSymbol] && (Date.now() - priceCache[upperSymbol].timestamp < CACHE_DURATION)) {
            return priceCache[upperSymbol].price;
        }

        try {
            const response = await axios.get(`${BASE_URL}/quote?symbol=${upperSymbol}&token=${API_KEY}`);
            const price = Number(response.data.c); 

            if (!price) throw new Error("Price not found");

            priceCache[upperSymbol] = { price, timestamp: Date.now() };
            return price;
        } catch (error) {
            console.error(`Finnhub quote failed for ${upperSymbol}: ${error.message}`);
            throw error;
        }
    }

    static async getChartData(symbol, resolution = 'D') {
        const upperSymbol = symbol.toUpperCase();


        let res = 'D';
        let from = Math.floor(Date.now() / 1000); // Now
        const to = Math.floor(Date.now() / 1000);



        const oneDay = 24 * 60 * 60;
        if (typeof resolution === 'string') {
            if (resolution === '1d') { res = '60'; from -= oneDay; }
            else if (resolution === '1w') { res = 'D'; from -= oneDay * 7; }
            else if (resolution === '1mo') { res = 'D'; from -= oneDay * 30; }
            else if (resolution === '1y') { res = 'W'; from -= oneDay * 365; }
            else { res = 'D'; from -= oneDay * 30; } 
        }

        try {
            const response = await axios.get(`${BASE_URL}/stock/candle`, {
                params: {
                    symbol: upperSymbol,
                    resolution: res,
                    from: from,
                    to: to,
                    token: API_KEY
                }
            });

            if (response.data && response.data.s === 'ok') {

                return response.data.t.map((timestamp, index) => ({
                    time: new Date(timestamp * 1000).toISOString(),
                    open: response.data.o[index],
                    high: response.data.h[index],
                    low: response.data.l[index],
                    close: response.data.c[index],
                    volume: response.data.v[index]
                }));
            }
            return [];
        } catch (error) {
            console.error(`Finnhub candle failed: ${error.message}`);
            return [];
        }
    }

    static async searchSymbol(query) {
        if (!query) return [];
        try {
            const response = await axios.get(`${BASE_URL}/search?q=${query}&token=${API_KEY}`);

            return response.data.result
                .filter(item => !item.symbol.includes('.')) 
                .slice(0, 10)
                .map(item => ({
                    symbol: item.symbol,
                    description: item.description,
                    type: item.type,
                    exchange: 'US' 
                }));
        } catch (error) {
            console.error(`Finnhub search failed: ${error.message}`);
            return [];
        }
    }



    static async getCompanyProfile(symbol) {
        try {
            const response = await axios.get(`${BASE_URL}/stock/profile2?symbol=${symbol}&token=${API_KEY}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    static async getFinancials(symbol) {
        try {

            const response = await axios.get(`${BASE_URL}/stock/metric?symbol=${symbol}&metric=all&token=${API_KEY}`);
            return response.data; 
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    static async getMarketNews(category = 'general') {
        try {
            const response = await axios.get(`${BASE_URL}/news?category=${category}&token=${API_KEY}`);
            return response.data.slice(0, 20); 
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    static async getCompanyNews(symbol) {
        try {
            const from = new Date();
            from.setDate(from.getDate() - 7);
            const to = new Date();
            const fromStr = from.toISOString().split('T')[0];
            const toStr = to.toISOString().split('T')[0];

            const response = await axios.get(`${BASE_URL}/company-news?symbol=${symbol}&from=${fromStr}&to=${toStr}&token=${API_KEY}`);
            return response.data.slice(0, 10);
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    static async getRecommendations(symbol) {
        try {
            const response = await axios.get(`${BASE_URL}/stock/recommendation?symbol=${symbol}&token=${API_KEY}`);
            return response.data; 
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    static async getSentiment(symbol) {

        try {
            const response = await axios.get(`${BASE_URL}/stock/insider-sentiment?symbol=${symbol}&from=2024-01-01&token=${API_KEY}`);
            return response.data;
        } catch (error) {
            return null;
        }
    }
}

module.exports = MarketDataService;
