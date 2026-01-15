export const EpochManagerABI = [
  {
    type: 'constructor',
    inputs: [
      { name: 'asset_', type: 'address', internalType: 'address' },
      { name: 'coreVault_', type: 'address', internalType: 'address' },
      { name: 'seniorVault_', type: 'address', internalType: 'address' },
      { name: 'juniorVault_', type: 'address', internalType: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'currentEpochId',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getCurrentState',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint8',
        internalType: 'enum IEpochManager.EpochState',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getEpoch',
    inputs: [{ name: 'epochId', type: 'uint256', internalType: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct IEpochManager.Epoch',
        components: [
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
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'timeUntilNextEpoch',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getUserWithdrawRequests',
    inputs: [{ name: 'user', type: 'address', internalType: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        internalType: 'struct IEpochManager.WithdrawRequest[]',
        components: [
          { name: 'user', type: 'address', internalType: 'address' },
          { name: 'isSenior', type: 'bool', internalType: 'bool' },
          { name: 'shares', type: 'uint256', internalType: 'uint256' },
          { name: 'epochId', type: 'uint256', internalType: 'uint256' },
          { name: 'processed', type: 'bool', internalType: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'calculatePenalty',
    inputs: [
      { name: 'isSenior', type: 'bool', internalType: 'bool' },
      { name: 'shares', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'earlyWithdrawPenalty',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'requestWithdraw',
    inputs: [
      { name: 'isSenior', type: 'bool', internalType: 'bool' },
      { name: 'shares', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'earlyWithdraw',
    inputs: [
      { name: 'isSenior', type: 'bool', internalType: 'bool' },
      { name: 'shares', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: 'assets', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'WithdrawRequested',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'epochId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      { name: 'isSenior', type: 'bool', indexed: false, internalType: 'bool' },
      {
        name: 'shares',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'EarlyWithdraw',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      { name: 'isSenior', type: 'bool', indexed: false, internalType: 'bool' },
      {
        name: 'assets',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'penalty',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'EpochStarted',
    inputs: [
      {
        name: 'epochId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'startTime',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'endTime',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
] as const;
