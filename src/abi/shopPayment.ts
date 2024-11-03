export const SHOP_PAYMENT_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'target',
        type: 'address'
      }
    ],
    name: 'AddressEmptyCode',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'AddressInsufficientBalance',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'implementation',
        type: 'address'
      }
    ],
    name: 'ERC1967InvalidImplementation',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ERC1967NonPayable',
    type: 'error'
  },
  {
    inputs: [],
    name: 'FailedInnerCall',
    type: 'error'
  },
  {
    inputs: [],
    name: 'InvalidInitialization',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address'
      }
    ],
    name: 'InvalidPaymentToken',
    type: 'error'
  },
  {
    inputs: [],
    name: 'NotInitializing',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'orderId',
        type: 'string'
      }
    ],
    name: 'OnlyPaidOrderCanBeCancel',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'orderId',
        type: 'string'
      }
    ],
    name: 'OrderAlreadyCancelled',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'orderId',
        type: 'string'
      }
    ],
    name: 'OrderDoesNotExist',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address'
      }
    ],
    name: 'OwnableInvalidOwner',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ReentrancyGuardReentrantCall',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address'
      }
    ],
    name: 'SafeERC20FailedOperation',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'buyer',
        type: 'address'
      }
    ],
    name: 'SenderIsNotBuyer',
    type: 'error'
  },
  {
    inputs: [],
    name: 'UUPSUnauthorizedCallContext',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'slot',
        type: 'bytes32'
      }
    ],
    name: 'UUPSUnsupportedProxiableUUID',
    type: 'error'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64',
        name: 'version',
        type: 'uint64'
      }
    ],
    name: 'Initialized',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'orderId',
        type: 'string'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'buyer',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'refundAmount',
        type: 'uint256'
      }
    ],
    name: 'OrderCancelled',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'orderId',
        type: 'string'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'buyer',
        type: 'address'
      }
    ],
    name: 'OrderDelivered',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'orderId',
        type: 'string'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'buyer',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'price',
        type: 'uint256'
      }
    ],
    name: 'OrderPaid',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address'
      }
    ],
    name: 'Upgraded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'token',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'Withdrawn',
    type: 'event'
  },
  {
    inputs: [],
    name: 'NATIVE_TOKEN',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'UPGRADE_INTERFACE_VERSION',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address'
      }
    ],
    name: 'addPayableToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string[]',
        name: 'orderIds',
        type: 'string[]'
      }
    ],
    name: 'batchCancelOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_orderId',
        type: 'string'
      }
    ],
    name: 'cancelOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_orderId',
        type: 'string'
      },
      {
        internalType: 'uint256',
        name: '_price',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_payToken',
        type: 'address'
      }
    ],
    name: 'createAndPayOrder',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string[]',
        name: 'orderIds',
        type: 'string[]'
      }
    ],
    name: 'deliverOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address'
      }
    ],
    name: 'disableToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string[]',
        name: 'orderIds',
        type: 'string[]'
      }
    ],
    name: 'forceCancelOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_orderId',
        type: 'string'
      }
    ],
    name: 'getOrder',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'orderId',
            type: 'string'
          },
          {
            internalType: 'address',
            name: 'buyer',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256'
          },
          {
            internalType: 'enum Status',
            name: 'status',
            type: 'uint8'
          },
          {
            internalType: 'uint256',
            name: 'createdAt',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'token',
            type: 'address'
          }
        ],
        internalType: 'struct Order',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_buyer',
        type: 'address'
      }
    ],
    name: 'getUserOrders',
    outputs: [
      {
        internalType: 'string[]',
        name: '',
        type: 'string[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    name: 'orders',
    outputs: [
      {
        internalType: 'string',
        name: 'orderId',
        type: 'string'
      },
      {
        internalType: 'address',
        name: 'buyer',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256'
      },
      {
        internalType: 'enum Status',
        name: 'status',
        type: 'uint8'
      },
      {
        internalType: 'uint256',
        name: 'createdAt',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'payableToken',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'proxiableUUID',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address'
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes'
      }
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'userOrders',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'withdrawAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'withdrawable',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]
