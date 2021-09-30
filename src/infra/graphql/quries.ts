import { gql } from 'graphql-request'

export const poolsQuery = gql`
  query poolsQuery(
    $first: Int! = 1000
    $skip: Int! = 0
    $orderBy: String! = "timestamp"
    $orderDirection: String! = "desc"
  ) {
    pools(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      pair
      allocPoint
      lastRewardBlock
      accLattePerShare
      balance
      userCount
      masterBarista {
        totalAllocPoint
        lattePerBlock
      }
    }
  }
`

export const pairTokenFieldsQuery = gql`
  fragment pairTokenFields on Token {
    id
    name
    symbol
    totalSupply
    derivedBNB
    decimals
  }
`

export const pairFieldsQuery = gql`
  fragment pairFields on Pair {
    id
    reserveUSD
    reserveBNB
    volumeUSD
    untrackedVolumeUSD
    trackedReserveBNB
    token0 {
      ...pairTokenFields
    }
    token1 {
      ...pairTokenFields
    }
    reserve0
    reserve1
    token0Price
    token1Price
    totalSupply
    txCount
    timestamp
  }
  ${pairTokenFieldsQuery}
`

export const pairSubsetQuery = gql`
  query pairSubsetQuery(
    $first: Int! = 1000
    $pairAddresses: [Bytes]!
    $orderBy: String! = "trackedReserveBNB"
    $orderDirection: String! = "desc"
  ) {
    pairs(
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: { id_in: $pairAddresses }
    ) {
      ...pairFields
    }
  }
  ${pairFieldsQuery}
`
