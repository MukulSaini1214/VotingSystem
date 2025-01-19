# Blockchain Voting System

This project implements a basic prototype of a voting system utilizing blockchain technology. The system ensures that votes are securely cast, tracked, and managed, ensuring fairness and transparency.

## Technologies Used
- **Frontend**: React
- **Backend**: Solidity (Ethereum Smart Contracts)
- **Deployment**: Hardhat

## Features
- **Eligible Voters**: Maintains a list of eligible voters.
- **Single Vote Per Voter**: Ensures each eligible voter can cast their vote only once using integers to track votes.
- **Blockchain Authenticity**: Verifies that each vote is cast from the voter’s own account, preventing multiple votes (multi-voting) from the same voter.
- **Live Vote Count**: Displays the live vote count for each contestant on the website.
- **Election Commission**: The Election Commission (the owner of the contract) has the authority to deactivate or activate the contract.
