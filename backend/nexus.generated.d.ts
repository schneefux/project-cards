/**
 * This file was automatically generated by GraphQL Nexus
 * Do not make changes to this file directly
 */

import * as Context from "./src/context"
import * as photon from "@prisma/photon"



declare global {
  interface NexusGenCustomOutputProperties<TypeName extends string> {
    crud: NexusPrisma<TypeName, 'crud'>
    model: NexusPrisma<TypeName, 'model'>
  }
}

declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  GameCreateManyWithoutGamesInput: { // input type
    connect?: NexusGenInputs['GameWhereUniqueInput'][] | null; // [GameWhereUniqueInput!]
    create?: NexusGenInputs['GameCreateWithoutPackInput'][] | null; // [GameCreateWithoutPackInput!]
  }
  GameCreateOneWithoutGameInput: { // input type
    connect?: NexusGenInputs['GameWhereUniqueInput'] | null; // GameWhereUniqueInput
    create?: NexusGenInputs['GameCreateWithoutPilesInput'] | null; // GameCreateWithoutPilesInput
  }
  GameCreateWithoutPackInput: { // input type
    hands?: NexusGenInputs['GameHandCreateManyWithoutHandsInput'] | null; // GameHandCreateManyWithoutHandsInput
    id?: string | null; // ID
    piles?: NexusGenInputs['GamePileCreateManyWithoutPilesInput'] | null; // GamePileCreateManyWithoutPilesInput
    state: NexusGenEnums['GameState']; // GameState!
  }
  GameCreateWithoutPilesInput: { // input type
    hands?: NexusGenInputs['GameHandCreateManyWithoutHandsInput'] | null; // GameHandCreateManyWithoutHandsInput
    id?: string | null; // ID
    pack: NexusGenInputs['TrumpPackCreateOneWithoutPackInput']; // TrumpPackCreateOneWithoutPackInput!
    state: NexusGenEnums['GameState']; // GameState!
  }
  GameHandCreateManyWithoutGameHandsInput: { // input type
    connect?: NexusGenInputs['GameHandWhereUniqueInput'][] | null; // [GameHandWhereUniqueInput!]
    create?: NexusGenInputs['GameHandCreateWithoutPlayerInput'][] | null; // [GameHandCreateWithoutPlayerInput!]
  }
  GameHandCreateManyWithoutHandsInput: { // input type
    connect?: NexusGenInputs['GameHandWhereUniqueInput'][] | null; // [GameHandWhereUniqueInput!]
    create?: NexusGenInputs['GameHandCreateWithoutGameInput'][] | null; // [GameHandCreateWithoutGameInput!]
  }
  GameHandCreateOneWithoutHandInput: { // input type
    connect?: NexusGenInputs['GameHandWhereUniqueInput'] | null; // GameHandWhereUniqueInput
    create?: NexusGenInputs['GameHandCreateWithoutPilesInput'] | null; // GameHandCreateWithoutPilesInput
  }
  GameHandCreateWithoutGameInput: { // input type
    atTurn: boolean; // Boolean!
    id?: string | null; // ID
    piles?: NexusGenInputs['GameHandPileCreateManyWithoutPilesInput'] | null; // GameHandPileCreateManyWithoutPilesInput
    player: NexusGenInputs['UserCreateOneWithoutPlayerInput']; // UserCreateOneWithoutPlayerInput!
    score: number; // Int!
  }
  GameHandCreateWithoutPilesInput: { // input type
    atTurn: boolean; // Boolean!
    game: NexusGenInputs['GameCreateOneWithoutGameInput']; // GameCreateOneWithoutGameInput!
    id?: string | null; // ID
    player: NexusGenInputs['UserCreateOneWithoutPlayerInput']; // UserCreateOneWithoutPlayerInput!
    score: number; // Int!
  }
  GameHandCreateWithoutPlayerInput: { // input type
    atTurn: boolean; // Boolean!
    game: NexusGenInputs['GameCreateOneWithoutGameInput']; // GameCreateOneWithoutGameInput!
    id?: string | null; // ID
    piles?: NexusGenInputs['GameHandPileCreateManyWithoutPilesInput'] | null; // GameHandPileCreateManyWithoutPilesInput
    score: number; // Int!
  }
  GameHandPileCreateManyWithoutHandPilesInput: { // input type
    connect?: NexusGenInputs['GameHandPileWhereUniqueInput'][] | null; // [GameHandPileWhereUniqueInput!]
    create?: NexusGenInputs['GameHandPileCreateWithoutPileCardsInput'][] | null; // [GameHandPileCreateWithoutPileCardsInput!]
  }
  GameHandPileCreateManyWithoutPilesInput: { // input type
    connect?: NexusGenInputs['GameHandPileWhereUniqueInput'][] | null; // [GameHandPileWhereUniqueInput!]
    create?: NexusGenInputs['GameHandPileCreateWithoutHandInput'][] | null; // [GameHandPileCreateWithoutHandInput!]
  }
  GameHandPileCreateWithoutHandInput: { // input type
    id?: string | null; // ID
    name: string; // String!
    pileCards?: NexusGenInputs['GamePileCardCreateManyWithoutPileCardsInput'] | null; // GamePileCardCreateManyWithoutPileCardsInput
  }
  GameHandPileCreateWithoutPileCardsInput: { // input type
    hand: NexusGenInputs['GameHandCreateOneWithoutHandInput']; // GameHandCreateOneWithoutHandInput!
    id?: string | null; // ID
    name: string; // String!
  }
  GameHandPileWhereUniqueInput: { // input type
    id?: string | null; // ID
  }
  GameHandWhereUniqueInput: { // input type
    id?: string | null; // ID
  }
  GamePileCardCreateManyWithoutPileCardsInput: { // input type
    connect?: NexusGenInputs['GamePileCardWhereUniqueInput'][] | null; // [GamePileCardWhereUniqueInput!]
    create?: NexusGenInputs['GamePileCardCreateWithoutCardInput'][] | null; // [GamePileCardCreateWithoutCardInput!]
  }
  GamePileCardCreateWithoutCardInput: { // input type
    handPiles?: NexusGenInputs['GameHandPileCreateManyWithoutHandPilesInput'] | null; // GameHandPileCreateManyWithoutHandPilesInput
    id?: string | null; // ID
    index?: number | null; // Int
    piles?: NexusGenInputs['GamePileCreateManyWithoutPilesInput'] | null; // GamePileCreateManyWithoutPilesInput
  }
  GamePileCardWhereUniqueInput: { // input type
    id?: string | null; // ID
  }
  GamePileCreateManyWithoutPilesInput: { // input type
    connect?: NexusGenInputs['GamePileWhereUniqueInput'][] | null; // [GamePileWhereUniqueInput!]
    create?: NexusGenInputs['GamePileCreateWithoutPileCardsInput'][] | null; // [GamePileCreateWithoutPileCardsInput!]
  }
  GamePileCreateWithoutPileCardsInput: { // input type
    game: NexusGenInputs['GameCreateOneWithoutGameInput']; // GameCreateOneWithoutGameInput!
    id?: string | null; // ID
    name: string; // String!
  }
  GamePileWhereUniqueInput: { // input type
    id?: string | null; // ID
  }
  GameWhereUniqueInput: { // input type
    id?: string | null; // ID
  }
  QueryGamesWhereInput: { // input type
    state?: NexusGenEnums['GameState'] | null; // GameState
  }
  QueryTrumpPacksOrderByInput: { // input type
    createdAt?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
  }
  TrumpCardCreateInput: { // input type
    description: string; // String!
    id?: string | null; // ID
    imageUrl?: string | null; // String
    name: string; // String!
    pack: NexusGenInputs['TrumpPackCreateOneWithoutPackInput']; // TrumpPackCreateOneWithoutPackInput!
    pileCards?: NexusGenInputs['GamePileCardCreateManyWithoutPileCardsInput'] | null; // GamePileCardCreateManyWithoutPileCardsInput
    points: number; // Int!
  }
  TrumpCardCreateManyWithoutCardsInput: { // input type
    connect?: NexusGenInputs['TrumpCardWhereUniqueInput'][] | null; // [TrumpCardWhereUniqueInput!]
    create?: NexusGenInputs['TrumpCardCreateWithoutPackInput'][] | null; // [TrumpCardCreateWithoutPackInput!]
  }
  TrumpCardCreateWithoutPackInput: { // input type
    description: string; // String!
    id?: string | null; // ID
    imageUrl?: string | null; // String
    name: string; // String!
    pileCards?: NexusGenInputs['GamePileCardCreateManyWithoutPileCardsInput'] | null; // GamePileCardCreateManyWithoutPileCardsInput
    points: number; // Int!
  }
  TrumpCardWhereUniqueInput: { // input type
    id?: string | null; // ID
  }
  TrumpPackCreateInput: { // input type
    author: NexusGenInputs['UserCreateOneWithoutAuthorInput']; // UserCreateOneWithoutAuthorInput!
    cards?: NexusGenInputs['TrumpCardCreateManyWithoutCardsInput'] | null; // TrumpCardCreateManyWithoutCardsInput
    createdAt?: any | null; // DateTime
    description: string; // String!
    games?: NexusGenInputs['GameCreateManyWithoutGamesInput'] | null; // GameCreateManyWithoutGamesInput
    id?: string | null; // ID
    name: string; // String!
    updatedAt?: any | null; // DateTime
  }
  TrumpPackCreateManyWithoutTrumpPacksInput: { // input type
    connect?: NexusGenInputs['TrumpPackWhereUniqueInput'][] | null; // [TrumpPackWhereUniqueInput!]
    create?: NexusGenInputs['TrumpPackCreateWithoutAuthorInput'][] | null; // [TrumpPackCreateWithoutAuthorInput!]
  }
  TrumpPackCreateOneWithoutPackInput: { // input type
    connect?: NexusGenInputs['TrumpPackWhereUniqueInput'] | null; // TrumpPackWhereUniqueInput
    create?: NexusGenInputs['TrumpPackCreateWithoutGamesInput'] | null; // TrumpPackCreateWithoutGamesInput
  }
  TrumpPackCreateWithoutAuthorInput: { // input type
    cards?: NexusGenInputs['TrumpCardCreateManyWithoutCardsInput'] | null; // TrumpCardCreateManyWithoutCardsInput
    createdAt?: any | null; // DateTime
    description: string; // String!
    games?: NexusGenInputs['GameCreateManyWithoutGamesInput'] | null; // GameCreateManyWithoutGamesInput
    id?: string | null; // ID
    name: string; // String!
    updatedAt?: any | null; // DateTime
  }
  TrumpPackCreateWithoutGamesInput: { // input type
    author: NexusGenInputs['UserCreateOneWithoutAuthorInput']; // UserCreateOneWithoutAuthorInput!
    cards?: NexusGenInputs['TrumpCardCreateManyWithoutCardsInput'] | null; // TrumpCardCreateManyWithoutCardsInput
    createdAt?: any | null; // DateTime
    description: string; // String!
    id?: string | null; // ID
    name: string; // String!
    updatedAt?: any | null; // DateTime
  }
  TrumpPackWhereUniqueInput: { // input type
    id?: string | null; // ID
  }
  UserCreateOneWithoutAuthorInput: { // input type
    connect?: NexusGenInputs['UserWhereUniqueInput'] | null; // UserWhereUniqueInput
    create?: NexusGenInputs['UserCreateWithoutTrumpPacksInput'] | null; // UserCreateWithoutTrumpPacksInput
  }
  UserCreateOneWithoutPlayerInput: { // input type
    connect?: NexusGenInputs['UserWhereUniqueInput'] | null; // UserWhereUniqueInput
    create?: NexusGenInputs['UserCreateWithoutGameHandsInput'] | null; // UserCreateWithoutGameHandsInput
  }
  UserCreateWithoutGameHandsInput: { // input type
    email?: string | null; // String
    id?: string | null; // ID
    name: string; // String!
    password?: string | null; // String
    subscriptionTier: NexusGenEnums['SubscriptionTier']; // SubscriptionTier!
    trumpPacks?: NexusGenInputs['TrumpPackCreateManyWithoutTrumpPacksInput'] | null; // TrumpPackCreateManyWithoutTrumpPacksInput
  }
  UserCreateWithoutTrumpPacksInput: { // input type
    email?: string | null; // String
    gameHands?: NexusGenInputs['GameHandCreateManyWithoutGameHandsInput'] | null; // GameHandCreateManyWithoutGameHandsInput
    id?: string | null; // ID
    name: string; // String!
    password?: string | null; // String
    subscriptionTier: NexusGenEnums['SubscriptionTier']; // SubscriptionTier!
  }
  UserWhereUniqueInput: { // input type
    email?: string | null; // String
    id?: string | null; // ID
  }
}

