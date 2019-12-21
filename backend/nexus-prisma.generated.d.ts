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
  TrumpPlayer: photon.TrumpPlayer
  TrumpGame: photon.TrumpGame
  TrumpPack: photon.TrumpPack
  Tag: photon.Tag
  TrumpCard: photon.TrumpCard
  TrumpAttribute: photon.TrumpAttribute
  TrumpAttributeValue: photon.TrumpAttributeValue
}
  
interface NexusPrismaInputs {
  Query: {
    users: {
  filtering: 'id' | 'name' | 'email' | 'AND' | 'OR' | 'NOT' | 'trumpPlayer'
  ordering: 'id' | 'name' | 'email'
}
    trumpPlayers: {
  filtering: 'id' | 'trumpPacks' | 'trumpGames' | 'trumpGamesAtTurn' | 'AND' | 'OR' | 'NOT' | 'user'
  ordering: 'id'
}
    trumpGames: {
  filtering: 'id' | 'players' | 'AND' | 'OR' | 'NOT' | 'pack' | 'playerAtTurn'
  ordering: 'id'
}
    trumpPacks: {
  filtering: 'id' | 'name' | 'description' | 'cards' | 'tags' | 'rating' | 'attributes' | 'createdAt' | 'updatedAt' | 'trumpGames' | 'AND' | 'OR' | 'NOT' | 'trumpPlayer'
  ordering: 'id' | 'name' | 'description' | 'rating' | 'createdAt' | 'updatedAt'
}
    tags: {
  filtering: 'id' | 'name' | 'AND' | 'OR' | 'NOT' | 'trumpPack'
  ordering: 'id' | 'name'
}
    trumpCards: {
  filtering: 'id' | 'name' | 'description' | 'attributeValues' | 'imageUrl' | 'AND' | 'OR' | 'NOT' | 'trumpPack'
  ordering: 'id' | 'name' | 'description' | 'imageUrl'
}
    trumpAttributes: {
  filtering: 'id' | 'name' | 'aimHigh' | 'trumpAttributeValues' | 'AND' | 'OR' | 'NOT' | 'trumpPack'
  ordering: 'id' | 'name' | 'aimHigh'
}
    trumpAttributeValues: {
  filtering: 'id' | 'value' | 'AND' | 'OR' | 'NOT' | 'attribute' | 'trumpCard'
  ordering: 'id' | 'value'
}

  },
    User: {


  },  TrumpPlayer: {
    trumpPacks: {
  filtering: 'id' | 'name' | 'description' | 'cards' | 'tags' | 'rating' | 'attributes' | 'createdAt' | 'updatedAt' | 'trumpGames' | 'AND' | 'OR' | 'NOT' | 'trumpPlayer'
  ordering: 'id' | 'name' | 'description' | 'rating' | 'createdAt' | 'updatedAt'
}
    trumpGames: {
  filtering: 'id' | 'players' | 'AND' | 'OR' | 'NOT' | 'pack' | 'playerAtTurn'
  ordering: 'id'
}
    trumpGamesAtTurn: {
  filtering: 'id' | 'players' | 'AND' | 'OR' | 'NOT' | 'pack' | 'playerAtTurn'
  ordering: 'id'
}

  },  TrumpGame: {
    players: {
  filtering: 'id' | 'trumpPacks' | 'trumpGames' | 'trumpGamesAtTurn' | 'AND' | 'OR' | 'NOT' | 'user'
  ordering: 'id'
}

  },  TrumpPack: {
    cards: {
  filtering: 'id' | 'name' | 'description' | 'attributeValues' | 'imageUrl' | 'AND' | 'OR' | 'NOT' | 'trumpPack'
  ordering: 'id' | 'name' | 'description' | 'imageUrl'
}
    tags: {
  filtering: 'id' | 'name' | 'AND' | 'OR' | 'NOT' | 'trumpPack'
  ordering: 'id' | 'name'
}
    attributes: {
  filtering: 'id' | 'name' | 'aimHigh' | 'trumpAttributeValues' | 'AND' | 'OR' | 'NOT' | 'trumpPack'
  ordering: 'id' | 'name' | 'aimHigh'
}
    trumpGames: {
  filtering: 'id' | 'players' | 'AND' | 'OR' | 'NOT' | 'pack' | 'playerAtTurn'
  ordering: 'id'
}

  },  Tag: {


  },  TrumpCard: {
    attributeValues: {
  filtering: 'id' | 'value' | 'AND' | 'OR' | 'NOT' | 'attribute' | 'trumpCard'
  ordering: 'id' | 'value'
}

  },  TrumpAttribute: {
    trumpAttributeValues: {
  filtering: 'id' | 'value' | 'AND' | 'OR' | 'NOT' | 'attribute' | 'trumpCard'
  ordering: 'id' | 'value'
}

  },  TrumpAttributeValue: {


  }
}

