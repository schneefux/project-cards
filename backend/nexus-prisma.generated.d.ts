import * as photon from '@prisma/photon';
import { core } from 'nexus';
// Types helpers
  type IsModelNameExistsInGraphQLTypes<
  ReturnType extends any
> = ReturnType extends core.GetGen<'objectNames'> ? true : false;

type NexusPrismaScalarOpts = {
  alias?: string;
};

type Pagination = {
  first?: boolean;
  last?: boolean;
  before?: boolean;
  after?: boolean;
  skip?: boolean;
};

type RootObjectTypes = Pick<
  core.GetGen<'rootTypes'>,
  core.GetGen<'objectNames'>
>;

/**
 * Determine if `B` is a subset (or equivalent to) of `A`.
*/
type IsSubset<A, B> = keyof A extends never
  ? false
  : B extends A
  ? true
  : false;

type OmitByValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]: T[Key] extends ValueType ? never : Key }[keyof T]
>;

type GetSubsetTypes<ModelName extends any> = keyof OmitByValue<
  {
    [P in keyof RootObjectTypes]: ModelName extends keyof ModelTypes
      ? IsSubset<RootObjectTypes[P], ModelTypes[ModelName]> extends true
        ? RootObjectTypes[P]
        : never
      : never;
  },
  never
>;

type SubsetTypes<ModelName extends any> = GetSubsetTypes<
  ModelName
> extends never
  ? `ERROR: No subset types are available. Please make sure that one of your GraphQL type is a subset of your t.model('<ModelName>')`
  : GetSubsetTypes<ModelName>;

type DynamicRequiredType<ReturnType extends any> = IsModelNameExistsInGraphQLTypes<
  ReturnType
> extends true
  ? { type?: SubsetTypes<ReturnType> }
  : { type: SubsetTypes<ReturnType> };

type GetNexusPrismaInput<
  ModelName extends any,
  MethodName extends any,
  InputName extends 'filtering' | 'ordering'
> = ModelName extends keyof NexusPrismaInputs
  ? MethodName extends keyof NexusPrismaInputs[ModelName]
    ? NexusPrismaInputs[ModelName][MethodName][InputName]
    : never
  : never;

type NexusPrismaRelationOpts<
  ModelName extends any,
  MethodName extends any,
  ReturnType extends any
> = GetNexusPrismaInput<
  // If GetNexusPrismaInput returns never, it means there are no filtering/ordering args for it. So just use `alias` and `type`
  ModelName,
  MethodName,
  'filtering'
> extends never
  ? {
      alias?: string;
    } & DynamicRequiredType<ReturnType>
  : {
      alias?: string;
      filtering?:
        | boolean
        | Partial<
            Record<
              GetNexusPrismaInput<ModelName, MethodName, 'filtering'>,
              boolean
            >
          >;
      ordering?:
        | boolean
        | Partial<
            Record<
              GetNexusPrismaInput<ModelName, MethodName, 'ordering'>,
              boolean
            >
          >;
      pagination?: boolean | Pagination;
    } & DynamicRequiredType<ReturnType>;

type IsScalar<TypeName extends any> = TypeName extends core.GetGen<'scalarNames'>
  ? true
  : false;

type IsObject<Name extends any> = Name extends core.GetGen<'objectNames'>
  ? true
  : false

type IsEnum<Name extends any> = Name extends core.GetGen<'enumNames'>
  ? true
  : false

type IsInputObject<Name extends any> = Name extends core.GetGen<'inputNames'>
  ? true
  : false

/**
 * The kind that a GraphQL type may be.
 */
type Kind = 'Enum' | 'Object' | 'Scalar' | 'InputObject'

/**
 * Helper to safely reference a Kind type. For example instead of the following
 * which would admit a typo:
 *
 * ```ts
 * type Foo = Bar extends 'scalar' ? ...
 * ```
 *
 * You can do this which guarantees a correct reference:
 *
 * ```ts
 * type Foo = Bar extends AKind<'Scalar'> ? ...
 * ```
 *
 */
type AKind<T extends Kind> = T

type GetKind<Name extends any> = IsEnum<Name> extends true
  ? 'Enum'
  : IsScalar<Name> extends true
  ? 'Scalar'
  : IsObject<Name> extends true
  ? 'Object'
  : IsInputObject<Name> extends true
  ? 'InputObject'
  // FIXME should be `never`, but GQL objects named differently
  // than backing type fall into this branch
  : 'Object'