export interface NexusGenEnums {
  GameState: photon.GameState
  OrderByArg: photon.OrderByArg
  SubscriptionTier: photon.SubscriptionTier
}

export interface NexusGenRootTypes {
  Game: photon.Game;
  GameHand: photon.GameHand;
  GameHandPile: photon.GameHandPile;
  GamePile: photon.GamePile;
  GamePileCard: photon.GamePileCard;
  LoginResponse: { // root type
    token: string; // String!
    user: NexusGenRootTypes['User']; // User!
  }
  Mutation: {};
  Query: {};
  Subscription: { // root type
    createdGame: NexusGenRootTypes['Game']; // Game!
    updatedGame: NexusGenRootTypes['Game']; // Game!
  }
  TrumpCard: photon.TrumpCard;
  TrumpPack: photon.TrumpPack;
  User: photon.User;
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
  DateTime: any;
  Upload: any;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  GameCreateManyWithoutGamesInput: NexusGenInputs['GameCreateManyWithoutGamesInput'];
  GameCreateOneWithoutGameInput: NexusGenInputs['GameCreateOneWithoutGameInput'];
  GameCreateWithoutPackInput: NexusGenInputs['GameCreateWithoutPackInput'];
  GameCreateWithoutPilesInput: NexusGenInputs['GameCreateWithoutPilesInput'];
  GameHandCreateManyWithoutGameHandsInput: NexusGenInputs['GameHandCreateManyWithoutGameHandsInput'];
  GameHandCreateManyWithoutHandsInput: NexusGenInputs['GameHandCreateManyWithoutHandsInput'];
  GameHandCreateOneWithoutHandInput: NexusGenInputs['GameHandCreateOneWithoutHandInput'];
  GameHandCreateWithoutGameInput: NexusGenInputs['GameHandCreateWithoutGameInput'];
  GameHandCreateWithoutPilesInput: NexusGenInputs['GameHandCreateWithoutPilesInput'];
  GameHandCreateWithoutPlayerInput: NexusGenInputs['GameHandCreateWithoutPlayerInput'];
  GameHandPileCreateManyWithoutHandPilesInput: NexusGenInputs['GameHandPileCreateManyWithoutHandPilesInput'];
  GameHandPileCreateManyWithoutPilesInput: NexusGenInputs['GameHandPileCreateManyWithoutPilesInput'];
  GameHandPileCreateWithoutHandInput: NexusGenInputs['GameHandPileCreateWithoutHandInput'];
  GameHandPileCreateWithoutPileCardsInput: NexusGenInputs['GameHandPileCreateWithoutPileCardsInput'];
  GameHandPileWhereUniqueInput: NexusGenInputs['GameHandPileWhereUniqueInput'];
  GameHandWhereUniqueInput: NexusGenInputs['GameHandWhereUniqueInput'];
  GamePileCardCreateManyWithoutPileCardsInput: NexusGenInputs['GamePileCardCreateManyWithoutPileCardsInput'];
  GamePileCardCreateWithoutCardInput: NexusGenInputs['GamePileCardCreateWithoutCardInput'];
  GamePileCardWhereUniqueInput: NexusGenInputs['GamePileCardWhereUniqueInput'];
  GamePileCreateManyWithoutPilesInput: NexusGenInputs['GamePileCreateManyWithoutPilesInput'];
  GamePileCreateWithoutPileCardsInput: NexusGenInputs['GamePileCreateWithoutPileCardsInput'];
  GamePileWhereUniqueInput: NexusGenInputs['GamePileWhereUniqueInput'];
  GameWhereUniqueInput: NexusGenInputs['GameWhereUniqueInput'];
  QueryGamesWhereInput: NexusGenInputs['QueryGamesWhereInput'];
  QueryTrumpPacksOrderByInput: NexusGenInputs['QueryTrumpPacksOrderByInput'];
  TrumpCardCreateInput: NexusGenInputs['TrumpCardCreateInput'];
  TrumpCardCreateManyWithoutCardsInput: NexusGenInputs['TrumpCardCreateManyWithoutCardsInput'];
  TrumpCardCreateWithoutPackInput: NexusGenInputs['TrumpCardCreateWithoutPackInput'];
  TrumpCardWhereUniqueInput: NexusGenInputs['TrumpCardWhereUniqueInput'];
  TrumpPackCreateInput: NexusGenInputs['TrumpPackCreateInput'];
  TrumpPackCreateManyWithoutTrumpPacksInput: NexusGenInputs['TrumpPackCreateManyWithoutTrumpPacksInput'];
  TrumpPackCreateOneWithoutPackInput: NexusGenInputs['TrumpPackCreateOneWithoutPackInput'];
  TrumpPackCreateWithoutAuthorInput: NexusGenInputs['TrumpPackCreateWithoutAuthorInput'];
  TrumpPackCreateWithoutGamesInput: NexusGenInputs['TrumpPackCreateWithoutGamesInput'];
  TrumpPackWhereUniqueInput: NexusGenInputs['TrumpPackWhereUniqueInput'];
  UserCreateOneWithoutAuthorInput: NexusGenInputs['UserCreateOneWithoutAuthorInput'];
  UserCreateOneWithoutPlayerInput: NexusGenInputs['UserCreateOneWithoutPlayerInput'];
  UserCreateWithoutGameHandsInput: NexusGenInputs['UserCreateWithoutGameHandsInput'];
  UserCreateWithoutTrumpPacksInput: NexusGenInputs['UserCreateWithoutTrumpPacksInput'];
  UserWhereUniqueInput: NexusGenInputs['UserWhereUniqueInput'];
  GameState: NexusGenEnums['GameState'];
  OrderByArg: NexusGenEnums['OrderByArg'];
  SubscriptionTier: NexusGenEnums['SubscriptionTier'];
}

