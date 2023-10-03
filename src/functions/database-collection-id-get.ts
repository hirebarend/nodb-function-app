import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { getContainer } from "../core";

export async function httpTrigger1(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const container = await getContainer();

  const result = await container.mongoClient
    .db(request.params.database)
    .collection<any>(request.params.collection)
    .findOne({
      id: request.params.id,
    });

  return { body: result };
}

app.http("databaseCollectionIdGet", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: httpTrigger1,
  route: "v1/{database}/{collection}/{id}",
});