type NexusPrismaFields<ModelName extends keyof NexusPrismaTypes> = {
  [MethodName in keyof NexusPrismaTypes[ModelName]]: NexusPrismaMethod<
    ModelName,
    MethodName,
    GetKind<NexusPrismaTypes[ModelName][MethodName]> // Is the return type a scalar?
  >;
};

type NexusPrismaMethod<
  ModelName extends keyof NexusPrismaTypes,
  MethodName extends keyof NexusPrismaTypes[ModelName],
  ThisKind extends Kind,
  ReturnType extends any = NexusPrismaTypes[ModelName][MethodName]
> =
  ThisKind extends AKind<'Enum'>
  ? () => NexusPrismaFields<ModelName>
  : ThisKind extends AKind<'Scalar'>
  ? (opts?: NexusPrismaScalarOpts) => NexusPrismaFields<ModelName> // Return optional scalar opts
  : IsModelNameExistsInGraphQLTypes<ReturnType> extends true // If model name has a mapped graphql types
  ? (
      opts?: NexusPrismaRelationOpts<ModelName, MethodName, ReturnType>
    ) => NexusPrismaFields<ModelName> // Then make opts optional
  : (
      opts: NexusPrismaRelationOpts<ModelName, MethodName, ReturnType>
    ) => NexusPrismaFields<ModelName>; // Else force use input the related graphql type -> { type: '...' }

type GetNexusPrismaMethod<
  TypeName extends string
> = TypeName extends keyof NexusPrismaMethods
  ? NexusPrismaMethods[TypeName]
  : <CustomTypeName extends keyof ModelTypes>(
      typeName: CustomTypeName
    ) => NexusPrismaMethods[CustomTypeName];

type GetNexusPrisma<
  TypeName extends string,
  ModelOrCrud extends 'model' | 'crud'
> = ModelOrCrud extends 'model'
  ? TypeName extends 'Mutation'
    ? never
    : TypeName extends 'Query'
    ? never
    : GetNexusPrismaMethod<TypeName>
  : ModelOrCrud extends 'crud'
  ? TypeName extends 'Mutation'
    ? GetNexusPrismaMethod<TypeName>
    : TypeName extends 'Query'
    ? GetNexusPrismaMethod<TypeName>
    : never
  : never;
  

// Generated
interface ModelTypes {
  User: photon.User
  Game: photon.Game
  GamePile: photon.GamePile
  GameHand: photon.GameHand
  TrumpPack: photon.TrumpPack
  TrumpCard: photon.TrumpCard
  TrumpAttribute: photon.TrumpAttribute
  TrumpAttributeValue: photon.TrumpAttributeValue
}
  
