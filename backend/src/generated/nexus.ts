/**
 * This file was automatically generated by GraphQL Nexus
 * Do not make changes to this file directly
 */

import * as Context from "../context"
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
  TrumpAttributeCreateInput: { // input type
    aimHigh?: boolean | null; // Boolean
    id?: string | null; // ID
    name: string; // String!
    trumpAttributeValues?: NexusGenInputs['TrumpAttributeValueCreateManyWithoutTrumpAttributeValuesInput'] | null; // TrumpAttributeValueCreateManyWithoutTrumpAttributeValuesInput
    trumpPack?: NexusGenInputs['TrumpPackCreateOneWithoutTrumpPackInput'] | null; // TrumpPackCreateOneWithoutTrumpPackInput
  }
  TrumpAttributeCreateManyWithoutAttributesInput: { // input type
    connect?: NexusGenInputs['TrumpAttributeWhereUniqueInput'][] | null; // [TrumpAttributeWhereUniqueInput!]
    create?: NexusGenInputs['TrumpAttributeCreateWithoutTrumpPackInput'][] | null; // [TrumpAttributeCreateWithoutTrumpPackInput!]
  }
  TrumpAttributeCreateOneWithoutAttributeInput: { // input type
    connect?: NexusGenInputs['TrumpAttributeWhereUniqueInput'] | null; // TrumpAttributeWhereUniqueInput
    create?: NexusGenInputs['TrumpAttributeCreateWithoutTrumpAttributeValuesInput'] | null; // TrumpAttributeCreateWithoutTrumpAttributeValuesInput
  }
  TrumpAttributeCreateWithoutTrumpAttributeValuesInput: { // input type
    aimHigh?: boolean | null; // Boolean
    id?: string | null; // ID
    name: string; // String!
    trumpPack?: NexusGenInputs['TrumpPackCreateOneWithoutTrumpPackInput'] | null; // TrumpPackCreateOneWithoutTrumpPackInput
  }
  TrumpAttributeCreateWithoutTrumpPackInput: { // input type
    aimHigh?: boolean | null; // Boolean
    id?: string | null; // ID
    name: string; // String!
    trumpAttributeValues?: NexusGenInputs['TrumpAttributeValueCreateManyWithoutTrumpAttributeValuesInput'] | null; // TrumpAttributeValueCreateManyWithoutTrumpAttributeValuesInput
  }
  TrumpAttributeValueCreateManyWithoutAttributeValuesInput: { // input type
    connect?: NexusGenInputs['TrumpAttributeValueWhereUniqueInput'][] | null; // [TrumpAttributeValueWhereUniqueInput!]
    create?: NexusGenInputs['TrumpAttributeValueCreateWithoutTrumpCardInput'][] | null; // [TrumpAttributeValueCreateWithoutTrumpCardInput!]
  }
  TrumpAttributeValueCreateManyWithoutTrumpAttributeValuesInput: { // input type
    connect?: NexusGenInputs['TrumpAttributeValueWhereUniqueInput'][] | null; // [TrumpAttributeValueWhereUniqueInput!]
    create?: NexusGenInputs['TrumpAttributeValueCreateWithoutAttributeInput'][] | null; // [TrumpAttributeValueCreateWithoutAttributeInput!]
  }
  TrumpAttributeValueCreateWithoutAttributeInput: { // input type
    id?: string | null; // ID
    trumpCard?: NexusGenInputs['TrumpCardCreateOneWithoutTrumpCardInput'] | null; // TrumpCardCreateOneWithoutTrumpCardInput
    value: number; // Float!
  }
  TrumpAttributeValueCreateWithoutTrumpCardInput: { // input type
    attribute: NexusGenInputs['TrumpAttributeCreateOneWithoutAttributeInput']; // TrumpAttributeCreateOneWithoutAttributeInput!
    id?: string | null; // ID
    value: number; // Float!
  }
  TrumpAttributeValueWhereUniqueInput: { // input type
    id?: string | null; // ID
  }
  TrumpAttributeWhereUniqueInput: { // input type
    id?: string | null; // ID
  }
  TrumpCardCreateInput: { // input type
    attributeValues?: NexusGenInputs['TrumpAttributeValueCreateManyWithoutAttributeValuesInput'] | null; // TrumpAttributeValueCreateManyWithoutAttributeValuesInput
    description?: string | null; // String
    id?: string | null; // ID
    imageUrl?: string | null; // String
    name: string; // String!
    trumpPack?: NexusGenInputs['TrumpPackCreateOneWithoutTrumpPackInput'] | null; // TrumpPackCreateOneWithoutTrumpPackInput
  }
  TrumpCardCreateManyWithoutCardsInput: { // input type
    connect?: NexusGenInputs['TrumpCardWhereUniqueInput'][] | null; // [TrumpCardWhereUniqueInput!]
    create?: NexusGenInputs['TrumpCardCreateWithoutTrumpPackInput'][] | null; // [TrumpCardCreateWithoutTrumpPackInput!]
  }
  TrumpCardCreateOneWithoutTrumpCardInput: { // input type
    connect?: NexusGenInputs['TrumpCardWhereUniqueInput'] | null; // TrumpCardWhereUniqueInput
    create?: NexusGenInputs['TrumpCardCreateWithoutAttributeValuesInput'] | null; // TrumpCardCreateWithoutAttributeValuesInput
  }
  TrumpCardCreateWithoutAttributeValuesInput: { // input type
    description?: string | null; // String
    id?: string | null; // ID
    imageUrl?: string | null; // String
    name: string; // String!
    trumpPack?: NexusGenInputs['TrumpPackCreateOneWithoutTrumpPackInput'] | null; // TrumpPackCreateOneWithoutTrumpPackInput
  }
  TrumpCardCreateWithoutTrumpPackInput: { // input type
    attributeValues?: NexusGenInputs['TrumpAttributeValueCreateManyWithoutAttributeValuesInput'] | null; // TrumpAttributeValueCreateManyWithoutAttributeValuesInput
    description?: string | null; // String
    id?: string | null; // ID
    imageUrl?: string | null; // String
    name: string; // String!
  }
  TrumpCardWhereUniqueInput: { // input type
    id?: string | null; // ID
  }
  TrumpGameCreateManyWithoutTrumpGamesAtTurnInput: { // input type
    connect?: NexusGenInputs['TrumpGameWhereUniqueInput'][] | null; // [TrumpGameWhereUniqueInput!]
    create?: NexusGenInputs['TrumpGameCreateWithoutUserAtTurnInput'][] | null; // [TrumpGameCreateWithoutUserAtTurnInput!]
  }
  TrumpGameCreateManyWithoutTrumpGamesInput: { // input type
    connect?: NexusGenInputs['TrumpGameWhereUniqueInput'][] | null; // [TrumpGameWhereUniqueInput!]
    create?: NexusGenInputs['TrumpGameCreateWithoutPackInput'][] | null; // [TrumpGameCreateWithoutPackInput!]
  }
  TrumpGameCreateWithoutPackInput: { // input type
    id?: string | null; // ID
    userAtTurn: NexusGenInputs['TrumpPlayerCreateOneWithoutUserAtTurnInput']; // TrumpPlayerCreateOneWithoutUserAtTurnInput!
    users?: NexusGenInputs['TrumpPlayerCreateManyWithoutUsersInput'] | null; // TrumpPlayerCreateManyWithoutUsersInput
  }
  TrumpGameCreateWithoutUserAtTurnInput: { // input type
    id?: string | null; // ID
    pack: NexusGenInputs['TrumpPackCreateOneWithoutPackInput']; // TrumpPackCreateOneWithoutPackInput!
    users?: NexusGenInputs['TrumpPlayerCreateManyWithoutUsersInput'] | null; // TrumpPlayerCreateManyWithoutUsersInput
  }
  TrumpGameWhereUniqueInput: { // input type
    id?: string | null; // ID
  }
  TrumpPackCreateInput: { // input type
    attributes?: NexusGenInputs['TrumpAttributeCreateManyWithoutAttributesInput'] | null; // TrumpAttributeCreateManyWithoutAttributesInput
    cards?: NexusGenInputs['TrumpCardCreateManyWithoutCardsInput'] | null; // TrumpCardCreateManyWithoutCardsInput
    createdAt?: any | null; // DateTime
    id?: string | null; // ID
    name: string; // String!
    trumpGames?: NexusGenInputs['TrumpGameCreateManyWithoutTrumpGamesInput'] | null; // TrumpGameCreateManyWithoutTrumpGamesInput
    trumpPlayer?: NexusGenInputs['TrumpPlayerCreateOneWithoutTrumpPlayerInput'] | null; // TrumpPlayerCreateOneWithoutTrumpPlayerInput
    updatedAt?: any | null; // DateTime
  }
  TrumpPackCreateManyWithoutTrumpPacksInput: { // input type
    connect?: NexusGenInputs['TrumpPackWhereUniqueInput'][] | null; // [TrumpPackWhereUniqueInput!]
    create?: NexusGenInputs['TrumpPackCreateWithoutTrumpPlayerInput'][] | null; // [TrumpPackCreateWithoutTrumpPlayerInput!]
  }
  TrumpPackCreateOneWithoutPackInput: { // input type
    connect?: NexusGenInputs['TrumpPackWhereUniqueInput'] | null; // TrumpPackWhereUniqueInput
    create?: NexusGenInputs['TrumpPackCreateWithoutTrumpGamesInput'] | null; // TrumpPackCreateWithoutTrumpGamesInput
  }
  TrumpPackCreateOneWithoutTrumpPackInput: { // input type
    connect?: NexusGenInputs['TrumpPackWhereUniqueInput'] | null; // TrumpPackWhereUniqueInput
    create?: NexusGenInputs['TrumpPackCreateWithoutAttributesInput'] | null; // TrumpPackCreateWithoutAttributesInput
  }
  TrumpPackCreateWithoutAttributesInput: { // input type
    cards?: NexusGenInputs['TrumpCardCreateManyWithoutCardsInput'] | null; // TrumpCardCreateManyWithoutCardsInput
    createdAt?: any | null; // DateTime
    id?: string | null; // ID
    name: string; // String!
    trumpGames?: NexusGenInputs['TrumpGameCreateManyWithoutTrumpGamesInput'] | null; // TrumpGameCreateManyWithoutTrumpGamesInput
    trumpPlayer?: NexusGenInputs['TrumpPlayerCreateOneWithoutTrumpPlayerInput'] | null; // TrumpPlayerCreateOneWithoutTrumpPlayerInput
    updatedAt?: any | null; // DateTime
  }
  TrumpPackCreateWithoutTrumpGamesInput: { // input type
    attributes?: NexusGenInputs['TrumpAttributeCreateManyWithoutAttributesInput'] | null; // TrumpAttributeCreateManyWithoutAttributesInput
    cards?: NexusGenInputs['TrumpCardCreateManyWithoutCardsInput'] | null; // TrumpCardCreateManyWithoutCardsInput
    createdAt?: any | null; // DateTime
    id?: string | null; // ID
    name: string; // String!
    trumpPlayer?: NexusGenInputs['TrumpPlayerCreateOneWithoutTrumpPlayerInput'] | null; // TrumpPlayerCreateOneWithoutTrumpPlayerInput
    updatedAt?: any | null; // DateTime
  }
  TrumpPackCreateWithoutTrumpPlayerInput: { // input type
    attributes?: NexusGenInputs['TrumpAttributeCreateManyWithoutAttributesInput'] | null; // TrumpAttributeCreateManyWithoutAttributesInput
    cards?: NexusGenInputs['TrumpCardCreateManyWithoutCardsInput'] | null; // TrumpCardCreateManyWithoutCardsInput
    createdAt?: any | null; // DateTime
    id?: string | null; // ID
    name: string; // String!
    trumpGames?: NexusGenInputs['TrumpGameCreateManyWithoutTrumpGamesInput'] | null; // TrumpGameCreateManyWithoutTrumpGamesInput
    updatedAt?: any | null; // DateTime
  }
  TrumpPackWhereUniqueInput: { // input type
    id?: string | null; // ID
    name?: string | null; // String
  }
  TrumpPlayerCreateManyWithoutUsersInput: { // input type
    connect?: NexusGenInputs['TrumpPlayerWhereUniqueInput'][] | null; // [TrumpPlayerWhereUniqueInput!]
    create?: NexusGenInputs['TrumpPlayerCreateWithoutTrumpGamesInput'][] | null; // [TrumpPlayerCreateWithoutTrumpGamesInput!]
  }
  TrumpPlayerCreateOneWithoutTrumpPlayerInput: { // input type
    connect?: NexusGenInputs['TrumpPlayerWhereUniqueInput'] | null; // TrumpPlayerWhereUniqueInput
    create?: NexusGenInputs['TrumpPlayerCreateWithoutUserInput'] | null; // TrumpPlayerCreateWithoutUserInput
  }
  TrumpPlayerCreateOneWithoutUserAtTurnInput: { // input type
    connect?: NexusGenInputs['TrumpPlayerWhereUniqueInput'] | null; // TrumpPlayerWhereUniqueInput
    create?: NexusGenInputs['TrumpPlayerCreateWithoutTrumpGamesAtTurnInput'] | null; // TrumpPlayerCreateWithoutTrumpGamesAtTurnInput
  }
  TrumpPlayerCreateWithoutTrumpGamesAtTurnInput: { // input type
    id?: string | null; // ID
    trumpGames?: NexusGenInputs['TrumpGameCreateManyWithoutTrumpGamesInput'] | null; // TrumpGameCreateManyWithoutTrumpGamesInput
    trumpPacks?: NexusGenInputs['TrumpPackCreateManyWithoutTrumpPacksInput'] | null; // TrumpPackCreateManyWithoutTrumpPacksInput
    user: NexusGenInputs['UserCreateOneWithoutUserInput']; // UserCreateOneWithoutUserInput!
  }
  TrumpPlayerCreateWithoutTrumpGamesInput: { // input type
    id?: string | null; // ID
    trumpGamesAtTurn?: NexusGenInputs['TrumpGameCreateManyWithoutTrumpGamesAtTurnInput'] | null; // TrumpGameCreateManyWithoutTrumpGamesAtTurnInput
    trumpPacks?: NexusGenInputs['TrumpPackCreateManyWithoutTrumpPacksInput'] | null; // TrumpPackCreateManyWithoutTrumpPacksInput
    user: NexusGenInputs['UserCreateOneWithoutUserInput']; // UserCreateOneWithoutUserInput!
  }
  TrumpPlayerCreateWithoutUserInput: { // input type
    id?: string | null; // ID
    trumpGames?: NexusGenInputs['TrumpGameCreateManyWithoutTrumpGamesInput'] | null; // TrumpGameCreateManyWithoutTrumpGamesInput
    trumpGamesAtTurn?: NexusGenInputs['TrumpGameCreateManyWithoutTrumpGamesAtTurnInput'] | null; // TrumpGameCreateManyWithoutTrumpGamesAtTurnInput
    trumpPacks?: NexusGenInputs['TrumpPackCreateManyWithoutTrumpPacksInput'] | null; // TrumpPackCreateManyWithoutTrumpPacksInput
  }
  TrumpPlayerWhereUniqueInput: { // input type
    id?: string | null; // ID
  }
  UserCreateInput: { // input type
    email: string; // String!
    id?: string | null; // ID
    name: string; // String!
    trumpPlayer: NexusGenInputs['TrumpPlayerCreateOneWithoutTrumpPlayerInput']; // TrumpPlayerCreateOneWithoutTrumpPlayerInput!
  }
  UserCreateOneWithoutUserInput: { // input type
    connect?: NexusGenInputs['UserWhereUniqueInput'] | null; // UserWhereUniqueInput
    create?: NexusGenInputs['UserCreateWithoutTrumpPlayerInput'] | null; // UserCreateWithoutTrumpPlayerInput
  }
  UserCreateWithoutTrumpPlayerInput: { // input type
    email: string; // String!
    id?: string | null; // ID
    name: string; // String!
  }
  UserWhereUniqueInput: { // input type
    id?: string | null; // ID
  }
}

