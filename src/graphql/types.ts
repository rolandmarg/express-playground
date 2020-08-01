import { GraphQLResolveInfo } from 'graphql';
import { UserEntity } from 'src/entity/User';
import { CalendarEventEntity } from 'src/entity/CalendarEvent';
import { IContext } from 'src/app';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};


export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  email: Scalars['String'];
  createdAt: Scalars['String'];
};

export type CalendarEvent = {
  __typename?: 'CalendarEvent';
  id: Scalars['ID'];
  title: Scalars['String'];
  startsAt: Scalars['String'];
  endsAt: Scalars['String'];
};

export type CreateCalendarEventInput = {
  title: Scalars['String'];
  startsAt: Scalars['String'];
  endsAt: Scalars['String'];
};

export type SignInInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type SignInResult = SignInPayload | SignInError;

export type SignInPayload = {
  __typename?: 'SignInPayload';
  user: User;
  token: Scalars['String'];
};

export type SignInError = {
  __typename?: 'SignInError';
  message: Scalars['String'];
};

export type CreateCalendarEventPayload = {
  __typename?: 'CreateCalendarEventPayload';
  calendarEvent?: Maybe<CalendarEvent>;
};

export type Query = {
  __typename?: 'Query';
  user?: Maybe<User>;
  users: Array<User>;
  viewer?: Maybe<User>;
  calendarEvents: Array<CalendarEvent>;
  calendarEvent?: Maybe<CalendarEvent>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryCalendarEventArgs = {
  id: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  signIn: SignInResult;
  createCalendarEvent: CreateCalendarEventPayload;
  deleteCalendarEvents?: Maybe<Scalars['Boolean']>;
};


export type MutationSignInArgs = {
  input: SignInInput;
};


export type MutationCreateCalendarEventArgs = {
  input: CreateCalendarEventInput;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  User: ResolverTypeWrapper<UserEntity>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  CalendarEvent: ResolverTypeWrapper<CalendarEventEntity>;
  CreateCalendarEventInput: CreateCalendarEventInput;
  SignInInput: SignInInput;
  SignInResult: ResolversTypes['SignInPayload'] | ResolversTypes['SignInError'];
  SignInPayload: ResolverTypeWrapper<Omit<SignInPayload, 'user'> & { user: ResolversTypes['User'] }>;
  SignInError: ResolverTypeWrapper<SignInError>;
  CreateCalendarEventPayload: ResolverTypeWrapper<Omit<CreateCalendarEventPayload, 'calendarEvent'> & { calendarEvent?: Maybe<ResolversTypes['CalendarEvent']> }>;
  Query: ResolverTypeWrapper<{}>;
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  User: UserEntity;
  ID: Scalars['ID'];
  String: Scalars['String'];
  CalendarEvent: CalendarEventEntity;
  CreateCalendarEventInput: CreateCalendarEventInput;
  SignInInput: SignInInput;
  SignInResult: ResolversParentTypes['SignInPayload'] | ResolversParentTypes['SignInError'];
  SignInPayload: Omit<SignInPayload, 'user'> & { user: ResolversParentTypes['User'] };
  SignInError: SignInError;
  CreateCalendarEventPayload: Omit<CreateCalendarEventPayload, 'calendarEvent'> & { calendarEvent?: Maybe<ResolversParentTypes['CalendarEvent']> };
  Query: {};
  Mutation: {};
  Boolean: Scalars['Boolean'];
};

export type AuthDirectiveArgs = {  };

export type AuthDirectiveResolver<Result, Parent, ContextType = IContext, Args = AuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type UserResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type CalendarEventResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['CalendarEvent'] = ResolversParentTypes['CalendarEvent']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startsAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  endsAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type SignInResultResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['SignInResult'] = ResolversParentTypes['SignInResult']> = {
  __resolveType: TypeResolveFn<'SignInPayload' | 'SignInError', ParentType, ContextType>;
};

export type SignInPayloadResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['SignInPayload'] = ResolversParentTypes['SignInPayload']> = {
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type SignInErrorResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['SignInError'] = ResolversParentTypes['SignInError']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type CreateCalendarEventPayloadResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['CreateCalendarEventPayload'] = ResolversParentTypes['CreateCalendarEventPayload']> = {
  calendarEvent?: Resolver<Maybe<ResolversTypes['CalendarEvent']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type QueryResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  viewer?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  calendarEvents?: Resolver<Array<ResolversTypes['CalendarEvent']>, ParentType, ContextType>;
  calendarEvent?: Resolver<Maybe<ResolversTypes['CalendarEvent']>, ParentType, ContextType, RequireFields<QueryCalendarEventArgs, 'id'>>;
};

export type MutationResolvers<ContextType = IContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  signIn?: Resolver<ResolversTypes['SignInResult'], ParentType, ContextType, RequireFields<MutationSignInArgs, 'input'>>;
  createCalendarEvent?: Resolver<ResolversTypes['CreateCalendarEventPayload'], ParentType, ContextType, RequireFields<MutationCreateCalendarEventArgs, 'input'>>;
  deleteCalendarEvents?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type Resolvers<ContextType = IContext> = {
  User?: UserResolvers<ContextType>;
  CalendarEvent?: CalendarEventResolvers<ContextType>;
  SignInResult?: SignInResultResolvers<ContextType>;
  SignInPayload?: SignInPayloadResolvers<ContextType>;
  SignInError?: SignInErrorResolvers<ContextType>;
  CreateCalendarEventPayload?: CreateCalendarEventPayloadResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = IContext> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = IContext> = {
  auth?: AuthDirectiveResolver<any, any, ContextType>;
};


/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<ContextType = IContext> = DirectiveResolvers<ContextType>;