// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const JAN_1ST_2030 = 1893456000;
const ONE_GWEI = 1_000_000_000n;

module.exports = buildModule("CertModule", (m) => {
  const cert=m.contract("voting_system",["0xA305d2A348cd8fE0eD15C9385f85a42Ee4CB39a9"])
  return {cert};
});