export interface NexusGenEnums {
}

export interface NexusGenRootTypes {
  Mutation: {};
  Query: {};
  TrumpAttribute: photon.TrumpAttribute;
  TrumpAttributeValue: photon.TrumpAttributeValue;
  TrumpCard: photon.TrumpCard;
  TrumpGame: photon.TrumpGame;
  TrumpPack: photon.TrumpPack;
  TrumpPlayer: photon.TrumpPlayer;
  User: photon.User;
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
  DateTime: any;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  TrumpAttributeCreateInput: NexusGenInputs['TrumpAttributeCreateInput'];
  TrumpAttributeCreateManyWithoutAttributesInput: NexusGenInputs['TrumpAttributeCreateManyWithoutAttributesInput'];
  TrumpAttributeCreateOneWithoutAttributeInput: NexusGenInputs['TrumpAttributeCreateOneWithoutAttributeInput'];
  TrumpAttributeCreateWithoutTrumpAttributeValuesInput: NexusGenInputs['TrumpAttributeCreateWithoutTrumpAttributeValuesInput'];
  TrumpAttributeCreateWithoutTrumpPackInput: NexusGenInputs['TrumpAttributeCreateWithoutTrumpPackInput'];
  TrumpAttributeValueCreateManyWithoutAttributeValuesInput: NexusGenInputs['TrumpAttributeValueCreateManyWithoutAttributeValuesInput'];
  TrumpAttributeValueCreateManyWithoutTrumpAttributeValuesInput: NexusGenInputs['TrumpAttributeValueCreateManyWithoutTrumpAttributeValuesInput'];
  TrumpAttributeValueCreateWithoutAttributeInput: NexusGenInputs['TrumpAttributeValueCreateWithoutAttributeInput'];
  TrumpAttributeValueCreateWithoutTrumpCardInput: NexusGenInputs['TrumpAttributeValueCreateWithoutTrumpCardInput'];
  TrumpAttributeValueWhereUniqueInput: NexusGenInputs['TrumpAttributeValueWhereUniqueInput'];
  TrumpAttributeWhereUniqueInput: NexusGenInputs['TrumpAttributeWhereUniqueInput'];
  TrumpCardCreateInput: NexusGenInputs['TrumpCardCreateInput'];
  TrumpCardCreateManyWithoutCardsInput: NexusGenInputs['TrumpCardCreateManyWithoutCardsInput'];
  TrumpCardCreateOneWithoutTrumpCardInput: NexusGenInputs['TrumpCardCreateOneWithoutTrumpCardInput'];
  TrumpCardCreateWithoutAttributeValuesInput: NexusGenInputs['TrumpCardCreateWithoutAttributeValuesInput'];
  TrumpCardCreateWithoutTrumpPackInput: NexusGenInputs['TrumpCardCreateWithoutTrumpPackInput'];
  TrumpCardWhereUniqueInput: NexusGenInputs['TrumpCardWhereUniqueInput'];
  TrumpGameCreateManyWithoutTrumpGamesAtTurnInput: NexusGenInputs['TrumpGameCreateManyWithoutTrumpGamesAtTurnInput'];
  TrumpGameCreateManyWithoutTrumpGamesInput: NexusGenInputs['TrumpGameCreateManyWithoutTrumpGamesInput'];
  TrumpGameCreateWithoutPackInput: NexusGenInputs['TrumpGameCreateWithoutPackInput'];
  TrumpGameCreateWithoutUserAtTurnInput: NexusGenInputs['TrumpGameCreateWithoutUserAtTurnInput'];
  TrumpGameWhereUniqueInput: NexusGenInputs['TrumpGameWhereUniqueInput'];
  TrumpPackCreateInput: NexusGenInputs['TrumpPackCreateInput'];
  TrumpPackCreateManyWithoutTrumpPacksInput: NexusGenInputs['TrumpPackCreateManyWithoutTrumpPacksInput'];
  TrumpPackCreateOneWithoutPackInput: NexusGenInputs['TrumpPackCreateOneWithoutPackInput'];
  TrumpPackCreateOneWithoutTrumpPackInput: NexusGenInputs['TrumpPackCreateOneWithoutTrumpPackInput'];
  TrumpPackCreateWithoutAttributesInput: NexusGenInputs['TrumpPackCreateWithoutAttributesInput'];
  TrumpPackCreateWithoutTrumpGamesInput: NexusGenInputs['TrumpPackCreateWithoutTrumpGamesInput'];
  TrumpPackCreateWithoutTrumpPlayerInput: NexusGenInputs['TrumpPackCreateWithoutTrumpPlayerInput'];
  TrumpPackWhereUniqueInput: NexusGenInputs['TrumpPackWhereUniqueInput'];
  TrumpPlayerCreateManyWithoutUsersInput: NexusGenInputs['TrumpPlayerCreateManyWithoutUsersInput'];
  TrumpPlayerCreateOneWithoutTrumpPlayerInput: NexusGenInputs['TrumpPlayerCreateOneWithoutTrumpPlayerInput'];
  TrumpPlayerCreateOneWithoutUserAtTurnInput: NexusGenInputs['TrumpPlayerCreateOneWithoutUserAtTurnInput'];
  TrumpPlayerCreateWithoutTrumpGamesAtTurnInput: NexusGenInputs['TrumpPlayerCreateWithoutTrumpGamesAtTurnInput'];
  TrumpPlayerCreateWithoutTrumpGamesInput: NexusGenInputs['TrumpPlayerCreateWithoutTrumpGamesInput'];
  TrumpPlayerCreateWithoutUserInput: NexusGenInputs['TrumpPlayerCreateWithoutUserInput'];
  TrumpPlayerWhereUniqueInput: NexusGenInputs['TrumpPlayerWhereUniqueInput'];
  UserCreateInput: NexusGenInputs['UserCreateInput'];
  UserCreateOneWithoutUserInput: NexusGenInputs['UserCreateOneWithoutUserInput'];
  UserCreateWithoutTrumpPlayerInput: NexusGenInputs['UserCreateWithoutTrumpPlayerInput'];
  UserWhereUniqueInput: NexusGenInputs['UserWhereUniqueInput'];
}

