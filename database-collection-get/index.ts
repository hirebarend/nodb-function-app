import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getContainer } from "../core";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const container = await getContainer();

  const query = Object.keys(req.query)
    .filter((key: string) => !["limit"].includes(key))
    .reduce((dict, key) => {
      const value: string = req.query[key];

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
    .db(req.params.database)
    .collection(req.params.collection)
    .find(query, {
      limit: req.query.limit ? parseInt(req.query.limit) : 100,
      projection: {
        _id: 0,
      },
    })
    .toArray();

  context.res = {
    body: result,
    status: 200,
  };
};

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

export default httpTrigger;
