# Prisma
A module for generating Prisma clients for other components.

## Useful command
0. install prisma libraries by running `npm i` in the root dir
1. To generate prisma clients only
    ```bash
    # run in the root dir
    make gen-db
    ```
2. To generate prisma clients and create relevant schema in db
    ```bash
    # run in the root dir
    make init-db
    ```

## Adding Models
Define new models in [prisma/schema.prisma](prisma/schema.prisma). See the [Prisma documentation](https://www.prisma.io/docs/orm/prisma-schema/data-model) for detailed guidance.

## To Add More Module Support
In case there might be more micro services sharing the same schema, we can output the schema to other services by the configuration in [prisma/schema.prisma](prisma/schema.prisma)

```
generator {YourServiceName} {
  provider = "prisma-client-js"
  output   = "../{service_folder}/generated/prisma"
}
```