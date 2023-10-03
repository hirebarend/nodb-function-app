import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { getContainer } from "../core";

function convertQueryParameter(value: string): any {
  if (value === "null") {
    return null;
  }

  if (value === "true" || value === "false") {
    return value === "true" ? true : value === "false" ? false : false;
  }

  if (value.match(/^\d+$/)) {
    return parseFloat(value);
  }

  return value;
}

export async function httpTrigger1(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const container = await getContainer();

  const query = Object.keys(request.query)
    .filter((key: string) => !["limit"].includes(key))
    .reduce((dict, key) => {
      const value: string = request.query[key];

      if (key.endsWith("[]")) {
        dict[key.substring(0, key.length - 2)] = {
          $in: value.split(",").map((y) => convertQueryParameter(y)),
        };

        return dict;
      }

      dict[key] = convertQueryParameter(value as string);

      return dict;
    }, {});

  const result: Array<any> = await container.mongoClient
    .db(request.params.database)
    .collection<any>(request.params.collection)
    .find(query, {
      limit: request.query.get("limit")
        ? parseInt(request.query.get("limit"))
        : 100,
      projection: {
        _id: 0,
      },
    })
    .toArray();

  return { body: result };
}

app.http("databaseCollectionGet", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: httpTrigger1,
  route: "v1/{database}/{collection}",
});