interface NexusPrismaInputs {
  Query: {
    users: {
  filtering: 'id' | 'email' | 'password' | 'name' | 'trumpPacks' | 'gameHands' | 'AND' | 'OR' | 'NOT'
  ordering: 'id' | 'email' | 'password' | 'name'
}
    games: {
  filtering: 'id' | 'piles' | 'hands' | 'AND' | 'OR' | 'NOT' | 'pack'
  ordering: 'id'
}
    gamePiles: {
  filtering: 'id' | 'cards' | 'name' | 'AND' | 'OR' | 'NOT' | 'game'
  ordering: 'id' | 'name'
}
    gameHands: {
  filtering: 'id' | 'score' | 'cards' | 'atTurn' | 'AND' | 'OR' | 'NOT' | 'game' | 'player'
  ordering: 'id' | 'score' | 'atTurn'
}
    trumpPacks: {
  filtering: 'id' | 'name' | 'description' | 'cards' | 'attributes' | 'createdAt' | 'updatedAt' | 'games' | 'AND' | 'OR' | 'NOT' | 'author'
  ordering: 'id' | 'name' | 'description' | 'createdAt' | 'updatedAt'
}
    trumpCards: {
  filtering: 'id' | 'name' | 'description' | 'attributeValues' | 'imageUrl' | 'AND' | 'OR' | 'NOT' | 'pack' | 'gamePile' | 'gameHand'
  ordering: 'id' | 'name' | 'description' | 'imageUrl'
}
    trumpAttributes: {
  filtering: 'id' | 'name' | 'aimHigh' | 'trumpAttributeValues' | 'AND' | 'OR' | 'NOT' | 'pack'
  ordering: 'id' | 'name' | 'aimHigh'
}
    trumpAttributeValues: {
  filtering: 'id' | 'value' | 'AND' | 'OR' | 'NOT' | 'card' | 'attribute'
  ordering: 'id' | 'value'
}

  },
    User: {
    trumpPacks: {
  filtering: 'id' | 'name' | 'description' | 'cards' | 'attributes' | 'createdAt' | 'updatedAt' | 'games' | 'AND' | 'OR' | 'NOT' | 'author'
  ordering: 'id' | 'name' | 'description' | 'createdAt' | 'updatedAt'
}
    gameHands: {
  filtering: 'id' | 'score' | 'cards' | 'atTurn' | 'AND' | 'OR' | 'NOT' | 'game' | 'player'
  ordering: 'id' | 'score' | 'atTurn'
}

  },  Game: {
    piles: {
  filtering: 'id' | 'cards' | 'name' | 'AND' | 'OR' | 'NOT' | 'game'
  ordering: 'id' | 'name'
}
    hands: {
  filtering: 'id' | 'score' | 'cards' | 'atTurn' | 'AND' | 'OR' | 'NOT' | 'game' | 'player'
  ordering: 'id' | 'score' | 'atTurn'
}

  },  GamePile: {
    cards: {
  filtering: 'id' | 'name' | 'description' | 'attributeValues' | 'imageUrl' | 'AND' | 'OR' | 'NOT' | 'pack' | 'gamePile' | 'gameHand'
  ordering: 'id' | 'name' | 'description' | 'imageUrl'
}

  },  GameHand: {
    cards: {
  filtering: 'id' | 'name' | 'description' | 'attributeValues' | 'imageUrl' | 'AND' | 'OR' | 'NOT' | 'pack' | 'gamePile' | 'gameHand'
  ordering: 'id' | 'name' | 'description' | 'imageUrl'
}

  },  TrumpPack: {
    cards: {
  filtering: 'id' | 'name' | 'description' | 'attributeValues' | 'imageUrl' | 'AND' | 'OR' | 'NOT' | 'pack' | 'gamePile' | 'gameHand'
  ordering: 'id' | 'name' | 'description' | 'imageUrl'
}
    attributes: {
  filtering: 'id' | 'name' | 'aimHigh' | 'trumpAttributeValues' | 'AND' | 'OR' | 'NOT' | 'pack'
  ordering: 'id' | 'name' | 'aimHigh'
}
    games: {
  filtering: 'id' | 'piles' | 'hands' | 'AND' | 'OR' | 'NOT' | 'pack'
  ordering: 'id'
}

  },  TrumpCard: {
    attributeValues: {
  filtering: 'id' | 'value' | 'AND' | 'OR' | 'NOT' | 'card' | 'attribute'
  ordering: 'id' | 'value'
}

  },  TrumpAttribute: {
    trumpAttributeValues: {
  filtering: 'id' | 'value' | 'AND' | 'OR' | 'NOT' | 'card' | 'attribute'
  ordering: 'id' | 'value'
}

  },  TrumpAttributeValue: {


  }
}