interface NexusPrismaTypes {
  Query: {
    user: 'User'
    users: 'User'
    trumpPlayer: 'TrumpPlayer'
    trumpPlayers: 'TrumpPlayer'
    trumpGame: 'TrumpGame'
    trumpGames: 'TrumpGame'
    trumpPack: 'TrumpPack'
    trumpPacks: 'TrumpPack'
    tag: 'Tag'
    tags: 'Tag'
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
    createOneTrumpPlayer: 'TrumpPlayer'
    updateOneTrumpPlayer: 'TrumpPlayer'
    updateManyTrumpPlayer: 'BatchPayload'
    deleteOneTrumpPlayer: 'TrumpPlayer'
    deleteManyTrumpPlayer: 'BatchPayload'
    upsertOneTrumpPlayer: 'TrumpPlayer'
    createOneTrumpGame: 'TrumpGame'
    updateOneTrumpGame: 'TrumpGame'
    updateManyTrumpGame: 'BatchPayload'
    deleteOneTrumpGame: 'TrumpGame'
    deleteManyTrumpGame: 'BatchPayload'
    upsertOneTrumpGame: 'TrumpGame'
    createOneTrumpPack: 'TrumpPack'
    updateOneTrumpPack: 'TrumpPack'
    updateManyTrumpPack: 'BatchPayload'
    deleteOneTrumpPack: 'TrumpPack'
    deleteManyTrumpPack: 'BatchPayload'
    upsertOneTrumpPack: 'TrumpPack'
    createOneTag: 'Tag'
    updateOneTag: 'Tag'
    updateManyTag: 'BatchPayload'
    deleteOneTag: 'Tag'
    deleteManyTag: 'BatchPayload'
    upsertOneTag: 'Tag'
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
    name: 'String'
    email: 'String'
    trumpPlayer: 'TrumpPlayer'

},  TrumpPlayer: {
    id: 'String'
    user: 'User'
    trumpPacks: 'TrumpPack'
    trumpGames: 'TrumpGame'
    trumpGamesAtTurn: 'TrumpGame'

},  TrumpGame: {
    id: 'String'
    players: 'TrumpPlayer'
    pack: 'TrumpPack'
    playerAtTurn: 'TrumpPlayer'

},  TrumpPack: {
    id: 'String'
    name: 'String'
    description: 'String'
    cards: 'TrumpCard'
    tags: 'Tag'
    rating: 'Float'
    attributes: 'TrumpAttribute'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    trumpPlayer: 'TrumpPlayer'
    trumpGames: 'TrumpGame'

},  Tag: {
    id: 'String'
    name: 'String'
    trumpPack: 'TrumpPack'

},  TrumpCard: {
    id: 'String'
    name: 'String'
    description: 'String'
    attributeValues: 'TrumpAttributeValue'
    imageUrl: 'String'
    trumpPack: 'TrumpPack'

},  TrumpAttribute: {
    id: 'String'
    name: 'String'
    aimHigh: 'Boolean'
    trumpPack: 'TrumpPack'
    trumpAttributeValues: 'TrumpAttributeValue'

},  TrumpAttributeValue: {
    id: 'String'
    attribute: 'TrumpAttribute'
    value: 'Float'
    trumpCard: 'TrumpCard'

}
}

interface NexusPrismaMethods {
  User: NexusPrismaFields<'User'>
  TrumpPlayer: NexusPrismaFields<'TrumpPlayer'>
  TrumpGame: NexusPrismaFields<'TrumpGame'>
  TrumpPack: NexusPrismaFields<'TrumpPack'>
  Tag: NexusPrismaFields<'Tag'>
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
  