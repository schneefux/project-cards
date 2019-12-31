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
  GameHandPile: photon.GameHandPile
  TrumpPack: photon.TrumpPack
  GamePileCard: photon.GamePileCard
  TrumpCard: photon.TrumpCard
  TrumpAttribute: photon.TrumpAttribute
  TrumpAttributeValue: photon.TrumpAttributeValue
}
  
interface NexusPrismaInputs {
  Query: {
    users: {
  filtering: 'id' | 'subscriptionTier' | 'email' | 'password' | 'name' | 'trumpPacks' | 'gameHands' | 'AND' | 'OR' | 'NOT'
  ordering: 'id' | 'subscriptionTier' | 'email' | 'password' | 'name'
}
    games: {
  filtering: 'id' | 'piles' | 'hands' | 'state' | 'AND' | 'OR' | 'NOT' | 'pack'
  ordering: 'id' | 'state'
}
    gamePiles: {
  filtering: 'id' | 'pileCards' | 'name' | 'AND' | 'OR' | 'NOT' | 'game'
  ordering: 'id' | 'name'
}
    gameHands: {
  filtering: 'id' | 'score' | 'piles' | 'atTurn' | 'AND' | 'OR' | 'NOT' | 'game' | 'player'
  ordering: 'id' | 'score' | 'atTurn'
}
    gameHandPiles: {
  filtering: 'id' | 'pileCards' | 'name' | 'AND' | 'OR' | 'NOT' | 'hand'
  ordering: 'id' | 'name'
}
    trumpPacks: {
  filtering: 'id' | 'name' | 'description' | 'cards' | 'attributes' | 'createdAt' | 'updatedAt' | 'games' | 'AND' | 'OR' | 'NOT' | 'author'
  ordering: 'id' | 'name' | 'description' | 'createdAt' | 'updatedAt'
}
    gamePileCards: {
  filtering: 'id' | 'index' | 'piles' | 'handPiles' | 'AND' | 'OR' | 'NOT' | 'card'
  ordering: 'id' | 'index'
}
    trumpCards: {
  filtering: 'id' | 'name' | 'description' | 'attributeValues' | 'imageUrl' | 'pileCards' | 'AND' | 'OR' | 'NOT' | 'pack'
  ordering: 'id' | 'name' | 'description' | 'imageUrl'
}
    trumpAttributes: {
  filtering: 'id' | 'name' | 'unit' | 'aimHigh' | 'trumpAttributeValues' | 'AND' | 'OR' | 'NOT' | 'pack'
  ordering: 'id' | 'name' | 'unit' | 'aimHigh'
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
  filtering: 'id' | 'score' | 'piles' | 'atTurn' | 'AND' | 'OR' | 'NOT' | 'game' | 'player'
  ordering: 'id' | 'score' | 'atTurn'
}

  },  Game: {
    piles: {
  filtering: 'id' | 'pileCards' | 'name' | 'AND' | 'OR' | 'NOT' | 'game'
  ordering: 'id' | 'name'
}
    hands: {
  filtering: 'id' | 'score' | 'piles' | 'atTurn' | 'AND' | 'OR' | 'NOT' | 'game' | 'player'
  ordering: 'id' | 'score' | 'atTurn'
}

  },  GamePile: {
    pileCards: {
  filtering: 'id' | 'index' | 'piles' | 'handPiles' | 'AND' | 'OR' | 'NOT' | 'card'
  ordering: 'id' | 'index'
}

  },  GameHand: {
    piles: {
  filtering: 'id' | 'pileCards' | 'name' | 'AND' | 'OR' | 'NOT' | 'hand'
  ordering: 'id' | 'name'
}

  },  GameHandPile: {
    pileCards: {
  filtering: 'id' | 'index' | 'piles' | 'handPiles' | 'AND' | 'OR' | 'NOT' | 'card'
  ordering: 'id' | 'index'
}

  },  TrumpPack: {
    cards: {
  filtering: 'id' | 'name' | 'description' | 'attributeValues' | 'imageUrl' | 'pileCards' | 'AND' | 'OR' | 'NOT' | 'pack'
  ordering: 'id' | 'name' | 'description' | 'imageUrl'
}
    attributes: {
  filtering: 'id' | 'name' | 'unit' | 'aimHigh' | 'trumpAttributeValues' | 'AND' | 'OR' | 'NOT' | 'pack'
  ordering: 'id' | 'name' | 'unit' | 'aimHigh'
}
    games: {
  filtering: 'id' | 'piles' | 'hands' | 'state' | 'AND' | 'OR' | 'NOT' | 'pack'
  ordering: 'id' | 'state'
}

  },  GamePileCard: {
    piles: {
  filtering: 'id' | 'pileCards' | 'name' | 'AND' | 'OR' | 'NOT' | 'game'
  ordering: 'id' | 'name'
}
    handPiles: {
  filtering: 'id' | 'pileCards' | 'name' | 'AND' | 'OR' | 'NOT' | 'hand'
  ordering: 'id' | 'name'
}

  },  TrumpCard: {
    attributeValues: {
  filtering: 'id' | 'value' | 'AND' | 'OR' | 'NOT' | 'card' | 'attribute'
  ordering: 'id' | 'value'
}
    pileCards: {
  filtering: 'id' | 'index' | 'piles' | 'handPiles' | 'AND' | 'OR' | 'NOT' | 'card'
  ordering: 'id' | 'index'
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
    gameHandPile: 'GameHandPile'
    gameHandPiles: 'GameHandPile'
    trumpPack: 'TrumpPack'
    trumpPacks: 'TrumpPack'
    gamePileCard: 'GamePileCard'
    gamePileCards: 'GamePileCard'
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
    createOneGameHandPile: 'GameHandPile'
    updateOneGameHandPile: 'GameHandPile'
    updateManyGameHandPile: 'BatchPayload'
    deleteOneGameHandPile: 'GameHandPile'
    deleteManyGameHandPile: 'BatchPayload'
    upsertOneGameHandPile: 'GameHandPile'
    createOneTrumpPack: 'TrumpPack'
    updateOneTrumpPack: 'TrumpPack'
    updateManyTrumpPack: 'BatchPayload'
    deleteOneTrumpPack: 'TrumpPack'
    deleteManyTrumpPack: 'BatchPayload'
    upsertOneTrumpPack: 'TrumpPack'
    createOneGamePileCard: 'GamePileCard'
    updateOneGamePileCard: 'GamePileCard'
    updateManyGamePileCard: 'BatchPayload'
    deleteOneGamePileCard: 'GamePileCard'
    deleteManyGamePileCard: 'BatchPayload'
    upsertOneGamePileCard: 'GamePileCard'
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
    subscriptionTier: 'SubscriptionTier'
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
    state: 'GameState'

},  GamePile: {
    id: 'String'
    game: 'Game'
    pileCards: 'GamePileCard'
    name: 'String'

},  GameHand: {
    id: 'String'
    game: 'Game'
    player: 'User'
    score: 'Int'
    piles: 'GameHandPile'
    atTurn: 'Boolean'

},  GameHandPile: {
    id: 'String'
    hand: 'GameHand'
    pileCards: 'GamePileCard'
    name: 'String'

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

},  GamePileCard: {
    id: 'String'
    index: 'Int'
    card: 'TrumpCard'
    piles: 'GamePile'
    handPiles: 'GameHandPile'

},  TrumpCard: {
    id: 'String'
    name: 'String'
    pack: 'TrumpPack'
    description: 'String'
    attributeValues: 'TrumpAttributeValue'
    imageUrl: 'String'
    pileCards: 'GamePileCard'

},  TrumpAttribute: {
    id: 'String'
    pack: 'TrumpPack'
    name: 'String'
    unit: 'String'
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
  GameHandPile: NexusPrismaFields<'GameHandPile'>
  TrumpPack: NexusPrismaFields<'TrumpPack'>
  GamePileCard: NexusPrismaFields<'GamePileCard'>
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
  