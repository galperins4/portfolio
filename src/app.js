import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Portfolio = () => {
  const [balances, setBalances] = useState([]);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    // Function to fetch cryptocurrency prices from a free API (CoinGecko in this case)
    const fetchPrices = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple&vs_currencies=usd'
        );

        const prices = response.data;
        const updatedBalances = balances.map((crypto) => ({
          ...crypto,
          value: crypto.balance * prices[crypto.id].usd,
        }));

        const newTotalValue = updatedBalances.reduce(
          (total, crypto) => total + crypto.value,
          0
        );

        setBalances(updatedBalances);
        setTotalValue(newTotalValue);
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };

    fetchPrices();
  }, [balances]);

  const handleBalanceChange = (cryptoId, newBalance) => {
    const updatedBalances = balances.map((crypto) =>
      crypto.id === cryptoId ? { ...crypto, balance: newBalance } : crypto
    );

    setBalances(updatedBalances);
  };

  return (
    <div>
      <h2>Crypto Portfolio Tracker</h2>
      <p>Total Portfolio Value: ${totalValue.toFixed(2)}</p>
      <ul>
        {balances.map((crypto) => (
          <li key={crypto.id}>
            {crypto.name} ({crypto.symbol}):{' '}
            <input
              type="number"
              value={crypto.balance}
              onChange={(e) =>
                handleBalanceChange(crypto.id, parseFloat(e.target.value))
              }
            />{' '}
            Balance | Value: ${crypto.value.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Portfolio;
