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

  await container.mongoClient
    .db(request.params.database)
    .collection<any>(request.params.collection)
    .insertOne(request.body);

  return { body: request.body };
}

app.http("databaseCollectionPost", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: httpTrigger1,
  route: "v1/{database}/{collection}",
});
