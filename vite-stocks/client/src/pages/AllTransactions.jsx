import { useEffect, useState } from 'react';
import '../styles/AllTransactions.css';
import axios from 'axios';

const AllTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    await axios.get('http://localhost:6001/transactions').then((response) => {
      setTransactions(response.data.reverse());
    });
  };

  return (
    <div className="all-transactions-page"> {/* Corrected from class to className */}
      <h2>All Transactions</h2>
      <div className="all-transactions"> {/* Corrected from class to className */}
        {transactions.map((transaction) => (
          <div className="admin-transaction" key={transaction._id}> {/* Added key prop */}
            <span>
              <h6>Transaction Id</h6>
              <p>{transaction._id}</p>
            </span>
            <span>
              <h6>User Id</h6>
              <p>{transaction.user}</p>
            </span>
            <span>
              <h6>Amount</h6>
              <p>$ {transaction.amount}</p>
            </span>
            <span>
              <h6>Action</h6>
              <p>{transaction.type}</p>
            </span>
            <span>
              <h6>Payment mode</h6>
              <p>{transaction.paymentMode}</p>
            </span>
            <span>
              <h6>Time</h6>
              <p>{transaction.time.slice(0, 24)}</p>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllTransactions;
