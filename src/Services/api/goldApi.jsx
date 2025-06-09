import axios from "../axios/config";


const goldURL = '/api/ExternalAPI/GoldPrice';


const getGoldExchangeRate = async () => {
  try {
    const response = await axios.get(goldURL);
    const responseData = response.data;

    if (responseData) {
      const price = responseData.data;
      return price;
    } else {
      throw new Error('Failed to fetch gold exchange rate');
    }
  } catch (error) {
    console.error("Error fetching gold exchange rate:", error);
    throw error;
  }
}


export default getGoldExchangeRate;