interface NexusPrismaTypes {
  Query: {
    user: 'User'
    users: 'User'
    game: 'Game'
    games: 'Game'
    gamePile: 'GamePile'
    gamePiles: 'GamePile'
    gameHand: 'GameHand'
    gameHands: 'GameHand'
    trumpPack: 'TrumpPack'
    trumpPacks: 'TrumpPack'
    trumpCard: 'TrumpCard'
    trumpCards: 'TrumpCard'
    trumpAttribute: 'TrumpAttribute'
    trumpAttributes: 'TrumpAttribute'
    trumpAttributeValue: 'TrumpAttributeValue'
    trumpAttributeValues: 'TrumpAttributeValue'

  },
  Mutation: {
    createOneUser: 'User'
    updateOneUser: 'User'
    updateManyUser: 'BatchPayload'
    deleteOneUser: 'User'
    deleteManyUser: 'BatchPayload'
    upsertOneUser: 'User'
    createOneGame: 'Game'
    updateOneGame: 'Game'
    updateManyGame: 'BatchPayload'
    deleteOneGame: 'Game'
    deleteManyGame: 'BatchPayload'
    upsertOneGame: 'Game'
    createOneGamePile: 'GamePile'
    updateOneGamePile: 'GamePile'
    updateManyGamePile: 'BatchPayload'
    deleteOneGamePile: 'GamePile'
    deleteManyGamePile: 'BatchPayload'
    upsertOneGamePile: 'GamePile'
    createOneGameHand: 'GameHand'
    updateOneGameHand: 'GameHand'
    updateManyGameHand: 'BatchPayload'
    deleteOneGameHand: 'GameHand'
    deleteManyGameHand: 'BatchPayload'
    upsertOneGameHand: 'GameHand'
    createOneTrumpPack: 'TrumpPack'
    updateOneTrumpPack: 'TrumpPack'
    updateManyTrumpPack: 'BatchPayload'
    deleteOneTrumpPack: 'TrumpPack'
    deleteManyTrumpPack: 'BatchPayload'
    upsertOneTrumpPack: 'TrumpPack'
    createOneTrumpCard: 'TrumpCard'
    updateOneTrumpCard: 'TrumpCard'
    updateManyTrumpCard: 'BatchPayload'
    deleteOneTrumpCard: 'TrumpCard'
    deleteManyTrumpCard: 'BatchPayload'
    upsertOneTrumpCard: 'TrumpCard'
    createOneTrumpAttribute: 'TrumpAttribute'
    updateOneTrumpAttribute: 'TrumpAttribute'
    updateManyTrumpAttribute: 'BatchPayload'
    deleteOneTrumpAttribute: 'TrumpAttribute'
    deleteManyTrumpAttribute: 'BatchPayload'
    upsertOneTrumpAttribute: 'TrumpAttribute'
    createOneTrumpAttributeValue: 'TrumpAttributeValue'
    updateOneTrumpAttributeValue: 'TrumpAttributeValue'
    updateManyTrumpAttributeValue: 'BatchPayload'
    deleteOneTrumpAttributeValue: 'TrumpAttributeValue'
    deleteManyTrumpAttributeValue: 'BatchPayload'
    upsertOneTrumpAttributeValue: 'TrumpAttributeValue'

  },
  User: {
    id: 'String'
    email: 'String'
    password: 'String'
    name: 'String'
    trumpPacks: 'TrumpPack'
    gameHands: 'GameHand'

},  Game: {
    id: 'String'
    pack: 'TrumpPack'
    piles: 'GamePile'
    hands: 'GameHand'

},  GamePile: {
    id: 'String'
    game: 'Game'
    cards: 'TrumpCard'
    name: 'String'

},  GameHand: {
    id: 'String'
    game: 'Game'
    player: 'User'
    score: 'Int'
    cards: 'TrumpCard'
    atTurn: 'Boolean'

},  TrumpPack: {
    id: 'String'
    name: 'String'
    author: 'User'
    description: 'String'
    cards: 'TrumpCard'
    attributes: 'TrumpAttribute'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    games: 'Game'

},  TrumpCard: {
    id: 'String'
    name: 'String'
    pack: 'TrumpPack'
    description: 'String'
    attributeValues: 'TrumpAttributeValue'
    imageUrl: 'String'
    gamePile: 'GamePile'
    gameHand: 'GameHand'

},  TrumpAttribute: {
    id: 'String'
    pack: 'TrumpPack'
    name: 'String'
    aimHigh: 'Boolean'
    trumpAttributeValues: 'TrumpAttributeValue'

},  TrumpAttributeValue: {
    id: 'String'
    card: 'TrumpCard'
    attribute: 'TrumpAttribute'
    value: 'Float'

}
}

interface NexusPrismaMethods {
  User: NexusPrismaFields<'User'>
  Game: NexusPrismaFields<'Game'>
  GamePile: NexusPrismaFields<'GamePile'>
  GameHand: NexusPrismaFields<'GameHand'>
  TrumpPack: NexusPrismaFields<'TrumpPack'>
  TrumpCard: NexusPrismaFields<'TrumpCard'>
  TrumpAttribute: NexusPrismaFields<'TrumpAttribute'>
  TrumpAttributeValue: NexusPrismaFields<'TrumpAttributeValue'>
  Query: NexusPrismaFields<'Query'>
  Mutation: NexusPrismaFields<'Mutation'>
}
  

declare global {
  type NexusPrisma<
    TypeName extends string,
    ModelOrCrud extends 'model' | 'crud'
  > = GetNexusPrisma<TypeName, ModelOrCrud>;
}
  