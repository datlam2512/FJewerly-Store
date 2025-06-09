import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { addBuyPrice, addSellPrice, resetBuyPrice, resetSellPrice } from '../Features/goldTransaction/goldTransactionSlice';
import getVNDExchangeRate from '../Services/api/exchangeRateApi';
import getGoldExchangeRate from '../Services/api/goldApi';
import constants from '../constants.json'
import { getMultipliers } from "../Services/api/multiplier";

function Authentication({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [dataFetched, setDataFetched] = useState(false);

    const roundToNearestThousand = (value) => Math.round(value / 1000) * 1000;

    const authenticate = async () => {
        const token = localStorage.getItem("token");

        if (token) {
            const decodedToken = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);

            if (currentTime > decodedToken.exp) {
                localStorage.clear();
                navigate("/login");
            } else {
                switch (decodedToken.role) {
                    case "Admin":
                        localStorage.setItem("role", "admin");
                        break;
                    case "Manager":
                        localStorage.setItem("role", "manager");
                        break;
                    case "Staff":
                        localStorage.setItem("role", "staff");
                        break;
                    default:
                        console.log("Role not recognized");
                }

                localStorage.setItem("nameid", decodedToken.nameid);
                localStorage.setItem("email", decodedToken.email);
                localStorage.setItem("UserName", decodedToken.UserName);
                localStorage.setItem("UniqueName", decodedToken.unique_name);
                if (!dataFetched) {
                    try {
                        dispatch(resetBuyPrice());
                        dispatch(resetSellPrice());

                        const vndRate = await getVNDExchangeRate();
                        const goldPrice = await getGoldExchangeRate();
                        const multipliers = await getMultipliers(); 

                        const goldPriceInVND = (goldPrice * vndRate) / constants.exchangeRate;
                        const buyPrice = goldPriceInVND * multipliers.buyMultiplier;

                        const buyGold24k = roundToNearestThousand(parseFloat(buyPrice));
                        const buyGold18k = roundToNearestThousand(buyGold24k * constants.goldWeightRatio["18k"]);
                        const buyGold14k = roundToNearestThousand(buyGold24k * constants.goldWeightRatio["14k"]);
                        const buyGold10k = roundToNearestThousand(buyGold24k * constants.goldWeightRatio["10k"]);

                        const buyPriceObject = {
                            buyGold24k: buyGold24k.toFixed(0),
                            buyGold18k: buyGold18k.toFixed(0),
                            buyGold14k: buyGold14k.toFixed(0),
                            buyGold10k: buyGold10k.toFixed(0),
                        };

                        const sellPrice = goldPriceInVND * multipliers.sellMultiplier;

                        const sellGold24k = roundToNearestThousand(parseFloat(sellPrice));
                        const sellGold18k = roundToNearestThousand(sellGold24k * constants.goldWeightRatio["18k"]);
                        const sellGold14k = roundToNearestThousand(sellGold24k * constants.goldWeightRatio["14k"]);
                        const sellGold10k = roundToNearestThousand(sellGold24k * constants.goldWeightRatio["10k"]);

                        const sellPriceObject = {
                            sellGold24k: sellGold24k.toFixed(0),
                            sellGold18k: sellGold18k.toFixed(0),
                            sellGold14k: sellGold14k.toFixed(0),
                            sellGold10k: sellGold10k.toFixed(0),
                        };

                        dispatch(addBuyPrice(buyPriceObject));
                        dispatch(addSellPrice(sellPriceObject));
                        setDataFetched(true);

                    } catch (error) {
                        console.error("Error fetching exchange rates or calculating prices:", error);
                    }
                }

                if (location.pathname !== "" || location.pathname !== "/") {
                    navigate(location.pathname);
                } else {
                    navigate("/");
                }
            }
        } else {
            navigate("/login");
        }
    };

    const shouldRender = useRef(true);
    useEffect(() => {
        if (shouldRender.current) {
            shouldRender.current = false;
            authenticate();
        }
    }, []);

    return (
        children
    );
}

export default Authentication;
