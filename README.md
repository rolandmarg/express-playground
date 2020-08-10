# express-playground

built with express, typescript, graphql, postgres.

oauth2 by passport library, battle tested auth middleware for express.

For stateless sessions(client-stored tokens) I'm using @hapi/iron, encrypted, signed & sealed tokens are sent through cookies(auth bearer header option present too for mobile api)

authentication works in graphql too, with @auth schema directive implemented

orm with typeorm, feature rich & plays nicely with typescript

graphql api provided with apollo-graphql server, which plays nicely with its client counterpart, offers caching/batching, persistent queries and prevents csrf by allowing mutations only through POST. Also includes testing, metrics, health checks, federation and so on. For type checking support using type-graphql.

pagination in graphql is cursor based and Relay specification compliant.In postgres I'm using keyset pagination, fast, consistent and utilizes indices so does not have to traverse through N rows.

e2e, integration, unit & snapshot tests and coverage by jest.
