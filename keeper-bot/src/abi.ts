export const EPOCH_MANAGER_ABI = [
  {
    type: 'function',
    name: 'currentEpochId',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getEpoch',
    inputs: [{ name: 'epochId', type: 'uint256', internalType: 'uint256' }],
    outputs: [
      { name: 'id', type: 'uint256', internalType: 'uint256' },
      { name: 'startTime', type: 'uint256', internalType: 'uint256' },
      { name: 'endTime', type: 'uint256', internalType: 'uint256' },
      {
        name: 'state',
        type: 'uint8',
        internalType: 'enum IEpochManager.EpochState',
      },
      { name: 'totalDeposits', type: 'uint256', internalType: 'uint256' },
      {
        name: 'totalWithdrawRequests',
        type: 'uint256',
        internalType: 'uint256',
      },
      { name: 'settled', type: 'bool', internalType: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'processEpoch',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    name: 'EpochNotEnded',
    inputs: [],
  },
  {
    type: 'error',
    name: 'EpochNotLocked',
    inputs: [],
  },
  {
    type: 'error',
    name: 'AccessControlUnauthorizedAccount',
    inputs: [
      { name: 'account', type: 'address', internalType: 'address' },
      { name: 'neededRole', type: 'bytes32', internalType: 'bytes32' },
    ],
  },
  {
    type: 'error',
    name: 'ERC20InsufficientBalance',
    inputs: [
      { name: 'sender', type: 'address', internalType: 'address' },
      { name: 'balance', type: 'uint256', internalType: 'uint256' },
      { name: 'needed', type: 'uint256', internalType: 'uint256' },
    ],
  },
] as const;

export enum EpochState {
  OPEN = 0,
  LOCKED = 1,
  SETTLED = 2,
}