export interface NexusGenFieldTypes {
  Game: { // field return type
    hands: NexusGenRootTypes['GameHand'][]; // [GameHand!]!
    id: string; // ID!
    pack: NexusGenRootTypes['TrumpPack']; // TrumpPack!
    piles: NexusGenRootTypes['GamePile'][]; // [GamePile!]!
    state: NexusGenEnums['GameState']; // GameState!
  }
  GameHand: { // field return type
    atTurn: boolean; // Boolean!
    game: NexusGenRootTypes['Game']; // Game!
    id: string; // ID!
    piles: NexusGenRootTypes['GameHandPile'][]; // [GameHandPile!]!
    player: NexusGenRootTypes['User']; // User!
    score: number; // Int!
  }
  GameHandPile: { // field return type
    hand: NexusGenRootTypes['GameHand']; // GameHand!
    id: string; // ID!
    name: string; // String!
    pileCards: NexusGenRootTypes['GamePileCard'][]; // [GamePileCard!]!
  }
  GamePile: { // field return type
    game: NexusGenRootTypes['Game']; // Game!
    id: string; // ID!
    name: string; // String!
    pileCards: NexusGenRootTypes['GamePileCard'][]; // [GamePileCard!]!
  }
  GamePileCard: { // field return type
    card: NexusGenRootTypes['TrumpCard']; // TrumpCard!
    id: string; // ID!
    index: number | null; // Int
  }
  LoginResponse: { // field return type
    token: string; // String!
    user: NexusGenRootTypes['User']; // User!
  }
  Mutation: { // field return type
    bidGoofenspiel: boolean; // Boolean!
    createGoofenspiel: string; // ID!
    createOneTrumpCard: NexusGenRootTypes['TrumpCard']; // TrumpCard!
    createOneTrumpPack: NexusGenRootTypes['TrumpPack']; // TrumpPack!
    joinGoofenspiel: boolean; // Boolean!
    login: NexusGenRootTypes['LoginResponse'] | null; // LoginResponse
    register: NexusGenRootTypes['LoginResponse'] | null; // LoginResponse
    registerGuest: NexusGenRootTypes['LoginResponse']; // LoginResponse!
    uploadTrumpCardImage: boolean; // Boolean!
  }
  Query: { // field return type
    game: NexusGenRootTypes['Game'] | null; // Game
    games: NexusGenRootTypes['Game'][]; // [Game!]!
    me: NexusGenRootTypes['User'] | null; // User
    trumpPack: NexusGenRootTypes['TrumpPack'] | null; // TrumpPack
    trumpPacks: NexusGenRootTypes['TrumpPack'][]; // [TrumpPack!]!
    user: NexusGenRootTypes['User'] | null; // User
    users: NexusGenRootTypes['User'][]; // [User!]!
  }
  Subscription: { // field return type
    createdGame: NexusGenRootTypes['Game']; // Game!
    updatedGame: NexusGenRootTypes['Game']; // Game!
  }
  TrumpCard: { // field return type
    description: string; // String!
    id: string; // ID!
    imageUrl: string | null; // String
    name: string; // String!
    pack: NexusGenRootTypes['TrumpPack']; // TrumpPack!
    points: number; // Int!
  }
  TrumpPack: { // field return type
    author: NexusGenRootTypes['User']; // User!
    cards: NexusGenRootTypes['TrumpCard'][]; // [TrumpCard!]!
    createdAt: any; // DateTime!
    description: string; // String!
    id: string; // ID!
    name: string; // String!
    updatedAt: any; // DateTime!
  }
  User: { // field return type
    email: string | null; // String
    gameHands: NexusGenRootTypes['GameHand'][]; // [GameHand!]!
    id: string; // ID!
    name: string; // String!
    subscriptionTier: NexusGenEnums['SubscriptionTier']; // SubscriptionTier!
    trumpPacks: NexusGenRootTypes['TrumpPack'][]; // [TrumpPack!]!
  }
}

