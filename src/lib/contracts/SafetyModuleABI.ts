export const SafetyModuleABI = [
  {
    type: 'constructor',
    inputs: [{ name: 'coreVault_', type: 'address', internalType: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getCurrentLevel',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint8',
        internalType: 'enum SafetyLib.SafetyLevel',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getCurrentConfig',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct ISafetyModule.SafetyConfig',
        components: [
          { name: 'minJuniorRatio', type: 'uint256', internalType: 'uint256' },
          {
            name: 'maxSeniorDeposit',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'seniorTargetAPY', type: 'uint256', internalType: 'uint256' },
          {
            name: 'seniorDepositsEnabled',
            type: 'bool',
            internalType: 'bool',
          },
          {
            name: 'juniorDepositsEnabled',
            type: 'bool',
            internalType: 'bool',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getHealthStatus',
    inputs: [],
    outputs: [
      { name: 'isHealthy', type: 'bool', internalType: 'bool' },
      { name: 'isCritical', type: 'bool', internalType: 'bool' },
      { name: 'currentRatio', type: 'uint256', internalType: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isDepositAllowed',
    inputs: [{ name: 'isSenior', type: 'bool', internalType: 'bool' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'canDepositSenior',
    inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
    outputs: [
      { name: 'allowed', type: 'bool', internalType: 'bool' },
      { name: 'reason', type: 'string', internalType: 'string' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'canDepositJunior',
    inputs: [],
    outputs: [
      { name: 'allowed', type: 'bool', internalType: 'bool' },
      { name: 'reason', type: 'string', internalType: 'string' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getSeniorTargetAPY',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getMinJuniorRatio',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'seniorDepositsPaused',
    inputs: [],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'juniorDepositsPaused',
    inputs: [],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'currentLevel',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint8',
        internalType: 'enum SafetyLib.SafetyLevel',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'calculateRequiredJuniorDeposit',
    inputs: [{ name: 'targetRatio', type: 'uint256', internalType: 'uint256' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'SafetyLevelChanged',
    inputs: [
      {
        name: 'oldLevel',
        type: 'uint8',
        indexed: true,
        internalType: 'enum SafetyLib.SafetyLevel',
      },
      {
        name: 'newLevel',
        type: 'uint8',
        indexed: true,
        internalType: 'enum SafetyLib.SafetyLevel',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'HealthCheckPerformed',
    inputs: [
      {
        name: 'juniorRatio',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'isHealthy',
        type: 'bool',
        indexed: false,
        internalType: 'bool',
      },
      {
        name: 'isCritical',
        type: 'bool',
        indexed: false,
        internalType: 'bool',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SeniorDepositsPaused',
    inputs: [
      {
        name: 'reason',
        type: 'string',
        indexed: false,
        internalType: 'string',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SeniorDepositsResumed',
    inputs: [],
    anonymous: false,
  },
] as const;
