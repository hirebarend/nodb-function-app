import * as MongoDb from "mongodb";

export type Container = {
  mongoClient: MongoDb.MongoClient;
};

let container: Container = null;

export async function getContainer() {
  if (container) {
    return container;
  }

  const mongoClient = await MongoDb.MongoClient.connect(
    process.env.MONGODB_CONNECTION_STRING
  );

  container = {
    mongoClient,
  };

  return container;
}