export interface NexusGenArgTypes {
  Game: {
    hands: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
    piles: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
  }
  GameHand: {
    piles: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
  }
  GameHandPile: {
    pileCards: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
  }
  GamePile: {
    pileCards: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
  }
  Mutation: {
    bidGoofenspiel: { // args
      gameId: string; // ID!
      pileCardId: string; // ID!
    }
    createGoofenspiel: { // args
      pack: string; // ID!
    }
    createOneTrumpCard: { // args
      data: NexusGenInputs['TrumpCardCreateInput']; // TrumpCardCreateInput!
    }
    createOneTrumpPack: { // args
      data: NexusGenInputs['TrumpPackCreateInput']; // TrumpPackCreateInput!
    }
    joinGoofenspiel: { // args
      gameId: string; // ID!
    }
    login: { // args
      email: string; // String!
      password: string; // String!
    }
    register: { // args
      email: string; // String!
      name: string; // String!
      password: string; // String!
    }
    registerGuest: { // args
      name: string; // String!
    }
    uploadTrumpCardImage: { // args
      cardId: string; // ID!
      file?: any | null; // Upload
    }
  }
  Query: {
    game: { // args
      where: NexusGenInputs['GameWhereUniqueInput']; // GameWhereUniqueInput!
    }
    games: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
      where?: NexusGenInputs['QueryGamesWhereInput'] | null; // QueryGamesWhereInput
    }
    trumpPack: { // args
      where: NexusGenInputs['TrumpPackWhereUniqueInput']; // TrumpPackWhereUniqueInput!
    }
    trumpPacks: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      first?: number | null; // Int
      last?: number | null; // Int
      orderBy?: NexusGenInputs['QueryTrumpPacksOrderByInput'] | null; // QueryTrumpPacksOrderByInput
      skip?: number | null; // Int
    }
    user: { // args
      where: NexusGenInputs['UserWhereUniqueInput']; // UserWhereUniqueInput!
    }
    users: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
  }
  Subscription: {
    updatedGame: { // args
      id: string; // ID!
    }
  }
  TrumpPack: {
    cards: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
  }
  User: {
    gameHands: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
    trumpPacks: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "Game" | "GameHand" | "GameHandPile" | "GamePile" | "GamePileCard" | "LoginResponse" | "Mutation" | "Query" | "Subscription" | "TrumpCard" | "TrumpPack" | "User";

export type NexusGenInputNames = "GameCreateManyWithoutGamesInput" | "GameCreateOneWithoutGameInput" | "GameCreateWithoutPackInput" | "GameCreateWithoutPilesInput" | "GameHandCreateManyWithoutGameHandsInput" | "GameHandCreateManyWithoutHandsInput" | "GameHandCreateOneWithoutHandInput" | "GameHandCreateWithoutGameInput" | "GameHandCreateWithoutPilesInput" | "GameHandCreateWithoutPlayerInput" | "GameHandPileCreateManyWithoutHandPilesInput" | "GameHandPileCreateManyWithoutPilesInput" | "GameHandPileCreateWithoutHandInput" | "GameHandPileCreateWithoutPileCardsInput" | "GameHandPileWhereUniqueInput" | "GameHandWhereUniqueInput" | "GamePileCardCreateManyWithoutPileCardsInput" | "GamePileCardCreateWithoutCardInput" | "GamePileCardWhereUniqueInput" | "GamePileCreateManyWithoutPilesInput" | "GamePileCreateWithoutPileCardsInput" | "GamePileWhereUniqueInput" | "GameWhereUniqueInput" | "QueryGamesWhereInput" | "QueryTrumpPacksOrderByInput" | "TrumpCardCreateInput" | "TrumpCardCreateManyWithoutCardsInput" | "TrumpCardCreateWithoutPackInput" | "TrumpCardWhereUniqueInput" | "TrumpPackCreateInput" | "TrumpPackCreateManyWithoutTrumpPacksInput" | "TrumpPackCreateOneWithoutPackInput" | "TrumpPackCreateWithoutAuthorInput" | "TrumpPackCreateWithoutGamesInput" | "TrumpPackWhereUniqueInput" | "UserCreateOneWithoutAuthorInput" | "UserCreateOneWithoutPlayerInput" | "UserCreateWithoutGameHandsInput" | "UserCreateWithoutTrumpPacksInput" | "UserWhereUniqueInput";

export type NexusGenEnumNames = "GameState" | "OrderByArg" | "SubscriptionTier";

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = "Boolean" | "DateTime" | "Float" | "ID" | "Int" | "String" | "Upload";

export type NexusGenUnionNames = never;

export interface NexusGenTypes {
  context: Context.Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  allTypes: NexusGenAllTypes;
  inheritedFields: NexusGenInheritedFields;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
}