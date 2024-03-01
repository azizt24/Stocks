import { useEffect, useState } from 'react';
import '../styles/Profile.css';
import { RiRefund2Line, RiHistoryLine } from 'react-icons/ri';
import { GiCash } from 'react-icons/gi';
import { HiOutlineCurrencyRupee } from 'react-icons/hi';
import { FiCreditCard } from 'react-icons/fi';
import axios from 'axios';

const Profile = () => {
  const [actionType, setActionType] = useState('Transactions');
  const [userData, setUserData] = useState({});
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [depositMode, setDepositMode] = useState('');
  const [withdrawMode, setWithdrawMode] = useState('');
  const [transactions, setTransactions] = useState([]);

  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchUser();
    fetchTransactions();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:6001/fetch-user/${userId}`);
      setUserData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://localhost:6001/transactions?user=${userId}`);
      setTransactions(response.data.reverse());
    } catch (err) {
      console.log(err);
    }
  };

  const deposit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:6001/deposit', { user: userId, amount: depositAmount, mode: depositMode });
      alert('Deposit successful');
      setUserData({ ...userData, balance: response.data.balance });
      setDepositAmount('');
      setDepositMode('');
      fetchTransactions();
    } catch (err) {
      console.error(err);
      alert('Deposit failed');
    }
  };

  const withdraw = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:6001/withdraw', { user: userId, amount: withdrawAmount, mode: withdrawMode });
      alert('Withdrawal successful');
      setUserData({ ...userData, balance: response.data.balance });
      setWithdrawAmount('');
      setWithdrawMode('');
      fetchTransactions();
    } catch (err) {
      console.error(err);
      alert('Withdrawal failed');
    }
  };

  return (
    <div className="profilePage">
      <h2>My Account</h2>
      <div className="profileBox">
        <div className="profileBox-head">
          <p>{username}</p>
        </div>
        <div className="profileBox-body">
          <span>
            <p>Trading balance</p>
            <h6>$ {userData.balance}</h6>
          </span>
          <div className="cash-actions">
            <button className={actionType === 'AddFunds' ? 'cash-actions-active' : 'cash-actions-inactive'} onClick={() => setActionType('AddFunds')}>
              <RiRefund2Line className='cash-action-icons' /> Add Funds
            </button>
            <button className={actionType === 'Withdraw' ? 'cash-actions-active' : 'cash-actions-inactive'} onClick={() => setActionType('Withdraw')}>
              <GiCash className='cash-action-icons' /> Withdraw
            </button>
            <button className={actionType === 'Transactions' ? 'cash-actions-active' : 'cash-actions-inactive'} onClick={() => setActionType('Transactions')}>
              <RiHistoryLine className='cash-action-icons' /> Transaction History
            </button>
          </div>
        </div>
      </div>

      {actionType === 'AddFunds' && (
        <div className="ProfileFunds">
          <h3>Add funds</h3>
          <form onSubmit={deposit}>
            <div className="mb-3">
              <label htmlFor="amountInput" className="form-label"><HiOutlineCurrencyRupee /> Amount</label>
              <input type="number" className="form-control" id="amountInput" placeholder='Enter amount' value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="selectInput" className="form-label"><FiCreditCard /> Payment mode</label>
              <select className="form-select" id='selectInput' value={depositMode} onChange={(e) => setDepositMode(e.target.value)}>
                <option value="">Choose payment mode</option>
                <option value="upi">UPI Payment</option>
                <option value="net banking">Net Banking</option>
                <option value="card">Credit/Debit Card</option>
              </select>
            </div>
            <button className="btn btn-primary" type="submit">Proceed</button>
          </form>
        </div>
      )}

      {actionType === 'Withdraw' && (
        <div className="ProfileFunds">
          <h3>Withdraw</h3>
          <form onSubmit={withdraw}>
            <div className="mb-3">
              <label htmlFor="amountInput" className="form-label"><HiOutlineCurrencyRupee /> Amount</label>
              <input type="number" className="form-control" id="amountInput" placeholder='Enter amount' value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="selectInput" className="form-label"><FiCreditCard /> Withdraw mode</label>
              <select className="form-select" id='selectInput' value={withdrawMode} onChange={(e) => setWithdrawMode(e.target.value)}>
                <option value="">Choose withdraw mode</option>
                <option value="upi">UPI Payment</option>
                <option value="NEFT">NEFT</option>
                <option value="IMPS">IMPS</option>
              </select>
            </div>
            <button className="btn btn-primary" type="submit">Proceed</button>
          </form>
        </div>
      )}

      {actionType === 'Transactions' && (
        <div className="ProfileFunds">
          <h3>Transactions</h3>
          <div className="profileTransactions">
            {transactions.map((transaction, index) => (
              <div className="profileTransaction" key={index}>
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
                  <p>{new Date(transaction.time).toLocaleString()}</p>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
