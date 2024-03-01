import { useEffect, useState } from 'react';
import '../styles/StockChart.css';
import Chart from 'react-apexcharts';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const StockChart = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [stockAction, setStockAction] = useState('buy');
  const [stockValues, setStockValues] = useState([]);
  const [stockPrice, setStockPrice] = useState();
  const [stockExchange, setStockExchange] = useState('');

  const [buyQuantity, setBuyQuantity] = useState('');
  const [buyType, setBuyType] = useState('Intraday');

  const [sellQuantity, setSellQuantity] = useState('');
  const [sellType, setSellType] = useState('Intraday');

  useEffect(() => {
    const fetchStockData = async () => {
      const options = {
        method: 'GET',
        url: 'https://twelve-data1.p.rapidapi.com/time_series',
        params: { symbol: id, interval: '1min', outputsize: '100', format: 'json' },
        headers: {
          'X-RapidAPI-Key': 'fc1a9ce83dmsh89bfeafe4258cbcp17a75cjsn1a4934c7ed6d',
          'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com',
        },
      };

      try {
        const { data } = await axios.request(options);
        setStockExchange(data.meta.exchange);
        const transformedData = data.values.map(item => ({
          x: new Date(item.datetime).getTime(),
          y: [item.open, item.high, item.low, item.close].map(parseFloat),
        }));
        setStockValues(transformedData);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    const fetchPrice = async () => {
      const options = {
        method: 'GET',
        url: 'https://twelve-data1.p.rapidapi.com/price',
        params: { symbol: id, format: 'json' },
        headers: {
          'X-RapidAPI-Key': 'fc1a9ce83dmsh89bfeafe4258cbcp17a75cjsn1a4934c7ed6d',
          'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com',
        },
      };

      try {
        const { data } = await axios.request(options);
        setStockPrice(data.price);
      } catch (error) {
        console.error('Error fetching stock price:', error);
      }
    };

    fetchStockData();
    fetchPrice();
  }, [id]);

  const buyStock = async (e) => {
    e.preventDefault();
    // Implement buy stock logic
    navigate('/history');
  };

  const sellStock = async (e) => {
    e.preventDefault();
    // Implement sell stock logic
    navigate('/history');
  };

  const series = [{ data: stockValues }];
  const options = {
    chart: { type: 'candlestick', height: 350 },
    title: { text: `${id} - ${stockExchange}`, align: 'left' },
    xaxis: { type: 'datetime' },
    yaxis: { tooltip: { enabled: true } },
  };

  return (
    <div className="stockPage">
      <div className="stockChart">
        <Chart options={options} series={series} type="candlestick" height="350" />
      </div>
      <div className="stockChartActions">
        <div className="stockChartActions-head">
          <button className={stockAction === 'buy' ? 'button-active' : 'button-inactive'} onClick={() => setStockAction('buy')}>
            Buy {stockPrice ? `@ $${stockPrice}` : ''}
          </button>
          <button className={stockAction === 'sell' ? 'button-active' : 'button-inactive'} onClick={() => setStockAction('sell')}>
            Sell {stockPrice ? `@ $${stockPrice}` : ''}
          </button>
        </div>
        <div className="stockChartActions-body">
          {stockAction === 'buy' && (
            <form onSubmit={buyStock}>
              <div className="mb-3">
                <label htmlFor="inputProductType" className="form-label">Product type</label>
                <select className="form-select" id="inputProductType" aria-label="Default select example" onChange={(e) => setBuyType(e.target.value)} value={buyType}>
                  <option value="Intraday" selected>Intraday</option>
                  <option value="Delivery">Delivery</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="inputStockQuantity" className="form-label">Quantity</label>
                <input type="number" className="form-control" id="inputStockQuantity" onChange={(e) => setBuyQuantity(e.target.value)} value={buyQuantity} />
              </div>
              <button type="submit" className="btn btn-success">Buy now</button>
            </form>
          )}
          {stockAction === 'sell' && (
            <form onSubmit={sellStock}>
              <div className="mb-3">
                <label htmlFor="inputProductType" className="form-label">Product type</label>
                <select className="form-select" id="inputProductType" aria-label="Default select example" onChange={(e) => setSellType(e.target.value)} value={sellType}>
                  <option value="Intraday" selected>Intraday</option>
                  <option value="Delivery">Delivery</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="inputStockQuantity" className="form-label">Quantity</label>
                <input type="number" className="form-control" id="inputStockQuantity" onChange={(e) => setSellQuantity(e.target.value)} value={sellQuantity} />
              </div>
              <button type="submit" className="btn btn-danger">Sell now</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockChart;
