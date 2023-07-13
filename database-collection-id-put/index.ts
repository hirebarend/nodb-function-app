import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getContainer } from "../core";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const container = await getContainer();

  await container.mongoClient
    .db(req.params.database)
    .collection(req.params.collection)
    .updateOne(
      {
        id: req.params.id,
      },
      {
        $set: {
          ...req.body,
        },
      }
    );

  context.res = {
    body: req.body,
    status: 200,
  };
};

export default httpTrigger;