export interface NexusGenFieldTypes {
  Mutation: { // field return type
    createOneTrumpAttribute: NexusGenRootTypes['TrumpAttribute']; // TrumpAttribute!
    createOneTrumpCard: NexusGenRootTypes['TrumpCard']; // TrumpCard!
    createOneTrumpPack: NexusGenRootTypes['TrumpPack']; // TrumpPack!
    createOneUser: NexusGenRootTypes['User']; // User!
  }
  Query: { // field return type
    trumpPacks: NexusGenRootTypes['TrumpPack'][]; // [TrumpPack!]!
  }
  TrumpAttribute: { // field return type
    aimHigh: boolean; // Boolean!
    id: string; // ID!
    name: string; // String!
  }
  TrumpAttributeValue: { // field return type
    attribute: NexusGenRootTypes['TrumpAttribute']; // TrumpAttribute!
    id: string; // ID!
    value: number; // Float!
  }
  TrumpCard: { // field return type
    attributeValues: NexusGenRootTypes['TrumpAttributeValue'][]; // [TrumpAttributeValue!]!
    description: string | null; // String
    id: string; // ID!
    imageUrl: string | null; // String
    name: string; // String!
  }
  TrumpGame: { // field return type
    id: string; // ID!
    pack: NexusGenRootTypes['TrumpPack']; // TrumpPack!
    userAtTurn: NexusGenRootTypes['TrumpPlayer']; // TrumpPlayer!
    users: NexusGenRootTypes['TrumpPlayer'][]; // [TrumpPlayer!]!
  }
  TrumpPack: { // field return type
    attributes: NexusGenRootTypes['TrumpAttribute'][]; // [TrumpAttribute!]!
    cards: NexusGenRootTypes['TrumpCard'][]; // [TrumpCard!]!
    createdAt: any; // DateTime!
    id: string; // ID!
    name: string; // String!
    updatedAt: any; // DateTime!
  }
  TrumpPlayer: { // field return type
    id: string; // ID!
    trumpGames: NexusGenRootTypes['TrumpGame'][]; // [TrumpGame!]!
    trumpGamesAtTurn: NexusGenRootTypes['TrumpGame'][]; // [TrumpGame!]!
    trumpPacks: NexusGenRootTypes['TrumpPack'][]; // [TrumpPack!]!
    user: NexusGenRootTypes['User']; // User!
  }
  User: { // field return type
    email: string; // String!
    id: string; // ID!
    name: string; // String!
    trumpPlayer: NexusGenRootTypes['TrumpPlayer']; // TrumpPlayer!
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    createOneTrumpAttribute: { // args
      data: NexusGenInputs['TrumpAttributeCreateInput']; // TrumpAttributeCreateInput!
    }
    createOneTrumpCard: { // args
      data: NexusGenInputs['TrumpCardCreateInput']; // TrumpCardCreateInput!
    }
    createOneTrumpPack: { // args
      data: NexusGenInputs['TrumpPackCreateInput']; // TrumpPackCreateInput!
    }
    createOneUser: { // args
      data: NexusGenInputs['UserCreateInput']; // UserCreateInput!
    }
  }
  Query: {
    trumpPacks: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
  }
  TrumpCard: {
    attributeValues: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
  }
  TrumpGame: {
    users: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
  }
  TrumpPack: {
    attributes: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
    cards: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
  }
  TrumpPlayer: {
    trumpGames: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
    trumpGamesAtTurn: { // args
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

export type NexusGenObjectNames = "Mutation" | "Query" | "TrumpAttribute" | "TrumpAttributeValue" | "TrumpCard" | "TrumpGame" | "TrumpPack" | "TrumpPlayer" | "User";

export type NexusGenInputNames = "TrumpAttributeCreateInput" | "TrumpAttributeCreateManyWithoutAttributesInput" | "TrumpAttributeCreateOneWithoutAttributeInput" | "TrumpAttributeCreateWithoutTrumpAttributeValuesInput" | "TrumpAttributeCreateWithoutTrumpPackInput" | "TrumpAttributeValueCreateManyWithoutAttributeValuesInput" | "TrumpAttributeValueCreateManyWithoutTrumpAttributeValuesInput" | "TrumpAttributeValueCreateWithoutAttributeInput" | "TrumpAttributeValueCreateWithoutTrumpCardInput" | "TrumpAttributeValueWhereUniqueInput" | "TrumpAttributeWhereUniqueInput" | "TrumpCardCreateInput" | "TrumpCardCreateManyWithoutCardsInput" | "TrumpCardCreateOneWithoutTrumpCardInput" | "TrumpCardCreateWithoutAttributeValuesInput" | "TrumpCardCreateWithoutTrumpPackInput" | "TrumpCardWhereUniqueInput" | "TrumpGameCreateManyWithoutTrumpGamesAtTurnInput" | "TrumpGameCreateManyWithoutTrumpGamesInput" | "TrumpGameCreateWithoutPackInput" | "TrumpGameCreateWithoutUserAtTurnInput" | "TrumpGameWhereUniqueInput" | "TrumpPackCreateInput" | "TrumpPackCreateManyWithoutTrumpPacksInput" | "TrumpPackCreateOneWithoutPackInput" | "TrumpPackCreateOneWithoutTrumpPackInput" | "TrumpPackCreateWithoutAttributesInput" | "TrumpPackCreateWithoutTrumpGamesInput" | "TrumpPackCreateWithoutTrumpPlayerInput" | "TrumpPackWhereUniqueInput" | "TrumpPlayerCreateManyWithoutUsersInput" | "TrumpPlayerCreateOneWithoutTrumpPlayerInput" | "TrumpPlayerCreateOneWithoutUserAtTurnInput" | "TrumpPlayerCreateWithoutTrumpGamesAtTurnInput" | "TrumpPlayerCreateWithoutTrumpGamesInput" | "TrumpPlayerCreateWithoutUserInput" | "TrumpPlayerWhereUniqueInput" | "UserCreateInput" | "UserCreateOneWithoutUserInput" | "UserCreateWithoutTrumpPlayerInput" | "UserWhereUniqueInput";

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = "Boolean" | "DateTime" | "Float" | "ID" | "Int" | "String";

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