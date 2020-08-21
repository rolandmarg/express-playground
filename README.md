# express-playground

built with express, typescript, graphql, postgres(pg-promise).

oauth2 by passport library, battle tested auth middleware for express.

For stateless sessions(client-stored tokens) I'm using @hapi/iron, encrypted, signed & sealed tokens are sent through cookies(auth bearer header option present too for mobile api)

authentication works in graphql too, with @auth schema directive implemented

orm with typeorm, feature rich & plays nicely with typescript. After some time I decided that typeorm offers unnecessary abstractions. its slow, error prone and just makes me forget how to write actual sql. Instead I swapped it with pg-promise, amazing library with amazing author, whose dedication to its creation is well known in the communicity(I'm updating this part of library because he just commited to my repo, fixing my bug). What I love the most about pg-promise is that It's one of the libraries where creator gets the abstractions right, what should be done by library and what should be done by user. Kudos to @vitaly-t!

graphql api provided with apollo-graphql server, which plays nicely with its client counterpart, offers caching/batching, persistent queries and prevents csrf by allowing mutations only through POST. Also includes testing, metrics, health checks, federation and so on.

pagination in graphql is cursor based and Relay specification compliant.In postgres I'm using keyset pagination, fast, consistent and utilizes indices so does not have to traverse through N rows.

e2e, integration, unit & snapshot tests and coverage by jest. May add property based testing(fuzz testing) in the future, with fast-check library. But not fond of specifying data models in graphql, typeorm, tests(if I add fuzz testing) separately. Also, amazing 'graphql-code-generator' generates types from my graphql schema, so I my resolvers are type checked automatically.
