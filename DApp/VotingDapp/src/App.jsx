import { useState, useEffect } from 'react';
import { Contract, BrowserProvider } from 'ethers';
import { abi, contractAddress } from './voting_system.json';

function App() {
  const [isOwner, setIsOwner] = useState(false);
  const [isContractActive, setIsContractActive] = useState(true);
  const [electionCommission, setElectionCommission] = useState('');
  const [candidate, setCandidate] = useState('');
  const [contestants, setContestants] = useState([]);
  const [votes, setVotes] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [provider, setProvider] = useState(null);

  const connectMetaMask = async () => {
    try {
      if (!window.ethereum) {
        setErrorMessage('MetaMask is not installed. Please install MetaMask and try again.');
        alert('MetaMask is not installed. Please install MetaMask and try again.');
        return;
      }

      const metaMaskProvider = new BrowserProvider(window.ethereum);
      setProvider(metaMaskProvider);

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setIsConnected(true);
        alert('MetaMask connected successfully!');
      } else {
        setErrorMessage('No MetaMask account connected.');
        alert('No MetaMask account connected. Please connect an account.');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      setErrorMessage('Failed to connect to MetaMask.');
      alert('Failed to connect to MetaMask.');
    }
  };

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        if (!provider) return;

        const signer = await provider.getSigner();
        const instance = new Contract(contractAddress, abi, signer);

        const ownerAddress = await instance.ELECTION_COMMISSION();
        setElectionCommission(ownerAddress);

        const userAddress = await signer.getAddress();
        setIsOwner(userAddress.toLowerCase() === ownerAddress.toLowerCase());

        const fetchedContestants = await instance.getContestants();
        setContestants(fetchedContestants);

        // Fetch votes for each contestant
        const fetchedVotes = {};
        for (const contestant of fetchedContestants) {
          const voteCount = await instance.CANDIDATE_STATUS(contestant);
          fetchedVotes[contestant] = voteCount.toString();
        }
        setVotes(fetchedVotes);
      } catch (error) {
        console.error('Error fetching owner or contestants:', error);
      }
    };

    fetchOwner();
  }, [provider]);

  const deactivateContract = async () => {
    try {
      if (!isOwner) {
        alert('You are not authorized to perform this action.');
        return;
      }
      const signer = await provider.getSigner();
      const instance = new Contract(contractAddress, abi, signer);
      const trx = await instance.deactivateContract();
      await trx.wait();
      setIsContractActive(false);
      alert('Contract successfully deactivated.');
    } catch (error) {
      console.error('Error deactivating contract:', error);
      alert('Failed to deactivate the contract.');
    }
  };

  const reactivateContract = async () => {
    try {
      if (!isOwner) {
        alert('You are not authorized to perform this action.');
        return;
      }
      const signer = await provider.getSigner();
      const instance = new Contract(contractAddress, abi, signer);
      const trx = await instance.reactivateContract();
      await trx.wait();
      setIsContractActive(true);
      alert('Contract successfully reactivated.');
    } catch (error) {
      console.error('Error reactivating contract:', error);
      alert('Failed to reactivate the contract.');
    }
  };

  const voteForCandidate = async () => {
    try {
      if (!candidate) {
        alert('Please select a candidate.');
        return;
      }
      const signer = await provider.getSigner();
      const instance = new Contract(contractAddress, abi, signer);
      const trx = await instance.VOTE_CANDIDATE(candidate);
      await trx.wait();
      alert(`Successfully voted for ${candidate}!`);
    } catch (error) {
      console.error('Error voting for the candidate:', error);
      alert('Not eligible for voting OR Has voted earlier');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>VOTING DAPP</h1>

      {!isConnected ? (
        <button onClick={connectMetaMask} style={styles.metaMaskButton}>
          Connect MetaMask
        </button>
      ) : (
        <>
          <p>Contract is <strong>{isContractActive ? 'Active' : 'Inactive'}</strong></p>
          <p>Election Commission Address: {electionCommission}</p>
          <p>Your Role: <strong>{isOwner ? 'Owner' : 'Voter'}</strong></p>

          {isOwner && (
            <div style={styles.buttonGroup}>
              <h2>Manage Contract</h2>
              <button
                onClick={deactivateContract}
                disabled={!isContractActive}
                style={{ ...styles.button, backgroundColor: '#dc3545' }}
              >
                Deactivate Contract
              </button>
              <button
                onClick={reactivateContract}
                disabled={isContractActive}
                style={{ ...styles.button, backgroundColor: '#28a745' }}
              >
                Reactivate Contract
              </button>
            </div>
          )}

          <div style={styles.voteSection}>
            <h2>Vote for a Candidate</h2>
            <div style={styles.voteContainer}>
              <select
                value={candidate}
                onChange={(e) => setCandidate(e.target.value)}
                style={styles.select}
              >
                <option value="">Select a candidate</option>
                {contestants.map((contestant, index) => (
                  <option key={index} value={contestant}>
                    {contestant}
                  </option>
                ))}
              </select>
              <button
                onClick={voteForCandidate}
                style={styles.voteButton}
              >
                Vote
              </button>
            </div>
          </div>

          <div style={styles.voteSummary}>
            <h2>Contestant Vote Counts</h2>
            {contestants.map((contestant, index) => (
              <p key={index}>
                {contestant}: {votes[contestant] || 0} votes
              </p>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    background: `url('your-voting-image-url.jpg') no-repeat center center fixed`, // Replace with the URL of the voting type image
    backgroundSize: 'cover',
    height: '100vh',
  },
  heading: {
    textAlign: 'center',
    color: '#007bff',
    fontSize: '60px', // Increased size
    textTransform: 'uppercase',
    marginTop: '30px', // Make sure the heading stays at the top
  },
  metaMaskButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  buttonGroup: {
    marginTop: '20px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    color: '#fff',
    cursor: 'pointer',
  },
  voteSection: {
    marginTop: '20px',
  },
  voteContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  select: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ced4da',
  },
  voteButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  voteSummary: {
    marginTop: '20px',
  },
};

export default App;